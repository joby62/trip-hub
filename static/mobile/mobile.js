const ACTIVE_STAGES = ["daily", "evolution", "experience", "difficulty", "impact", "wrapup"];

const STAGE_LABELS = {
    consent_pending: "待同意",
    daily: "日常场景",
    evolution: "变化节点",
    experience: "体验感受",
    difficulty: "阻碍与应对",
    impact: "影响与反思",
    wrapup: "收尾补充",
    review: "草稿审阅",
    done: "定稿完成",
    withdrawn: "已撤回"
};

const SPARK_POOL = {
    daily: [
        "最近一次是____，我在____学了____分钟。",
        "我通常在____这个时间段学习。",
        "那次学习的地点是____，周围环境是____。",
        "我最常用的平台是____，主要学____。",
        "那次最投入的一段是____。",
        "我一般先____，再____。"
    ],
    evolution: [
        "变化发生在____之后，因为____。",
        "以前我主要____，现在更重视____。",
        "让我下决心改变的是____。",
        "那次节点前后最大的差异是____。",
        "我删掉了____，保留了____。",
        "变化稳定下来用了____周。"
    ],
    experience: [
        "当时我的情绪从____变到____。",
        "最难忘的是____，因为____。",
        "我最容易焦虑的时刻是____。",
        "让我有成就感的是____。",
        "学完后身体感觉是____。",
        "那次体验让我意识到____。"
    ],
    difficulty: [
        "我最大的困难是____。",
        "我用____来减少分心。",
        "当计划被打断时，我会____。",
        "目前最稳的策略是____。",
        "这招带来的效果是____。",
        "它的副作用是____，我在调整____。"
    ],
    impact: [
        "它影响了我的作息：以前____，现在____。",
        "对工作最直接的收益是____。",
        "我和____的互动发生了____变化。",
        "学习带来的成本是____，回报是____。",
        "长期看，我更像一个____的人。",
        "如果回到起点，我会先做____。"
    ],
    wrapup: [
        "还有一段经历我希望写进自传：____。",
        "请重点保留____这段内容。",
        "请删去/弱化____这部分。",
        "如果只能留一句话，我希望是____。",
        "整体总结：____。",
        "我没有更多补充，可以进入草稿阶段。"
    ]
};

const SPEED_MODEL_HINT = {
    fast: "mini",
    balanced: "lite",
    deep: "pro"
};

const state = {
    inviteCode: "",
    payload: null,
    busy: false,
    toastTimer: null,
    enterPrimedAt: 0,
    speedMode: "fast",
    availableModels: [],
    modelConfig: null
};

const els = {
    stageBadge: document.getElementById("stageBadge"),
    tokenBadge: document.getElementById("tokenBadge"),
    progressBadge: document.getElementById("progressBadge"),
    stageTitle: document.getElementById("stageTitle"),
    stageGoal: document.getElementById("stageGoal"),
    stageHints: document.getElementById("stageHints"),
    sparkList: document.getElementById("sparkList"),
    shuffleSparkBtn: document.getElementById("shuffleSparkBtn"),
    chatScroll: document.getElementById("chatScroll"),
    composerHint: document.getElementById("composerHint"),
    userInput: document.getElementById("userInput"),
    sendBtn: document.getElementById("sendBtn"),
    advanceBtn: document.getElementById("advanceBtn"),
    summaryBtn: document.getElementById("summaryBtn"),
    summaryBox: document.getElementById("summaryBox"),
    consentOverlay: document.getElementById("consentOverlay"),
    consentAgreeBtn: document.getElementById("consentAgreeBtn"),
    consentDeclineBtn: document.getElementById("consentDeclineBtn"),
    speedFastBtn: document.getElementById("speedFastBtn"),
    speedBalancedBtn: document.getElementById("speedBalancedBtn"),
    speedDeepBtn: document.getElementById("speedDeepBtn"),
    speedHint: document.getElementById("speedHint"),
    toast: document.getElementById("toast")
};

function stageLabel(stage) {
    return STAGE_LABELS[stage] || stage;
}

function modelToMode(model) {
    const name = String(model || "").toLowerCase();
    if (name.includes("-pro-")) return "deep";
    if (name.includes("-lite-")) return "balanced";
    return "fast";
}

