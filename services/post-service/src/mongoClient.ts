import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // Load variables from .env

const uri = process.env.MONGODB_URI as string;
console.log("MongoDB URI:", uri);

if (!uri) {
  throw new Error("❌ MONGODB_URI not found in .env file");
}

let client: MongoClient;
let db: Db;

export async function connectToDatabase(): Promise<Db> {
  if (db) return db;

  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");

    db = client.db("posts"); // Connect to "posts" database
    return db;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

export async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    console.log("🔌 MongoDB connection closed");
  }
}
