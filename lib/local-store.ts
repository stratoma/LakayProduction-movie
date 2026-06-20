import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { placeholderMovies } from "@/lib/placeholder-data";
import type { Movie, RSVP } from "@/lib/types";

type LocalDB = {
  movies: Movie[];
  rsvps: RSVP[];
};

const dbPath = path.join(process.cwd(), "data", "local-db.json");
const tmpDbPath = path.join(os.tmpdir(), "lakay-production-local-db.json");
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";

async function readDB(): Promise<LocalDB> {
  if (isVercel) {
    try {
      const raw = await fs.readFile(tmpDbPath, "utf8");
      return JSON.parse(raw) as LocalDB;
    } catch {
      // Continue to the committed seed data when no writable runtime copy exists yet.
    }
  }

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
  const payload = JSON.stringify(db, null, 2);

  try {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, payload);
    return;
  } catch {
    // Vercel's deployed filesystem is read-only except for /tmp.
  }

  try {
    await fs.mkdir(path.dirname(tmpDbPath), { recursive: true });
    await fs.writeFile(tmpDbPath, payload);
  } catch {
    // Do not let local fallback storage failures block RSVP confirmation.
  }
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

export async function clearLocalRSVPs() {
  const db = await readDB();
  db.rsvps = [];
  await writeDB(db);
}
