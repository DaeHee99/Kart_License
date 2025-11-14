"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Comment, TIERS } from "@/lib/types";
import {
  formatRelativeTime,
  convertKoreanTierToEnglish,
  getTierRingClass,
} from "@/lib/utils-calc";
import { motion } from "motion/react";
import {
  MessageCircle,
  Send,
  MoreVertical,
  Edit2,
  Trash2,
  Check,
  X,
  LogIn,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoginRequiredDialog } from "../../_components/login-required-dialog";

interface CommentsSectionProps {
  comments: Comment[];
  currentUserId?: string | null;
  isAuthenticated: boolean;
  onAddComment: (content: string) => void;
  onEditComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export function CommentsSection({
  comments,
  currentUserId,
  isAuthenticated,
  onAddComment,
  onEditComment,
  onDeleteComment,
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment("");
  };

  const handleStartEdit = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
  };

  const handleSaveEdit = (commentId: string) => {
    if (!editingCommentContent.trim()) return;
    onEditComment(commentId, editingCommentContent);
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  return (
    <Card className="border-primary/10 hover:border-primary/20 relative overflow-hidden border-2 p-6 transition-all">
      {/* Background gradient */}
      <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 hidden h-40 w-40 rounded-full blur-3xl md:block" />

      <div className="relative">
        <h3 className="mb-4 flex items-center gap-2 font-bold">
          <MessageCircle className="text-primary h-5 w-5" />
          댓글 {comments.length}개
        </h3>

        {/* Comments List */}
        <div className="mb-6 space-y-4">
          {comments.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <MessageCircle className="mx-auto mb-3 h-12 w-12 opacity-50" />
              <p>첫 댓글을 작성해보세요!</p>
            </div>
          ) : (
            comments.map((comment, idx) => {
              // 티어 변환 (한국어 -> 영어)
              const tierEnglish = comment.userTier
                ? convertKoreanTierToEnglish(comment.userTier)
                : null;

              // TIERS에 존재하는 유효한 티어인지 확인
              const isValidTier =
                tierEnglish && TIERS[tierEnglish as keyof typeof TIERS];
              const commentTierColor = isValidTier
                ? TIERS[tierEnglish as keyof typeof TIERS].color
                : "bg-gray-500";
              const commentTierRingClass = isValidTier
                ? getTierRingClass(tierEnglish as keyof typeof TIERS)
                : "ring-gray-500";
              const isCommentAuthor = comment.userId === currentUserId;

              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-muted/50 flex gap-3 rounded-lg p-3 transition-colors"
                >
                  <Avatar
                    className={
                      isValidTier
                        ? `ring-2 ring-offset-1 ${commentTierRingClass}`
                        : "ring-2 ring-gray-300"
                    }
                  >
                    {comment.userProfileImage && (
                      <AvatarImage
                        src={comment.userProfileImage}
                        alt={comment.userNickname}
                      />
                    )}
                    <AvatarFallback>
                      {comment.userNickname?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {comment.userNickname}
                      </span>
                      {isValidTier && (
                        <Badge variant="outline" className="gap-1 text-xs">
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${commentTierColor}`}
                          />
                          {TIERS[tierEnglish as keyof typeof TIERS].nameKo}
                        </Badge>
                      )}
                      <span className="text-muted-foreground text-xs">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    {editingCommentId === comment.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editingCommentContent}
                          onChange={(e) =>
                            setEditingCommentContent(e.target.value)
                          }
                          placeholder="댓글을 입력하세요..."
                          className="min-h-[60px] flex-1"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSaveEdit(comment.id)}
                            size="sm"
                            className="gap-2"
                          >
                            <Check className="h-4 w-4" />
                            저장
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            size="sm"
                            variant="outline"
                            className="gap-2"
                          >
                            <X className="h-4 w-4" />
                            취소
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    )}
                  </div>
                  {isCommentAuthor && editingCommentId !== comment.id && (
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground h-8 w-8"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="min-w-[120px]"
                      >
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onSelect={() =>
                            handleStartEdit(comment.id, comment.content)
                          }
                        >
                          <div className="flex items-center gap-2">
                            <Edit2 className="h-4 w-4" />
                            <span>수정</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onSelect={() => onDeleteComment(comment.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            <span>삭제</span>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        {/* Comment Input */}
        <div className="border-border border-t pt-4">
          {isAuthenticated ? (
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                className="flex-1"
              />
              <Button onClick={handleAddComment} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="bg-muted/50 flex flex-col items-center justify-center gap-3 rounded-lg py-6">
              <p className="text-muted-foreground text-sm">
                댓글을 작성하려면 로그인이 필요합니다.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowLoginDialog(true)}
              >
                <LogIn className="h-4 w-4" />
                로그인하기
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 로그인 필요 다이얼로그 */}
      <LoginRequiredDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        message="댓글을 작성하려면 로그인이 필요합니다."
      />
    </Card>
  );
}
