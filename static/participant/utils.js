(() => {
    const cfg = window.ParticipantConfig || {};

    function parseInviteCodeFromPath() {
        const parts = window.location.pathname.split("/").filter(Boolean);
        if (parts.length >= 2 && parts[0] === "participant") return parts[1];
        return "";
    }

    function safeStorageRead(key, fallback = "") {
        try {
            return window.localStorage.getItem(key) || fallback;
        } catch {
            return fallback;
        }
    }

    function safeStorageWrite(key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch {
            // noop
        }
    }

    function safeStorageRemove(key) {
        try {
            window.localStorage.removeItem(key);
        } catch {
            // noop
        }
    }

    function safeCookieRead(name, fallback = "") {
        try {
            const encoded = encodeURIComponent(name);
            const cookies = String(document.cookie || "").split("; ");
            for (const item of cookies) {
                if (!item) continue;
                const idx = item.indexOf("=");
                if (idx <= 0) continue;
                const key = item.slice(0, idx);
                if (key !== encoded) continue;
                return decodeURIComponent(item.slice(idx + 1));
            }
        } catch {
            // noop
        }
        return fallback;
    }

    function safeCookieWrite(name, value, days = 90) {
        try {
            const safeName = encodeURIComponent(name);
            const safeValue = encodeURIComponent(value || "");
            const maxAge = Math.max(60, Math.floor(days * 24 * 60 * 60));
            document.cookie = `${safeName}=${safeValue}; path=/; max-age=${maxAge}; samesite=lax`;
        } catch {
            // noop
        }
    }

    function safeCookieRemove(name) {
        try {
            const safeName = encodeURIComponent(name);
            document.cookie = `${safeName}=; path=/; max-age=0; samesite=lax`;
        } catch {
            // noop
        }
    }

    function normalizeStage(raw) {
        const stages = Array.isArray(cfg.TRACK_STAGES) ? cfg.TRACK_STAGES : [];
        return stages.includes(raw) ? raw : "consent_pending";
    }

    function normalizeSpeedMode(raw) {
        const text = String(raw || "").trim().toLowerCase();
        if (text === "slow") return "balanced";
        if (text === "fast" || text === "balanced" || text === "deep") return text;
        return "fast";
    }

    function parseErrorDetail(detail) {
        if (!detail) return "请求失败";
        if (typeof detail === "string") return detail;
        if (detail.message && detail.missing_requirements) {
            return `${detail.message}\n- ${detail.missing_requirements.join("\n- ")}`;
        }
        try {
            return JSON.stringify(detail, null, 2);
        } catch {
            return "请求失败";
        }
    }

    window.ParticipantUtils = {
        parseInviteCodeFromPath,
        safeStorageRead,
        safeStorageWrite,
        safeStorageRemove,
        safeCookieRead,
        safeCookieWrite,
        safeCookieRemove,
        normalizeStage,
        normalizeSpeedMode,
        parseErrorDetail,
    };
})();
