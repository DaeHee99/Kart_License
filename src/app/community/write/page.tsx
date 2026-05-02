"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NewPostForm } from "../_components/new-post-form";
import { useAuth } from "@/hooks/use-auth";
import { useCreatePost } from "@/hooks/use-posts";
import { PostCategory } from "@/lib/types";
import { ChevronLeft, Loader2, Send } from "lucide-react";

export default function CommunityWritePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const { mutate: createPost, isPending } = useCreatePost();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [category, setCategory] = useState<PostCategory>("general");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth?redirect=/community/write");
    }
  }, [isAuthenticated, isLoading, router]);

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

  const handleCreatePost = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      const imageUrls = await convertImagesToBase64(images);

      createPost(
        {
          category,
          title: title.trim(),
          content: content.trim(),
          images: imageUrls,
        },
        {
          onSuccess: (response) => {
            if (response.success && response.data) {
              router.push(`/community/${response.data._id}`);
            }
          },
        },
      );
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

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
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/community")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">새 글 작성</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                커뮤니티에 새로운 글을 작성하세요.
              </p>
            </div>
          </div>

          <NewPostForm
            title={title}
            content={content}
            images={images}
            category={category}
            isAdmin={user?.isAdmin || false}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onImagesChange={setImages}
            onCategoryChange={(cat) => setCategory(cat as PostCategory)}
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/community")}
              disabled={isPending}
            >
              취소
            </Button>
            <Button
              className="flex-1"
              onClick={handleCreatePost}
              disabled={isPending || !title.trim() || !content.trim()}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  작성 중...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  작성하기
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
