import { useEffect, useMemo, useState } from "react";
import { debounce } from "../../utils/debounce";
import { storage } from "../../utils/storage";
import { saveResponse, submitExam, updateClicks, updateStress } from "../../api/sessionApi";

const StudentExam = () => {
  const session = storage.get("session");
  const exam = storage.get("exam");
  const questions = storage.get("questions") || [];

  const [answers, setAnswers] = useState({});
  const [clicks, setClicks] = useState(0);
  const [stress, setStress] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!session) {
      setStatus("No active session. Please start an exam.");
    }
  }, [session]);

  const debouncedSave = useMemo(
    () =>
      debounce(async (questionId, answer) => {
        if (!session || submitted) return;
        await saveResponse(session.id, { questionId, answer });
      }, 500),
    [session, submitted]
  );

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    debouncedSave(questionId, value);
  };

  const handleClick = () => {
    if (!session || submitted) return;
    const nextClicks = clicks + 1;
    setClicks(nextClicks);
    updateClicks(session.id, { totalClicks: nextClicks });
  };

  const handleStress = (value) => {
    setStress(value);
    if (session && !submitted) {
      updateStress(session.id, { stressLevel: Number(value) });
    }
  };

  const handleSubmit = async () => {
    if (!session) return;
    await submitExam(session.id, { feedback: "" });
    setSubmitted(true);
    setStatus("Submitted");
  };

  if (!session) {
    return (
      <div className="container">
        <div className="card">{status}</div>
      </div>
    );
  }

  return (
    <div className="container" onClick={handleClick}>
      <div className="card">
        <h2>{exam?.title || "Exam"}</h2>
        <div className="badge">Session #{session.id}</div>
        {submitted && <p className="notice">Submitted</p>}
      </div>

      <div className="card">
        <label>Stress Level: {stress}</label>
        <input
          type="range"
          min="1"
          max="10"
          value={stress}
          onChange={(e) => handleStress(e.target.value)}
          disabled={submitted}
        />
      </div>

      <div className="card">
        <h3>Questions</h3>
        <div className="grid">
          {questions.map((q) => (
            <div key={q.id} className="card" style={{ background: "var(--card-2)" }}>
              <p>{q.text}</p>
              {q.type === "mcq" ? (
                <select
                  className="input"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  disabled={submitted}
                >
                  <option value="">Select option</option>
                  {q.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <textarea
                  className="input"
                  rows="3"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  disabled={submitted}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <button className="btn" onClick={handleSubmit} disabled={submitted}>
          Submit Exam
        </button>
      </div>
    </div>
  );
};

export default StudentExam;
