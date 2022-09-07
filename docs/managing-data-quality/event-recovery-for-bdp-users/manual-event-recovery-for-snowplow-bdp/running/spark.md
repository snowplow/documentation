---
title: "Spark"
date: "2020-08-26"
sidebar_position: 20
---

The Spark job reads bad rows from an S3 location and stores the recovered payloads in Kinesis, unrecovered and unrecoverable in other S3 buckets.

#### Building

To build the fat jar, run:

```
sbt spark/assembly
```

#### Running

Using the JAR directly (which is hosted at `s3://snowplow-hosted-assets/3-enrich/snowplow-event-recovery/`):

```
spark-submit \
  --class com.snowplowanalytcs.snowplow.event.recovery.Main \
  --master master-url \
  --deploy-mode deploy-mode \
  snowplow-event-recovery-spark-0.1.1.jar
  --input s3://bad-rows-location/
  --region eu-central-1
  --output collector-payloads
  --failedOutput s3://unrecovered-collector-payloads-location/
  --unrecoverableOutput s3://unrecoverable-collector-payloads-location/
  --config base64-encoded-configuration
```

Or through an EMR step:

```
aws emr add-steps --cluster-id j-XXXXXXXX --steps \
  Name=snowplow-event-recovery,\
  Type=CUSTOM_JAR,\
  Jar=s3://snowplow-hosted-assets/3-enrich/snowplow-event-recovery/snowplow-event-recovery-spark-0.2.0.jar,\
  MainClass=com.snowplowanalytics.snowplow.event.recovery.Main,\
  Args=[--input,s3://bad-rows-location/,--region,eu-central-1,--output,collector-payloads,--failedOutput,s3://unrecovered-collector-payloads-location/,--unrecoverableOutput,s3://unrecoverable-collector-payloads-location/,--config,base64-encoded-configuration],\
  ActionOnFailure=CONTINUE
```

Or using Dataflow Runner, with `emr-config.json`:

```
{
  "schema": "iglu:com.snowplowanalytics.dataflowrunner/ClusterConfig/avro/1-1-0",
  "data": {
    "name": "emr-recovery-cluster",
    "logUri": "s3://logs/",
    "region": "eu-central-1",
    "credentials": {
      "accessKeyId": "{{secret "aws-access-key-id"}}",
      "secretAccessKey": "{{secret "aws-secret-access-key"}}"
    },
    "roles": {
      "jobflow": "EMR_EC2_DefaultRole",
      "service": "{{ prefix }}-event-recovery"
    },
    "ec2": {
      "amiVersion": "5.17.0",
      "keyName": "some-key-name",
      "location": {
        "vpc": {
          "subnetId": "subnet-sample"
        }
      },
      "instances": {
        "master": {
          "type": "m1.medium",
          "ebsConfiguration": {
            "ebsOptimized": true,
            "ebsBlockDeviceConfigs": [
              {
                "volumesPerInstance": 12,
                "volumeSpecification": {
                  "iops": 8,
                  "sizeInGB": 10,
                  "volumeType": "gp2"
                }
              }
            ]
          }
        },
        "core": {
          "type": "m1.medium",
          "count": 1
        },
        "task": {
          "type": "m1.medium",
          "count": 0,
          "bid": "0.015"
        }
      }
    },
    "tags": [
      {
        "key": "client",
        "value": "com.snplow.eng"
      },
      {
        "key": "job",
        "value": "recovery"
      }
    ],
    "applications": [ "Hadoop", "Spark" ]
  }
}
```

And `emr-playbook.json`:

