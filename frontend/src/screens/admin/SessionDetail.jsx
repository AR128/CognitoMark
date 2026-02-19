"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchSessionDetail } from "../../api/adminApi";

const SessionDetail = () => {
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

  useEffect(() => {
    if (id) {
      load();
    }
  }, [id]);

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
        }}
      >
        <h2 style={{ margin: 0 }}>Session Detail</h2>
        <Link href="/admin/sessions" className="btn secondary">
          &larr; Back to Sessions
        </Link>
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
            <strong>Stress:</strong> {session.stress_level}
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
        <h3>Responses</h3>
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
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--muted)",
                      marginTop: "8px",
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "4px 12px",
                      textAlign: "left",
                    }}
                  >
                    <span>Header: {r.header_clicks}</span>
                    <span>Monitoring: {r.integrity_clicks}</span>
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
