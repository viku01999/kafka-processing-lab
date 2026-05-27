import { Kafka } from "kafkajs";


export const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["192.168.29.13:9092"]
});