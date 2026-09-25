import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, FileText, Inbox } from "lucide-react";
import { api } from "../api";

export default function MyApplicationsPage({ user }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.myApplications(user.user_id)
      .then(setApps)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user.user_id]);

  function scoreColor(score) {
    if (score >= 60) return "bg-amber-light/40 text-amber-dark border-amber/30";
    if (score >= 30) return "bg-navy/5 text-navy border-navy/15";
    return "bg-slate-100 text-muted border-line";
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-12 pb-24">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-navy mb-1.5">
          My applications
        </h1>
        <p className="text-muted text-[15px]">
          Track the roles you've applied to and how you matched.
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

      {!loading && !error && apps.length === 0 && (
        <div className="flex flex-col items-center text-center py-20 px-6 rounded-2xl border border-dashed border-line">
          <Inbox size={28} className="text-muted/50 mb-3" />
          <p className="text-ink font-medium mb-1">No applications yet</p>
          <p className="text-muted text-sm max-w-xs">
            Head to the Jobs page and apply to a role to see it here.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {apps.map((a, i) => (
          <motion.div
            key={a.application_id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white border border-line rounded-xl p-4.5 shadow-card flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                <FileText size={16} className="text-navy" />
              </div>
              <p className="font-medium text-ink text-[15px] truncate">
                {a.job_title}
              </p>
            </div>
            <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${scoreColor(a.match_score)}`}>
              {a.match_score}% match
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
