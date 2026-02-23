"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchDashboard } from "../../api/adminApi";
import MetricCard from "../../components/MetricCard";
import { useSocket } from "../../hooks/useSocket";

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    activeStudents: 0,
    submittedStudents: 0,
  });
  const [sessions, setSessions] = useState([]);
  const [clickSeries, setClickSeries] = useState([]);
  const [feed, setFeed] = useState([]);

  const pushFeed = (message) => {
    setFeed((prev) => [{ id: Date.now(), message }, ...prev].slice(0, 20));
  };

  const refresh = async () => {
    const { data } = await fetchDashboard();
    setMetrics(data.metrics);
    setSessions(data.sessions);
    setClickSeries(data.clickSeries || []);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handlers = useMemo(
    () => ({
      student_started: (payload) => {
        pushFeed(`Student ${payload.studentId} started ${payload.examTitle}`);
        refresh();
      },
      student_created: (payload) => {
        pushFeed(`Student ${payload.student?.student_id || ""} created`);
        refresh();
      },
      student_deleted: (payload) => {
        pushFeed(`Student ${payload.studentId} deleted`);
        refresh();
      },
      session_deleted: () => {
        pushFeed("Session deleted");
        refresh();
      },
      exam_created: () => {
        pushFeed("Exam created");
        refresh();
      },
      exam_deleted: () => {
        pushFeed("Exam deleted");
        refresh();
      },
      question_created: () => {
        pushFeed("Question created");
        refresh();
      },
      question_deleted: () => {
        pushFeed("Question deleted");
        refresh();
      },
      click_update: (payload) => {
        pushFeed(`Clicks updated for session ${payload.sessionId}`);
        refresh();
      },
      click_window: (payload) => {
        pushFeed(
          `Click window logged for session ${payload.sessionId} (${payload.clickCount} clicks)`,
        );
        refresh();
      },
      stress_update: (payload) => {
        pushFeed(`Stress updated for session ${payload.sessionId}`);
        refresh();
      },
      answer_saved: (payload) => {
        pushFeed(`Answer saved for session ${payload.sessionId}`);
      },
      exam_submitted: (payload) => {
        pushFeed(`Exam submitted for session ${payload.sessionId}`);
        refresh();
      },
    }),
    [],
  );

  useSocket(handlers);

  return (
    <div className="container">
      <h2>Live Dashboard</h2>
      <div className="grid dashboard-metrics">
        <MetricCard label="Active Students" value={metrics.activeStudents} />
        <MetricCard label="Submitted" value={metrics.submittedStudents} />
      </div>

      <div className="grid dashboard-stack" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Live Activity Feed</h3>
          <div className="feed">
            {feed.map((item) => (
              <div key={item.id} className="feed-item">
                {item.message}
              </div>
            ))}
            {!feed.length && <div className="feed-item">No events yet</div>}
          </div>
        </div>

        <div className="card">
          <h3>Sessions</h3>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Student</th>
                  <th>Exam</th>
                  <th>Total Clicks</th>
                  <th>Avg Stress</th>
                  <th>Started</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <Link href={`/admin/session/${s.id}`}>#{s.id}</Link>
                    </td>
                    <td>
                      {s.student_id}
                      {s.name ? ` - ${s.name}` : ""}
                    </td>
                    <td>{s.exam_title}</td>
                    <td>{s.total_clicks}</td>
                    <td>{Number(s.avg_stress_level || 0).toFixed(2)}</td>
                    <td>
                      {s.started_at
                        ? new Date(s.started_at).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      {s.submitted_at
                        ? new Date(s.submitted_at).toLocaleString()
                        : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Recent Click Windows (40s)</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Exam</th>
                <th>Question</th>
                <th>Window Start</th>
                <th>Window End</th>
                <th>Clicks</th>
              </tr>
            </thead>
            <tbody>
              {clickSeries.map((row, idx) => (
                <tr key={`${row.session_id}-${row.window_start}-${idx}`}>
                  <td>{row.student_id}</td>
                  <td>{row.exam_title}</td>
                  <td>{row.question_text || "General"}</td>
                  <td>{new Date(row.window_start).toLocaleTimeString()}</td>
                  <td>{new Date(row.window_end).toLocaleTimeString()}</td>
                  <td>{row.click_count}</td>
                </tr>
              ))}
              {!clickSeries.length && (
                <tr>
                  <td colSpan="6">No click windows recorded yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
