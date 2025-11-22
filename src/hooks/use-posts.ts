/**
 * Posts 관련 Hooks
 */

import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { postsAPI, CreatePostRequest, UpdatePostRequest } from "@/lib/api/posts";
import { PostCategory } from "@/lib/types";
import { toast } from "sonner";

// Query Keys
export const POSTS_QUERY_KEY = (
  category?: PostCategory | "all",
  searchQuery?: string
) => ["posts", category, searchQuery] as const;

export const POST_DETAIL_QUERY_KEY = (postId: string) =>
  ["posts", postId] as const;

export const COMMENTS_QUERY_KEY = (postId: string) =>
  ["posts", postId, "comments"] as const;

/**
 * 게시글 목록 조회 (무한 스크롤)
 */
export function useInfinitePosts(
  category?: PostCategory | "all",
  searchQuery?: string,
  limit: number = 20
) {
  return useInfiniteQuery({
    queryKey: POSTS_QUERY_KEY(category, searchQuery),
    queryFn: ({ pageParam = 1 }) =>
      postsAPI.getPosts(pageParam, limit, category, searchQuery),
    getNextPageParam: (lastPage) => {
      if (!lastPage.success || !lastPage.data) return undefined;
      const { currentPage, totalPages } = lastPage.data;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1 * 60 * 1000, // 1분
  });
}

/**
 * 게시글 상세 조회
 */
export function usePost(postId: string) {
  return useQuery({
    queryKey: POST_DETAIL_QUERY_KEY(postId),
    queryFn: () => postsAPI.getPostById(postId),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000, // 5분
  });
}

/**
 * 댓글 목록 조회
 */
export function useComments(postId: string) {
  return useQuery({
    queryKey: COMMENTS_QUERY_KEY(postId),
    queryFn: () => postsAPI.getComments(postId),
    enabled: !!postId,
    staleTime: 1 * 60 * 1000, // 1분
  });
}

/**
 * 게시글 생성 Mutation
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postsAPI.createPost(data),
    onSuccess: (response) => {
      if (response.success) {
        // 게시글 목록 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        });
        toast.success("게시글이 작성되었습니다.");
      } else {
        toast.error(response.error || "게시글 작성에 실패했습니다.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "게시글 작성 중 오류가 발생했습니다.");
    },
  });
}

/**
 * 게시글 수정 Mutation
 */
export function useUpdatePost(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePostRequest) => postsAPI.updatePost(postId, data),
    onSuccess: (response) => {
      if (response.success) {
        // 게시글 상세 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: POST_DETAIL_QUERY_KEY(postId),
        });
        // 게시글 목록 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        });
        toast.success("게시글이 수정되었습니다.");
      } else {
        toast.error(response.error || "게시글 수정에 실패했습니다.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "게시글 수정 중 오류가 발생했습니다.");
    },
  });
}

/**
 * 게시글 삭제 Mutation
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postsAPI.deletePost(postId),
    onSuccess: (response) => {
      if (response.success) {
        // 게시글 목록 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        });
        toast.success("게시글이 삭제되었습니다.");
      } else {
        toast.error(response.error || "게시글 삭제에 실패했습니다.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "게시글 삭제 중 오류가 발생했습니다.");
    },
  });
}

/**
 * 댓글 생성 Mutation
 */
export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      postsAPI.createComment(postId, { content }),
    onSuccess: (response) => {
      if (response.success) {
        // 댓글 목록 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: COMMENTS_QUERY_KEY(postId),
        });
        // 게시글 상세도 무효화 (댓글 수 업데이트)
        queryClient.invalidateQueries({
          queryKey: POST_DETAIL_QUERY_KEY(postId),
        });
        toast.success("댓글이 작성되었습니다.");
      } else {
        toast.error(response.error || "댓글 작성에 실패했습니다.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "댓글 작성 중 오류가 발생했습니다.");
    },
  });
}

/**
 * 댓글 수정 Mutation
 */
export function useUpdateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      postsAPI.updateComment(commentId, { content }),
    onSuccess: (response) => {
      if (response.success) {
        // 댓글 목록 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: COMMENTS_QUERY_KEY(postId),
        });
        toast.success("댓글이 수정되었습니다.");
      } else {
        toast.error(response.error || "댓글 수정에 실패했습니다.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "댓글 수정 중 오류가 발생했습니다.");
    },
  });
}

/**
 * 댓글 삭제 Mutation
 */
export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => postsAPI.deleteComment(commentId),
    onSuccess: (response) => {
      if (response.success) {
        // 댓글 목록 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: COMMENTS_QUERY_KEY(postId),
        });
        // 게시글 상세도 무효화 (댓글 수 업데이트)
        queryClient.invalidateQueries({
          queryKey: POST_DETAIL_QUERY_KEY(postId),
        });
        toast.success("댓글이 삭제되었습니다.");
      } else {
        toast.error(response.error || "댓글 삭제에 실패했습니다.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "댓글 삭제 중 오류가 발생했습니다.");
    },
  });
}

/**
 * 게시글 좋아요 토글 Mutation
 */
export function useTogglePostLike(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postsAPI.togglePostLike(postId),
    onSuccess: (response) => {
      if (response.success) {
        // 게시글 상세 캐시 직접 업데이트 (refetch 방지로 조회수 증가 막기)
        queryClient.setQueryData(POST_DETAIL_QUERY_KEY(postId), (oldData: any) => {
          if (!oldData?.data) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              likeCount: response.data.likeCount,
              isLiked: response.data.liked,
            },
          };
        });

        // 게시글 목록 캐시 무효화 (목록은 refetch 필요)
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        });
      } else {
        toast.error(response.error || "좋아요 처리에 실패했습니다.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "좋아요 처리 중 오류가 발생했습니다.");
    },
  });
}

/**
 * 댓글 좋아요 토글 Mutation
 */
export function useToggleCommentLike(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => postsAPI.toggleCommentLike(commentId),
    onSuccess: (response, commentId) => {
      if (response.success) {
        // 댓글 목록 캐시 직접 업데이트 (refetch 방지로 조회수 증가 막기)
        queryClient.setQueryData(COMMENTS_QUERY_KEY(postId), (oldData: any) => {
          if (!oldData?.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((comment: any) =>
              comment._id === commentId
                ? {
                    ...comment,
                    likeCount: response.data.likeCount,
                    isLiked: response.data.liked,
                  }
                : comment
            ),
          };
        });
      } else {
        toast.error(response.error || "좋아요 처리에 실패했습니다.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "좋아요 처리 중 오류가 발생했습니다.");
    },
  });
}
