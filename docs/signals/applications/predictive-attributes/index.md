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

:::note[Private preview]
Predictive attributes are in private preview. Contact Snowplow to enable them for your Signals deployment. The configuration and API described here may change.
:::

Once a predictive attribute is [published](/docs/signals/predictive-attributes/index.md), request a score in your application to decide how to treat a session, for example whether to show an offer. Signals calculates the score when you request it, from the current values of the model's input attributes, so it reflects everything the user has done up to that moment.

Start by [connecting to Signals](/docs/signals/connection/index.md).

## Get the identifiers

A predictive attribute can use input attributes with different [attribute keys](/docs/signals/attributes/attribute-keys/index.md), for example session-level attributes keyed on `domain_sessionid` and user-level attributes keyed on `domain_userid`. To score it, pass one identifier for each attribute key its inputs use. Signals ignores identifiers for other keys.

Scoring happens server-side, so you'll need to pass your backend the current identifiers. In the browser, read them with the tracker's [`getDomainSessionId`](/docs/sources/web-trackers/cookies-and-local-storage/getting-cookie-values/index.md#domain-session-id) and [`getDomainUserId`](/docs/sources/web-trackers/cookies-and-local-storage/getting-cookie-values/index.md#domain-user-id) methods, then send them to your server, for example as request parameters.

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

You can't use an attribute key called `name` in a predictive attribute's inputs, because the parameter is reserved for the predictive attribute's name.

## Response format

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

Use the score to rank sessions against each other, not as an exact probability. A session scored `0.6` is more likely to reach the goal than one scored `0.3`, but not necessarily 60% likely. Choose thresholds by looking at the scores your sessions actually receive, and revisit them each time you publish a new training, because a new model can shift the range of scores.

Signals scores a session whatever state it's in. Scores are less reliable for states that were rare in the training data, such as a session's first event, or a session that has already reached the goal.

### Handle errors

The endpoint returns these error codes:

| Status | Cause                                                                                                       |
| ------ | ----------------------------------------------------------------------------------------------------------- |
| `400`  | The request is missing the name, or an identifier for one of the attribute keys the inputs use              |
| `404`  | No version of the predictive attribute is published                                                          |
| `503`  | The model is being published or loaded. Retry after a few seconds                                            |
| `504`  | Reading the input attributes took longer than the request timeout                                            |

```mdx-code-block
import SignalsFreeTier from "@site/docs/reusable/signals-free-tier/_index.md"

<SignalsFreeTier/>
```
