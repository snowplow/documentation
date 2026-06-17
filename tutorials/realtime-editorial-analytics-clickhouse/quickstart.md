---
position: 2
title: "Run the application using Snowplow Micro and ClickHouse"
sidebar_label: "Run the application locally"
description: "Run the complete real-time editorial analytics stack locally with Docker, Snowplow and ClickHouse to process user behavioral events and display real-time content engagement insights and ad performance metrics."
keywords: ["clickhouse real-time analytics", "media publisher analytics snowplow", "editorial analytics"]
date: "2025-09-09"
---

The following steps will deploy the solution accelerator using Docker.

## Step 0: Prerequisites

1. Open a terminal
2. Install **Docker** and **Docker Compose**. You can run the following commands to check if it's already installed. If not installed, you can install Docker / Docker Compose by following these [instructions](https://docs.docker.com/compose/install/).

```bash
  docker --version

  docker-compose --version
```

3. [Clone the project](https://github.com/snowplow-industry-solutions/clickhouse-realtime-editorial-analytics) and navigate to its directory

```bash
git clone https://github.com/snowplow-industry-solutions/clickhouse-realtime-editorial-analytics.git
```

4. Run the SQL query in `./clickhouse-queries/create-table-query.sql` within ClickHouse's SQL console. This table will store the Snowplow events. You'll need a `CLICKHOUSE_DATABASE` value in the next step. It's labeled in this image:

![ClickHouse Cloud SQL console home screen with the left navigation showing the Snowplow database and its tables, with the CLICKHOUSE_DATABASE value highlighted in the breadcrumb](images/clickhouse-database-name.png)

5. Create a `.env` file by copying `.env.example`. To populate the values, go to your ClickHouse account and select the [HTTPS connection](https://clickhouse.com/docs/getting-started/quick-start/cloud#connect-with-your-app) method. This will display a sample `curl` command containing your connection details.

Map each value to the correct environment variable:

| Variable              | Where to find it                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| `CLICKHOUSE_HOST`     | Line 3 of the sample `curl` command. Format: `https://<your-clickhouse-host>.aws.clickhouse.cloud:<port>` |
| `CLICKHOUSE_USER`     | The **Username** field                                                                                    |
| `CLICKHOUSE_KEY`      | The **Password** field                                                                                    |
| `CLICKHOUSE_DATABASE` | The database name from the SQL Console where the SQL query was run. This is typically `default`           |
| `CLICKHOUSE_TABLE`    | Always set this to `snowplow_article_interactions`                                                        |

![ClickHouse Connect dialog with Username and Password fields annotated as CLICKHOUSE_USER and CLICKHOUSE_KEY, and a curl command with line 3 annotated as CLICKHOUSE_HOST](images/clickhouse-credentials.png)

## Step 1: Start the containers

Run the following command to download and run everything in Docker:

```bash
docker-compose up -d
```

The [architecture](/tutorials/realtime-editorial-analytics-clickhouse/introduction#architecture) section on the previous page has the details on everything that's installed.

## Step 2: Open the web tracking front-end

Wait for about 30 seconds for the website container to start. Once it's ready, visit [`http://localhost:3000`](http://localhost:3000) to view the website application and start tracking events.

![The Daily Query demo website homepage showing a featured article about AI in journalism and a grid of new articles below](images/homepage.png)

2.1 Click on any of the articles that are on the homepage. Scroll down on the new page which opens. Wait for about 10 seconds to simulate a user reading.

2.2 Click on the advertisement which appears on the right-hand sidebar. Return to the homepage by clicking the **The Daily Query** logo in the header.

![The Daily Query demo website article page with a Professional Development Courses advertisement in the right sidebar](images/advertisement.png)

2.3 Select a different article from the homepage. Scroll down on the new page which opens. Wait for about 10 seconds to simulate a user reading.

2.4 Click on the advertisement which appears on the right-hand sidebar as you did in Step 2.2. Return to the homepage by clicking the **The Daily Query** logo in the header.

## Step 3: Open the Snowplow Micro front-end

Open Snowplow Micro on [`http://localhost:9090/micro/ui`](http://localhost:9090/micro/ui) in a separate window. Press the **Refresh** button located in the header. This will display the current Snowplow events which are being tracked (e.g. `page_view`, `page_ping`, `article_interaction`, `ad_interaction`).

You can use the **Pick Columns** button to select certain dimensions. Try selecting the following:
- `event_name` from the "Events" section
- `com_demo_ad_interaction_1.type` from the "Events" section
- `com_demo_media_article_interaction_1.type` from the "Events" section
- `com_demo_media_article_1.title` from the "Entities" section

## Step 4: Query the data in ClickHouse Console

Run the following query in ClickHouse's SQL Console. You should see events landing in real-time within the ClickHouse table.

```sql
select * from snowplow_article_interactions
order by dvce_created_tstamp desc
```

![ClickHouse SQL console showing query results from the snowplow_article_interactions table, with rows of event data ordered by creation timestamp](images/clickhouse-results.png)

## Step 5: View the editorial analytics data in a sample real-time dashboard

Visit the real-time editorial analytics dashboard at [`localhost:3000/dashboard`](http://localhost:3000/dashboard), which is querying data from ClickHouse. Press the **Load Data** button to see the article engagement and ad performance metrics for the last 30 minutes.

![The Daily Query Analytics Dashboard showing Trending Articles, Trending Categories, and Ad Performance sections, each with metrics for the last 30 minutes including impressions, views, scroll depth, and engaged time](images/realtime-dashboard.png)

If you're interested in the queries powering these insights, take a look at the code here:
- [Trending Articles report](https://github.com/snowplow-industry-solutions/clickhouse-realtime-editorial-analytics/blob/main/website/app/api/dashboard/route.ts#L52)
- [Trending Categories report](https://github.com/snowplow-industry-solutions/clickhouse-realtime-editorial-analytics/blob/main/website/app/api/dashboard/route.ts#L122)
- [Ad Performance](https://github.com/snowplow-industry-solutions/clickhouse-realtime-editorial-analytics/blob/main/website/app/api/dashboard/route.ts#L204)

## Step 6: Generate more insights

Try selecting different news articles, or clicking on different displayed ads. Repeat Step 4 or Step 5 and the data will refresh in real-time.

## Clean up and delete

Shut down and delete all running containers:

```bash
docker-compose down
```

:::tip[Deleting ClickHouse data]
There will still be data in your ClickHouse Cloud account. If you want to delete the generated data, run the following command in ClickHouse's SQL Console:
```sql
DROP TABLE snowplow_article_interactions
```
:::
