"use client";

import { useState, useEffect } from "react";
import { PostCategory } from "@/lib/types";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { CommunityHeader } from "./_components/community-header";
import { SearchBar } from "./_components/search-bar";
import { PostList } from "./_components/post-list";
import { SearchResultsInfo } from "./_components/search-results-info";
import { CategoryTabs } from "./_components/category-tabs";
import { FloatingWriteButton } from "./_components/floating-write-button";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useInfinitePosts } from "@/hooks/use-posts";

export default function CommunityPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    PostCategory | "all"
  >("all");
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 실제 검색 쿼리 (검색 버튼 클릭 시에만 적용)
  const actualSearchQuery = isSearchMode ? searchQuery : undefined;

  // 무한 스크롤 쿼리
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfinitePosts(selectedCategory, actualSearchQuery);

  // 무한 스크롤 트리거
  const { ref: loadMoreRef, inView } = useInView();

  // 스크롤 끝에 도달하면 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onPostClick = (postId: string) => {
    router.push(`/community/${postId}`);
  };

  const handleSearch = () => {
    setIsSearchMode(true);
  };

  const handleClearSearch = () => {
    setIsSearchMode(false);
    setSearchQuery("");
  };

  // 모든 페이지의 게시글을 플랫하게 변환하고 Post 타입으로 매핑
  const allPosts = data?.pages.flatMap((page) =>
    (page.data?.posts || []).map((post: any) => ({
      _id: post._id,
      userId: post.user._id,
      userNickname: post.user.name,
      userProfileImage: post.user.image,
      userTier: post.user.license,
      category: post.category,
      title: post.title,
      content: post.content,
      images: post.images,
      comments: [],
      views: post.views,
      createdAt: new Date(post.createdAt),
      commentCount: post.commentCount,
    }))
  ) || [];
  const totalCount = data?.pages[0]?.data?.totalCount || 0;

  return (
    <div className="from-primary/5 via-background to-background min-h-screen bg-linear-to-b pb-24">
      <div className="px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <CommunityHeader />

          {/* 검색바 + 검색 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2"
          >
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={handleClearSearch}
            />
            <Button
              size="icon"
              onClick={handleSearch}
              className="shrink-0"
              variant={isSearchMode ? "default" : "outline"}
            >
              <Search className="h-5 w-5" />
            </Button>
          </motion.div>

          {/* 카테고리 탭 */}
          <CategoryTabs
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* 검색 결과 정보 */}
          {isSearchMode && searchQuery && (
            <SearchResultsInfo
              searchQuery={searchQuery}
              resultsCount={totalCount}
            />
          )}

          {/* 로딩 상태 */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
              <p className="text-muted-foreground mt-2 text-sm">
                게시글을 불러오는 중...
              </p>
            </div>
          )}

          {/* 에러 상태 */}
          {isError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground py-12 text-center"
            >
              <p>게시글을 불러오는 중 오류가 발생했습니다.</p>
            </motion.div>
          )}

          {/* 게시글 리스트 */}
          {!isLoading && !isError && (
            <>
              {allPosts.length > 0 ? (
                <>
                  <PostList posts={allPosts} onPostClick={onPostClick} />

                  {/* 무한 스크롤 트리거 */}
                  <div ref={loadMoreRef} className="py-4">
                    {isFetchingNextPage && (
                      <div className="flex justify-center">
                        <Loader2 className="text-primary h-6 w-6 animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* 마지막 페이지 도달 */}
                  {!hasNextPage && allPosts.length > 0 && (
                    <div className="text-muted-foreground py-4 text-center text-sm">
                      모든 게시글을 불러왔습니다.
                    </div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-muted-foreground py-12 text-center"
                >
                  <p>게시글이 없습니다.</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 플로팅 글쓰기 버튼 */}
      <FloatingWriteButton />
    </div>
  );
}
