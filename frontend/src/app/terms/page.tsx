"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Section {
  title: string;
  content: React.ReactNode;
}

const BULLET_ITEMS: Record<string, string[]> = {
  "Acceptable use": [
    "Upload content that is illegal, abusive, harassing, or infringes third-party intellectual property rights.",
    "Attempt to reverse-engineer, scrape, or systematically extract content from the service.",
    "Share your account credentials with others.",
    "Use the service to train AI models or build competing products.",
    "Circumvent usage limits through multiple accounts or automated requests.",
    "Upload malware or code designed to harm Paperwise systems or other users.",
  ],
  "Prohibited content": [
    "Content that violates any applicable law or regulation",
    "Child sexual abuse material (CSAM) — violations will be reported to relevant authorities",
    "Documents containing another person's private information without their consent",
    "Copyrighted material you do not have rights to process",
    "Content designed to deceive, defraud, or harm others",
  ],
};

const FREE_LIMITS = [
  "5 documents stored simultaneously",
  "20 AI queries per day (resets at midnight UTC)",
  "10 MB maximum file size",
  "PDF, TXT, and Markdown file formats",
  "7-day conversation history retention",
];

const SECTIONS: Section[] = [
  {
    title: "Acceptance of terms",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted leading-relaxed">By creating a Paperwise account or using the Paperwise service, you agree to these Terms of Service. If you do not agree, do not use the service.</p>
        <p className="text-sm text-muted leading-relaxed">These terms may be updated from time to time. Continued use after changes means you accept the new terms. We&apos;ll notify you of material changes by email or by displaying a notice in the app.</p>
      </div>
    ),
  },
  {
    title: "Acceptable use",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted leading-relaxed">You may use Paperwise to upload documents and ask questions about them for lawful purposes. You agree not to:</p>
        <ul className="space-y-2">
          {BULLET_ITEMS["Acceptable use"].map((item) => (
            <li key={item} className="text-sm text-muted leading-relaxed flex gap-2">
              <span className="text-faint flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    title: "Free tier limits",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted leading-relaxed">The Free plan includes:</p>
        <ul className="space-y-2">
          {FREE_LIMITS.map((item) => (
            <li key={item} className="text-sm text-muted leading-relaxed flex gap-2">
              <span className="text-faint flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted leading-relaxed">We reserve the right to adjust free tier limits with reasonable notice. If you exceed limits, queries will be blocked until the next reset or until you upgrade.</p>
      </div>
    ),
  },
  {
    title: "Your content",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted leading-relaxed">You own your documents. By uploading content to Paperwise, you grant us a limited, non-exclusive license to store, process, and index your content for the sole purpose of providing the service to you.</p>
        <p className="text-sm text-muted leading-relaxed">We do not claim ownership of your documents. We do not use your documents to train AI models. When you delete content or your account, we remove it from our systems as described in our Privacy Policy.</p>
      </div>
    ),
  },
  {
    title: "Prohibited content",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted leading-relaxed">You must not upload or process the following types of content:</p>
        <ul className="space-y-2">
          {BULLET_ITEMS["Prohibited content"].map((item) => (
            <li key={item} className="text-sm text-muted leading-relaxed flex gap-2">
              <span className="text-faint flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    title: "Account termination",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted leading-relaxed">You may delete your account at any time from Settings → Profile → Danger Zone. All your data will be permanently deleted within 30 days.</p>
        <p className="text-sm text-muted leading-relaxed">We may suspend or terminate accounts that violate these terms, with or without notice depending on the severity of the violation. Severe violations (illegal content, fraud, abuse) may result in immediate termination without refund.</p>
        <p className="text-sm text-muted leading-relaxed">If your account is terminated erroneously, contact <a href="mailto:hello@paperwise.ai" className="text-accent hover:opacity-80 transition">hello@paperwise.ai</a> within 14 days.</p>
      </div>
    ),
  },
  {
    title: "Limitation of liability",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted leading-relaxed">Paperwise is provided &quot;as is&quot; without warranty of any kind. We make no guarantees about uptime, accuracy of AI-generated responses, or fitness for any particular purpose. Always verify important information from primary sources.</p>
        <p className="text-sm text-muted leading-relaxed">To the maximum extent permitted by law, Paperwise and its operators shall not be liable for indirect, incidental, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
      </div>
    ),
  },
  {
    title: "Governing law",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted leading-relaxed">These terms are governed by the laws of the jurisdiction in which Paperwise is operated, without regard to conflict of law principles. Any disputes shall be resolved through binding arbitration, except where prohibited by law.</p>
        <p className="text-sm text-muted leading-relaxed">If any provision of these terms is found unenforceable, the remaining provisions remain in full effect.</p>
      </div>
    ),
  },
  {
    title: "Contact",
    content: (
      <p className="text-sm text-muted leading-relaxed">
        Questions about these terms? Email{" "}
        <a href="mailto:hello@paperwise.ai" className="text-accent hover:opacity-80 transition">hello@paperwise.ai</a>.
        {" "}We aim to respond within 2 business days.
      </p>
    ),
  },
];

export default function TermsPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-bg text-white overflow-x-hidden min-h-screen">
      <nav className={`fixed top-0 inset-x-0 z-50 h-[60px] flex items-center px-9 transition-all duration-300 ${scrolled ? "bg-bg/90 backdrop-blur-xl border-b-system" : ""}`}>
        <Link href="/" className="flex items-center shrink-0">
          <span className="text-[15px] font-bold">Paperwise</span>
        </Link>
        <div className="flex-1 flex items-center justify-center gap-8">
          {[
            { label: "Features",     href: "/#features" },
            { label: "How It Works", href: "/#how-it-works" },
            { label: "Pricing",      href: "/pricing" },
            { label: "FAQ",          href: "/pricing#faq" },
          ].map((l) => (
            <Link key={l.label} href={l.href} className="text-[13.5px] font-medium text-white/70 hover:text-white transition">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/login" className="text-[13.5px] font-medium text-muted hover:text-white transition">Log in</Link>
          <Link href="/signup" className="btn-primary shrink-0 !text-[13.5px]">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative section-padding pt-[120px] pb-16 text-center border-b-system">
        <div className="absolute inset-0 pointer-events-none bg-pricing-hero" />
        <div className="relative max-w-[800px] mx-auto">
          <p className="section-label mb-[14px]">Legal</p>
          <h1 className="heading-section mb-4">Terms of Service</h1>
          <p className="text-[15px] text-muted max-w-[480px] mx-auto">
            These terms govern your access to and use of Paperwise. Please read them carefully.
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

      {/* Footer */}
      <footer className="relative overflow-hidden border-t-system bg-footer-gradient mt-8">
        <div className="max-w-[1100px] mx-auto px-9 pt-10 pb-6">
          <div className="flex justify-between items-start mb-10">
            <div className="max-w-[280px]">
              <span className="text-sm font-bold block mb-3">Paperwise</span>
              <p className="text-[13px] text-muted leading-[1.7]">Upload any document. Ask anything. Get cited answers instantly.</p>
            </div>
            <nav className="flex gap-7 pt-1">
              {[
                { label: "Features",     href: "/#features" },
                { label: "How It Works", href: "/#how-it-works" },
                { label: "Pricing",      href: "/pricing" },
                { label: "FAQ",          href: "/pricing#faq" },
              ].map((l) => (
                <Link key={l.label} href={l.href} className="text-[13px] text-muted hover:text-white transition">{l.label}</Link>
              ))}
            </nav>
          </div>
          <div className="border-t-system pt-6 flex items-center justify-between">
            <span className="text-xs text-faint">© 2026 Paperwise. All rights reserved.</span>
            <div className="flex gap-5">
              <Link href="/privacy" className="text-xs text-faint hover:text-muted transition">Privacy</Link>
              <Link href="/terms" className="text-xs text-faint hover:text-muted transition">Terms</Link>
              <a href="mailto:hello@paperwise.ai" className="text-xs text-faint hover:text-muted transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
