---
title: Create API endpoint
position: 5
---

You now have attribute values in your Profiles Store, and a trained ML model. The next step is to create and deploy an endpoint to serve attributes and predictions.

It needs to do the following:
* Get calculated attribute values from Signals
* Score the values using the model
* Return the results

This tutorial uses FastAPI for the endpoint, and ngrok to expose it outside of the Colab notebook.

## Install dependencies

Run `pip install fastapi nest-asyncio pyngrok uvicorn` to install the required libraries.

## Define methods

Start by loading your model, and defining the methods needed to retrieve and process your Signals data.

```python
TODO imports

# Load model
model = joblib.load("xgb_model.joblib")
explainer = joblib.load("shap_explainer.joblib") # shap.Explainer(model.named_steps['classifier'])

# Retrieve attributes from Signals
sp_view = sp_signals.get_view("prospect_scoring")

# Input schema
class InputData(BaseModel):
    domain_userid: str
    # ... add more input columns if needed

# API
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Process the Signals data for individual domain_userids
def get_duid_values(duid: str):
    response = sp_view.get_attributes(
        signals=sp_signals,
        identifier=duid
    )
    df = pd.DataFrame([response])

    # Add your own custom columns and filters
    get_len = lambda x: len(x) if hasattr(x, '__len__') else 0
    df['day_of_week'] = datetime.date.today().isoweekday()
    df[df.filter(like="num_").columns] = df.filter(like="num_").fillna(0)

    # Switch counter columns to booleans
    df['had_conversions_l7d'] = (df['num_conversions_l7d'] > 0).astype(int)
    df['had_conversions_l30d'] = (df['num_conversions_l30d'] > 0).astype(int)
    df = df.drop(columns=['num_conversions_l7d', 'num_conversions_l30d'])

    # Switch unique arrays to amounts
    df['num_sessions_l7d'] = df['num_sessions_l7d'].apply(get_len)
    df['num_apps_l7d'] = df['num_apps_l7d'].apply(get_len)
    df['num_sessions_l30d'] = df['num_sessions_l30d'].apply(get_len)
    df['num_apps_l30d'] = df['num_apps_l30d'].apply(get_len)
    df['num_engaged_campaigns_l30d'] = df['num_engaged_campaigns_l30d'].apply(get_len)

    # Reorder columns to follow the training order
    df = df.reindex(columns=x_columns, fill_value=0)
    return (df, pd.DataFrame([response]))

# Prepare explanations
def get_prediction_explanations(df, top_n=5):
    # Calculate shap values
    df_transformed = model.named_steps['preprocessor'].transform(df) #.toarray()
    feature_names = model.named_steps['preprocessor'].get_feature_names_out()
    df_transformed_df = pd.DataFrame(df_transformed, columns=feature_names)
    shap_values = explainer(df_transformed_df)
    feature_contributions = dict(zip(
        feature_names,
        shap_values.values[0]
    ))
    # Group feature names: cat__feat_one_value1 -> feat_one
    grouped = defaultdict(float)
    for feat, val in feature_contributions.items():
        base = feat[5:].rsplit('_', 1)[0] if feat.startswith('cat__') else feat.split('__', 1)[1]
        grouped[base] += val
    sorted_grouped = dict(sorted(grouped.items(), key=lambda x: abs(x[1]), reverse=True))
    top_items = dict(list(sorted_grouped.items())[:top_n])
    sum_of_others = sum(sorted_grouped.values()) - sum(top_items.values())
    top_items["__sum_of_others"] = sum_of_others
    top_items = {k: float(v) for k, v in top_items.items()}
    return top_items

# Score the data against the model
def get_predictions(df, explanations=None):
    prediction = float(model.predict_proba(df)[:, 1][0])
    if explanations is None:
        return prediction
    top_contributors = get_prediction_explanations(df, explanations)
    return (prediction, top_contributors)
```

## Create endpoint

Create a `POST` HTTP endpoint using FastAPI.

```python
@app.post("/predict")
def predict(data: InputData):
    input_dict = data.model_dump()

    # Get Signals data and prepare dataframe for scoring
    df, signals_response = get_duid_values(input_dict['domain_userid'])

    # Score the dataframe using the trained model
    prediction, explanations = get_predictions(df, 5)

    # Return the result
    print(f"P: {round(prediction, 4)} - {input_dict}")
    return {
        "signals": signals_response.to_dict(orient='records')[0],
        "scoring_attributes": df.to_dict(orient='records')[0],
        "explanations": explanations,
        "score": prediction
    }
```

This `/predict` endpoint does four things:

1. Receives `domain_userid`
2. Calls the Signals API to get the latest attribute values using `sp_signals.get_online_attributes(...)` API TODO
3. Scores the attribute values using the ML model
4. Returns Signals attributes, a ML prediction score, and ML prediction explanations

For example, in order to get live Signals Attributes for a `domain_userid` one can use this Signals API: TODO

```python
def get_duid_values(duid: str):
    response = sp_signals.get_online_attributes(
        sp_view,
        duid
    )
    df = response.to_dataframe()
    ...
```
