---
title: "Accessing failed event aggregates via the API"
sidebar_label: "Using the API"
sidebar_position: 3000
---

As discussed in the [section "Failed events in the Console"](/docs/managing-data-quality/monitoring-failed-events/ui/index.md), it is possible to view aggregates of failed events when you have turned on the respective optional functionality. This view makes it possible to quickly identify where most failed events are originating from -- as in what is the related app ID, what is the schema field that is misrepresented, etc. The API that powers this overview is publicly available and can be invoked with a valid token to feed your own monitoring systems if you wish.

## Authorization

Before you can invoke the Failed Events API, you will need to [authenticate with an API key](/docs/using-the-snowplow-console/managing-console-api-authentication/index.md).


## Available operations and data returned

A full specification of the API can be found in [our swagger docs](https://console.snowplowanalytics.com/api/msc/v1/docs/index.html?url=/api/msc/v1/docs/docs.yaml#/Metrics/getOrganizationsOrganizationidMetricsV1PipelinesPipelineidFailed-events). It is worth pointing out that, as is the case in the UI, the data returned only contains schema validation errors and enrichment failures.
