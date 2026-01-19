import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentLogin from "./pages/student/Login";
import StartExam from "./pages/student/Start";
import StudentExam from "./pages/student/Exam";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import Exams from "./pages/admin/Exams";
import Questions from "./pages/admin/Questions";
import Students from "./pages/admin/Students";
import Sessions from "./pages/admin/Sessions";
import SessionDetail from "./pages/admin/SessionDetail";

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/login" element={<StudentLogin />} />
      <Route path="/start" element={<StartExam />} />
      <Route path="/exam" element={<StudentExam />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exams"
        element={
          <ProtectedRoute>
            <Exams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/questions"
        element={
          <ProtectedRoute>
            <Questions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/sessions"
        element={
          <ProtectedRoute>
            <Sessions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/session/:id"
        element={
          <ProtectedRoute>
            <SessionDetail />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<StudentLogin />} />
    </Routes>
  </BrowserRouter>
);

export default App;
