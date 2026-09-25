import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { api } from "../api";

export default function PostJobPage({ user, onPosted }) {
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess(false);
    try {
      await api.postJob({ ...form, company_id: user.user_id });
      setForm({ title: "", description: "" });
      setSuccess(true);
      onPosted?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-lg border border-line bg-white text-[15px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/40 transition-shadow";

  return (
    <div className="max-w-md mx-auto px-6 pt-12 pb-24">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-navy mb-1.5">
          Post a role
        </h1>
        <p className="text-muted text-[15px]">
          Students will see this listed immediately.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-line p-6">
        {error && (
          <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-amber-light/30 border border-amber/30 text-navy text-sm flex items-center gap-2">
            <CheckCircle2 size={16} className="text-amber-dark" />
            Job posted — visible on the Jobs page now.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">
              Job title
            </label>
            <input
              required
              placeholder="e.g. Backend Developer Intern"
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">
              Description
            </label>
            <textarea
              required
              rows={6}
              placeholder="Responsibilities, required skills, experience level…"
              className={`${inputClass} resize-none`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            Post job
          </button>
        </form>
      </div>
    </div>
  );
}
