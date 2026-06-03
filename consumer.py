from kafka import KafkaConsumer
import time

# Kafka Consumer
consumer = KafkaConsumer(

    # Kafka topic
    "stress-topic",

    # Kafka broker address
    bootstrap_servers="xxx.xxx.xx.xx:9092",

    # Consumer group name
    group_id="order-service",

    # Start from oldest message if no offset exists
    auto_offset_reset="earliest",

    # Auto commit offsets
    enable_auto_commit=True,

    # Commit offsets every 1 second
    auto_commit_interval_ms=1000,

    # Consumer considered dead after 15 sec
    session_timeout_ms=15000,

    # Send heartbeat every 5 sec
    heartbeat_interval_ms=5000,

    # Max records fetched per poll
    max_poll_records=10,

    # Max allowed processing time
    max_poll_interval_ms=300000
)

print("Consumer started")

for message in consumer:

    try:

        print(
            f"CONSUMED offset={message.offset} value={message.value.decode()}"
        )

        # Simulate processing
        time.sleep(1)

    except Exception as e:

        print("ERROR:", e)