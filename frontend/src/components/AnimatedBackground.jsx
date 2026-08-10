import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* Blue Glow */}
      <motion.div
        animate={{
          x: [0, 180, 0],
          y: [0, -120, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[120px]"
      />

      {/* Purple Glow */}
      <motion.div
        animate={{
          x: [0, -180, 0],
          y: [0, 120, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-purple-500/20 blur-[140px]"
      />

      {/* Pink Glow */}
      <motion.div
        animate={{
          x: [-100, 100, -100],
          y: [80, -80, 80],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-[120px]"
      />
    </div>
  );
}