import "../styles/globals.css";
import { Inter } from "next/font/google";
import AmbientBackground from "@/components/AmbientBackground";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "AI Docs Assistant — Search • Answers • Sources",
  description: "AI Docs Assistant App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
        <AmbientBackground />
        {children}
      </body>
    </html>
  );
}
