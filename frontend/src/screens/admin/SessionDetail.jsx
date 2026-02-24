"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchSessionDetail } from "../../api/adminApi";
import { useSocket } from "../../hooks/useSocket";
import ExcelJS from "exceljs";

const SessionDetail = () => {
  const clickWindowSeconds = Math.round(
    (Number(process.env.NEXT_PUBLIC_CLICK_WINDOW_MS) || 60000) / 1000,
  );
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [responses, setResponses] = useState([]);

  const load = async () => {
    try {
      const { data } = await fetchSessionDetail(id);
      setSession(data.session);
      setResponses(data.responses);
    } catch (error) {
      console.error("Failed to load session details", error);
    }
  };

  const exportSessionToExcel = async () => {
    if (!session) return;

    const workbook = new ExcelJS.Workbook();
    const summary = workbook.addWorksheet("Summary");
    summary.columns = [
      { header: "Field", key: "field", width: 18 },
      { header: "Value", key: "value", width: 36 },
    ];

    summary.addRows([
      ["Student", `${session.student_id} - ${session.name}`],
      ["Exam", session.exam_title],
      ["Clicks", session.total_clicks],
      ["Avg Stress", Math.round(Number(session.avg_stress_level || 0))],
      ["Violations", session.violation_count || 0],
      ["Click Window (sec)", clickWindowSeconds],
      ["Started", session.started_at],
      ["Submitted", session.submitted_at || "Not yet"],
    ]);
    summary.getRow(1).font = { bold: true };

    const responsesSheet = workbook.addWorksheet("Responses");
    responsesSheet.columns = [
      { header: "Question", key: "question", width: 40 },
      { header: "Answer", key: "answer", width: 28 },
      { header: "Stress", key: "stress", width: 10 },
      { header: "Violations", key: "violations", width: 12 },
      { header: "Total Clicks", key: "total", width: 14 },
      { header: "Header", key: "header", width: 10 },
      { header: "Stress Bar", key: "stressBar", width: 12 },
      { header: "Question Clicks", key: "questionClicks", width: 16 },
      { header: "Navigation", key: "navigation", width: 12 },
      { header: "Other", key: "other", width: 10 },
    ];

    responses.forEach((r) => {
      responsesSheet.addRow([
        r.text,
        r.answer || "-",
        Math.round(Number(r.avg_stress_level || 0)),
        r.violation_count || 0,
        r.click_count,
        r.header_clicks,
        r.stress_clicks,
        r.question_clicks,
        r.footer_clicks,
        r.other_clicks,
      ]);
    });

    responsesSheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `session_${session.id}_${new Date().toISOString().slice(0, 10)}.xlsx`;
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
          <button className="btn export-btn" type="button" onClick={exportSessionToExcel}>
            Export Excel
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
            <strong>Started:</strong> {session.started_at}
          </div>
          <div>
            <strong>Submitted:</strong> {session.submitted_at || "Not yet"}
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
    </div>
  );
};

export default SessionDetail;
