(() => {
    const ParticipantConfig = {
        CHAT_STAGES: ["daily", "evolution", "experience", "difficulty", "impact", "wrapup"],
        TRACK_STAGES: ["consent_pending", "daily", "evolution", "experience", "difficulty", "impact", "wrapup", "review", "done"],

        STAGE_NAMES: {
            consent_pending: "同意访谈",
            daily: "日常场景",
            evolution: "变化节点",
            experience: "体验感受",
            difficulty: "阻碍与应对",
            impact: "影响与反思",
            wrapup: "收尾补充",
            review: "草稿审阅",
            done: "定稿完成",
            withdrawn: "已撤回"
        },

        TRACK_LABELS: {
            consent_pending: "同意访谈",
            daily: "日常",
            evolution: "变化",
            experience: "体验",
            difficulty: "困难",
            impact: "影响",
            wrapup: "补充",
            review: "审阅",
            done: "完成"
        },

        STAGE_HINTS: {
            consent_pending: "确认知情同意后才会进入正式访谈。",
            daily: "从最近一次学习片段讲起，越具体越好。",
            evolution: "说明学习方式为什么改变、何时改变。",
            experience: "把情绪放进具体事件，而不是抽象评价。",
            difficulty: "说清困难、应对策略和实际效果。",
            impact: "扩展到生活、工作和认同层面的影响。",
            wrapup: "补充遗漏信息，准备生成自传草稿。",
            review: "草稿可反复修改，直到你满意。",
            done: "访谈完成，仍可继续微调文字。"
        },

        STAGE_THEME: {
            consent_pending: { start: "#22c55e", end: "#16a34a", tail: "#16a34a", rgb: "22,163,74" },
            daily: { start: "#1f6cff", end: "#0a84ff", tail: "#1b73e8", rgb: "10,132,255" },
            evolution: { start: "#8b5cf6", end: "#7c3aed", tail: "#7c3aed", rgb: "124,58,237" },
            experience: { start: "#f59e0b", end: "#ea580c", tail: "#ea580c", rgb: "234,88,12" },
            difficulty: { start: "#ef4444", end: "#dc2626", tail: "#dc2626", rgb: "220,38,38" },
            impact: { start: "#10b981", end: "#059669", tail: "#059669", rgb: "5,150,105" },
            wrapup: { start: "#06b6d4", end: "#0891b2", tail: "#0891b2", rgb: "8,145,178" },
            review: { start: "#f97316", end: "#ea580c", tail: "#ea580c", rgb: "234,88,12" },
            done: { start: "#22c55e", end: "#16a34a", tail: "#16a34a", rgb: "22,163,74" },
            withdrawn: { start: "#9aa5b5", end: "#7a8798", tail: "#7a8798", rgb: "122,135,152" }
        },

        STAGE_REQUIREMENT_TOTAL: {
            consent_pending: 1,
            daily: 2,
            evolution: 2,
            experience: 2,
            difficulty: 2,
            impact: 2,
            wrapup: 1,
            review: 1,
            done: 0
        },

        STAGE_GUIDE: {
            consent_pending: {
                title: "开始前先确认知情同意",
                desc: "点“我同意并开始”后就会进入正式访谈，且引导弹窗自动消失。",
                sparks: []
            },
            daily: {
                title: "从最近一次场景说起",
                desc: "描述平台、时间、内容、场景，尽量像回忆具体片段。",
                sparks: [
                    "最近一次是昨晚11点，我在B站学了40分钟。",
                    "我通常在通勤时刷内容，睡前再整理笔记。",
                    "我周末会集中学习2小时，工作日更碎片化。",
                    "我最常用的平台是____，主要学习____。"
                ]
            },
            evolution: {
                title: "讲清变化前后",
                desc: "找一个关键节点，说明学习方式为什么改变。",
                sparks: [
                    "找工作那年，我从碎片化阅读转到系统课程。",
                    "入职后我学习从考试导向变成问题导向。",
                    "某次失败让我重置了学习方法。",
                    "以前我主要____，现在我更重视____。"
                ]
            },
            experience: {
                title: "让情绪有场景",
                desc: "不要只写“焦虑/充实”，讲触发情绪的具体时刻。",
                sparks: [
                    "那次连续打卡让我有成就感，但也很疲惫。",
                    "直播自习提高了效率，但结束后会空落。",
                    "我发现自己容易被“高效感”吸引。",
                    "最难忘的一次是____，因为____。"
                ]
            },
            difficulty: {
                title: "困难 + 策略 + 结果",
                desc: "每个问题后面补一句你怎么应对，效果如何。",
                sparks: [
                    "我先限定一个主题，避免全平台漫游。",
                    "番茄钟前30分钟有效，后面仍会分心。",
                    "每周复盘后，我的焦虑下降明显。",
                    "我最大的困难是____，我试过____。"
                ]
            },
            impact: {
                title: "扩展到生活影响",
                desc: "除了学业/工作，也可以说关系、作息、认同变化。",
                sparks: [
                    "学习效率提升了，但休息时间被压缩。",
                    "我更愿意分享知识，也更怕落后。",
                    "持续学习变成了我的自我要求。",
                    "我最珍视的是____，最矛盾的是____。"
                ]
            },
            wrapup: {
                title: "最后补一条关键故事",
                desc: "检查遗漏内容，或补充匿名化需求。",
                sparks: [
                    "还有一段经历我希望写进自传：",
                    "请把我提到的单位和地点进一步匿名化。",
                    "我没有更多补充，可以进入草稿阶段。",
                    "我最想保留的一段反思是____。"
                ]
            },
            review: {
                title: "草稿审阅中",
                desc: "先读草稿，再给明确的修改指令。",
                sparks: []
            },
            done: {
                title: "已完成定稿",
                desc: "如果需要微调，仍可继续修改草稿。",
                sparks: []
            },
            withdrawn: {
                title: "访谈已撤回",
                desc: "当前会话已结束，可联系研究者确认后续处理。",
                sparks: []
            }
        },

        TOKEN_KEY: "interview_token",
        SPEED_PREF_KEY: "thinking_speed_mode",
        FAB_POS_KEY: "progress_fab_pos_v1",
        COOKIE_TOKEN_KEY: "abi_token",
        COOKIE_STAGE_KEY: "abi_stage",
        COOKIE_CONSENT_KEY: "abi_consented",

        FAST_MODEL_ID: "doubao-seed-2-0-mini-260215",
        BALANCED_MODEL_ID: "doubao-seed-2-0-lite-260215",
        DEEP_MODEL_ID: "doubao-seed-2-0-pro-260215",
        DEFAULT_MODELS: [
            "doubao-seed-2-0-mini-260215",
            "doubao-seed-2-0-lite-260215",
            "doubao-seed-2-0-pro-260215"
        ],

        FAB_SIZE: 56,
        FAB_MARGIN: 12,

        STAGE_MIN_ANSWER_COUNT: {
            daily: 2,
            evolution: 2,
            experience: 2,
            difficulty: 2,
            impact: 2,
            wrapup: 1
        },

        STAGE_MIN_ANSWER_CHARS: {
            daily: 40,
            evolution: 50,
            experience: 50,
            difficulty: 50,
            impact: 50,
            wrapup: 20
        }
    };

    window.ParticipantConfig = ParticipantConfig;
})();
