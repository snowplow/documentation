---
title: "Test an event recovery configuration locally"
sidebar_label: "Testing"
date: "2020-08-26"
sidebar_position: 20
description: "Validate recovery configuration and run small-scale test recoveries locally using the snowplow-event-recovery CLI tool."
keywords: ["test recovery config", "validate recovery", "recovery CLI"]
---

Once you know how you want to configure the recovery job, it's worthwhile to test your configuration locally, before deploying an actual recovery job.

For that purpose we provide a `snowplow-event-recovery` command line interface. Latest versions are available through [GitHub release page](https://github.com/snowplow-incubator/snowplow-event-recovery/releases/latest).

The CLI provides commands for validating (`snowplow-event-recovery validate`) and running test recoveries (`snowplow-event-recovery run`).  See `snowplow-event-recovery --help` for the most up-to-date options descriptions.

The `run` command needs Java 21 or later. The `validate` command runs on earlier Java versions.

### Validate

Validation checks configuration schema to verify that actual job can be ran. To validate the configuration, run:

```
snowplow-event-recovery validate --config /opt/scenarios.json
```

By default, `validate` resolves schemas against Iglu Central. To use your own Iglu resolver configuration, add `--resolver /opt/resolver.json`.

Which will result in:
```
OK! Config valid
```

Or an detailed error message:

```
ERROR! Invalid config

Instance is not valid against its schema:
* At $.iglu:com.snowplowanalytics.snowplow.badrows/adapter_failures/jsonschema/1-0-*[0].conditions[0].op:
  - $.iglu:com.snowplowanalytics.snowplow.badrows/adapter_failures/jsonschema/1-0-*[0].conditions[0].op: does not have a value in the enumeration [Test]
  ```

### Test

To run a small-scale recovery test, outputting both good and failed events into files, execute:

```
snowplow-event-recovery run --config $PWD/scenarios.json -o /tmp -i $PWD/input/ --resolver $PWD/resolver.json
```

The input folder (`--input` or `-i`) contains a line-delimited files (by default `.txt` files are parsed, but the glob extension can be configured using `--glob` or `-g` flag) minimized json failed events as seen in
[example](https://github.com/snowplow-incubator/snowplow-event-recovery/tree/master/examples).

With output being saved into `/tmp` directory as a stringified payload objects
into `good.txt` and json-serialized failed events into `bad.txt`.

Which for successful recovery will print the progress and output summary:
```
Resolver and enrichments configured...
Config loaded...
Enriching event...
Enriched event 2dfeb9b7-5a87-4214-8a97-a8b23176856b
...
Total Lines: 156, Recovered: 142
```

By default no enrichments are configured. To enable enrichments, set the `--enrichments` flag to a directory of enrichment configuration files. Only enrichments that don't need external resources are supported. For example, the IP lookups enrichment needs a database file, and the API request enrichment calls an API, so neither works. If the directory contains an enrichment that needs external resources, the command fails with an error. Otherwise, it runs the recovery with your enrichments:

```
snowplow-event-recovery run --config $PWD/scenarios.json -o /tmp -i $PWD/input/ --resolver $PWD/resolver.json --enrichments $PWD/enrichments

Total Lines: 3, Recovered: 0
OK! Successfully ran recovery.
```
