"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { MOCK_POSTS } from "@/lib/mock-data";
import { Post, Comment } from "@/lib/types";
import { motion } from "motion/react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter, useSearchParams } from "next/navigation";

// Components
import { CommunityHeader } from "./_components/community-header";
import { SearchBar } from "./_components/search-bar";
import { NewPostForm } from "./_components/new-post-form";
import { PostList } from "./_components/post-list";
import { SearchResultsInfo } from "./_components/search-results-info";

function CommunityPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingPostId = searchParams.get("edit");

  const onPostClick = (postId: string) => {
    router.push(`/community/${postId}`);
  };

  const editingPost = editingPostId
    ? MOCK_POSTS.find((p) => p.id === editingPostId) || null
    : null;
  const onEditComplete = () => {
    router.push("/community");
  };
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(MOCK_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImages, setNewPostImages] = useState<File[]>([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const isMobile = useIsMobile();

  // Open edit modal when editingPost is provided
  useEffect(() => {
    if (editingPost) {
      setNewPostTitle(editingPost.title);
      setNewPostContent(editingPost.content);
      setNewPostImages([]);
      setShowNewPost(true);
    }
  }, [editingPost]);

  // Search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = posts.filter((post) => {
      if (post.title.toLowerCase().includes(query)) return true;
      const plainContent = post.content.replace(/<[^>]*>/g, "");
      if (plainContent.toLowerCase().includes(query)) return true;
      if (post.userNickname.toLowerCase().includes(query)) return true;
      return false;
    });

    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

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

    setPosts([newPost, ...posts]);
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostImages([]);
    setShowNewPost(false);
  };

  const handleNewPostDialogChange = (open: boolean) => {
    if (open && !editingPost) {
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostImages([]);
    } else if (!open) {
      if (editingPost) {
        router.push("/community");
      }
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostImages([]);
    }
    setShowNewPost(open);
  };

  return (
    <div className="from-primary/5 via-background to-background min-h-screen bg-linear-to-b pb-24">
      <div className="px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <CommunityHeader />

          {/* Search Bar and Write Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2"
          >
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            {/* Desktop Dialog */}
            {!isMobile ? (
              <Dialog
                open={showNewPost}
                onOpenChange={handleNewPostDialogChange}
              >
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
              /* Mobile Drawer */
              <Drawer
                open={showNewPost}
                onOpenChange={handleNewPostDialogChange}
              >
                <DrawerTrigger asChild>
                  <Button className="shrink-0 shadow-lg">
                    <Plus className="mr-2 h-4 w-4" />
                    글쓰기
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[90vh] overflow-y-auto">
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
                </DrawerContent>
              </Drawer>
            )}
          </motion.div>

          {/* Search Results Info */}
          <SearchResultsInfo
            searchQuery={searchQuery}
            resultsCount={filteredPosts.length}
          />

          {/* Posts */}
          {filteredPosts.length > 0 && (
            <PostList posts={filteredPosts} onPostClick={onPostClick} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-4xl p-4">
          <div className="text-muted-foreground text-center">로딩 중...</div>
        </div>
      }
    >
      <CommunityPageContent />
    </Suspense>
  );
}
