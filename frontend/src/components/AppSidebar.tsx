"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus, Search, Settings, LogOut,
  ChevronDown, ChevronRight, Trash2, Upload, BarChart2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/api/auth";
import {
  getConversations, createConversation, deleteConversation, renameConversation,
} from "@/lib/api/conversations";
import { getLibrary, uploadFiles, deleteDocument } from "@/lib/api/documents";
import type { Conversation, LibraryDoc } from "@/types";

function groupByDate(convs: Conversation[]) {
  const now       = new Date();
  const today     = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const lastWeek  = new Date(today.getTime() - 7 * 86400000);
  const groups: { label: string; items: Conversation[] }[] = [
    { label: "Today",       items: [] },
    { label: "Yesterday",   items: [] },
    { label: "Last 7 days", items: [] },
    { label: "Older",       items: [] },
  ];
  for (const c of convs) {
    const d = new Date(c.updated_at);
    if (d >= today)     groups[0].items.push(c);
    else if (d >= yesterday) groups[1].items.push(c);
    else if (d >= lastWeek)  groups[2].items.push(c);
    else                     groups[3].items.push(c);
  }
  return groups.filter((g) => g.items.length > 0);
}

function DocIcon({ type }: { type: string }) {
  const t = type.toLowerCase();
  const label = t === "pdf" ? "PDF" : t === "docx" ? "DOC" : t.toUpperCase().slice(0, 3);
  const color = t === "pdf" ? "text-red-400" : t === "docx" ? "text-blue-400" : "text-white/50";
  return <span className={`text-[9px] font-bold ${color} w-5 flex-shrink-0`}>{label}</span>;
}

interface Props {
  activeConvId?: number | null;
  onConvSelect?: (id: number) => void;
  onConvDelete?: (id: number) => void;
  onNewChat?: () => void;
  onConversationsChange?: (convs: Conversation[]) => void;
  refreshKey?: number;
}

