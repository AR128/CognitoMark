"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "../../api/adminApi";
import { storage } from "../../utils/storage";

const AdminLogin = () => {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await adminLogin(form);
      storage.set("adminToken", data.token);
      router.push("/admin/dashboard");
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
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Admin Login
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid"
          style={{ gap: "1.5rem" }}
        >
          <input
            className="input"
            name="username"
            placeholder="Username"
            style={{ fontSize: "1.1rem", padding: "12px 16px" }}
            value={form.username}
            onChange={handleChange}
          />
          <div style={{ position: "relative" }}>
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              style={{
                fontSize: "1.1rem",
                padding: "12px 48px 12px 16px",
                width: "100%",
              }}
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
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

export default AdminLogin;
