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
        router.push("/login");
        return;
      }
      const { data } = await startExam(selected, { studentId: student.student_id });
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
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2>Start Exam</h2>
        <div className="grid">
          <select
            className="input"
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
            <div className="notice" style={{ color: "var(--danger)" }}>
              {error}
            </div>
          )}
          <button className="btn" onClick={handleStart} disabled={!selected}>
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartExam;
