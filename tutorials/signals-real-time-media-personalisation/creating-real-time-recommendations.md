---
title: Delivering Personalised Recommendations
position: 4
---

Now that you have defined your Snowplow Signals Attributes and created a View and Service to calculate them in real-time, it's time to integrate these attribute values into our Newspaper website to serve real-time personalised recommendations for users.

Within our NextJS app, we will create a `/api/recommended-articles` endpoint that will return a list of recommended articles based on a user's Snowplow Signals attributes.

In this tutorial, we will walk through the key components of the recommendation API endpoint code. If you wish to see the entire code recommendation API from this tutorial you can access it here.

If doing this within your own NextJS project you will need to install Snowplow Signals Node SDK:

```bash
npm install @snowplow/signals-node
```

---

### Initialising Snowplow Signals

You’ll need the following to connect to Snowplow Signals:

- **Signals API URL:** You can find this in Snowplow BDP Console
- **Signals API Key + Key ID:** Generate these within the [Snowplow BDP Console](https://console.snowplowanalytics.com/credentials)
- **Snowplow Organisation ID:** Find this in the URL of any BDP Console page, e.g. `https://console.snowplowanalytics.com/<organisation-id>/homepage`

Initialise Signals by entering in the details above as shown below:

```js
import { Signals } from "@snowplow/signals-node" 

const signals = new Signals({
  baseUrl: process.env.SIGNALS_API_URL || "",
  apiKey: process.env.SIGNALS_API_KEY || "",
  apiKeyId: process.env.SIGNALS_API_KEY_ID || "",
  organizationId: process.env.SIGNALS_ORG_ID || "",
});
```

---

### Extracting the Snowplow User ID

Within the GET request function, we will now extract the user’s cookie user ID from the API request cookie headers and pass it into our function call for Signals to get the online attributes for the user.

In this example we are using the `domain_userid` as specified in entity property when creating a Signals View in previous steps. You can follow similar steps if implementing with a `domain_sessionid` or a `network_userid`.

```js
import { cookies } from "next/headers"

const cookieStore = cookies()
const spCookie = cookieStore.get("_sp_id.1fff")?.value || "anonymous"

const spDomainUserId = spCookie.split(".")[0] || "anonymous"
const spDomainSessionId = spCookie.split(".")[5] || "anonymous"
```

---

### Retrieving the Snowplow Signals Attributes

Now we have the user cookie ID of the user we wish to fetch attributes for we can make a request to the Snowplow Signals Profile API.

We can fetch the attributes for a user by referring to the Service we created earlier:

```js
const attributes = await signals.getOnlineAttributes({
    entities: { domain_userid: [spDomainUserId] },
    service: "media_demo_service",
});
```

We can then extract the individual attributes to be used in our recommendation engine:

```js
const article_last_read = attributes['article_last_read']?.[0] ?? null;

const business_articles_read = attributes['article_category_business_read_count']?.[0] ?? 0;
const ai_articles_read = (attributes['article_category_ai_read_count']?.[0] ?? 0);
const data_articles_read = (attributes['article_category_data_read_count']?.[0] ?? 0);
const technlogy_articles_read = (attributes['article_category_technology_read_count']?.[0] ?? 0);
```

---

### Creating a Recommendation

In this simplified demo application our recommendations for newspaper articles are made by identifying the categories a user has read most frequently or the articles similar to the last article a user has read. This is a simple, yet powerful, way to personalise the experience for a user based on their behaviour.

In practice you may wish to have much more sophisticated recommendation logic, this could be implemented by passing a user's attributes from Signals into a machine learning algorithm and using that response to prioritise recommendations. This would allow for a more accurate and engaging personalised experience based on historical behavioural data of other users.

You can see below how the recommendation was implemented in this application:

```js
// Identify the user's interests based on the articles they have read. Use top 2 categories by read count
const interests = Object.entries({
  Business: business_articles_read,
  AI: ai_articles_read,
  Data: data_articles_read,
  Technology: technlogy_articles_read,
})
  .filter(([_, count]) => typeof count === "number" && count > 0)
  .sort(([, a], [, b]) => Number(b) - Number(a))
  .slice(0, 2)
  .map(([category]) => category);

let recommendedArticles = articles.filter((article) => interests.includes(article.category) && !articles_read.includes(article.slug))

// Limit to 3 articles and add a personalization score
recommendedArticles = recommendedArticles.slice(0, 3).map((article) => ({
  ...article,
  // Add a reason for the recommendation
  recommendationReason: `Based on your interest in ${article.category}`,
}))
```