export interface LibraryAPIResponse {
  count: number;
  sections: Array<{
    title: string;
    icon: "pdf" | "md" | "data" | "folder";
    items: Array<{
      name: string;
      size: string;
    }>;
  }>;
}
