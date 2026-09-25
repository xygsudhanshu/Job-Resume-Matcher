import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Users, X, Inbox, Briefcase } from "lucide-react";
import { api } from "../api";

export default function MyJobsPage({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeJob, setActiveJob] = useState(null);

  useEffect(() => {
    api.myJobs(user.user_id)
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user.user_id]);

  return (
    <div className="max-w-2xl mx-auto px-6 pt-12 pb-24">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-navy mb-1.5">
          My posted jobs
        </h1>
        <p className="text-muted text-[15px]">
          See who applied, ranked by resume match.
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2.5 text-muted py-12 justify-center">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="flex flex-col items-center text-center py-20 px-6 rounded-2xl border border-dashed border-line">
          <Inbox size={28} className="text-muted/50 mb-3" />
          <p className="text-ink font-medium mb-1">No jobs posted yet</p>
          <p className="text-muted text-sm max-w-xs">
            Post a role and applicants will show up here.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {jobs.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white border border-line rounded-xl p-4.5 shadow-card flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                <Briefcase size={16} className="text-navy" />
              </div>
              <p className="font-medium text-ink text-[15px] truncate">
                {job.title}
              </p>
            </div>
            <button
              onClick={() => setActiveJob(job)}
              className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-line text-sm font-medium text-navy hover:bg-navy/5 transition-colors"
            >
              <Users size={14} />
              Applicants
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeJob && (
          <ApplicantsModal job={activeJob} onClose={() => setActiveJob(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ApplicantsModal({ job, onClose }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.jobApplicants(job.id)
      .then(setApplicants)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [job.id]);

  function scoreColor(score) {
    if (score >= 60) return "bg-amber-light/40 text-amber-dark border-amber/30";
    if (score >= 30) return "bg-navy/5 text-navy border-navy/15";
    return "bg-slate-100 text-muted border-line";
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
        className="bg-white rounded-2xl shadow-cardHover border border-line w-full max-w-md overflow-hidden max-h-[80vh] flex flex-col"
      >
        <div className="flex items-start justify-between p-5 border-b border-line shrink-0">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted mb-1">Applicants for</p>
            <h3 className="font-display font-semibold text-navy text-lg">{job.title}</h3>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink p-1">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {loading && (
            <div className="flex items-center gap-2.5 text-muted py-8 justify-center">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Loading…</span>
            </div>
          )}
          {error && <p className="text-sm text-red-700">{error}</p>}
          {!loading && !error && applicants.length === 0 && (
            <p className="text-sm text-muted text-center py-8">No applicants yet.</p>
          )}
          <div className="space-y-2.5">
            {applicants.map((a) => (
              <div
                key={a.application_id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-line"
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink text-sm truncate">{a.student_name}</p>
                  <p className="text-muted text-xs truncate">{a.student_email}</p>
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold border ${scoreColor(a.match_score)}`}>
                  {a.match_score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
