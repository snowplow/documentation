---
title: "Setting up data quality alerts"
date: "2021-01-14"
sidebar_label: "Classic alerts"
sidebar_position: 2
---


Snowplow can send two types of alerts to help you monitor Failed Events:

- **New failed event:** receive an alert within 10 minutes of a new type of event failure being detected on your pipeline.
- **Failed event digest**: receive a daily digest of all Failed Event activity in the previous 48-hour period.

## Pre-requisites

To receive alerts you must have the Failed Events monitoring feature switched on in the Snowplow BDP console.

## Subscribing to alerts

- Login to Snowplow BDP console
- Locate the pipeline you wish to set up alerts for in the left-hand navigation
- Click on the `Configuration` tab, then the `Pipeline alerts` section

![](images/image.png)

- Click `Manage` for the alert you wish to subscribe to
- Add one or more email addresses by typing them into the input and clicking `Add recipient`
- Once you have added all recipients, click `Save Changes`

![](images/image-1.png)
