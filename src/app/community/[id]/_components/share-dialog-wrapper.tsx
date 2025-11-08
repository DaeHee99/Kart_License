import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Post } from "@/lib/types";
import { ShareContent } from "./share-content";
import { useIsMobile } from "@/hooks/use-mobile";

interface ShareDialogWrapperProps {
  showShareDialog: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post;
}

export function ShareDialogWrapper({
  showShareDialog,
  onOpenChange,
  post,
}: ShareDialogWrapperProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={showShareDialog} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>게시글 공유하기 🎉</DrawerTitle>
            <DrawerDescription>
              게시글을 공유할 수 있는 링크와 QR 카드를 생성합니다.
            </DrawerDescription>
          </DrawerHeader>

          <ScrollArea className="max-h-[90vh] overflow-y-auto px-1">
            <ShareContent post={post} onClose={() => onOpenChange(false)} />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={showShareDialog} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col px-0 sm:max-w-[500px]">
        <DialogHeader className="px-6">
          <DialogTitle>게시글 공유하기 🎉</DialogTitle>
          <DialogDescription>
            게시글을 공유할 수 있는 링크와 QR 카드를 생성합니다.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] overflow-y-auto pr-4 pl-6">
          <ShareContent post={post} onClose={() => onOpenChange(false)} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
