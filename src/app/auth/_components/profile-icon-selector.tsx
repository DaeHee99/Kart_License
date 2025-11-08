"use client";

import { motion } from "motion/react";
import { Label } from "@/components/ui/label";
import { Sparkles, Check } from "lucide-react";
import { PROFILE_ICONS } from "./constants";

interface ProfileIconSelectorProps {
  selectedProfile: number;
  setSelectedProfile: (id: number) => void;
}

export function ProfileIconSelector({
  selectedProfile,
  setSelectedProfile,
}: ProfileIconSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.25 }}
      className="space-y-3"
    >
      <Label className="flex items-center gap-2">
        <Sparkles className="text-secondary h-4 w-4" />
        프로필 사진 (원하는 프로필을 하나 선택해주세요)
      </Label>

      <div className="grid grid-cols-8 gap-2">
        {PROFILE_ICONS.map((icon, index) => (
          <motion.button
            key={icon.id}
            type="button"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.2,
              delay: 0.25 + index * 0.02,
              type: "spring",
              stiffness: 200,
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedProfile(icon.id)}
            className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-lg text-2xl transition-all ${
              selectedProfile === icon.id
                ? "ring-primary ring-offset-background ring-2 ring-offset-2"
                : "hover:ring-primary/50 hover:ring-offset-background hover:ring-2 hover:ring-offset-2"
            }`}
            style={{ backgroundColor: `${icon.color}30` }}
          >
            {selectedProfile === icon.id && (
              <motion.div
                layoutId="selectedProfile"
                className="bg-primary/10 absolute inset-0"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10">{icon.emoji}</span>
            {selectedProfile === icon.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-primary absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full"
              >
                <Check className="text-primary-foreground h-3 w-3" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
