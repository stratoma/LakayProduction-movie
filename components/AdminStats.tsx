import type { Movie, RSVP } from "@/lib/types";

export function AdminStats({ movies, rsvps }: { movies: Movie[]; rsvps: RSVP[] }) {
  const counts = movies.map((movie) => ({
    movie,
    votes: rsvps.filter((rsvp) => rsvp.movie_id === movie.id).length
  }));

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {counts.map(({ movie, votes }) => (
        <div key={movie.id} className="rounded-xl border-[3px] border-black bg-white p-4">
          <p className="font-display text-xl font-black uppercase">{movie.title}</p>
          <p className="mt-2 text-4xl font-black text-lakayRed">{votes}</p>
          <p className="font-black uppercase">votes</p>
        </div>
      ))}
    </div>
  );
}
