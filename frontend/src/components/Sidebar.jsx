"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = ({ isOpen, onToggle }) => {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { name: "Exams", href: "/admin/exams", icon: "📝" },
    { name: "Questions", href: "/admin/questions", icon: "❓" },
    { name: "Students", href: "/admin/students", icon: "🎓" },
    { name: "Sessions", href: "/admin/sessions", icon: "📡" },
  ];

  return (
    <aside className={`sidebar ${!isOpen ? "collapsed" : ""}`}>
      <button className="sidebar-edge-toggle" onClick={onToggle}>
        {isOpen ? "❮" : "❯"}
      </button>

      <div className="sidebar-links">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`sidebar-link ${pathname === link.href ? "active" : ""}`}
            title={!isOpen ? link.name : ""}
          >
            <span className="sidebar-icon">{link.icon}</span>
            {isOpen && <span className="sidebar-text">{link.name}</span>}
          </Link>
        ))}
      </div>
      <div className="sidebar-footer">
        <Link
          href="/"
          className="sidebar-link"
          title={!isOpen ? "Exit Admin" : ""}
        >
          <span className="sidebar-icon">🚪</span>
          {isOpen && <span className="sidebar-text">Exit Admin</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
