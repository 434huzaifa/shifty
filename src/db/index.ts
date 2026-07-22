import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// Disable prefetch for serverless environments / Next.js live reload
const queryClient = postgres(connectionString, { max: 1 });
export const db = drizzle(queryClient, { schema });
