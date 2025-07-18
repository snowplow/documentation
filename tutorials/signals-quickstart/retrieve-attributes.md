---
position: 5
title: Retrieve attributes
---

Now that events are being processed, you can retrieve user features from the API:

```python
response = sp_signals.get_online_attributes(
    source=my_attribute_view,
    identifiers="abc-123",
)
```

Expected Output

| **domain_sessionid** | **page_view_count** | **products_added_to_cart** |
| -------------------- | ------------------- | -------------------------- |
| abc-123              | 3                   | [`blue_shoes`]             |
