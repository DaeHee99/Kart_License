"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ChevronLeft, Loader2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth, useWithdraw } from "@/hooks/use-auth";

const WITHDRAW_CONFIRM_TEXT = "회원 탈퇴";

export default function WithdrawPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdraw();
  const [confirmInput, setConfirmInput] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth?redirect=/mypage/withdraw");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="from-primary/5 via-background to-background min-h-screen bg-linear-to-b pb-28">
      <div className="px-4 py-6">
        <div className="mx-auto max-w-xl space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/mypage")}
              disabled={isWithdrawing}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">회원 탈퇴</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                탈퇴 전 안내사항을 확인해주세요.
              </p>
            </div>
          </div>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>계정 복구가 불가능합니다</AlertTitle>
            <AlertDescription>
              탈퇴 시 계정 정보는 복구할 수 없으며, 동일한 아이디로 재가입할 수
              없습니다.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <label className="text-sm font-medium" htmlFor="withdraw-confirm">
              아래에 &quot;회원 탈퇴&quot;를 정확히 입력해주세요.
            </label>
            <Input
              id="withdraw-confirm"
              placeholder={WITHDRAW_CONFIRM_TEXT}
              value={confirmInput}
              onChange={(event) => setConfirmInput(event.target.value)}
              className="border-destructive/30 focus-visible:ring-destructive/50"
              disabled={isWithdrawing}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/mypage")}
              disabled={isWithdrawing}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              disabled={confirmInput !== WITHDRAW_CONFIRM_TEXT || isWithdrawing}
              onClick={() => withdraw()}
            >
              {isWithdrawing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                <>
                  <UserX className="mr-2 h-4 w-4" />
                  탈퇴하기
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
