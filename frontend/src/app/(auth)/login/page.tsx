"use client";

import AuthCard from "@/components/auth/AuthCard";
import InputField from "@/components/auth/form/InputField";
import PasswordField from "@/components/auth/form/PasswordField";
import Divider from "@/components/auth/form/Divider";
import { Mail, LogIn, Github } from "lucide-react";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/v1/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (response.status === 200) {
        router.push("/dashboard"); // redirect after login
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <>
      <AuthCard title="Sign in" subtitle="Use your work email to continue">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            icon={<Mail className="h-4 w-4 text-zinc-400" />}
          />
          <PasswordField
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <button
            type="submit"
            className="w-full mt-2 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-indigo-600/90 text-white text-sm ring-1 ring-indigo-500/40 hover:bg-indigo-500 transition"
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </button>

          <Divider />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button className="inline-flex items-center justify-center gap-2 h-10 rounded-md bg-zinc-900/70 text-zinc-200 text-sm ring-1 ring-white/10 hover:bg-zinc-900/90 transition">
              <Github className="h-4 w-4" />
              Continue with GitHub
            </button>
            <button className="inline-flex items-center justify-center gap-2 h-10 rounded-md bg-zinc-900/70 text-zinc-200 text-sm ring-1 ring-white/10 hover:bg-zinc-900/90 transition">
              <Mail className="h-4 w-4" />
              Send magic link
            </button>
          </div>
        </form>
      </AuthCard>

      {/* Subtle sign-up prompt */}
      <div className="text-center mt-4 text-sm text-zinc-400">
        New here?{" "}
        <a href="/signup" className="text-zinc-200 hover:text-white transition">
          Create an account
        </a>
      </div>
    </>
  );
}
