"use client";

import CalloutTip from "./components/CalloutTip";
import RecentQueries from "./components/RecentQueries";
import RelatedQuestions from "./components/RelatedQuestions/RelatedQuestions";

export default function SidebarRight() {
  return (
    <aside className="hidden xl:block col-span-3">
      <div className="sticky top-20 space-y-6">
        <RecentQueries />
        <RelatedQuestions />
        <CalloutTip />
      </div>
    </aside>
  );
}
