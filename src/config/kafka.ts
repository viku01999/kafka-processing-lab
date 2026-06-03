import { Kafka } from "kafkajs";


export const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["xxx.xxx.xx.xx:9092"]
});