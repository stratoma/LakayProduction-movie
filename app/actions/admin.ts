"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  addLocalMovie,
  clearLocalRSVPs,
  deleteLocalMovie,
  updateLocalMovie,
  updateLocalRSVPStatus
} from "@/lib/local-store";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import type { Movie, RSVP } from "@/lib/types";

const localAdminEmail = process.env.ADMIN_EMAIL ?? "admin@lakay.local";
const localAdminPassword = process.env.ADMIN_PASSWORD ?? "movie-night";
const localAdminCookie = "lakay_local_admin";

async function requireAdmin() {
  if (!hasSupabaseEnv()) {
    const cookieStore = await cookies();
    if (cookieStore.get(localAdminCookie)?.value === "true") return null;
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  return supabase;
}

export async function signInAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!hasSupabaseEnv()) {
    if (email === localAdminEmail && password === localAdminPassword) {
      const cookieStore = await cookies();
      cookieStore.set(localAdminCookie, "true", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: 60 * 60 * 8
      });
      redirect("/admin");
    }
    redirect("/admin/login?message=invalid");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) redirect("/admin/login?message=invalid");
  redirect("/admin");
}

export async function signOutAdmin() {
  if (!hasSupabaseEnv()) {
    const cookieStore = await cookies();
    cookieStore.delete(localAdminCookie);
    redirect("/admin/login");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function addMovie(formData: FormData) {
  const supabase = await requireAdmin();
  if (!supabase) {
    await addLocalMovie(moviePayload(formData));
    revalidatePath("/");
    revalidatePath("/admin");
    return;
  }
  await supabase.from("movies").insert(moviePayload(formData));
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateMovie(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!supabase) {
    await updateLocalMovie(id, moviePayload(formData));
    revalidatePath("/");
    revalidatePath("/admin");
    return;
  }
  await supabase.from("movies").update(moviePayload(formData)).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteMovie(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!supabase) {
    await deleteLocalMovie(id);
    revalidatePath("/");
    revalidatePath("/admin");
    return;
  }
  await supabase.from("movies").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateRSVPStatus(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const attendance_status = String(formData.get("attendance_status") ?? "yes");
  if (!supabase) {
    await updateLocalRSVPStatus(id, attendance_status as RSVP["attendance_status"]);
    revalidatePath("/admin");
    return;
  }
  await supabase.from("rsvps").update({ attendance_status }).eq("id", id);
  revalidatePath("/admin");
}

export async function clearRSVPData() {
  const supabase = await requireAdmin();
  if (!supabase) {
    await clearLocalRSVPs();
    revalidatePath("/admin");
    return;
  }

  await supabase.from("rsvps").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  revalidatePath("/admin");
}

function moviePayload(formData: FormData): Omit<Movie, "id" | "created_at"> {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    genre: String(formData.get("genre") ?? "").trim(),
    runtime: String(formData.get("runtime") ?? "").trim(),
    rating: String(formData.get("rating") ?? "").trim(),
    poster_url: String(formData.get("poster_url") ?? "").trim() || null,
    is_active: formData.get("is_active") === "on"
  };
}
