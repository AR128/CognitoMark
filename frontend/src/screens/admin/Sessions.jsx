"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchSessionDetail, fetchSessions } from "../../api/adminApi";
import { useSocket } from "../../hooks/useSocket";
import ExcelJS from "exceljs";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const clickWindowSeconds = Math.round(
    (Number(process.env.NEXT_PUBLIC_CLICK_WINDOW_MS) || 60000) / 1000,
  );

  const exportToExcel = async () => {
    if (!sessions.length) return;

    const detailResults = await Promise.all(
      sessions.map(async (session) => {
        try {
          const { data } = await fetchSessionDetail(session.id);
          return { session: data.session, responses: data.responses || [] };
        } catch (error) {
          return { session, responses: [] };
        }
      }),
    );

    const headers = [
      "Session ID",
      "Student",
      "Exam",
      "Started",
      "Submitted",
      "Avg Stress",
      "Total Clicks",
      "Header",
      "Stress",
      "Question",
      "Navigation",
      "Other",
      "Question Text",
      "Answer",
      "Question Stress",
      "Response Clicks",
      "Response Header",
      "Response Stress Bar",
      "Response Question",
      "Response Navigation",
      "Response Other",
    ];

    const rows = detailResults.flatMap(({ session, responses }) => {
      const baseRow = [
        session.id,
        session.student_id,
        session.exam_title,
        session.started_at,
        session.submitted_at || "No",
        Math.round(Number(session.avg_stress_level || 0)),
        session.total_clicks,
        session.header_clicks || 0,
        session.stress_clicks || 0,
        session.question_clicks || 0,
        session.navigation_clicks || 0,
        session.other_clicks || 0,
      ];

      const emptyBaseRow = new Array(baseRow.length).fill("");

      if (!responses.length) {
        return [[
          ...baseRow,
          "-",
          "-",
          0,
          0,
          0,
          0,
          0,
          0,
          0,
        ]];
      }

      return responses.map((r, index) => [
        ...(index === 0 ? baseRow : emptyBaseRow),
        r.text,
        r.answer || "-",
        Math.round(Number(r.avg_stress_level || 0)),
        r.click_count,
        r.header_clicks,
        r.stress_clicks,
        r.question_clicks,
        r.footer_clicks,
        r.other_clicks,
      ]);
    });

    const workbook = new ExcelJS.Workbook();
    const metaSheet = workbook.addWorksheet("Metadata");
    metaSheet.columns = [
      { header: "Field", key: "field", width: 22 },
      { header: "Value", key: "value", width: 20 },
    ];
    metaSheet.addRow(["Click Window (sec)", clickWindowSeconds]);
    metaSheet.getRow(1).font = { bold: true };

    const worksheet = workbook.addWorksheet("Sessions");

    const widths = [
      10,
      14,
      16,
      22,
      12,
      10,
      12,
      10,
      10,
      12,
      12,
      10,
      40,
      24,
      12,
      14,
      14,
      16,
      16,
      18,
      12,
    ];

    worksheet.columns = headers.map((header, index) => ({
      header,
      key: `col_${index}`,
      width: widths[index] || 14,
    }));

    rows.forEach((row) => {
      worksheet.addRow(row);
    });

    worksheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sessions_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const load = async () => {
    try {
      const { data } = await fetchSessions();
      setSessions(data);
    } catch (error) {
      console.error("Failed to load sessions", error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handlers = useMemo(
    () => ({
      student_started: () => load(),
      exam_submitted: () => load(),
      session_deleted: () => load(),
      click_update: () => load(),
      click_window: () => load(),
      stress_update: () => load(),
      answer_saved: () => load(),
    }),
    [],
  );

  useSocket(handlers);

  return (
    <div className="container">
      <div className="sessions-header">
        <h2>Sessions</h2>
        <button
          className="btn export-btn"
          type="button"
          onClick={exportToExcel}
          disabled={!sessions.length}
        >
          Export Excel
        </button>
      </div>
      <div className="card">
        {sessions.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--muted)",
            }}
          >
            No exam sessions yet.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Exam</th>
                <th>Total Clicks</th>
                <th>Header</th>
                <th>Stress</th>
                <th>Question</th>
                <th>Navigation</th>
                <th>Other</th>
                <th>Avg Stress</th>
                <th>Violations</th>
                <th>Started</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td>{s.student_id}</td>
                  <td>{s.exam_title}</td>
                  <td>{s.total_clicks}</td>
                  <td>{s.header_clicks}</td>
                  <td>{s.stress_clicks}</td>
                  <td>{s.question_clicks}</td>
                  <td>{s.navigation_clicks}</td>
                  <td>{s.other_clicks}</td>
                  <td>{Math.round(Number(s.avg_stress_level || 0))}</td>
                  <td>
                    {s.violation_count > 0 ? (
                      <span className="badge">
                        {s.violation_count} violations
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{s.started_at}</td>
                  <td>{s.submitted_at ? "Yes" : "No"}</td>
                  <td>
                    <Link
                      className="btn table-action"
                      href={`/admin/session/${s.id}`}
                    >
                      View Answers
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Sessions;
