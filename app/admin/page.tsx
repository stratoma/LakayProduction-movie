import { redirect } from "next/navigation";
import { deleteMovie, signOutAdmin, updateRSVPStatus } from "@/app/actions/admin";
import { AdminMovieForm } from "@/components/AdminMovieForm";
import { AdminStats } from "@/components/AdminStats";
import { CSVExportButton } from "@/components/CSVExportButton";
import { getAdminMovies, getRSVPs } from "@/lib/data";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function AdminPage() {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) redirect("/admin/login");
  } else {
    const cookieStore = await cookies();
    if (cookieStore.get("lakay_local_admin")?.value !== "true") redirect("/admin/login");
  }

  const [movies, rsvps] = await Promise.all([getAdminMovies(), getRSVPs()]);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black uppercase text-lakayRed">Lakay Production</p>
            <h1 className="font-display text-4xl font-black uppercase sm:text-6xl">Admin dashboard</h1>
          </div>
          <form action={signOutAdmin}>
            <button className="button-pop rounded-full bg-white px-5 py-3 font-display text-lg font-black uppercase">
              Sign out
            </button>
          </form>
        </header>

        <section className="retro-border rounded-2xl bg-lakayYellow p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-3xl font-black uppercase">Vote count</h2>
            <CSVExportButton rsvps={rsvps} />
          </div>
          <AdminStats movies={movies} rsvps={rsvps} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="retro-border rounded-2xl bg-white p-5">
            <h2 className="font-display text-3xl font-black uppercase">Add movie</h2>
            <div className="mt-4">
              <AdminMovieForm />
            </div>
          </div>

          <div className="retro-border rounded-2xl bg-white p-5">
            <h2 className="font-display text-3xl font-black uppercase">Edit movies</h2>
            <div className="mt-4 grid gap-4">
              {movies.map((movie) => (
                <div key={movie.id} className="rounded-xl border-[3px] border-black bg-lakayTeal/20 p-3">
                  <AdminMovieForm movie={movie} />
                  <form action={deleteMovie} className="mt-2">
                    <input type="hidden" name="id" value={movie.id} />
                    <button className="rounded-full border-[3px] border-black bg-white px-4 py-2 font-black uppercase text-lakayRed">
                      Delete movie
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="retro-border mt-8 overflow-hidden rounded-2xl bg-white p-5">
          <h2 className="font-display text-3xl font-black uppercase">RSVP list</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[920px] w-full border-separate border-spacing-0 text-left">
              <thead>
                <tr className="bg-black text-white">
                  {["Name", "Email", "Phone", "Guests", "Status", "Movie", "Message", "Submitted"].map((heading) => (
                    <th key={heading} className="p-3 text-sm font-black uppercase">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="border-b border-black odd:bg-cream">
                    <td className="p-3 font-bold">{rsvp.full_name}</td>
                    <td className="p-3">{rsvp.email}</td>
                    <td className="p-3">{rsvp.phone}</td>
                    <td className="p-3">{rsvp.guest_count}</td>
                    <td className="p-3">
                      <form action={updateRSVPStatus} className="flex gap-2">
                        <input type="hidden" name="id" value={rsvp.id} />
                        <select name="attendance_status" defaultValue={rsvp.attendance_status} className="rounded-lg border-2 border-black px-2 py-1 font-bold">
                          <option value="yes">yes</option>
                          <option value="maybe">maybe</option>
                          <option value="no">no</option>
                        </select>
                        <button className="rounded-lg border-2 border-black bg-lakayYellow px-2 py-1 font-black">Save</button>
                      </form>
                    </td>
                    <td className="p-3">{rsvp.movies?.title ?? "No vote"}</td>
                    <td className="max-w-64 p-3">{rsvp.message}</td>
                    <td className="p-3">{new Date(rsvp.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
