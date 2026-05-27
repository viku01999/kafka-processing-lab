// ===============================
// CONSUMER
// ===============================

import { kafka } from "./config/kafka";

/**
 * Kafka Consumer
 *
 * Consumer reads messages from Kafka topic.
 *
 * Important concepts here:
 * - offsets
 * - heartbeats
 * - rebalancing
 * - manual commits
 */
const consumer = kafka.consumer({

    /**
     * Consumer group name.
     *
     * Kafka tracks offsets per group.
     *
     * Multiple consumers with same groupId
     * share partitions automatically.
     */
    groupId: "order-service",

    /**
     * Maximum time Kafka waits before
     * considering consumer DEAD.
     *
     * If no heartbeat within 15 sec:
     * Kafka removes consumer from group.
     */
    sessionTimeout: 15000,

    /**
     * Consumer sends heartbeat every 5 sec.
     *
     * Heartbeat tells Kafka:
     * "I am alive and processing."
     */
    heartbeatInterval: 5000,

    /**
     * Time allowed for partition rebalance.
     *
     * Rebalance happens when:
     * - consumer joins
     * - consumer leaves
     * - crash occurs
     */
    rebalanceTimeout: 60000,
});

async function runConsumer() {

    /**
     * Connect consumer to Kafka broker.
     */
    await consumer.connect();

    /**
     * Subscribe to Kafka topic.
     *
     * fromBeginning=true means:
     *
     * If offset not found,
     * start from earliest message.
     */
    await consumer.subscribe({
        topic: "stress-topic",
        fromBeginning: true,
    });

    console.log("Consumer started");

    await consumer.run({

        /**
         * Disable automatic offset commit.
         *
         * WHY?
         *
         * Auto commit can commit offset
         * BEFORE message processing finishes.
         *
         * If app crashes:
         * message may be LOST forever.
         *
         * Manual commit is safer.
         */
        autoCommit: false,

        /**
         * Disable automatic batch resolution.
         *
         * We manually resolve offsets
         * after successful processing.
         */
        eachBatchAutoResolve: false,

        /**
         * Batch processing mode.
         *
         * Better than eachMessage because:
         *
         * - better performance
         * - heartbeat control
         * - offset control
         * - lower rebalance risk
         */
        eachBatch: async ({
            batch,
            resolveOffset,
            heartbeat,
            commitOffsetsIfNecessary,
            isRunning,
            isStale,
        }) => {

            /**
             * Iterate through messages in batch.
             */
            for (const message of batch.messages) {

                /**
                 * Stop processing if:
                 *
                 * - consumer shutting down
                 * - batch invalid after rebalance
                 */
                if (!isRunning() || isStale()) break;

                try {

                    console.log(
                        `CONSUMED offset=${message.offset} value=${message.value?.toString()}`
                    );

                    /**
                     * Simulate long business processing.
                     *
                     * Example:
                     * - DB insert
                     * - API call
                     * - payment processing
                     */
                    await sleep(1000);

                    /**
                     * Mark offset as processed.
                     *
                     * Offset only resolved AFTER success.
                     */
                    resolveOffset(message.offset);

                    /**
                     * VERY IMPORTANT
                     *
                     * Send heartbeat manually.
                     *
                     * Prevents:
                     * - session timeout
                     * - rebalance storm
                     * - consumer eviction
                     */
                    await heartbeat();

                } catch (error) {

                    /**
                     * Processing failed.
                     *
                     * Offset not committed,
                     * so Kafka can retry later.
                     */
                    console.error("PROCESS ERROR:", error);
                }
            }

            /**
             * Commit processed offsets to Kafka.
             *
             * Kafka stores latest successful offset
             * for this consumer group.
             */
            await commitOffsetsIfNecessary();
        },
    });
}

/**
 * Utility delay function.
 */
function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Start consumer process.
 */
runConsumer().catch(console.error);