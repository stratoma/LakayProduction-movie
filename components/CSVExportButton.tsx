"use client";

import type { RSVP } from "@/lib/types";
import { rsvpsToCsv } from "@/lib/csv";

export function CSVExportButton({ rsvps }: { rsvps: RSVP[] }) {
  function exportCsv() {
    const blob = new Blob([rsvpsToCsv(rsvps)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "movies-on-the-lawn-rsvps.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button onClick={exportCsv} className="button-pop rounded-full bg-lakayGreen px-5 py-3 font-display text-lg font-black uppercase">
      Export CSV
    </button>
  );
}
