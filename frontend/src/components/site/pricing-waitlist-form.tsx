"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { joinWaitlist } from "@/lib/api/misc";

const schema = z.object({ email: z.email("Enter a valid email address") });
type WaitlistFormData = z.infer<typeof schema>;

export function PricingWaitlistForm() {
  const [joined, setJoined] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<WaitlistFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email }: WaitlistFormData) => {
    try {
      await joinWaitlist(email.trim());
      setJoined(true);
      toast.success("You're on the list.");
    } catch {
      toast.error("We couldn't add you right now. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="waitlist-email" className="sr-only">Email address</label>
        <input
          id="waitlist-email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "waitlist-email-error" : undefined}
          disabled={joined}
          {...register("email")}
          className="min-h-12 min-w-0 flex-1 rounded-full border border-[#38210b]/25 bg-white/75 px-4 text-sm text-[#38210b] placeholder:text-[#38210b]/55 focus:border-[#92400e] focus:outline-none focus:ring-2 focus:ring-[#92400e]/20 disabled:opacity-60"
        />
        <button type="submit" disabled={isSubmitting || joined} className="min-h-12 rounded-full bg-[#241a0f] px-6 text-sm font-semibold text-white transition hover:opacity-85 disabled:opacity-60">
          {joined ? "You're on the list" : isSubmitting ? "Joining…" : "Notify me"}
        </button>
      </div>
      {errors.email && <p id="waitlist-email-error" role="alert" className="mt-2 text-xs font-medium text-[#7c2d12]">{errors.email.message}</p>}
    </form>
  );
}
