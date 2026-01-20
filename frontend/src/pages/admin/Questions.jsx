import { useEffect, useState } from "react";
import {
  createQuestion,
  deleteQuestion,
  fetchExams,
  fetchQuestions,
} from "../../api/adminApi";

const Questions = () => {
  const [exams, setExams] = useState([]);
  const [selected, setSelected] = useState("");
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ text: "", type: "mcq", options: "" });
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadExams = async () => {
    try {
      setError("");
      const { data } = await fetchExams();
      setExams(data);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load exams.");
    }
  };

  const loadQuestions = async (examId) => {
    if (!examId) return;
    try {
      setError("");
      const { data } = await fetchQuestions(examId);
      setQuestions(data);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load questions.");
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  useEffect(() => {
    loadQuestions(selected);
  }, [selected]);

  const handleCreate = async () => {
    if (!selected || !form.text.trim()) return;
    const options = form.type === "mcq"
      ? form.options.split(",").map((o) => o.trim()).filter(Boolean)
      : [];

    try {
      setError("");
      await createQuestion({
        examId: Number(selected),
        text: form.text,
        type: form.type,
        options,
      });

      setForm({ text: "", type: "mcq", options: "" });
      loadQuestions(selected);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create question.");
    }
  };

  const handleDelete = async (id) => {
    if (deletingId) return;
    const confirmed = window.confirm("Delete this question and its responses?");
    if (!confirmed) return;
    try {
      setError("");
      setDeletingId(id);
      await deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to delete question.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container">
      <h2>Questions</h2>
      <div className="card grid">
        <select
          className="input"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Select Exam</option>
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.title}
            </option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Question text"
          value={form.text}
          onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
        />

        <select
          className="input"
          value={form.type}
          onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
        >
          <option value="mcq">MCQ</option>
          <option value="text">Text</option>
        </select>

        {form.type === "mcq" && (
          <input
            className="input"
            placeholder="Options (comma separated)"
            value={form.options}
            onChange={(e) => setForm((prev) => ({ ...prev, options: e.target.value }))}
          />
        )}

        <button className="btn" onClick={handleCreate}>Add Question</button>
      </div>

      <div className="card">
        {error && <div className="alert error">{error}</div>}
        <table className="table">
          <thead>
            <tr>
              <th>Text</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <td>{q.text}</td>
                <td>{q.type}</td>
                <td>
                  <button
                    className="btn danger"
                    onClick={() => handleDelete(q.id)}
                    disabled={deletingId === q.id}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Questions;
