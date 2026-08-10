import { motion } from "framer-motion";
import AnimatedBackground from "./AnimatedBackground";
import InfoPanel from "./InfoPanel";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] flex items-center justify-center px-6">

      {/* Animated Background */}
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-7xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left Panel */}
          <InfoPanel />

          {/* Right Panel */}
          <div className="flex justify-center">
            {children}
          </div>

        </div>
      </motion.div>
    </div>
  );
}