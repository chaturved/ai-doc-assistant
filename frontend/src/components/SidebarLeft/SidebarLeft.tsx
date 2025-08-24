"use client";

import LibraryHeader from "./components/LibraryHeader";
import LibraryTabs from "./components/LibraryTabs/LibraryTabs";

export default function SidebarLeft() {
  return (
    <aside className="hidden lg:block col-span-3">
      <div className="sticky top-20 space-y-6">
        <LibraryHeader count={7} />
        <LibraryTabs
          sections={[
            {
              title: "PDFs",
              icon: "pdf",
              items: [
                { name: "Product Handbook.pdf", size: "1.2 MB" },
                { name: "Onboarding Guide.pdf", size: "860 KB" },
              ],
            },
            {
              title: "Markdown",
              icon: "md",
              items: [
                { name: "api-reference.md", size: "24 KB" },
                { name: "rate-limits.md", size: "11 KB" },
              ],
            },
            {
              title: "Data",
              icon: "data",
              items: [{ name: "endpoints.csv", size: "6 KB" }],
            },
            {
              title: "Folders",
              icon: "folder",
              items: [
                { name: "Guides/", size: "7 files" },
                { name: "SDKs/", size: "4 files" },
              ],
            },
          ]}
        />
      </div>
    </aside>
  );
}
