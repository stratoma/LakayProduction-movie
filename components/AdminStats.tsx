import type { Movie, RSVP } from "@/lib/types";

export function AdminStats({ movies, rsvps }: { movies: Movie[]; rsvps: RSVP[] }) {
  const counts = movies.map((movie) => ({
    movie,
    votes: rsvps.filter((rsvp) => rsvp.movie_id === movie.id).length
  }));
  const attending = rsvps.filter((rsvp) => rsvp.attendance_status === "yes").length;
  const notAttending = rsvps.filter((rsvp) => rsvp.attendance_status === "no").length;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border-[3px] border-black bg-white p-4">
          <p className="font-display text-xl font-black uppercase">Total RSVPs</p>
          <p className="mt-2 text-5xl font-black text-lakayRed">{rsvps.length}</p>
          <p className="font-black uppercase">families</p>
        </div>
        <div className="rounded-xl border-[3px] border-black bg-lakayGreen p-4">
          <p className="font-display text-xl font-black uppercase">Coming</p>
          <p className="mt-2 text-5xl font-black">{attending}</p>
          <p className="font-black uppercase">yes</p>
        </div>
        <div className="rounded-xl border-[3px] border-black bg-white p-4">
          <p className="font-display text-xl font-black uppercase">Not Coming</p>
          <p className="mt-2 text-5xl font-black">{notAttending}</p>
          <p className="font-black uppercase">no</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {counts.map(({ movie, votes }) => (
          <div key={movie.id} className="rounded-xl border-[3px] border-black bg-white p-4">
            <p className="font-display text-xl font-black uppercase">{movie.title}</p>
            <p className="mt-2 text-4xl font-black text-lakayRed">{votes}</p>
            <p className="font-black uppercase">votes</p>
          </div>
        ))}
      </div>
    </div>
  );
}
