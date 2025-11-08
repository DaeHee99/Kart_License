"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Post, TIERS } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils-calc";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";

interface PostCardProps {
  post: Post;
  index: number;
  onClick?: () => void;
}

export function PostCard({ post, index, onClick }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.5) }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="border-primary/10 hover:border-primary/30 relative overflow-hidden border-2 p-6 transition-all duration-300 hover:shadow-xl">
        {/* Background gradient */}
        <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />

        <div
          className="relative z-10 flex cursor-pointer items-start gap-4"
          onClick={onClick}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Avatar className="border-primary/20 h-10 w-10 border-2">
              <AvatarFallback>{post.userNickname[0]}</AvatarFallback>
            </Avatar>
          </motion.div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-medium">{post.userNickname}</span>
              {post.userTier && (
                <Badge variant="outline" className="gap-1">
                  <div
                    className={`h-2 w-2 rounded-full ${TIERS[post.userTier].color}`}
                  />
                  {TIERS[post.userTier].nameKo}
                </Badge>
              )}
              <span className="text-muted-foreground text-xs">
                {formatRelativeTime(post.createdAt)}
              </span>
            </div>

            <h4 className="from-foreground to-foreground/70 mb-2 bg-linear-to-r bg-clip-text text-lg font-semibold">
              {post.title}
            </h4>
            <div
              className="text-muted-foreground prose prose-sm mb-4 line-clamp-3 max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Images */}
            {post.images && post.images.length > 0 && (
              <div
                className={`mb-4 grid gap-2 ${
                  post.images.length === 1
                    ? "grid-cols-1"
                    : post.images.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-2 md:grid-cols-3"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {post.images.map((image, idx) => (
                  <ImageZoom key={idx} images={post.images} currentIndex={idx}>
                    <motion.img
                      src={image}
                      alt={`${post.title} - ${idx + 1}`}
                      className="hover:border-primary/30 h-40 w-full cursor-pointer rounded-lg border-2 border-transparent object-cover transition-all"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                  </ImageZoom>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm">
              <motion.div
                className="bg-primary/5 text-primary flex items-center gap-1 rounded-full px-3 py-1.5"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "var(--primary)/10",
                }}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="font-medium">댓글 {post.comments.length}</span>
              </motion.div>
              {post.views && (
                <div className="bg-muted text-muted-foreground rounded-full px-3 py-1.5">
                  조회 {post.views}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
