"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { startExam } from "../../api/studentApi";
import { storage } from "../../utils/storage";

const StartExam = () => {
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = storage.get("exams") || [];
    setExams(saved);
  }, []);

  const handleStart = async () => {
    setError("");
    try {
      const student = storage.get("student");
      if (!student) {
        router.push("/");
        return;
      }
      const { data } = await startExam(selected, {
        studentId: student.student_id,
      });
      storage.set("session", data.session);
      storage.set("exam", data.exam);
      storage.set("questions", data.questions);
      localStorage.setItem("sessionId", String(data.session.id));
      localStorage.setItem("examId", String(data.exam.id));
      router.push("/exam");
    } catch (err) {
      setError(err.response?.data?.error || "Unable to start exam");
    }
  };

  return (
    <div className="container centered-page">
      <div
        className="card"
        style={{ maxWidth: 520, width: "100%", padding: "3rem" }}
      >
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Start Exam
        </h2>
        <div className="grid" style={{ gap: "1.5rem" }}>
          <select
            className="input"
            style={{
              fontSize: "1.1rem",
              padding: "14px 16px",
            }}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Select an exam</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>
          {error && (
            <div
              className="notice"
              style={{ color: "var(--danger)", textAlign: "center" }}
            >
              {error}
            </div>
          )}
          <button
            className="btn"
            onClick={handleStart}
            disabled={!selected}
            style={{ fontSize: "1.1rem", padding: "14px" }}
          >
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartExam;
