import Link from "next/link";

const Navbar = () => (
  <nav className="nav">
    <div className="logo">Exam Monitor</div>
    <div className="nav-links">
      <Link href="/login">Student</Link>
      <Link href="/admin/login">Admin</Link>
      <Link href="/admin/dashboard">Dashboard</Link>
      <Link href="/admin/exams">Exams</Link>
      <Link href="/admin/questions">Questions</Link>
      <Link href="/admin/students">Students</Link>
      <Link href="/admin/sessions">Sessions</Link>
    </div>
  </nav>
);

export default Navbar;
