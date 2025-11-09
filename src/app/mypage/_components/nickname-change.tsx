"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface NicknameChangeProps {
  nickname: string;
  onNicknameChange: (nickname: string) => void;
  disabled?: boolean;
}

export function NicknameChange({
  nickname,
  onNicknameChange,
  disabled,
}: NicknameChangeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-primary/20 border-2 p-6">
        <h3 className="mb-4 font-bold">닉네임 변경</h3>
        <div>
          <Label htmlFor="nickname" className="mb-2 flex items-center gap-2">
            <User className="h-4 w-4" />
            닉네임
          </Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            placeholder="닉네임을 입력하세요"
            className="border-primary/20"
            disabled={disabled}
          />
        </div>
      </Card>
    </motion.div>
  );
}
