"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save } from "lucide-react";
import { MOCK_CURRENT_USER } from "@/lib/mock-data";
import { ProfilePictureSelection } from "./profile-picture-selection";
import { NicknameChange } from "./nickname-change";
import { PasswordChange } from "./password-change";

interface EditProfileViewProps {
  onBack: () => void;
}

export function EditProfileView({ onBack }: EditProfileViewProps) {
  const [nickname, setNickname] = useState(MOCK_CURRENT_USER.nickname);
  const [selectedAvatar, setSelectedAvatar] = useState("1");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    // Save logic here
    onBack();
  };

  return (
    <div className="from-primary/5 via-background to-background min-h-screen bg-linear-to-b pb-24">
      <div className="px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Header */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">정보 수정</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                프로필 정보를 수정하세요
              </p>
            </div>
          </motion.div>

          {/* Profile Picture Selection */}
          <ProfilePictureSelection
            selectedAvatar={selectedAvatar}
            onAvatarChange={setSelectedAvatar}
          />

          {/* Nickname Change */}
          <NicknameChange nickname={nickname} onNicknameChange={setNickname} />

          {/* Password Change */}
          <PasswordChange
            currentPassword={currentPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            onCurrentPasswordChange={setCurrentPassword}
            onNewPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmPassword}
          />

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button onClick={handleSave} className="w-full shadow-lg" size="lg">
              <Save className="mr-2 h-4 w-4" />
              변경사항 저장
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
