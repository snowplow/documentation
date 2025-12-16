---
title: "Example tracker requests"
---

:::note
This page gives examples of requests to the Snowplow collector. However, there is no need to perform these requests manually. Instead, we recommend using our Snowplow trackers that do them for you.
The requests on this page are only relevant if you plan to write a new tracker implementation.
:::

Below are a number of example Tracker Protocol requests. All examples are POST requests with a JSON body.

All requests are sent to `https://<your-collector-host>/com.snowplowanalytics.snowplow/tp2` unless you have specified a custom POST path when [configuring your Collector](/docs/pipeline/collector/index.md).

All payloads should be wrapped in a `payload_data` Self Describing JSON.

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4",
  "data": [
    {
      ...
    }
  ]
}
```

## Self Describing Event

This is an example of a _viewed_product_ event from the web (using the recommended Base64 encoding and the `ue_px` property):

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4",
  "data": [
    {
      "e": "ue",
      "ue_px": "eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy91bnN0cnVjdF9ldmVudC9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6eyJzY2hlbWEiOiJpZ2x1OmNvbS5teV9jb21wYW55L3ZpZXdlZF9wcm9kdWN0L2pzb25zY2hlbWEvMS0wLTAiLCJkYXRhIjp7InByb2R1Y3RfaWQiOiJBU08wMTA0MyIsInByaWNlIjo0OS45NX19fQ==",
      "eid": "5a305bf5-32fc-40d9-b0e8-66052f0f2c95",
      "tv": "js-3.5.0",
      "tna": "biz1",
      "aid": "website",
      "p": "web",
      "cookie": "1",
      "cs": "UTF-8",
      "lang": "en-GB",
      "res": "3440x1440",
      "cd": "30",
      "tz": "Europe/London",
      "dtm": "1665398554151",
      "vp": "693x1302",
      "ds": "678x9015",
      "vid": "29",
      "sid": "be9520e7-16a5-4d4e-afa1-8e269f99a1cf",
      "duid": "85094061-f702-4b62-a46d-20f7226b4741",
      "url": "https://snowplow.io/",
      "stm": "1665398554153"
    }
  ]
}
```

The encoded base64 string (`ue_px`):

```text
eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy91bnN0cnVjdF9ldmVudC9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6eyJzY2hlbWEiOiJpZ2x1OmNvbS5teV9jb21wYW55L3ZpZXdlZF9wcm9kdWN0L2pzb25zY2hlbWEvMS0wLTAiLCJkYXRhIjp7InByb2R1Y3RfaWQiOiJBU08wMTA0MyIsInByaWNlIjo0OS45NX19fQ==
```

represents the following JSON, when decoded:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0",
  "data": {
    "schema": "iglu:com.my_company/viewed_product/jsonschema/1-0-0",
    "data": {
      "product_id": "ASO01043",
      "price": 49.95
    }
  }
}
```

<details>
  <summary>cURL example</summary>

  ```bash
  curl --request POST \
      --url https://collector.website.com/com.snowplowanalytics.snowplow/tp2 \
      --header 'Content-Type: application/json' \
      --data '{
      "schema": "iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4",
      "data": [
        {
          "e": "ue",
          "ue_px": "eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy91bnN0cnVjdF9ldmVudC9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6eyJzY2hlbWEiOiJpZ2x1OmNvbS5teV9jb21wYW55L3ZpZXdlZF9wcm9kdWN0L2pzb25zY2hlbWEvMS0wLTAiLCJkYXRhIjp7InByb2R1Y3RfaWQiOiJBU08wMTA0MyIsInByaWNlIjo0OS45NX19fQ==",
          "eid": "5a305bf5-32fc-40d9-b0e8-66052f0f2c95",
          "tv": "js-3.5.0",
          "tna": "biz1",
          "aid": "website",
          "p": "web",
          "cookie": "1",
          "cs": "UTF-8",
          "lang": "en-GB",
          "res": "3440x1440",
          "cd": "30",
          "tz": "Europe/London",
          "dtm": "1665398554151",
          "vp": "693x1302",
          "ds": "678x9015",
          "vid": "29",
          "sid": "be9520e7-16a5-4d4e-afa1-8e269f99a1cf",
          "duid": "85094061-f702-4b62-a46d-20f7226b4741",
          "url": "https://snowplow.io/",
          "stm": "1665398554153"
        }
      ]
    }'
  ```

</details>

## Custom Entities

An array of entities can be sent with each event. Entity payloads should be wrapped in a `contexts` Self Describing JSON.

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
  "data": [
    {
      ...
    },
    {
      ...
    },
  ]
}
```

:::info

Entities can be attached to any Snowplow event type, it's possible to attach the `user` entity described above to any of the events which follow in this section.