```
{
  "schema": "iglu:com.snowplowanalytics.dataflowrunner/PlaybookConfig/avro/1-0-1",
  "data": {
    "region": "eu-west-1",
    "credentials": {
      "accessKeyId": "{{secret "aws-access-key-id"}}",
      "secretAccessKey": "{{secret "aws-secret-access-key"}}"
    },
    "steps": [
      {
        "type": "CUSTOM_JAR",
        "name": "Staging of bad rows",
        "actionOnFailure": "CANCEL_AND_WAIT",
        "jar": "/usr/share/aws/emr/s3-dist-cp/lib/s3-dist-cp.jar",
        "arguments": [
          "--src",
          "s3n://${BUCKET_ID}/recovery/enriched/bad/run=2019-01-12-15-04-23/",
          "--dest",
          "s3n://${BUCKET_ID}/stage_01_19/"
        ]
      },
      {
        "type": "CUSTOM_JAR",
        "name": "Move to HDFS",
        "actionOnFailure": "CANCEL_AND_WAIT",
        "jar": "/usr/share/aws/emr/s3-dist-cp/lib/s3-dist-cp.jar",
        "arguments": [
          "--src",
          "s3n://${BUCKET_ID}/stage_01_19/",
          "--dest",
          "hdfs:///local/to-recover/",
          "--outputCodec",
          "none"
        ]
      },
      {
        "type": "CUSTOM_JAR",
        "name": "snowplow-event-recovery",
        "actionOnFailure": "CANCEL_AND_WAIT",
        "jar": "command-runner.jar",
        "arguments": [
          "spark-submit",
          "--class",
          "com.snowplowanalytics.snowplow.event.recovery.Main",
          "--master",
          "yarn",
          "--deploy-mode",
          "cluster",
          "s3://bad-rows/snowplow-event-recovery-spark-0.2.0.jar",
          "--input",
          "hdfs:///local/to-recover/",
          "--output",
          "good-events",
          "--region",
          "eu-central-1",
          "--failedOutput",
          "s3://bad-rows/left",
          "--unrecoverableOutput",
          "s3://bad-rows/left/unrecoverable",
          "--resolver",
          "eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5pZ2x1L3Jlc29sdmVyLWNvbmZpZy9qc29uc2NoZW1hLzEtMC0xIiwiZGF0YSI6eyJjYWNoZVNpemUiOjAsInJlcG9zaXRvcmllcyI6W3sibmFtZSI6ICJJZ2x1IENlbnRyYWwiLCJwcmlvcml0eSI6IDAsInZlbmRvclByZWZpeGVzIjogWyAiY29tLnNub3dwbG93YW5hbHl0aWNzIiBdLCJjb25uZWN0aW9uIjogeyJodHRwIjp7InVyaSI6Imh0dHA6Ly9pZ2x1Y2VudHJhbC5jb20ifX19LHsibmFtZSI6IlByaXYiLCJwcmlvcml0eSI6MCwidmVuZG9yUHJlZml4ZXMiOlsiY29tLnNub3dwbG93YW5hbHl0aWNzIl0sImNvbm5lY3Rpb24iOnsiaHR0cCI6eyJ1cmkiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vcGVlbC9zY2hlbWFzL21hc3RlciJ9fX1dfX0=",
          "--config",
          "eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9yZWNvdmVyaWVzL2pzb25zY2hlbWEvMi0wLTEiLCJkYXRhIjp7ImlnbHU6Y29tLnNub3dwbG93YW5hbHl0aWNzLnNub3dwbG93LmJhZHJvd3MvZW5yaWNobWVudF9mYWlsdXJlcy9qc29uc2NoZW1hLzEtMC0qIjpbeyJuYW1lIjoibWFpbi1mbG93IiwiY29uZGl0aW9ucyI6W10sInN0ZXBzIjpbXX1dLCJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy5iYWRyb3dzL2FkYXB0ZXJfZmFpbHVyZXMvanNvbnNjaGVtYS8xLTAtKiI6W3sibmFtZSI6Im1haW4tZmxvdyIsImNvbmRpdGlvbnMiOltdLCJzdGVwcyI6W119XSwiaWdsdTpjb20uc25vd3Bsb3dhbmFseXRpY3Muc25vd3Bsb3cuYmFkcm93cy9zY2hlbWFfdmlvbGF0aW9ucy9qc29uc2NoZW1hLzEtMC0qIjpbeyJuYW1lIjoibWFpbi1mbG93IiwiY29uZGl0aW9ucyI6W10sInN0ZXBzIjpbXX1dLCJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy5iYWRyb3dzL3RyYWNrZXJfcHJvdG9jb2xfdmlvbGF0aW9ucy9qc29uc2NoZW1hLzEtMC0qIjpbeyJuYW1lIjoibWFpbi1mbG93IiwiY29uZGl0aW9ucyI6W10sInN0ZXBzIjpbXX1dfX0="
          
        ]
      }

      {
        "type": "CUSTOM_JAR",
        "name": "Back to S3",
        "actionOnFailure": "CANCEL_AND_WAIT",
        "jar": "/usr/share/aws/emr/s3-dist-cp/lib/s3-dist-cp.jar",
        "arguments": [
          "--src",
          "hdfs:///local/recovered/",
          "--dest",
          "s3n://${BUCKET_ID}/raw/"
        ]
      }
    ],
    "tags": [
      {
        "key": "client",
        "value": "com.snowplowanalytics"
      },
      {
        "key": "job",
        "value": "recovery"
      }
    ]
  }
}
```

Run:

```
dataflow-runner run-transient --emr-config ./emr-config.json --emr-playbook ./emr-playbook.json
```
