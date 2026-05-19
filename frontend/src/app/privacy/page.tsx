"use client";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

interface Section {
  title: string;
  content: React.ReactNode;
}

const SECTIONS: Section[] = [
  {
    title: "What data we collect",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted leading-relaxed">We collect only what&apos;s necessary to run Paperwise:</p>
        <ul className="space-y-2">
          {[
            ["Account data", "your email address and display name when you sign up."],
            ["Documents", "the files you upload. These are stored in your account and never shared."],
            ["Queries", "the questions you ask and the AI responses, stored as conversation history."],
            ["Usage data", "aggregate counts (documents uploaded, queries made) for enforcing tier limits."],
            ["Authentication tokens", "short-lived JWT cookies to keep you signed in."],
          ].map(([label, desc]) => (
            <li key={label} className="text-sm text-muted leading-relaxed flex gap-2">
              <span className="text-faint flex-shrink-0">•</span>
              <span><span className="text-white/90 font-medium">{label}</span> — {desc}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted leading-relaxed">We do not collect payment information (Pro billing will use Stripe, which handles card data on their servers).</p>
      </div>
    ),
  },
  {
    title: "How your data is stored",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted leading-relaxed">Documents are stored in Supabase Storage (S3-compatible object storage hosted in the US). Account data, conversations, and metadata are stored in a PostgreSQL database hosted on Supabase.</p>
        <p className="text-sm text-muted leading-relaxed">All data is encrypted at rest and in transit (TLS 1.2+). We use environment-level secrets for all storage credentials — no credentials are ever logged or exposed to clients.</p>
      </div>
    ),
  },
  {
    title: "How your data is used",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted leading-relaxed">Your data is used exclusively to power your own queries:</p>
        <ul className="space-y-2">
          {[
            "Documents are chunked and embedded into a vector index so we can retrieve relevant passages when you ask a question.",
            "Conversation history is used to give the AI multi-turn context within your sessions.",
          ].map((item) => (
            <li key={item} className="text-sm text-muted leading-relaxed flex gap-2">
              <span className="text-faint flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted leading-relaxed"><span className="text-white/90 font-medium">Your data is never used to train AI models.</span> Paperwise uses retrieval-augmented generation over your own documents. Your files are not sent to any AI provider for training.</p>
        <p className="text-sm text-muted leading-relaxed">We do not sell, rent, or share your data with third parties for advertising or analytics.</p>
      </div>
    ),
  },
  {
    title: "Data retention",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted leading-relaxed"><span className="text-white/90 font-medium">Free accounts:</span> conversation history is retained for 7 days after the last message. Documents remain until you delete them or your account.</p>
        <p className="text-sm text-muted leading-relaxed"><span className="text-white/90 font-medium">Pro accounts:</span> conversation history is retained indefinitely until you delete it.</p>
        <p className="text-sm text-muted leading-relaxed">Deleted documents are removed from storage within 24 hours. When you delete your account, all your data (documents, conversations, account info) is permanently deleted within 30 days.</p>
      </div>
    ),
  },
  {
    title: "Your rights",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted leading-relaxed">You have full control over your data:</p>
        <ul className="space-y-2">
          {[
            ["Access", "view all your documents and conversation history in the dashboard."],
            ["Delete", "delete any document or conversation at any time. Delete your account (and all data) from Settings → Profile → Danger Zone."],
            ["Export", "contact us at hello@paperwise.ai to request an export of your data."],
            ["Correction", "update your name and email from Settings → Profile."],
          ].map(([label, desc]) => (
            <li key={label} className="text-sm text-muted leading-relaxed flex gap-2">
              <span className="text-faint flex-shrink-0">•</span>
              <span><span className="text-white/90 font-medium">{label}</span> — {desc}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted leading-relaxed">If you&apos;re in the EU, you also have rights under GDPR including the right to erasure and data portability. Contact us to exercise these rights.</p>
      </div>
    ),
  },
  {
    title: "Cookies",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted leading-relaxed">We use two HttpOnly cookies for authentication:</p>
        <ul className="space-y-2">
          {[
            ["access_token", "short-lived JWT (15 minutes) used to authenticate API requests."],
            ["refresh_token", "longer-lived token (7 days) used to issue new access tokens without requiring you to log in again."],
          ].map(([label, desc]) => (
            <li key={label} className="text-sm text-muted leading-relaxed flex gap-2">
              <span className="text-faint flex-shrink-0">•</span>
              <span><code className="text-xs bg-white/[0.07] px-1.5 py-0.5 rounded text-white/70">{label}</code> — {desc}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted leading-relaxed">We do not use cookies for advertising or third-party tracking.</p>
      </div>
    ),
  },
  {
    title: "Contact",
    content: (
      <p className="text-sm text-muted leading-relaxed">
        Questions about this policy? Email us at{" "}
        <a href="mailto:hello@paperwise.ai" className="text-accent hover:opacity-80 transition">hello@paperwise.ai</a>.
        {" "}We aim to respond within 2 business days.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-bg text-white overflow-x-hidden min-h-screen">
      <SiteNav />

      {/* Hero */}
      <section className="relative section-padding pt-[120px] pb-16 text-center border-b-system">
        <div className="absolute inset-0 pointer-events-none bg-pricing-hero" />
        <div className="relative max-w-[800px] mx-auto">
          <p className="section-label mb-[14px]">Legal</p>
          <h1 className="heading-section mb-4">Privacy Policy</h1>
          <p className="text-[15px] text-muted max-w-[480px] mx-auto">
            Your documents are yours. We collect only what we need and never share it.
          </p>
          <p className="text-[13px] text-faint mt-4">Last updated: May 2026</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[760px] mx-auto px-6 py-4">
        {SECTIONS.map((s, i) => (
          <div key={s.title} className={`py-9 ${i > 0 ? "border-t-system" : ""}`}>
            <h2 className="flex items-center gap-3 text-[15px] font-semibold text-white mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              {s.title}
            </h2>
            {s.content}
          </div>
        ))}
      </div>

      <SiteFooter />
    </div>
  );
}
