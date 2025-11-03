---
title: "Retrieve data model execution data"
sidebar_position: 3
sidebar_label: "Retrieve job execution data"
---

The API that powers the warehouse jobs monitoring view in Snowplow Console (Jobs) is also available for consumption by other authenticated clients.

The exact same data about past and current jobs executions can be retrieved and processed programmatically. Hence, it possible to integrate with your monitoring infrastructure and enable additional alerting or insights.

## Getting started

You can have a look at and interact with all available endpoints in the [API documentation](https://console.snowplowanalytics.com/api/msc/v1/docs/index.html?url=/api/msc/v1/docs/docs.yaml#/Jobs).

### Authorizing in the API documentation

To be able to post sample requests in the documentation you need to click the `Authorize` button at the top of the document and authorize with your token. The value for the token field in each individual requests is overwritten by this authorization.

The endpoints focus on the main operations in the workflow around:

1. Getting a list of job runs within a specific time window. This window **may span 96 hours at most and be contained within the last week**.
2. Retrieving information about a particular job run, including its individual steps.
3. Retrieving only the steps of a particular job run without any additional information.
4. Getting the full data available about the execution of a particular step of a particular job run, including `stdout`/`stderr`.

Each request will need to include your Organization ID. You can find it [on the _Manage organization_ page](https://console.snowplowanalytics.com/settings) in Console.

```mdx-code-block
import GetConsoleApiKey from "@site/docs/reusable/get-console-api-key/_index.md"

<GetConsoleApiKey/>
```

## Retrieving job run information

### Getting a list of job runs for a specific time window

The invocation is as such:

`GET /api/msc/v1/organizations/{organizationId}/jobs/v1/runs?from=X&to=Y`

`X` and `Y` are required and can be passed either as ISO8601 timestamps or as ISO8601 durations, and they must both be of the same type (i.e. it is not possible to mix a timestamp with a duration). For example, the query parameters can be:

- `from=2020-12-02T03:40:00Z&to=2020-12-02T15:40:00Z`
- `from=PT-12H&to=PT0S`

As mentioned earlier, the total time window requested cannot exceed 96 hours (4 days) or start earlier than 1 week ago.

Limitations to be aware of

When it comes to job executions, our platform tracks state change events. A side-effect of this is that in extreme cases of jobs with very significant numbers or steps or far too frequent executions the events for the requested time window may have to be automatically trimmed to the latest 10,000. This guarantees an up-to-date view but may be missing job runs that started near the beginning of the window. In this edge case the problem can be side-stepped by splitting the window to more requests (e.g. 2 + 2 days).

### Retrieving information about a specific job run

Can be invoked as:

`GET /api/msc/v1/organizations/{organizationId}/jobs/v1/runs/{runId}`

`runId` is a hashed value that can be found within results of job run listing queries. The extra information that this endpoint returns (compared to job listing results) is the list of steps in that job run and their state, alongside their inter-dependencies.

### Retrieving steps of a specific job run

If it is preferred to get only the steps for a job run, without the information already contained within the job runs list, one can use the respective endpoint:

`GET /api/msc/v1/organizations/{organizationId}/jobs/v1/runs/{runId}/steps`

### Retrieving detailed information about a specific step execution

Finally, one may wish to get the complete information about the execution of a single step. This may be useful, for instance, if the job failed on that step and the standard output or standard error of the step is of interest. To get that, one can invoke the respective endpoint:

`GET /api/msc/v1/organizations/{organizationId}/jobs/v1/runs/{runId}/steps/{stepName}`
