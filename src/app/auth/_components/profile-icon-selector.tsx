"use client";

import { motion } from "motion/react";
import { Label } from "@/components/ui/label";
import { Sparkles, Check } from "lucide-react";
import ProfileImages from "@/lib/profile-images";
import Image from "next/image";

interface ProfileIconSelectorProps {
  selectedProfile: string;
  setSelectedProfile: (src: string) => void;
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
        {ProfileImages.map((image, index) => (
          <motion.button
            key={image.src}
            type="button"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedProfile(image.src)}
            className={`relative flex aspect-square items-center justify-center overflow-hidden rounded border-2 transition-all ${
              selectedProfile === image.src
                ? "ring-primary ring-offset-background border-primary ring-2 ring-offset-2"
                : "hover:ring-primary/50 hover:ring-offset-background hover:border-primary/30 border-transparent hover:ring-2 hover:ring-offset-2"
            }`}
          >
            <Image
              src={image.src}
              alt={image.name}
              width={64}
              height={64}
              className="relative z-10 h-full w-full object-cover"
            />
            {selectedProfile === image.src && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-primary absolute -top-1 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full"
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
