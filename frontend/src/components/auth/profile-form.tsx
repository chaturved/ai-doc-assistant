"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { deleteAccount, updateProfile } from "@/lib/api/users";
import { useRouter } from "next/navigation";

const schema = z.object({ full_name: z.string().min(2, "Name must be at least 2 characters") });
type FormData = z.infer<typeof schema>;

export function ProfileForm() {
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
      <h1 className="text-[22px] font-bold text-white mb-8">Profile</h1>

      {/* Avatar */}
      <div className="mb-8">
        <p className="text-[12px] font-medium text-white/40 mb-3">Avatar</p>
        <div
          className="logo-grad h-16 w-16 rounded-full flex items-center justify-center font-bold text-xl"
          style={{ boxShadow: "0 0 0 3px rgba(245,158,11,0.25), 0 4px 20px rgba(245,158,11,0.25)" }}
        >
          {user?.avatar_initials || "??"}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-[12px] font-medium text-white/40 mb-2">Full name</label>
          <input
            {...register("full_name")}
            className="w-full px-4 py-3 rounded-[10px] text-[14px] text-white outline-none transition"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
          {errors.full_name && <p className="mt-1.5 text-xs text-red-400">{errors.full_name.message}</p>}
        </div>

        <div>
          <label className="block text-[12px] font-medium text-white/40 mb-2">Email</label>
          <div className="flex items-center gap-3">
            <input
              value={user?.email || ""}
              readOnly
              className="flex-1 px-4 py-3 rounded-[10px] text-[14px] cursor-not-allowed outline-none"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.28)" }}
            />
            <span className="text-[11px] font-semibold px-3 py-1.5 rounded-md whitespace-nowrap"
              style={{ background: "rgba(52,211,153,0.08)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
              Verified
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-[10px] text-[14px] font-bold bg-white text-black disabled:opacity-50 transition hover:opacity-90"
        >
          {isSubmitting ? "Saving…" : "Save changes"}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="mt-10 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <h2 className="text-[16px] font-bold text-red-400 mb-2">Danger Zone</h2>
        <p className="text-[13px] mb-5" style={{ color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
          Deleting your account permanently removes all your documents, conversations, and data.
        </p>

        {!showDelete ? (
          <button
            onClick={() => setShowDelete(true)}
            className="px-5 py-2.5 rounded-[10px] text-[13px] font-semibold text-red-400 transition"
            style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            Delete my account
          </button>
        ) : (
          <div className="space-y-3 max-w-sm">
            <p className="text-xs text-white/40">
              Type <span className="font-mono text-white">DELETE</span> to confirm.
            </p>
            <input
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="DELETE"
              className="w-full h-10 rounded-[10px] px-4 text-sm text-white outline-none transition"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(239,68,68,0.25)" }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowDelete(false)}
                className="h-9 px-4 rounded-lg text-sm text-white/50 hover:text-white transition"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteInput !== "DELETE" || deleting}
                className="h-9 px-4 rounded-lg text-sm text-white bg-red-600 disabled:opacity-40 transition"
              >
                {deleting ? "Deleting…" : "Confirm delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
