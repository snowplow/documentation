---
title: Running the travel demo website
position: 2
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
```

We will now run the example travel website that we will use to explore how we can personalize the experience using Snowplow Signals before we design the attributes themselves.

1. Ensure you have `docker` installed locally.

2. Clone the Snowplow Local repository to your machine.
```
git clone git@github.com:snowplow-incubator/snowplow-local.git
```

3. Change directory into the `snowplow-local` folder and open the `.env` file with the following variables in order for Signals to function correctly.
```
cd snowplow-local
cp .env.example .env
```

Edit the `.env` file with the following variables.

<Tabs groupId="cloud" queryString lazy>
  <TabItem value="bdp" label="BDP" default>

  <CodeBlock language="bash">
NEXT_PUBLIC_SNOWPLOW_SIGNALS_API_URL=signals.snowplow.com
SNOWPLOW_SIGNALS_API_KEY=
SNOWPLOW_SIGNALS_API_KEY_ID=
SNOWPLOW_SIGNALS_ORGANIZATION_ID=
NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL=
</CodeBlock>
  </TabItem>
  <TabItem value="sandbox" label="Sandbox">
    <CodeBlock language="bash">
NEXT_PUBLIC_SNOWPLOW_SIGNALS_API_URL=sandbox.signals.snowplow.com
SNOWPLOW_SIGNALS_INGEST_URL=
SNOWPLOW_SIGNALS_TRIAL_TOKEN=
    </CodeBlock>
  </TabItem>
</Tabs>

For BDP, in order to use the Signals API, you'll need four pieces of information.
* Your Snowplow organization ID (this can be found in the Snowplow Console)
* Your Snowplow Signals API URL (this can found in the 'Signals' part of the Snowplow Console)
* Your Snowplow API key and API key id (this can be generated under the 'API keys for managing Snowplow' section [here](https://console.snowplowanalytics.com/settings))

For Signals Sandbox please see your Sandbox dashboard for your Signals API URL, Ingest URL and trial token.

4. If you are using an agent setup set your 

In order to use the agent you will need either a OpenAI API key (OPENAI_API_KEY) or an AWS Bearer token for Bedrock (AWS_BEARER_TOKEN_BEDROCK).

If using Bedrock please ensure the Claude Sonnet model has been enabled and you accept the terms of service in the AWS console.

5. Run the following Docker command


<Tabs groupId="cloud" queryString lazy>
  <TabItem value="bdp" label="BDP" default>

  <CodeBlock language="bash">
docker compose --profile travel-site up
</CodeBlock>
  </TabItem>
  <TabItem value="sandbox" label="Sandbox">
    <CodeBlock language="bash">
    docker compose --profile travel-site --profile signals up
    </CodeBlock>
  </TabItem>
</Tabs>

5. Open the travel website in your browser at [http://localhost:8086](http://localhost:8086). You should now see the homepage of the travel site loaded successfully.


6. Open the dev console (Ctrl+Shift+I) in your browser and open the Snowplow Inspector tab. Click on some filters on the [destinations](http://localhost:8086/destinations) page (e.g., 'Food') to observe some events firing - you should now see some self-describing events firing into your Snowplow pipeline.

Now that you have the website up and run feel free to explore the site a little bit and think about what attributes we might be able to define in Signals in order to customize the site towards the behavior and preferences of a user.

In the next step we will go ahead and define the attributes we will use to personalize the site.