import Image from "next/image";

export function MoviePoster({ title, src }: { title: string; src?: string | null }) {
  if (src) {
    return (
      <div className="relative aspect-[2/3] overflow-hidden rounded-md border-[3px] border-black bg-white">
        <Image src={src} alt={`${title} poster`} fill className="object-cover" sizes="(min-width: 768px) 280px, 80vw" />
      </div>
    );
  }

  return (
    <div className="relative flex aspect-[2/3] overflow-hidden rounded-md border-[3px] border-black bg-lakayTeal p-4">
      <div className="absolute inset-x-0 top-0 h-7 bg-[repeating-linear-gradient(90deg,#000_0_12px,#fff_12px_22px)]" />
      <div className="absolute inset-x-0 bottom-0 h-7 bg-[repeating-linear-gradient(90deg,#000_0_12px,#fff_12px_22px)]" />
      <div className="m-auto rounded-full border-[3px] border-black bg-lakayYellow p-5 text-center shadow-button">
        <div className="text-xs font-black uppercase">Feature Pick</div>
        <div className="mt-2 font-display text-2xl font-black leading-none">{title}</div>
      </div>
    </div>
  );
}
