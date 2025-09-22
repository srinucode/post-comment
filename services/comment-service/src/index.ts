import express from "express";
import bodyParser from "body-parser";
import commentRoutes from "./routes/comment.routes";
import { connectRabbitMQ } from "./messaging/rabbit";

const app = express();
app.use(bodyParser.json());
app.use("/api/comments", commentRoutes);

const PORT = 3002;
app.listen(PORT, async () => {
  await connectRabbitMQ();
  console.log(`📌 Comment-Service running at http://localhost:${PORT}`);
});
