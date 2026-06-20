import { promises as fs } from "fs";
import path from "path";
import { placeholderMovies } from "@/lib/placeholder-data";
import type { Movie, RSVP } from "@/lib/types";

type LocalDB = {
  movies: Movie[];
  rsvps: RSVP[];
};

const dbPath = path.join(process.cwd(), "data", "local-db.json");

async function readDB(): Promise<LocalDB> {
  try {
    const raw = await fs.readFile(dbPath, "utf8");
    return JSON.parse(raw) as LocalDB;
  } catch {
    const initial = { movies: placeholderMovies, rsvps: [] };
    await writeDB(initial);
    return initial;
  }
}

async function writeDB(db: LocalDB) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

export async function getLocalMovies(activeOnly = false) {
  const db = await readDB();
  return activeOnly ? db.movies.filter((movie) => movie.is_active) : db.movies;
}

export async function getLocalRSVPs() {
  const db = await readDB();
  return db.rsvps.map((rsvp) => ({
    ...rsvp,
    movies: db.movies.find((movie) => movie.id === rsvp.movie_id) ?? null
  }));
}

export async function addLocalRSVP(input: Omit<RSVP, "id" | "created_at" | "movies">) {
  const db = await readDB();
  db.rsvps.unshift({
    ...input,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString()
  });
  await writeDB(db);
}

export async function addLocalMovie(input: Omit<Movie, "id" | "created_at">) {
  const db = await readDB();
  db.movies.unshift({
    ...input,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString()
  });
  await writeDB(db);
}

export async function updateLocalMovie(id: string, input: Omit<Movie, "id" | "created_at">) {
  const db = await readDB();
  db.movies = db.movies.map((movie) => (movie.id === id ? { ...movie, ...input } : movie));
  await writeDB(db);
}

export async function deleteLocalMovie(id: string) {
  const db = await readDB();
  db.movies = db.movies.filter((movie) => movie.id !== id);
  db.rsvps = db.rsvps.map((rsvp) => (rsvp.movie_id === id ? { ...rsvp, movie_id: null } : rsvp));
  await writeDB(db);
}

export async function updateLocalRSVPStatus(id: string, attendance_status: RSVP["attendance_status"]) {
  const db = await readDB();
  db.rsvps = db.rsvps.map((rsvp) => (rsvp.id === id ? { ...rsvp, attendance_status } : rsvp));
  await writeDB(db);
}
