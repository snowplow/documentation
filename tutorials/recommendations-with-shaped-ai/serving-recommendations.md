---
title: Serving Recommendations
position: 5
---

After the model is calculated in Shaped.ai, we can retrieve recommendation results utilizing their Rank API. This can be done in different ways. For instance, through a CLI command:

```sh
$ shaped rank --model-name testing_snowplow_model --user-id 8a6fa6f8-7e0f-4ec5-bf38-94883fd7da6f
```

In a normal execution, recommendations will be a `RankResponse` object with two main properties: `ids` and `scores`. Each `id` pairs with each `score`. According to Shaped.ai docs on the topic, each score...

> has the respective relevance confidence we have that this item is relevant to the query user. You can use this to get a bit more of an understanding of how the relevancy estimates change throughout the ranking.

The previous example makes it very easy to build a small recommendations service that can be publicly accessible. The complete API is a very good way to learn how to use Shaped.ai APIs in any stack, as well as showcasing additional endpoints that can be used. For instance:

```py
import shaped

SHAPED_AI_API_KEY = 'your-shaped-ai-api-key'

client = shaped.Client(SHAPED_AI_API_KEY)

# Fetch similar items
similar_items = client.similar_items(
    "testing_snowplow_model",
    "48538257883436"
)

print(similar_items)
```

With this as a basis, we might add this logic to any server endpoint, passing the user ID as a query string parameter, or a body parameter, retrieving the item IDs we need for the personalization, as well as additional infomation about each item.