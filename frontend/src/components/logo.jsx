import { Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Logo() {
  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ rotate: -20, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/40"
      >
        <Shield className="h-10 w-10 text-white" />
      </motion.div>

      <h1 className="mt-5 text-3xl font-bold text-white">
        AI Crime Intelligence
      </h1>

      <p className="mt-2 text-gray-400">
        Smart Crime Analysis & Prediction
      </p>
    </div>
  );
}