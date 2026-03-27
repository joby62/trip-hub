from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import HTTPRedirectHandler, Request, build_opener, urlopen


ROOT_DIR = Path(__file__).resolve().parents[2]
GUIDE_ROUTE = "/guides/yunnan"
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8001
DEFAULT_ARTIFACT_DIR = Path("/tmp/trip-hub-qa")
CHECK_TIMEOUT_SECONDS = 30.0


class NoRedirectHandler(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):  # type: ignore[override]
        return None


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run the Yunnan guide live HTTP smoke checks and browser regression.",
    )
    parser.add_argument(
        "--base-url",
        help="Use an already running server instead of starting a local uvicorn process.",
    )
    parser.add_argument("--host", default=DEFAULT_HOST, help="Host for the managed local uvicorn server.")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help="Port for the managed local uvicorn server.")
    parser.add_argument(
        "--service-only",
        action="store_true",
        help="Only run HTTP smoke checks.",
    )
    parser.add_argument(
        "--browser-only",
        action="store_true",
        help="Only run browser interaction regression.",
    )
    parser.add_argument(
        "--browser-path",
        help="Explicit browser executable path for Playwright Chromium launch.",
    )
    parser.add_argument(
        "--headed",
        action="store_true",
        help="Run the browser smoke test with a visible window.",
    )
    parser.add_argument(
        "--artifact-dir",
        default=str(DEFAULT_ARTIFACT_DIR),
        help="Directory for failure screenshots and future smoke artifacts.",
    )
    parser.add_argument(
        "--startup-timeout",
        type=float,
        default=CHECK_TIMEOUT_SECONDS,
        help="How long to wait for the managed local server to become healthy.",
    )
    return parser.parse_args()


def normalize_base_url(value: str) -> str:
    base_url = value.rstrip("/")
    if base_url.endswith(GUIDE_ROUTE):
        base_url = base_url[: -len(GUIDE_ROUTE)]
    return base_url


def build_url(base_url: str, path: str) -> str:
    return f"{base_url.rstrip('/')}{path}"


def request_url(url: str, *, follow_redirects: bool = True) -> tuple[int, str, bytes, dict[str, str]]:
    if follow_redirects:
        opener = build_opener()
    else:
        opener = build_opener(NoRedirectHandler())

    request = Request(url)
    try:
        with opener.open(request, timeout=10) as response:
            return (
                response.status,
                response.geturl(),
                response.read(),
                {key.lower(): value for key, value in response.headers.items()},
            )
    except HTTPError as exc:
        return exc.code, exc.geturl(), exc.read(), {key.lower(): value for key, value in exc.headers.items()}


def wait_for_server(base_url: str, timeout: float, process: subprocess.Popen[str]) -> None:
    deadline = time.time() + timeout
    health_url = build_url(base_url, "/healthz")
    while time.time() < deadline:
        if process.poll() is not None:
            output = process.stdout.read() if process.stdout else ""
            raise RuntimeError(f"Managed uvicorn server exited early.\n{output}".rstrip())
        try:
            status, _, body, _ = request_url(health_url)
            if status == 200:
                payload = json.loads(body.decode("utf-8"))
                if payload.get("ok") is True:
                    return
        except (URLError, json.JSONDecodeError):
            pass
        time.sleep(0.25)
    raise TimeoutError(f"Timed out waiting for {health_url} to become healthy.")


@contextmanager
def managed_server(host: str, port: int, timeout: float) -> Iterator[str]:
    base_url = f"http://{host}:{port}"
    process = subprocess.Popen(
        [
            sys.executable,
            "-m",
            "uvicorn",
            "app:app",
            "--host",
            host,
            "--port",
            str(port),
        ],
        cwd=ROOT_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )
    try:
        wait_for_server(base_url, timeout, process)
        yield base_url
    finally:
        if process.poll() is None:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=5)


def print_check(message: str) -> None:
    print(f"[check] {message}")


