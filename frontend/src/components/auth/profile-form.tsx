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
        <div className="logo-grad shadow-amber h-16 w-16 rounded-full flex items-center justify-center font-bold text-xl">
          {user?.avatar_initials || "??"}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-[12px] font-medium text-white/40 mb-2">Full name</label>
          <input
            {...register("full_name")}
            className="input-glass w-full px-4 py-3 text-[14px]"
          />
          {errors.full_name && <p className="mt-1.5 text-xs text-red-400">{errors.full_name.message}</p>}
        </div>

        <div>
          <label className="block text-[12px] font-medium text-white/40 mb-2">Email</label>
          <div className="flex items-center gap-3">
            <input
              value={user?.email || ""}
              readOnly
              className="flex-1 px-4 py-3 rounded-btn-md text-[14px] text-white/[0.28] cursor-not-allowed outline-none bg-white/[0.03] border border-white/[0.06]"
            />
            <span className="badge-verified">Verified</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-btn-md text-[14px] font-bold bg-white text-black disabled:opacity-50 transition hover:opacity-90"
        >
          {isSubmitting ? "Saving…" : "Save changes"}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="mt-10 pt-8 border-t-system">
        <h2 className="text-[16px] font-bold text-red-400 mb-2">Danger Zone</h2>
        <p className="text-[13px] text-white/30 leading-relaxed mb-5">
          Deleting your account permanently removes all your documents, conversations, and data.
        </p>

        {!showDelete ? (
          <button onClick={() => setShowDelete(true)} className="btn-danger">
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
              className="input-glass w-full h-10 px-4 text-sm border-red-500/25"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowDelete(false)}
                className="h-9 px-4 rounded-lg text-sm text-white/50 hover:text-white transition bg-white/[0.04] border-system"
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
