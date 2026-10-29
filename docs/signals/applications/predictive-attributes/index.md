---
title: "Retrieve predictive attribute scores in your application"
sidebar_position: 26
sidebar_label: "Predictive attributes"
description: "Score a session in real time with a published Snowplow Signals predictive attribute, using the Python SDK, Node.js SDK, or Signals API."
keywords: ["predictive attribute", "propensity score", "real-time scoring", "signals python sdk", "signals node sdk"]
date: "2026-10-26"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Once a predictive attribute is [published](/docs/signals/predictive-attributes/index.md), request a score in your application to decide how to treat a session, for example whether to show an offer. Signals calculates the score when you request it, from the most recent values of the model's input attributes. Your application requests the score and decides what to do with it. To trigger an intervention from a score, request the score in your backend and push a [direct intervention](/docs/signals/interventions/index.md#direct-interventions) when it meets your threshold.

Start by [connecting to Signals](/docs/signals/connection/index.md).

## Get the identifiers

A predictive attribute can use input attributes with different [attribute keys](/docs/signals/attributes/attribute-keys/index.md), for example session-level attributes keyed on `domain_sessionid` and user-level attributes keyed on `domain_userid`. To score it, pass one identifier for each attribute key its inputs use. An empty identifier counts as missing, and Signals ignores identifiers for other keys. An identifier Signals hasn't seen before still gets a score, calculated from empty attribute values.

Requests to Signals need credentials, so request scores from your server. In the browser, read the identifiers with the tracker's [`getDomainSessionId`](/docs/sources/web-trackers/cookies-and-local-storage/getting-cookie-values/index.md#domain-session-id) and [`getDomainUserId`](/docs/sources/web-trackers/cookies-and-local-storage/getting-cookie-values/index.md#domain-user-id) methods, then send them to your server, for example as request parameters.

## Retrieve a score

Request a score by the predictive attribute's name. Signals uses the published version and training.

<Tabs groupId="signals-retrieve" queryString>
<TabItem value="python" label="Python" default>

Use `get_predictive_attribute_score()` to score a predictive attribute.

```python
# The Signals connection object has been created as sp_signals

result = sp_signals.get_predictive_attribute_score(
    name="purchase_propensity",
    identifiers={
        "domain_sessionid": "8c9104e3-c300-4b20-82f2-93b7fa0b8feb",
        "domain_userid": "218e8926-3858-431d-b2ed-66da03a1cbe5",
    },
)
print(result.score)
```

| Argument      | Description                                                         | Type             | Required? |
| ------------- | ------------------------------------------------------------------- | ---------------- | --------- |
| `name`        | The name of the predictive attribute                                | `string`         | ✅         |
| `identifiers` | One identifier for each attribute key used by the input attributes  | `dict[str, str]` | ✅         |

</TabItem>
<TabItem value="nodejs" label="Node.js">

Use `getPredictiveAttributeScore()` to score a predictive attribute.

```typescript
// The Signals connection object has been created as signals

const result = await signals.getPredictiveAttributeScore({
  name: "purchase_propensity",
  identifiers: {
    domain_sessionid: "8c9104e3-c300-4b20-82f2-93b7fa0b8feb",
    domain_userid: "218e8926-3858-431d-b2ed-66da03a1cbe5",
  },
});
console.log(result.score);
```

| Argument      | Description                                                         | Type                     | Required? |
| ------------- | ------------------------------------------------------------------- | ------------------------ | --------- |
| `name`        | The name of the predictive attribute                                | `string`                 | ✅         |
| `identifiers` | One identifier for each attribute key used by the input attributes  | `Record<string, string>` | ✅         |

</TabItem>
<TabItem value="api" label="API">

Send a `GET` request to the `predictive_attribute` endpoint. Pass the name as `name`, and each identifier as a query parameter named after its attribute key. Every request needs a Bearer token, as described in [Authenticate to the Signals API](/docs/signals/connection/index.md#authenticate-to-the-signals-api).

```bash
curl \
  --header 'Authorization: Bearer <JWT>' \
  '{{API_URL}}/api/v1/predictive_attribute?name=purchase_propensity&domain_sessionid=<DOMAIN_SESSIONID>&domain_userid=<DOMAIN_USERID>'
```

</TabItem>
</Tabs>

## Read the response

The response contains the score and the version of the model that produced it:

```json
{
  "name": "purchase_propensity",
  "version": 2,
  "minor_version": 1,
  "score": 0.42
}
```

The table below describes each field in the response.

| Field           | Description                                                     | Type      |
| --------------- | --------------------------------------------------------------- | --------- |
| `name`          | The name of the predictive attribute                            | `string`  |
| `version`       | The published version of the predictive attribute               | `integer` |
| `minor_version` | The training of that version whose model produced the score     | `integer` |
| `score`         | How likely the session is to reach the goal, between 0 and 1    | `number`  |

### Interpret the score

A higher score means the model considers the goal more likely. Use the score to rank sessions and set a threshold to act above, not as an exact probability. Signals corrects scores for the sampling it uses in training, so they're on the scale of your real goal rate, but they aren't guaranteed to be calibrated. A session scored `0.6` is more likely to reach the goal than one scored `0.3`, but not necessarily 60% likely. Choose thresholds by looking at the scores your sessions receive, and revisit them each time you publish a new training, because a new model can shift the range of scores.

Signals scores a session whatever state it's in. Scores are less reliable for states that training doesn't cover, such as a very short session, or a session that has already reached the goal.

### Handle errors

The endpoint returns these error codes:

| Status | Cause                                                                                                       |
| ------ | ----------------------------------------------------------------------------------------------------------- |
| `400`  | The name is missing or invalid, a parameter appears more than once, or there's no identifier for one of the attribute keys the inputs use |
| `401`  | The token is missing, invalid, or expired                                                                     |
| `404`  | No version of the predictive attribute is published                                                           |
| `500`  | An unexpected error, for example an input attribute group is no longer published                             |
| `503`  | Scoring is temporarily unavailable, for example while the model is being published or loaded. Retry after a few seconds |
| `504`  | Reading the input attributes took longer than the request timeout                                             |

The SDKs raise these as a `SignalsAPIError` that carries the status code.

```mdx-code-block
import SignalsFreeTier from "@site/docs/reusable/signals-free-tier/_index.md"

<SignalsFreeTier/>
```
