"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessageCircle } from "lucide-react";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const KAKAO_OPEN_CHAT_URL = "https://open.kakao.com/o/smyHlGte";

function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.724 1.8 5.113 4.508 6.459-.2.724-.72 2.627-.826 3.034-.13.502.184.495.387.36.16-.107 2.544-1.725 3.576-2.428.766.107 1.558.164 2.355.164 5.523 0 10-3.463 10-7.589C22 6.463 17.523 3 12 3z" />
    </svg>
  );
}

export function ForgotPasswordModal({
  open,
  onClose,
}: ForgotPasswordModalProps) {
  const isMobile = useIsMobile();

  const handleOpenKakao = () => {
    window.open(KAKAO_OPEN_CHAT_URL, "_blank", "noopener,noreferrer");
  };

  const content = (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          카러플 군 계산기는 개인정보를 수집하지 않아
          <br />
          자체적인 비밀번호 찾기 기능을 제공하지 않습니다.
        </p>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          비밀번호를 분실하신 경우,
          <br />
          아래 카카오톡 오픈채팅으로 문의해 주세요.
        </p>
      </div>
    </div>
  );

  const footer = (
    <div className="flex w-full gap-3">
      <Button variant="outline" onClick={onClose} className="flex-1">
        닫기
      </Button>
      <Button
        onClick={handleOpenKakao}
        className="flex-1 bg-[#FEE500] text-[#191919] hover:bg-[#FDD835]"
      >
        <KakaoIcon className="h-4 w-4" />
        카카오톡 문의
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>비밀번호 찾기</DrawerTitle>
            <DrawerDescription>
              비밀번호 분실 시 카카오톡으로 문의해 주세요
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-2">{content}</div>

          <DrawerFooter>{footer}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>비밀번호 찾기</DialogTitle>
          <DialogDescription>
            비밀번호 분실 시 카카오톡으로 문의해 주세요
          </DialogDescription>
        </DialogHeader>

        {content}

        <DialogFooter className="flex-row gap-3 sm:flex-row">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
