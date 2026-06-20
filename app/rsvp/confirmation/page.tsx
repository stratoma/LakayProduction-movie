import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function Confirmation({
  searchParams
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const isError = params.status === "error" || params.status === "missing";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="retro-border max-w-2xl rounded-[2rem] bg-white p-8 text-center sm:p-12">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-black bg-lakayGreen">
          <CheckCircle2 className="h-14 w-14" strokeWidth={3} />
        </div>
        <p className="mt-6 font-black uppercase text-lakayRed">Lakay Production</p>
        <h1 className="mt-2 font-display text-4xl font-black uppercase leading-none sm:text-6xl">
          {isError ? "Almost there" : "You're on the list"}
        </h1>
        <p className="mt-5 text-xl font-bold leading-8">
          {isError
            ? "Something was missing or could not be saved. Please head back and try again."
            : "You're on the list. Bring your chair, snacks, and good vibes."}
        </p>
        <Link href="/#rsvp" className="button-pop mt-8 inline-block rounded-full bg-lakayRed px-8 py-4 font-display text-xl font-black uppercase text-white">
          {isError ? "Back to RSVP" : "Back to event"}
        </Link>
      </section>
    </main>
  );
}
