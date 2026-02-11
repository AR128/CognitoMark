import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSessions } from "../../api/adminApi";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);

  const load = async () => {
    const { data } = await fetchSessions();
    setSessions(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container">
      <h2>Sessions</h2>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Exam</th>
              {/* <th>Clicks</th> */}
              <th>Stress</th>
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
                {/* <td>{s.total_clicks}</td> */}
                <td>{s.stress_level}</td>
                <td>{s.started_at}</td>
                <td>{s.submitted_at ? "Yes" : "No"}</td>
                <td>
                  <Link className="btn secondary" to={`/admin/session/${s.id}`}>
                    View Answers
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sessions;
