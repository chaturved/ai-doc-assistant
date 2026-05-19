import "../styles/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Paperwise — Chat with your documents",
  description: "Upload any PDF, Word doc, or text file and ask questions in plain English.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: { background: "#18181b", border: "1px solid rgba(255,255,255,0.08)", color: "#fafafa" },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
