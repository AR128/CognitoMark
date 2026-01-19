import { useEffect, useState } from "react";
import { createExam, deleteExam, fetchExams } from "../../api/adminApi";

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [title, setTitle] = useState("");

  const load = async () => {
    const { data } = await fetchExams();
    setExams(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) return;
    await createExam({ title });
    setTitle("");
    load();
  };

  const handleDelete = async (id) => {
    await deleteExam(id);
    load();
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
                  <button className="btn danger" onClick={() => handleDelete(exam.id)}>
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