function pickModelByMode(mode) {
    const want = SPEED_MODEL_HINT[mode] || "mini";
    const models = state.availableModels || [];
    const hit = models.find((m) => String(m).toLowerCase().includes(`-${want}-`));
    if (hit) return hit;
    return state.modelConfig?.orch_model || state.modelConfig?.default_model || models[0] || "";
}

function setBusy(flag) {
    state.busy = flag;
    const stage = state.payload?.session?.stage;
    const chatEnabled = ACTIVE_STAGES.includes(stage) && !flag;

    els.userInput.disabled = !chatEnabled;
    els.sendBtn.disabled = !chatEnabled;
    els.advanceBtn.disabled = flag || !ACTIVE_STAGES.includes(stage);
    els.summaryBtn.disabled = flag || ![...ACTIVE_STAGES, "review"].includes(stage || "");
    els.consentAgreeBtn.disabled = flag;
    els.consentDeclineBtn.disabled = flag;

    if (flag) {
        els.composerHint.textContent = "系统处理中...";
    }
}

function showToast(text, error = false) {
    els.toast.textContent = text || "";
    els.toast.style.background = error ? "rgba(161, 38, 38, 0.92)" : "rgba(17, 24, 39, 0.9)";
    els.toast.classList.add("visible");
    if (state.toastTimer) clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => {
        els.toast.classList.remove("visible");
    }, 2400);
}

