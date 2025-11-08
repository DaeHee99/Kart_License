import { HeroSection } from "./_components/hero-section";
import { UserProfileCard } from "./_components/user-profile-card";
import { TierIntroduction } from "./_components/tier-introduction";
import { RecentMeasurements } from "./_components/recent-measurements";
import { Footer } from "./_components/footer";
import { AnnouncementModal } from "./_components/announcement-modal";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <HeroSection userProfileSlot={<UserProfileCard />} />
      <TierIntroduction />
      <RecentMeasurements />
      <Footer />
      <AnnouncementModal />
    </div>
  );
}
