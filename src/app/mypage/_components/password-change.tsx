"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

interface PasswordChangeProps {
  newPassword: string;
  confirmPassword: string;
  onNewPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  disabled?: boolean;
}

export function PasswordChange({
  newPassword,
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
  disabled,
}: PasswordChangeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-primary/20 border-2 p-6">
        <h3 className="mb-4 font-bold">비밀번호 변경</h3>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="new-password"
              className="mb-2 flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />새 비밀번호
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => onNewPasswordChange(e.target.value)}
              placeholder="새 비밀번호를 입력하세요"
              className="border-primary/20"
              disabled={disabled}
            />
          </div>
          <div>
            <Label
              htmlFor="confirm-password"
              className="mb-2 flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />
              비밀번호 확인
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              className="border-primary/20"
              disabled={disabled}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
