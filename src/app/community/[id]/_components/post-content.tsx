"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Post, TIERS } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils-calc";
import { Share2, MessageCircle, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface PostContentProps {
  post: Post;
  commentsCount: number;
  isPostAuthor: boolean;
  onShare: () => void;
  onEdit?: (post: Post) => void;
  onDelete: () => void;
}

export function PostContent({
  post,
  commentsCount,
  isPostAuthor,
  onShare,
  onEdit,
  onDelete,
}: PostContentProps) {
  const tierColor = post.userTier
    ? TIERS[post.userTier]?.color || "#6B7280"
    : "#6B7280";

  return (
    <Card className="border-primary/10 hover:border-primary/20 relative overflow-hidden border-2 p-6 transition-all">
      {/* Background gradient */}
      <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl hidden md:block" />
      <div className="bg-primary/5 pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full blur-3xl hidden md:block" />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex flex-1 items-center gap-3">
          <Avatar
            className="ring-2"
            style={{ borderColor: tierColor } as React.CSSProperties}
          >
            <AvatarFallback
              style={{
                backgroundColor: `${tierColor}20`,
                color: tierColor,
              }}
            >
              {post.userNickname[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{post.userNickname}</span>
              {post.userTier && (
                <Badge variant="outline" className="gap-1">
                  <div className={`h-2 w-2 rounded-full ${tierColor}`} />
                  {TIERS[post.userTier].nameKo}
                </Badge>
              )}
            </div>
            <div className="text-muted-foreground text-sm">
              {formatRelativeTime(post.createdAt)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            공유
          </Button>
          {isPostAuthor && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground h-9 w-9"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[120px]">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => {
                    if (onEdit) {
                      onEdit(post);
                    } else {
                      toast.info("게시글 수정 기능은 준비 중입니다.");
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Edit2 className="h-4 w-4" />
                    <span>수정</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onSelect={onDelete}
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    <span>삭제</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Title */}
      <h1 className="mb-4 text-2xl font-bold">{post.title}</h1>

      {/* Content */}
      <div
        className="prose prose-sm dark:prose-invert mb-4 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {post.images.map((img, idx) => (
            <ImageZoom key={idx} images={post.images} currentIndex={idx}>
              <img
                src={img}
                alt={`Image ${idx + 1}`}
                className="h-48 w-full cursor-pointer rounded-lg object-cover transition-opacity hover:opacity-90"
              />
            </ImageZoom>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="border-border text-muted-foreground mt-6 flex items-center gap-4 border-t pt-4 text-sm">
        <div className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>댓글 {commentsCount}</span>
        </div>
        <div>조회 {post.views}</div>
      </div>
    </Card>
  );
}
