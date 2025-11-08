"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Post } from "@/lib/types";
import { Download, Check, Copy, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import { toast } from "sonner";

interface ShareContentProps {
  post: Post;
  onClose: () => void;
}

export function ShareContent({ post, onClose }: ShareContentProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const qrCardRef = useRef<HTMLDivElement>(null);
  const currentUrl = window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess(true);
      toast.success("링크가 복사되었습니다!");
      setTimeout(() => setCopySuccess(false), 2000);
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
      link.download = `kartrush-${post.title}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("QR 카드가 다운로드되었습니다!");
    } catch (err) {
      console.error("QR Card download failed:", err);
      toast.error("QR 카드 다운로드에 실패했습니다.");
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
          <h2 className="text-primary text-4xl font-bold">
            {post.title.length > 20
              ? post.title.substring(0, 20) + "..."
              : post.title}
          </h2>

          <div className="rounded-2xl bg-white p-4 shadow-lg">
            <QRCodeSVG
              value={currentUrl}
              size={200}
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
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={downloadQRCard}
          className="flex-1 gap-2"
        >
          <Download className="h-4 w-4" />
          QR 카드 다운로드
        </Button>

        {/* Share via Web Share API (if supported) */}
        {navigator.share && (
          <Button
            onClick={async () => {
              try {
                await navigator.share({
                  title: post.title,
                  text:
                    post.content.replace(/<[^>]*>/g, "").substring(0, 100) +
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
            className="flex-1 gap-2"
          >
            <Share2 className="h-4 w-4" />
            다른 앱으로 공유
          </Button>
        )}
      </div>
    </div>
  );
}
