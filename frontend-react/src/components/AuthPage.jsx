import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { api } from "../api";

export default function AuthPage({ onAuthed }) {
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [signupForm, setSignupForm] = useState({
    name: "", email: "", password: "", role: "student",
  });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  async function handleSignup(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api.signup(signupForm);
      const res = await api.login({
        email: signupForm.email, password: signupForm.password,
      });
      onAuthed(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await api.login(loginForm);
      onAuthed(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-lg border border-line bg-white text-[15px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/40 transition-shadow";

  return (
    <div className="max-w-md mx-auto px-6 pt-16 pb-24">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-semibold text-navy mb-2">
          Welcome
        </h1>
        <p className="text-muted text-[15px]">
          Sign in to apply for jobs, or post one for your company.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-line overflow-hidden">
        <div className="flex border-b border-line">
          {["login", "signup"].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); }}
              className={`flex-1 py-3.5 text-sm font-medium capitalize transition-colors relative ${
                tab === t ? "text-navy" : "text-muted hover:text-ink"
              }`}
            >
              {t === "login" ? "Log in" : "Sign up"}
              {tab === t && (
                <motion.div
                  layoutId="auth-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <input required type="email" placeholder="Email" className={inputClass}
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
              <input required type="password" placeholder="Password" className={inputClass}
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
              <SubmitButton loading={loading} label="Log in" />
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3.5">
              <input required placeholder="Full name" className={inputClass}
                value={signupForm.name}
                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })} />
              <input required type="email" placeholder="Email" className={inputClass}
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} />
              <input required type="password" placeholder="Password" className={inputClass}
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })} />
              <div className="flex gap-2">
                {["student", "company"].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setSignupForm({ ...signupForm, role: r })}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium capitalize transition-colors ${
                      signupForm.role === r
                        ? "border-navy bg-navy text-white"
                        : "border-line text-muted hover:border-navy/30"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <SubmitButton loading={loading} label="Create account" />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function SubmitButton({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-2.5 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {label}
    </button>
  );
}
