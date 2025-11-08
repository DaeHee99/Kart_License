"use client";

import { motion } from "motion/react";
import { Star, Sparkles, Trophy } from "lucide-react";

export function AnimatedBackground() {
  return (
    <div className="from-primary/5 via-background to-secondary/5 absolute inset-0 bg-linear-to-br">
      {/* Large gradient blobs */}
      <motion.div
        className="from-primary/20 to-secondary/20 absolute top-10 right-10 h-96 w-96 rounded-full bg-linear-to-br blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="from-secondary/20 to-primary/20 absolute bottom-10 left-10 h-80 w-80 rounded-full bg-linear-to-br blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        >
          {i % 3 === 0 ? (
            <Star className="text-primary fill-primary/50 h-3 w-3" />
          ) : i % 3 === 1 ? (
            <Sparkles className="text-secondary h-3 w-3" />
          ) : (
            <Trophy className="text-primary h-3 w-3" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
