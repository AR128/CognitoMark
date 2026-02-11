"use client";

import { useEffect, useState } from "react";
import { createExam, deleteExam, fetchExams } from "../../api/adminApi";

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    try {
      setError("");
      const { data } = await fetchExams();
      setExams(data);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load exams.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) return;
    try {
      setError("");
      await createExam({ title });
      setTitle("");
      load();
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create exam.");
    }
  };

  const handleDelete = async (id) => {
    if (deletingId) return;
    const confirmed = window.confirm("Delete this exam and all related data?");
    if (!confirmed) return;
    try {
      setError("");
      setDeletingId(id);
      await deleteExam(id);
      setExams((prev) => prev.filter((exam) => exam.id !== id));
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to delete exam.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container">
      <h2>Exams</h2>
      <div className="card">
        <div className="grid two">
          <input
            className="input"
            placeholder="Exam title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="btn" onClick={handleCreate}>Create Exam</button>
        </div>
      </div>

      <div className="card">
        {error && <div className="alert error">{error}</div>}
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.title}</td>
                <td>{exam.created_at}</td>
                <td>
                  <button
                    className="btn danger"
                    onClick={() => handleDelete(exam.id)}
                    disabled={deletingId === exam.id}
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

export default Exams;
