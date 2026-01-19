import { useEffect, useState } from "react";
import { deleteStudent, fetchStudents } from "../../api/adminApi";

const Students = () => {
  const [students, setStudents] = useState([]);

  const load = async () => {
    const { data } = await fetchStudents();
    setStudents(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    await deleteStudent(id);
    load();
  };

  return (
    <div className="container">
      <h2>Students</h2>
      <div className="card">
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
                  <button className="btn danger" onClick={() => handleDelete(s.id)}>
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
