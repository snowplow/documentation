---
title: "Model Selection"
sidebar_position: 2
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## YAML Selectors

The Snowplow models in each package are designed to be run as a whole, which ensures all incremental tables are kept in sync. As such, run the model using:

```bash
dbt run --select snowplow_<package> tag:snowplow_<package>_incremental
```
The `snowplow_<package>` selection will execute all nodes within the relevant Snowplow package, while the `tag:snowplow_<package>_incremental` will execute all custom modules that you may have created.

Given the verbose nature of this command we suggest using the YAML selectors we have provided. The equivalent command using the selector flag would be:

```bash
dbt run --selector snowplow_<package>
```

Within the packages we have provided a suite of suggested selectors to run and test the models within the packages. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax).

<Tabs groupId="dbt-packages" queryString>
<TabItem value="web" label="Snowplow Web" default>

- `snowplow_web`: Recommended way to run the package. This selection includes all models within the Snowplow Web as well as any custom models you have created
- `snowplow_web_lean_tests`: Recommended way to test the models within the package. See the testing section for more details

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

- `snowplow_mobile`: Recommended way to run the package. This selection includes all models within the Snowplow Mobile as well as any custom models you have created
- `snowplow_mobile_lean_tests`: Recommended way to test the models within the package. See the testing section for more details

</TabItem>
<TabItem value="media" label="Snowplow Media Player">

- `snowplow_web`:  Recommended way to run the package. This selection includes all models within the Snowplow Web and Snowplow Media Player as well as any custom models you have created
- `snowplow_web_lean_and_media_player_tests`: Recommended way to test the models within the package. See the testing section for more details
- `snowplow_media_player_tests`: Runs all tests within the Snowplow Media Player Package and any custom models tagged with `snowplow_media_player`
- `snowplow_web_and_media_player_tests`: Runs all tests within the Snowplow Web and Snowplow Media Player Package and any custom models tagged with `snowplow_media_player` or `snowplow_web_incremental`

</TabItem>
<TabItem value="normalize" label="Snowplow Normalize">

- `snowplow_normalize`:  Recommended way to run the package. This selection includes all models within the Snowplow Normalize package as well as any custom models you have created

</TabItem>

<TabItem value="ecommerce" label="Snowplow E-commerce">

- `snowplow_ecommerce`: Recommended way to run the package. This selection includes all models within the Snowplow E-commerce as well as any custom models you have created
- `snowplow_ecommerce_lean_tests`: Recommended way to test the models within the package. See the testing section for more details

</TabItem>
</Tabs>


These are defined in each `selectors.yml` file within the packages, however in order to use these selections you will need to copy this file into your own dbt project directory. This is a top-level file and therefore should sit alongside your `dbt_project.yml` file. If you are using multiple packages in your project you will need to combine the contents of these into a single file.


## Specific Model Selection

You may wish to run the modules asynchronously, for instance run the page views module hourly but the sessions and users modules daily. You would assume this could be achieved using e.g.:

```bash title="Do not do this"
dbt run --select +snowplow_web.page_views
```

Currently however it is not possible during a dbt job's start phase to deduce exactly what models are due to be executed from such a command. This means the package is unable to select the subset of models from the manifest. Instead all models from the standard and custom modules are selected from the manifest and the package will attempt to synchronize all models. This makes the above command unsuitable for asynchronous runs.

However we can leverage dbt's `ls` command in conjunction with shell substitution to explicitly state what models to run, allowing a subset of models to be selected from the manifest and thus run independently.


For example to run just the page views module asynchronously:

```bash title = "Do this instead"
dbt run --select +snowplow_web.page_views --vars "{'models_to_run': '$(dbt ls --m  +snowplow_web.page_views --output name)'}"
```
