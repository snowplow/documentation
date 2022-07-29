---
title: "Starting a new recovery"
date: "2021-10-13"
sidebar_position: 1000
---

### Naming your recovery

You'll first be asked to give your event a descriptive name. This must be alphanumeric and any spaces will be converted to hyphens.

### Uploading example raw data

Next you'll need fetch an example of the failed event you wish to recover. You'll find the raw events in file storage (S3 on AWS, GCS on GCP). Follow the [guides on retrieving raw failed event data](/docs/migrated/managing-data-quality/failed-events/accessing-failed-events-in-file-storage/) to download an example raw event.

Once you have an example of your failed event you have two options for upload.

#### Paste in a single event

To use this option you'll need to open the file you've downloaded from file storage in a text editor and extract the JSON blob for the event you wish to base your recovery design on.

#### Upload a batch of events

To use this option you'll unzip the you've downloaded from file storage (where required) and then upload it in the UI. The events within the file will be extracted and you'll be able to view and select the event you wish to base your recovery design on.
