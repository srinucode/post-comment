import dotenv from "dotenv";
dotenv.config(); // Must be at the very top

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import commentRoutes from "./routes/comment.routes";
import { connectRabbitMQ } from "./messaging/rabbit";
import { consumePostEvents } from "./subscribers/commentEventConsumer"; // <-- subscriber
import { setupSwagger } from "./config/swagger";

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/comments", commentRoutes);

// Swagger
setupSwagger(app);

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI || "";

/**
 * Start Server
 */
async function startServer() {
  try {
    // MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas via Mongoose");

    // RabbitMQ
    await connectRabbitMQ();
    await consumePostEvents(); // <-- start listening for POST_DELETED events

    // Express
    app.listen(PORT, () => {
      console.log(`🚀 Comment service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
}

startServer();
