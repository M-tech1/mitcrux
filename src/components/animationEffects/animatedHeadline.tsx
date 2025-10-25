import { motion } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

interface AnimatedHeadingProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function AnimatedHeading({
  children,
  delay = 0,
  duration = 1,
  className = "",
}: AnimatedHeadingProps) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration }}
      className={clsx(
        "text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight max-w-2xl",
        className
      )}
    >
      {children}
    </motion.h1>
  );
}
