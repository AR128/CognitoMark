"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchSessions } from "../../api/adminApi";
import { io } from "socket.io-client";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);

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

    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
    );

    socket.on("student_started", () => {
      load();
    });

    socket.on("exam_submitted", () => {
      load();
    });

    socket.on("session_deleted", () => {
      load();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="container">
      <h2>Sessions</h2>
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
                <th>Clicks</th>
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
                  <td>{s.total_clicks}</td>
                  <td>{s.stress_level}</td>
                  <td>{s.started_at}</td>
                  <td>{s.submitted_at ? "Yes" : "No"}</td>
                  <td>
                    <Link
                      className="btn secondary"
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
