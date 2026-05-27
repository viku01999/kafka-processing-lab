// ===============================
// PRODUCER
// ===============================

import { kafka } from "./config/kafka";

/**
 * Kafka Producer
 *
 * Producer pushes messages/events into Kafka topic.
 *
 * In real systems:
 * - order service
 * - payment service
 * - inventory service
 *
 * all produce events into Kafka.
 */
const producer = kafka.producer({

  /**
   * Prevent duplicate messages during retries.
   *
   * Example:
   * If network fails after sending,
   * producer may retry.
   *
   * Idempotent producer ensures
   * Kafka stores message only once.
   */
  idempotent: true,

  /**
   * Retry sending message if broker temporarily fails.
   *
   * Helps during:
   * - broker restart
   * - network glitch
   * - temporary timeout
   */
  retry: {
    retries: 5,
  },
});

async function runProducer() {

  /**
   * Connect producer to Kafka broker.
   */
  await producer.connect();

  let i = 0;

  /**
   * Infinite loop to continuously
   * generate events/messages.
   */
  while (true) {

    i++;

    /**
     * Example event payload.
     */
    const order = {
      order_id: i,
      amount: 100,
      status: "NEW",
      timestamp: Date.now(),
    };

    try {

      /**
       * Send message to Kafka topic.
       */
      await producer.send({

        /**
         * Kafka topic name.
         *
         * Topic stores stream of events.
         */
        topic: "stress-topic",

        /**
         * acks = -1
         *
         * Wait for ALL Kafka replicas
         * to acknowledge write.
         *
         * Gives maximum durability.
         */
        acks: -1,

        /**
         * Array of Kafka messages.
         */
        messages: [
          {

            /**
             * Kafka stores bytes internally.
             *
             * Convert object -> JSON string.
             */
            value: JSON.stringify(order),
          },
        ],
      });

      console.log(`PRODUCED ${i}`);

      /**
       * Small delay.
       *
       * Prevents flooding broker
       * with millions of requests instantly.
       */
      await sleep(1000);

    } catch (error) {

      /**
       * Producer send failure.
       *
       * Common reasons:
       * - broker unavailable
       * - timeout
       * - network issue
       */
      console.error("PRODUCER ERROR:", error);

      /**
       * Wait before retrying.
       *
       * Prevents retry storm.
       */
      await sleep(2000);
    }
  }
}

/**
 * Utility function to simulate delay.
 */
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Start producer process.
 */
runProducer().catch(console.error);
