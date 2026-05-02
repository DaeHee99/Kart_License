"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NewPostForm } from "../../_components/new-post-form";
import { useAuth } from "@/hooks/use-auth";
import { usePost, useUpdatePost } from "@/hooks/use-posts";
import { ChevronLeft, FileQuestion, Loader2, Send } from "lucide-react";

export default function CommunityEditPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    data: postResponse,
    isLoading: postLoading,
    isError: postError,
  } = usePost(postId);
  const { mutate: updatePost, isPending } = useUpdatePost(postId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [hasInitializedForm, setHasInitializedForm] = useState(false);

  const post = postResponse?.success ? postResponse.data : null;
  const postUserId = post ? (post as any).user?._id : "";
  const currentUserId = user?._id || "";
  const currentUserRole = user?.role || 0;
  const canModifyPost =
    !!post &&
    (postUserId === currentUserId ||
      currentUserRole === 1 ||
      currentUserRole === 2);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/auth?redirect=/community/${postId}/edit`);
    }
  }, [authLoading, isAuthenticated, postId, router]);

  useEffect(() => {
    if (!post || hasInitializedForm) return;

    setTitle(post.title);
    setContent(post.content);
    setExistingImages(post.images || []);
    setHasInitializedForm(true);
  }, [hasInitializedForm, post]);

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

  const goToDetail = () => {
    router.push(`/community/${postId}`);
  };

  const handleUpdatePost = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      const newImageUrls = await convertImagesToBase64(images);
      const allImages = [...existingImages, ...newImageUrls];

      updatePost(
        {
          title: title.trim(),
          content: content.trim(),
          images: allImages,
        },
        {
          onSuccess: (response) => {
            if (response.success) {
              router.push(`/community/${postId}`);
            }
          },
        },
      );
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  if (
    authLoading ||
    postLoading ||
    !isAuthenticated ||
    (post && !hasInitializedForm)
  ) {
    return (
      <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (postError || !post || !canModifyPost) {
    return (
      <div className="from-primary/5 via-background to-background min-h-screen bg-linear-to-b pb-24">
        <div className="px-4 py-6">
          <div className="mx-auto max-w-3xl">
            <Button variant="ghost" className="mb-6" onClick={goToDetail}>
              <ChevronLeft className="mr-2 h-5 w-5" />
              게시글로 돌아가기
            </Button>

            <Card className="border-border/50 flex flex-col items-center justify-center border-2 p-12 text-center">
              <div className="bg-muted text-muted-foreground mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <FileQuestion className="h-8 w-8" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">
                게시글을 수정할 수 없습니다
              </h2>
              <p className="text-muted-foreground mb-6 text-sm">
                게시글이 없거나 수정 권한이 없습니다.
              </p>
              <Button onClick={goToDetail}>커뮤니티 게시글로 돌아가기</Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="from-primary/5 via-background to-background min-h-screen bg-linear-to-b pb-28">
      <div className="px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToDetail}
              disabled={isPending}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">글 수정</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                게시글 내용을 수정하세요.
              </p>
            </div>
          </div>

          <NewPostForm
            title={title}
            content={content}
            images={images}
            existingImages={existingImages}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onImagesChange={setImages}
            onExistingImagesChange={setExistingImages}
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={goToDetail}
              disabled={isPending}
            >
              취소
            </Button>
            <Button
              className="flex-1"
              onClick={handleUpdatePost}
              disabled={isPending || !title.trim() || !content.trim()}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  수정 중...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  수정하기
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
