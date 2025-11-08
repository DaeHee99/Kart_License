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

export default function CommunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const post = MOCK_POSTS.find((p) => p.id === postId);

  if (!post) {
    router.replace("/community");
    return null;
  }

  const currentUserId = "current-user";
  const isPostAuthor = post.userId === currentUserId;

  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );
  const [deletingPost, setDeletingPost] = useState(false);

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
            post={post}
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
          post={post}
        />

        <DeleteAlerts
          deletingCommentId={deletingCommentId}
          deletingPost={deletingPost}
          onDeleteComment={handleDeleteComment}
          onDeletePost={handleDeletePost}
          onCancelDeleteComment={() => setDeletingCommentId(null)}
          onCancelDeletePost={() => setDeletingPost(false)}
        />
      </div>
    </div>
  );
}
