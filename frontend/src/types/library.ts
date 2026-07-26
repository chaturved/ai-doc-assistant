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

export interface UploadError {
  file: string;
  error: string;
}

export interface UploadResult {
  uploaded: LibraryDoc[];
  errors: UploadError[];
}
