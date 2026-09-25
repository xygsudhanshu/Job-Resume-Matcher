import { useState, useRef, useEffect } from "react";
import { Briefcase, LogOut, ChevronDown } from "lucide-react";

export default function Navbar({ page, setPage, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navItem = (id, label) => (
    <button
      onClick={() => setPage(id)}
      className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
        page === id
          ? "bg-navy text-white"
          : "text-muted hover:text-navy hover:bg-navy/5"
      }`}
    >
      {label}
    </button>
  );

  const initials = user?.name
    ? user.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")
    : user?.email?.[0]?.toUpperCase() || "?";

  return (
    <header className="border-b border-line bg-cream/90 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => setPage("home")}
          className="flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-md bg-navy flex items-center justify-center">
            <Briefcase size={16} className="text-amber" strokeWidth={2.25} />
          </div>
          <span className="font-display font-semibold text-navy text-[17px]">
            Job&nbsp;Matcher
          </span>
        </button>

        <nav className="flex items-center gap-1">
          {navItem("jobs", "Jobs")}
          {user?.role === "student" && navItem("my-applications", "My applications")}
          {user?.role === "company" && navItem("post", "Post a job")}
          {user?.role === "company" && navItem("my-jobs", "My jobs")}
          {!user && navItem("auth", "Sign in")}
        </nav>

        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-line hover:bg-navy/5 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-navy text-amber flex items-center justify-center text-xs font-semibold">
                {initials}
              </div>
              <ChevronDown size={14} className="text-muted" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-line rounded-xl shadow-cardHover overflow-hidden">
                <div className="px-4 py-3 border-b border-line">
                  <p className="text-sm font-medium text-ink truncate">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-muted capitalize mt-0.5">
                    {user.role} account
                  </p>
                </div>
                <button
                  onClick={() => { onLogout(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-ink hover:bg-navy/5 transition-colors"
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
