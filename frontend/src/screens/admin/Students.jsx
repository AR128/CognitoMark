"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteStudent, fetchStudents } from "../../api/adminApi";
import ConfirmModal from "../../components/ConfirmModal";
import { useSocket } from "../../hooks/useSocket";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, id: null });

  const load = async () => {
    try {
      setError("");
      const { data } = await fetchStudents();
      setStudents(data);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load students.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handlers = useMemo(
    () => ({
      student_created: () => load(),
      student_deleted: () => load(),
    }),
    [],
  );

  useSocket(handlers);

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
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to delete student.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container">
      <h2>Students</h2>
      <div className="card">
        {error && <div className="alert error">{error}</div>}
        {students.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--muted)",
            }}
          >
            No students found.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.student_id}</td>
                  <td>{s.name}</td>
                  <td>{s.created_at}</td>
                  <td>
                    <button
                      className="btn danger"
                      onClick={() => handleDeleteClick(s.id)}
                      disabled={deletingId === s.id}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        isOpen={modal.isOpen}
        title="Delete Student"
        message="Are you sure you want to delete this student? All related data (exam sessions, responses) will be permanently removed."
        onConfirm={handleConfirmDelete}
        onCancel={() => setModal({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default Students;
