---
position: 2
title: Quickstart with Localstack
---

# Localstack

## Prerequisites

To follow this accelerator, you will need:

- **Technical Skills**
  - Understanding of event-driven architectures
  - Experience with **Apache Kafka**
  - Basic knowledge of AWS services, especially **DynamoDB**
  
## Architecture

The solution comprises several interconnected components:

- **Tracker Frontend**: 
  - A React application that emits events (e.g., play, pause, ad interactions) to the [Stream Collector](#stream-collector).

- **Stream Collector**:
  - Collects and forwards events via Kinesis to [Snowbridge](#snowbridge).

- **Snowbridge**:
  - Enriches the events and routes them via Kafka to the [Live Viewer Backend](#live-viewer-backend).

- **Live Viewer Backend**:
  - Processes events, stores the data in DynamoDB, and generates JSON state data for the [Live Viewer Frontend](#live-viewer-frontend).

- **Live Viewer Frontend**:
  - Displays the JSON state for "behavior-viewer" users.

![Architecture Diagram](images/architecture.png)

### Components & Configuration

- **Snowplow components**: `compose.snowplow.yaml`
- **Kafka infrastructure**: `compose.kafka.yaml`
- **Application components**: `compose.apps.yaml`
- **LocalStack setup**: `compose.localstack.yaml`
- **AWS setup**: Terraform scripts (located in the `docs/terraform` folder).

---

## Steps to Run the Application

### Step 0: Prerequisites

1. Open a terminal on Ubuntu Linux or Windows (WSL2).
2. Install **Docker** and **Docker Compose**.
3. Clone the project and navigate to its directory.
4. Create a `.env` file based on `.env.example` and configure AWS variables.

### Step 1: Start the Containers

Run the following command:

```bash
./up.sh
```

**Tips:**
- Use `Ctrl+C` to stop services but keep containers running.
- Pass service-specific options to `./up.sh` (e.g., `./up.sh kafka-services`).

### Step 2: Open the Tracker Frontend

Visit [http://localhost:3000](http://localhost:3000) to configure the Stream Collector endpoint and start tracking events.

### Step 3: Open the Live Viewer Frontend

Visit [http://localhost:8280](http://localhost:8280) to view tracked events displayed in real-time.

### Step 4 (Optional): Inspect LocalStack

Visit the [LocalStack UI](https://app.localstack.cloud/) to inspect infrastructure components such as Kinesis and DynamoDB.

### Step 5 (Optional): View Events in Kafka UI

Access [http://localhost:8080](http://localhost:8080) to review events within the Kafka UI.

### Step 6 (Optional): Use LazyDocker

Run the following command to manage containers visually:

```bash
sudo ./lazydocker.sh
```

### Step 7: Stop the Containers

Shut down all running containers:

```bash
./down.sh
```

### Step 8: Clean Up

To remove all containers and images, use:

```bash
./clean.sh
```

**Warning**: This command will delete all generated data.
