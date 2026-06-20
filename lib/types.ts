export type Movie = {
  id: string;
  title: string;
  description: string;
  genre: string;
  runtime: string;
  rating: string;
  poster_url: string | null;
  is_active: boolean;
  created_at?: string;
};

export type RSVP = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  guest_count: number;
  attendance_status: "yes" | "no" | "maybe";
  movie_id: string | null;
  message: string | null;
  created_at: string;
  movies?: Pick<Movie, "title"> | null;
};

export type RSVPFormState = {
  ok: boolean;
  message: string;
};
