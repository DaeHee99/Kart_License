"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { TierType } from "@/lib/types";
import { MOCK_ANNOUNCEMENTS } from "@/lib/mock-data";

// Import components
import { HeroSection } from "./_components/hero-section";
import { UserProfileCard } from "./_components/user-profile-card";
import { TierIntroduction } from "./_components/tier-introduction";
import { RecentMeasurements } from "./_components/recent-measurements";
import { Footer } from "./_components/footer";
import { AnnouncementModal } from "./_components/announcement-modal";
import { TierDetailModal } from "./_components/tier-detail-modal";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock login state
  const [isMounted, setIsMounted] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const hasShownOnMount = useRef(false);
  const [selectedTier, setSelectedTier] = useState<TierType | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get all active announcements that haven't been dismissed
  const getDismissedAnnouncements = (): string[] => {
    try {
      const dismissed = localStorage.getItem("dismissed-announcements");
      return dismissed ? JSON.parse(dismissed) : [];
    } catch {
      return [];
    }
  };

  const activeAnnouncements = MOCK_ANNOUNCEMENTS.filter((a) => {
    const dismissedIds = getDismissedAnnouncements();
    return a.isActive && !dismissedIds.includes(a.id);
  });

  const currentAnnouncement = activeAnnouncements[currentAnnouncementIndex];

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Show announcement on first mount only
    if (activeAnnouncements.length > 0 && !hasShownOnMount.current) {
      hasShownOnMount.current = true;
      setTimeout(() => {
        setShowAnnouncement(true);
      }, 500);
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const onToggleLogin = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
    } else {
      router.push("/auth");
    }
  };

  const onNavigate = (page: string) => {
    router.push(page);
  };

  const handleCloseAnnouncement = () => {
    if (currentAnnouncement && dontShowAgain) {
      const dismissedIds = getDismissedAnnouncements();
      dismissedIds.push(currentAnnouncement.id);
      localStorage.setItem(
        "dismissed-announcements",
        JSON.stringify(dismissedIds),
      );
    }

    // 다음 공지사항이 있으면 표시, 없으면 닫기
    if (currentAnnouncementIndex < activeAnnouncements.length - 1) {
      setCurrentAnnouncementIndex(currentAnnouncementIndex + 1);
      setDontShowAgain(false);
    } else {
      setShowAnnouncement(false);
      setCurrentAnnouncementIndex(0);
      setDontShowAgain(false);
    }
  };

  const handlePreviousAnnouncement = () => {
    if (currentAnnouncementIndex > 0) {
      setCurrentAnnouncementIndex(currentAnnouncementIndex - 1);
      setDontShowAgain(false);
    }
  };

  const handleNextAnnouncement = () => {
    if (currentAnnouncementIndex < activeAnnouncements.length - 1) {
      if (dontShowAgain && currentAnnouncement) {
        const dismissedIds = getDismissedAnnouncements();
        dismissedIds.push(currentAnnouncement.id);
        localStorage.setItem(
          "dismissed-announcements",
          JSON.stringify(dismissedIds),
        );
      }
      setCurrentAnnouncementIndex(currentAnnouncementIndex + 1);
      setDontShowAgain(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Announcement Modal */}
      <AnnouncementModal
        open={showAnnouncement}
        onOpenChange={setShowAnnouncement}
        isMobile={isMobile}
        currentAnnouncement={currentAnnouncement}
        currentIndex={currentAnnouncementIndex}
        totalCount={activeAnnouncements.length}
        dontShowAgain={dontShowAgain}
        onDontShowAgainChange={setDontShowAgain}
        onPrevious={handlePreviousAnnouncement}
        onNext={handleNextAnnouncement}
        onClose={handleCloseAnnouncement}
      />

      {/* Tier Detail Modal */}
      <TierDetailModal
        selectedTier={selectedTier}
        onClose={() => setSelectedTier(null)}
        isMobile={isMobile}
      />

      {/* Hero Section with User Profile */}
      <HeroSection
        userProfileSlot={
          <UserProfileCard
            isLoggedIn={isLoggedIn}
            onToggleLogin={onToggleLogin}
          />
        }
      />

      {/* Tier Introduction */}
      <TierIntroduction onTierSelect={setSelectedTier} />

      {/* Real-time Measurements */}
      <RecentMeasurements isMounted={isMounted} />

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
