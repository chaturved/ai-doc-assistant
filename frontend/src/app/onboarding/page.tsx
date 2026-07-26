"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Upload, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { completeOnboarding } from "@/lib/api/users";
import { getLibrary, uploadFiles } from "@/lib/api/documents";
import type { LibraryDoc } from "@/types";


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
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getLibrary()
      .then((library) => {
        if (library.sections[0]) {
          setUploadedDoc(library.sections[0]);
          setStep(3);
        }
      })
      .catch(() => {});
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { uploaded, errors } = await uploadFiles([file]);
      if (uploaded[0]) setUploadedDoc(uploaded[0]);
      else toast.error(errors[0]?.error || "Upload failed. Try a PDF, TXT, or MD file under 10 MB.");
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.errors?.[0]?.error : undefined;
      toast.error(message || "Upload failed. Try a PDF, TXT, or MD file under 10 MB.");
    } finally {
      setUploading(false);
    }
  }, []);

  const goAsk = useCallback(async (q: string) => {
    if (!q.trim()) return;
    try {
      await completeOnboarding();
    } catch { /* not fatal, still take them to the dashboard */ }
    router.push(`/dashboard?q=${encodeURIComponent(q.trim())}`);
  }, [router]);

  const handleComplete = async () => {
    try {
      await completeOnboarding();
    } catch { /* not fatal, still take them to the dashboard */ }
    router.push("/dashboard");
  };

  const steps = [
    { n: 1, label: "Welcome" },
    { n: 2, label: "Upload" },
    { n: 3, label: "Ask" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-bg">
      <div className="w-full max-w-[500px]">
        {/* Logo */}
        <span className="text-[15px] font-bold mb-10 block">Paperwise</span>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-3">
          {steps.map((s) => (
            <div key={s.n} className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/[0.06]">
              <div className="h-full rounded-full transition-all duration-500 bg-grad"
                   style={{ width: step > s.n ? "100%" : step === s.n ? "60%" : "0%" }} />
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
              <div className="flex items-center gap-3 rounded-[10px] p-4 mb-6 bg-emerald-400/[0.08] border border-emerald-400/[0.18]">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{uploadedDoc.name}</p>
                  <p className="text-xs text-faint">{(uploadedDoc.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full rounded-[10px] p-10 flex flex-col items-center gap-3 transition-all mb-6 disabled:opacity-50 border-2 border-dashed border-white/[0.08] bg-white/[0.02]"
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
                  onClick={() => goAsk(s)}
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
                onKeyDown={(e) => { if (e.key === "Enter") goAsk(question); }}
                placeholder="Or type your own question…"
                className="flex-1 h-11 rounded-[10px] bg-white/[0.05] border border-white/[0.08] px-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition"
              />
              <button
                onClick={() => goAsk(question)}
                disabled={!question.trim()}
                className="btn-primary !h-11 !py-0 !rounded-[10px] disabled:opacity-40"
              >
                Ask
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)}
                className="h-11 px-5 rounded-[10px] border-system bg-white/[0.04] text-sm text-muted hover:text-white transition flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button onClick={handleComplete}
                className="btn-primary flex-1 !rounded-[10px]">
                Open Paperwise <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
