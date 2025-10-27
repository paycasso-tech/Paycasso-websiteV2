import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    if (!process.env.POSTGRES_URL) {
      throw new Error("POSTGRES_URL environment variable is not set");
    }

    pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
      max: 20, // Maximum connections in pool
      idleTimeoutMillis: 30000, // Close idle connections after 30s
      connectionTimeoutMillis: 10000, // Timeout after 10s
    });

    // Handle pool errors
    pool.on("error", (err) => {
      console.error("Unexpected PostgreSQL pool error:", err);
    });

    console.log("✅ PostgreSQL connection pool created");
  }
  return pool;
}

// Helper function to run queries with proper error handling
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const client = getPool();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Close pool on app shutdown (optional, for graceful shutdown)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log("PostgreSQL connection pool closed");
  }
}
