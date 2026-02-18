(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
    baseURL: ("TURBOPACK compile-time value", "http://localhost:5000")
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
"[project]/src/api/adminApi.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminLogin",
    ()=>adminLogin,
    "createExam",
    ()=>createExam,
    "createQuestion",
    ()=>createQuestion,
    "deleteExam",
    ()=>deleteExam,
    "deleteQuestion",
    ()=>deleteQuestion,
    "deleteStudent",
    ()=>deleteStudent,
    "fetchDashboard",
    ()=>fetchDashboard,
    "fetchExams",
    ()=>fetchExams,
    "fetchQuestions",
    ()=>fetchQuestions,
    "fetchSessionDetail",
    ()=>fetchSessionDetail,
    "fetchSessions",
    ()=>fetchSessions,
    "fetchStudents",
    ()=>fetchStudents
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/client.js [app-client] (ecmascript)");
;
const adminLogin = (payload)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/api/admin/login", payload);
const fetchDashboard = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/api/admin/dashboard/live");
const fetchExams = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/api/admin/exams");
const createExam = (payload)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/api/admin/exams", payload);
const deleteExam = (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/api/admin/exams/${id}`);
const fetchQuestions = (examId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/api/admin/exams/${examId}/questions`);
const createQuestion = (payload)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/api/admin/questions", payload);
const deleteQuestion = (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/api/admin/questions/${id}`);
const fetchStudents = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/api/admin/students");
const deleteStudent = (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/api/admin/students/${id}`);
const fetchSessions = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/api/admin/sessions");
const fetchSessionDetail = (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/api/admin/sessions/${id}`);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/screens/admin/Questions.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$adminApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/adminApi.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const Questions = ()=>{
    _s();
    const [exams, setExams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        text: "",
        type: "mcq",
        options: ""
    });
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [deletingId, setDeletingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const loadExams = async ()=>{
        try {
            setError("");
            const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$adminApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchExams"])();
            setExams(data);
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to load exams.");
        }
    };
    const loadQuestions = async (examId)=>{
        if (!examId) return;
        try {
            setError("");
            const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$adminApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchQuestions"])(examId);
            setQuestions(data);
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to load questions.");
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Questions.useEffect": ()=>{
            loadExams();
        }
    }["Questions.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Questions.useEffect": ()=>{
            loadQuestions(selected);
        }
    }["Questions.useEffect"], [
        selected
    ]);
    const handleCreate = async ()=>{
        if (!selected || !form.text.trim()) return;
        const options = form.type === "mcq" ? form.options.split(",").map((o)=>o.trim()).filter(Boolean) : [];
        try {
            setError("");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$adminApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createQuestion"])({
                examId: Number(selected),
                text: form.text,
                type: form.type,
                options
            });
            setForm({
                text: "",
                type: "mcq",
                options: ""
            });
            loadQuestions(selected);
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to create question.");
        }
    };
    const handleDelete = async (id)=>{
        if (deletingId) return;
        const confirmed = window.confirm("Delete this question and its responses?");
        if (!confirmed) return;
        try {
            setError("");
            setDeletingId(id);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$adminApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteQuestion"])(id);
            setQuestions((prev)=>prev.filter((q)=>q.id !== id));
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to delete question.");
        } finally{
            setDeletingId(null);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "Questions"
            }, void 0, false, {
                fileName: "[project]/src/screens/admin/Questions.jsx",
                lineNumber: 88,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card grid",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        className: "input",
                        value: selected,
                        onChange: (e)=>setSelected(e.target.value),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Select Exam"
                            }, void 0, false, {
                                fileName: "[project]/src/screens/admin/Questions.jsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            exams.map((exam)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: exam.id,
                                    children: exam.title
                                }, exam.id, false, {
                                    fileName: "[project]/src/screens/admin/Questions.jsx",
                                    lineNumber: 97,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/screens/admin/Questions.jsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: "input",
                        placeholder: "Question text",
                        value: form.text,
                        onChange: (e)=>setForm((prev)=>({
                                    ...prev,
                                    text: e.target.value
                                }))
                    }, void 0, false, {
                        fileName: "[project]/src/screens/admin/Questions.jsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        className: "input",
                        value: form.type,
                        onChange: (e)=>setForm((prev)=>({
                                    ...prev,
                                    type: e.target.value
                                })),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "mcq",
                                children: "MCQ"
                            }, void 0, false, {
                                fileName: "[project]/src/screens/admin/Questions.jsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "text",
                                children: "Text"
                            }, void 0, false, {
                                fileName: "[project]/src/screens/admin/Questions.jsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/screens/admin/Questions.jsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    form.type === "mcq" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: "input",
                        placeholder: "Options (comma separated)",
                        value: form.options,
                        onChange: (e)=>setForm((prev)=>({
                                    ...prev,
                                    options: e.target.value
                                }))
                    }, void 0, false, {
                        fileName: "[project]/src/screens/admin/Questions.jsx",
                        lineNumber: 120,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn",
                        onClick: handleCreate,
                        children: "Add Question"
                    }, void 0, false, {
                        fileName: "[project]/src/screens/admin/Questions.jsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/screens/admin/Questions.jsx",
                lineNumber: 89,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                children: [
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "alert error",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/screens/admin/Questions.jsx",
                        lineNumber: 132,
                        columnNumber: 19
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "table",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "Text"
                                        }, void 0, false, {
                                            fileName: "[project]/src/screens/admin/Questions.jsx",
                                            lineNumber: 136,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "Type"
                                        }, void 0, false, {
                                            fileName: "[project]/src/screens/admin/Questions.jsx",
                                            lineNumber: 137,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "Actions"
                                        }, void 0, false, {
                                            fileName: "[project]/src/screens/admin/Questions.jsx",
                                            lineNumber: 138,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/screens/admin/Questions.jsx",
                                    lineNumber: 135,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/screens/admin/Questions.jsx",
                                lineNumber: 134,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: questions.map((q)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: q.text
                                            }, void 0, false, {
                                                fileName: "[project]/src/screens/admin/Questions.jsx",
                                                lineNumber: 144,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: q.type
                                            }, void 0, false, {
                                                fileName: "[project]/src/screens/admin/Questions.jsx",
                                                lineNumber: 145,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "btn danger",
                                                    onClick: ()=>handleDelete(q.id),
                                                    disabled: deletingId === q.id,
                                                    children: "Delete"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/screens/admin/Questions.jsx",
                                                    lineNumber: 147,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/screens/admin/Questions.jsx",
                                                lineNumber: 146,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, q.id, true, {
                                        fileName: "[project]/src/screens/admin/Questions.jsx",
                                        lineNumber: 143,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/src/screens/admin/Questions.jsx",
                                lineNumber: 141,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/screens/admin/Questions.jsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/screens/admin/Questions.jsx",
                lineNumber: 131,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/screens/admin/Questions.jsx",
        lineNumber: 87,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Questions, "h5xB4MlMq3FyiI0JWF+Ji7nIbE0=");
_c = Questions;
const __TURBOPACK__default__export__ = Questions;
var _c;
__turbopack_context__.k.register(_c, "Questions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_89da80d5._.js.map