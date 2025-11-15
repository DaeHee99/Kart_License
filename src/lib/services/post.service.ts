/**
 * Post Service Layer
 * 게시글 비즈니스 로직 처리
 */

import Post, { IPost, PostCategory } from "@/lib/db/models/post.model";
import Comment from "@/lib/db/models/comment.model";
import { Types } from "mongoose";

export interface CreatePostInput {
  userId: string;
  category: PostCategory;
  title: string;
  content: string;
  images?: string[];
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  images?: string[];
  category?: PostCategory;
}

export interface PostListItem {
  _id: string;
  user: {
    _id: string;
    name: string;
    image?: string;
    license?: string;
    role?: number;
  };
  category: PostCategory;
  title: string;
  content: string;
  images: string[];
  views: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostDetail extends PostListItem {
  comments: Array<{
    _id: string;
    user: {
      _id: string;
      name: string;
      image?: string;
      license?: string;
      role?: number;
    };
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export interface PaginatedPosts {
  posts: PostListItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * 게시글 서비스 클래스
 */
export class PostService {
  /**
   * 게시글 생성
   */
  async createPost(input: CreatePostInput): Promise<IPost> {
    const post = new Post({
      user: new Types.ObjectId(input.userId),
      category: input.category,
      title: input.title,
      content: input.content,
      images: input.images || [],
    });

    await post.save();
    return post;
  }

  /**
   * 게시글 목록 조회 (페이지네이션)
   */
  async getPosts(
    page: number = 1,
    limit: number = 20,
    category?: PostCategory | "all",
    searchQuery?: string
  ): Promise<PaginatedPosts> {
    const skip = (page - 1) * limit;
    const query: any = {};

    // 카테고리 필터
    if (category && category !== "all") {
      query.category = category;
    }

    // 검색어 필터
    if (searchQuery && searchQuery.trim()) {
      query.$text = { $search: searchQuery };
    }

    // 게시글 목록 조회
    const [posts, totalCount] = await Promise.all([
      Post.find(query)
        .populate("user", "name image license role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(query),
    ]);

    // 각 게시글의 댓글 수 조회
    const postsWithCommentCount = await Promise.all(
      posts.map(async (post: any) => {
        const commentCount = await Comment.countDocuments({
          post: post._id,
        });

        return {
          _id: post._id.toString(),
          user: {
            _id: post.user._id.toString(),
            name: post.user.name,
            image: post.user.image,
            license: post.user.license,
            role: post.user.role || 0,
          },
          category: post.category,
          title: post.title,
          content: post.content,
          images: post.images || [],
          views: post.views,
          commentCount,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        };
      })
    );

    return {
      posts: postsWithCommentCount,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  /**
   * 게시글 상세 조회
   */
  async getPostById(postId: string): Promise<PostDetail | null> {
    if (!Types.ObjectId.isValid(postId)) {
      return null;
    }

    const post = await Post.findById(postId)
      .populate("user", "name image license role")
      .lean();

    if (!post) {
      return null;
    }

    // 조회수 증가
    await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } });

    // 댓글 조회
    const comments = await Comment.find({ post: new Types.ObjectId(postId) })
      .populate("user", "name image license role")
      .sort({ createdAt: 1 })
      .lean();

    return {
      _id: post._id.toString(),
      user: {
        _id: (post.user as any)._id.toString(),
        name: (post.user as any).name,
        image: (post.user as any).image,
        license: (post.user as any).license,
        role: (post.user as any).role || 0,
      },
      category: post.category,
      title: post.title,
      content: post.content,
      images: post.images || [],
      views: post.views + 1,
      commentCount: comments.length,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      comments: comments.map((comment: any) => ({
        _id: comment._id.toString(),
        user: {
          _id: comment.user._id.toString(),
          name: comment.user.name,
          image: comment.user.image,
          license: comment.user.license,
          role: comment.user.role || 0,
        },
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      })),
    };
  }

  /**
   * 게시글 수정
   */
  async updatePost(
    postId: string,
    userId: string,
    input: UpdatePostInput,
    userRole: number = 0
  ): Promise<IPost | null> {
    if (!Types.ObjectId.isValid(postId)) {
      return null;
    }

    // 게시글 존재 여부 및 권한 확인
    const post = await Post.findById(postId);
    if (!post) {
      return null;
    }

    // 작성자가 아니고, 관리자(1)도 운영진(2)도 아니면 수정 불가
    const isAuthor = post.user.toString() === userId;
    const isAdminOrModerator = userRole === 1 || userRole === 2;

    if (!isAuthor && !isAdminOrModerator) {
      throw new Error("게시글 수정 권한이 없습니다.");
    }

    // 수정
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: input },
      { new: true, runValidators: true }
    );

    return updatedPost;
  }

  /**
   * 게시글 삭제
   */
  async deletePost(postId: string, userId: string, userRole: number = 0): Promise<boolean> {
    if (!Types.ObjectId.isValid(postId)) {
      return false;
    }

    // 게시글 존재 여부 및 권한 확인
    const post = await Post.findById(postId);
    if (!post) {
      return false;
    }

    // 작성자가 아니고, 관리자(1)도 운영진(2)도 아니면 삭제 불가
    const isAuthor = post.user.toString() === userId;
    const isAdminOrModerator = userRole === 1 || userRole === 2;

    if (!isAuthor && !isAdminOrModerator) {
      throw new Error("게시글 삭제 권한이 없습니다.");
    }

    // 게시글 삭제
    await Post.findByIdAndDelete(postId);

    // 관련 댓글도 삭제
    await Comment.deleteMany({ post: new Types.ObjectId(postId) });

    return true;
  }
}

// Singleton 인스턴스 export
export const postService = new PostService();
