import express from "express";
import bodyParser from "body-parser";
import postRoutes from "./routes/post.routes";
import { connectRabbitMQ } from "./messaging/rabbit";

connectRabbitMQ();


const app = express();
app.use(bodyParser.json());

app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Post service running on port ${PORT}`);
});
