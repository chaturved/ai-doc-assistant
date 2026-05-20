const DOCS = [
  { title: "Q3 Financial Report", type: "PDF",  rot: "-6deg", pos: "top-[10%] left-[6%]",    delay: "0s" },
  { title: "Legal Contract",      type: "DOCX", rot: "5deg",  pos: "top-[28%] right-[6%]",  delay: "1.2s" },
  { title: "Product Roadmap",     type: "PDF",  rot: "4deg",  pos: "bottom-[26%] left-[8%]", delay: "0.6s" },
  { title: "Onboarding Guide",    type: "MD",   rot: "-4deg", pos: "bottom-[12%] right-[8%]", delay: "1.8s" },
];

export function AuthBackground() {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none bg-hero-gradient opacity-50" />
      <div className="absolute inset-0 pointer-events-none bg-vignette" />
      {DOCS.map((doc) => (
        <div
          key={doc.title}
          className={`doc-float absolute ${doc.pos} w-[188px] pointer-events-none hidden sm:block`}
          style={{ "--rot": doc.rot, animationDelay: doc.delay } as React.CSSProperties}
        >
          <div className="card p-3 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-[22px] h-[22px] rounded flex items-center justify-center text-[9px] font-bold text-white/50 bg-white/[0.06]">
                {doc.type}
              </div>
            </div>
            <p className="text-[12px] font-medium text-white/70">{doc.title}</p>
            <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full logo-grad w-[60%]" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
