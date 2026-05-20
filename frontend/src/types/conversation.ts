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
