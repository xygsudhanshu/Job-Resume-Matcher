import { useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import AuthPage from "./components/AuthPage";
import JobsPage from "./components/JobsPage";
import PostJobPage from "./components/PostJobPage";
import MyApplicationsPage from "./components/MyApplicationsPage";
import MyJobsPage from "./components/MyJobsPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");

  function handleAuthed(res) {
    setUser(res);
    setPage("jobs");
  }

  function handleLogout() {
    setUser(null);
    setPage("home");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      <main className="flex-1">
        {page === "home" && <HomePage setPage={setPage} user={user} />}
        {page === "auth" && !user && <AuthPage onAuthed={handleAuthed} />}
        {page === "jobs" && <JobsPage user={user} />}
        {page === "post" && user?.role === "company" && (
          <PostJobPage user={user} onPosted={() => setPage("jobs")} />
        )}
        {page === "my-applications" && user?.role === "student" && (
          <MyApplicationsPage user={user} />
        )}
        {page === "my-jobs" && user?.role === "company" && (
          <MyJobsPage user={user} />
        )}
      </main>
    </div>
  );
}
