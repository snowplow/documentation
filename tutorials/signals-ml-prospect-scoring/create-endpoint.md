---
title: Create intermediary API endpoint
position: 5
description: "Build an API endpoint to serve Snowplow Signals attributes and ML predictions for real-time prospect scoring."
---

You now have attribute values in your Profiles Store, and a trained ML model. The next step is to create and deploy an endpoint to serve attributes and predictions.

It needs to do the following:
* Get calculated attribute values from Signals
* Score the values using the model
* Return the results

This tutorial uses Flask together with TryCloudflare tunnels to expose the API endpoint outside of the Colab notebook environment.

## Install dependencies

Run `%pip install flask-cloudflared` to install the required libraries.

## Create ML scoring endpoint

Start by loading your model, and defining the methods needed to retrieve and process your Signals data.

```python
from flask import Flask, request
from flask_cloudflared import run_with_cloudflared

# Define and launch Colab API Proxy
app = Flask(__name__)
run_with_cloudflared(app) # Open Cloudflared demo tunnel

# Load model
model = joblib.load("model.joblib")

# Process the Signals data for individual domain_userids
def get_duid_values(duid: str):
    # Retrieve attributes from Signals
    response = sp_signals.get_service_attributes(
        name="prospect_scoring_tutorial_service",
        attribute_key="domain_userid",
        identifier=duid,
    )
    signals_df = pd.DataFrame([response])
    # Prepare ML dataframe
    ml_df = signals_df.fillna(0).reindex(columns=x_columns, fill_value=0)
    return (signals_df, ml_df)

# Score the data against the model
def get_predictions(df):
    return float(model.predict_proba(df)[:, 1][0])

@app.route("/predict", methods=['POST'])
def predict():
    input_dict = request.get_json() # Parse JSON input

    # Get Signals data and prepare dataframe for scoring
    signals_df, ml_df = get_duid_values(input_dict['domain_userid'])

    # Score dataframe using the trained model
    prediction = get_predictions(ml_df)

    # Return the result
    print(f"P: {round(prediction, 4)} - {input_dict}")
    return {
        "signals": signals_df.to_dict(orient='records')[0],
        "scoring_attributes": ml_df.to_dict(orient='records')[0],
        "score": prediction
    }

app.run()
```

This `/predict` endpoint does four things:

1. Receives a `domain_userid`
2. Calls the Signals API to get the current attribute values, using the `prospect_scoring_tutorial_service` service
3. Scores the attribute values using the ML model
4. Returns Signals attributes, and ML prediction score
