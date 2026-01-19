import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentLogin } from "../../api/studentApi";
import { storage } from "../../utils/storage";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ studentId: "", name: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await studentLogin(form);
      storage.set("student", data.student);
      storage.set("exams", data.exams);
      navigate("/start");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
        <h2>Student Login</h2>
        <p className="notice">Enter your Student ID and Name.</p>
        <form onSubmit={handleSubmit} className="grid">
          <input
            className="input"
            name="studentId"
            placeholder="Student ID"
            value={form.studentId}
            onChange={handleChange}
          />
          <input
            className="input"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
          {error && <div className="notice" style={{ color: "var(--danger)" }}>{error}</div>}
          <button className="btn" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
