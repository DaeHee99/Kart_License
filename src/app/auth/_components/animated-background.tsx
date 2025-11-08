"use client";

import { motion } from "motion/react";

export function AnimatedBackground() {
  return (
    <div className="from-primary/10 via-background to-secondary/10 absolute inset-0 bg-linear-to-br">
      <motion.div
        className="from-primary/20 to-secondary/20 absolute top-20 right-10 h-96 w-96 rounded-full bg-linear-to-br blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="from-secondary/20 to-primary/20 absolute bottom-20 left-10 h-80 w-80 rounded-full bg-linear-to-br blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.3, 0.4],
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
