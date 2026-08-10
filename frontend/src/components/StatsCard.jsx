import { motion } from "framer-motion";

export default function StatsCard({
  icon,
  title,
  value,
  color,
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -4,
      }}
      className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-4 transition-all"
    >
      <div className="flex items-center gap-4">
        <div className={`rounded-xl p-3 ${color}`}>
          {icon}
        </div>

        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h2 className="text-2xl font-bold text-white">
            {value}
          </h2>
        </div>
      </div>
    </motion.div>
  );
}