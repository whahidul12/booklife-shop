/**
 * Neon serverless Postgres connection via HTTP driver.
 * The HTTP driver is optimal for serverless/edge environments —
 * each query is an independent HTTP request (no persistent TCP socket).
 *
 * Use `db` everywhere in Server Actions and Route Handlers.
 * For migrations, drizzle-kit uses DIRECT_URL via drizzle.config.ts.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql, schema });
