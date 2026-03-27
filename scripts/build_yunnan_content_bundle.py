from __future__ import annotations

import subprocess
import sys
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
SCRIPTS = [
    BASE_DIR / "scripts" / "build_yunnan_day_map.py",
    BASE_DIR / "scripts" / "build_yunnan_blueprint.py",
    BASE_DIR / "scripts" / "validate_yunnan_blueprint.py",
]


def main() -> None:
    for script in SCRIPTS:
        subprocess.run(
            [sys.executable, str(script)],
            cwd=BASE_DIR,
            check=True,
        )


if __name__ == "__main__":
    main()
