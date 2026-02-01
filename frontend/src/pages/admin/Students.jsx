import { useEffect, useState } from "react";
import { deleteStudent, fetchStudents } from "../../api/adminApi";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

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

  const handleDelete = async (id) => {
    if (deletingId) return;
    const confirmed = window.confirm("Delete this student and all related data?");
    if (!confirmed) return;
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
                    onClick={() => handleDelete(s.id)}
                    disabled={deletingId === s.id}
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

export default Students;
