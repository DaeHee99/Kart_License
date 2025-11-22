"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Post, TIERS } from "@/lib/types";
import {
  formatRelativeTime,
  convertKoreanTierToEnglish,
  getTierRingClass,
} from "@/lib/utils-calc";
import {
  Share2,
  MessageCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Crown,
} from "lucide-react";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LikeButton } from "../../_components/like-button";

interface PostContentProps {
  post: Post;
  commentsCount: number;
  isPostAuthor: boolean;
  onShare: () => void;
  onEdit?: (post: Post) => void;
  onDelete: () => void;
  onToggleLike: () => void;
  isLiking?: boolean;
}

// 카테고리 뱃지 색상 매핑
const CATEGORY_COLORS = {
  notice: "bg-red-500/10 text-red-600 border-red-500/30",
  general: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  question: "bg-green-500/10 text-green-600 border-green-500/30",
};

const CATEGORY_LABELS = {
  notice: "공지",
  general: "일반",
  question: "질문",
};

export function PostContent({
  post,
  commentsCount,
  isPostAuthor,
  onShare,
  onEdit,
  onDelete,
  onToggleLike,
  isLiking,
}: PostContentProps) {
  const router = useRouter();

  // 티어 변환 (한국어 -> 영어)
  const tierEnglish = post.userTier
    ? convertKoreanTierToEnglish(post.userTier)
    : null;

  // TIERS에 존재하는 유효한 티어인지 확인
  const isValidTier = tierEnglish && TIERS[tierEnglish as keyof typeof TIERS];
  const tierColor = isValidTier
    ? TIERS[tierEnglish as keyof typeof TIERS].color
    : "bg-gray-500";
  const tierRingClass = isValidTier
    ? getTierRingClass(tierEnglish as keyof typeof TIERS)
    : "ring-gray-500";

  // 유저 프로필 페이지로 이동
  const handleUserClick = () => {
    if (post.userId) {
      router.push(`/userpage/${post.userId}`);
    }
  };

  return (
    <Card className="border-primary/10 hover:border-primary/20 relative overflow-hidden border-2 p-6 transition-all">
      {/* Background gradient */}
      <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 hidden h-40 w-40 rounded-full blur-3xl md:block" />
      <div className="bg-primary/5 pointer-events-none absolute bottom-0 left-0 hidden h-32 w-32 rounded-full blur-3xl md:block" />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex flex-1 items-center gap-3">
          <Avatar
            className={`cursor-pointer transition-opacity hover:opacity-80 ${isValidTier ? `ring-2 ring-offset-2 ${tierRingClass}` : "ring-2 ring-gray-300"}`}
            onClick={handleUserClick}
          >
            {post.userProfileImage && (
              <AvatarImage
                src={post.userProfileImage}
                alt={post.userNickname}
              />
            )}
            <AvatarFallback>{post.userNickname?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="hover:text-primary cursor-pointer font-medium transition-colors"
                onClick={handleUserClick}
              >
                {post.userNickname}
              </span>
              {post.userRole === 1 && (
                <Badge className="gap-1 bg-yellow-500/10 text-yellow-700 border-yellow-500/30 text-xs">
                  <Crown className="h-3 w-3" />
                  관리자
                </Badge>
              )}
              {post.userRole === 2 && (
                <Badge className="gap-1 bg-purple-500/10 text-purple-700 border-purple-500/30 text-xs">
                  <Crown className="h-3 w-3" />
                  운영진
                </Badge>
              )}
              {isValidTier && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <div className={`h-1.5 w-1.5 rounded-full ${tierColor}`} />
                  {TIERS[tierEnglish as keyof typeof TIERS].nameKo}
                </Badge>
              )}
              {post.category && (
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold ${CATEGORY_COLORS[post.category as keyof typeof CATEGORY_COLORS]}`}
                >
                  {
                    CATEGORY_LABELS[
                      post.category as keyof typeof CATEGORY_LABELS
                    ]
                  }
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
        className="prose prose-sm dark:prose-invert [&_blockquote]:border-primary [&_code]:bg-muted [&_pre]:bg-muted [&_hr]:border-border [&_a]:text-primary [&_th]:border-border [&_th]:bg-muted [&_td]:border-border mb-4 max-w-none [&_a]:cursor-pointer [&_a]:underline [&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:text-lg [&_h3]:font-bold [&_hr]:my-4 [&_img]:my-3 [&_img]:rounded-lg [&_li]:mb-0.5 [&_ol]:mb-2 [&_ol]:ml-6 [&_ol]:list-decimal [&_p]:mb-2 [&_p]:leading-6 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:p-4 [&_table]:my-3 [&_table]:w-full [&_table]:table-auto [&_table]:border-collapse [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_th]:font-bold [&_ul]:mb-2 [&_ul]:ml-6 [&_ul]:list-disc"
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
      <div className="border-border mt-6 flex items-center gap-4 border-t pt-4 text-sm">
        <LikeButton
          isLiked={post.isLiked ?? false}
          likeCount={post.likeCount ?? 0}
          onToggle={onToggleLike}
          isLoading={isLiking}
          size="md"
        />
        <div className="text-muted-foreground flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>댓글 {commentsCount}</span>
        </div>
        <div className="text-muted-foreground">조회 {post.views}</div>
      </div>
    </Card>
  );
}
