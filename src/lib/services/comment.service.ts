/**
 * Comment Service Layer
 * 댓글 비즈니스 로직 처리
 */

import Comment, { IComment } from "@/lib/db/models/comment.model";
import Post from "@/lib/db/models/post.model";
import { Types } from "mongoose";

export interface CreateCommentInput {
  postId: string;
  userId: string;
  content: string;
}

export interface UpdateCommentInput {
  content: string;
}

/**
 * 댓글 서비스 클래스
 */
export class CommentService {
  /**
   * 댓글 생성
   */
  async createComment(input: CreateCommentInput): Promise<IComment> {
    // 게시글 존재 여부 확인
    const postExists = await Post.findById(input.postId);
    if (!postExists) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    const comment = new Comment({
      post: new Types.ObjectId(input.postId),
      user: new Types.ObjectId(input.userId),
      content: input.content,
    });

    await comment.save();
    return comment;
  }

  /**
   * 댓글 수정
   */
  async updateComment(
    commentId: string,
    userId: string,
    input: UpdateCommentInput,
    userRole: number = 0
  ): Promise<IComment | null> {
    if (!Types.ObjectId.isValid(commentId)) {
      return null;
    }

    // 댓글 존재 여부 및 권한 확인
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return null;
    }

    // 작성자가 아니고, 관리자(1)도 운영진(2)도 아니면 수정 불가
    const isAuthor = comment.user.toString() === userId;
    const isAdminOrModerator = userRole === 1 || userRole === 2;

    if (!isAuthor && !isAdminOrModerator) {
      throw new Error("댓글 수정 권한이 없습니다.");
    }

    // 수정
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: { content: input.content } },
      { new: true, runValidators: true }
    );

    return updatedComment;
  }

  /**
   * 댓글 삭제
   */
  async deleteComment(
    commentId: string,
    userId: string,
    userRole: number = 0
  ): Promise<boolean> {
    if (!Types.ObjectId.isValid(commentId)) {
      return false;
    }

    // 댓글 존재 여부 및 권한 확인
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return false;
    }

    // 작성자가 아니고, 관리자(1)도 운영진(2)도 아니면 삭제 불가
    const isAuthor = comment.user.toString() === userId;
    const isAdminOrModerator = userRole === 1 || userRole === 2;

    if (!isAuthor && !isAdminOrModerator) {
      throw new Error("댓글 삭제 권한이 없습니다.");
    }

    // 댓글 삭제
    await Comment.findByIdAndDelete(commentId);

    return true;
  }

  /**
   * 게시글의 댓글 목록 조회
   */
  async getCommentsByPostId(postId: string, currentUserId?: string) {
    if (!Types.ObjectId.isValid(postId)) {
      return [];
    }

    const comments = await Comment.find({ post: new Types.ObjectId(postId) })
      .populate("user", "name image license role")
      .sort({ createdAt: 1 })
      .lean();

    return comments.map((comment: any) => {
      // Check if current user liked this comment
      const isLiked = currentUserId
        ? (comment.likes || []).some((likeId: Types.ObjectId) => likeId.toString() === currentUserId)
        : undefined;

      return {
        _id: comment._id.toString(),
        user: {
          _id: comment.user._id.toString(),
          name: comment.user.name,
          image: comment.user.image,
          license: comment.user.license,
          role: comment.user.role || 0,
        },
        content: comment.content,
        likeCount: (comment.likes || []).length,
        isLiked,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    });
  }
}

// Singleton 인스턴스 export
export const commentService = new CommentService();
