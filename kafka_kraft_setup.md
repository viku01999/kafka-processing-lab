# Installation Documentation

```sh
# ============================================================================
# Kafka 4.0.0 Setup Script (KRaft Mode - No ZooKeeper)
# ============================================================================
# This script includes full documentation, setup instructions, and a working
# configuration for running Apache Kafka 4.0.0 in KRaft mode.
# It explains control flow, UUID usage, restart instructions, and includes
# producer/consumer command examples.
# ============================================================================

# ---------------------------------------------
# 📌 Kafka Without ZooKeeper: The Transition to KRaft
# ---------------------------------------------
# In this script and documentation:
# - Overview of ZooKeeper removal
# - KRaft architecture
# - Comparison with old system
# - Step-by-step setup
# - Explanation of how Kafka works internally
# - Restart instructions, UUID role
# - Producer/Consumer usage

# ----------------------------------------------------------------------------
# 🛠 Why Did Kafka Remove ZooKeeper?
# ----------------------------------------------------------------------------
# - ZooKeeper was a separate coordination system used for metadata & leader election.
# - Problems with ZooKeeper:
#   1. External dependency
#   2. Slow leader elections
#   3. Poor scalability with large clusters
#   4. Operational overhead
#
# KRaft (Kafka Raft) replaces ZooKeeper with an internal Raft-based consensus protocol.
# Benefits of KRaft:
# ✅ Simpler deployment
# ✅ Faster leader election (milliseconds)
# ✅ Higher scalability
# ✅ Lower maintenance

# ----------------------------------------------------------------------------
# 🏗 Kafka’s Old vs. New Architecture
# ----------------------------------------------------------------------------
# OLD (ZooKeeper):
# - Metadata stored externally
# - Slower failover, more latency
#
# NEW (KRaft):
# - Kafka brokers manage metadata internally
# - Uses Raft log for consensus
# - Brokers are both data handlers and metadata controllers

# ----------------------------------------------------------------------------
# ⚖️ ZooKeeper vs KRaft Comparison
# ----------------------------------------------------------------------------
# | Feature               | ZooKeeper        | KRaft            |
# |----------------------|------------------|------------------|
# | Metadata Management  | External (ZK)     | Internal (Kafka) |
# | Leader Election      | Seconds           | Milliseconds     |
# | Scalability          | Limited           | High             |
# | Setup Complexity     | High              | Low              |
# | Failure Recovery     | Slower            | Faster           |
```

## STEP 1: Download & Build Kafka 4.0.0

```sh
wget https://www.apache.org/dyn/closer.lua/kafka/4.2.0/kafka_2.13-4.2.0.tgz

tar -xvzf kafka_2.13-4.2.0.tgz
cd kafka_2.13-4.2.0

```

## STEP 2: Configure Environment Variables

```bash
sudo nano ~/.bashrc
```

```bash
export KAFKA_HOME=/usr/local/kafka_2.13-4.2.0
export PATH=$PATH:$KAFKA_HOME/bin
```

**Apply:**

```bash
source ~/.bashrc

# Then verify:
echo $KAFKA_HOME

```

## STEP 3: Update config

```bash
sudo nano /usr/local/kafka_2.13-4.2.0/config/server.properties
```

> Add config that given above line (84 to 139)

## STEP 4: Generate Cluster UUID & Format Storage

```bash
echo "Generating Cluster UUID..."
CLUSTER_ID=$(bin/kafka-storage.sh random-uuid)
echo "Generated Cluster ID: $CLUSTER_ID"
bin/kafka-storage.sh format -t $CLUSTER_ID -c config/server.properties
bin/kafka-server-start.sh config/server.properties
# 🔁 AFTER REBOOT / SYSTEM RESTART
# ✅ You do NOT need to generate UUID again.
# ✅ You do NOT need to format again.
# - Kafka Broker now also acts as the metadata controller.
# - Uses Raft consensus to elect a controller among quorum voters.
# - Topics are created and stored in replicated logs.
# - Metadata is persisted internally, removing need for ZooKeeper.
# - Fast failover: if controller fails, another broker takes over quickly.
```

# Clean kafka

```bash
# ==============================
# STOP KAFKA
# ==============================

pkill -f kafka.Kafka
pkill -f kafka-server-start

# ==============================
# REMOVE KAFKA INSTALLATION
# ==============================

sudo rm -rf /usr/local/kafka_2.13-4.2.0

# if symlink exists
sudo rm -rf /usr/local/kafka

# ==============================
# REMOVE KAFKA LOG DATA
# ==============================

sudo rm -rf /var/lib/kafka-logs

# old tmp logs (if previously used)
sudo rm -rf /tmp/kraft-combined-logs

# ==============================
# REMOVE LOCAL LOG FILES
# ==============================

rm -f ~/kafka.log
rm -f ~/nohup.out

# ==============================
# REMOVE ENV VARIABLES
# ==============================

sed -i '/KAFKA_HOME/d' ~/.bashrc
sed -i '/kafka_2.13-4.2.0\/bin/d' ~/.bashrc

source ~/.bashrc

# ==============================
# VERIFY CLEANUP
# ==============================

echo "==== CHECK ===="

which kafka-server-start.sh
ls -la /usr/local | grep kafka
ls -la /var/lib | grep kafka

echo "Kafka cleanup completed."
```