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
      <h1 className="text-xl font-bold mb-6">Profile</h1>

      <div className="mb-6">
        <p className="text-xs font-semibold text-muted mb-2">Avatar</p>
        <div className="logo-grad h-14 w-14 rounded-full flex items-center justify-center font-bold text-lg">
          {user?.avatar_initials || "??"}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
        <div>
          <label className="block text-xs font-semibold text-muted mb-1.5">Full name</label>
          <input {...register("full_name")}
            className="w-full h-11 rounded-[10px] bg-white/[0.05] border border-white/[0.08] px-4 text-sm text-white outline-none focus:border-primary/50 transition" />
          {errors.full_name && <p className="mt-1 text-xs text-red-400">{errors.full_name.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1.5">Email</label>
          <div className="flex items-center gap-2">
            <input value={user?.email || ""} readOnly
              className="flex-1 h-11 rounded-[10px] bg-white/[0.03] border border-white/[0.06] px-4 text-sm text-faint cursor-not-allowed" />
            <span className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
              Verified
            </span>
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary !h-10 !py-0 !rounded-[10px] disabled:opacity-50">
          {isSubmitting ? "Saving…" : "Save changes"}
        </button>
      </form>

      <div className="mt-10 pt-8 border-t-system">
        <h2 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h2>
        <p className="text-xs text-faint mb-4">
          Deleting your account permanently removes all your documents, conversations, and data.
        </p>
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)}
            className="h-9 px-4 rounded-[8px] text-sm text-red-400 transition"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)" }}>
            Delete my account
          </button>
        ) : (
          <div className="space-y-3 max-w-sm">
            <p className="text-xs text-muted">
              Type <span className="font-mono text-white">DELETE</span> to confirm.
            </p>
            <input value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} placeholder="DELETE"
              className="w-full h-10 rounded-[10px] bg-white/[0.05] px-4 text-sm text-white outline-none transition"
              style={{ border: "1px solid rgba(239,68,68,0.25)" }} />
            <div className="flex gap-2">
              <button onClick={() => setShowDelete(false)}
                className="h-9 px-4 rounded-[8px] text-sm text-muted hover:text-white border-system bg-white/[0.04] transition">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleteInput !== "DELETE" || deleting}
                className="h-9 px-4 rounded-[8px] text-sm text-white transition disabled:opacity-40"
                style={{ background: "#dc2626" }}>
                {deleting ? "Deleting…" : "Confirm delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
