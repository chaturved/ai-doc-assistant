import Link from "next/link";

interface Section {
  title: string;
  content: React.ReactNode;
}

const body = "text-sm text-zinc-400 leading-relaxed";
const strong = "text-zinc-200 font-medium";

const SECTIONS: Section[] = [
  {
    title: "What data we collect",
    content: (
      <div className="space-y-3">
        <p className={body}>We collect only what&apos;s necessary to run Paperwise:</p>
        <ul className="space-y-2">
          {[
            ["Account data", "your email address and display name when you sign up."],
            ["Documents", "the files you upload. These are stored in your account and never shared."],
            ["Queries", "the questions you ask and the AI responses, stored as conversation history."],
            ["Usage data", "aggregate counts (documents uploaded, queries made) for enforcing tier limits."],
            ["Authentication tokens", "short-lived JWT cookies to keep you signed in."],
          ].map(([label, desc]) => (
            <li key={label} className={`${body} flex gap-2`}>
              <span className="text-zinc-600 flex-shrink-0">•</span>
              <span><span className={strong}>{label}</span> — {desc}</span>
            </li>
          ))}
        </ul>
        <p className={body}>We do not collect payment information (Pro billing will use Stripe, which handles card data on their servers).</p>
      </div>
    ),
  },
  {
    title: "How your data is stored",
    content: (
      <div className="space-y-3">
        <p className={body}>Documents are stored in Supabase Storage (S3-compatible object storage hosted in the US). Account data, conversations, and metadata are stored in a PostgreSQL database hosted on Supabase.</p>
        <p className={body}>All data is encrypted at rest and in transit (TLS 1.2+). We use environment-level secrets for all storage credentials — no credentials are ever logged or exposed to clients.</p>
      </div>
    ),
  },
  {
    title: "How your data is used",
    content: (
      <div className="space-y-3">
        <p className={body}>Your data is used exclusively to power your own queries:</p>
        <ul className="space-y-2">
          {[
            "Documents are chunked and embedded into a vector index so we can retrieve relevant passages when you ask a question.",
            "Conversation history is used to give the AI multi-turn context within your sessions.",
          ].map((item) => (
            <li key={item} className={`${body} flex gap-2`}>
              <span className="text-zinc-600 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className={body}><span className={strong}>Your data is never used to train AI models.</span> Paperwise uses an open-source LLM (Mistral 7B) via the Hugging Face Inference API. Your documents are not sent to Hugging Face for training.</p>
        <p className={body}>We do not sell, rent, or share your data with third parties for advertising or analytics.</p>
      </div>
    ),
  },
  {
    title: "Data retention",
    content: (
      <div className="space-y-3">
        <p className={body}><span className={strong}>Free accounts:</span> conversation history is retained for 7 days after the last message. Documents remain until you delete them or your account.</p>
        <p className={body}><span className={strong}>Pro accounts:</span> conversation history is retained indefinitely until you delete it.</p>
        <p className={body}>Deleted documents are removed from storage within 24 hours. When you delete your account, all your data (documents, conversations, account info) is permanently deleted within 30 days.</p>
      </div>
    ),
  },
  {
    title: "Your rights",
    content: (
      <div className="space-y-3">
        <p className={body}>You have full control over your data:</p>
        <ul className="space-y-2">
          {[
            ["Access", "view all your documents and conversation history in the dashboard."],
            ["Delete", "delete any document or conversation at any time. Delete your account (and all data) from Settings → Profile → Danger Zone."],
            ["Export", "contact us at hello@paperwise.ai to request an export of your data."],
            ["Correction", "update your name and email from Settings → Profile."],
          ].map(([label, desc]) => (
            <li key={label} className={`${body} flex gap-2`}>
              <span className="text-zinc-600 flex-shrink-0">•</span>
              <span><span className={strong}>{label}</span> — {desc}</span>
            </li>
          ))}
        </ul>
        <p className={body}>If you&apos;re in the EU, you also have rights under GDPR including the right to erasure and data portability. Contact us to exercise these rights.</p>
      </div>
    ),
  },
  {
    title: "Cookies",
    content: (
      <div className="space-y-3">
        <p className={body}>We use two HttpOnly cookies for authentication:</p>
        <ul className="space-y-2">
          {[
            ["`access_token`", "short-lived JWT (15 minutes) used to authenticate API requests."],
            ["`refresh_token`", "longer-lived token (7 days) used to issue new access tokens without requiring you to log in again."],
          ].map(([label, desc]) => (
            <li key={label} className={`${body} flex gap-2`}>
              <span className="text-zinc-600 flex-shrink-0">•</span>
              <span><code className="text-xs bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">{label.replace(/`/g, "")}</code> — {desc}</span>
            </li>
          ))}
        </ul>
        <p className={body}>We do not use cookies for advertising or third-party tracking.</p>
      </div>
    ),
  },
  {
    title: "Contact",
    content: (
      <p className={body}>
        Questions about this policy? Email us at{" "}
        <a href="mailto:hello@paperwise.ai" className="text-indigo-400 hover:text-indigo-300 transition">hello@paperwise.ai</a>.
        {" "}We aim to respond within 2 business days.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-sm font-semibold text-zinc-100">Paperwise</span>
          </Link>
          <Link href="/terms" className="text-sm text-zinc-500 hover:text-zinc-300 transition">Terms of Service</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-zinc-100 mb-3">Privacy Policy</h1>
          <p className="text-zinc-500 text-sm">Last updated: May 2026</p>
        </div>

        <p className={`${body} mb-10`}>
          Paperwise is built on a simple principle: your documents are yours. We collect only what we need, use it only to power your experience, and never share it. This policy explains exactly what we collect and why.
        </p>

        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="text-base font-semibold text-zinc-100 mb-3">{s.title}</h2>
              {s.content}
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06] flex items-center justify-between">
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-400 transition">← Back to Paperwise</Link>
          <Link href="/terms" className="text-sm text-zinc-600 hover:text-zinc-400 transition">Terms of Service →</Link>
        </div>
      </div>
    </div>
  );
}
