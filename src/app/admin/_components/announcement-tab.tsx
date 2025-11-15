import { AnnouncementForm } from "./announcement-form";
import { AnnouncementsTab } from "./announcements-tab";

export function AnnouncementTab() {
  return (
    <>
      <AnnouncementForm />
      <div className="pt-4">
        <h3 className="mb-4 text-lg font-bold">전체 공지사항 관리</h3>
        <AnnouncementsTab />
      </div>
    </>
  );
}
