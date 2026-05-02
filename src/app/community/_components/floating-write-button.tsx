"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuth } from "@/hooks/use-auth";
import { useCreatePost } from "@/hooks/use-posts";
import { Button } from "@/components/ui/button";
import { PenSquare, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NewPostForm } from "./new-post-form";
import { motion } from "motion/react";
import { LoginRequiredDialog } from "./login-required-dialog";
import { PostCategory } from "@/lib/types";

const COMPACT_LAYOUT_QUERY = "(max-width: 1023px)";

export function FloatingWriteButton() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [category, setCategory] = useState<PostCategory>("general");
  const isCompactLayout = useMediaQuery(COMPACT_LAYOUT_QUERY);
  const { isAuthenticated, user } = useAuth();
  const { mutate: createPost, isPending } = useCreatePost();

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

  const handleCreatePost = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      // Convert images to base64
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
              setShowDialog(false);
              setTitle("");
              setContent("");
              setImages([]);
              setCategory("general");
              // Navigate to the new post
              router.push(`/community/${response.data._id}`);
            }
          },
        },
      );
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setTitle("");
      setContent("");
      setImages([]);
      setCategory("general");
    }
    setShowDialog(open);
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="fixed right-6 bottom-20 z-40"
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-xl"
          onClick={() => {
            if (!isAuthenticated) {
              setShowLoginDialog(true);
            } else if (
              isCompactLayout ||
              window.matchMedia(COMPACT_LAYOUT_QUERY).matches
            ) {
              router.push("/community/write");
            } else {
              setShowDialog(true);
            }
          }}
        >
          <PenSquare className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* 로그인 필요 다이얼로그 */}
      <LoginRequiredDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        message="게시글을 작성하려면 로그인이 필요합니다."
      />

      {/* 데스크톱 글쓰기 다이얼로그 */}
      <Dialog open={showDialog} onOpenChange={handleDialogChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>새 글 작성</DialogTitle>
            <DialogDescription>
              커뮤니티에 새로운 글을 작성하세요.
            </DialogDescription>
          </DialogHeader>
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
          <Button
            onClick={handleCreatePost}
            className="w-full"
            disabled={isPending || !title.trim() || !content.trim()}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                작성 중...
              </>
            ) : (
              "작성하기"
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
