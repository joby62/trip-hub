const ACTIVE_STAGES = ["daily", "evolution", "experience", "difficulty", "impact", "wrapup"];
const STAGE_LABELS = {
  consent_pending: "待同意",
  daily: "日常",
  evolution: "变化",
  experience: "体验",
  difficulty: "困难",
  impact: "影响",
  wrapup: "补充",
  review: "审阅",
  done: "完成",
  withdrawn: "已终止",
};

const state = {
  inviteCode: "",
  payload: null,
  busy: false,
  toastTimer: null,
  enterPrimedAt: 0,
};

const els = {
  projectTitle: document.getElementById("projectTitle"),
  stageBadge: document.getElementById("stageBadge"),
  progressBadge: document.getElementById("progressBadge"),
  stageTitle: document.getElementById("stageTitle"),
  stageGoal: document.getElementById("stageGoal"),
  stageHints: document.getElementById("stageHints"),
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
  toast: document.getElementById("toast"),
};

function stageLabel(stage) {
  return STAGE_LABELS[stage] || stage;
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
  els.toast.style.color = error ? "#b42318" : "#1f5f9f";
  els.toast.classList.add("visible");
  if (state.toastTimer) clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => {
    els.toast.classList.remove("visible");
  }, 2400);
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
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
  if (stage === "consent_pending") return 0;
  if (stage === "withdrawn") return 0;
  if (stage === "done") return 100;

  const idx = Math.max(0, ACTIVE_STAGES.indexOf(stage));
  const base = (idx / ACTIVE_STAGES.length) * 100;
  const conf = currentStageConfig();
  if (!conf) return Math.round(base);

  const ps = stageProgress(stage);
  const turnRatio = Math.min(1, (Number(ps.turns || 0) / Math.max(1, Number(conf.min_turns || 1))));
  const charRatio = Math.min(1, (Number(ps.chars || 0) / Math.max(20, Number(conf.min_chars || 20))));
  const stageRatio = Math.min(1, (turnRatio + charRatio) / 2);
  const chunk = (1 / ACTIVE_STAGES.length) * 100;
  return Math.round(Math.min(99, base + chunk * stageRatio));
}

function renderMessages() {
  const list = state.payload?.messages || [];
  if (!list.length) {
    els.chatScroll.innerHTML = '<div class="empty">暂无消息</div>';
    return;
  }

  els.chatScroll.innerHTML = list
    .map((m) => {
      const role = m.role || "assistant";
      const ts = (m.created_at || "").replace("T", " ").slice(0, 19);
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

function renderStageTips() {
  const session = state.payload?.session;
  const conf = currentStageConfig();
  const stage = session?.stage || "consent_pending";

  els.stageBadge.textContent = stageLabel(stage);
  els.progressBadge.textContent = `${progressPercent()}%`;

  if (!conf) {
    els.stageTitle.textContent = stage === "consent_pending" ? "等待同意" : stageLabel(stage);
    els.stageGoal.textContent = stage === "consent_pending" ? "点击同意后进入正式访谈" : "当前阶段无需提示";
    els.stageHints.innerHTML = "";
    return;
  }

  els.stageTitle.textContent = conf.title;
  els.stageGoal.textContent = conf.goal;
  const hints = Array.isArray(conf.prompt_hints) ? conf.prompt_hints : [];
  els.stageHints.innerHTML = hints.map((h) => `<span class="chip">${h}</span>`).join("");

  const ps = stageProgress(stage);
  const turns = Number(ps.turns || 0);
  const chars = Number(ps.chars || 0);
  els.composerHint.textContent = `本阶段进度：${turns}/${conf.min_turns} 轮，${chars}/${conf.min_chars} 字`;
}

function renderSummary() {
  const summary = state.payload?.session?.summary_text;
  els.summaryBox.textContent = summary || "尚未生成总结";
}

function renderConsentOverlay() {
  const stage = state.payload?.session?.stage;
  const visible = stage === "consent_pending";
  els.consentOverlay.classList.toggle("visible", visible);
}

function renderProjectMeta() {
  const session = state.payload?.session;
  els.projectTitle.textContent = session?.project_title || "数字学习自传访谈";
}

function renderAll() {
  renderProjectMeta();
  renderMessages();
  renderStageTips();
  renderSummary();
  renderConsentOverlay();
  setBusy(false);
}

async function joinSession() {
  if (!state.inviteCode) {
    throw new Error("邀请链接缺少邀请码");
  }
  const res = await api("/api/participant/join", {
    method: "POST",
    body: JSON.stringify({ invite_code: state.inviteCode }),
  });
  state.payload = {
    session: res.session,
    template: res.template,
    progress: res.progress,
    messages: res.messages,
  };
}

async function refreshState() {
  const res = await api("/api/participant/state");
  state.payload = {
    session: res.session,
    template: res.template,
    progress: res.progress,
    messages: res.messages,
  };
}

async function submitConsent(agreed) {
  if (state.busy) return;
  setBusy(true);
  try {
    const res = await api("/api/participant/consent", {
      method: "POST",
      body: JSON.stringify({ agreed }),
    });
    state.payload = {
      session: res.session,
      template: res.template,
      progress: res.progress,
      messages: res.messages,
    };
    renderAll();
    if (agreed) showToast("已同意，开始访谈");
    else showToast("已记录不同意，本次访谈结束");
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
      body: JSON.stringify({ content }),
    });
    els.userInput.value = "";
    state.payload = {
      session: res.session,
      template: res.template,
      progress: res.progress,
      messages: res.messages,
    };
    renderAll();
    const canAdvance = !!res.result?.can_advance;
    if (canAdvance) {
      showToast("当前阶段信息已达标，可点击“进入下一阶段”");
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
      messages: res.messages,
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
      messages: res.messages,
    };
    renderAll();
    showToast("已生成总结");
  } catch (err) {
    showToast(String(err.message || err), true);
    setBusy(false);
  }
}

function bindEvents() {
  els.sendBtn.addEventListener("click", sendMessage);
  els.advanceBtn.addEventListener("click", advanceStage);
  els.summaryBtn.addEventListener("click", generateSummary);
  els.consentAgreeBtn.addEventListener("click", () => submitConsent(true));
  els.consentDeclineBtn.addEventListener("click", () => submitConsent(false));

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

function parseInviteCodeFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts.length >= 2 && parts[0] === "participant") return parts[1];
  return "";
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
    await joinSession();
    await refreshState();
    renderAll();
  } catch (err) {
    showToast(String(err.message || err), true);
    setBusy(false);
  }
}

bootstrap();
