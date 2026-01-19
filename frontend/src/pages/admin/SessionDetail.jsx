import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSessionDetail } from "../../api/adminApi";

const SessionDetail = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [responses, setResponses] = useState([]);

  const load = async () => {
    const { data } = await fetchSessionDetail(id);
    setSession(data.session);
    setResponses(data.responses);
  };

  useEffect(() => {
    load();
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
      <h2>Session Detail</h2>
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
            <div key={r.id} className="card" style={{ background: "var(--card-2)" }}>
              <p><strong>Q:</strong> {r.text}</p>
              <p><strong>A:</strong> {r.answer || "-"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;
