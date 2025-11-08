"use client";

import { useState } from "react";
import { Post, Comment } from "@/lib/types";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { MOCK_POSTS } from "@/lib/mock-data";
import { DetailHeader } from "./_components/detail-header";
import { PostContent } from "./_components/post-content";
import { CommentsSection } from "./_components/comments-section";
import { BackButton } from "./_components/back-button";
import { ShareDialogWrapper } from "./_components/share-dialog-wrapper";
import { DeleteAlerts } from "./_components/delete-alerts";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { NewPostForm } from "../_components/new-post-form";
import { Button } from "@/components/ui/button";

export default function CommunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const isMobile = useIsMobile();

  const [currentPost, setCurrentPost] = useState<Post | null>(
    MOCK_POSTS.find((p) => p.id === postId) || null
  );

  if (!currentPost) {
    router.replace("/community");
    return null;
  }

  const currentUserId = "current-user";
  const isPostAuthor = currentPost.userId === currentUserId;

  const [comments, setComments] = useState<Comment[]>(currentPost.comments || []);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );
  const [deletingPost, setDeletingPost] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImages, setEditImages] = useState<File[]>([]);

  const onBack = () => {
    router.push("/community");
  };

  const onEditPost = (post: Post) => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditImages([]);
    setShowEditDialog(true);
  };

  const handleEditComplete = () => {
    if (!editTitle.trim() || !editContent.trim()) return;

    // 수정된 게시글로 상태 업데이트
    const updatedPost: Post = {
      ...currentPost,
      title: editTitle,
      content: editContent,
    };

    setCurrentPost(updatedPost);
    setShowEditDialog(false);
    setEditTitle("");
    setEditContent("");
    setEditImages([]);
    toast.success("게시글이 수정되었습니다.");
  };

  const handleEditDialogChange = (open: boolean) => {
    if (!open) {
      setEditTitle("");
      setEditContent("");
      setEditImages([]);
    }
    setShowEditDialog(open);
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
    <div className="from-primary/5 via-background to-background min-h-screen bg-linear-to-b pb-24">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <DetailHeader />
        <BackButton onBack={onBack} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PostContent
            post={currentPost}
            commentsCount={comments.length}
            isPostAuthor={isPostAuthor}
            onShare={handleShare}
            onEdit={onEditPost}
            onDelete={() => setDeletingPost(true)}
          />
        </motion.div>

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

        <ShareDialogWrapper
          showShareDialog={showShareDialog}
          onOpenChange={setShowShareDialog}
          post={currentPost}
        />

        <DeleteAlerts
          deletingCommentId={deletingCommentId}
          deletingPost={deletingPost}
          onDeleteComment={handleDeleteComment}
          onDeletePost={handleDeletePost}
          onCancelDeleteComment={() => setDeletingCommentId(null)}
          onCancelDeletePost={() => setDeletingPost(false)}
        />

        {/* Edit Dialog/Drawer */}
        {!isMobile ? (
          <Dialog open={showEditDialog} onOpenChange={handleEditDialogChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>글 수정</DialogTitle>
                <DialogDescription>
                  게시글을 수정하세요.
                </DialogDescription>
              </DialogHeader>
              <NewPostForm
                title={editTitle}
                content={editContent}
                images={editImages}
                onTitleChange={setEditTitle}
                onContentChange={setEditContent}
                onImagesChange={setEditImages}
              />
              <Button onClick={handleEditComplete} className="w-full">
                수정하기
              </Button>
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={showEditDialog} onOpenChange={handleEditDialogChange}>
            <DrawerContent className="max-h-[95vh]">
              <DrawerHeader>
                <DrawerTitle>글 수정</DrawerTitle>
                <DrawerDescription>
                  게시글을 수정하세요.
                </DrawerDescription>
              </DrawerHeader>
              <ScrollArea className="max-h-[95vh] overflow-y-auto px-1">
                <div className="px-4 pb-6">
                  <NewPostForm
                    title={editTitle}
                    content={editContent}
                    images={editImages}
                    onTitleChange={setEditTitle}
                    onContentChange={setEditContent}
                    onImagesChange={setEditImages}
                  />
                  <Button onClick={handleEditComplete} className="mt-4 w-full">
                    수정하기
                  </Button>
                </div>
              </ScrollArea>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
}
