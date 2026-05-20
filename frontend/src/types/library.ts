export interface LibraryDoc {
  id: number;
  name: string;
  type: string;
  size: number;
  created_at: string;
}

export interface LibraryData {
  count: number;
  total_size_bytes: number;
  sections: LibraryDoc[];
}
