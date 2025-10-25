import { motion } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

interface AnimatedButtonProps {
  text: string;
  icon?: ReactNode;
  delay?: number;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function AnimatedButton({
  text,
  icon,
  delay = 1.5,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
}: AnimatedButtonProps) {
  // ✅ Define color styles
  const variantClasses: Record<string, string> = {
    primary: "bg-cyan-500 hover:bg-cyan-600 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  // ✅ Define size styles
  const sizeClasses: Record<string, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      onClick={onClick}
      className={clsx(
        "rounded-full font-medium transition-all duration-300 flex items-center gap-2",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {text}
      {icon && <span className="text-lg">{icon}</span>}
    </motion.button>
  );
}
