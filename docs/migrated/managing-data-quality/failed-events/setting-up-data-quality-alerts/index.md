---
title: "Setting up data quality alerts"
date: "2021-01-14"
sidebar_position: 2500
---

## Overview

Snowplow can send two types of alerts to help you monitor Failed Events:

- **New failed event:** receive an alert within 10 minutes of a new type of event failure being detected on your pipeline.
- **Failed event digest**: receive a twice-daily digest of all Failed Event activity in the previous 12-hour period.

## Pre-requisites

To receive alerts you must have the Failed Events monitoring feature switched on in the Snowplow BDP console.

## Subscribing to alerts

- Login to Snowplow BDP console
- Locate the pipeline you wish to set up alerts for in the left-hand navigation
- Find and select `Pipeline configuration`
- Scroll down to `Pipeline alerts` or use the page navigation to jump to it

![](https://docs.snowplowanalytics.com/wp-content/uploads/sites/2/2021/01/image.png?w=1024)

- Click `Manage` for the alert you wish to subscribe to
- Add one or more email addresses by typing them into the input and clicking `Add recipient`
- Once you have added all recipients, click `Save Changes`

![](https://docs.snowplowanalytics.com/wp-content/uploads/sites/2/2021/01/image-1.png?w=1024)
