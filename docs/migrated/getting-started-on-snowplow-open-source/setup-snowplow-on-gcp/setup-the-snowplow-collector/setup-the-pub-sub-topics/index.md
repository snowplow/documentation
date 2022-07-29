---
title: "Setup the Pub/Sub topics"
date: "2020-02-27"
sidebar_position: 0
---

Go to [https://console.cloud.google.com/apis/api/pubsub.googleapis.com/overview](https://console.cloud.google.com/apis/api/pubsub.googleapis.com/overview)

- Make sure your project is selected (on the navbar, to the left of the search bar)
- Click enable

![](images/gcloud-enable-pubsub-1.png)

You’ll then have to create the topics to which the Scala Stream Collector publishes:

- Click on the hamburger, on the top left corner
- Scroll down until you find it, under “Big Data”

![](images/gcloud-enable-pubsub-2.png)

Create two topics: thse will be the good and bad raw topics:

![](images/gcloud-enable-pubsub-3.png)

Now you are ready to setup the collector application itself.
