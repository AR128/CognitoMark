"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { studentLogin } from "../../api/studentApi";
import { storage } from "../../utils/storage";

const StudentLogin = () => {
  const router = useRouter();
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
      if (data.student?.id) {
        localStorage.setItem("studentDbId", String(data.student.id));
      }
      router.push("/start");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
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
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Student Login
        </h2>
        <p
          className="notice"
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
          Enter your Student ID and Name.
        </p>
        <form
          onSubmit={handleSubmit}
          className="grid"
          style={{ gap: "1.5rem" }}
        >
          <input
            className="input"
            name="studentId"
            placeholder="Student ID"
            style={{ fontSize: "1.1rem", padding: "12px 16px" }}
            value={form.studentId}
            onChange={handleChange}
          />
          <input
            className="input"
            name="name"
            placeholder="Full Name"
            style={{ fontSize: "1.1rem", padding: "12px 16px" }}
            value={form.name}
            onChange={handleChange}
          />
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
            type="submit"
            style={{ fontSize: "1.1rem", padding: "14px" }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
