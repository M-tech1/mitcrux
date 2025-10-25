import { motion } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

interface AnimatedTextProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function AnimatedText({
  children,
  delay = 1,
  duration = 1,
  className = "",
}: AnimatedTextProps) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration }}
      className={clsx(
        "mt-6 max-w-md text-neutral-600 md:text-base text-sm leading-relaxed",
        className
      )}
    >
      {children}
    </motion.p>
  );
}
