"use client";

import { useState, useEffect, Suspense } from "react";
import { MOCK_POSTS } from "@/lib/mock-data";
import { Post } from "@/lib/types";
import { motion } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter, useSearchParams } from "next/navigation";
import { CommunityHeader } from "./_components/community-header";
import { SearchBar } from "./_components/search-bar";
import { PostList } from "./_components/post-list";
import { SearchResultsInfo } from "./_components/search-results-info";
import { NewPostDialogButton } from "./_components/new-post-dialog-button";

export default function CommunityPage() {
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
  const isMobile = useIsMobile();

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

  const handleCreatePost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="from-primary/5 via-background to-background min-h-screen bg-linear-to-b pb-24">
      <div className="px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <CommunityHeader />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2"
          >
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <NewPostDialogButton
              editingPost={editingPost}
              onEditComplete={onEditComplete}
              onPostCreate={handleCreatePost}
              isMobile={isMobile}
            />
          </motion.div>

          <SearchResultsInfo
            searchQuery={searchQuery}
            resultsCount={filteredPosts.length}
          />

          {filteredPosts.length > 0 && (
            <PostList posts={filteredPosts} onPostClick={onPostClick} />
          )}
        </div>
      </div>
    </div>
  );
}
