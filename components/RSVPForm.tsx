"use client";

import { useEffect, useMemo, useState } from "react";
import type { Movie } from "@/lib/types";
import { submitRSVP } from "@/app/actions/rsvp";

export function RSVPForm({ movies }: { movies: Movie[] }) {
  const [selectedMovie, setSelectedMovie] = useState(movies[0]?.id ?? "");

  const movieOptions = useMemo(() => movies.filter((movie) => movie.is_active), [movies]);

  useEffect(() => {
    const voteButtons = document.querySelectorAll<HTMLAnchorElement>("[data-movie-vote]");
    const onVote = (event: Event) => {
      event.preventDefault();
      const target = event.currentTarget as HTMLAnchorElement;
      const movieId = target.dataset.movieVote;
      if (movieId) setSelectedMovie(movieId);
      document.querySelector("#rsvp")?.scrollIntoView({ behavior: "smooth" });
    };

    voteButtons.forEach((button) => button.addEventListener("click", onVote));
    return () => voteButtons.forEach((button) => button.removeEventListener("click", onVote));
  }, []);

  return (
    <form action={submitRSVP} className="retro-border rounded-2xl bg-white p-5 sm:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-black uppercase text-lakayRed">RSVP & vote</p>
          <h2 className="font-display text-4xl font-black uppercase leading-none sm:text-5xl">Family check-in</h2>
        </div>
        <div className="rounded-full border-[3px] border-black bg-lakayYellow px-4 py-2 font-black uppercase">
          One vote per RSVP
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-black uppercase">Family name</span>
        <input
          required
          name="full_name"
          placeholder="The Louis Family"
          className="mt-2 w-full rounded-xl border-[3px] border-black px-4 py-4 text-xl font-bold outline-none focus:bg-lakayYellow/25"
        />
      </label>

      <fieldset className="mt-5">
        <legend className="text-sm font-black uppercase">Are you coming?</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {["yes", "no"].map((status) => (
            <label key={status} className="flex cursor-pointer items-center gap-3 rounded-xl border-[3px] border-black bg-cream px-4 py-3 font-display text-xl font-black uppercase">
              <input required type="radio" name="attendance_status" value={status} defaultChecked={status === "yes"} className="h-5 w-5 accent-lakayRed" />
              {status}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-5 block">
        <span className="text-sm font-black uppercase">Movie vote</span>
        <select
          required
          name="movie_id"
          value={selectedMovie}
          onChange={(event) => setSelectedMovie(event.target.value)}
          className="mt-2 w-full rounded-xl border-[3px] border-black bg-white px-4 py-3 text-lg font-black outline-none focus:bg-lakayYellow/25"
        >
          {movieOptions.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>
      </label>

      <button className="button-pop mt-6 w-full rounded-full bg-lakayRed px-7 py-4 font-display text-2xl font-black uppercase text-white sm:w-auto">
        Submit RSVP
      </button>
    </form>
  );
}
