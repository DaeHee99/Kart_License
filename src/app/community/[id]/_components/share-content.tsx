"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Post, TIERS } from "@/lib/types";
import {
  Download,
  Check,
  Copy,
  Share2,
  User,
  MessageCircle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { convertKoreanTierToEnglish } from "@/lib/utils-calc";
import { createLog, LogActionType } from "@/lib/api/logs";

// Kakao SDK 타입 선언
declare global {
  interface Window {
    Kakao: any;
  }
}

interface ShareContentProps {
  post: Post;
  onClose: () => void;
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

export function ShareContent({ post, onClose }: ShareContentProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const qrCardRef = useRef<HTMLDivElement>(null);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const userId = post.userId || "0";
  const userName = post.userNickname || "비로그인 유저";
  const userImage = post.userProfileImage || "/profile/gyool_dizini.png";

  // 티어 변환 (한국어 -> 영어)
  const tierEnglish = post.userTier
    ? convertKoreanTierToEnglish(post.userTier)
    : null;
  const isValidTier = tierEnglish && TIERS[tierEnglish as keyof typeof TIERS];

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Kakao SDK 초기화
  useEffect(() => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_SDK_KEY;
    const kakaoIntegrity = process.env.NEXT_PUBLIC_KAKAO_INTEGRITY;

    if (!kakaoKey) {
      console.error("Kakao JS SDK Key is not defined in environment variables");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.1.0/kakao.min.js";
    if (kakaoIntegrity) {
      script.integrity = kakaoIntegrity;
    }
    script.crossOrigin = "anonymous";
    script.async = true;

    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoKey);
      }
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess(true);
      toast.success("링크가 복사되었습니다!");
      setTimeout(() => setCopySuccess(false), 2000);

      // 링크 복사 로그 생성
      createLog({
        actionType: LogActionType.LINK_COPY_POST,
        content: `게시글 링크 복사 - ${post._id}`,
        metadata: {
          postId: post._id.toString(),
          category: post.category,
        },
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  const downloadQRCard = async () => {
    if (!qrCardRef.current) return;

    try {
      const dataUrl = await toPng(qrCardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#ffffff00",
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${userName} - ${post.title} - ${formatDateTime(post.createdAt)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("QR 카드가 다운로드되었습니다!");

      // QR 카드 다운로드 로그 생성
      createLog({
        actionType: LogActionType.QR_DOWNLOAD_POST,
        content: `게시글 QR 카드 다운로드 - ${post._id}`,
        metadata: {
          postId: post._id.toString(),
          category: post.category,
        },
      });
    } catch (err) {
      console.error("QR Card download failed:", err);
      toast.error("QR 카드 다운로드에 실패했습니다.");
    }
  };

  const handleKakaoShare = () => {
    if (typeof window === "undefined" || !window.Kakao) {
      toast.error("카카오톡 공유 기능을 사용할 수 없습니다.");
      return;
    }

    const Kakao = window.Kakao;
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_SDK_KEY;

    if (!kakaoKey) {
      toast.error("카카오톡 API 키가 설정되지 않았습니다.");
      return;
    }

    if (!Kakao.isInitialized()) {
      Kakao.init(kakaoKey);
    }

    try {
      // 프로필 이미지를 절대 URL로 변환
      const absoluteImageUrl = userImage.startsWith("http")
        ? userImage
        : `${window.location.origin}${userImage}`;

      // 게시글 내용을 HTML 태그 제거하고 최대 100자로 제한
      const contentText = post.content.replace(/<[^>]*>/g, "").substring(0, 20);

      Kakao.Share.sendCustom({
        templateId: 125960,
        templateArgs: {
          Title: post.title,
          Description: contentText,
          UserId: userId,
          Name: userName,
          PostId: post._id.toString(),
          ProfileImage: absoluteImageUrl,
          Comment: post.commentCount?.toString() || "0",
          Views: post.views?.toString() || "0",
        },
      });

      toast.success("카카오톡 공유가 완료되었습니다!");

      // 카카오톡 공유 로그 생성
      createLog({
        actionType: LogActionType.KAKAO_SHARE_POST,
        content: `게시글 카카오톡 공유 - ${post._id}`,
        metadata: {
          postId: post._id.toString(),
          category: post.category,
        },
      });

      onClose();
    } catch (err) {
      console.error("Kakao share failed:", err);
      toast.error("카카오톡 공유에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Link Copy */}
      <div className="space-y-2">
        <label className="text-sm font-medium">게시글 웹 페이지 주소</label>
        <div className="flex gap-2">
          <Input value={currentUrl} readOnly className="flex-1 text-sm" />
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopyLink}
            className="shrink-0"
          >
            {copySuccess ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* QR Card */}
      <div className="space-y-2">
        <label className="text-sm font-medium">QR 카드</label>
        <div
          ref={qrCardRef}
          className="from-background to-muted border-border flex flex-col items-center gap-4 rounded-2xl border-2 bg-linear-to-br p-8"
        >
          {/* 게시글 제목 */}
          <div className="space-y-2 text-center">
            <h2 className="text-primary text-2xl font-bold">
              {post.title.length > 30
                ? post.title.substring(0, 30) + "..."
                : post.title}
            </h2>
            {post.category && (
              <Badge
                variant="outline"
                className={`text-xs font-semibold ${CATEGORY_COLORS[post.category as keyof typeof CATEGORY_COLORS]}`}
              >
                {CATEGORY_LABELS[post.category as keyof typeof CATEGORY_LABELS]}
              </Badge>
            )}
          </div>

          {/* 작성자 정보 */}
          <div className="flex items-center gap-3">
            <Avatar className="border-border h-12 w-12 border-2">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback className="bg-muted">
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{userName}</p>
                {isValidTier && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${TIERS[tierEnglish as keyof typeof TIERS].color}`}
                    />
                    {TIERS[tierEnglish as keyof typeof TIERS].nameKo}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-xs">
                {formatDateTime(post.createdAt)}
              </p>
            </div>
          </div>

          {/* QR 코드 */}
          <div className="rounded-2xl bg-white p-4 shadow-lg">
            <QRCodeSVG
              value={currentUrl}
              size={180}
              level="H"
              includeMargin={false}
              fgColor="#000000"
              bgColor="#ffffff"
            />
          </div>

          <div className="space-y-1 text-center">
            <p className="font-medium">QR 코드를 스캔하면</p>
            <p className="font-medium">게시글 전용 페이지로 이동해요!</p>
          </div>

          <p className="text-muted-foreground text-xs">카러플 군 계산기 제공</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          variant="outline"
          onClick={downloadQRCard}
          className="w-full gap-2"
        >
          <Download className="h-4 w-4" />
          QR 카드 다운로드
        </Button>

        <Button
          onClick={handleKakaoShare}
          className="w-full gap-2 border-0 bg-[#FEE500] text-[#3C1E1E] hover:bg-[#FDD800]"
        >
          <MessageCircle className="h-4 w-4" />
          카카오톡으로 공유하기
        </Button>

        {/* Share via Web Share API (if supported) */}
        {typeof navigator !== "undefined" && navigator.share && (
          <Button
            onClick={async () => {
              try {
                await navigator.share({
                  title: post.title,
                  text:
                    post.content.replace(/<[^>]*>/g, "").substring(0, 20) +
                    "...",
                  url: currentUrl,
                });
                onClose();
              } catch (err) {
                if (err instanceof Error && err.name !== "AbortError") {
                  toast.error(
                    "공유에 실패했습니다. 링크를 복사해서 공유해주세요.",
                  );
                }
              }
            }}
            variant="outline"
            className="w-full gap-2"
          >
            <Share2 className="h-4 w-4" />
            다른 앱으로 공유
          </Button>
        )}
      </div>
    </div>
  );
}
