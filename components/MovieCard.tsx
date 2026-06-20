import type { Movie } from "@/lib/types";
import { MoviePoster } from "@/components/MoviePoster";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <article className="retro-border flex h-full flex-col rounded-xl bg-white p-4">
      <MoviePoster title={movie.title} src={movie.poster_url} />
      <div className="flex flex-1 flex-col pt-5">
        <h3 className="font-display text-2xl font-black uppercase leading-none">{movie.title}</h3>
        <p className="mt-3 flex-1 text-sm font-bold leading-6 text-black/75">{movie.description}</p>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-black uppercase">
          <div className="rounded-lg border-2 border-black bg-lakayYellow p-2">
            <dt>Genre</dt>
            <dd className="mt-1 normal-case">{movie.genre}</dd>
          </div>
          <div className="rounded-lg border-2 border-black bg-lakayGreen p-2">
            <dt>Time</dt>
            <dd className="mt-1 normal-case">{movie.runtime}</dd>
          </div>
          <div className="rounded-lg border-2 border-black bg-lakayTeal p-2">
            <dt>Rated</dt>
            <dd className="mt-1 normal-case">{movie.rating}</dd>
          </div>
        </dl>
        <a
          href="#rsvp"
          data-movie-vote={movie.id}
          className="button-pop mt-5 rounded-full bg-lakayRed px-5 py-3 text-center font-display text-lg font-black uppercase text-white"
        >
          Vote for this
        </a>
      </div>
    </article>
  );
}
