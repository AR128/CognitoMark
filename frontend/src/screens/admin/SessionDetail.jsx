"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchSessionDetail } from "../../api/adminApi";
import { useSocket } from "../../hooks/useSocket";
const toCsvValue = (value) => {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const buildCsv = (headers, rows) => {
  const lines = [];
  if (headers?.length) {
    lines.push(headers.map(toCsvValue).join(","));
  }
  rows.forEach((row) => {
    lines.push(row.map(toCsvValue).join(","));
  });
  return lines.join("\r\n");
};

const SessionDetail = () => {
  const clickWindowSeconds = Math.round(
    (Number(process.env.NEXT_PUBLIC_CLICK_WINDOW_MS) || 60000) / 1000,
  );
  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return String(value);
    return date.toLocaleString();
  };
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [responses, setResponses] = useState([]);
  const [navigationTransitions, setNavigationTransitions] = useState([]);

  const load = async () => {
    try {
      const { data } = await fetchSessionDetail(id);
      setSession(data.session);
      setResponses(data.responses);
      setNavigationTransitions(data.navigationTransitions || []);
    } catch (error) {
      console.error("Failed to load session details", error);
    }
  };

  const exportSessionToCsv = async () => {
    if (!session) return;

    const summaryHeaders = ["Field", "Value"];
    const summaryRows = [
      ["Student", `${session.student_id} - ${session.name}`],
      ["Exam", session.exam_title],
      ["Clicks", session.total_clicks],
      ["Avg Stress", Math.round(Number(session.avg_stress_level || 0))],
      ["Violations", session.violation_count || 0],
      ["Click Window (sec)", clickWindowSeconds],
      ["Started", formatDateTime(session.started_at)],
      ["Submitted", formatDateTime(session.submitted_at)],
      ["Score", `${session.score_obtained ?? 0} / ${session.score_total ?? 0}`],
    ];

    const responseHeaders = [
      "Question",
      "Answer",
      "Correct Answer",
      "Result",
      "Stress",
      "Violations",
      "Total Clicks",
      "Header",
      "Stress Bar",
      "Question Clicks",
      "Prev",
      "Next",
      "Other",
    ];

    const responseRows = responses.map((r) => [
      r.text,
      r.answer || "-",
      r.correct_answer || "-",
      r.is_correct ? "Correct" : "Wrong",
      Math.round(Number(r.avg_stress_level || 0)),
      r.violation_count || 0,
      r.click_count,
      r.header_clicks,
      r.stress_clicks,
      r.question_clicks,
      r.prev_clicks || 0,
      r.next_clicks || 0,
      r.other_clicks,
    ]);

    const navigationHeaders = [
      "From Question #",
      "To Question #",
      "Direction",
      "Count",
    ];
    const navigationRows = navigationTransitions.map((row) => [
      row.from_question_number ?? row.from_question_id ?? "",
      row.to_question_number ?? row.to_question_id ?? "",
      row.direction,
      row.count,
    ]);

    const csv = [
      "Summary",
      buildCsv(summaryHeaders, summaryRows),
      "",
      "Responses",
      buildCsv(responseHeaders, responseRows),
      "",
      "Navigation",
      buildCsv(navigationHeaders, navigationRows),
    ].join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `session_${session.id}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (id) {
      load();
    }
  }, [id]);

  const handlers = useMemo(
    () => ({
      click_update: (payload) => {
        if (String(payload.sessionId) === String(id)) {
          load();
        }
      },
      click_window: (payload) => {
        if (String(payload.sessionId) === String(id)) {
          load();
        }
      },
      stress_update: (payload) => {
        if (String(payload.sessionId) === String(id)) {
          load();
        }
      },
      answer_saved: (payload) => {
        if (String(payload.sessionId) === String(id)) {
          load();
        }
      },
      navigation: (payload) => {
        if (String(payload.sessionId) === String(id)) {
          load();
        }
      },
      exam_submitted: (payload) => {
        if (String(payload.sessionId) === String(id)) {
          load();
        }
      },
    }),
    [id],
  );

  useSocket(handlers);

  if (!session) {
    return (
      <div className="container">
        <div className="card">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          gap: "12px",
        }}
      >
        <h2 style={{ margin: 0 }}>Session Detail</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn export-btn" type="button" onClick={exportSessionToCsv}>
            Export CSV
          </button>
          <Link href="/admin/sessions" className="btn secondary">
            &larr; Back to Sessions
          </Link>
        </div>
      </div>
      <div className="card">
        <div className="grid two">
          <div>
            <strong>Student:</strong> {session.student_id} - {session.name}
          </div>
          <div>
            <strong>Exam:</strong> {session.exam_title}
          </div>
          <div>
            <strong>Clicks:</strong> {session.total_clicks}
          </div>
          <div>
            <strong>Avg Stress:</strong>{" "}
            {Math.round(Number(session.avg_stress_level || 0))}
          </div>
          <div>
            <strong>Violations:</strong>{" "}
            {session.violation_count > 0 ? (
              <span className="badge">{session.violation_count} violations</span>
            ) : (
              "-"
            )}
          </div>
          <div>
            <strong>Started:</strong> {formatDateTime(session.started_at)}
          </div>
          <div>
            <strong>Submitted:</strong> {formatDateTime(session.submitted_at)}
          </div>
          <div>
            <strong>Score:</strong> {session.score_obtained ?? 0} /{" "}
            {session.score_total ?? 0}
          </div>
          <div>
            <strong>Latest Answer:</strong> {session.latest_answer || "-"}
          </div>
          <div>
            <strong>Latest Question:</strong> {session.latest_question_text || "-"}
          </div>
        </div>
      </div>

      <div className="card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <h3 style={{ margin: 0 }}>Responses</h3>
          {session.violation_count > 0 && (
            <span className="badge">{session.violation_count} violations</span>
          )}
        </div>
        <div className="grid">
          {responses.map((r) => (
            <div
              key={r.id}
              className="card"
              style={{ background: "var(--card-2)" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <p style={{ margin: 0, flex: 1 }}>
                  <strong>Q:</strong> {r.text}
                </p>
                <div style={{ textAlign: "right" }}>
                  <div className="badge">{r.click_count} total clicks</div>
                  {r.violation_count > 0 && (
                    <div style={{ marginTop: "6px" }}>
                      <span className="badge">
                        {r.violation_count} violations
                      </span>
                    </div>
                  )}
                  <div style={{ marginTop: "6px" }}>
                    <span
                      className="badge"
                      style={{
                        background: r.is_correct
                          ? "rgba(41, 245, 154, 0.15)"
                          : "rgba(255, 99, 99, 0.16)",
                        color: r.is_correct ? "var(--green)" : "#ff9b9b",
                        borderColor: r.is_correct
                          ? "rgba(41, 245, 154, 0.4)"
                          : "rgba(255, 99, 99, 0.4)",
                      }}
                    >
                      {r.is_correct ? "Correct" : "Wrong"}
                    </span>
                  </div>
                  <div style={{ marginTop: "6px", fontSize: "12px" }}>
                    <strong>Correct Answer:</strong>{" "}
                    {r.correct_answer || "-"}
                  </div>
                  <div style={{ marginTop: "6px", fontSize: "12px" }}>
                    <strong>Prev:</strong> {r.prev_clicks || 0} |{" "}
                    <strong>Next:</strong> {r.next_clicks || 0}
                  </div>
                  <div style={{ marginTop: "6px", fontSize: "12px" }}>
                    <strong>Stress:</strong>{" "}
                    {Math.round(Number(r.avg_stress_level || 0))}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--muted)",
                      marginTop: "8px",
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "6px 14px",
                      textAlign: "left",
                    }}
                  >
                    <span>Header: {r.header_clicks}</span>
                    <span>Stress Bar: {r.stress_clicks}</span>
                    <span>Panel: {r.panel_clicks || 0}</span>
                    <span>Question: {r.question_clicks}</span>
                    <span>Navigation: {r.footer_clicks}</span>
                    <span>Other: {r.other_clicks}</span>
                  </div>
                </div>
              </div>
              <p style={{ marginTop: "1rem", marginBottom: 0 }}>
                <strong>A:</strong> {r.answer || "-"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Question Navigation</h3>
        {navigationTransitions.length === 0 ? (
          <div style={{ color: "var(--muted)" }}>
            No navigation transitions recorded yet.
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>From #</th>
                  <th>To #</th>
                  <th>Direction</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {navigationTransitions.map((row, idx) => (
                  <tr
                    key={`${row.from_question_id}-${row.to_question_id}-${row.direction}-${idx}`}
                  >
                    <td>{row.from_question_number ?? row.from_question_id ?? "-"}</td>
                    <td>{row.to_question_number ?? row.to_question_id ?? "-"}</td>
                    <td>{row.direction}</td>
                    <td>{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionDetail;
