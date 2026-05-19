"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { deleteAccount, updateProfile } from "@/lib/paperwise-api";
import { useRouter } from "next/navigation";

const schema = z.object({ full_name: z.string().min(2, "Name must be at least 2 characters") });
type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, refetchUser } = useAuth();
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: user?.full_name || "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateProfile(data.full_name);
      await refetchUser();
      toast.success("Profile updated");
    } catch { toast.error("Failed to update profile"); }
  };

  const handleDelete = async () => {
    if (deleteInput !== "DELETE") return;
    setDeleting(true);
    try {
      await deleteAccount();
      await refetchUser();
      router.push("/login");
    } catch { toast.error("Failed to delete account"); setDeleting(false); }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-100 mb-6">Profile</h1>

      {/* Avatar */}
      <div className="mb-6">
        <p className="text-xs font-medium text-zinc-500 mb-2">Avatar</p>
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{user?.avatar_initials || "??"}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full name</label>
          <input {...register("full_name")} className="w-full h-11 rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.08] px-4 text-sm text-zinc-200 outline-none focus:ring-indigo-500/40 transition" />
          {errors.full_name && <p className="mt-1 text-xs text-red-400">{errors.full_name.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
          <div className="flex items-center gap-2">
            <input value={user?.email || ""} readOnly className="flex-1 h-11 rounded-xl bg-zinc-900/30 ring-1 ring-white/[0.05] px-4 text-sm text-zinc-500 cursor-not-allowed" />
            <span className="text-xs text-emerald-400 ring-1 ring-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded-full">Verified</span>
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-sm font-medium text-white transition">
          {isSubmitting ? "Saving…" : "Save changes"}
        </button>
      </form>

      <div className="mt-10 pt-8 border-t border-white/[0.06]">
        <h2 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h2>
        <p className="text-xs text-zinc-600 mb-4">Deleting your account permanently removes all your documents, conversations, and data.</p>
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)} className="h-9 px-4 rounded-xl bg-red-500/10 ring-1 ring-red-500/20 text-sm text-red-400 hover:bg-red-500/20 transition">
            Delete my account
          </button>
        ) : (
          <div className="space-y-3 max-w-sm">
            <p className="text-xs text-zinc-500">Type <span className="font-mono text-zinc-300">DELETE</span> to confirm.</p>
            <input value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} placeholder="DELETE" className="w-full h-10 rounded-xl bg-zinc-900/60 ring-1 ring-red-500/20 px-4 text-sm text-zinc-200 outline-none focus:ring-red-500/40 transition" />
            <div className="flex gap-2">
              <button onClick={() => setShowDelete(false)} className="h-9 px-4 rounded-xl bg-zinc-800 text-sm text-zinc-400 hover:bg-zinc-700 transition">Cancel</button>
              <button onClick={handleDelete} disabled={deleteInput !== "DELETE" || deleting} className="h-9 px-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-sm text-white transition">
                {deleting ? "Deleting…" : "Confirm delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
