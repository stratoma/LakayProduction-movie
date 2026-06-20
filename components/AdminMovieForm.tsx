"use client";

import { useState, useTransition } from "react";
import { Upload } from "lucide-react";
import { addMovie, updateMovie } from "@/app/actions/admin";
import { createClient } from "@/lib/supabase/client";
import type { Movie } from "@/lib/types";

export function AdminMovieForm({ movie }: { movie?: Movie }) {
  const [posterUrl, setPosterUrl] = useState(movie?.poster_url ?? "");
  const [uploading, startUpload] = useTransition();
  const action = movie ? updateMovie : addMovie;

  function handleUpload(file: File | undefined) {
    if (!file) return;
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      alert("Poster upload needs Supabase. For local edits, paste a poster image URL in the Poster URL field.");
      return;
    }
    startUpload(async () => {
      const supabase = createClient();
      const extension = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from("movie-posters").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false
      });

      if (error) {
        alert(error.message);
        return;
      }

      const { data } = supabase.storage.from("movie-posters").getPublicUrl(fileName);
      setPosterUrl(data.publicUrl);
    });
  }

  return (
    <form action={action} className="rounded-xl border-[3px] border-black bg-cream p-4">
      {movie ? <input type="hidden" name="id" value={movie.id} /> : null}
      <input type="hidden" name="poster_url" value={posterUrl} />
      <div className="grid gap-3 md:grid-cols-2">
        <input required name="title" defaultValue={movie?.title} placeholder="Movie title" className="rounded-lg border-[3px] border-black px-3 py-2 font-bold" />
        <input required name="genre" defaultValue={movie?.genre} placeholder="Genre" className="rounded-lg border-[3px] border-black px-3 py-2 font-bold" />
        <input required name="runtime" defaultValue={movie?.runtime} placeholder="Runtime" className="rounded-lg border-[3px] border-black px-3 py-2 font-bold" />
        <input required name="rating" defaultValue={movie?.rating} placeholder="Age rating" className="rounded-lg border-[3px] border-black px-3 py-2 font-bold" />
      </div>
      <textarea required name="description" defaultValue={movie?.description} placeholder="Short description" rows={3} className="mt-3 w-full rounded-lg border-[3px] border-black px-3 py-2 font-bold" />
      <input
        value={posterUrl}
        onChange={(event) => setPosterUrl(event.target.value)}
        placeholder="Poster URL"
        className="mt-3 w-full rounded-lg border-[3px] border-black px-3 py-2 font-bold"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="button-pop inline-flex cursor-pointer items-center gap-2 rounded-full bg-lakayTeal px-4 py-2 font-black uppercase">
          <Upload className="h-5 w-5" />
          {uploading ? "Uploading..." : "Upload poster"}
          <input type="file" accept="image/*" className="sr-only" onChange={(event) => handleUpload(event.target.files?.[0])} />
        </label>
        <label className="flex items-center gap-2 font-black uppercase">
          <input name="is_active" type="checkbox" defaultChecked={movie?.is_active ?? true} className="h-5 w-5 accent-lakayRed" />
          Active
        </label>
        {posterUrl ? <span className="max-w-full truncate text-sm font-bold text-black/70">Poster ready</span> : null}
      </div>
      <button className="button-pop mt-4 rounded-full bg-lakayRed px-5 py-3 font-display text-lg font-black uppercase text-white">
        {movie ? "Save movie" : "Add movie"}
      </button>
    </form>
  );
}
