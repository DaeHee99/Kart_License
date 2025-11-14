"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { useRouter, useParams } from "next/navigation";
import { DetailHeader } from "./_components/detail-header";
import { PostContent } from "./_components/post-content";
import { CommentsSection } from "./_components/comments-section";
import { BackButton } from "./_components/back-button";
import { ShareDialogWrapper } from "./_components/share-dialog-wrapper";
import { DeleteAlerts } from "./_components/delete-alerts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import {
  usePost,
  useComments,
  useUpdatePost,
  useDeletePost,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from "@/hooks/use-posts";
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
import { Loader2 } from "lucide-react";

export default function CommunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const isMobile = useIsMobile();
  const { user, isAuthenticated } = useAuth();

  // Queries
  const { data: postResponse, isLoading: isLoadingPost, isError: isErrorPost } = usePost(postId);
  const { data: commentsResponse, isLoading: isLoadingComments } = useComments(postId);

  // Mutations
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost(postId);
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const { mutate: createComment } = useCreateComment(postId);
  const { mutate: updateComment } = useUpdateComment(postId);
  const { mutate: deleteComment } = useDeleteComment(postId);

  const [showShareDialog, setShowShareDialog] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [deletingPost, setDeletingPost] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImages, setEditImages] = useState<File[]>([]);
  const [editExistingImages, setEditExistingImages] = useState<string[]>([]);

  // 날짜를 Date 객체로 변환 및 데이터 구조 매핑 (Hooks는 항상 같은 순서로 호출되어야 함)
  const currentPost = useMemo(() => {
    if (!postResponse?.data) return null;
    const data = postResponse.data;
    return {
      _id: data._id,
      userId: (data as any).user._id,
      userNickname: (data as any).user.name,
      userProfileImage: (data as any).user.image,
      userTier: (data as any).user.license,
      category: data.category,
      title: data.title,
      content: data.content,
      images: data.images,
      comments: [], // 댓글은 따로 관리
      commentCount: data.commentCount,
      views: data.views,
      createdAt: new Date(data.createdAt),
    };
  }, [postResponse]);

  const comments = useMemo(() => {
    if (!commentsResponse?.success || !commentsResponse.data) return [];
    return commentsResponse.data.map((comment: any) => ({
      id: comment._id,
      userId: comment.user._id,
      userNickname: comment.user.name,
      userProfileImage: comment.user.image,
      userTier: comment.user.license,
      content: comment.content,
      createdAt: new Date(comment.createdAt),
    }));
  }, [commentsResponse]);

  const currentUserId = user?._id || "";
  const isPostAuthor = currentPost?.userId === currentUserId;

  // Loading state
  if (isLoadingPost) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error or not found
  if (isErrorPost || !postResponse?.success || !currentPost) {
    router.replace("/community");
    return null;
  }

  const onBack = () => {
    router.push("/community");
  };

  const onEditPost = () => {
    setEditTitle(currentPost.title);
    setEditContent(currentPost.content);
    setEditImages([]);
    setEditExistingImages(currentPost.images || []);
    setShowEditDialog(true);
  };

  // Convert images to base64
  const convertImagesToBase64 = async (files: File[]): Promise<string[]> => {
    const promises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    return Promise.all(promises);
  };

  const handleEditComplete = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;

    try {
      // 새로 업로드한 이미지를 base64로 변환
      const newImageUrls = await convertImagesToBase64(editImages);

      // 기존 이미지 + 새 이미지 합치기
      const allImages = [...editExistingImages, ...newImageUrls];

      updatePost(
        {
          title: editTitle.trim(),
          content: editContent.trim(),
          images: allImages,
        },
        {
          onSuccess: () => {
            setShowEditDialog(false);
            setEditTitle("");
            setEditContent("");
            setEditImages([]);
            setEditExistingImages([]);
          },
        }
      );
    } catch (error) {
      console.error("Failed to update post:", error);
    }
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
    createComment(content);
  };

  const handleEditComment = (commentId: string, content: string) => {
    updateComment({ commentId, content });
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId, {
      onSuccess: () => {
        setDeletingCommentId(null);
      },
    });
  };

  const handleShare = async () => {
    setShowShareDialog(true);
  };

  const handleDeletePost = () => {
    deletePost(postId, {
      onSuccess: () => {
        setDeletingPost(false);
        router.push("/community");
      },
    });
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
            isAuthenticated={isAuthenticated}
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
                existingImages={editExistingImages}
                onTitleChange={setEditTitle}
                onContentChange={setEditContent}
                onImagesChange={setEditImages}
                onExistingImagesChange={setEditExistingImages}
              />
              <Button
                onClick={handleEditComplete}
                className="w-full"
                disabled={isUpdating || !editTitle.trim() || !editContent.trim()}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    수정 중...
                  </>
                ) : (
                  "수정하기"
                )}
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
                    existingImages={editExistingImages}
                    onTitleChange={setEditTitle}
                    onContentChange={setEditContent}
                    onImagesChange={setEditImages}
                    onExistingImagesChange={setEditExistingImages}
                  />
                  <Button
                    onClick={handleEditComplete}
                    className="mt-4 w-full"
                    disabled={isUpdating || !editTitle.trim() || !editContent.trim()}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        수정 중...
                      </>
                    ) : (
                      "수정하기"
                    )}
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
