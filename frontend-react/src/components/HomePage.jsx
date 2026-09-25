import { motion } from "framer-motion";
import { Briefcase, Sparkles, Users, ArrowRight } from "lucide-react";

export default function HomePage({ setPage, user }) {
  const stats = [
    { label: "AI-matched applications", value: "Instant" },
    { label: "For students & companies", value: "One platform" },
    { label: "Resume scoring", value: "Automated" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6">
      <section className="pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy/5 border border-navy/10 text-xs font-medium text-navy mb-6"
        >
          <Sparkles size={12} className="text-amber-dark" />
          AI-powered resume matching
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-display text-4xl sm:text-5xl font-semibold text-navy leading-tight mb-4"
        >
          Find the right role.
          <br />
          Find the right candidate.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-muted text-lg max-w-xl mx-auto mb-9"
        >
          Students apply with a resume, companies post a role — our matching
          engine scores the fit instantly, so no one wastes time guessing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-center justify-center gap-3"
        >
          {!user ? (
            <>
              <button
                onClick={() => setPage("auth")}
                className="flex items-center gap-2 px-5 py-3 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors"
              >
                Get started <ArrowRight size={15} />
              </button>
              <button
                onClick={() => setPage("jobs")}
                className="px-5 py-3 rounded-lg border border-line text-sm font-medium text-navy hover:bg-navy/5 transition-colors"
              >
                Browse roles
              </button>
            </>
          ) : (
            <button
              onClick={() => setPage("jobs")}
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors"
            >
              View open roles <ArrowRight size={15} />
            </button>
          )}
        </motion.div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4 pb-20">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="bg-white border border-line rounded-xl p-5 text-center shadow-card"
          >
            <p className="font-display text-xl font-semibold text-navy mb-1">
              {s.value}
            </p>
            <p className="text-muted text-sm">{s.label}</p>
          </motion.div>
        ))}
      </section>

      <section className="grid sm:grid-cols-2 gap-4 pb-24">
        <FeatureCard
          icon={<Briefcase size={18} className="text-navy" />}
          title="For students"
          desc="Browse open roles, apply with your resume text, and instantly see how well you match each job before you invest more time."
        />
        <FeatureCard
          icon={<Users size={18} className="text-navy" />}
          title="For companies"
          desc="Post a role in seconds and see every applicant ranked by fit — no more manually reading through stacks of resumes."
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white border border-line rounded-xl p-6 shadow-card">
      <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-display font-semibold text-ink text-[17px] mb-1.5">
        {title}
      </h3>
      <p className="text-muted text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