[Learn more](/docs/fundamentals/entities/index.md) about entities.

:::

This is an example of the same _viewed_product_ event above but also with a custom context (using the recommended Base64 encoding and the `cx` property):

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4",
  "data": [
    {
      "e": "ue",
      "ue_px": "eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy91bnN0cnVjdF9ldmVudC9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6eyJzY2hlbWEiOiJpZ2x1OmNvbS5teV9jb21wYW55L3ZpZXdlZF9wcm9kdWN0L2pzb25zY2hlbWEvMS0wLTAiLCJkYXRhIjp7InByb2R1Y3RfaWQiOiJBU08wMTA0MyIsInByaWNlIjo0OS45NX19fQ==",
      "eid": "5a305bf5-32fc-40d9-b0e8-66052f0f2c95",
      "tv": "js-3.5.0",
      "tna": "biz1",
      "aid": "website",
      "p": "web",
      "cookie": "1",
      "cs": "UTF-8",
      "lang": "en-GB",
      "res": "3440x1440",
      "cd": "30",
      "tz": "Europe/London",
      "dtm": "1665398554151",
      "vp": "693x1302",
      "ds": "678x9015",
      "vid": "29",
      "sid": "be9520e7-16a5-4d4e-afa1-8e269f99a1cf",
      "duid": "85094061-f702-4b62-a46d-20f7226b4741",
      "url": "https://snowplow.io/",
      "stm": "1665398554153",
      "cx": "ewogICJzY2hlbWEiOiAiaWdsdTpjb20uc25vd3Bsb3dhbmFseXRpY3Muc25vd3Bsb3cvY29udGV4dHMvanNvbnNjaGVtYS8xLTAtMCIsCiAgImRhdGEiOiBbCiAgICB7CiAgICAgICJzY2hlbWEiOiAiaWdsdTpjb20ubXlfY29tcGFueS91c2VyL2pzb25zY2hlbWEvMS0wLTAiLAogICAgICAiZGF0YSI6IHsKICAgICAgICAibXlfY29tcGFueV91c2VyX2lkIjogIjk5OTl4eXoiCiAgICAgIH0KICAgIH0KICBdCn0="
    }
  ]
}
```

The encoded base64 string (`cx`):

```text
ewogICJzY2hlbWEiOiAiaWdsdTpjb20uc25vd3Bsb3dhbmFseXRpY3Muc25vd3Bsb3cvY29udGV4dHMvanNvbnNjaGVtYS8xLTAtMCIsCiAgImRhdGEiOiBbCiAgICB7CiAgICAgICJzY2hlbWEiOiAiaWdsdTpjb20ubXlfY29tcGFueS91c2VyL2pzb25zY2hlbWEvMS0wLTAiLAogICAgICAiZGF0YSI6IHsKICAgICAgICAibXlfY29tcGFueV91c2VyX2lkIjogIjk5OTl4eXoiCiAgICAgIH0KICAgIH0KICBdCn0=
```

represents the following JSON, when decoded:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
  "data": [
    {
      "schema": "iglu:com.my_company/user/jsonschema/1-0-0",
      "data": {
        "my_company_user_id": "9999xyz"
      }
    }
  ]
}
```

<details>
  <summary>cURL example</summary>

   ```bash
   curl --request POST \
      --url https://collector.website.com/com.snowplowanalytics.snowplow/tp2 \
      --header 'Content-Type: application/json' \
      --data '{
      "schema": "iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4",
      "data": [
        {
          "e": "ue",
          "ue_px": "eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy91bnN0cnVjdF9ldmVudC9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6eyJzY2hlbWEiOiJpZ2x1OmNvbS5teV9jb21wYW55L3ZpZXdlZF9wcm9kdWN0L2pzb25zY2hlbWEvMS0wLTAiLCJkYXRhIjp7InByb2R1Y3RfaWQiOiJBU08wMTA0MyIsInByaWNlIjo0OS45NX19fQ==",
          "eid": "5a305bf5-32fc-40d9-b0e8-66052f0f2c95",
          "tv": "js-3.5.0",
          "tna": "biz1",
          "aid": "website",
          "p": "web",
          "cookie": "1",
          "cs": "UTF-8",
          "lang": "en-GB",
          "res": "3440x1440",
          "cd": "30",
          "tz": "Europe/London",
          "dtm": "1665398554151",
          "vp": "693x1302",
          "ds": "678x9015",
          "vid": "29",
          "sid": "be9520e7-16a5-4d4e-afa1-8e269f99a1cf",
          "duid": "85094061-f702-4b62-a46d-20f7226b4741",
          "url": "https://snowplow.io/",
          "stm": "1665398554153",
          "cx": "ewogICJzY2hlbWEiOiAiaWdsdTpjb20uc25vd3Bsb3dhbmFseXRpY3Muc25vd3Bsb3cvY29udGV4dHMvanNvbnNjaGVtYS8xLTAtMCIsCiAgImRhdGEiOiBbCiAgICB7CiAgICAgICJzY2hlbWEiOiAiaWdsdTpjb20ubXlfY29tcGFueS91c2VyL2pzb25zY2hlbWEvMS0wLTAiLAogICAgICAiZGF0YSI6IHsKICAgICAgICAibXlfY29tcGFueV91c2VyX2lkIjogIjk5OTl4eXoiCiAgICAgIH0KICAgIH0KICBdCn0="
        }
      ]
    }'
  ```

