export interface User {
  id: number;
  email: string;
  full_name: string;
  plan: "free" | "pro";
  avatar_initials: string;
  onboarding_completed: boolean;
}

export interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Source {
  name: string;
  quote: string;
  icon: string;
}

export interface Snippet {
  name: string;
  snippet: string;
  icon: string;
}

export interface Badge {
  label: string;
  icon: string;
}

export interface Meta {
  description: string;
  badges: Badge[];
  snippets: Snippet[];
  sources: Source[];
}

export interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  meta: Meta | null;
  created_at: string;
}

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

export interface UsageItem {
  used: number;
  limit: number;
}

export interface Usage {
  documents: UsageItem;
  queries_today: UsageItem;
  storage_bytes: UsageItem;
}
