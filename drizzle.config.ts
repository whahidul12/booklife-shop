import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Point to all feature schemas so drizzle-kit can discover every table
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Use the direct (non-pooled) URL for migrations
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
  },
  // Emit verbose SQL diff when generating migrations
  verbose: true,
  strict: true,
});
