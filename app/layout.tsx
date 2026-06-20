import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lakay Production | Movies on the Lawn",
  description: "RSVP and vote for Lakay Production Movies on the Lawn.",
  openGraph: {
    title: "Lakay Production | Movies on the Lawn",
    description: "Bring your chair, snacks, and good vibes.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
