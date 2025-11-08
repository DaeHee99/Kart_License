"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TierBadge } from "@/components/tier-badge";
import { Download, Copy, Check, MessageCircle, Share2 } from "lucide-react";
import { TierType, TIERS } from "@/lib/types";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import { toast } from "sonner";

interface ShareContentProps {
  finalTier: TierType;
  onDialogClose: () => void;
}

export function ShareContent({ finalTier, onDialogClose }: ShareContentProps) {
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
      link.download = `${TIERS[finalTier].nameKo} 달성!.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("QR 카드가 다운로드되었습니다!");
    } catch (err) {
      console.error("QR Card download failed:", err);
      toast.error("QR 카드 다운로드에 실패했습니다.");
    }
  };

  const handleKakaoShare = () => {
    // Kakao Share (requires Kakao SDK)
    // @ts-ignore
    if (typeof window !== "undefined" && window.Kakao) {
      // @ts-ignore
      if (!window.Kakao.isInitialized()) {
        // @ts-ignore
        window.Kakao.init("YOUR_KAKAO_APP_KEY"); // Replace with actual key
      }

      // @ts-ignore
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `카러플 군 계산기 - ${TIERS[finalTier].nameKo}!`,
          description: `나의 카트라이더 러쉬 플러스 실력은 ${TIERS[finalTier].nameKo}! ${TIERS[finalTier].description}`,
          imageUrl: "https://example.com/tier-badge.png", // Replace with actual image
          link: {
            mobileWebUrl: currentUrl,
            webUrl: currentUrl,
          },
        },
        buttons: [
          {
            title: "내 군 결과도 확인하기",
            link: {
              mobileWebUrl: window.location.origin,
              webUrl: window.location.origin,
            },
          },
        ],
      });
    } else {
      toast.error("카카오톡 공유 기능을 사용할 수 없습니다.");
    }
  };

  return (
    <div className="space-y-6 p-4">
      <p className="text-muted-foreground text-center text-sm">
        QR 카드를 이용하여 결과 전용 웹 페이지로 쉽게 이동할 수 있어요.
      </p>

      {/* Link Copy */}
      <div className="space-y-2">
        <label className="text-sm font-medium">결과 웹 페이지 주소</label>
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
          <div className="space-y-2 text-center">
            <div className="relative inline-block">
              <TierBadge tier={finalTier} size="lg" showLabel={false} />
            </div>
            <h2 className="text-2xl font-bold">
              {TIERS[finalTier].nameKo} 달성!
            </h2>
          </div>

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
            <p className="font-medium">결과 전용 페이지로 이동해요!</p>
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
        {navigator.share && (
          <Button
            onClick={async () => {
              try {
                await navigator.share({
                  title: `카러플 군 계산기 - ${TIERS[finalTier].nameKo}`,
                  text: `나의 카트라이더 러쉬 플러스 실력은 ${TIERS[finalTier].nameKo}!`,
                  url: currentUrl,
                });
                onDialogClose();
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
