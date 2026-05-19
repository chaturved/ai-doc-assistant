import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

function Section({ title, children, first }: { title: string; children: React.ReactNode; first?: boolean }) {
  return (
    <div className={`py-9 ${!first ? "border-t-system" : ""}`}>
      <h2 className="flex items-center gap-3 text-[15px] font-semibold text-white mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted leading-relaxed">{children}</p>;
}

function Bullets({ items }: { items: [string, string][] }) {
  return (
    <ul className="space-y-2">
      {items.map(([label, desc]) => (
        <li key={label} className="text-sm text-muted leading-relaxed flex gap-2">
          <span className="text-faint flex-shrink-0 mt-[3px]">•</span>
          <span><span className="text-white/90 font-medium">{label}</span> — {desc}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <div className="bg-bg text-white overflow-x-hidden min-h-screen">
      <SiteNav />

      <section className="relative section-padding pt-[120px] pb-16 text-center border-b-system">
        <div className="absolute inset-0 pointer-events-none bg-hero-gradient opacity-50" />
        <div className="absolute inset-0 pointer-events-none bg-vignette" />
        <div className="absolute bottom-0 inset-x-0 h-[80px] pointer-events-none bg-hero-fade" />
        <div className="relative max-w-[800px] mx-auto">
          <p className="section-label mb-[14px]">Legal</p>
          <h1 className="heading-section mb-4">Privacy Policy</h1>
          <p className="text-[15px] text-muted max-w-[480px] mx-auto">
            Your documents are yours. We collect only what we need and never share it.
          </p>
          <p className="text-[13px] text-faint mt-4">Last updated: May 2026</p>
        </div>
      </section>

      <div className="max-w-[760px] mx-auto px-6 py-4 pb-16">

        <Section title="What data we collect" first>
          <P>We collect only what&apos;s necessary to run Paperwise:</P>
          <Bullets items={[
            ["Account data", "your email address and display name when you sign up."],
            ["Documents", "the files you upload. These are stored in your account and never shared."],
            ["Queries", "the questions you ask and the AI responses, stored as conversation history."],
            ["Usage data", "aggregate counts (documents uploaded, queries made) for enforcing tier limits."],
            ["Authentication tokens", "short-lived JWT cookies to keep you signed in."],
          ]} />
          <P>We do not collect payment information (Pro billing will use Stripe, which handles card data on their servers).</P>
        </Section>

        <Section title="How your data is stored">
          <P>Documents are stored in Supabase Storage (S3-compatible object storage hosted in the US). Account data, conversations, and metadata are stored in a PostgreSQL database hosted on Supabase.</P>
          <P>All data is encrypted at rest and in transit (TLS 1.2+). We use environment-level secrets for all storage credentials — no credentials are ever logged or exposed to clients.</P>
        </Section>

        <Section title="How your data is used">
          <P>Your data is used exclusively to power your own queries:</P>
          <ul className="space-y-2">
            {[
              "Documents are chunked and embedded into a vector index so we can retrieve relevant passages when you ask a question.",
              "Conversation history is used to give the AI multi-turn context within your sessions.",
            ].map((item) => (
              <li key={item} className="text-sm text-muted leading-relaxed flex gap-2">
                <span className="text-faint flex-shrink-0 mt-[3px]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <P><span className="text-white/90 font-medium">Your data is never used to train AI models.</span> Paperwise uses retrieval-augmented generation over your own documents. Your files are not sent to any AI provider for training.</P>
          <P>We do not sell, rent, or share your data with third parties for advertising or analytics.</P>
        </Section>

        <Section title="Data retention">
          <P><span className="text-white/90 font-medium">Free accounts:</span> conversation history is retained for 7 days after the last message. Documents remain until you delete them or your account.</P>
          <P><span className="text-white/90 font-medium">Pro accounts:</span> conversation history is retained indefinitely until you delete it.</P>
          <P>Deleted documents are removed from storage within 24 hours. When you delete your account, all your data (documents, conversations, account info) is permanently deleted within 30 days.</P>
        </Section>

        <Section title="Your rights">
          <P>You have full control over your data:</P>
          <Bullets items={[
            ["Access", "view all your documents and conversation history in the dashboard."],
            ["Delete", "delete any document or conversation at any time. Delete your account (and all data) from Settings → Profile → Danger Zone."],
            ["Export", "contact us at hello@paperwise.ai to request an export of your data."],
            ["Correction", "update your name and email from Settings → Profile."],
          ]} />
          <P>If you&apos;re in the EU, you also have rights under GDPR including the right to erasure and data portability. Contact us to exercise these rights.</P>
        </Section>

        <Section title="Cookies">
          <P>We use two HttpOnly cookies for authentication:</P>
          <ul className="space-y-2">
            {([
              ["access_token", "short-lived JWT (15 minutes) used to authenticate API requests."],
              ["refresh_token", "longer-lived token (7 days) used to issue new access tokens without requiring you to log in again."],
            ] as [string, string][]).map(([label, desc]) => (
              <li key={label} className="text-sm text-muted leading-relaxed flex gap-2">
                <span className="text-faint flex-shrink-0 mt-[3px]">•</span>
                <span><code className="text-xs bg-white/[0.07] px-1.5 py-0.5 rounded text-white/70">{label}</code> — {desc}</span>
              </li>
            ))}
          </ul>
          <P>We do not use cookies for advertising or third-party tracking.</P>
        </Section>

        <Section title="Contact">
          <P>Questions about this policy? Email <a href="mailto:hello@paperwise.ai" className="text-accent hover:opacity-80 transition">hello@paperwise.ai</a> — we aim to respond within 2 business days.</P>
        </Section>

      </div>

      <SiteFooter />
    </div>
  );
}
