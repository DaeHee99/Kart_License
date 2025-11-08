import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "sonner";
import { Post } from "@/lib/types";
import { NewPostForm } from "./new-post-form";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NewPostDialogButtonProps {
  editingPost?: Post | null;
  onEditComplete?: () => void;
  onPostCreate: (post: Post) => void;
  isMobile: boolean;
}

export function NewPostDialogButton({
  editingPost = null,
  onEditComplete,
  onPostCreate,
  isMobile,
}: NewPostDialogButtonProps) {
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImages, setNewPostImages] = useState<File[]>([]);
  const [showNewPost, setShowNewPost] = useState(false);

  // Open edit modal when editingPost is provided
  useEffect(() => {
    if (editingPost) {
      setNewPostTitle(editingPost.title);
      setNewPostContent(editingPost.content);
      setNewPostImages([]);
      setShowNewPost(true);
    }
  }, [editingPost]);

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    if (editingPost) {
      toast.success("게시글이 수정되었습니다.");
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostImages([]);
      setShowNewPost(false);
      if (onEditComplete) {
        onEditComplete();
      }
      return;
    }

    const imageUrls = newPostImages.map((file) => URL.createObjectURL(file));

    const newPost: Post = {
      id: `post-${Date.now()}`,
      userId: "user-1",
      userNickname: "카트라이더Pro",
      userTier: "diamond",
      title: newPostTitle,
      content: newPostContent,
      images: imageUrls.length > 0 ? imageUrls : undefined,
      comments: [],
      createdAt: new Date(),
    };

    onPostCreate(newPost);
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostImages([]);
    setShowNewPost(false);
  };

  const handleDialogChange = (open: boolean) => {
    if (open && !editingPost) {
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostImages([]);
    } else if (!open) {
      if (editingPost) {
        onEditComplete?.();
      }
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostImages([]);
    }
    setShowNewPost(open);
  };

  return (
    <>
      {/* Desktop Dialog */}
      {!isMobile ? (
        <Dialog open={showNewPost} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button className="shrink-0 shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              글쓰기
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? "글 수정" : "새 글 작성"}
              </DialogTitle>
              <DialogDescription>
                {editingPost
                  ? "게시글을 수정하세요."
                  : "새로운 게시글을 작성하세요."}
              </DialogDescription>
            </DialogHeader>
            <NewPostForm
              title={newPostTitle}
              content={newPostContent}
              images={newPostImages}
              onTitleChange={setNewPostTitle}
              onContentChange={setNewPostContent}
              onImagesChange={setNewPostImages}
            />
            <Button onClick={handleCreatePost} className="w-full">
              {editingPost ? "수정하기" : "작성하기"}
            </Button>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={showNewPost} onOpenChange={handleDialogChange}>
          <DrawerTrigger asChild>
            <Button className="shrink-0 shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              글쓰기
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[95vh]">
            <DrawerHeader>
              <DrawerTitle>
                {editingPost ? "글 수정" : "새 글 작성"}
              </DrawerTitle>
              <DrawerDescription>
                {editingPost
                  ? "게시글을 수정하세요."
                  : "새로운 게시글을 작성하세요."}
              </DrawerDescription>
            </DrawerHeader>

            <ScrollArea className="max-h-[95vh] overflow-y-auto px-1">
              <div className="px-4 pb-6">
                <NewPostForm
                  title={newPostTitle}
                  content={newPostContent}
                  images={newPostImages}
                  onTitleChange={setNewPostTitle}
                  onContentChange={setNewPostContent}
                  onImagesChange={setNewPostImages}
                />
                <Button onClick={handleCreatePost} className="mt-4 w-full">
                  {editingPost ? "수정하기" : "작성하기"}
                </Button>
              </div>
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
