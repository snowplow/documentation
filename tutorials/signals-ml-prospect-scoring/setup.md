---
title: Set up notebook
position: 2
description: "Configure Google Colab notebook with Snowplow Signals credentials for the prospect scoring machine learning tutorial."
---

This tutorial uses a Google Colab Juypter [notebook](https://colab.research.google.com/github/snowplow-incubator/signals-notebooks/blob/main/web/web_prospect_scoring_end_to_end.ipynb). Follow along in the notebook using your own data.

Start by configuring your credentials in the notebook. Go to **Signals** > **Overview** in Snowplow Console to find your Signals credentials. Add them, along with your warehouse and ngrok details, to the notebook secrets:

![](./images/colab_credentials.jpeg)

Here's a list of all the credentials you may need to configure, saved as variables:

```python
from google.colab import userdata

# Snowflake credentials to prepare a training dataset on top of atomic events table
ENV_SF_ACNT = userdata.get('SF_ACNT')   # Account
ENV_SF_USR = userdata.get('SF_USR')     # User
ENV_SF_PWD = userdata.get('SF_PWD')     # Password
ENV_SF_WH = userdata.get('SF_WH')       # Warehouse

# Snowplow Signals credentials
ENV_SP_API_URL = userdata.get('SP_API_URL')       # Signals API URL
ENV_SP_API_KEY = userdata.get('SP_API_KEY')       # Signals API key
ENV_SP_API_KEY_ID = userdata.get('SP_API_KEY_ID') # Signals API key ID
ENV_SP_ORG_ID = userdata.get('SP_ORG_ID')         # Snowplow org ID

# Snowflake Snowplow atomic table
ENV_ATOMIC_TABLE = userdata.get('ATOMIC_TABLE')

# ngrok token to be able to expose the notebook behind HTTPS for querying the API
ENV_NGROK_TOKEN = userdata.get('NGROK_TOKEN')
```

Adjust these to suit your warehouse authentication methods.

Once you've added the secrets, start working through the tutorial. If you prefer to run the cells in one go with Run all, update your details in the required places first - they're marked with `UPDATE THIS`.
