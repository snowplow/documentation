---
title: "Run event recovery on GCP Dataflow with Beam"
date: "2020-08-03"
sidebar_position: 0
sidebar_label: "GCP - Beam"
description: "Deploy dockerized event recovery jobs on Google Cloud Dataflow using Apache Beam runtime."
keywords: ["GCP event recovery", "Dataflow recovery", "Beam recovery"]
---

The Beam job is a dockerized purpose built Dataflow job that reads data from a GCS location specified through a pattern and stores the recovered payloads in a PubSub topic, unrecovered and unrecoverable in other GCS buckets.

## Permissions

In order to run the job a `service-account` with appropriate credentials must be set up in the project.

In order to be sure not to disrupt any service accounts that may be required for normal pipeline operations, it's recommended to create a new service account for recovery.

To create a new service account in your GCP console navigate to [IAM & Admin > Service](https://console.cloud.google.com/iam-admin/serviceaccounts) [Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts). Create a new account and grant `full project owner` permissions.

Generate a new key for the service account and save down to your local machine.

## Building

To build the docker image, run:

```bash
sbt beam/docker:publishLocal
```

## Running

To run on Apache Beam in GCP Dataflow run it through a docker-deployment the options to set are shown below.

```bash
-v {{path-to-local-key-file}}.json:/snowplow/config/credentials.json \
-e GOOGLE_APPLICATION_CREDENTIALS=/snowplow/config/credentials.json \
  snowplow/snowplow-event-recovery-beam:0.6.1 \
--runner=DataFlowRunner \
--project={{your-gcp-project-name}} \
--jobName=event-recovery-rt-pipeline \
--region={{your-project-region}} \
--gcpTempLocation=gs://sp-storage-loader-tmp-{{pipeline_tag_e.g._prod1}}-{{pipeline_name}}/temp \
--inputDirectory=gs://sp-storage-loader-bad-{{pipeline_tag_e.g._prod1}}-{{project_name}}/partitioned/** \
--outputTopic=projects/{{project_name}}/topics/{{recovery-topic}} \
--failedOutput=gs://{{create_or_choose_a_failed_output_folder}}/failed/ \
--unrecoverableOutput=gs://{{create_or_choose_an_unrecoverable_folder}}/unrecoverable/ \
--config={{base64-encoded-string of your recovery configuration}} \
--resolver={{base64-encoded-string of a schema resolver file (Iglu Central ok for default)}}
```

As this is a self-contained docker image the first flag sets the key for the deployment in the folder for use by the job.

Note that for zone GCP prefers you may need to use -a or -b zones (e.g. europe-west2-b).

Also note, that no `"` are needed for any of the strings.
