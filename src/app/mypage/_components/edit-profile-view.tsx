"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import { ProfilePictureSelection } from "./profile-picture-selection";
import { NicknameChange } from "./nickname-change";
import { PasswordChange } from "./password-change";
import { useAuth, useUpdateProfile } from "@/hooks/use-auth";
import { toast } from "sonner";
import { basicProfileImage } from "@/lib/profile-images";

interface EditProfileViewProps {
  onBack: () => void;
}

export function EditProfileView({ onBack }: EditProfileViewProps) {
  const { user, isLoading: userLoading } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 유저 정보 로드 시 초기값 설정
  useEffect(() => {
    if (user) {
      setNickname(user.name);
      setSelectedAvatar(user.image || basicProfileImage);
    }
  }, [user]);

  const handleSave = () => {
    // 변경된 항목만 전송
    const updates: { name?: string; password?: string; image?: string } = {};

    // 닉네임 변경 체크
    if (nickname && nickname !== user?.name) {
      updates.name = nickname;
    }

    // 프로필 사진 변경 체크
    if (selectedAvatar && selectedAvatar !== user?.image) {
      updates.image = selectedAvatar;
    }

    // 비밀번호 변경 체크
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        toast.error("새 비밀번호가 일치하지 않습니다");
        return;
      }
      updates.password = newPassword;
    }

    // 변경 사항이 없는 경우
    if (Object.keys(updates).length === 0) {
      toast.info("변경된 내용이 없습니다");
      return;
    }

    // API 호출
    updateProfile(updates, {
      onSuccess: () => {
        // 비밀번호 필드 초기화
        setNewPassword("");
        setConfirmPassword("");
        onBack();
      },
    });
  };

  if (userLoading || !user) {
    return null;
  }

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
          <NicknameChange
            nickname={nickname}
            onNicknameChange={setNickname}
            disabled={isPending}
          />

          {/* Password Change */}
          <PasswordChange
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            onNewPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmPassword}
            disabled={isPending}
          />

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="w-full shadow-lg"
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  변경사항 저장
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
