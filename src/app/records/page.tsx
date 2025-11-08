import { RecordsHeader } from "./_components/records-header";
import { RecordsTab } from "./_components/records-tab";

export default function RecordsPage() {
  return (
    <div className="from-primary/5 via-background to-background min-h-screen bg-linear-to-b pb-24">
      <div className="px-4 py-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <RecordsHeader />
          <RecordsTab />
        </div>
      </div>
    </div>
  );
}
