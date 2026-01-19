import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="nav">
    <div className="logo">Exam Monitor</div>
    <div className="nav-links">
      <Link to="/login">Student</Link>
      <Link to="/admin/login">Admin</Link>
      <Link to="/admin/dashboard">Dashboard</Link>
      <Link to="/admin/exams">Exams</Link>
      <Link to="/admin/questions">Questions</Link>
      <Link to="/admin/students">Students</Link>
      <Link to="/admin/sessions">Sessions</Link>
    </div>
  </nav>
);

export default Navbar;
