# Kafka UI (BEST)

```bash
docker run -d \
--name kafka-ui \
-p 8080:8080 \
-e KAFKA_CLUSTERS_0_NAME=local \
-e KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=192.168.29.13:9092 \
provectuslabs/kafka-ui
```

# Kafka UI (BEST - SECURITY)

```bash

# stop old kafka ui
docker stop kafka-ui
docker rm kafka-ui

# start new
docker run -d \
--name kafka-ui \
-p 8080:8080 \
-e KAFKA_CLUSTERS_0_NAME=local \
-e KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=192.168.29.13:9092 \
-e KAFKA_CLUSTERS_0_PROPERTIES_SECURITY_PROTOCOL=SASL_PLAINTEXT \
-e KAFKA_CLUSTERS_0_PROPERTIES_SASL_MECHANISM=PLAIN \
-e KAFKA_CLUSTERS_0_PROPERTIES_SASL_JAAS_CONFIG='org.apache.kafka.common.security.plain.PlainLoginModule required username="spade" password="Vikas@123";' \
provectuslabs/kafka-ui
```
