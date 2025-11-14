"use client";

import { Post } from "@/lib/types";
import { PostCard } from "./post-card";

interface PostListProps {
  posts: Post[];
  onPostClick?: (postId: string) => void;
}

export function PostList({ posts, onPostClick }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <PostCard
          key={post._id}
          post={post}
          index={index}
          onClick={() => onPostClick?.(post._id)}
        />
      ))}
    </div>
  );
}