</details>

## Page View

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4",
  "data": [
    {
      "e": "pv",
      "url": "https://snowplow.io/",
      "page": "Snowplow: behavioral data creation leader",
      "eid": "2ec13853-ef9e-414a-8976-e64a4693b134",
      "tv": "js-3.5.0",
      "tna": "biz1",
      "aid": "website",
      "p": "web",
      "cookie": "1",
      "cs": "UTF-8",
      "lang": "en-GB",
      "res": "3440x1440",
      "cd": "30",
      "tz": "Europe/London",
      "dtm": "1665398554084",
      "vp": "693x1302",
      "ds": "678x8188",
      "vid": "29",
      "sid": "be9520e7-16a5-4d4e-afa1-8e269f99a1cf",
      "duid": "85094061-f702-4b62-a46d-20f7226b4741",
      "stm": "1665398554084"
    }
  ]
}
```

<details>
  <summary>cURL example</summary>

    ```bash
    curl --request POST \
      --url https://collector.website.com/com.snowplowanalytics.snowplow/tp2 \
      --header 'Content-Type: application/json' \
      --data '{
      "schema": "iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4",
      "data": [
        {
          "e": "pv",
          "url": "https://snowplow.io/",
          "page": "Snowplow: behavioral data creation leader",
          "eid": "2ec13853-ef9e-414a-8976-e64a4693b134",
          "tv": "js-3.5.0",
          "tna": "biz1",
          "aid": "website",
          "p": "web",
          "cookie": "1",
          "cs": "UTF-8",
          "lang": "en-GB",
          "res": "3440x1440",
          "cd": "30",
          "tz": "Europe/London",
          "dtm": "1665398554084",
          "vp": "693x1302",
          "ds": "678x8188",
          "vid": "29",
          "sid": "be9520e7-16a5-4d4e-afa1-8e269f99a1cf",
          "duid": "85094061-f702-4b62-a46d-20f7226b4741",
          "stm": "1665398554084"
        }
      ]
    }'
    ```

</details>

## Page Ping

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4",
  "data": [
    {
      "e": "pp",
      "url": "https://snowplow.io/",
      "page": "Snowplow: behavioral data creation leader",
      "eid": "0a88e2bf-a2cd-48e7-877b-608c4b3d32a6",
      "tv": "js-3.5.0",
      "tna": "snplow5",
      "aid": "website",
      "p": "web",
      "cookie": "1",
      "cs": "UTF-8",
      "lang": "en-GB",
      "res": "3440x1440",
      "cd": "30",
      "tz": "Europe/London",
      "dtm": "1665401016632",
      "cx": "",
      "vp": "693x1302",
      "ds": "678x9015",
      "vid": "52",
      "sid": "6a3769de-da79-431d-85dd-0a1b96e2f7fd",
      "duid": "1f08df65-1558-46fc-b586-838460fc438e",
      "stm": "1665401016633"
    }
  ]
}
```

<details>
  <summary>cURL example</summary>

    ```bash
    curl --request POST \
      --url https://collector.website.com/com.snowplowanalytics.snowplow/tp2 \
      --header 'Content-Type: application/json' \
      --data '{
      "schema": "iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4",
      "data": [
        {
          "e": "pp",
          "url": "https://snowplow.io/",
          "page": "Snowplow: behavioral data creation leader",
          "eid": "0a88e2bf-a2cd-48e7-877b-608c4b3d32a6",
          "tv": "js-3.5.0",
          "tna": "snplow5",
          "aid": "website",
          "p": "web",
          "cookie": "1",
          "cs": "UTF-8",
          "lang": "en-GB",
          "res": "3440x1440",
          "cd": "30",
          "tz": "Europe/London",
          "dtm": "1665401016632",
          "cx": "",
          "vp": "693x1302",
          "ds": "678x9015",
          "vid": "52",
          "sid": "6a3769de-da79-431d-85dd-0a1b96e2f7fd",
          "duid": "1f08df65-1558-46fc-b586-838460fc438e",
          "stm": "1665401016633"
        }
      ]
    }'
    ```

</details>
