"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TierBadge } from "@/components/tier-badge";
import { UserMapRecord, TierType, TIERS } from "@/lib/types";
import { calculateTier, getTierInsights } from "@/lib/utils-calc";
import { motion, AnimatePresence } from "motion/react";
import {
  Share2,
  RotateCcw,
  Home,
  Sparkles,
  Trophy,
  TrendingUp,
  Star,
  Zap,
  Link2,
  QrCode,
  Download,
  Copy,
  Check,
  BarChart3,
  MessageCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MOCK_MAPS } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  const [records, setRecords] = useState<UserMapRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const qrCardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Animate loading progress from 0 to 100 over 2.5 seconds
    if (loading) {
      const duration = 2500; // 2.5 seconds
      const interval = 16; // ~60fps
      const increment = (100 / duration) * interval;

      const timer = setInterval(() => {
        setLoadingProgress((prev) => {
          const next = prev + increment;
          if (next >= 100) {
            clearInterval(timer);
            return 100;
          }
          return next;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [loading]);

  useEffect(() => {
    // Get records from sessionStorage
    const storedRecords = sessionStorage.getItem("measurementRecords");
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    } else {
      // Redirect to measure page if no records
      router.push("/measure");
      return;
    }

    // Simulate calculation with fast timing
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  const onNavigate = (page: string) => {
    router.push(page);
  };

  const onRestart = () => {
    sessionStorage.removeItem("measurementRecords");
    router.push("/measure");
  };

  if (records.length === 0) {
    return null; // Loading state while checking records
  }

  // Calculate tier distribution
  const tierDistribution: Record<TierType, number> = {
    elite: 0,
    master: 0,
    diamond: 0,
    platinum: 0,
    gold: 0,
    silver: 0,
    bronze: 0,
  };

  records.forEach((record) => {
    if (record.tier) {
      tierDistribution[record.tier]++;
    }
  });

  const finalTier = calculateTier(tierDistribution);
  const insights = getTierInsights(finalTier, tierDistribution);

  const totalMaps = records.length;
  const currentUrl = `${window.location.origin}/result`;

  // Share handlers
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
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `kartrush-tier-${TIERS[finalTier].nameKo}-result.png`;
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

  // Share Content Component (reusable for both Dialog and Drawer)
  const ShareContent = () => (
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
                setShowShareDialog(false);
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

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden pb-24">
        {/* Animated Background */}
        <div className="from-primary/10 via-background to-secondary/10 absolute inset-0 bg-linear-to-br">
          <motion.div
            className="bg-primary/20 absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="bg-secondary/20 absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full blur-3xl"
            animate={{
              scale: [1.3, 1, 1.3],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 space-y-6 text-center"
        >
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 0.8, repeat: Infinity },
            }}
          >
            <Sparkles className="text-primary mx-auto h-16 w-16" />
          </motion.div>
          <div>
            <h3>군을 계산하고 있어요...</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              잠시만 기다려주세요
            </p>
          </div>
          <Progress value={loadingProgress} className="mx-auto w-64" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      {/* Spectacular Animated Background */}
      <div className="from-primary/5 via-background to-secondary/5 absolute inset-0 bg-linear-to-br">
        {/* Large gradient blobs */}
        <motion.div
          className="from-primary/20 to-secondary/20 absolute top-10 right-10 h-96 w-96 rounded-full bg-linear-to-br blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="from-secondary/20 to-primary/20 absolute bottom-10 left-10 h-80 w-80 rounded-full bg-linear-to-br blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          >
            {i % 3 === 0 ? (
              <Star className="text-primary fill-primary/50 h-3 w-3" />
            ) : i % 3 === 1 ? (
              <Sparkles className="text-secondary h-3 w-3" />
            ) : (
              <Trophy className="text-primary h-3 w-3" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Main Tier Reveal - Hero Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Card className="border-primary/20 from-card via-card to-primary/5 relative overflow-hidden border-2 bg-linear-to-br p-8 shadow-2xl">
              {/* Shimmer effect */}
              <motion.div
                className="via-primary/10 absolute inset-0 bg-linear-to-r from-transparent to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
              />

              <div className="relative space-y-6 text-center">
                {/* Tier Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    duration: 0.4,
                  }}
                >
                  <div className="relative inline-block">
                    {/* Glow effect */}
                    <motion.div
                      className={`absolute inset-0 bg-linear-to-br ${TIERS[finalTier].color} rounded-full opacity-50 blur-2xl`}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <TierBadge
                      tier={finalTier}
                      size="xl"
                      showLabel={false}
                      animate
                    />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                  className="space-y-3"
                >
                  <h1 className="text-4xl font-bold md:text-5xl">
                    당신은{" "}
                    <span
                      className={`bg-linear-to-r ${TIERS[finalTier].color.replace("bg-", "from-")} to-primary rounded-sm bg-clip-text`}
                    >
                      {TIERS[finalTier].nameKo}
                    </span>
                    입니다!
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    {TIERS[finalTier].description}
                  </p>
                </motion.div>

                {/* Insights Badge */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.2 }}
                  className="from-primary/20 to-secondary/20 border-primary/20 inline-flex items-center gap-2 rounded-full border bg-linear-to-r px-6 py-3 backdrop-blur-sm"
                >
                  <TrendingUp className="text-primary h-4 w-4" />
                  <span className="text-sm font-medium">{insights}</span>
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.2 }}
            className="grid grid-cols-2 gap-3"
          >
            <Button
              onClick={() => {
                console.log("Share clicked");
                setShowShareDialog(true);
              }}
              size="lg"
              className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-0 bg-linear-to-r shadow-lg"
            >
              <Share2 className="mr-2 h-4 w-4" />
              공유하기
            </Button>
            <Button
              onClick={() => onNavigate("/statistics")}
              size="lg"
              variant="outline"
              className="border-2"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              통계 보기
            </Button>
          </motion.div>

          {/* Tier Distribution Table */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.2 }}
          >
            <Card className="border-border/50 relative overflow-hidden border-2 p-6">
              {/* Subtle shimmer */}
              <motion.div
                className="via-primary/5 absolute inset-0 bg-linear-to-r from-transparent to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
              />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    <Zap className="text-primary h-5 w-5" />
                    선택한 군별 분포
                  </h3>
                  <Badge variant="secondary" className="font-mono">
                    {totalMaps}개 맵
                  </Badge>
                </div>

                <div className="border-border/50 space-y-0 overflow-hidden rounded-lg border">
                  {/* Header Row */}
                  <div className="bg-muted/50 border-border/50 grid grid-cols-3 border-b">
                    <div className="text-muted-foreground px-4 py-2 text-xs font-medium">
                      군
                    </div>
                    <div className="text-muted-foreground px-4 py-2 text-center text-xs font-medium">
                      개수
                    </div>
                    <div className="text-muted-foreground px-4 py-2 text-right text-xs font-medium">
                      비율
                    </div>
                  </div>

                  {/* Data Rows */}
                  {(Object.keys(TIERS) as TierType[]).map((tierId, index) => {
                    const tier = TIERS[tierId];
                    const count = tierDistribution[tierId];
                    const percentage =
                      totalMaps > 0 ? Math.round((count / totalMaps) * 100) : 0;

                    return (
                      <motion.div
                        key={tierId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.45 + index * 0.03,
                          duration: 0.15,
                        }}
                        className={`border-border/50 hover:bg-primary/5 relative grid grid-cols-3 border-b transition-colors last:border-b-0 ${
                          finalTier === tierId ? "bg-primary/10" : ""
                        }`}
                      >
                        {/* Progress bar background */}
                        <motion.div
                          className={`absolute top-0 bottom-0 left-0 ${tier.color.replace("text-", "bg-").replace("bg-tier-", "bg-")}/10`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{
                            delay: 0.5 + index * 0.03,
                            duration: 0.3,
                          }}
                        />

                        <div className="relative z-10 flex items-center gap-2 px-4 py-3">
                          <div
                            className={`h-3 w-3 rounded-full ${tier.color}`}
                          />
                          <span className="text-sm font-medium">
                            {tier.nameKo}
                          </span>
                          {finalTier === tierId && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: 0.6 + index * 0.03,
                                duration: 0.15,
                              }}
                            >
                              <Star className="text-primary fill-primary h-3 w-3" />
                            </motion.div>
                          )}
                        </div>
                        <div className="relative z-10 px-4 py-3 text-center">
                          <span className="font-mono text-sm font-medium">
                            {count}
                          </span>
                        </div>
                        <div className="relative z-10 px-4 py-3 text-right">
                          <span className="font-mono text-sm font-medium">
                            {percentage}%
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Detailed Records Table */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.2 }}
          >
            <Card className="border-border/50 relative overflow-hidden border-2 p-6">
              {/* Subtle shimmer */}
              <motion.div
                className="via-secondary/5 absolute inset-0 bg-linear-to-r from-transparent to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
              />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    <Trophy className="text-secondary h-5 w-5" />
                    상세 기록
                  </h3>
                  <Badge variant="secondary" className="font-mono">
                    {records.length}/{MOCK_MAPS.length}
                  </Badge>
                </div>

                <div className="border-border/50 space-y-0 overflow-hidden rounded-lg border">
                  {/* Header Row */}
                  <div className="bg-muted/50 border-border/50 grid grid-cols-3 border-b">
                    <div className="text-muted-foreground col-span-1 px-4 py-2 text-xs font-medium">
                      맵 이름
                    </div>
                    <div className="text-muted-foreground px-4 py-2 text-center text-xs font-medium">
                      군
                    </div>
                    <div className="text-muted-foreground px-4 py-2 text-right text-xs font-medium">
                      기록
                    </div>
                  </div>

                  {/* Data Rows */}
                  {records.map((record, index) => {
                    const map = MOCK_MAPS.find((m) => m.id === record.mapId);
                    const tier = record.tier;

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.55 + index * 0.02,
                          duration: 0.1,
                        }}
                        className={`border-border/50 hover:bg-primary/5 relative grid grid-cols-3 border-b transition-colors last:border-b-0 ${
                          tier
                            ? `bg-linear-to-r from-transparent to-${tier}/5`
                            : ""
                        }`}
                      >
                        {/* Colored left border */}
                        {tier && (
                          <div
                            className={`absolute top-0 bottom-0 left-0 w-1 ${TIERS[tier].color}`}
                          />
                        )}

                        <div className="truncate px-4 py-3 text-sm">
                          {map?.name || "알 수 없는 맵"}
                        </div>
                        <div className="flex justify-center px-4 py-3">
                          {tier && (
                            <Badge
                              variant="outline"
                              className={`gap-1.5 border-current border-gray-300 text-xs`}
                            >
                              <div
                                className={`h-2 w-2 rounded-full ${TIERS[tier].color}`}
                              />
                              {TIERS[tier].nameKo}
                            </Badge>
                          )}
                        </div>
                        <div className="px-4 py-3 text-right">
                          <span className="text-muted-foreground font-mono text-sm">
                            {record.record || "-"}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Bottom Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.2 }}
            className="grid grid-cols-2 gap-3 pt-4"
          >
            <Button
              onClick={onRestart}
              variant="outline"
              size="lg"
              className="border-2"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              다시 측정
            </Button>
            <Button
              onClick={() => onNavigate("/")}
              variant="outline"
              size="lg"
              className="border-2"
            >
              <Home className="mr-2 h-4 w-4" />
              홈으로
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Share Dialog/Drawer */}
      {isMobile ? (
        <Drawer open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader>
              <DrawerTitle>공유하기</DrawerTitle>
              <DrawerDescription>
                결과를 공유할 수 있는 링크를 생성합니다.
              </DrawerDescription>
            </DrawerHeader>

            <ScrollArea className="max-h-[60vh] overflow-y-auto px-1">
              <ShareContent />
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>공유하기</DialogTitle>
              <DialogDescription>
                결과를 공유할 수 있는 링크를 생성합니다.
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[70vh] overflow-y-auto pr-4">
              <ShareContent />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
