const details = [
  ["Date", "Friday, June 26, 2026"],
  ["Time", "7:30 PM"],
  ["Location", "Chez Les Louis"],
  ["NB", "BYO Beverage / Blanket"]
];

export function EventDetails() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {details.map(([label, value], index) => (
        <div
          key={label}
          className={`retro-border rounded-xl p-5 ${
            ["bg-lakayYellow", "bg-lakayTeal", "bg-lakayGreen", "bg-white"][index]
          }`}
        >
          <p className="text-sm font-black uppercase tracking-wide">{label}</p>
          <p className="mt-2 font-display text-2xl font-black leading-tight">{value}</p>
        </div>
      ))}
    </section>
  );
}
