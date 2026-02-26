"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const isAdminSubPage =
    pathname?.startsWith("/admin") && pathname !== "/admin";

  return (
    <nav className="nav centered-nav">
      <div className="logo">CognitoMark</div>
      {isAdminSubPage && (
        <Link href="/" className="live-site-link" target="_blank">
          LIVE SITE ↗
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
