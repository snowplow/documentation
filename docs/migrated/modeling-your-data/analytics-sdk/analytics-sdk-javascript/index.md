---
title: "Analytics SDK - JavaScript"
date: "2021-10-18"
sidebar_position: 200
---

## Overview

The [Snowplow JavaScript and TypeScript Analytics SDK](https://github.com/snowplow-incubator/snowplow-js-analytics-sdk) lets you work with [Snowplow enriched events](/docs/migrated/understanding-your-pipeline/canonical-event/) in your JavaScript event processing, data modeling and machine-learning jobs. You can use this SDK with [AWS Lambda](https://aws.amazon.com/lambda/), [Google Cloud Functions](https://cloud.google.com/functions/), [Google App Engine](https://cloud.google.com/appengine) and other JavaScript-compatible frameworks.

## Setup

Install using your preferred package manager, such as npm:

```
npm install --save snowplow-analytics-sdk
```

## Usage

### Overview

The [](https://github.com/snowplow-incubator/snowplow-js-analytics-sdk)[Snowplow JavaScript and TypeScript Analytics SDK](https://github.com/snowplow-incubator/snowplow-js-analytics-sdk) provides you an API to parse an enriched event from it's TSV-string form to a `JSON` string.

### Example

To consume in an AWS lambda you would do something like this in your `app.js`:

```
const { transform } = require('snowplow-analytics-sdk');

module.exports.handler = (input) => {
  let event = transform(
    new Buffer(input.Records[0].kinesis.data, 'base64').toString('utf8'),
  );

  // ...
};
```

Or in `app.ts`:

```
import { transform } from 'snowplow-analytics-sdk';

export function handler(input: any) {
  let event = transform(
    new Buffer(input.Records[0].kinesis.data, 'base64').toString('utf8'),
  );

  // ...
}
```

## API

### `transform(event: string): Event`

- `event: string` - TSV string containing event data.

Returns decoded [Snowplow enriched event](/docs/migrated/understanding-your-pipeline/canonical-event/).