def run_service_smoke(base_url: str) -> None:
    redirect_status, _, _, redirect_headers = request_url(build_url(base_url, "/"), follow_redirects=False)
    if redirect_status != 302:
        raise AssertionError(f"Expected / to return 302, got {redirect_status}.")
    if redirect_headers.get("location") != GUIDE_ROUTE:
        raise AssertionError(
            f"Expected / redirect location {GUIDE_ROUTE}, got {redirect_headers.get('location', '')!r}.",
        )
    print_check(f"/ -> 302 {GUIDE_ROUTE}")

    guide_status, _, guide_body, guide_headers = request_url(build_url(base_url, GUIDE_ROUTE))
    if guide_status != 200:
        raise AssertionError(f"Expected {GUIDE_ROUTE} to return 200, got {guide_status}.")
    if "text/html" not in guide_headers.get("content-type", ""):
        raise AssertionError(f"Expected HTML for {GUIDE_ROUTE}, got {guide_headers.get('content-type', '')!r}.")
    guide_html = guide_body.decode("utf-8")
    if "/static/guide/css/main.css" not in guide_html or "/static/guide/js/main.js" not in guide_html:
        raise AssertionError("Guide HTML does not reference the modular CSS and JS entrypoints.")
    print_check(f"{GUIDE_ROUTE} -> 200 text/html")

    asset_expectations = [
        ("/static/guide/css/main.css", "text/css"),
        ("/static/guide/js/main.js", "javascript"),
        ("/static/guide/data/yunnan.blueprint.json", "application/json"),
        ("/healthz", "application/json"),
    ]
    for path, expected_content in asset_expectations:
        status, _, body, headers = request_url(build_url(base_url, path))
        if status != 200:
            raise AssertionError(f"Expected {path} to return 200, got {status}.")
        content_type = headers.get("content-type", "")
        if expected_content not in content_type:
            raise AssertionError(f"Expected {path} to return {expected_content}, got {content_type!r}.")
        if path == "/healthz":
            payload = json.loads(body.decode("utf-8"))
            if payload.get("ok") is not True:
                raise AssertionError(f"/healthz returned unexpected payload: {payload!r}")
        print_check(f"{path} -> 200 {content_type}")


