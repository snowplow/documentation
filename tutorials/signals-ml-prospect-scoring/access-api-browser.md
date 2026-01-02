---
title: Call the API to see prospect scores in your browser
sidebar_label: See scores in the browser
position: 6
description: "Deploy the prospect scoring API, and display real-time conversion predictions in the browser console."
keywords: ["flask api deployment", "browser javascript integration"]
---

The final requirement is to see the prospect scores and predictions in the browser. In this tutorial, we'll call the API every 10 seconds.

You need an API endpoint that you can access from your local machine, or from JavaScript in the browser.

In the previous step we used TryCloudflare tunnels to expose Colab notebook behind a public HTTPS endpoint. In the server output you will find your public URL similar to this one:

```
...
 * Running on https://aaa-bbb-ccc-ddd.trycloudflare.com
```

## Test with cURL

Test the endpoint using `cURL`, passing in your `domain_userid` that you got earlier using the Snowplow Inspector.

Update the URL with your TryCloudflare tunnel URL.

```bash
curl -X POST \
  "https://aaa-bbb-ccc-ddd.trycloudflare.com/predict" \
  -H "Content-Type: application/json" \
  -d '{"domain_userid": "8e554b10-4fcf-49e9-a0d8-48b6b6458df3"}'
```

You should see an output like this:

```json
{
  "score": 0.35080923483101656,
  "scoring_attributes": {
    "num_customers_views": 0,
    "num_page_views": 0,
    "num_pricing_views": 0
  },
  "signals": {
    "domain_userid": "00000000-1111-2222-3333-444455556666",
    "num_customers_views": null,
    "num_page_views": null,
    "num_pricing_views": null
  }
}
```

## See scores in the browser

Finally, run the code below in your browser console on your website to see your live prospect score. The code retrieves your `domain_userid` directly from the tracker, and calls the intermediary API to get the scores.

You may need to update this if your tracker name is different. Check the tracker name in outbound events using the Snowplow Inspector.

Run this in your browser console to see your predictions:

```js
let api_url = "https://aaa-bbb-ccc-ddd.trycloudflare.com/predict"; // UPDATE THIS
let tracker_name = "sp"; // MAYBE UPDATE THIS

// Calls the API every 10s from the front-end
setInterval(function () {
    // assuming the Snowplow tracker is available at 'window.snowplow(...)'
    window.snowplow(function () {
        // Gets domain_userid from the tracker instance
        var sp = this[tracker_name];
        var domainUserId = sp.getDomainUserId();

        // Calls the API
        fetch(api_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domain_userid: domainUserId })
        })
        .then(response => response.json())
        .then(result => {
            console.log("Prediction: ", domainUserId, " - ", result.score);

            // Acts on prediction
            if (result.score >= 0.9) console.log('Prospect is likely to convert!');
        })
        .catch(console.error);
    });
}, 10 * 1000);
```

Every 10 seconds it will print out the prediction score that you'll convert, as well as the full API response.

Adjust the timing interval to call the endpoint APIs as often as needed in your use case.

![](./images/console_output.png)

In a real use case, you'd be able to take actions based on these scores and predictions.
