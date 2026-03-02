async function loadModelConfig() {
    try {
        const data = await api("/model-config");
        state.availableModels = Array.isArray(data.available_models) && data.available_models.length
            ? data.available_models
            : [...DEFAULT_MODELS];
        state.defaultModel = data.default_model || state.availableModels[0];
        const speedModels = resolveSpeedModels(state.availableModels, state.defaultModel);
        state.fastModel = speedModels.fastModel;
        state.balancedModel = speedModels.balancedModel;
        state.deepModel = speedModels.deepModel;

        const preferred = normalizeSpeedMode(safeStorageRead(SPEED_PREF_KEY, "fast"));
        const preferredModel = modelBySpeedMode(preferred);
        state.speedMode = preferredModel ? preferred : "fast";
        const targetModel = modelBySpeedMode(state.speedMode);

        state.modelOrch = data.orch_model || targetModel;
        state.modelWrite = data.write_model || state.modelOrch;

        if (state.modelOrch !== targetModel || state.modelWrite !== targetModel) {
            const ok = await updateModelConfig(targetModel, false);
            if (!ok) {
                if (state.modelOrch === state.deepModel) {
                    state.speedMode = "deep";
                } else if (state.modelOrch === state.balancedModel) {
                    state.speedMode = "balanced";
                } else {
                    state.speedMode = "fast";
                }
            }
        }
    } catch {
        state.availableModels = [...DEFAULT_MODELS];
        state.defaultModel = FAST_MODEL_ID;
        const speedModels = resolveSpeedModels(state.availableModels, state.defaultModel);
        state.fastModel = speedModels.fastModel;
        state.balancedModel = speedModels.balancedModel;
        state.deepModel = speedModels.deepModel;
        state.modelOrch = state.fastModel;
        state.modelWrite = state.fastModel;
        state.speedMode = "fast";
        safeStorageWrite(SPEED_PREF_KEY, "fast");
    }

    renderSpeedControl();
}

function resolveSpeedModels(models, defaultModel) {
    const pool = [...new Set((models || []).filter(Boolean))];
    const mini = pool.find((m) => /mini/i.test(m));
    const lite = pool.find((m) => /lite/i.test(m));
    const pro = pool.find((m) => /pro/i.test(m));

    let fastModel = mini || defaultModel || pool[0] || FAST_MODEL_ID;
    if (!pool.includes(fastModel)) pool.push(fastModel);
    const balancedModel = lite || "";
    const deepModel = pro || "";
    return { fastModel, balancedModel, deepModel };
}

function renderSpeedControl() {
    const modes = [
        { key: "fast", btn: els.speedFastBtn },
        { key: "balanced", btn: els.speedBalancedBtn },
        { key: "deep", btn: els.speedDeepBtn }
    ];

    const availableByMode = {
        fast: Boolean(state.fastModel),
        balanced: Boolean(state.balancedModel),
        deep: Boolean(state.deepModel)
    };

    for (const item of modes) {
        item.btn.classList.toggle("active", state.speedMode === item.key);
        item.btn.setAttribute("aria-pressed", String(state.speedMode === item.key));
        item.btn.disabled = !availableByMode[item.key];
    }

    if (state.isBusy) {
        els.speedHint.textContent = "助手思考中，可切换快速/中庸/深度（下一轮生效）";
    } else {
        els.speedHint.textContent = `当前：${speedModeLabel(state.speedMode)}（${modelBySpeedMode(state.speedMode)}）`;
    }
}

async function updateModelConfig(model, notify = true) {
    if (!model) return;
    try {
        const data = await api("/model-config", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model })
        });
        state.modelOrch = data.orch_model;
        state.modelWrite = data.write_model;
        if (notify) {
            showToast(`已切换为${speedModeLabel(state.speedMode)}思考`, "success");
        }
        return true;
    } catch (err) {
        if (notify) {
            showToast(String(err.message || err), "error");
        }
        return false;
    }
}

async function switchSpeed(mode) {
    if (!["fast", "balanced", "deep"].includes(mode)) return;
    const targetModel = modelBySpeedMode(mode);
    if (!targetModel) return;
    if (mode === state.speedMode) return;

    const prev = state.speedMode;
    state.speedMode = mode;
    renderSpeedControl();

    const ok = await updateModelConfig(targetModel);
    if (!ok) {
        state.speedMode = prev;
        renderSpeedControl();
        return;
    }
    safeStorageWrite(SPEED_PREF_KEY, state.speedMode);
}
