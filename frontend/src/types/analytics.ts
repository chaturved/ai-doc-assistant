export interface AnalyticsOverview {
  total_queries: number;
  total_docs: number;
  total_chunks: number;
  quality_pct: number | null;
  thumbs_up: number;
  thumbs_down: number;
  queries_last_30d: number;
}

export interface QueryVolumePoint {
  date: string;
  count: number;
}

export interface CitedDoc {
  name: string;
  citations: number;
}
