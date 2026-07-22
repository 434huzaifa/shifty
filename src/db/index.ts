import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Lazy database initialization - only creates connection when accessed
let _db: ReturnType<typeof drizzle> | undefined;

export function getDb() {
  if (_db) return _db;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in environment variables");
  }

  // Singleton pattern for hot-reload safety
  const globalForDb = globalThis as unknown as {
    _queryClient: ReturnType<typeof postgres> | undefined;
    _db: ReturnType<typeof drizzle> | undefined;
  };

  const queryClient = globalForDb._queryClient ?? postgres(connectionString, { max: 1 });

  _db = globalForDb._db ?? drizzle(queryClient, { schema });

  // Cache in globalThis for hot-reload
  if (process.env.NODE_ENV !== "production") {
    globalForDb._queryClient = queryClient;
    globalForDb._db = _db;
  }

  return _db;
}

// For backward compatibility
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    return Reflect.get(getDb(), prop);
  },
});
