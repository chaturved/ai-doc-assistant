"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  id?: string;
  label?: string;
}

export default function PasswordField({ id, label }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-xs text-zinc-400 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {/* Left icon */}
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <Lock className="h-4 w-4 text-zinc-400" />
        </div>

        {/* Input */}
        <input
          id={id}
          name="password"
          type={visible ? "text" : "password"}
          placeholder="••••••••"
          className="w-full rounded-lg bg-zinc-900/80 text-sm pl-9 pr-10 h-11 outline-none ring-1 ring-white/10 focus:ring-indigo-500/40 placeholder:text-zinc-500 transition"
        />

        {/* Toggle visibility */}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible(!visible)}
          className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-200"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