def resolve_browser_path(explicit_path: str | None) -> str | None:
    if explicit_path:
        path = Path(explicit_path).expanduser().resolve()
        if not path.exists():
            raise FileNotFoundError(f"Browser executable does not exist: {path}")
        return str(path)

    env_path = os.getenv("TRIP_HUB_BROWSER_PATH") or os.getenv("BROWSER_PATH")
    if env_path:
        path = Path(env_path).expanduser().resolve()
        if path.exists():
            return str(path)

    candidates = [
        Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),
        Path("/Applications/Chromium.app/Contents/MacOS/Chromium"),
        Path("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"),
        Path("/usr/bin/google-chrome"),
        Path("/usr/bin/chromium"),
        Path("/usr/bin/chromium-browser"),
        Path("/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"),
        Path("/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return str(candidate)
    return None


def run_browser_smoke(base_url: str, artifact_dir: Path, *, browser_path: str | None, headed: bool) -> None:
    try:
        from playwright.sync_api import sync_playwright
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "Playwright is not installed in the current Python environment. "
            "Install it with `python -m pip install -r requirements-dev.txt`.",
        ) from exc

    artifact_dir.mkdir(parents=True, exist_ok=True)
    screenshot_path = artifact_dir / "yunnan-browser-failure.png"
    console_errors: list[str] = []
    page_errors: list[str] = []
    response_errors: list[str] = []
    page_url = build_url(base_url, GUIDE_ROUTE)

    with sync_playwright() as playwright:
        launch_kwargs = {
            "headless": not headed,
            "args": ["--disable-dev-shm-usage"],
        }
        if browser_path:
            launch_kwargs["executable_path"] = browser_path

        try:
            browser = playwright.chromium.launch(**launch_kwargs)
        except Exception as exc:  # pragma: no cover - depends on local browser availability
            if browser_path:
                raise RuntimeError(f"Failed to launch browser at {browser_path}: {exc}") from exc
            raise RuntimeError(
                "Failed to launch Chromium. Install Google Chrome locally or pass --browser-path.",
            ) from exc

        page = browser.new_page(viewport={"width": 430, "height": 932})
        page.on("pageerror", lambda error: page_errors.append(str(error)))
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on(
            "response",
            lambda response: response_errors.append(f"{response.status} {response.url}") if response.status >= 400 else None,
        )

        try:
            page.goto(page_url, wait_until="networkidle")
            page.evaluate("localStorage.clear(); sessionStorage.clear();")
            page.reload(wait_until="networkidle")

            page.wait_for_function("!document.getElementById('viewItinerary').hidden")
            initial_view = page.evaluate(
                "Array.from(document.querySelectorAll('[data-view-panel]')).find((node) => !node.hidden)?.dataset.viewPanel || ''",
            )
            print_check(f"initial view -> {initial_view}")
            initial_date_items = page.locator("#dateRail .date-rail__item").count()
            if initial_date_items < 1:
                raise AssertionError(
                    "Initial itinerary did not render. "
                    f"page_errors={page_errors} console_errors={console_errors} response_errors={response_errors}",
                )

            page.locator("#openViewMenuBtn").click()
            page.wait_for_function("document.getElementById('openViewMenuBtn').getAttribute('aria-expanded') === 'true'")
            page.locator('#viewMenu [data-view="overview"]').click(force=True)
            page.wait_for_function("!document.getElementById('viewOverview').hidden")
            overview_text = page.locator("#viewOverview").inner_text().strip()
            pitfall_index = overview_text.find("避坑总表")
            attention_index = overview_text.find("注意事项")
            notice_index = overview_text.find("留意四件事")
            if min(pitfall_index, attention_index, notice_index) < 0:
                raise AssertionError("Overview page is missing one or more mobile pitfall sections.")
            if not (pitfall_index < attention_index < notice_index):
                raise AssertionError("Overview mobile section order is incorrect.")
            if "Yunnan Pitfall Guide" in overview_text or "云南 11 天游避坑指南" in overview_text:
                raise AssertionError("Overview page still renders the removed intro/manual block.")

            page.locator("#phasePickerBtn").click()
            page.wait_for_function("document.getElementById('phasePickerBtn').getAttribute('aria-expanded') === 'true'")
            section_options = page.locator("#phaseFilter .menu-option").all_inner_texts()
            if len(section_options) != 3:
                raise AssertionError(f"Overview section menu should have 3 items, got {len(section_options)}.")
            page.locator('#phaseFilter [data-overview-target="urgentSection"]').click(force=True)
            page.wait_for_function("document.getElementById('phasePickerLabel').textContent.includes('留意四件事')")
            print_check("overview mobile sections -> topbar section switch ok")

            page.locator("#openViewMenuBtn").click()
            page.wait_for_function("document.getElementById('openViewMenuBtn').getAttribute('aria-expanded') === 'true'")
            page.locator('#viewMenu [data-view="itinerary"]').click(force=True)
            page.wait_for_function("!document.getElementById('viewItinerary').hidden")

            page.locator("#phasePickerBtn").click()
            page.wait_for_function("document.getElementById('phasePickerBtn').getAttribute('aria-expanded') === 'true'")
            page.locator('#phaseFilter [data-phase="lugu"]').click(force=True)
            page.wait_for_function("document.getElementById('phasePickerLabel').textContent.includes('泸沽湖')")
            phase_label = page.locator("#phasePickerLabel").inner_text().strip()
            print_check(f"phase switch -> {phase_label}")

            date_items = page.locator("#dateRail .date-rail__item").count()
            if date_items < 1:
                raise AssertionError("Itinerary date rail is empty.")
            page.locator("#dateRail .date-rail__item").first.click()
            print_check(f"itinerary rail items -> {date_items}")

            page.locator("#daysContainer .chapter-detail-button").click()
            page.wait_for_function("!document.getElementById('detailShell').hidden")
            detail_title = page.locator("#detailTitle").inner_text().strip()
            if not detail_title:
                raise AssertionError("Detail title is empty.")
            print_check(f"detail open -> {detail_title}")

            page.locator('#detailTabs [data-tab="stay"]').click()
            page.wait_for_timeout(120)
            stay_text = page.locator("#detailBody").inner_text().strip()
            if "泸沽湖银湖岛大酒店" not in stay_text:
                raise AssertionError("Stay tab did not render the source hotel options.")
            if "阿妈野生菌土鸡腊排骨" not in stay_text:
                raise AssertionError("Stay tab did not render the source dining options.")
            if "10:00" in stay_text or "12:00" in stay_text:
                raise AssertionError("Stay tab still contains route timing text.")
            amap_links = page.locator('#detailBody a[data-amap-route="true"]').count()
            if amap_links <= 0:
                raise AssertionError("Stay tab did not render any Amap app-scheme links.")
            href = page.locator('#detailBody a[data-amap-route="true"]').first.get_attribute("href") or ""
            if not (href.startswith("amapuri://route/plan/?") or href.startswith("iosamap://path?")):
                raise AssertionError(f"Unexpected Amap route href: {href}")
            print_check("detail stay tab -> structured + source options")

            page.locator("#detailLeadImage").click()
            page.wait_for_function("!document.getElementById('lightboxShell').hidden")
            lightbox_counter = page.locator("#lightboxCounter").inner_text().strip()
            print_check(f"lightbox open -> {lightbox_counter}")
            page.locator('#lightboxShell button[data-close-lightbox]').click()
            page.wait_for_function("document.getElementById('lightboxShell').hidden")
            page.locator('#detailShell button[data-close-detail]').click()
            page.wait_for_function("document.getElementById('detailShell').hidden")

            page.locator("#openSearchBtn").click()
            page.wait_for_function("!document.getElementById('searchShell').hidden")
            page.locator("#searchInput").fill("泸沽湖")
            page.wait_for_function("document.querySelectorAll('#searchResults .search-result').length > 0")
            search_results = page.locator("#searchResults .search-result").count()
            if search_results <= 0:
                raise AssertionError("Search returned no results for 泸沽湖.")
            print_check(f"search results -> {search_results}")
            page.locator('#searchShell button[data-close-search]').click()
            page.wait_for_function("document.getElementById('searchShell').hidden")

            page.locator("#openViewMenuBtn").click()
            page.wait_for_function("document.getElementById('openViewMenuBtn').getAttribute('aria-expanded') === 'true'")
            page.locator('#viewMenu [data-view="attractions"]').click(force=True)
            page.wait_for_function("!document.getElementById('viewAttractions').hidden")
            gallery_cards = page.locator("#featuredGallery .gallery-card").count()
            if gallery_cards <= 0:
                raise AssertionError("Attractions gallery is empty.")
            page.locator("#featuredGallery .gallery-card").first.click(force=True)
            page.wait_for_function("!document.getElementById('attractionCommunityShell').hidden")
            attraction_title = page.locator("#attractionCommunityTitle").inner_text().strip()
            print_check(f"attraction community -> {attraction_title}")
            page.evaluate("document.querySelector('[data-close-attraction-community]')?.click()")
            page.wait_for_function("document.getElementById('attractionCommunityShell').hidden")

            page.locator("#openViewMenuBtn").click()
            page.wait_for_function("document.getElementById('openViewMenuBtn').getAttribute('aria-expanded') === 'true'")
            page.locator('#viewMenu [data-view="checklist"]').click(force=True)
            page.wait_for_function("!document.getElementById('viewChecklist').hidden")
            checklist_label = page.locator("#phasePickerLabel").inner_text().strip()
            if checklist_label != "行前清单":
                raise AssertionError(f"Checklist label mismatch: {checklist_label}")
            if page.locator("#toolsSection").count() or page.locator("#notesSection").count():
                raise AssertionError("Checklist still contains removed secondary sections.")
            page.wait_for_selector("#packingList input[data-pack-key]")
            checkbox = page.locator("#packingList input[data-pack-key]").first
            packing_key = checkbox.get_attribute("data-pack-key")
            if not packing_key:
                raise AssertionError("Packing checkbox key is missing.")
            checkbox.check(force=True)
            page.wait_for_timeout(250)
            storage_payload = page.evaluate("localStorage.getItem('yunnan_guide_packing_v1') || ''")
            if packing_key not in storage_payload:
                raise AssertionError(f"Packing state {packing_key} did not persist to localStorage.")

            page.reload(wait_until="networkidle")
            page.locator("#openViewMenuBtn").click()
            page.wait_for_function("document.getElementById('openViewMenuBtn').getAttribute('aria-expanded') === 'true'")
            page.locator('#viewMenu [data-view="checklist"]').click(force=True)
            page.wait_for_function("!document.getElementById('viewChecklist').hidden")
            persisted_checkbox = page.locator(f'#packingList input[data-pack-key="{packing_key}"]')
            page.wait_for_selector(f'#packingList input[data-pack-key="{packing_key}"]')
            if not persisted_checkbox.is_checked():
                raise AssertionError(f"Packing checkbox {packing_key} did not stay checked after reload.")
            print_check(f"packing persistence -> {packing_key}")

            if page_errors:
                raise AssertionError(f"Page errors: {page_errors}")
            if console_errors:
                raise AssertionError(f"Console errors: {console_errors}")
            if response_errors:
                raise AssertionError(f"HTTP response errors: {response_errors}")
            print_check("browser smoke -> ok")
        except Exception:
            page.screenshot(path=str(screenshot_path), full_page=True)
            raise
        finally:
            browser.close()


def main() -> int:
    args = parse_args()
    if args.service_only and args.browser_only:
        raise SystemExit("--service-only and --browser-only cannot be used together.")

    base_url = normalize_base_url(args.base_url) if args.base_url else f"http://{args.host}:{args.port}"
    run_service = not args.browser_only
    run_browser = not args.service_only
    browser_path = resolve_browser_path(args.browser_path)
    artifact_dir = Path(args.artifact_dir).expanduser()

    def run_all(target_base_url: str) -> None:
        if run_service:
            run_service_smoke(target_base_url)
        if run_browser:
            run_browser_smoke(
                target_base_url,
                artifact_dir,
                browser_path=browser_path,
                headed=args.headed,
            )

    if args.base_url:
        run_all(base_url)
    else:
        with managed_server(args.host, args.port, args.startup_timeout) as managed_base_url:
            run_all(managed_base_url)

    print("[done] yunnan checks passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
