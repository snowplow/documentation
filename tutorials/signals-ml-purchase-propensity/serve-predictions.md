---
title: "Score live sessions"
position: 5
sidebar_label: "Score live sessions"
description: "Serve a purchase propensity model behind a /predict endpoint that reads live session attributes from Signals, and watch the score change as you browse."
keywords: ["real-time ml inference", "predict endpoint", "fastapi", "signals api", "live scoring"]
date: "2026-10-25"
---

In this step you'll put the model behind a `/predict` endpoint. For each request, the endpoint fetches the session's current attributes from Signals, prepares them with the same `features.py` you used for training, and returns a score.

## Create the endpoint

Save this as `app.py`, in the same folder as `features.py` and `propensity_model.joblib`:

```python
# app.py
import os

import joblib
import pandas as pd
from fastapi import FastAPI
from snowplow_signals import Signals

from features import FEATURES, to_features

model = joblib.load("propensity_model.joblib")
sp_signals = Signals(
    api_url=os.environ["SP_API_URL"],
    api_key=os.environ["SP_API_KEY"],
    api_key_id=os.environ["SP_API_KEY_ID"],
    org_id=os.environ["SP_ORG_ID"],
)

app = FastAPI()


@app.get("/predict")
def predict(domain_sessionid: str):
    attributes = sp_signals.get_service_attributes(
        name="purchase_propensity_service",
        attribute_key="domain_sessionid",
        identifier=domain_sessionid,
    )
    X = to_features(pd.DataFrame([attributes]))
    score = float(model.predict_proba(X)[0, 1])
    return {
        "domain_sessionid": domain_sessionid,
        "score": round(score, 3),
        "attributes": {name: attributes.get(name) for name in FEATURES},
    }
```

Start it with your Signals credentials in the environment:

```bash
uvicorn app:app --reload
```

The response includes the attributes alongside the score, so you can see which values the model received.

## Watch the score change

Open your website in a new browser window, and use the [Snowplow Inspector](/docs/testing/snowplow-inspector/) to find the `domain_sessionid` of your session in any outgoing event.

Request a score for your session:

```bash
curl "http://localhost:8000/predict?domain_sessionid=YOUR_DOMAIN_SESSIONID"
```

At the start of the session, the counters are empty and the score is low:

```json
{
  "domain_sessionid": "4f1c2e8a-...",
  "score": 0.071,
  "attributes": {
    "page_views": 2,
    "product_views": null,
    "add_to_carts": null,
    "remove_from_carts": null,
    "checkout_steps": null,
    "minutes_in_session": 0.8
  }
}
```

Now view a few products, add one to your cart, and start the checkout. Request a score after each action. The attributes update within seconds of each event, and the score changes with them. The exact values depend on your model.

## Use the score in your application

Call `/predict` from wherever you need the score, for example from your site's backend when it renders a page, or after specific events such as a cart addition. Typical uses are to show a discount only to sessions that are unlikely to buy without one, or to offer live chat to sessions with a full cart and a falling score.

Before you act on scores, choose a threshold using the precision and recall from [Train the model](../train-model/), rather than a fixed value such as `0.5`. The training data overrepresents purchases, so the scores aren't calibrated probabilities.
