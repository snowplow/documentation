---
position: 5
title: Retrieve calculated attributes
---

For a real use case, you'll want to retrieve calculated attributes into your applications.

You can use the Python SDK and Node.js SDKs to retrieve attributes from the Profiles Store, or the Signals API directly. Read about these options [in the Signals documentation](/docs/signals/retrieval/).

For this tutorial, you'll retrieve attributes into your notebook. Add a new cell for getting values.

Unlike when testing views, which returns multiple random entities, when retrieving calculated attributes you have to specify an entity instance.

Pass in the name of the view, and the specific entity identifiers of interest. This example shows a `domain_sessionid` taken from the earlier test results table:

```python
response = sp_signals.get_online_attributes(
    source=my_view,
    identifiers=["d99f6db1-7b28-46ca-a3ef-f0aace99ed86"]
)

df=response.to_dataframe()
df
```

In your real application, you can access the current session ID and use it to retrieve the relevant attribute values. The attributes are being calculated in near real time, in session.

In this tutorial example, it's harder to access anything interesting, as you might not know what sessions are active.

|     | `domain_sessionid`                     | `page_view_count` | `most_recent_browser` | `first_referrer_path` |
| --- | -------------------------------------- | ----------------- | --------------------- | --------------------- |
| 0   | `d99f6db1-7b28-46ca-a3ef-f0aace99ed86` | None              | None                  | None                  |

Read about how to access IDs such as `domain_sessionid` in your web application in [Getting cookie information](/docs/sources/trackers/web-trackers/cookies-and-local-storage/getting-cookie-values/#getdomainuserid).
