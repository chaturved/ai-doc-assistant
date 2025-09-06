import {
  LibrarySection,
  LibrarySectionProps,
} from "./LibrarySection/LibrarySection";

export interface LibraryTabsProps {
  sections: LibrarySectionProps[];
}

export default function LibraryTabs({ sections }: LibraryTabsProps) {
  return (
    <nav className="ring-1 ring-white/10 divide-y divide-white/5 bg-zinc-950/40 rounded-xl backdrop-blur-md">
      {sections.map((section, idx) => (
        <LibrarySection key={idx} {...section} />
      ))}
    </nav>
  );
}
