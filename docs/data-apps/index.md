---
title: "Data Applications"
sidebar_position: 112
sidebar_label: "🆕 Data Applications"
sidebar_custom_props:
  offerings:
    - bdp
---

Data applications are self-service analytics tools, deployed in your cloud, that help customers extract value from their data quickly by providing templated use-cases for data collection, modeling, and activation. They aim to reduce the technical barrier, making data analysis more accessible beyond just SQL users.

## Available Data Apps
<!-- This will become a table when we have more -->
```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```

## Accessing the Applications

You can find the Data Applications in the `Applications` tab in the left sidebar of your Snowplow Console. If the status is not `Live`, you can click on the tile and request access. A Snowplow Customer Success Manager will then get in contact with you to discuss the Snowplow Digital Analytics package.

Once the application is installed, clicking on the tile will launch the application in a separate browser tab. By default, anyone in your Console organization will be able to access data applications.

If you wish to invite others to use data applications but not have access to the rest of Console, you can [create a new user](/docs/using-the-snowplow-console/managing-users/adding-removing/index.md) and add a user with the `Data applications user` role. That user will then only see the Data Applications tab within Console. This permissions can be managed in the [usual way](/docs/using-the-snowplow-console/managing-users/managing-permissions/index.md).

## General Usage
### Is the app running?
When the app is doing some calculations, querying the database, or otherwise still loading, you'll see the following gif in the top right of the app. You may particularly notice this on applications with multiple tabs per page, as the tabs will load in order so the last tab may seem empty until this processing is completed.

<div style={{"background-color": '#F2F4F7'}}>
<img src={require("./images/icon_running.gif").default} alt="Gif of stick people running, swimming, etc." style={{"width":"50px"}}/>
</div>

### Setup
Where the app has some requirements it will also have a `Settings` page that will validate what is available to the app, and provide information for steps to take for any unfulfilled requirements.

### Chart Sources
Many of our apps support the exporting of the SQL used to generate the charts. In some cases, there may be a specific button in the app to do this, but for most cases simply look for the ![](./images/download_sql.svg) icon and click it to download the SQL used to make that chart!

:::info

Note that some data is processed further after the query to get in the format required for plotting, which may include actions such as filtering, pivoting, etc.

:::

### Help
Our apps provide useful help text throughout the apps, keep an eye out for the help icon (<Icon icon="fa-regular fa-circle-question"/>) to provide more context or help in using some functionality.

### Log Out
If you wish to Log out of the application, you can do this on the `Account` page of any application. Note this also logs you out of Console.
