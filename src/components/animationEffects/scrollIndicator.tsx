"use client";
import { motion } from "framer-motion";

export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-1 h-10 bg-cyan-400 rounded-full mx-auto"
      ></motion.div>
      <p className="text-xs text-slate-400 text-center mt-2">Scroll down</p>
    </div>
  );
}
