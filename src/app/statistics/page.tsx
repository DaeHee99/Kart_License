import { AnimatedBackground } from "./_components/animated-background";
import { StatisticsHeader } from "./_components/statistics-header";
import { OverviewStats } from "./_components/overview-stats";
import { StatisticsTabs } from "./_components/statistics-tabs";

export default function StatisticsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      <AnimatedBackground />

      <div className="relative z-10 px-4 py-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <StatisticsHeader />
          <OverviewStats />
          <StatisticsTabs />
        </div>
      </div>
    </div>
  );
}
