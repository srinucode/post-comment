import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import postRoutes from "./routes/post.routes";
import { connectRabbitMQ } from "./messaging/rabbit";
import { setupSwagger } from "./config/swagger";
import mongoose from "mongoose";
dotenv.config();   // Must be at the very top



connectRabbitMQ();

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/posts", postRoutes);

// Swagger
setupSwagger(app);

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "";
console.log("MONGO_URI:", MONGO_URI); // <-- log the URI to verify it's being read

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI); // <-- connect Mongoose here
    console.log("✅ Connected to MongoDB Atlas via Mongoose");

    app.listen(PORT, () => {
      console.log(`🚀 Post service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

startServer();


