import { Badge, HeroDecorations } from "@/components/Decorations";
import { EventDetails } from "@/components/EventDetails";
import { MovieCard } from "@/components/MovieCard";
import { RSVPForm } from "@/components/RSVPForm";
import { getActiveMovies } from "@/lib/data";

export default async function Home() {
  const movies = await getActiveMovies();

  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative px-4 py-8 sm:px-6 lg:px-8">
        <HeroDecorations />
        <div className="relative mx-auto max-w-6xl">
          <div className="film-strip mb-6 h-12 rounded-full border-[3px] border-black bg-white" />
          <div className="retro-border relative overflow-hidden rounded-[2rem] bg-cream p-6 text-center sm:p-10 lg:p-14">
            <div className="absolute -right-16 bottom-8 hidden h-44 w-44 rounded-full border-[18px] border-black bg-white lg:block" />
            <div className="mx-auto inline-flex rotate-[-2deg] rounded-full border-[3px] border-black bg-lakayYellow px-5 py-2 font-black uppercase">
              Lakay Production Presents
            </div>
            <h1 className="mx-auto mt-5 max-w-4xl font-display text-5xl font-black uppercase leading-[0.9] sm:text-7xl lg:text-8xl">
              Movies on the Lawn
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-black sm:text-2xl">
              Backyard movie night, family-friendly fun, big-screen energy, and one winning movie picked by the guests.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="#rsvp" className="button-pop rounded-full bg-lakayRed px-8 py-4 font-display text-2xl font-black uppercase text-white">
                RSVP Now
              </a>
              <a href="#movies" className="button-pop rounded-full bg-lakayTeal px-8 py-4 font-display text-2xl font-black uppercase text-black">
                See Movies
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <EventDetails />
      </div>

      <section id="movies" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-black uppercase text-lakayRed">Pick the feature</p>
            <h2 className="font-display text-4xl font-black uppercase leading-none sm:text-6xl">Movie voting</h2>
          </div>
          <Badge className="self-start sm:self-auto">Vote once with your RSVP</Badge>
        </div>
        <div className="grid gap-7 md:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section id="rsvp" className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <RSVPForm movies={movies} />
      </section>
    </main>
  );
}
