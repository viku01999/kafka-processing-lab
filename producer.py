from kafka import KafkaProducer
import json
import time

# Kafka Producer
producer = KafkaProducer(

    # Kafka broker address
    bootstrap_servers="192.168.29.13:9092",

    # Wait for all replicas acknowledgment
    # Gives maximum durability
    acks="all",

    # Retry failed sends
    retries=5,

    # Wait 50ms to create batches
    # Improves throughput
    linger_ms=50,

    # Batch size in bytes
    batch_size=32768,

    # Prevent duplicate messages during retries
    enable_idempotence=True
)

i = 0

while True:

    i += 1

    # Example order payload
    order = {
        "order_id": i,
        "amount": 100,
        "status": "NEW",
        "timestamp": time.time()
    }

    # Convert dict -> JSON -> bytes
    data = json.dumps(order).encode()

    try:

        # Send message to Kafka topic
        future = producer.send("stress-topic", data)

        # IMPORTANT:
        # Wait for Kafka acknowledgment
        # Prevents memory overflow/backpressure issues
        future.get(timeout=10)

        print(f"PRODUCED {i}")

    except Exception as e:

        print("PRODUCER ERROR:", e)

        # Avoid retry storm
        time.sleep(2)