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
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: "#080810" }}>
      <div className="w-full max-w-[500px]">
        {/* Logo */}
        <div className="flex items-center gap-[9px] mb-10">          <span className="text-[15px] font-bold">Paperwise</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-3">
          {steps.map((s) => (
            <div key={s.n} className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-500"
                   style={{
                     width: step > s.n ? "100%" : step === s.n ? "60%" : "0%",
                     background: "radial-gradient(ellipse at 30% 30%, #a78bfa 0%, #7c3aed 50%, #f59e0b 100%)",
                   }} />
            </div>
          ))}
        </div>
        <p className="text-xs text-faint mb-8">Step {step} of 3</p>

        {/* Step 1 — Welcome */}
        {step === 1 && (
          <div className="animate-fu">
            <h2 className="text-2xl font-bold mb-2">
              Welcome to Paperwise{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}
            </h2>
            <p className="text-sm text-muted mb-8">
              You&apos;re 3 steps away from chatting with your first document.
            </p>
            <div className="card p-5 mb-8 flex items-center gap-4">
              {["📄 Upload", "💬 Ask", "✅ Get answers"].map((item, i) => (
                <div key={item} className="flex items-center gap-3 flex-1">
                  <span className="text-sm text-white/70">{item}</span>
                  {i < 2 && <ArrowRight className="h-3.5 w-3.5 text-faint flex-shrink-0" />}
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="btn-primary w-full !rounded-[10px]">
              Let&apos;s go <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2 — Upload */}
        {step === 2 && (
          <div className="animate-fu">
            <h2 className="text-2xl font-bold mb-2">Upload your first document</h2>
            <p className="text-sm text-muted mb-6">Drop a PDF, TXT, or MD file to get started.</p>

            {uploadedDoc ? (
              <div className="flex items-center gap-3 rounded-[10px] p-4 mb-6"
                   style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.18)" }}>
                <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: "#34d399" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{uploadedDoc.name}</p>
                  <p className="text-xs text-faint">{(uploadedDoc.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full rounded-[10px] p-10 flex flex-col items-center gap-3 transition-all mb-6 disabled:opacity-50"
                style={{ border: "2px dashed rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
              >
                {uploading ? (
                  <span className="h-6 w-6 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 text-faint" />
                )}
                <span className="text-sm text-muted">{uploading ? "Uploading…" : "Drop a file here or click to browse"}</span>
                <span className="text-xs text-faint">PDF · TXT · MD · Max 10 MB</span>
              </button>
            )}

            <input ref={fileRef} type="file" accept=".pdf,.txt,.md" className="hidden" onChange={handleFileChange} />

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="h-11 px-5 rounded-[10px] border-system bg-white/[0.04] text-sm text-muted hover:text-white transition flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button onClick={() => setStep(3)} disabled={!uploadedDoc}
                className="btn-primary flex-1 !rounded-[10px] disabled:opacity-40">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Ask */}
        {step === 3 && (
          <div className="animate-fu">
            <h2 className="text-2xl font-bold mb-2">Now ask something about it!</h2>
            <p className="text-sm text-muted mb-6">Try one of these or write your own.</p>

            <div className="flex flex-col gap-2 mb-5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setQuestion(s); handleAsk(s); }}
                  className="text-left px-4 py-2.5 rounded-[10px] border-system bg-white/[0.04] text-sm text-muted hover:border-primary/30 hover:text-white hover:bg-white/[0.07] transition"
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
                className="flex-1 h-11 rounded-[10px] bg-white/[0.05] border border-white/[0.08] px-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition"
              />
              <button
                onClick={() => handleAsk(question)}
                disabled={streaming || !question.trim()}
                className="btn-primary !h-11 !py-0 !rounded-[10px] disabled:opacity-40"
              >
                Ask
              </button>
            </div>

            {(answer || streaming) && (
              <div className="card p-4 mb-5 text-sm text-white/70 leading-relaxed">
                {answer}
                {streaming && <span className="inline-block w-0.5 h-4 rounded-sm align-text-bottom ml-0.5 animate-blink" style={{ background: "#a78bfa" }} />}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(2)}
                className="h-11 px-5 rounded-[10px] border-system bg-white/[0.04] text-sm text-muted hover:text-white transition flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button onClick={handleComplete} disabled={streaming}
                className="btn-primary flex-1 !rounded-[10px] disabled:opacity-40">
                Open Paperwise <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