async function api(path, options = {}) {
    const headers = { ...(options.headers || {}) };
    if (options.body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    const res = await fetch(path, {
        ...options,
        headers
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const detail = data?.detail;
        if (typeof detail === "string") throw new Error(detail);
        if (detail?.message) throw new Error(detail.message);
        throw new Error("请求失败");
    }
    return data;
}

function shuffle(input) {
    const arr = [...input];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function currentStageConfig() {
    const template = state.payload?.template;
    const stage = state.payload?.session?.stage;
    const stages = template?.stages || [];
    return stages.find((s) => s.key === stage) || null;
}

function stageProgress(stage) {
    return state.payload?.progress?.[stage] || {};
}

function progressPercent() {
    const stage = state.payload?.session?.stage;
    if (!stage) return 0;
    if (stage === "consent_pending" || stage === "withdrawn") return 0;
    if (stage === "done") return 100;

    const idx = Math.max(0, ACTIVE_STAGES.indexOf(stage));
    const base = (idx / ACTIVE_STAGES.length) * 100;
    const conf = currentStageConfig();
    if (!conf) return Math.round(base);

    const ps = stageProgress(stage);
    const turnRatio = Math.min(1, Number(ps.turns || 0) / Math.max(1, Number(conf.min_turns || 1)));
    const charRatio = Math.min(1, Number(ps.chars || 0) / Math.max(20, Number(conf.min_chars || 20)));
    const stageRatio = Math.min(1, (turnRatio + charRatio) / 2);
    const chunk = (1 / ACTIVE_STAGES.length) * 100;
    return Math.round(Math.min(99, base + chunk * stageRatio));
}

function renderHeader() {
    const session = state.payload?.session;
    const stage = session?.stage || "consent_pending";
    const token = session?.participant_token || "";

    els.stageBadge.textContent = stageLabel(stage);
    els.progressBadge.textContent = `${progressPercent()}%`;
    els.tokenBadge.textContent = token ? `会话 ${token.slice(0, 8)}` : "会话 --";
}

function renderStage() {
    const session = state.payload?.session;
    const stage = session?.stage || "consent_pending";
    const conf = currentStageConfig();

    if (!conf) {
        els.stageTitle.textContent = stage === "consent_pending" ? "等待同意开始" : stageLabel(stage);
        els.stageGoal.textContent = stage === "consent_pending" ? "点击同意后进入正式访谈。" : "当前阶段可继续查看历史信息。";
        els.stageHints.innerHTML = "";
        return;
    }

    els.stageTitle.textContent = conf.title || stageLabel(stage);
    els.stageGoal.textContent = conf.goal || "";
    const hints = Array.isArray(conf.prompt_hints) ? conf.prompt_hints.slice(0, 6) : [];
    els.stageHints.innerHTML = hints.map((h) => `<span class="chip">${String(h).replace(/</g, "&lt;")}</span>`).join("");

    const ps = stageProgress(stage);
    const turns = Number(ps.turns || 0);
    const chars = Number(ps.chars || 0);
    els.composerHint.textContent = `本阶段进度：${turns}/${conf.min_turns} 轮，${chars}/${conf.min_chars} 字`;
}

function renderSparks() {
    const stage = state.payload?.session?.stage;
    if (!ACTIVE_STAGES.includes(stage)) {
        els.sparkList.innerHTML = "";
        els.shuffleSparkBtn.disabled = true;
        return;
    }

    const pool = SPARK_POOL[stage] || [];
    const sample = shuffle(pool).slice(0, Math.min(6, pool.length));
    els.sparkList.innerHTML = sample
        .map((spark) => `<button class="spark-chip" type="button" data-chip="${spark.replace(/"/g, "&quot;")}">${spark}</button>`)
        .join("");
    els.shuffleSparkBtn.disabled = state.busy;
}

function renderMessages() {
    const list = state.payload?.messages || [];
    if (!list.length) {
        els.chatScroll.innerHTML = '<div class="empty">暂无消息，开始说第一句吧。</div>';
        return;
    }

    els.chatScroll.innerHTML = list
        .map((m) => {
            const role = m.role || "assistant";
            const ts = (m.created_at || "").replace("T", " ").slice(0, 16);
            const content = String(m.content || "").replace(/</g, "&lt;");
            return `
                <article class="msg ${role}">
                    <div class="role">${role} · ${ts}</div>
                    <div>${content}</div>
                </article>
            `;
        })
        .join("");

    els.chatScroll.scrollTop = els.chatScroll.scrollHeight;
}

function renderSummary() {
    const summary = state.payload?.session?.summary_text;
    els.summaryBox.textContent = summary || "尚未生成草稿。";
}

function renderConsentOverlay() {
    const stage = state.payload?.session?.stage;
    els.consentOverlay.classList.toggle("visible", stage === "consent_pending");
}

function applySpeedMode(mode) {
    state.speedMode = mode;
    els.speedFastBtn.classList.toggle("active", mode === "fast");
    els.speedBalancedBtn.classList.toggle("active", mode === "balanced");
    els.speedDeepBtn.classList.toggle("active", mode === "deep");

    const label = mode === "deep" ? "深度" : (mode === "balanced" ? "中庸" : "快速");
    els.speedHint.textContent = `当前：${label}`;
}

function renderAll() {
    renderHeader();
    renderStage();
    renderSparks();
    renderMessages();
    renderSummary();
    renderConsentOverlay();
    setBusy(false);
}

async function loadModelConfig() {
    try {
        const cfg = await api("/model-config");
        state.modelConfig = cfg;
        state.availableModels = Array.isArray(cfg.available_models) ? cfg.available_models : [];
        applySpeedMode(modelToMode(cfg.orch_model));
    } catch (err) {
        applySpeedMode("fast");
        showToast(`读取模型配置失败：${String(err.message || err)}`, true);
    }
}

async function changeSpeed(mode) {
    if (state.busy) return;
    const model = pickModelByMode(mode);
    if (!model) {
        showToast("当前无可用模型", true);
        return;
    }

    try {
        const cfg = await api("/model-config", {
            method: "POST",
            body: JSON.stringify({ orch_model: model, write_model: model })
        });
        state.modelConfig = cfg;
        state.availableModels = Array.isArray(cfg.available_models) ? cfg.available_models : state.availableModels;
        applySpeedMode(mode);
        showToast("已切换思考速度（下一轮生效）");
    } catch (err) {
        showToast(`切换失败：${String(err.message || err)}`, true);
    }
}

async function joinSession() {
    if (!state.inviteCode) {
        throw new Error("邀请链接缺少邀请码");
    }
    const res = await api("/api/participant/join", {
        method: "POST",
        body: JSON.stringify({ invite_code: state.inviteCode })
    });
    state.payload = {
        session: res.session,
        template: res.template,
        progress: res.progress,
        messages: res.messages
    };
}

async function refreshState() {
    const res = await api("/api/participant/state");
    state.payload = {
        session: res.session,
        template: res.template,
        progress: res.progress,
        messages: res.messages
    };
}

async function submitConsent(agreed) {
    if (state.busy) return;
    setBusy(true);
    try {
        const res = await api("/api/participant/consent", {
            method: "POST",
            body: JSON.stringify({ agreed })
        });
        state.payload = {
            session: res.session,
            template: res.template,
            progress: res.progress,
            messages: res.messages
        };
        renderAll();
        showToast(agreed ? "已同意，开始访谈" : "已记录不同意，本次访谈结束");
    } catch (err) {
        showToast(String(err.message || err), true);
        setBusy(false);
    }
}

async function sendMessage() {
    if (state.busy) return;
    const content = els.userInput.value.trim();
    if (!content) {
        showToast("请输入内容后再发送", true);
        return;
    }

    setBusy(true);
    try {
        const res = await api("/api/participant/message", {
            method: "POST",
            body: JSON.stringify({ content })
        });
        els.userInput.value = "";
        state.payload = {
            session: res.session,
            template: res.template,
            progress: res.progress,
            messages: res.messages
        };
        renderAll();
        if (res.result?.can_advance) {
            showToast("当前阶段信息达标，可进入下一阶段");
        }
    } catch (err) {
        showToast(String(err.message || err), true);
        setBusy(false);
    }
}

async function advanceStage() {
    if (state.busy) return;
    setBusy(true);
    try {
        const res = await api("/api/participant/advance", { method: "POST" });
        state.payload = {
            session: res.session,
            template: res.template,
            progress: res.progress,
            messages: res.messages
        };
        renderAll();
        showToast("已进入下一阶段");
    } catch (err) {
        showToast(String(err.message || err), true);
        setBusy(false);
    }
}

async function generateSummary() {
    if (state.busy) return;
    setBusy(true);
    try {
        const res = await api("/api/participant/summary", { method: "POST" });
        state.payload = {
            session: res.session,
            template: res.template,
            progress: res.progress,
            messages: res.messages
        };
        renderAll();
        showToast("已生成草稿");
    } catch (err) {
        showToast(String(err.message || err), true);
        setBusy(false);
    }
}

function parseInviteCodeFromPath() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (parts.length >= 2 && parts[0] === "participant") return parts[1];
    if (parts.length >= 3 && parts[0] === "m" && parts[1] === "participant") return parts[2];
    return "";
}

function bindEvents() {
    els.sendBtn.addEventListener("click", sendMessage);
    els.advanceBtn.addEventListener("click", advanceStage);
    els.summaryBtn.addEventListener("click", generateSummary);
    els.consentAgreeBtn.addEventListener("click", () => submitConsent(true));
    els.consentDeclineBtn.addEventListener("click", () => submitConsent(false));
    els.shuffleSparkBtn.addEventListener("click", renderSparks);

    els.speedFastBtn.addEventListener("click", () => changeSpeed("fast"));
    els.speedBalancedBtn.addEventListener("click", () => changeSpeed("balanced"));
    els.speedDeepBtn.addEventListener("click", () => changeSpeed("deep"));

    document.addEventListener("click", (event) => {
        const chip = event.target.closest(".spark-chip");
        if (!chip || state.busy) return;
        const snippet = chip.dataset.chip || chip.textContent || "";
        const current = els.userInput.value.trim();
        els.userInput.value = current ? `${current}\n${snippet}` : snippet;
        els.userInput.focus();
    });

    els.userInput.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        if (event.shiftKey) return;

        event.preventDefault();
        const now = Date.now();
        if (state.enterPrimedAt && now - state.enterPrimedAt < 520) {
            state.enterPrimedAt = 0;
            sendMessage();
            return;
        }

        state.enterPrimedAt = now;
        showToast("再按一次 Enter 发送；Shift+Enter 换行");
        setTimeout(() => {
            if (Date.now() - state.enterPrimedAt >= 520) state.enterPrimedAt = 0;
        }, 560);
    });
}

async function bootstrap() {
    bindEvents();
    state.inviteCode = parseInviteCodeFromPath();
    if (!state.inviteCode) {
        showToast("链接无效：缺少邀请码", true);
        return;
    }

    setBusy(true);
    try {
        await Promise.all([joinSession(), loadModelConfig()]);
        await refreshState();
        renderAll();
    } catch (err) {
        showToast(String(err.message || err), true);
        setBusy(false);
    }
}

bootstrap();
