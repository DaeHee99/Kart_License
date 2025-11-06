"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedBackgroundProps {
  children?: ReactNode;
  variant?: "default" | "subtle" | "vibrant";
  className?: string;
}

export function AnimatedBackground({
  children,
  variant = "default",
  className = "",
}: AnimatedBackgroundProps) {
  const variants = {
    default: {
      gradient: "from-primary/5 via-background to-secondary/5",
      blob1: "bg-primary/10",
      blob2: "bg-secondary/10",
    },
    subtle: {
      gradient: "from-primary/3 via-background to-secondary/3",
      blob1: "bg-primary/5",
      blob2: "bg-secondary/5",
    },
    vibrant: {
      gradient: "from-primary/10 via-secondary/5 to-primary/5",
      blob1: "bg-primary/20",
      blob2: "bg-secondary/20",
    },
  };

  const config = variants[variant];

  return (
    <div className={`relative ${className}`}>
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`}>
        {/* Animated Blobs - Hidden on mobile for performance */}
        <motion.div
          className={`${config.blob1} absolute top-20 right-10 h-96 w-96 rounded-full blur-3xl hidden md:block`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "transform, opacity" }}
        />
        <motion.div
          className={`${config.blob2} absolute bottom-20 left-10 h-80 w-80 rounded-full blur-3xl hidden md:block`}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.3, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "transform, opacity" }}
        />
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
