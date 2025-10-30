---
position: 2
title: Set up your Signals connection
description: "Enable Signals through Snowplow Console or deploy a Signals Sandbox instance and obtain your access credentials."
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The first step is to set up your Signals connection. Follow the instructions in the [Signals connection documentation](/docs/signals/connection/) for your chosen deployment method:

- **Snowplow Console**: [enable Signals through Snowplow Console](/docs/signals/connection/#snowplow-console) if you have a Snowplow account
- **Signals Sandbox**: [deploy a Sandbox instance](/docs/signals/connection/#signals-sandbox) to experiment without a Snowplow account

Once your connection is set up, gather the required credentials as described in the [connection credentials section](/docs/signals/connection/#connection-credentials).

## Set up your Jupyter notebook environment

You can use either Google Colab or a local Jupyter notebook environment for this tutorial.

If you want to skip ahead, you can make use of the following notebook that contains all the Python code you'll need for this tutorial:

1. [Python notebook on Google Colab](https://colab.research.google.com/github/snowplow-incubator/signals-interventions-demo/blob/main/attributes_and_interventions.ipynb)
2. [Jupyter notebook on GitHub](https://github.com/snowplow-incubator/signals-interventions-demo/blob/main/attributes_and_interventions.ipynb)

### Using Google Colab

You can use the provided notebook, or create your own. To create a new notebook, open a new notebook at [Google Colab](https://colab.research.google.com/).

You'll need to add credentials as Colab secrets. Click the key icon in the left sidebar, and add the required secrets:

<Tabs groupId="connection" queryString>
<TabItem value="console" label="Snowplow Console" default>

- `SP_API_URL`: your Signals API URL
- `SP_API_KEY`: your API key
- `SP_API_KEY_ID`: your API key ID
- `SP_ORG_ID`: your Snowplow Console organization ID

</TabItem>
<TabItem value="sandbox" label="Signals Sandbox">

- `SP_API_URL`: your Profiles API URL
- `SP_SANDBOX_TOKEN`: your Sandbox Token

</TabItem>
</Tabs>

When you run the notebook, it will ask for access to the secrets. Choose to grant access.

If you're using your own notebook, follow these steps:

1. Install the Signals Python SDK:

```python
%pip install snowplow-signals
```

2. Load your credentials in the notebook:

<Tabs groupId="connection" queryString>
<TabItem value="console" label="Snowplow Console" default>

```python
from google.colab import userdata
import os

os.environ["SP_API_URL"] = userdata.get('SP_API_URL')
os.environ["SP_API_KEY"] = userdata.get('SP_API_KEY')
os.environ["SP_API_KEY_ID"] = userdata.get('SP_API_KEY_ID')
os.environ["SP_ORG_ID"] = userdata.get('SP_ORG_ID')
```

</TabItem>
<TabItem value="sandbox" label="Signals Sandbox">

```python
from google.colab import userdata
import os

os.environ["SP_API_URL"] = userdata.get('SP_API_URL')
os.environ["SP_SANDBOX_TOKEN"] = userdata.get('SP_SANDBOX_TOKEN')
```

</TabItem>
</Tabs>

### Using local Jupyter

Navigate into your working directory and environment, then follow these steps:

1. Install Jupyter and the Signals SDK:

```bash
pip install jupyter snowplow-signals python-dotenv
```

2. Create a `.env` file in your working directory with your credentials:

<Tabs groupId="connection" queryString>
<TabItem value="console" label="Snowplow Console" default>

```text
SP_API_URL=your_signals_api_url
SP_API_KEY=your_api_key
SP_API_KEY_ID=your_api_key_id
SP_ORG_ID=your_organization_id
```

</TabItem>
<TabItem value="sandbox" label="Signals Sandbox">

```text
SP_API_URL=your_profiles_api_url
SP_SANDBOX_TOKEN=your_sandbox_token
```

</TabItem>
</Tabs>

3. Start Jupyter notebook:

```bash
jupyter notebook
```

4. In your notebook, load the environment variables:

```python
from dotenv import load_dotenv
load_dotenv()
```

## Connect to Signals

Now you're ready to connect to your Signals instance using the Python SDK.

<Tabs groupId="connection" queryString>
  <TabItem value="console" label="Snowplow Console" default>

```python
from snowplow_signals import Signals
import os

sp_signals = Signals(
    api_url=os.environ["SP_API_URL"],
    api_key=os.environ["SP_API_KEY"],
    api_key_id=os.environ["SP_API_KEY_ID"],
    org_id=os.environ["SP_ORG_ID"],
)
```

  </TabItem>
  <TabItem value="sandbox" label="Signals Sandbox">

```python
from snowplow_signals import SignalsSandbox
import os

sp_signals = SignalsSandbox(
    api_url=os.environ["SP_API_URL"],
    sandbox_token=os.environ["SP_SANDBOX_TOKEN"],
)
```

:::tip

The `SignalsSandbox` class is specifically designed for Sandbox environments. For production Snowplow deployments, you would use the `Signals` class instead, which requires API keys.

:::

  </TabItem>
</Tabs>

You're now ready to start defining attributes and interventions in Signals.
