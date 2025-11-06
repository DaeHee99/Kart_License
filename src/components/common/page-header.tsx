"use client";

import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: ReactNode;
  decorativeIcon?: LucideIcon;
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  badge,
  decorativeIcon: DecorativeIcon,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="from-primary/10 via-primary/5 absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r to-transparent blur-3xl hidden md:block" />

      <Card className="border-primary/20 relative overflow-hidden border-2 p-6">
        {/* Background decorations */}
        <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl" />
        <div className="bg-primary/5 pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full blur-3xl" />

        <div className="relative flex items-start gap-4">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="from-primary to-primary/60 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg"
          >
            <Icon className="text-primary-foreground h-8 w-8" />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.h1
              className="mb-2 text-3xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {description}
            </motion.p>
            {badge && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-2"
              >
                {badge}
              </motion.div>
            )}
          </div>

          {/* Decorative Icon */}
          {DecorativeIcon && (
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="hidden sm:block"
            >
              <DecorativeIcon className="text-primary h-6 w-6" />
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
