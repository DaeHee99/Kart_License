"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import ProfileImages from "@/lib/profile-images";
import Image from "next/image";

interface ProfilePictureSelectionProps {
  selectedAvatar: string;
  onAvatarChange: (avatarSrc: string) => void;
}

export function ProfilePictureSelection({
  selectedAvatar,
  onAvatarChange,
}: ProfilePictureSelectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-primary/20 relative overflow-hidden border-2 p-6">
        <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl" />
        <h3 className="mb-4 font-bold">프로필 사진 변경</h3>
        <div className="from-primary/10 to-primary/5 border-primary/20 mb-4 rounded-lg border bg-linear-to-r p-4 text-center text-sm">
          원하는 프로필 사진을 하나 선택하세요.
        </div>
        <RadioGroup value={selectedAvatar} onValueChange={onAvatarChange}>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-8">
            {ProfileImages.map((image, index) => (
              <motion.div
                key={image.src}
                className="relative flex flex-col items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                <RadioGroupItem
                  value={image.src}
                  id={`avatar-${image.src}`}
                  className="sr-only"
                />
                <Label
                  htmlFor={`avatar-${image.src}`}
                  className={`relative flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 transition-all ${
                    selectedAvatar === image.src
                      ? "ring-primary border-primary scale-110 shadow-lg ring-4"
                      : "border-transparent hover:scale-105 hover:shadow-md"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.name}
                    width={56}
                    height={56}
                    className={`h-full w-full object-cover transition-all ${
                      selectedAvatar === image.src
                        ? "brightness-110"
                        : "brightness-75"
                    }`}
                  />
                </Label>
              </motion.div>
            ))}
          </div>
        </RadioGroup>
      </Card>
    </motion.div>
  );
}
