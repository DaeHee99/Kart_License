"use client";

import { Card } from "@/components/ui/card";
import { TierBadge } from "@/components/tier-badge";
import { TIERS, TierType } from "@/lib/types";
import { motion } from "motion/react";
import { useState } from "react";

interface TierIntroductionProps {
  onTierSelect: (tier: TierType) => void;
}

const tierOrder: TierType[] = [
  "elite",
  "master",
  "diamond",
  "platinum",
  "gold",
  "silver",
  "bronze",
];

export function TierIntroduction({ onTierSelect }: TierIntroductionProps) {
  const [hoveredTier, setHoveredTier] = useState<TierType | null>(null);

  return (
    <section className="bg-muted/30 px-4 py-16">
      <div className="mx-auto max-w-screen-xl">
        <div className="mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-3xl font-bold md:text-4xl"
          >
            군 시스템
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground"
          >
            7단계 군으로 당신의 실력을 정확하게 평가합니다
          </motion.p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
          {tierOrder.map((tierId, index) => {
            const tier = TIERS[tierId];
            return (
              <motion.div
                key={tierId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  scale: 1.05,
                  transition: { duration: 0.2, delay: 0 },
                }}
                className="group relative"
              >
                {/* Glow effect on hover */}
                <div
                  className={`absolute -inset-1 ${tier.color} rounded-xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20`}
                />

                <Card
                  className="hover:border-primary/50 from-card via-card to-muted/30 relative cursor-pointer overflow-hidden border-2 bg-gradient-to-br p-4 transition-all hover:shadow-2xl"
                  onClick={() => onTierSelect(tierId)}
                  onMouseEnter={() => setHoveredTier(tierId)}
                  onMouseLeave={() => setHoveredTier(null)}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="via-primary/10 absolute inset-0 bg-gradient-to-r from-transparent to-transparent"
                    animate={{
                      x: ["-200%", "200%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut",
                    }}
                  />

                  <div className="relative flex flex-col items-center gap-3">
                    <motion.div
                      animate={
                        hoveredTier === tierId
                          ? {
                              rotate: [0, -10, 10, -10, 0],
                              scale: [1, 1.1, 1.1, 1.1, 1],
                            }
                          : {
                              rotate: 0,
                              scale: 1,
                            }
                      }
                      transition={
                        hoveredTier === tierId
                          ? {
                              duration: 0.5,
                              repeat: Infinity,
                              repeatType: "loop",
                            }
                          : {
                              duration: 0.2,
                            }
                      }
                    >
                      <TierBadge tier={tierId} size="lg" showLabel={false} />
                    </motion.div>
                    <div className="text-center">
                      <div className="mb-1 font-bold">{tier.nameKo}</div>
                      <div className="text-muted-foreground mb-2 text-xs">
                        {tier.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {tier.description}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
