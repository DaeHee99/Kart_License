/**
 * Posts API Client
 */

import { PostCategory } from "@/lib/types";
import { apiClient } from "./client";

export interface CreatePostRequest {
  category: PostCategory;
  title: string;
  content: string;
  images?: string[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  images?: string[];
  category?: PostCategory;
}

export interface CreateCommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

/**
 * Posts API
 */
export const postsAPI = {
  /**
   * 게시글 목록 조회 (페이지네이션)
   */
  async getPosts(
    page: number = 1,
    limit: number = 20,
    category?: PostCategory | "all",
    searchQuery?: string
  ) {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (category) params.append("category", category);
    if (searchQuery) params.append("search", searchQuery);

    return apiClient(`/api/posts?${params.toString()}`, {
      method: "GET",
    });
  },

  /**
   * 게시글 상세 조회
   */
  async getPostById(postId: string) {
    return apiClient(`/api/posts/${postId}`, {
      method: "GET",
    });
  },

  /**
   * 게시글 생성
   */
  async createPost(data: CreatePostRequest) {
    return apiClient("/api/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * 게시글 수정
   */
  async updatePost(postId: string, data: UpdatePostRequest) {
    return apiClient(`/api/posts/${postId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * 게시글 삭제
   */
  async deletePost(postId: string) {
    return apiClient(`/api/posts/${postId}`, {
      method: "DELETE",
    });
  },

  /**
   * 댓글 목록 조회
   */
  async getComments(postId: string) {
    return apiClient(`/api/posts/${postId}/comments`, {
      method: "GET",
    });
  },

  /**
   * 댓글 생성
   */
  async createComment(postId: string, data: CreateCommentRequest) {
    return apiClient(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * 댓글 수정
   */
  async updateComment(commentId: string, data: UpdateCommentRequest) {
    return apiClient(`/api/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * 댓글 삭제
   */
  async deleteComment(commentId: string) {
    return apiClient(`/api/comments/${commentId}`, {
      method: "DELETE",
    });
  },

  /**
   * 게시글 좋아요 토글
   */
  async togglePostLike(postId: string) {
    return apiClient(`/api/posts/${postId}/like`, {
      method: "POST",
    });
  },

  /**
   * 댓글 좋아요 토글
   */
  async toggleCommentLike(commentId: string) {
    return apiClient(`/api/comments/${commentId}/like`, {
      method: "POST",
    });
  },
};
