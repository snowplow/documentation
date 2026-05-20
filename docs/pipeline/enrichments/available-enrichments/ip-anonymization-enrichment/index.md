---
title: "IP anonymization enrichment"
sidebar_position: 16
sidebar_label: IP anonymization
description: "Anonymize IP addresses by masking octets or segments to protect user privacy and comply with regulations."
keywords: ["IP anonymization", "GDPR compliance", "privacy protection"]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This enrichment replaces the end of the user's IP address with "x"s, on a configurable length. The user IP is tracked in the `user_ipaddress` field of the atomic event.

For example, anonymizing one IPv4 octet would change an address of `255.255.255.255` to `255.255.255.x`, and anonymizing three octets would change it to `255.x.x.x`.

Both IPv4 and IPv6 are supported.

This enrichment runs after the [IP lookup enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md).

## Configuration

The enrichment takes these parameters:

| Parameter      | Required | Description                           |
| -------------- | -------- | ------------------------------------- |
| `anonOctets`   | ✅        | Number of IPv4 octets to anonymize.   |
| `anonSegments` | ❌        | Number of IPv6 segments to anonymize. |

<Tabs groupId="deployment" queryString>
  <TabItem value="console" label="Console" default>

Configure the parameters in the Console enrichment editor. For example:

```json
{
  "anonOctets": 1,
  "anonSegments": 1
}
```

  </TabItem>
  <TabItem value="self-hosted" label="Self-Hosted">

For Self-Hosted, [provide a complete JSON](/docs/pipeline/enrichments/managing-enrichments/terraform/index.md). For example:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/anon_ip/jsonschema/1-0-1",
  "data": {
    "name": "anon_ip",
    "vendor": "com.snowplowanalytics.snowplow",
    "enabled": true,
    "parameters": {
      "anonOctets": 1,
      "anonSegments": 1
    }
  }
}
```

  </TabItem>
</Tabs>

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

## Output

The anonymized value of the IP address is updated in-place in the `user_ipaddress` field, before ever being stored.
