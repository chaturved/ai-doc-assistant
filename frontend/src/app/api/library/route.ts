import { LibraryAPIResponse } from "@/types/library";
import { NextResponse } from "next/server";

export async function GET() {
  // Simulate fetching library data from a database or external service
  const libraryData: LibraryAPIResponse = {
    count: 7,
    sections: [
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
    ],
  };

  return NextResponse.json(libraryData);
}
