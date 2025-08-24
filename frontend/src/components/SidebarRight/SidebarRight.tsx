"use client";

import CalloutTip from "./components/CalloutTip";
import RecentQueries from "./components/RecentQueries";
import RelatedQuestions from "./components/RelatedQuestions/RelatedQuestions";

export default function SidebarRight() {
  return (
    <aside className="hidden xl:block col-span-3">
      <div className="sticky top-20 space-y-6">
        <RecentQueries
          queries={[
            "How do I stream server-sent events in JavaScript?",
            "What are the rate limits for the Answers endpoint?",
            "How to authenticate SDK calls from the browser?",
          ]}
        />
        <RelatedQuestions
          questions={[
            "How do I attach document citations to each paragraph?",
            "Can I limit retrieval to a specific folder?",
            "How are snippets ranked by relevance?",
          ]}
        />
        <CalloutTip text="Ask follow-ups like “summarize sources” or “show more from onboarding.pdf”." />
      </div>
    </aside>
  );
}
