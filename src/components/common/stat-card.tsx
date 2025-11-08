"use client";

import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  colorScheme?: "primary" | "secondary" | "accent";
  delay?: number;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  colorScheme = "primary",
  delay = 0,
}: StatCardProps) {
  const colorClasses = {
    primary: {
      border: "border-primary/10 hover:border-primary/20",
      bg: "bg-primary/5",
      iconBg: "from-primary/20 to-primary/10",
      iconColor: "text-primary",
    },
    secondary: {
      border: "border-secondary/10 hover:border-secondary/20",
      bg: "bg-secondary/5",
      iconBg: "from-secondary/20 to-secondary/10",
      iconColor: "text-secondary",
    },
    accent: {
      border: "border-accent/10 hover:border-accent/20",
      bg: "bg-accent/5",
      iconBg: "from-accent/20 to-accent/10",
      iconColor: "text-accent",
    },
  };

  const colors = colorClasses[colorScheme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card
        className={`${colors.border} relative overflow-hidden border-2 p-6 transition-all`}
      >
        <motion.div
          className={`${colors.bg} absolute top-0 right-0 hidden h-32 w-32 rounded-full blur-2xl md:block`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="relative flex items-center gap-4">
          <div
            className={`${colors.iconBg} flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-linear-to-br`}
          >
            <Icon className={`${colors.iconColor} h-6 w-6`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground truncate text-sm">{label}</p>
            <p className="truncate text-2xl font-bold">{value}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
