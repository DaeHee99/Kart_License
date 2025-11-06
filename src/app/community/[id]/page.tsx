"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Post, Comment } from "@/lib/types";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter, useParams } from "next/navigation";
import { MOCK_POSTS } from "@/lib/mock-data";

// Components
import { DetailHeader } from "./_components/detail-header";
import { PostContent } from "./_components/post-content";
import { CommentsSection } from "./_components/comments-section";
import { ShareContent } from "./_components/share-content";

export default function CommunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const post = MOCK_POSTS.find((p) => p.id === postId);

  if (!post) {
    router.push("/community");
    return null;
  }

  const currentUserId = "current-user";
  const currentUrl = `${window.location.origin}/community/${post.id}`;
  const isPostAuthor = post.userId === currentUserId;

  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );
  const [deletingPost, setDeletingPost] = useState(false);
  const isMobile = useIsMobile();

  const onBack = () => {
    router.push("/community");
  };

  const onEditPost = (post: Post) => {
    router.push(`/community?edit=${post.id}`);
  };

  const handleAddComment = (content: string) => {
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: currentUserId,
      userNickname: "현재유저",
      userTier: "master",
      content,
      createdAt: new Date(),
      likes: 0,
    };

    setComments([...comments, comment]);
  };

  const handleEditComment = (commentId: string, content: string) => {
    setComments(
      comments.map((c) => (c.id === commentId ? { ...c, content } : c)),
    );
    toast.success("댓글이 수정되었습니다.");
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter((c) => c.id !== commentId));
    setDeletingCommentId(null);
    toast.success("댓글이 삭제되었습니다.");
  };

  const handleShare = async () => {
    setShowShareDialog(true);
  };

  const handleDeletePost = () => {
    toast.success("게시글이 삭제되었습니다.");
    setDeletingPost(false);
    setTimeout(() => onBack(), 500);
  };

  return (
    <div className="from-primary/5 via-background to-background min-h-screen bg-gradient-to-b pb-24">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        {/* Header */}
        <DetailHeader />

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button variant="ghost" onClick={onBack} className="-ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로
          </Button>
        </motion.div>

        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PostContent
            post={post}
            commentsCount={comments.length}
            isPostAuthor={isPostAuthor}
            onShare={handleShare}
            onEdit={onEditPost}
            onDelete={() => setDeletingPost(true)}
          />
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CommentsSection
            comments={comments}
            currentUserId={currentUserId}
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onDeleteComment={(id) => setDeletingCommentId(id)}
          />
        </motion.div>

        {/* Share Dialog */}
        <Dialog
          open={showShareDialog && !isMobile}
          onOpenChange={setShowShareDialog}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">
                게시글 공유하기 🎉
              </DialogTitle>
              <DialogDescription className="text-center">
                QR 카드를 이용하여 게시글 전용 웹 페이지로 쉽게 이동할 수
                있어요.
              </DialogDescription>
            </DialogHeader>

            <ShareContent
              post={post}
              currentUrl={currentUrl}
              onClose={() => setShowShareDialog(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Share Drawer for Mobile */}
        <Drawer
          open={showShareDialog && isMobile}
          onOpenChange={setShowShareDialog}
        >
          <DrawerContent className="h-[85vh]">
            <DrawerHeader>
              <DrawerTitle className="text-center">
                게시글 공유하기 🎉
              </DrawerTitle>
              <DrawerDescription className="text-center">
                QR 카드를 이용하여 게시글 전용 웹 페이지로 쉽게 이동할 수
                있어요.
              </DrawerDescription>
            </DrawerHeader>

            <ScrollArea className="max-h-[75vh] overflow-y-auto px-1">
              <ShareContent
                post={post}
                currentUrl={currentUrl}
                onClose={() => setShowShareDialog(false)}
              />
            </ScrollArea>
          </DrawerContent>
        </Drawer>

        {/* Delete Comment AlertDialog */}
        <AlertDialog
          open={deletingCommentId !== null}
          onOpenChange={(open) => !open && setDeletingCommentId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                이 댓글을 삭제하시겠습니까? 삭제된 댓글은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletingCommentId(null)}>
                취소
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteComment(deletingCommentId as string)}
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Post AlertDialog */}
        <AlertDialog
          open={deletingPost}
          onOpenChange={(open) => !open && setDeletingPost(false)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                이 게시글을 삭제하시겠습니까? 삭제된 게시글은 되돌릴 수
                없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletingPost(false)}>
                취소
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeletePost}>
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
