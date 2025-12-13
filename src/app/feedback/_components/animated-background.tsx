"use client";

import { motion } from "motion/react";

export function AnimatedBackground() {
  return (
    <div className="from-primary/5 via-background to-secondary/5 absolute inset-0 bg-linear-to-br">
      <motion.div
        className="from-primary/10 to-secondary/10 absolute top-20 right-10 h-96 w-96 rounded-full bg-linear-to-br blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="from-secondary/10 to-primary/10 absolute bottom-20 left-10 h-80 w-80 rounded-full bg-linear-to-br blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.3, 0.4],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
