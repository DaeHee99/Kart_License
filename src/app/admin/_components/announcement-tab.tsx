import { AnnouncementForm } from "./announcement-form";
import { AnnouncementsTab } from "./announcements-tab";

interface AnnouncementTabProps {
  page: number;
  onPageChange: (page: number) => void;
}

export function AnnouncementTab({ page, onPageChange }: AnnouncementTabProps) {
  return (
    <>
      <AnnouncementForm />
      <div className="pt-4">
        <h3 className="mb-4 text-lg font-bold">전체 공지사항 관리</h3>
        <AnnouncementsTab page={page} onPageChange={onPageChange} />
      </div>
    </>
  );
}
