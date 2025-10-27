import { Client } from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: ".env" });

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    console.error("❌ ERROR: POSTGRES_URL environment variable is not set!");
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("🔄 Connecting to database...");
    await client.connect();
    console.log("✅ Connected successfully!");

    const schemaPath = path.join(__dirname, "../lib/db/schema.sql");

    if (!fs.existsSync(schemaPath)) {
      console.error(`❌ Schema file not found at: ${schemaPath}`);
      process.exit(1);
    }

    const schema = fs.readFileSync(schemaPath, "utf-8");
    console.log("📄 Running migration...");

    await client.query(schema);

    console.log("✅ Migration completed successfully!");
    console.log("\n📊 Tables created:");
    console.log("  - users");
    console.log("  - profiles");
    console.log("  - wallets");
    console.log("  - sessions");
    console.log("  - verification_tokens");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("\nFull error:", error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("\n🔌 Database connection closed.");
  }
}

runMigration();
