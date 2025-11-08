"use client";

import { motion } from "motion/react";
import { Star, Sparkles, CheckCircle2, Circle } from "lucide-react";
import { ReactNode } from "react";

interface AnimatedBackgroundProps {
  variant: "method" | "input" | "confirm";
  particles: Array<{
    left: number;
    top: number;
    x: number;
    duration: number;
    delay: number;
  }>;
  confettiParticles?: Array<{
    left: number;
    x: number;
    rotate: number;
    duration: number;
  }>;
  progressParticles?: Array<{
    left: number;
    top: number;
    duration: number;
    delay: number;
  }>;
  children?: ReactNode;
}

export function AnimatedBackground({
  variant,
  particles,
  confettiParticles,
  progressParticles,
  children,
}: AnimatedBackgroundProps) {
  return (
    <>
      {variant === "method" && (
        <div className="from-primary/5 via-secondary/5 to-primary/5 absolute inset-0 bg-linear-to-br">
          <motion.div
            className="bg-primary/10 absolute top-20 left-10 hidden h-64 w-64 rounded-full blur-3xl md:block"
            animate={{
              scale: [1, 1.2, 1],
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
            className="bg-secondary/10 absolute right-10 bottom-20 hidden h-64 w-64 rounded-full blur-3xl md:block"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ willChange: "transform, opacity" }}
          />

          {/* Floating particles */}
          {particles.map((particle, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, particle.x, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            >
              {i % 2 === 0 ? (
                <Star className="text-primary fill-primary/50 h-3 w-3" />
              ) : (
                <Sparkles className="text-secondary h-3 w-3" />
              )}
            </motion.div>
          ))}
        </div>
      )}

      {variant === "confirm" && (
        <div className="via-primary/5 to-secondary/10 absolute inset-0 bg-linear-to-br from-green-500/10">
          <motion.div
            className="absolute top-20 left-10 hidden h-72 w-72 rounded-full bg-green-500/20 blur-3xl md:block"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="bg-primary/20 absolute right-10 bottom-20 hidden h-64 w-64 rounded-full blur-3xl md:block"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="bg-secondary/15 absolute top-1/2 right-1/4 hidden h-56 w-56 rounded-full blur-3xl md:block"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating particles */}
          {particles.map((particle, i) => (
            <motion.div
              key={`particle-confirm-${i}`}
              className="absolute"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -25, 0],
                x: [0, particle.x, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            >
              {i % 3 === 0 ? (
                <Star className="h-4 w-4 fill-green-500/50 text-green-500" />
              ) : i % 3 === 1 ? (
                <Sparkles className="text-primary h-3 w-3" />
              ) : (
                <CheckCircle2 className="text-secondary h-3 w-3" />
              )}
            </motion.div>
          ))}

          {/* Celebration confetti */}
          {confettiParticles?.map((particle, i) => (
            <motion.div
              key={`confetti-${i}`}
              className="absolute"
              style={{
                left: `${particle.left}%`,
                top: "-10%",
              }}
              animate={{
                y: ["0vh", "120vh"],
                x: [0, particle.x],
                rotate: [0, particle.rotate],
                opacity: [1, 0.8, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeIn",
              }}
            >
              <div
                className={`h-2 w-2 rounded-full ${
                  i % 3 === 0
                    ? "bg-green-500"
                    : i % 3 === 1
                      ? "bg-primary"
                      : "bg-secondary"
                }`}
              />
            </motion.div>
          ))}
        </div>
      )}

      {variant === "input" && (
        <div className="from-primary/5 via-background to-secondary/5 absolute inset-0 bg-linear-to-br">
          <motion.div
            className="bg-primary/10 absolute top-10 right-20 hidden h-48 w-48 rounded-full blur-3xl md:block"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="bg-secondary/10 absolute bottom-20 left-20 hidden h-48 w-48 rounded-full blur-3xl md:block"
            animate={{
              scale: [1.3, 1, 1.3],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Additional animated blobs */}
          <motion.div
            className="bg-primary/15 absolute top-1/3 left-1/4 hidden h-56 w-56 rounded-full blur-3xl md:block"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.4, 0.7, 0.4],
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="bg-secondary/12 absolute right-1/4 bottom-1/3 hidden h-64 w-64 rounded-full blur-3xl md:block"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating particles */}
          {particles.map((particle, i) => (
            <motion.div
              key={`particle-input-${i}`}
              className="absolute"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -15, 0],
                x: [0, particle.x, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            >
              {i % 2 === 0 ? (
                <Circle className="text-primary fill-primary/30 h-2 w-2" />
              ) : (
                <Star className="text-secondary fill-secondary/30 h-2 w-2" />
              )}
            </motion.div>
          ))}

          {/* Additional sparkles for more visual interest */}
          {progressParticles?.map((particle, i) => (
            <motion.div
              key={`sparkle-input-${i}`}
              className="absolute"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="text-primary h-3 w-3" />
            </motion.div>
          ))}
        </div>
      )}

      {children}
    </>
  );
}
