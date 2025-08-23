import "../styles/globals.css";
import { Inter } from "next/font/google";
import AmbientBackground from "@/components/AmbientBackground";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SidebarLeft from "@/components/SidebarLeft/SidebarLeft";
import SidebarRight from "@/components/SidebarRight/SidebarRight";

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
        <Header />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-10 grid grid-cols-12 gap-6">
          <SidebarLeft />
          <main className="col-span-12 lg:col-span-6">{children}</main>
          <SidebarRight />
        </div>
        <Footer />
      </body>
    </html>
  );
}
