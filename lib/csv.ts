import type { RSVP } from "@/lib/types";

function clean(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export function rsvpsToCsv(rsvps: RSVP[]) {
  const rows = [
    [
      "Full name",
      "Email",
      "Phone",
      "Guests",
      "Attendance",
      "Movie vote",
      "Message",
      "Submitted"
    ],
    ...rsvps.map((rsvp) => [
      rsvp.full_name,
      rsvp.email,
      rsvp.phone,
      rsvp.guest_count,
      rsvp.attendance_status,
      rsvp.movies?.title ?? "",
      rsvp.message ?? "",
      rsvp.created_at
    ])
  ];

  return rows.map((row) => row.map(clean).join(",")).join("\n");
}
