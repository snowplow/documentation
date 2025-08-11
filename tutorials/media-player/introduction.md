---
title: Introduction
position: 1
---

Welcome to the **build advanced analytics for media players** tutorial. Once finished, you will be able to build a deeper understanding of user behavior across your media players and use your data to influence business decisions.

In this tutorial you will learn to:

- Model and visualize Snowplow data using the [snowplow-media-player](https://hub.getdbt.com/snowplow/snowplow_media_player/latest/) dbt package and Tableau using our sample data for Snowflake, Databricks or BigQuery (no need to have a working pipeline)
- Set up Snowplow tracking across different media players and platforms
- Apply what you have learned on your own pipeline to gain insights

## Who this tutorial is for

- Data practitioners who would like to get familiar with Snowplow data
- Data practitioners who want to learn how to use the snowplow-media-player dbt package and set up tracking using their media players, to gain insight from their users' behavioral data as quickly as possible

## What you will achieve

In approximately 8 working hours you can achieve the following:

- **Upload data** - Upload a sample Snowplow events dataset to your warehouse
- **Model** - Configure and run the snowplow-media-player data model
- **Visualize** - Visualize the modeled data with Tableau
- **Track** - Set up and deploy tracking across your media players
- **Next steps** - Gain value from your own pipeline data through modeling and visualization

## Prerequisites

**Modeling**
- dbt CLI installed / dbt Cloud account available
- New dbt project created and configured
- Snowflake, Databricks or BigQuery account and a user with access to create schemas and tables

**Tracking**
- Snowplow pipeline
- Media player to implement tracking

## What you will build

**Video and Media Analytics Dashboard** - with Tableau

You'll create comprehensive analytics that provide insights into user engagement across different media players and platforms, tracking video playback behavior, user interaction patterns, and content performance metrics.

## Architecture

The [snowplow-media-player](https://github.com/snowplow/dbt-snowplow-media-player) dbt package transforms and aggregates the raw media event data collected by the Snowplow JavaScript tracker or iOS and Android trackers in combination with media tracking specific plugins:

- [Media plugin](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/plugins/media/) 
- [HTML5 media player plugin](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/plugins/media-tracking/)
- [YouTube plugin](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/plugins/youtube-tracking/)
- [Vimeo plugin](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/plugins/vimeo-tracking/) 
- [iOS and Android media APIs](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/media-tracking/)

This tutorial covers both version 1 and version 2 media schemas. Version 2 schemas provide enhanced features including more accurate playback metrics, ad tracking capabilities, additional events for playback quality monitoring, and support for live streaming video.
