"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useAuth } from "@/context/AuthContext";
import { completeOnboarding, createConversation, uploadFiles } from "@/lib/paperwise-api";
import type { LibraryDoc } from "@/lib/types";

const SUGGESTIONS = [
  "What is this document about?",
  "Summarize the key points",
  "What are the main conclusions?",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [uploadedDoc, setUploadedDoc] = useState<LibraryDoc | null>(null);
  const [uploading, setUploading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [convId, setConvId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const docs = await uploadFiles([file]);
      setUploadedDoc(docs[0]);
    } catch {
      toast.error("Upload failed. Try a PDF, TXT, or MD file under 10 MB.");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleAsk = useCallback(async (q: string) => {
    if (!q.trim() || streaming) return;
    setAnswer("");
    setStreaming(true);
    try {
      let id = convId;
      if (!id) {
        const conv = await createConversation("My first conversation");
        id = conv.id;
        setConvId(id);
      }
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api";
      await fetchEventSource(`${backendUrl}/v1/conversations/${id}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          question: q,
          filters: uploadedDoc ? { doc_id: uploadedDoc.id } : null,
          top_k: 3,
        }),
        onmessage(ev) {
          if (ev.data === "[DONE]") { setStreaming(false); return; }
          try {
            const parsed = JSON.parse(ev.data);
            if (parsed.token) setAnswer((prev) => prev + parsed.token);
          } catch { /* ignore */ }
        },
        onerror() { setStreaming(false); },
      });
    } catch {
      setStreaming(false);
      toast.error("Failed to get answer");
    }
  }, [convId, streaming, uploadedDoc]);

  const handleComplete = async () => {
    try {
      await completeOnboarding();
      if (convId) router.push(`/dashboard?conv=${convId}`);
      else router.push("/dashboard");
    } catch {
      router.push("/dashboard");
    }
  };

  const steps = [
    { n: 1, label: "Welcome" },
    { n: 2, label: "Upload" },
    { n: 3, label: "Ask" },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[500px]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <span className="text-base font-semibold text-zinc-100">Paperwise</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              <div className={`h-2 flex-1 rounded-full transition-all ${step > s.n ? "bg-indigo-500" : step === s.n ? "bg-indigo-500/60" : "bg-zinc-800"}`} />
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-600 mb-8">Step {step} of 3</p>

        {/* Step 1 — Welcome */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-2">
              Welcome to Paperwise{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""} 👋
            </h2>
            <p className="text-sm text-zinc-500 mb-8">
              You&apos;re 3 steps away from chatting with your first document.
            </p>
            <div className="flex items-center gap-4 rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.07] p-5 mb-8">
              {["📄 Upload", "💬 Ask", "✅ Get answers"].map((item, i) => (
                <div key={item} className="flex items-center gap-3 flex-1">
                  <span className="text-sm text-zinc-300">{item}</span>
                  {i < 2 && <ArrowRight className="h-3.5 w-3.5 text-zinc-700 flex-shrink-0" />}
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white flex items-center justify-center gap-2 transition">
              Let&apos;s go <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2 — Upload */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-2">Upload your first document</h2>
            <p className="text-sm text-zinc-500 mb-6">Drop a PDF, TXT, or MD file to get started.</p>

            {uploadedDoc ? (
              <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20 p-4 mb-6">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{uploadedDoc.name}</p>
                  <p className="text-xs text-zinc-600">{(uploadedDoc.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full rounded-xl border-2 border-dashed border-white/[0.08] hover:border-indigo-500/30 bg-zinc-900/30 hover:bg-indigo-500/5 p-10 flex flex-col items-center gap-3 transition-all mb-6 disabled:opacity-50"
              >
                {uploading ? (
                  <span className="h-6 w-6 rounded-full border-2 border-zinc-700 border-t-indigo-500 animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 text-zinc-600" />
                )}
                <span className="text-sm text-zinc-500">{uploading ? "Uploading…" : "Drop a file here or click to browse"}</span>
                <span className="text-xs text-zinc-700">PDF · TXT · MD · Max 10 MB</span>
              </button>
            )}

            <input ref={fileRef} type="file" accept=".pdf,.txt,.md" className="hidden" onChange={handleFileChange} />

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="h-11 px-5 rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.08] text-sm text-zinc-400 hover:ring-white/15 transition flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button onClick={() => setStep(3)} disabled={!uploadedDoc} className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-sm font-medium text-white flex items-center justify-center gap-2 transition">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Ask */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-2">Now ask something about it!</h2>
            <p className="text-sm text-zinc-500 mb-6">Try one of these or write your own.</p>

            <div className="flex flex-col gap-2 mb-5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setQuestion(s); handleAsk(s); }}
                  className="text-left px-4 py-2.5 rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.07] text-sm text-zinc-400 hover:ring-indigo-500/30 hover:text-zinc-200 hover:bg-indigo-500/5 transition"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mb-4">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAsk(question); }}
                placeholder="Or type your own question…"
                className="flex-1 h-11 rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.08] px-4 text-sm text-zinc-200 placeholder:text-zinc-700 outline-none focus:ring-indigo-500/40 transition"
              />
              <button
                onClick={() => handleAsk(question)}
                disabled={streaming || !question.trim()}
                className="h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-sm text-white transition"
              >
                Ask
              </button>
            </div>

            {(answer || streaming) && (
              <div className="rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.07] p-4 mb-5 text-sm text-zinc-300 leading-relaxed">
                {answer}
                {streaming && <span className="inline-block w-0.5 h-4 bg-indigo-400 rounded-sm align-text-bottom ml-0.5 animate-pulse" />}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="h-11 px-5 rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.08] text-sm text-zinc-400 hover:ring-white/15 transition flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button onClick={handleComplete} disabled={streaming} className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-sm font-medium text-white flex items-center justify-center gap-2 transition">
                Open Paperwise <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
