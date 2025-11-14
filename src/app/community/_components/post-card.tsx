"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Post, TIERS } from "@/lib/types";
import {
  formatRelativeTime,
  convertKoreanTierToEnglish,
  getTierRingClass,
} from "@/lib/utils-calc";
import { motion } from "motion/react";
import { MessageCircle, Eye, Image as ImageIcon } from "lucide-react";

interface PostCardProps {
  post: Post;
  index: number;
  onClick?: () => void;
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

export function PostCard({ post, index, onClick }: PostCardProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
    >
      <Card
        className="border-border hover:border-primary/30 group cursor-pointer overflow-hidden border p-3 transition-all duration-200 hover:shadow-md"
        onClick={onClick}
      >
        <div className="flex gap-3">
          {/* 왼쪽: 유저 프로필 */}
          <Avatar
            className={
              isValidTier
                ? `ring-2 ring-offset-2 ${tierRingClass}`
                : "ring-2 ring-gray-300"
            }
          >
            {post.userProfileImage && (
              <AvatarImage
                src={post.userProfileImage}
                alt={post.userNickname}
              />
            )}
            <AvatarFallback>{post.userNickname[0]}</AvatarFallback>
          </Avatar>

          {/* 중앙: 게시글 정보 */}
          <div className="min-w-0 flex-1">
            {/* 유저 정보 및 날짜 */}
            <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-medium">{post.userNickname}</span>
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
              <span className="text-muted-foreground text-xs">
                {formatRelativeTime(post.createdAt)}
              </span>
            </div>

            {/* 제목 */}
            <h4 className="mb-1 line-clamp-1 text-sm font-semibold">
              {post.title}
            </h4>

            {/* 하단: 통계 */}
            <div className="text-muted-foreground flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{post.commentCount ?? post.comments?.length ?? 0}</span>
              </div>
              {post.views !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{post.views}</span>
                </div>
              )}
              {post.images && post.images.length > 0 && (
                <div className="flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>{post.images.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 대표 이미지 (있는 경우) */}
          {post.images && post.images.length > 0 && (
            <div className="shrink-0">
              <img
                src={post.images[0]}
                alt={post.title}
                className="h-16 w-16 rounded-md object-cover"
              />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
