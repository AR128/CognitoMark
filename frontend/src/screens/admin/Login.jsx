"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "../../api/adminApi";
import { storage } from "../../utils/storage";

const AdminLogin = () => {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
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
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit} className="grid">
          <input
            className="input"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          {error && (
            <div className="notice" style={{ color: "var(--danger)" }}>
              {error}
            </div>
          )}
          <button className="btn" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
