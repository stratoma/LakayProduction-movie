import { placeholderMovies } from "@/lib/placeholder-data";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { getLocalMovies, getLocalRSVPs } from "@/lib/local-store";
import type { Movie, RSVP } from "@/lib/types";

export async function getActiveMovies(): Promise<Movie[]> {
  if (!hasSupabaseEnv()) return getLocalMovies(true);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data?.length) return placeholderMovies;
  return data;
}

export async function getAdminMovies(): Promise<Movie[]> {
  if (!hasSupabaseEnv()) return getLocalMovies(false);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}

export async function getRSVPs(): Promise<RSVP[]> {
  if (!hasSupabaseEnv()) return getLocalRSVPs();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rsvps")
    .select("*, movies(title)")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as RSVP[];
}
