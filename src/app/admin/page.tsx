import { AdminHeader } from "./_components/admin-header";
import { QuickStats } from "./_components/quick-stats";
import { MapDataSection } from "./_components/map-data-section";
import { AdminTabs } from "./_components/admin-tabs";
import { AnimatedBackground } from "./_components/animated-background";

export default function AdminPage() {
  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      <AnimatedBackground />

      <div className="relative z-10 px-4 py-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <AdminHeader />
          <QuickStats />
          <MapDataSection />
          <AdminTabs />
        </div>
      </div>
    </div>
  );
}
