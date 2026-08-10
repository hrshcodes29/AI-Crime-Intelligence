import {
  Shield,
  Activity,
  MapPinned,
  Brain,
  BarChart3,
  Globe,
  Cpu,
} from "lucide-react";
import { motion } from "framer-motion";
import CrimeMap from "./CrimeMap";
import StatsCard from "./StatsCard";

export default function InfoPanel() {
  return (
    <motion.div
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="hidden lg:flex flex-col justify-between rounded-3xl border border-cyan-500/20 bg-slate-900/60 backdrop-blur-2xl p-10 shadow-2xl"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="text-cyan-400" size={42} />

            <div>
              <h1 className="text-3xl font-bold text-white">
                AI Crime Intelligence
              </h1>

              <p className="text-slate-400">
                Predict • Analyze • Prevent
              </p>
            </div>
          </div>

          <div className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
            SYSTEM ONLINE
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 grid gap-4">
          <StatsCard
            title="AI Status"
            value="ONLINE"
            color="bg-cyan-500/20"
            icon={<Brain className="text-cyan-400" />}
          />

          <StatsCard
            title="Threat Level"
            value="LOW"
            color="bg-red-500/20"
            icon={<Activity className="text-red-400" />}
          />

          <StatsCard
            title="Crime Reports"
            value="12,457"
            color="bg-purple-500/20"
            icon={<BarChart3 className="text-purple-400" />}
          />

          <StatsCard
            title="Officers Active"
            value="248"
            color="bg-green-500/20"
            icon={<Shield className="text-green-400" />}
          />
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-800/50 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400">
            <Globe size={20} />
            <span className="font-semibold">
              Global Crime Monitor
            </span>
          </div>

          <Cpu className="text-cyan-400" size={18} />
        </div>

        <div className="mt-5 overflow-hidden rounded-xl">
          <CrimeMap />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-400">
            <MapPinned size={18} />
            Live Tracking Enabled
          </div>

          <div className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
            LIVE
          </div>
        </div>
      </div>
    </motion.div>
  );
}