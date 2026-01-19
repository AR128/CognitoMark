import { useEffect, useMemo, useState } from "react";
import { fetchDashboard } from "../../api/adminApi";
import MetricCard from "../../components/MetricCard";
import { useSocket } from "../../hooks/useSocket";

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    activeStudents: 0,
    submittedStudents: 0,
    averageStress: 0,
    averageClicks: 0,
  });
  const [sessions, setSessions] = useState([]);
  const [feed, setFeed] = useState([]);

  const pushFeed = (message) => {
    setFeed((prev) => [{ id: Date.now(), message }, ...prev].slice(0, 20));
  };

  const refresh = async () => {
    const { data } = await fetchDashboard();
    setMetrics(data.metrics);
    setSessions(data.sessions);
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
      click_update: (payload) => {
        pushFeed(`Clicks updated for session ${payload.sessionId}`);
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
    []
  );

  useSocket(handlers);

  return (
    <div className="container">
      <h2>Live Dashboard</h2>
      <div className="grid four" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <MetricCard label="Active Students" value={metrics.activeStudents} />
        <MetricCard label="Submitted" value={metrics.submittedStudents} />
        <MetricCard label="Avg Stress" value={metrics.averageStress} />
        <MetricCard label="Avg Clicks" value={metrics.averageClicks} />
      </div>

      <div className="grid two" style={{ marginTop: 16 }}>
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
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Exam</th>
                <th>Clicks</th>
                <th>Stress</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td>{s.student_id}</td>
                  <td>{s.exam_title}</td>
                  <td>{s.total_clicks}</td>
                  <td>{s.stress_level}</td>
                  <td>{s.submitted_at ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