export default function AppSidebar({ activeConvId, onConvSelect, onConvDelete, onNewChat, onConversationsChange, refreshKey }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, refetchUser } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [library, setLibrary]             = useState<LibraryDoc[]>([]);
  const [search, setSearch]               = useState("");
  const [hoveredConv, setHoveredConv]     = useState<number | null>(null);
  const [renamingId, setRenamingId]       = useState<number | null>(null);
  const [renameValue, setRenameValue]     = useState("");
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [docsOpen, setDocsOpen]           = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadConversations = useCallback(async () => {
    try {
      const convs = await getConversations();
      setConversations(convs);
      onConversationsChange?.(convs);
    } catch { /* silent */ }
  }, [onConversationsChange]);

  const loadLibrary = useCallback(async () => {
    try { const data = await getLibrary(); setLibrary(data.sections); } catch { /* silent */ }
  }, []);

  useEffect(() => { loadConversations(); loadLibrary(); }, [loadConversations, loadLibrary, refreshKey]);

  const handleNewChat = async () => {
    if (onNewChat) { onNewChat(); return; }
    try {
      const conv = await createConversation();
      await loadConversations();
      router.push(`/dashboard?conv=${conv.id}`);
    } catch { toast.error("Failed to create conversation"); }
  };

  const handleConvSelect = (id: number) => {
    if (onConvSelect) { onConvSelect(id); return; }
    router.push(`/dashboard?conv=${id}`);
  };

  const handleDeleteConv = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteConversation(id);
      await loadConversations();
      onConvDelete?.(id);
    } catch { toast.error("Failed to delete conversation"); }
  };

  const handleRenameSubmit = async (id: number) => {
    if (!renameValue.trim()) { setRenamingId(null); return; }
    try { await renameConversation(id, renameValue.trim()); await loadConversations(); } catch { /* silent */ }
    setRenamingId(null);
  };

  const handleUploadDocs = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingDocs(true);
    try { await uploadFiles(files); await loadLibrary(); toast.success(`Uploaded ${files.length} file(s)`); }
    catch { toast.error("Upload failed"); }
    finally { setUploadingDocs(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  const handleDeleteDoc = async (id: number) => {
    try { await deleteDocument(id); await loadLibrary(); } catch { toast.error("Delete failed"); }
  };

  const handleLogout = async () => {
    await logout(); await refetchUser(); router.push("/login");
  };

  const filteredConvs = conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
  const grouped = groupByDate(filteredConvs);

  const navItem = (active: boolean) =>
    `w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[8px] text-[13px] font-medium transition ${
      active ? "text-white bg-white/[0.09]" : "text-white/90 hover:text-white hover:bg-white/[0.06]"
    }`;

  return (
    <aside className="w-[248px] flex-shrink-0 flex flex-col bg-black">

      {/* Header */}
      <div className="flex items-center px-4 py-4 mb-1">
        <span className="text-[14px] font-semibold text-white/80 tracking-tight">Paperwise</span>
      </div>

      {/* Nav */}
      <div className="px-2 space-y-px">
        <button onClick={handleNewChat}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] font-medium text-white/90 hover:text-white hover:bg-white/[0.06] transition-colors">
          <Plus size={14} /> New Chat
        </button>
        <Link href="/analytics" className={navItem(pathname === "/analytics")}>
          <BarChart2 size={14} className="flex-shrink-0 opacity-60" /> Analytics
        </Link>
      </div>

      {/* Library */}
      <div className="px-2 mt-6">
        <button onClick={() => setDocsOpen((v) => !v)} className="w-full flex items-center gap-1.5 px-3 py-1.5 mb-0.5 text-white/35 hover:text-white/55 transition-colors">
          <span className="text-[10px] font-semibold tracking-[0.08em] uppercase flex-1 text-left">Library</span>
          {library.length > 0 && <span className="text-[10px]">{library.length}</span>}
          {docsOpen ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
        </button>
        {docsOpen && (
          <div className="space-y-px">
            <button onClick={() => fileInputRef.current?.click()} disabled={uploadingDocs}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-colors disabled:opacity-40">
              {uploadingDocs
                ? <span className="h-3 w-3 rounded-full border border-white/20 border-t-white/60 animate-spin" />
                : <Upload size={13} className="opacity-60" />}
              Upload document
            </button>
            <input ref={fileInputRef} type="file" multiple accept=".pdf,.txt,.md,.docx" className="hidden" onChange={handleUploadDocs} />
            {library.length === 0
              ? <p className="px-3 py-1.5 text-[12px] text-white/28">No documents yet.</p>
              : library.slice(0, 8).map((doc) => (
                <div key={doc.id} className="group flex items-center gap-2 px-3 py-1.5 rounded-[8px] hover:bg-white/[0.05] transition-colors cursor-default">
                  <DocIcon type={doc.type} />
                  <span className="flex-1 text-[12.5px] font-medium text-white/85 truncate group-hover:text-white transition-colors">{doc.name}</span>
                  <button onClick={() => handleDeleteDoc(doc.id)}
                    className="opacity-0 group-hover:opacity-100 text-white/25 hover:text-red-400 transition p-0.5 rounded">
                    <Trash2 size={11} />
                  </button>
                </div>
              ))
            }
            {library.length > 8 && <p className="px-3 py-1 text-[11px] text-white/28">+{library.length - 8} more</p>}
          </div>
        )}
      </div>

      {/* Recents */}
      <div className="flex-1 overflow-y-auto thin-scroll px-2 pb-2 mt-6">
        <div className="flex items-center gap-1.5 px-3 py-1.5 mb-0.5">
          <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-white/35 flex-1">Recent</span>
        </div>
        <div className="relative mb-1.5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/22" size={11} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
            className="w-full h-7 rounded-[8px] pl-7 pr-3 text-[12px] text-white/90 placeholder:text-white/35 outline-none bg-white/[0.04] border border-transparent focus:border-white/[0.10] transition-colors" />
        </div>

        {grouped.length === 0
          ? <p className="px-3 py-2 text-[12px] text-white/28">No conversations yet.</p>
          : grouped.map(({ label, items }) => (
            <div key={label} className="mb-4">
              <div className="px-3 pb-1 text-[9.5px] font-medium text-white/22 uppercase tracking-widest">{label}</div>
              {items.map((conv) => (
                <div key={conv.id}
                  onClick={() => handleConvSelect(conv.id)}
                  onMouseEnter={() => setHoveredConv(conv.id)}
                  onMouseLeave={() => setHoveredConv(null)}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-[8px] cursor-pointer mb-px transition-colors ${
                    activeConvId === conv.id ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
                  }`}
                >
                  {renamingId === conv.id ? (
                    <input autoFocus value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleRenameSubmit(conv.id)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleRenameSubmit(conv.id); if (e.key === "Escape") setRenamingId(null); }}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 text-[13px] bg-transparent text-white outline-none border-b border-white/30"
                    />
                  ) : (
                    <span
                      className={`text-[13px] font-medium truncate flex-1 transition-colors ${activeConvId === conv.id ? "text-white" : "text-white/85"}`}
                      onDoubleClick={(e) => { e.stopPropagation(); setRenamingId(conv.id); setRenameValue(conv.title); }}
                    >
                      {conv.title}
                    </span>
                  )}
                  {hoveredConv === conv.id && renamingId !== conv.id && (
                    <button onClick={(e) => handleDeleteConv(conv.id, e)}
                      className="flex-shrink-0 text-white/30 hover:text-red-400 transition p-0.5 rounded">
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))
        }
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.05]">
        {user?.plan === "free" && (
          <div className="mx-3 mt-3 mb-2 rounded-[10px] p-3 bg-amber-500/[0.06] border border-amber-500/[0.15]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent text-white">Free</span>
              <span className="text-[11px] text-white/50">20 queries / month</span>
            </div>
            <Link href="/pricing" className="block w-full text-center text-[12px] font-semibold py-1.5 rounded-[7px] transition hover:opacity-85 bg-white text-bg mt-2">
              Upgrade
            </Link>
          </div>
        )}
        <div className="flex items-center gap-2.5 px-3 py-3">
          <div className="logo-grad h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ring-2 ring-amber-500/20">
            {user?.avatar_initials || user?.full_name?.slice(0, 2).toUpperCase() || "??"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold truncate">{user?.full_name}</div>
            <div className="text-[11px] text-white/40 truncate flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
              {user?.plan === "free" ? "Free plan" : "Pro plan"}
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={() => router.push("/settings/profile")}
              className="p-1.5 rounded-[6px] text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition">
              <Settings size={13} />
            </button>
            <button onClick={handleLogout}
              className="p-1.5 rounded-[6px] text-white/30 hover:text-red-400 hover:bg-red-500/10 transition">
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
