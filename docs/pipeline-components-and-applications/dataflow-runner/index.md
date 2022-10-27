---
title: "Dataflow Runner"
date: "2020-03-02"
sidebar_position: 100
---

Dataflow Runner is a system for creating and running [AWS EMR](https://aws.amazon.com/emr/) jobflow clusters and steps. It uses templated playbooks to define your cluster, and the Hadoop/Spark/et al jobs that you want to run.

### Installation

- Platform native binaries are available from the GitHub releases [page](https://github.com/snowplow/dataflow-runner/releases).
- Docker images are available at [DockerHub](https://hub.docker.com/r/snowplow/dataflow-runner) as of version `0.7.3`.

### Cluster Configuration

A cluster configuration contains all of the information needed to create a new cluster which is ready to accept a playbook. Currently AWS EMR is the only supported data-flow fabric.

For the cluster template see: [config/cluster.json.sample](https://github.com/snowplow/dataflow-runner/blob/master/config/cluster.json.sample)

### Playbook Configuration

A playbook consists of one of more _steps_. Steps are added to the cluster and run in series.

For the playbook template see: [config/playbook.json.sample](https://github.com/snowplow/dataflow-runner/blob/master/config/playbook.json.sample)

### Templates

Configuration files are run through Golang’s [text template processor](http://golang.org/pkg/text/template/). The template processor can access all _variables_ defined on the command line using the `--vars` argument.

For example to use the `--vars` argument with a playbook step:

```json
{
  "type": "CUSTOM_JAR",
  "name": "Combine Months",
  "actionOnFailure": "CANCEL_AND_WAIT",
  "jar": "s3://snowplow-hosted-assets/3-enrich/hadoop-event-recovery/snowplow-hadoop-event-recovery-0.2.0.jar",
  "arguments": [
    "com.snowplowanalytics.hadoop.scalding.SnowplowEventRecoveryJob",
    "--hdfs",
    "--input",
    "hdfs:///local/monthly/{{.inputVariable}}",
    "--output",
    "hdfs:///local/recovery/{{.outputVariable}}"
  ]
}
```

You would then pass the following command:

```bash
host> ./dataflow-runner run --emr-playbook ${emr-playbook-path} --emr-cluster j-2DPBXD87LSGP9 --vars inputVariable,input,outputVariable,output
```

This would resolve to:

```json
{
  "type": "CUSTOM_JAR",
  "name": "Combine Months",
  "actionOnFailure": "CANCEL_AND_WAIT",
  "jar": "s3://snowplow-hosted-assets/3-enrich/hadoop-event-recovery/snowplow-hadoop-event-recovery-0.2.0.jar",
  "arguments": [
    "com.snowplowanalytics.hadoop.scalding.SnowplowEventRecoveryJob",
    "--hdfs",
    "--input",
    "hdfs:///local/monthly/input",
    "--output",
    "hdfs:///local/recovery/output"
  ]
}
```

The following custom functions are also supported:

- `nowWithFormat [timeFormat]`: where `timeFormat` is a valid Golang [time format](http://golang.org/pkg/time/#Time.Format)
- `timeWithFormat [epoch] [timeFormat]`: where `epoch` is the number of seconds elapsed between January 1st 1970 and a certain point in time as a string and `timeFormat` is valid Golang [time format](http://golang.org/pkg/time/#Time.Format)
- `systemEnv "ENV_VAR"`: where `ENV_VAR` is a key for a valid environment variable
- `base64 [string]`: will base64-encode the string passed as argument
- `base64File "path/to/file.txt"`: will base64-encode the content of the file located at the path passed as argument

### CLI Commands

There are several commands that can be used to manage your data-flow fabric.

#### `up`: Launches a new EMR cluster

```text
NAME:
   dataflow-runner up - Launches a new EMR cluster

USAGE:
   dataflow-runner up [command options] [arguments...]

OPTIONS:
   --emr-config value  EMR config path
   --vars value        Variables that will be used by the templater
```

This command will launch a new cluster ready for step execution, the output should look something like the following:

```text
NAME:
   dataflow-runner run - Adds jobflow steps to a running EMR cluster

USAGE:
   dataflow-runner run [command options] [arguments...]

OPTIONS:
   --emr-playbook value  Playbook path
   --emr-cluster value   Jobflow ID
   --async               Asynchronous execution of the jobflow steps
   --lock value          Path to the lock held for the duration of the jobflow steps. This is materialized by a file or a KV entry in Consul depending on the --consul flag.
   --softLock value      Path to the lock held for the duration of the jobflow steps. This is materialized by a file or a KV entry in Consul depending on the --consul flag. Released no matter if the operation failed or succeeded.
   --consul value        Address of the Consul server used for distributed locking
   --vars value          Variables that will be used by the templater
```

#### `run`: Adds jobflow steps to a running EMR cluster

```bash
host> ./dataflow-runner up --emr-config ${emr-config-path}
INFO[0001] Launching EMR cluster with name 'dataflow-runner - sample name'...
INFO[0001] EMR cluster is in state STARTING - need state WAITING, checking again in 20 seconds...
INFO[0021] EMR cluster is in state STARTING - need state WAITING, checking again in 20 seconds...
# this goes for a few lines, omitted for brevity
INFO[0227] EMR cluster is in state STARTING - need state WAITING, checking again in 20 seconds...
INFO[0248] EMR cluster is in state BOOTSTRAPPING - need state WAITING, checking again in 20 seconds...
INFO[0269] EMR cluster is in state BOOTSTRAPPING - need state WAITING, checking again in 20 seconds...
INFO[0289] EMR cluster is in state BOOTSTRAPPING - need state WAITING, checking again in 20 seconds...
INFO[0310] EMR cluster launched successfully; Jobflow ID: j-2DPBXD87LSGP9
```

This command adds new steps to the already running cluster. By default this command is blocking - however if you wish to submit and forget simply supply the `--async` argument, the output should look something like the following:

```bash
host> ./dataflow-runner run --emr-playbook ${emr-playbook-path} --emr-cluster j-2DPBXD87LSGP9
INFO[0310] Successfully added 2 steps to the EMR cluster with jobflow id 'j-2DPBXD87LSGP9'...
ERRO[0357] Step 'Combine Months' with id 's-9WZ0VFKC770J' was FAILED
ERRO[0358] Step 'Combine Months 2' with id 's-37F9PKSXBHDAU' was CANCELLED
ERRO[0358] 2/2 steps failed to complete successfully
```

In this case my first step failed which meant that my second step was cancelled. This behaviour is dependent on your `actionOnFailure` - you can choose either to:

1. “CANCEL_AND_WAIT”: This will cancel all other currently queued jobs and return the cluster to a waiting state ready for new job submissions.
2. “CONTINUE”: This will go to the next step regardless if it failed or not.

**Note**: We have removed the ability to terminate the job flow on failure, to terminate you will need to use the `down` command.

Additionally, Dataflow Runner can acquire a lock before starting the job which can prevent other jobs from running at the same time. Its release will happen when:

- the job has terminated (whether successfully or with failure) with the `--softLock` flag
- the job has succeeded with the `--lock` flag (“hard lock”)

As the above implies, if a job were to fail and the `--lock` flag was used, manual cleaning of the lock will be required.

Additionally, supplying a [Consul](https://www.consul.io/) address, through the `--consul` flag will make this lock distributed.

When the `--consul` flag is used, the lock will be materialized by a key-value pair in Consul for which the key is the value supplied with the `--lock` or `--softLock` argument. Otherwise, it will be materialized by a file on the machine located at the specified path (either relative to your working directory or absolute).

#### `down`: Terminates a running EMR cluster

```text
NAME:
   dataflow-runner down - Terminates a running EMR cluster

USAGE:
   dataflow-runner down [command options] [arguments...]

OPTIONS:
   --emr-config value   EMR config path
   --emr-cluster value  Jobflow ID
   --vars value         Variables that will be used by the templater
```

When you are done with the EMR cluster you can terminate it by using the `down` command. This takes the original emr configuration and the job flow id to then go and terminate the cluster, the output should look something like the following:

```bash
host> ./dataflow-runner down --emr-config ${emr-config-path} --emr-cluster j-2DPBXD87LSGP9
INFO[0358] Terminating EMR cluster with jobflow id 'j-2DPBXD87LSGP9'...
INFO[0358] EMR cluster is in state TERMINATING - need state TERMINATED, checking again in 20 seconds...
INFO[0378] EMR cluster is in state TERMINATING - need state TERMINATED, checking again in 20 seconds...
INFO[0399] EMR cluster is in state TERMINATING - need state TERMINATED, checking again in 20 seconds...
INFO[0420] EMR cluster is in state TERMINATING - need state TERMINATED, checking again in 20 seconds...
INFO[0440] Transient EMR run completed successfully
```

#### `run-transient`: Launches, runs and then terminates an EMR cluster

```text
NAME:
   dataflow-runner run-transient - Launches, runs and then terminates an EMR cluster

USAGE:
   dataflow-runner run-transient [command options] [arguments...]

OPTIONS:
   --emr-config value    EMR config path
   --emr-playbook value  Playbook path
   --lock value          Path to the lock held for the duration of the jobflow steps. This is materialized by a file or a KV entry in Consul depending on the --consul flag.
   --softLock value      Path to the lock held for the duration of the jobflow steps. This is materialized by a file or a KV entry in Consul depending on the --consul flag. Released no matter if the operation failed or succeeded.
   --consul value        Address of the Consul server used for distributed locking
   --vars value          Variables that will be used by the templater
```

This command is a combination of `up`, `run` and `down` which is designed to mimic the current `EmrEtlRunner` behaviour.
