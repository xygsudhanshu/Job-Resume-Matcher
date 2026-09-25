import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Loader2, X, CheckCircle2, Inbox } from "lucide-react";
import { api } from "../api";

export default function JobsPage({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeJob, setActiveJob] = useState(null);

  useEffect(() => {
    api.getJobs()
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-navy mb-1.5">
          Open roles
        </h1>
        <p className="text-muted text-[15px]">
          {jobs.length > 0
            ? `${jobs.length} role${jobs.length === 1 ? "" : "s"} currently listed.`
            : "Browse roles posted by companies."}
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2.5 text-muted py-12 justify-center">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading roles…</span>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
          Couldn't load jobs — {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="flex flex-col items-center text-center py-20 px-6 rounded-2xl border border-dashed border-line">
          <Inbox size={28} className="text-muted/50 mb-3" />
          <p className="text-ink font-medium mb-1">No roles yet</p>
          <p className="text-muted text-sm max-w-xs">
            Once a company posts a job, it will show up here for students to apply to.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {jobs.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.25 }}
            className="group bg-white border border-line rounded-xl p-5 shadow-card hover:shadow-cardHover transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0 mt-0.5">
                  <Briefcase size={17} className="text-navy" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-ink text-[16px] mb-1">
                    {job.title}
                  </h3>
                  <p className="text-muted text-sm line-clamp-2">
                    {job.description}
                  </p>
                </div>
              </div>

              {user?.role === "student" && (
                <button
                  onClick={() => setActiveJob(job)}
                  className="shrink-0 px-4 py-2 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors"
                >
                  Apply
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeJob && (
          <ApplyModal
            job={activeJob}
            user={user}
            onClose={() => setActiveJob(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ApplyModal({ job, user, onClose }) {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleApply(e) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await api.apply({
        student_id: user.user_id,
        job_id: job.id,
        resume_text: resumeText,
      });
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-navy-dark/40 backdrop-blur-sm flex items-center justify-center p-6 z-20"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-cardHover border border-line w-full max-w-md overflow-hidden"
      >
        <div className="flex items-start justify-between p-5 border-b border-line">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted mb-1">Applying to</p>
            <h3 className="font-display font-semibold text-navy text-lg">{job.title}</h3>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink p-1">
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {result ? (
            <div className="text-center py-4">
              <CheckCircle2 size={36} className="text-amber mx-auto mb-3" />
              <p className="font-medium text-ink mb-1">Application submitted</p>
              <p className="text-sm text-muted mb-4">Here's how your resume matched this role.</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy/5 border border-navy/10">
                <span className="text-2xl font-display font-semibold text-navy">
                  {result.match_score}%
                </span>
                <span className="text-xs text-muted">match score</span>
              </div>
              <button
                onClick={onClose}
                className="mt-6 w-full py-2.5 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleApply}>
              {error && (
                <div className="mb-3.5 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
                  {error}
                </div>
              )}
              <label className="text-sm font-medium text-ink mb-1.5 block">
                Paste your resume text
              </label>
              <textarea
                required
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the text of your resume here…"
                className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-white text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/40 resize-none transition-shadow"
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full py-2.5 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                Submit application
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
