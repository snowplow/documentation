---
title: "Data Model Packs"
sidebar_position: 8
sidebar_label: "Data Model Packs"
sidebar_custom_props:
  offerings:
    - bdp
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Snowplow Data Model Packs are self-service analytics tools that help you extract value from your data quickly by providing templated use-cases for data collection, modeling, and activation.

They are deployed in your cloud and aim to reduce the technical barrier, making data analysis more accessible beyond just SQL users. Each Data Model Pack contains a set of dashboard visualizations based on a Snowplow data model.

![Pipeline showing data flowing from tracked events into Data Model Packs](./images/data-apps-pipeline.png)

## Available Data Model Packs

| Data Model Pack              | Description                                   | Base dbt data model                                                                                                                                                                                                                       |
| ---------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ecommerce Analytics          | Reports inspired by Google Analytics v4       | [Ecommerce](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-ecommerce-data-model/index.md)                                                                                                                            |
| Funnel Builder               | Understanding user journeys                   | any                                                                                                                                                                                                                                       |
| User and Marketing Analytics | Analysis of web and mobile performance        | [Unified Digital](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) or [Web](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/legacy/dbt-web-data-model/index.md)           |
| Marketing Attribution        | Understand touchpoints and attribution models | [Unified Digital](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) and [Attribution](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-attribution-data-model/index.md) |
| Video and Media Analytics    | Insights into video and media performance     | [Media Player](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-media-player-data-model/index.md)                                                                                                                      |

## Access

You can find the Data Model Packs in the "Data Model Packs" section in the left sidebar of your Snowplow Console. A Data Model Pack can be in one of three states:
* **By request**: if you have not yet purchased a package that includes the Data Model Pack, click on “Learn more” and register your interest. A Snowplow Customer Success Manager will then get in contact with you to discuss getting access.
* **Available**: the Data Model Pack is ready to be set up. See the installation instructions below.
* **Live**: the Data Model Pack is ready to use.

Once the Data Model Pack is installed, clicking on the tile will launch it in a separate browser tab. By default, anyone in your Console organization will be able to access the Data Model Packs.

If you wish to invite others to use Data Model Packs but without giving them access to the rest of the Console, you can [create a new user](/docs/account-management/managing-users/adding-removing/index.md) with the `Data Model Packs user` role. That user will then only see the Data Model Packs tab within the Console. This permissions can be managed in the [usual way](/docs/account-management/managing-users/managing-permissions/index.md).

## Installation

You can install a Data Model Pack after purchase. Click the tile in the Console "Data Model Packs" section to begin installing it and follow the steps.

An example Data Model Pack tile:

![Data Model Pack tile showing start install process](images/install-app-tile.png)

During installation, you will need to [provide a connection](#warehouse-connections) to the warehouse you would like the Data Model Pack to use. It will also highlight any required pipeline and data model dependencies.

The installation workflow will look something like this:

![Data Model Pack install process](images/sample-app-install.png)

### Data model dependencies

Generally, Data Model Packs will depend on data models. If there are dependencies, the installation flow will highlight which models are required and what models you currently have [running via BDP](/docs/modeling-your-data/running-data-models-via-snowplow-bdp/standard-models/index.md). It will also highlight any properties that you need to enable or configure for these data models.

:::note Manual configuration for Open Source
If you are running the necessary data models yourself outside of BDP, then you will need to manually check that your setup satisfies the requirements for each Data Model Pack. These requirements are listed within the documentation pages for each Data Model Pack.
:::

## Warehouse connection

To install a Data Model Pack, you will need to create a connection to where your data model output or atomic table resides. You can do this as part of the installation process. The Data Model Pack will need secure credentials to fetch the required data.

You might have already set up a warehouse connection for loading and/or modeling the data. Data Model Packs, however, require a different connection, as you will often want them to run under a different user/role and with different permissions.

The connection process will look something like this:

![Data Model Pack warehouse connection process](images/add-connection.png)

Once you have selected a destination, provided the credentials, and run the suggested SQL script, the Console will test the connection. Upon a successful test, the Data Model Pack will be available to use.

## Using the Data Model Pack
### Is it running?
When the Data Model Pack is doing some calculations, querying the database, or otherwise still loading, you'll see the following gif in the top right:

<div style={{"background-color": '#F2F4F7'}}>
<img src={require("./images/icon_running.gif").default} alt="Gif of stick people running, swimming, etc." style={{"width":"50px"}}/>
</div>

You may particularly notice this on Data Model Packs with multiple tabs per page, as the tabs will load in order so the last tab may seem empty until this processing is completed.

### Configuration
Where the Data Model Pack has some configuration requirements it will also have a `Settings` page that will validate what is available to the Data Model Pack, and provide information for steps to take for any unfulfilled requirements.

### Chart sources
Many of our Data Model Packs support the exporting of the SQL used to generate the charts. In some cases, there may be a specific download button, but otherwise look for the ![](./images/download_sql.svg) icon. Click it to download the SQL used to make that chart.

Note that some data is processed further after the query to get it into the format required for plotting, which may include actions such as filtering, pivoting, etc.

### Help
Our Data Model Packs provide help text throughout: keep an eye out for the help icon (<Icon icon="fa-regular fa-circle-question"/>) to get more context or help in using some functionality.

### Log out
If you wish to log out of the Data Model Pack, you can do this from the sidebar. Note that this also logs you out of the Console.
