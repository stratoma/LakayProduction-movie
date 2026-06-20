import { Clapperboard, Film, Popcorn, Sparkles, Star } from "lucide-react";

export function HeroDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-8 top-10 rotate-[-10deg] rounded-full border-4 border-black bg-lakayYellow p-5 shadow-poster">
        <Popcorn className="h-12 w-12 text-lakayRed" strokeWidth={3} />
      </div>
      <div className="absolute right-3 top-7 rotate-12 rounded-3xl border-4 border-black bg-white p-4 shadow-poster sm:right-12">
        <Clapperboard className="h-12 w-12 text-black" strokeWidth={3} />
      </div>
      <div className="absolute bottom-8 left-6 rounded-full bg-lakayTeal p-3 text-black">
        <Film className="h-9 w-9" strokeWidth={3} />
      </div>
      <Star className="absolute bottom-16 right-8 h-12 w-12 fill-lakayYellow text-black" strokeWidth={2.5} />
      <Sparkles className="absolute left-1/2 top-24 h-10 w-10 text-lakayGreen" strokeWidth={3} />
    </div>
  );
}

export function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`starburst flex min-h-28 min-w-28 items-center justify-center bg-lakayYellow p-6 text-center font-display text-sm font-black uppercase leading-tight text-black ${className}`}>
      {children}
    </div>
  );
}
