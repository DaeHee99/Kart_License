"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

interface PasswordChangeProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  onCurrentPasswordChange: (password: string) => void;
  onNewPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
}

export function PasswordChange({
  currentPassword,
  newPassword,
  confirmPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
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
              htmlFor="current-password"
              className="mb-2 flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />
              현재 비밀번호
            </Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => onCurrentPasswordChange(e.target.value)}
              placeholder="현재 비밀번호를 입력하세요"
              className="border-primary/20"
            />
          </div>
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
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
