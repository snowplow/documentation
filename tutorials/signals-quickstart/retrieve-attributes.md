---
position: 5
title: Retrieve attributes
---

Now that events are being processed, you can retrieve user features from the API:

```python
# Option 1 (if you have the View instance):
response = my_attribute_view.get_attributes(
    signals=sp_signals,
    identifier="abc-123",
)
# Option 2 (if you don't have the View instance):
response = sp_signals.get_view_attributes(
    name="my_attribute_view",
    version=1,
    attributes=["page_view_count", "products_added_to_cart"]
    entity="domain_sessionid",
    identifiers="abc-123",
)
```

Expected Output

| **domain_sessionid** | **page_view_count** | **products_added_to_cart** |
| -------------------- | ------------------- | -------------------------- |
| abc-123              | 3                   | [`blue_shoes`]             |
