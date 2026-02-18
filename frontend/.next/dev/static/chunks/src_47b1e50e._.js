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
"[project]/src/screens/admin/Exams.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
const Exams = ()=>{
    _s();
    const [exams, setExams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [deletingId, setDeletingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const load = async ()=>{
        try {
            setError("");
            const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$adminApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchExams"])();
            setExams(data);
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to load exams.");
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Exams.useEffect": ()=>{
            load();
        }
    }["Exams.useEffect"], []);
    const handleCreate = async ()=>{
        if (!title.trim()) return;
        try {
            setError("");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$adminApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createExam"])({
                title
            });
            setTitle("");
            load();
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to create exam.");
        }
    };
    const handleDelete = async (id)=>{
        if (deletingId) return;
        const confirmed = window.confirm("Delete this exam and all related data?");
        if (!confirmed) return;
        try {
            setError("");
            setDeletingId(id);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$adminApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteExam"])(id);
            setExams((prev)=>prev.filter((exam)=>exam.id !== id));
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to delete exam.");
        } finally{
            setDeletingId(null);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "Exams"
            }, void 0, false, {
                fileName: "[project]/src/screens/admin/Exams.jsx",
                lineNumber: 56,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid two",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            className: "input",
                            placeholder: "Exam title",
                            value: title,
                            onChange: (e)=>setTitle(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/screens/admin/Exams.jsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn",
                            onClick: handleCreate,
                            children: "Create Exam"
                        }, void 0, false, {
                            fileName: "[project]/src/screens/admin/Exams.jsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/screens/admin/Exams.jsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/screens/admin/Exams.jsx",
                lineNumber: 57,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                children: [
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "alert error",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/screens/admin/Exams.jsx",
                        lineNumber: 70,
                        columnNumber: 19
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "table",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "Title"
                                        }, void 0, false, {
                                            fileName: "[project]/src/screens/admin/Exams.jsx",
                                            lineNumber: 74,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "Created"
                                        }, void 0, false, {
                                            fileName: "[project]/src/screens/admin/Exams.jsx",
                                            lineNumber: 75,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "Action"
                                        }, void 0, false, {
                                            fileName: "[project]/src/screens/admin/Exams.jsx",
                                            lineNumber: 76,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/screens/admin/Exams.jsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/screens/admin/Exams.jsx",
                                lineNumber: 72,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: exams.map((exam)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: exam.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/screens/admin/Exams.jsx",
                                                lineNumber: 82,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: exam.created_at
                                            }, void 0, false, {
                                                fileName: "[project]/src/screens/admin/Exams.jsx",
                                                lineNumber: 83,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "btn danger",
                                                    onClick: ()=>handleDelete(exam.id),
                                                    disabled: deletingId === exam.id,
                                                    children: "Delete"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/screens/admin/Exams.jsx",
                                                    lineNumber: 85,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/screens/admin/Exams.jsx",
                                                lineNumber: 84,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, exam.id, true, {
                                        fileName: "[project]/src/screens/admin/Exams.jsx",
                                        lineNumber: 81,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/src/screens/admin/Exams.jsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/screens/admin/Exams.jsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/screens/admin/Exams.jsx",
                lineNumber: 69,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/screens/admin/Exams.jsx",
        lineNumber: 55,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Exams, "VhFlJSR/gr6wrNs9bsjIYa2hDyk=");
_c = Exams;
const __TURBOPACK__default__export__ = Exams;
var _c;
__turbopack_context__.k.register(_c, "Exams");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_47b1e50e._.js.map