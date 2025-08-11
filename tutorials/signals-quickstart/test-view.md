---
position: 4
title: Test the definitions
---

Signals will start processing events and computing attributes as soon as you apply the attribute group configuration.

It's a good idea to test the definitions before deployment.

Add a new cell to your notebook with the following code:

```python
data = sp_signals.test(
    attribute_group=my_attribute_group
)
print(data)
```

Running this will calculate the attributes from your atomic events table. By default, events from the last hour are considered.

You should see something like this:

|     | `domain_sessionid`                     | `page_view_count` | `most_recent_browser` | `first_referrer` |
| --- | -------------------------------------- | ----------------- | --------------------- | ---------------- |
| 0   | `d99f6db1-7b28-46ca-a3ef-f0aace99ed86` | 0                 | "Firefox"             | None             |
| 1   | `08d833ec-5eef-461c-b452-842e7bd27067` | 1                 | "Chrome"              | "www.google.com" |
| 2   | `c4311466-231a-41ca-89d8-f2ff85e62a29` | 0                 | "Chrome"              | "duckduckgo.com" |
| 3   | `23937e09-b640-447e-82d9-c01bc16decb2` | 0                 | "Chrome"              | "www.google.com" |
| 4   | `61fb46c9-bfd3-48cd-a991-7a8484d1de8c` | 0                 | None                  | None             |
| 5   | `b0625a55-8382-4bfb-be9f-fefd75ad7e63` | 1                 | "Chrome"              | None             |
| 6   | `d97140c3-3c5e-426e-8527-15314efb2be3` | 0                 | "Chrome"              | None             |
| 7   | `4da52032-f6d1-41b4-9cf2-b40e164cbe6e` | 1                 | "Chrome"              | None             |
| 8   | `2ee80a4a-86dd-4a24-b697-0709b29ed079` | 0                 | "Safari"              | None             |

The test method returns results from a random 10 attribute key values. The first column shows the attribute key values, in this case for the session attribute key `domain_sessionid`.

The attributes look as expected, so the attribute group is ready to deploy.

## Testing for individual entities

You can also test specific attribute key instances, by providing a list of IDs.

This example will be calculated for just these two `domain_sessionid`s:

```python
data = sp_signals.test(
    attribute_group=my_attribute_group,
    attribute_key_ids=["d99f6db1-7b28-46ca-a3ef-f0aace99ed86", "08d833ec-5eef-461c-b452-842e7bd27067"]
)
```

|     | `domain_sessionid`                     | `page_view_count` | `most_recent_browser` | `first_referrer` |
| --- | -------------------------------------- | ----------------- | --------------------- | ---------------- |
| 0   | `d99f6db1-7b28-46ca-a3ef-f0aace99ed86` | 0                 | "Firefox"             | None             |
| 1   | `08d833ec-5eef-461c-b452-842e7bd27067` | 1                 | "Chrome"              | "www.google.com" |

## Testing on a subset of events

Depending on your Snowplow tracking configuration, you might want to test only on events from specific applications, using `app_ids`:

```python
data = sp_signals.test(
    attribute_group=my_attribute_group,
    app_ids=["website"],
)
print(data)
```

If you don't see any results, check your Signals configuration to confirm that it's processing events from those `app_id`s.
