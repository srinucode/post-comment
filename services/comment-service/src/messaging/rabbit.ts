import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost"); // default RabbitMQ URL
    channel = await connection.createChannel();
    console.log("✅ Connected to RabbitMQ");
  } catch (err) {
    console.error("RabbitMQ connection error:", err);
  }
};

export const getChannel = () => channel;
