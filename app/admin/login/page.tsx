import { signInAdmin } from "@/app/actions/admin";

export default async function AdminLogin({
  searchParams
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  const messages: Record<string, string> = {
    invalid: "That email or password did not work.",
    env: "Add your Supabase environment variables before logging in."
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <form action={signInAdmin} className="retro-border w-full max-w-md rounded-2xl bg-white p-6">
        <p className="font-black uppercase text-lakayRed">Admin</p>
        <h1 className="font-display text-4xl font-black uppercase">Movie night login</h1>
        {params.message ? (
          <p className="mt-4 rounded-lg border-[3px] border-black bg-lakayYellow p-3 font-bold">
            {messages[params.message] ?? "Please sign in."}
          </p>
        ) : null}
        <p className="mt-4 rounded-lg border-[3px] border-black bg-lakayTeal/30 p-3 text-sm font-bold">
          Local login: admin@lakay.local / movie-night
        </p>
        <label className="mt-5 block">
          <span className="text-sm font-black uppercase">Email</span>
          <input required type="email" name="email" className="mt-2 w-full rounded-xl border-[3px] border-black px-4 py-3 font-bold" />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-black uppercase">Password</span>
          <input required type="password" name="password" className="mt-2 w-full rounded-xl border-[3px] border-black px-4 py-3 font-bold" />
        </label>
        <button className="button-pop mt-6 w-full rounded-full bg-lakayRed px-6 py-3 font-display text-xl font-black uppercase text-white">
          Sign in
        </button>
      </form>
    </main>
  );
}
