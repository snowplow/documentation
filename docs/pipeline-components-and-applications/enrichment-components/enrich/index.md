---
title: "enrich-pubsub (GCP) and enrich-kinesis (AWS)"
date: "2020-10-22"
sidebar_position: 10
---

## enrich-pubsub

enrich-pubsub is a standalone JVM application that reads from and writes to PubSub topics. It can be run from anywhere, as long as it has permissions to access the topics.

It is published on Docker Hub and can be run with the following command:

```
docker run \
  -it --rm \
  -v $PWD:/snowplow \
  -e GOOGLE_APPLICATION_CREDENTIALS=/snowplow/snowplow-gcp-account-11aa55ff6b1b.json \
  snowplow/snowplow-enrich-pubsub:3.2.3 \
  --enrichments /snowplow/enrichments \
  --iglu-config /snowplow/resolver.json \
  --config /snowplow/config.hocon
```

Above assumes that you have following directory structure:

1. GCP credentials [JSON file](https://cloud.google.com/docs/authentication/getting-started)
2. `enrichments` directory, (possibly empty) with all [enrichment configuration JSONs](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-gcp/setup-validation-and-enrich/add-additional-enrichments/index.md)
3. Iglu Resolver [configuration JSON](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md)
4. enrich-pubSub [configuration HOCON](/docs/pipeline-components-and-applications/enrichment-components/enrich/configuration-reference/index.md)

Alternatively, you can download and run [a jar file from the github release](https://github.com/snowplow/enrich/releases).

```
java -jar snowplow-enrich-pubsub-3.2.3.jar \
  --enrichments /snowplow/enrichments \
  --iglu-config /snowplow/resolver.json \
  --config /snowplow/config.hocon
```

## enrich-kinesis

enrich-kinesis is a standalone JVM application that reads from and writes to Kinesis streams. It can be run from anywhere, as long as it has permissions to access the streams.

It is published on Docker Hub and can be run with the following command:

```
docker run \
  -it --rm \
  -v $PWD:/snowplow \
  -e AWS_ACCESS_KEY_ID=xxx \
  -e AWS_SECRET_ACCESS_KEY=xxx \
  snowplow/snowplow-enrich-kinesis:3.2.3 \
  --enrichments /snowplow/enrichments \
  --iglu-config /snowplow/resolver.json \
  --config /snowplow/config.hocon
```

Above assumes that you have following directory structure:

- `enrichments` directory, (possibly empty) with all [enrichment configuration JSONs](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-gcp/setup-validation-and-enrich/add-additional-enrichments/index.md)
- Iglu Resolver [configuration JSON](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md)
- enrich-kinesis [configuration HOCON](/docs/pipeline-components-and-applications/enrichment-components/enrich/configuration-reference/index.md)

Depending on where the app runs, `AWS_ACCESS_KEY` and `AWS_SECRET_KEY` might not be required.

Alternatively, you can download and run [a jar file from the github release](https://github.com/snowplow/enrich/releases).

```
java -jar snowplow-enrich-kinesis-3.2.3.jar \
  --enrichments /snowplow/enrichments \
  --iglu-config /snowplow/resolver.json \
  --config /snowplow/config.hocon
```
