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
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    const saved = storage.get("exams") || [];
    setExams(saved);
  }, []);

  const handleStart = async () => {
    setError("");
    try {
      if (typeof document !== "undefined") {
        const element = document.documentElement;
        if (!document.fullscreenElement && element.requestFullscreen) {
          await element.requestFullscreen();
        }
      }

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
          <button
            className="btn secondary"
            type="button"
            onClick={() => setPickerOpen(true)}
            style={{ fontSize: "1.05rem", padding: "14px 16px" }}
          >
            {selected
              ? `Selected: ${exams.find((e) => String(e.id) === selected)?.title || "Exam"}`
              : "Select an exam"}
          </button>
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
      {pickerOpen && (
        <div className="modal-backdrop" onClick={() => setPickerOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Select an exam</h3>
            </div>
            <div className="modal-body">
              {exams.length === 0 ? (
                <p>No exams available.</p>
              ) : (
                <div className="exam-picker">
                  {exams.map((exam) => (
                    <button
                      key={exam.id}
                      type="button"
                      className={`exam-option${
                        String(exam.id) === selected ? " selected" : ""
                      }`}
                      onClick={() => {
                        setSelected(String(exam.id));
                        setPickerOpen(false);
                      }}
                    >
                      {exam.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn secondary"
                type="button"
                onClick={() => setPickerOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartExam;
