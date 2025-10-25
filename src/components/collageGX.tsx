"use client";
import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Left collage layout that matches the reference:
 * - overlapping framed photos
 * - red connector lines between images
 * - subtle drop shadows and white frames
 */

export default function Collage() {
  return (
    <div className="relative w-full h-[560px] sm:h-[520px] md:h-[520px]">
      {/* container for absolute positioned images */}
      <div className="relative w-full h-full">
        {/* Small top-left image */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="absolute left-0 top-6 w-44 h-28 sm:w-52 sm:h-32 rounded-sm overflow-hidden collage-frame"
          style={{ zIndex: 30 }}
        >
          <Image
            src="/collage-1.jpg"
            alt="analysis"
            fill
            style={{ objectFit: "cover" }}
          />
        </motion.div>

        {/* Center medium portrait image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="absolute left-28 top-14 w-56 h-64 sm:w-72 sm:h-80 rounded-sm overflow-hidden collage-frame"
          style={{ zIndex: 40 }}
        >
          <Image
            src="/collage-2.jpg"
            alt="person-portrait"
            fill
            style={{ objectFit: "cover" }}
          />
        </motion.div>

        {/* Large bottom-left image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute left-4 bottom-0 w-72 h-72 sm:w-96 sm:h-96 rounded-sm overflow-hidden collage-frame"
          style={{ zIndex: 20 }}
        >
          <Image
            src="/collage-3.jpg"
            alt="team-meeting"
            fill
            style={{ objectFit: "cover" }}
          />
        </motion.div>

        {/* Optional small overlay image in top-right of center image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute left-[46%] top-[6%] w-28 h-20 sm:w-36 sm:h-28 rounded-sm overflow-hidden collage-frame"
          style={{ zIndex: 50 }}
        >
          <Image
            src="/collage-4.jpg"
            alt="detail"
            fill
            style={{ objectFit: "cover" }}
          />
        </motion.div>

        {/* Red connector lines — created with positioned divs */}
        {/* Vertical red stroke from top small image down to center */}
        <div
          className="absolute left-[5.2rem] top-12 h-36 w-[2px] bg-accent rounded"
          style={{ zIndex: 15 }}
        />

        {/* Horizontal red stroke linking center to right area */}
        <div
          className="absolute left-[8.5rem] top-28 w-28 h-[2px] bg-accent rounded"
          style={{ zIndex: 15 }}
        />

        {/* Small corner accent on bottom-left big image */}
        <div
          className="absolute left-2 bottom-14 w-8 h-8 border-2 border-accent rotate-12"
          style={{ zIndex: 15 }}
        />

        {/* Decorative thin rounded frame behind everything for depth */}
        <div
          className="absolute left-0 top-0 w-[45%] h-[92%] border border-slate-200/40 rounded"
          style={{ zIndex: 10 }}
        />
      </div>
    </div>
  );
}
