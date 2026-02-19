(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/utils/debounce.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "debounce",
    ()=>debounce
]);
const debounce = (fn, delay = 400)=>{
    let timer;
    return (...args)=>{
        clearTimeout(timer);
        timer = setTimeout(()=>fn(...args), delay);
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/storage.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "storage",
    ()=>storage
]);
const storage = {
    get (key) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch  {
            return null;
        }
    },
    set (key, value) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove (key) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        localStorage.removeItem(key);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/client.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/storage.js [app-client] (ecmascript)");
;
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: ("TURBOPACK compile-time value", "http://10.186.122.148:5000")
});
api.interceptors.request.use((config)=>{
    const token = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"].get("adminToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/sessionApi.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchClickSeries",
    ()=>fetchClickSeries,
    "logClickFrequency",
    ()=>logClickFrequency,
    "logViolation",
    ()=>logViolation,
    "saveResponse",
    ()=>saveResponse,
    "submitExam",
    ()=>submitExam,
    "updateClicks",
    ()=>updateClicks,
    "updateStress",
    ()=>updateStress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/client.js [app-client] (ecmascript)");
;
const saveResponse = (sessionId, payload)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/api/sessions/${sessionId}/response`, payload);
const updateClicks = (sessionId, payload)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/api/sessions/${sessionId}/clicks`, payload);
const logClickFrequency = (sessionId, payload)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/api/sessions/${sessionId}/click-frequency`, payload);
const fetchClickSeries = (sessionId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/api/sessions/${sessionId}/click-series`);
const updateStress = (sessionId, payload)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/api/sessions/${sessionId}/stress`, payload);
const submitExam = (sessionId, payload)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/api/sessions/${sessionId}/submit`, payload);
const logViolation = (sessionId, payload)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/api/sessions/${sessionId}/violation`, payload);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/screens/student/Exam.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$debounce$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/debounce.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/storage.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$sessionApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/sessionApi.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const hasAnswerValue = (value)=>{
    if (value === undefined || value === null) {
        return false;
    }
    if (typeof value === "string") {
        return value.trim().length > 0;
    }
    return true;
};
const resolveViolationThreshold = ()=>{
    const rawValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_VIOLATION_THRESHOLD;
    const configured = Number(rawValue);
    return Number.isFinite(configured) && configured > 0 ? configured : 3;
};
const VIOLATION_THRESHOLD = resolveViolationThreshold();
const VIOLATION_WARNING = "Tab switching or minimizing is not allowed during the exam.";
const resolveClickWindowMs = ()=>{
    const rawValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLICK_WINDOW_MS;
    const configured = Number(rawValue);
    return Number.isFinite(configured) && configured > 0 ? configured : 40000;
};
const CLICK_WINDOW_MS = resolveClickWindowMs();
const StudentExam = ()=>{
    _s();
    const [sessionData, setSessionData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "StudentExam.useState": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"].get("session")
    }["StudentExam.useState"]);
    const [exam, setExam] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "StudentExam.useState": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"].get("exam")
    }["StudentExam.useState"]);
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "StudentExam.useState": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"].get("questions") || []
    }["StudentExam.useState"]);
    const [sessionId, setSessionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "StudentExam.useState": ()=>("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("sessionId") : "TURBOPACK unreachable"
    }["StudentExam.useState"]);
    const [answers, setAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [stress, setStress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(5);
    const [submitted, setSubmitted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "StudentExam.useState": ()=>Boolean(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"].get("session")?.submitted_at)
    }["StudentExam.useState"]);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [violationCount, setViolationCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [violationModal, setViolationModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        visible: false,
        message: ""
    });
    const [currentQuestionIndex, setCurrentQuestionIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const sectionClicksRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        header: 0,
        integrity: 0,
        stress: 0,
        question: 0,
        footer: 0,
        other: 0
    });
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const redirectTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const enforcementActive = Boolean(sessionData?.id) && !submitted;
    const clickWindowStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clickCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const clickQueueRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const flushInProgressRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const clickTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StudentExam.useEffect": ()=>({
                "StudentExam.useEffect": ()=>{
                    if (redirectTimeoutRef.current) {
                        clearTimeout(redirectTimeoutRef.current);
                    }
                }
            })["StudentExam.useEffect"]
    }["StudentExam.useEffect"], []);
    const clearSessionArtifacts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StudentExam.useCallback[clearSessionArtifacts]": ()=>{
            [
                "session",
                "exam",
                "questions",
                "student",
                "exams"
            ].forEach({
                "StudentExam.useCallback[clearSessionArtifacts]": (key)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"].remove(key)
            }["StudentExam.useCallback[clearSessionArtifacts]"]);
            [
                "studentDbId",
                "sessionId",
                "examId"
            ].forEach({
                "StudentExam.useCallback[clearSessionArtifacts]": (key)=>localStorage.removeItem(key)
            }["StudentExam.useCallback[clearSessionArtifacts]"]);
            setSessionData(null);
            setExam(null);
            setQuestions([]);
            setSessionId(null);
            setAnswers({});
            setStress(5);
            setViolationCount(0);
            setViolationModal({
                visible: false,
                message: ""
            });
        }
    }["StudentExam.useCallback[clearSessionArtifacts]"], []);
    const flushClickQueue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StudentExam.useCallback[flushClickQueue]": async ()=>{
            if (!sessionData?.id || flushInProgressRef.current) {
                return;
            }
            flushInProgressRef.current = true;
            try {
                while(clickQueueRef.current.length > 0){
                    const payload = clickQueueRef.current[0];
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$sessionApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logClickFrequency"])(sessionData.id, payload);
                    clickQueueRef.current.shift();
                }
            } finally{
                flushInProgressRef.current = false;
            }
        }
    }["StudentExam.useCallback[flushClickQueue]"], [
        sessionData?.id
    ]);
    const queueClickWindow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StudentExam.useCallback[queueClickWindow]": async (windowStart, windowEnd, clickCount)=>{
            const currentQuestion = questions[currentQuestionIndex];
            const sectionClicks = {
                ...sectionClicksRef.current
            };
            // Reset section clicks for the next window
            sectionClicksRef.current = {
                header: 0,
                integrity: 0,
                stress: 0,
                question: 0,
                footer: 0,
                other: 0
            };
            const payload = {
                windowStart: windowStart.toISOString(),
                windowEnd: windowEnd.toISOString(),
                questionId: currentQuestion?.id,
                headerClicks: sectionClicks.header,
                integrityClicks: sectionClicks.integrity,
                stressClicks: sectionClicks.stress,
                questionClicks: sectionClicks.question,
                footerClicks: sectionClicks.footer,
                otherClicks: sectionClicks.other,
                clickCount
            };
            clickQueueRef.current.push(payload);
            await flushClickQueue();
            return clickQueueRef.current.length === 0;
        }
    }["StudentExam.useCallback[queueClickWindow]"], [
        flushClickQueue,
        questions,
        currentQuestionIndex
    ]);
    const closeCurrentWindow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StudentExam.useCallback[closeCurrentWindow]": async (forceEndTime)=>{
            if (!clickWindowStartRef.current) {
                return true;
            }
            const windowStart = clickWindowStartRef.current;
            const windowEnd = forceEndTime || new Date(windowStart.getTime() + CLICK_WINDOW_MS);
            const clickCount = clickCountRef.current;
            clickCountRef.current = 0;
            clickWindowStartRef.current = windowEnd;
            return queueClickWindow(windowStart, windowEnd, clickCount);
        }
    }["StudentExam.useCallback[closeCurrentWindow]"], [
        queueClickWindow
    ]);
    const requestFullscreen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StudentExam.useCallback[requestFullscreen]": ()=>{
            const element = document.documentElement;
            if (!document.fullscreenElement && element.requestFullscreen) {
                element.requestFullscreen().catch({
                    "StudentExam.useCallback[requestFullscreen]": ()=>{
                    /* ignore */ }
                }["StudentExam.useCallback[requestFullscreen]"]);
            }
        }
    }["StudentExam.useCallback[requestFullscreen]"], []);
    const finalizeClientExit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StudentExam.useCallback[finalizeClientExit]": async (message)=>{
            setSubmitted(true);
            setStatus(message);
            if (clickTimerRef.current) {
                clearInterval(clickTimerRef.current);
                clickTimerRef.current = null;
            }
            await closeCurrentWindow(new Date());
            clearSessionArtifacts();
            if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen().catch({
                    "StudentExam.useCallback[finalizeClientExit]": ()=>{
                    /* ignore */ }
                }["StudentExam.useCallback[finalizeClientExit]"]);
            }
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
            }
            router.replace("/");
        }
    }["StudentExam.useCallback[finalizeClientExit]"], [
        clearSessionArtifacts,
        closeCurrentWindow,
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StudentExam.useEffect": ()=>{
            if (!sessionData?.id || !sessionId || submitted) {
                setStatus({
                    "StudentExam.useEffect": (prev)=>prev || "Redirecting to login..."
                }["StudentExam.useEffect"]);
                router.replace("/");
            }
        }
    }["StudentExam.useEffect"], [
        sessionData,
        sessionId,
        submitted,
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StudentExam.useEffect": ()=>{
            if (enforcementActive) {
                requestFullscreen();
            }
        }
    }["StudentExam.useEffect"], [
        enforcementActive,
        requestFullscreen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StudentExam.useEffect": ()=>{
            if (!enforcementActive) {
                if (clickTimerRef.current) {
                    clearInterval(clickTimerRef.current);
                    clickTimerRef.current = null;
                }
                clickWindowStartRef.current = null;
                clickCountRef.current = 0;
                clickQueueRef.current = [];
                return undefined;
            }
            clickWindowStartRef.current = new Date();
            clickTimerRef.current = window.setInterval({
                "StudentExam.useEffect": ()=>{
                    closeCurrentWindow().catch({
                        "StudentExam.useEffect": ()=>{
                            setStatus("Unable to sync click data. Retrying automatically.");
                        }
                    }["StudentExam.useEffect"]);
                }
            }["StudentExam.useEffect"], CLICK_WINDOW_MS);
            return ({
                "StudentExam.useEffect": ()=>{
                    if (clickTimerRef.current) {
                        clearInterval(clickTimerRef.current);
                        clickTimerRef.current = null;
                    }
                }
            })["StudentExam.useEffect"];
        }
    }["StudentExam.useEffect"], [
        enforcementActive,
        closeCurrentWindow
    ]);
    const handleViolation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StudentExam.useCallback[handleViolation]": async (type, message)=>{
            if (!sessionData?.id || submitted) {
                return;
            }
            setViolationModal({
                visible: true,
                message
            });
            try {
                const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$sessionApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logViolation"])(sessionData.id, {
                    type
                });
                setViolationCount(data.violationCount);
                if (data.forcedSubmit) {
                    await finalizeClientExit(data.message || "Exam auto-submitted due to repeated violations.");
                }
            } catch (error) {
                setStatus(error?.response?.data?.error || "Violation detected. Please stay on the exam page.");
            }
        }
    }["StudentExam.useCallback[handleViolation]"], [
        sessionData?.id,
        submitted,
        finalizeClientExit
    ]);
    const handleClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StudentExam.useCallback[handleClick]": (event)=>{
            if (!sessionData?.id || submitted) return;
            requestFullscreen();
            clickCountRef.current += 1;
            // Identify which section was clicked
            const clickedSection = event.target.closest("[data-section]")?.dataset.section;
            if (clickedSection && sectionClicksRef.current[clickedSection] !== undefined) {
                sectionClicksRef.current[clickedSection] += 1;
            } else {
                sectionClicksRef.current.other += 1;
            }
        }
    }["StudentExam.useCallback[handleClick]"], [
        sessionData?.id,
        submitted,
        requestFullscreen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StudentExam.useEffect": ()=>{
            if (!enforcementActive) {
                return undefined;
            }
            // Global click listener for accurate click counting
            const handleDocumentClick = {
                "StudentExam.useEffect.handleDocumentClick": (event)=>{
                    handleClick(event);
                }
            }["StudentExam.useEffect.handleDocumentClick"];
            // Add global click listener to capture all clicks
            document.addEventListener("click", handleDocumentClick, true);
            const handleVisibility = {
                "StudentExam.useEffect.handleVisibility": ()=>{
                    if (document.visibilityState === "hidden") {
                        handleViolation("MINIMIZE", VIOLATION_WARNING);
                    }
                }
            }["StudentExam.useEffect.handleVisibility"];
            const handleBlur = {
                "StudentExam.useEffect.handleBlur": ()=>handleViolation("TAB_SWITCH", VIOLATION_WARNING)
            }["StudentExam.useEffect.handleBlur"];
            const handleFocus = {
                "StudentExam.useEffect.handleFocus": ()=>setViolationModal({
                        "StudentExam.useEffect.handleFocus": (prev)=>({
                                ...prev,
                                visible: false
                            })
                    }["StudentExam.useEffect.handleFocus"])
            }["StudentExam.useEffect.handleFocus"];
            const handleFullscreenChange = {
                "StudentExam.useEffect.handleFullscreenChange": ()=>{
                    if (!document.fullscreenElement) {
                        handleViolation("FULLSCREEN_EXIT", "Fullscreen mode is required during the exam.");
                    }
                }
            }["StudentExam.useEffect.handleFullscreenChange"];
            const handleKeyDown = {
                "StudentExam.useEffect.handleKeyDown": (event)=>{
                    const key = event.key?.toLowerCase();
                    const ctrlOrMeta = event.ctrlKey || event.metaKey;
                    const altPressed = event.altKey;
                    const blockedShortcut = ctrlOrMeta && [
                        "t",
                        "w",
                        "tab"
                    ].includes(key) || altPressed && key === "tab" || key === "f11";
                    if (blockedShortcut) {
                        event.preventDefault();
                        event.stopPropagation();
                        handleViolation("TAB_SWITCH", "Keyboard shortcuts are disabled during the exam.");
                    }
                }
            }["StudentExam.useEffect.handleKeyDown"];
            document.addEventListener("visibilitychange", handleVisibility);
            window.addEventListener("blur", handleBlur);
            window.addEventListener("focus", handleFocus);
            document.addEventListener("fullscreenchange", handleFullscreenChange);
            window.addEventListener("keydown", handleKeyDown, true);
            return ({
                "StudentExam.useEffect": ()=>{
                    document.removeEventListener("click", handleDocumentClick, true);
                    document.removeEventListener("visibilitychange", handleVisibility);
                    window.removeEventListener("blur", handleBlur);
                    window.removeEventListener("focus", handleFocus);
                    document.removeEventListener("fullscreenchange", handleFullscreenChange);
                    window.removeEventListener("keydown", handleKeyDown, true);
                }
            })["StudentExam.useEffect"];
        }
    }["StudentExam.useEffect"], [
        enforcementActive,
        handleViolation,
        handleClick
    ]);
    const unansweredQuestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "StudentExam.useMemo[unansweredQuestions]": ()=>questions.filter({
                "StudentExam.useMemo[unansweredQuestions]": (q)=>!hasAnswerValue(answers[q.id])
            }["StudentExam.useMemo[unansweredQuestions]"])
    }["StudentExam.useMemo[unansweredQuestions]"], [
        questions,
        answers
    ]);
    const canSubmit = !!sessionData?.id && !submitted && questions.length > 0 && unansweredQuestions.length === 0;
    const debouncedSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "StudentExam.useMemo[debouncedSave]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$debounce$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["debounce"])({
                "StudentExam.useMemo[debouncedSave]": async (questionId, answer)=>{
                    if (!sessionData?.id || submitted) return;
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$sessionApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveResponse"])(sessionData.id, {
                        questionId,
                        answer
                    });
                }
            }["StudentExam.useMemo[debouncedSave]"], 500)
    }["StudentExam.useMemo[debouncedSave]"], [
        sessionData?.id,
        submitted
    ]);
    const handleAnswerChange = (questionId, value)=>{
        setAnswers((prev)=>({
                ...prev,
                [questionId]: value
            }));
        debouncedSave(questionId, value);
    };
    const handleStress = (value)=>{
        const numericValue = Number(value);
        setStress(numericValue);
        if (sessionData?.id && !submitted) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$sessionApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateStress"])(sessionData.id, {
                stressLevel: numericValue
            });
        }
    };
    const handleSubmit = async ()=>{
        if (!sessionData?.id || submitted || !canSubmit) {
            if (!sessionData?.id && !submitted) {
                router.replace("/");
            }
            return;
        }
        try {
            const preparedResponses = questions.map((q)=>({
                    questionId: q.id,
                    answer: answers[q.id]
                })).filter(({ answer })=>hasAnswerValue(answer));
            if (preparedResponses.length) {
                await Promise.all(preparedResponses.map(({ questionId, answer })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$sessionApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveResponse"])(sessionData.id, {
                        questionId,
                        answer
                    })));
            }
            const flushOk = await closeCurrentWindow(new Date());
            if (!flushOk) {
                setStatus("Unable to sync click data. Please try again.");
                return;
            }
            const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$sessionApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["submitExam"])(sessionData.id, {
                feedback: ""
            });
            const successMessage = data?.message || "Exam submitted successfully.";
            await finalizeClientExit(`${successMessage} Redirecting to login...`);
        } catch (error) {
            const message = error?.response?.data?.error || "Unable to submit exam. Please try again.";
            setStatus(message);
        }
    };
    const handleNext = async ()=>{
        if (currentQuestionIndex < questions.length - 1) {
            await closeCurrentWindow(new Date());
            setCurrentQuestionIndex((prev)=>prev + 1);
        }
    };
    const handlePrevious = async ()=>{
        if (currentQuestionIndex > 0) {
            await closeCurrentWindow(new Date());
            setCurrentQuestionIndex((prev)=>prev - 1);
        }
    };
    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const isQuestionAnswered = hasAnswerValue(answers[currentQuestion?.id]);
    if (!sessionData?.id || !sessionId || submitted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                children: status || "Redirecting to login..."
            }, void 0, false, {
                fileName: "[project]/src/screens/student/Exam.jsx",
                lineNumber: 456,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/screens/student/Exam.jsx",
            lineNumber: 455,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container exam-container",
        "data-section": "container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                "data-section": "header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: exam?.title || "Exam"
                    }, void 0, false, {
                        fileName: "[project]/src/screens/student/Exam.jsx",
                        lineNumber: 464,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "badge",
                        children: [
                            "Session #",
                            sessionData.id
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/screens/student/Exam.jsx",
                        lineNumber: 465,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    submitted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "notice",
                        children: "Submitted"
                    }, void 0, false, {
                        fileName: "[project]/src/screens/student/Exam.jsx",
                        lineNumber: 466,
                        columnNumber: 23
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/screens/student/Exam.jsx",
                lineNumber: 463,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                "data-section": "integrity",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Integrity Monitor"
                    }, void 0, false, {
                        fileName: "[project]/src/screens/student/Exam.jsx",
                        lineNumber: 470,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            margin: "0.3rem 0"
                        },
                        children: [
                            "Violations: ",
                            violationCount,
                            "/",
                            VIOLATION_THRESHOLD
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/screens/student/Exam.jsx",
                        lineNumber: 471,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "notice",
                        style: {
                            margin: 0
                        },
                        children: "Leaving or minimizing this window will end your exam."
                    }, void 0, false, {
                        fileName: "[project]/src/screens/student/Exam.jsx",
                        lineNumber: 474,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/screens/student/Exam.jsx",
                lineNumber: 469,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                "data-section": "stress",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Stress Level: ",
                            stress
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/screens/student/Exam.jsx",
                        lineNumber: 480,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "1",
                        max: "10",
                        value: stress,
                        onChange: (e)=>handleStress(e.target.value),
                        disabled: submitted
                    }, void 0, false, {
                        fileName: "[project]/src/screens/student/Exam.jsx",
                        lineNumber: 481,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/screens/student/Exam.jsx",
                lineNumber: 479,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                "data-section": "question",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        children: [
                            "Question ",
                            currentQuestionIndex + 1,
                            " of ",
                            questions.length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/screens/student/Exam.jsx",
                        lineNumber: 492,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    currentQuestion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card",
                        style: {
                            background: "var(--card-2)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: currentQuestion.text
                            }, void 0, false, {
                                fileName: "[project]/src/screens/student/Exam.jsx",
                                lineNumber: 497,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            currentQuestion.type === "mcq" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: "input",
                                value: answers[currentQuestion.id] || "",
                                onChange: (e)=>handleAnswerChange(currentQuestion.id, e.target.value),
                                disabled: submitted,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Select option"
                                    }, void 0, false, {
                                        fileName: "[project]/src/screens/student/Exam.jsx",
                                        lineNumber: 507,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    currentQuestion.options?.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: opt,
                                            children: opt
                                        }, opt, false, {
                                            fileName: "[project]/src/screens/student/Exam.jsx",
                                            lineNumber: 509,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/screens/student/Exam.jsx",
                                lineNumber: 499,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                className: "input",
                                rows: "3",
                                value: answers[currentQuestion.id] || "",
                                onChange: (e)=>handleAnswerChange(currentQuestion.id, e.target.value),
                                disabled: submitted
                            }, void 0, false, {
                                fileName: "[project]/src/screens/student/Exam.jsx",
                                lineNumber: 515,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/screens/student/Exam.jsx",
                        lineNumber: 496,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/screens/student/Exam.jsx",
                lineNumber: 491,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                "data-section": "footer",
                style: {
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    justifyContent: "space-between"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: "1rem"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn",
                                onClick: handlePrevious,
                                disabled: currentQuestionIndex === 0 || submitted,
                                style: {
                                    background: currentQuestionIndex === 0 ? "var(--border)" : "var(--primary)"
                                },
                                children: "Previous"
                            }, void 0, false, {
                                fileName: "[project]/src/screens/student/Exam.jsx",
                                lineNumber: 540,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            !isLastQuestion ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn",
                                onClick: handleNext,
                                disabled: !isQuestionAnswered || submitted,
                                style: {
                                    background: !isQuestionAnswered ? "var(--border)" : "var(--primary)"
                                },
                                children: "Next"
                            }, void 0, false, {
                                fileName: "[project]/src/screens/student/Exam.jsx",
                                lineNumber: 552,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn",
                                onClick: handleSubmit,
                                disabled: !canSubmit || submitted,
                                style: {
                                    background: !canSubmit ? "var(--border)" : "var(--primary)"
                                },
                                children: "Submit Exam"
                            }, void 0, false, {
                                fileName: "[project]/src/screens/student/Exam.jsx",
                                lineNumber: 565,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/screens/student/Exam.jsx",
                        lineNumber: 539,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    !submitted && !isQuestionAnswered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            margin: 0,
                            fontSize: "0.9rem",
                            color: "var(--accent)"
                        },
                        children: "Please answer current question to proceed"
                    }, void 0, false, {
                        fileName: "[project]/src/screens/student/Exam.jsx",
                        lineNumber: 578,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/screens/student/Exam.jsx",
                lineNumber: 529,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            status && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "notice",
                    style: {
                        margin: 0
                    },
                    children: status
                }, void 0, false, {
                    fileName: "[project]/src/screens/student/Exam.jsx",
                    lineNumber: 586,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/screens/student/Exam.jsx",
                lineNumber: 585,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            violationModal.visible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.55)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 999
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "card",
                    style: {
                        maxWidth: 420,
                        textAlign: "center"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: "Warning"
                        }, void 0, false, {
                            fileName: "[project]/src/screens/student/Exam.jsx",
                            lineNumber: 605,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                margin: "1rem 0"
                            },
                            children: violationModal.message
                        }, void 0, false, {
                            fileName: "[project]/src/screens/student/Exam.jsx",
                            lineNumber: 606,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn",
                            onClick: ()=>setViolationModal({
                                    visible: false,
                                    message: ""
                                }),
                            children: "Stay Focused"
                        }, void 0, false, {
                            fileName: "[project]/src/screens/student/Exam.jsx",
                            lineNumber: 607,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/screens/student/Exam.jsx",
                    lineNumber: 604,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/screens/student/Exam.jsx",
                lineNumber: 593,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/screens/student/Exam.jsx",
        lineNumber: 462,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(StudentExam, "eUs4dDtjY/bT1fGXWLwKXdtSNJA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = StudentExam;
const __TURBOPACK__default__export__ = StudentExam;
var _c;
__turbopack_context__.k.register(_c, "StudentExam");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_36ec4d39._.js.map