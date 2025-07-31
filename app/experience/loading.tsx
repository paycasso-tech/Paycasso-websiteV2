// app/experience/loading.tsx
"use client";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
        />
        <motion.p
          className="text-purple-400 text-xl font-bold"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading Epic Experience...
        </motion.p>
      </motion.div>
    </div>
  );
}
