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
import { useRouter } from "next/navigation";
import { LogIn, History, TrendingUp, Users } from "lucide-react";

interface LoginPromptModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginPromptModal({ open, onClose }: LoginPromptModalProps) {
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleLogin = () => {
    // 로그인 페이지로 이동하면서 redirect 파라미터 설정
    router.push("/auth?tab=login&redirect=/measure");
    onClose();
  };

  const benefits = [
    {
      icon: <History className="h-4 w-4" />,
      text: "측정 기록 저장",
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      text: "군 변화 추적",
    },
    {
      icon: <Users className="h-4 w-4" />,
      text: "커뮤니티 참여",
    },
  ];

  const content = (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          비로그인 상태입니다. 로그인을 하시겠습니까?
          <br />
          로그인을 하시면 더 다양한 기능을 이용할 수 있습니다.
        </p>
      </div>

      <div className="space-y-2">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-md border p-3"
          >
            <div className="text-primary">{benefit.icon}</div>
            <span className="text-sm font-medium">{benefit.text}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const footer = (
    <div className="flex w-full gap-3">
      <Button variant="outline" onClick={onClose} className="flex-1">
        취소
      </Button>
      <Button onClick={handleLogin} className="flex-1">
        <LogIn className="mr-2 h-4 w-4" />
        로그인
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>로그인을 하시겠습니까?</DrawerTitle>
            <DrawerDescription>
              로그인하여 더 많은 기능을 이용해보세요
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
          <DialogTitle>로그인을 하시겠습니까?</DialogTitle>
          <DialogDescription>
            로그인하여 더 많은 기능을 이용해보세요
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
