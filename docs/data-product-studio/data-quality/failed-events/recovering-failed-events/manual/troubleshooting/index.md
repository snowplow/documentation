---
title: "Troubleshooting"
description: "Troubleshoot and resolve issues with failed event recovery processes to maintain behavioral data quality."
schema: "TechArticle"
keywords: ["Recovery Troubleshooting", "Error Resolution", "Debug Guide", "Problem Solving", "Issue Resolution", "Recovery Issues"]
date: "2020-08-26"
sidebar_position: 50
---

## Monitoring

In order to verify the process is running properly there are several locations that can be monitored, depending on your runtime environment these are: datasinks (for recovery job processed output): `failedOutput` (S3/GCS bucket), `unrecoverableOutput` (S3/GCS bucket), `output` (Kinesis/PubSub streams) and job runners (tracking job status and processing in real-time).

## Possible Failures

There are two main reasons why recovery process may fail. Process Failures preventing recovery process to proceed and Recovery Failures that mean recovery flow cannot be applied to given bad row/line. Another set of issues is unexpected behavior of the application. The three failure types need to be handled differently.

### Process Failures

Process failures are usually caused by misconfiguration. They usually happen as the job is submitted to its runner (Apache Beam, Spark, Flink). Reported failures may differ, but usually they boil down to:

#### Missing Resources

This means that resources set as input or output for recovery do not exist or are inaccessible to application.

**Action:** Check the existence of resources provided to job configuration and their access policies.

#### Configuration Issues

The largest group of issues causing early process termination are configuration issues. They are reported in CLI as the job is submitted.

**Action:** Make sure the configuration is well formed and it is conforming its schema.

### Recovery Failures

Definitely the largest and the most common issue with automated recovery process are recovery failures. These are runtime errors that prevent application from recovering given lines / bad rows. These failures will produce values under `failedOutput` directory.

Recovery error is yet another bad row type that is able to be recovered. For convenience recovery errors use original configurations and do not require another recovery flows configured especially for them.

Recovery error contain additional information pointing to:

- recovery flow name
- number of recoveries attempted
- original bad row

#### Missing recovery configuration

Happens when trying to recover a line for which no recovery flow configuration can be matched.

**Action:** Check whether supplied configuration contains a proper mapping for problematic bad row instance including its schema key and conditions that are applied before choosing configuration.

#### Replacement Failures

Actual replacement specified with Replace Step has failed. Reason will be supplied along with exported `RecoveryError` bad row under `unrecoveredOutput`.

**Action:** consult the exported message. This likely means that configuration supplied to modify the source bad row needs adjusting. Either with another recovery flow (when faulty row is a special case) or direct adjustment to recovery flow supplied with `RecoveryError`.

#### Cast Failures

Much like Replacement Failures, Cast Failures occur when modifying actual value with a Cast Step has failed. The reason is supplied along with exported `RecoveryError` bad row under `unrecoveredOutput`.

**Action:** consult the exported message. This likely means that configuration supplied to modify the source bad row needs adjusting. Either with another recovery flow (when faulty row is a special case) or direct adjustment to recovery flow supplied with `RecoveryError`.

#### Unrecoverable Bad Row Type

Some bad row types are marked as unrecoverable and therefore even with an existing configuration they will not be transformed. They are outputted to `unrecoverable`.

**Action:** If you think that specific bad row type should be recoverable consult Extending Recovery and consider submitting a Pull Request.

#### Invalid JSON Format

Happens whenever input data is not a proper JSON format.

**Action:** Check that input JSON file contains a proper JSON object in each line.

#### Invalid Data Format

Happens whenever input data is not a valid `BadRow` JSON format.

**Action:** Check that input JSON file contains a proper `BadRow` JSON object in each line.

#### Codec Failures

This set of failures should not really occur but means that there was an error serializing data with thrift (ThriftFailure) or Base64 coding. Some of these issues might be related to runtime locale.

**Action:** Consult supplied error message outputted along with BadRow into `unrecoveredOutput`. Verify that bad row producer source has the same locale as recovery worker – UTF-8.

### Unexpected Behavior

This is hopefully the rarest but the least specific set of issues that may occur. In case any unexpected behavior happens consider submitting a GitHub issue.
