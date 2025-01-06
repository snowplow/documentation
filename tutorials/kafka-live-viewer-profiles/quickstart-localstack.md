---
position: 2
title: Quickstart with Localstack
---

# Quickstart with Localstack

## Steps to Run the Application

### Step 0: Prerequisites

1. Open a terminal on Ubuntu Linux or Windows (WSL2).
2. Install **Docker** and **Docker Compose**.
3. [Clone the project](https://github.com/snowplow-incubator/live-viewer-profiles) and navigate to its directory.
4. Create a `.env` file based on `.env.example`. You don't need to configure AWS variables if you are using Localstack. 

### Step 1: Start the Containers

Run the following command to download and run everything in Docker:

```bash
./up.sh
```
Details on everything that is installed can be found in [architecture](/tutorials/kafka-live-viewer-profiles/introduction#architecture)

**Tips:**
- Use `Ctrl+C` to stop services but keep containers running.
- Pass service-specific options to `./up.sh` (e.g., `./up.sh kafka-services`).

### Step 2: Open the Tracker Frontend

Visit [http://localhost:3000](http://localhost:3000) to configure the Stream Collector endpoint and start tracking events. Enter the Collector URL: `localhost:9090` and click `Create tracker`. 

On the next screen, click `Custom media tracking demo`. This will bring up a video and a screen that displays information on what events are sent from the browser to the pipeline. If you want to simulate multiple users watching the video at the same time, you can open this in separate browsers. 

You must keep this window open with the video playing because everything here is running in real-time

### Step 3: Open the Live Viewer Frontend

Open [http://localhost:8280](http://localhost:8280) in a separate window. This will display the active users and their current state (e.g. watching video, watching advertisement, paused).

Congratulations! You have successfully run the accelerator to stream web behavior through Snowplow and Kafka to a real-time dashboard.

## Next Steps
- You can implement Snowplow media tracking on any HTML5 or YouTube video of your choice

## Other Things You Can Do

### Inspect LocalStack

Visit the [LocalStack UI](https://app.localstack.cloud/) to inspect infrastructure components such as Kinesis and DynamoDB.

### View Events in Kafka UI

Access [http://localhost:8080](http://localhost:8080) to review events within the Kafka UI.

### Use LazyDocker

Run the following command to manage containers visually:

```bash
sudo ./lazydocker.sh
```

## Cleaning up

### Stop the Containers

Shut down all running containers:

```bash
./down.sh
```

### Clean Up and Delete

To remove all containers and images, use:

```bash
./clean.sh
```

**Warning**: This command will delete all generated data.
