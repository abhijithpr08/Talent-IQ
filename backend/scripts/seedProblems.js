import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load env and DB
import dotenv from "dotenv";
dotenv.config({ path: join(__dirname, "../.env") });

import mongoose from "mongoose";
import Problem from "../src/models/Problem.js";

const problemsPath = join(__dirname, "../../frontend/src/data/problems.js");
const { PROBLEMS } = await import(pathToFileURL(problemsPath).href);

async function seed() {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      throw new Error("DB_URL not set in .env");
    }
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");

    const existing = await Problem.countDocuments({ sessionId: null });
    if (existing > 0) {
      console.log(`Found ${existing} existing problems. Clearing global problems...`);
      await Problem.deleteMany({ sessionId: null });
    }

    const toInsert = Object.entries(PROBLEMS).map(([slug, p]) => ({
      title: p.title,
      slug: p.id || slug,
      difficulty: p.difficulty || "Easy",
      category: p.category || "",
      description: p.description || { text: "", notes: [] },
      examples: p.examples || [],
      constraints: p.constraints || [],
      starterCode: p.starterCode || { javascript: "", python: "", java: "" },
      expectedOutput: p.expectedOutput || { javascript: "", python: "", java: "" },
      sessionId: null,
    }));

    const result = await Problem.insertMany(toInsert);
    console.log(`Seeded ${result.length} problems`);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
