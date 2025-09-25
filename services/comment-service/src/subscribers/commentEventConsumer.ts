import {getChannel} from "../messaging/rabbit";
import { deleteCommentsByPostId } from "../services/commentService";


export const consumePostEvents = async () => {
    console.log("Starting to consume post events...");
  const channel = getChannel();
  if (!channel) {
    console.error("RabbitMQ channel not available");
    return;
  }

  await channel.assertExchange("post_events", "fanout", { durable: false });
  const q = await channel.assertQueue("", { exclusive: true });

  channel.bindQueue(q.queue, "post_events", "");

  console.log("[Comment Service] Waiting for POST_DELETED events...");
  channel.consume(
    q.queue,
    async (msg) => {
      if (!msg) return;
       console.log("[Comment Service] Message received from RabbitMQ");
      try {
        const event = JSON.parse(msg.content.toString());
        console.log("[Comment Service] Parsed event:", event);

        if (event.event === "POST_DELETED") {
          console.log(`[Comment Service] Post deleted: ${event.postId}`);
          await deleteCommentsByPostId(event.postId);
        }
      } catch (error) {
        console.error("Error processing post event", error);
      }
    },
    { noAck: true }
  );
};
