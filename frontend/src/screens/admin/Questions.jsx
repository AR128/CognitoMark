"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createQuestion,
  deleteQuestion,
  fetchExams,
  fetchQuestions,
  updateQuestionOrder,
} from "../../api/adminApi";
import ConfirmModal from "../../components/ConfirmModal";
import { useSocket } from "../../hooks/useSocket";

const Questions = () => {
  const [exams, setExams] = useState([]);
  const [selected, setSelected] = useState("");
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    text: "",
    type: "mcq",
    options: "",
    correctAnswer: "",
  });
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, id: null });
  const [draggingId, setDraggingId] = useState(null);

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

  const handlers = useMemo(
    () => ({
      exam_created: () => loadExams(),
      exam_deleted: () => {
        loadExams();
        if (selected) {
          loadQuestions(selected);
        }
      },
      question_created: (payload) => {
        if (selected && String(payload.examId) === String(selected)) {
          loadQuestions(selected);
        }
      },
      question_deleted: (payload) => {
        if (selected && String(payload.examId) === String(selected)) {
          loadQuestions(selected);
        }
      },
      question_reordered: (payload) => {
        if (selected && String(payload.examId) === String(selected)) {
          loadQuestions(selected);
        }
      },
    }),
    [selected],
  );

  useSocket(handlers);

  const handleCreate = async () => {
    if (!selected || !form.text.trim()) return;
    const options =
      form.type === "mcq"
        ? form.options
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean)
        : [];
    const trimmedAnswer = form.correctAnswer.trim();
    if (form.type === "mcq" && (!trimmedAnswer || !options.includes(trimmedAnswer))) {
      setError("Correct answer must match one of the MCQ options.");
      return;
    }

    try {
      setError("");
      await createQuestion({
        examId: Number(selected),
        text: form.text,
        type: form.type,
        options,
        correctAnswer: trimmedAnswer || undefined,
      });

      setForm({ text: "", type: "mcq", options: "", correctAnswer: "" });
      loadQuestions(selected);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create question.");
    }
  };

  const handleDeleteClick = (id) => {
    setModal({ isOpen: true, id });
  };

  const handleConfirmDelete = async () => {
    const { id } = modal;
    setModal({ isOpen: false, id: null });

    if (deletingId) return;
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

  const persistOrder = async (nextQuestions) => {
    if (!selected) return;
    try {
      await updateQuestionOrder(
        Number(selected),
        nextQuestions.map((q) => q.id),
      );
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to reorder questions.");
      loadQuestions(selected);
    }
  };

  const handleDragStart = (questionId) => {
    setDraggingId(questionId);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (targetId) => {
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null);
      return;
    }

    const fromIndex = questions.findIndex((q) => q.id === draggingId);
    const toIndex = questions.findIndex((q) => q.id === targetId);
    if (fromIndex < 0 || toIndex < 0) {
      setDraggingId(null);
      return;
    }

    const nextQuestions = [...questions];
    const [moved] = nextQuestions.splice(fromIndex, 1);
    nextQuestions.splice(toIndex, 0, moved);
    setQuestions(nextQuestions);
    setDraggingId(null);
    await persistOrder(nextQuestions);
  };

  return (
    <div className="container">
      <h2>Questions</h2>
      {/* ... existing card grid ... */}
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
          onChange={(e) =>
            setForm((prev) => ({ ...prev, text: e.target.value }))
          }
        />

        <select
          className="input"
          value={form.type}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              type: e.target.value,
              correctAnswer: "",
            }))
          }
        >
          <option value="mcq">MCQ</option>
          <option value="text">Text</option>
        </select>

        {form.type === "mcq" && (
          <input
            className="input"
            placeholder="Options (comma separated)"
            value={form.options}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, options: e.target.value }))
            }
          />
        )}

        {form.type === "mcq" ? (
          <select
            className="input"
            value={form.correctAnswer}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, correctAnswer: e.target.value }))
            }
          >
            <option value="">Select correct answer</option>
            {form.options
              .split(",")
              .map((o) => o.trim())
              .filter(Boolean)
              .map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
          </select>
        ) : (
          <input
            className="input"
            placeholder="Correct answer"
            value={form.correctAnswer}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, correctAnswer: e.target.value }))
            }
          />
        )}

        <button className="btn" onClick={handleCreate}>
          Add Question
        </button>
      </div>

      <div className="card">
        {error && <div className="alert error">{error}</div>}
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Text</th>
              <th>Type</th>
              <th>Correct Answer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, index) => (
              <tr
                key={q.id}
                draggable
                onDragStart={() => handleDragStart(q.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(q.id)}
                className={draggingId === q.id ? "drag-row" : undefined}
              >
                <td>{index + 1}</td>
                <td>{q.text}</td>
                <td>{q.type}</td>
                <td>{q.correct_answer || "-"}</td>
                <td>
                  <button
                    className="btn danger"
                    onClick={() => handleDeleteClick(q.id)}
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

      <ConfirmModal
        isOpen={modal.isOpen}
        title="Delete Question"
        message="Are you sure you want to delete this question? This will also remove any student responses associated with it."
        onConfirm={handleConfirmDelete}
        onCancel={() => setModal({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default Questions;
