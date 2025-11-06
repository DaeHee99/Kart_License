"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Zap, TrendingUp, ChevronRight, Sparkles, Star, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, ReactNode } from "react";

interface HeroSectionProps {
  userProfileSlot?: ReactNode;
}

export function HeroSection({ userProfileSlot }: HeroSectionProps) {
  const router = useRouter();

  // Generate stable random values for particles
  const particlePositions = useRef(
    Array.from({ length: 15 }, (_, i) => ({
      left: (i * 7 + 10) % 100,
      top: (i * 11 + 5) % 100,
      duration: 3 + (i % 3),
      delay: (i * 0.3) % 2,
      x: (i % 5) * 4 - 10,
    })),
  ).current;

  return (
    <section className="relative overflow-hidden px-4 py-12 md:py-20">
      {/* Animated Background */}
      <div className="from-primary/10 via-secondary/10 to-primary/5 absolute inset-0 bg-gradient-to-br">
        {/* Animated circles - optimized for mobile */}
        <motion.div
          className="bg-primary/20 absolute top-20 left-10 h-64 w-64 rounded-full blur-3xl"
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
          className="bg-secondary/20 absolute right-10 bottom-20 h-96 w-96 rounded-full blur-3xl"
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

        {/* Additional gradient blurs */}
        <motion.div
          className="bg-primary/15 absolute top-1/2 left-1/2 h-80 w-80 rounded-full blur-3xl"
          animate={{
            x: [-40, 40, -40],
            y: [-40, 40, -40],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "transform" }}
        />

        {/* Racing lines effect - simplified for mobile */}
        <div className="absolute inset-0 opacity-10 hidden md:block">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="via-primary absolute h-1 bg-gradient-to-r from-transparent to-transparent"
              style={{
                top: `${20 + i * 15}%`,
                width: "100%",
              }}
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Floating particles - reduced for mobile */}
        {particlePositions.map((particle, i) => (
          <motion.div
            key={`particle-${i}`}
            className={`absolute ${i > 7 ? 'hidden md:block' : ''}`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              willChange: "transform, opacity",
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, particle.x, 0],
              opacity: [0.2, 0.5, 0.2],
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
              <Star className="text-primary fill-primary h-4 w-4" />
            ) : i % 3 === 1 ? (
              <Sparkles className="text-secondary h-4 w-4" />
            ) : (
              <Trophy className="text-primary h-4 w-4" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-screen-xl">
        <div className="grid items-start gap-8 lg:grid-cols-3">
          {/* Main Content - Left/Center */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:col-span-2 lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="from-primary/20 to-secondary/20 border-primary/20 inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-6 py-3 backdrop-blur-sm"
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Zap className="text-primary h-5 w-5" />
              </motion.div>
              <span className="from-primary to-secondary bg-gradient-to-r bg-clip-text font-medium text-transparent">
                카트라이더 러쉬 플러스 실력 측정
              </span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                className="from-primary via-secondary to-primary bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent md:text-7xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  backgroundSize: "200%",
                }}
              >
                <motion.span
                  animate={{
                    backgroundPosition: ["0%", "200%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, var(--primary), var(--secondary), var(--primary))",
                    backgroundSize: "200%",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  카러플 군 계산기
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-muted-foreground mx-auto max-w-2xl text-xl md:text-2xl lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                쉽고 간편하게{" "}
                <span className="text-primary font-semibold">군 측정</span>
                하세요!
                <br />
                나의 레이싱 실력을{" "}
                <span className="text-secondary font-semibold">
                  정확하게
                </span>{" "}
                분석해드립니다
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:items-start lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => router.push("/measure")}
                  className="group shadow-primary/50 relative h-16 overflow-hidden px-10 text-lg shadow-2xl"
                >
                  <motion.div
                    className="from-primary via-secondary to-primary absolute inset-0 bg-gradient-to-r"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      opacity: 0.3,
                    }}
                  />
                  <TrendingUp className="relative z-10 mr-3 h-6 w-6" />
                  <span className="relative z-10">지금 측정하기</span>
                  <ChevronRight className="relative z-10 ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/records")}
                  className="h-16 border-2 px-8 text-lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  S35 기록표 보기
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* User Profile Slot for desktop */}
          {userProfileSlot && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="lg:col-span-1"
            >
              {userProfileSlot}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
