"use server";

import { redirect } from "next/navigation";
import { addLocalRSVP } from "@/lib/local-store";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

export async function submitRSVP(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || "not-provided@local.rsvp";
  const phone = String(formData.get("phone") ?? "").trim() || "Not provided";
  const guestCount = Number(formData.get("guest_count") ?? 1);
  const attendanceStatus = String(formData.get("attendance_status") ?? "yes");
  const movieId = String(formData.get("movie_id") ?? "") || null;
  const message = String(formData.get("message") ?? "").trim() || null;

  if (!fullName || !attendanceStatus || !movieId) {
    redirect("/rsvp/confirmation?status=missing");
  }

  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    const { error } = await supabase.from("rsvps").insert({
      full_name: fullName,
      email,
      phone,
      guest_count: Number.isFinite(guestCount) ? guestCount : 1,
      attendance_status: attendanceStatus,
      movie_id: movieId?.startsWith("placeholder-") ? null : movieId,
      message
    });

    if (error) {
      redirect("/rsvp/confirmation?status=error");
    }
  } else {
    await addLocalRSVP({
      full_name: fullName,
      email,
      phone,
      guest_count: Number.isFinite(guestCount) ? guestCount : 1,
      attendance_status: attendanceStatus as "yes" | "no" | "maybe",
      movie_id: movieId,
      message
    });
  }

  redirect("/rsvp/confirmation");
}
