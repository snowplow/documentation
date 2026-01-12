---
title: "Adjust webhook"
sidebar_label: "Adjust"
sidebar_position: -1
description: "Track mobile attribution data including app installation and reattribution events from Adjust callbacks using the Iglu webhook adapter."
keywords: ["adjust webhook integration", "mobile attribution tracking", "adjust callback snowplow"]
---

[Adjust](https://www.adjust.com/) provides a mobile attribution platform. It enables users to track what marketing channels drive mobile app installations.

Many Snowplow users who have mobile apps use Adjust to capture the sources (marketing channels) that drive app downloads. By integrating Adjust with Snowplow, it is straightforward to:

1. Have your mobile attribution data (at the app installation event-level), with the rest of your event-level data, in Snowplow
2. Join app installation data collected from Adjust, with other user event data collected through Snowplow from mobile, web or other platforms, in order to analyze the performance of those marketing channels and return on ad spend. This is typically used to drive future ad spend.

Integrating Adjust with Snowplow is straightforward. In this guide we will walk through the process.

## How the integration works: an overview

The integration uses the [Adjust Callback](https://docs.adjust.com/en/callbacks/). We will configure this to send an app install event to the Snowplow collector when an app is installed, with the attribution data attached. In addition, we will set this up to send a reattribution event every time this occurs in Adjust to Snowplow. Again, this will contain all the data we need to figure out what drove an earlier app installation.

On the Snowplow side, we will use the [Iglu webhook adapter](/docs/sources/webhooks/iglu-webhook/index.md) to ensure that the event is correctly received and processed. We will create a schema for the event that matches the structure of the data sent from Adjust.

The guide is illustrative. One of the nice things about Adjust is that it gives you a huge amount of flexibility about what data you want to send into Snowplow and how. One of the great things about Snowplow is that it is flexible enough to work with very many structures of data, just so long as it knows the schema that the data adheres to. So there are lots of ways you can adapt the following setup. It should be a good start for most users however.

## Step-by-step guide

### 1. Setup the Adjust webhook

Log into Adjust and navigate to Settings -> Events screen in the dashboard. Hover over the install event, click the “edit” icon that appears and enter the following, substituting your own collector URL for `mycollector.mydomain.com`:

```markup
http://mycollector.mydomain.com/com.snowplowanalytics.iglu/v1?schema=iglu%3Acom.adjust%2Finstall%2Fjsonschema%2F1-0-0&app_id={app_id}&app_name={app_name}&app_name_dashboard={app_name_dashboard}&store={store}&tracker={tracker}&tracker_name={tracker_name}&network_name={network_name}&campaign_name={campaign_name}&adgroup_name={adgroup_name}&creative_name={creative_name}&impression_based={impression_based}&is_organic={is_organic}&gclid={gclid}&rejection_reason={rejection_reason}&click_referer={click_referer}&click_attribution_window={click_attribution_window}&impression_attribution_window={impression_attribution_window}&reattribution_attribution_window={reattribution_attribution_window}&inactive_user_definition={inactive_user_definition}&adid={adid}&idfa={idfa}&android_id={android_id}&android_id_md5={android_id_md5}&mac_sha1={mac_sha1}&mac_md5={mac_md5}&idfa-android-id={idfa||android_id}&idfa-or-gps-adid={idfa||gps_adid}&idfa_md5={idfa_md5}&idfa_md5_hex={idfa_md5_hex}&idfv={idfv}&gps_adid={gps_adid}&gps_adid_md5={gps_adid_md5}&win_udid={win_udid}&win_hwid={win_hwid}&win_naid={win_naid}&win_adid={win_adid}&match_type={match_type}&reftag={reftag}&referrer={referrer}&user_agent={user_agent}&ip_address={ip_address}&click_time={click_time}&engagement_time={engagement_time}&installed_at={installed_at}&installed_at_hour={installed_at_hour}&created_at={created_at}&reattributed_at={reattributed_at}&connection_type={connection_type}&isp={isp}&city={city}&country={country}&language={language}&device_name={device_name}&device_type={device_type}&os_name={os_name}&api_level={api_level}&sdk_version={sdk_version}&os_version={os_version}&environment={environment}&tracking_enabled={tracking_enabled}&timezone={timezone}&fb_campaign_group_name={fb_campaign_group_name}&fb_campaign_group_id={fb_campaign_group_id}&fb_campaign_name={fb_campaign_name}&fb_campaign_id={fb_campaign_id}&fb_adgroup_name={fb_adgroup_name}&fb_adgroup_id={fb_adgroup_id}&tweet_id={tweet_id}&twitter_line_item_id={twitter_line_item_id}&label={label}
```

We are collecting the data by adding key-value pairs to request in the format `data_point={data_point}`. The first part of each pair is the name of the field in the collected event and it must match a property name in your schema. The second part, in curly braces, is a placeholder that Adjust replaces with an actual value before making the callback. For example, `app_id={app_id}` will be transformed to something like `app_id=C013FJP3WF`.

In our example webhook setup above we’re using the schema that is defined further down in this post, but you are a free to use any custom compatible schema. There is no requirement that the key in each key-value pair must match the spelling of the respective Adjust placeholder, so your schema can have properties with names that better match your own business logic, e.g. `adjust_tracker={tracker}`.

We have elected to grab _all_ the data that Adjust makes available with an install event (at the time of writing).

For a complete list of data Adjust can send, see the [Adjust placeholder documentation](https://partners.adjust.com/placeholders/).

At the end of this post we’ll describe how you can tailor your setup to grab just a subset.

### 2. Create the corresponding jsonschema

In order for Snowplow to process the data sent to the Iglu webhook, we need to schema it.

_Since first publishing this guide, we’ve added an Adjust `install` event schema to our [Iglu Central](https://github.com/snowplow/iglu-central) schema repository. You can find it [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.adjust/install/jsonschema/1-0-0). We recommend using that schema for out-of-the-box tracking of all the data points associated with an `install` event (at the time the schema was written), rather than the example schema used further down. If you’re using Redshift you might also find the [table definition](https://github.com/snowplow/iglu-central/blob/master/sql/com.adjust/install_1.sql) and [JSONpaths file](https://github.com/snowplow/iglu-central/blob/master/jsonpaths/com.adjust/install_1.json) from Iglu Central useful. For Snowflake and BigQuery users, the loader app in the pipeline will figure those out itself._

_Refer to the rest of this guide to see how you can write your own custom schemas._

Upload the following schema to your Iglu repo as `com.adjust.snowplow/install/jsonschema/1-0-0`:

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for Adjust install event",
  "self": {
    "vendor": "com.adjust.snowplow",
    "name": "install",
    "format": "jsonschema",
    "version": "1-0-0"
  },

  "type": "object",
  "properties": {
    "app_id": {
      "type": "string"
    },
    "app_name": {
      "type": "string",
      "maxLength": 256
    },
    "app_name_dashboard": {
      "type": "string",
      "maxLength": 256
    },
    "store": {
      "type": "string",
      "maxLength": 256
    },
    "tracker": {
      "type": "string",
      "maxLength": 256
    },
    "tracker_name": {
      "type": "string",
      "maxLength": 256
    },
    "network_name": {
      "type": "string",
      "maxLength": 256
    },
    "campaign_name": {
      "type": "string",
      "maxLength": 256
    },
    "adgroup_name": {
      "type": "string",
      "maxLength": 256
    },
    "creative_name": {
      "type": "string",
      "maxLength": 256
    },
    "impression_based": {
      "type": "string",
      "maxLength": 256
    },
    "is_organic": {
      "type": "string",
      "maxLength": 256
    },
    "gclid": {
      "type": "string",
      "maxLength": 256
    },
    "rejection_reason": {
      "type": "string",
      "maxLength": 256
    },
    "click_referer": {
      "type": "string",
      "maxLength": 256
    },
    "click_attribution_window": {
      "type": "string",
      "maxLength": 256
    },
    "impression_attribution_window": {
      "type": "string",
      "maxLength": 256
    },
    "reattribution_attribution_window": {
      "type": "string",
      "maxLength": 256
    },
    "inactive_user_definition": {
      "type": "string",
      "maxLength": 256
    },
    "adid": {
      "type": "string",
      "maxLength": 256
    },
    "idfa": {
      "type": "string",
      "maxLength": 256
    },
    "android_id": {
      "type": "string",
      "maxLength": 256
    },
    "android_id_md5": {
      "type": "string",
      "maxLength": 256
    },
    "mac_sha1": {
      "type": "string",
      "maxLength": 256
    },
    "mac_md5": {
      "type": "string",
      "maxLength": 256
    },
    "idfa-android-id": {
      "type": "string",
      "maxLength": 256
    },
    "idfa-or-gps-adid": {
      "type": "string",
      "maxLength": 256
    },
    "idfa_md5": {
      "type": "string",
      "maxLength": 256
    },
    "idfa_md5_hex": {
      "type": "string",
      "maxLength": 256
    },
    "idfv": {
      "type": "string",
      "maxLength": 256
    },
    "gps_adid": {
      "type": "string",
      "maxLength": 256
    },
    "gps_adid_md5": {
      "type": "string",
      "maxLength": 256
    },
    "win_udid": {
      "type": "string",
      "maxLength": 256
    },
    "win_hwid": {
      "type": "string",
      "maxLength": 256
    },
    "win_naid": {
      "type": "string",
      "maxLength": 256
    },
    "win_adid": {
      "type": "string",
      "maxLength": 256
    },
    "match_type": {
      "type": "string",
      "maxLength": 256
    },
    "reftag": {
      "type": "string",
      "maxLength": 256
    },
    "referrer": {
      "type": "string",
      "maxLength": 256
    },
    "user_agent": {
      "type": "string",
      "maxLength": 256
    },
    "ip_address": {
      "type": "string",
      "maxLength": 256
    },
    "click_time": {
      "type": "string",
      "maxLength": 256
    },
    "engagement_time": {
      "type": "string",
      "maxLength": 256
    },
    "installed_at": {
      "type": "string",
      "maxLength": 256
    },
    "installed_at_hour": {
      "type": "string",
      "maxLength": 256
    },
    "created_at": {
      "type": "string",
      "maxLength": 256
    },
    "reattributed_at": {
      "type": "string",
      "maxLength": 256
    },
    "connection_type": {
      "type": "string",
      "maxLength": 256
    },
    "isp": {
      "type": "string",
      "maxLength": 256
    },
    "city": {
      "type": "string",
      "maxLength": 256
    },
    "country": {
      "type": "string",
      "maxLength": 256
    },
    "language": {
      "type": "string",
      "maxLength": 256
    },
    "device_name": {
      "type": "string",
      "maxLength": 256
    },
    "device_type": {
      "type": "string",
      "maxLength": 256
    },
    "os_name": {
      "type": "string",
      "maxLength": 256
    },
    "api_level": {
      "type": "string",
      "maxLength": 256
    },
    "sdk_version": {
      "type": "string",
      "maxLength": 256
    },
    "os_version": {
      "type": "string",
      "maxLength": 256
    },
    "environment": {
      "type": "string",
      "maxLength": 256
    },
    "tracking_enabled": {
      "type": "string",
      "maxLength": 256
    },
    "timezone": {
      "type": "string",
      "maxLength": 256
    },
    "fb_campaign_group_name": {
      "type": "string",
      "maxLength": 256
    },
    "fb_campaign_group_id": {
      "type": "string",
      "maxLength": 256
    },
    "fb_campaign_name": {
      "type": "string",
      "maxLength": 256
    },
    "fb_campaign_id": {
      "type": "string",
      "maxLength": 256
    },
    "fb_adgroup_name": {
      "type": "string",
      "maxLength": 256
    },
    "fb_adgroup_id": {
      "type": "string",
      "maxLength": 256
    },
    "tweet_id": {
      "type": "string",
      "maxLength": 256
    },
    "twitter_line_item_id": {
      "type": "string",
      "maxLength": 256
    },
    "label": {
      "type": "string",
      "maxLength": 256
    }
  },
  "additionalProperties": true
}
```

We have included a field for each placeholder that we included in our Adjust callback. Although here we’ve used the same spelling for property names as the placeholders, there is no requirement to do so in your own schema.

### 3. Create the table in Redshift

Create a corresponding Redshift table for the schema. We recommend autogenerating this [Schema Guru](https://github.com/snowplow/schema-guru), e.g. by executing the following in the root of your schema registry:

```bash
/path/to/schema-guru-0.6.2 ddl --with-json-paths schemas/com.adjust.snowplow/install
```

Or with [Igluctl](/docs/api-reference/iglu/igluctl-2/index.md):

```bash
/path/to/igluctl static generate --with-json-paths schemas/com.adjust.snowplow/install
```

In our case this auto-generated the following table definition. (_Please note that this example might be outdated. Since first publishing this guide, Redshift has introduced the more efficient ZSTD encoding for column compression, which we have adopted as standard in Igluctl._)

```sql
CREATE TABLE IF NOT EXISTS atomic.com_adjust_snowplow_install_1 (
    "schema_vendor"                    VARCHAR(128)  ENCODE RUNLENGTH NOT NULL,
    "schema_name"                      VARCHAR(128)  ENCODE RUNLENGTH NOT NULL,
    "schema_format"                    VARCHAR(128)  ENCODE RUNLENGTH NOT NULL,
    "schema_version"                   VARCHAR(128)  ENCODE RUNLENGTH NOT NULL,
    "root_id"                          CHAR(36)      ENCODE RAW       NOT NULL,
    "root_tstamp"                      TIMESTAMP     ENCODE LZO       NOT NULL,
    "ref_root"                         VARCHAR(255)  ENCODE RUNLENGTH NOT NULL,
    "ref_tree"                         VARCHAR(1500) ENCODE RUNLENGTH NOT NULL,
    "ref_parent"                       VARCHAR(255)  ENCODE RUNLENGTH NOT NULL,
    "adgroup_name"                     VARCHAR(256)  ENCODE LZO,
    "adid"                             VARCHAR(256)  ENCODE LZO,
    "android_id"                       VARCHAR(256)  ENCODE LZO,
    "android_id_md5"                   VARCHAR(256)  ENCODE LZO,
    "api_level"                        VARCHAR(256)  ENCODE LZO,
    "app_id"                           VARCHAR(4096) ENCODE LZO,
    "app_name"                         VARCHAR(256)  ENCODE LZO,
    "app_name_dashboard"               VARCHAR(256)  ENCODE LZO,
    "campaign_name"                    VARCHAR(256)  ENCODE LZO,
    "city"                             VARCHAR(256)  ENCODE LZO,
    "click_attribution_window"         VARCHAR(256)  ENCODE LZO,
    "click_referer"                    VARCHAR(256)  ENCODE LZO,
    "click_time"                       VARCHAR(256)  ENCODE LZO,
    "connection_type"                  VARCHAR(256)  ENCODE LZO,
    "country"                          VARCHAR(256)  ENCODE LZO,
    "created_at"                       VARCHAR(256)  ENCODE LZO,
    "creative_name"                    VARCHAR(256)  ENCODE LZO,
    "device_name"                      VARCHAR(256)  ENCODE LZO,
    "device_type"                      VARCHAR(256)  ENCODE LZO,
    "engagement_time"                  VARCHAR(256)  ENCODE LZO,
    "environment"                      VARCHAR(256)  ENCODE LZO,
    "fb_adgroup_id"                    VARCHAR(256)  ENCODE LZO,
    "fb_adgroup_name"                  VARCHAR(256)  ENCODE LZO,
    "fb_campaign_group_id"             VARCHAR(256)  ENCODE LZO,
    "fb_campaign_group_name"           VARCHAR(256)  ENCODE LZO,
    "fb_campaign_id"                   VARCHAR(256)  ENCODE LZO,
    "fb_campaign_name"                 VARCHAR(256)  ENCODE LZO,
    "gclid"                            VARCHAR(256)  ENCODE LZO,
    "gps_adid"                         VARCHAR(256)  ENCODE LZO,
    "gps_adid_md5"                     VARCHAR(256)  ENCODE LZO,
    "idfa"                             VARCHAR(256)  ENCODE LZO,
    "idfa_android_id"                  VARCHAR(256)  ENCODE LZO,
    "idfa_or_gps_adid"                 VARCHAR(256)  ENCODE LZO,
    "idfa_md5"                         VARCHAR(256)  ENCODE LZO,
    "idfa_md5_hex"                     VARCHAR(256)  ENCODE LZO,
    "idfv"                             VARCHAR(256)  ENCODE LZO,
    "impression_attribution_window"    VARCHAR(256)  ENCODE LZO,
    "impression_based"                 VARCHAR(256)  ENCODE LZO,
    "inactive_user_definition"         VARCHAR(256)  ENCODE LZO,
    "installed_at"                     VARCHAR(256)  ENCODE LZO,
    "installed_at_hour"                VARCHAR(256)  ENCODE LZO,
    "ip_address"                       VARCHAR(256)  ENCODE LZO,
    "is_organic"                       VARCHAR(256)  ENCODE LZO,
    "isp"                              VARCHAR(256)  ENCODE LZO,
    "label"                            VARCHAR(256)  ENCODE LZO,
    "language"                         VARCHAR(256)  ENCODE LZO,
    "mac_md5"                          VARCHAR(256)  ENCODE LZO,
    "mac_sha1"                         VARCHAR(256)  ENCODE LZO,
    "match_type"                       VARCHAR(256)  ENCODE LZO,
    "network_name"                     VARCHAR(256)  ENCODE LZO,
    "os_name"                          VARCHAR(256)  ENCODE LZO,
    "os_version"                       VARCHAR(256)  ENCODE LZO,
    "reattributed_at"                  VARCHAR(256)  ENCODE LZO,
    "reattribution_attribution_window" VARCHAR(256)  ENCODE LZO,
    "referrer"                         VARCHAR(256)  ENCODE LZO,
    "reftag"                           VARCHAR(256)  ENCODE LZO,
    "rejection_reason"                 VARCHAR(256)  ENCODE LZO,
    "sdk_version"                      VARCHAR(256)  ENCODE LZO,
    "store"                            VARCHAR(256)  ENCODE LZO,
    "timezone"                         VARCHAR(256)  ENCODE LZO,
    "tracker"                          VARCHAR(256)  ENCODE LZO,
    "tracker_name"                     VARCHAR(256)  ENCODE LZO,
    "tracking_enabled"                 VARCHAR(256)  ENCODE LZO,
    "tweet_id"                         VARCHAR(256)  ENCODE LZO,
    "twitter_line_item_id"             VARCHAR(256)  ENCODE LZO,
    "user_agent"                       VARCHAR(256)  ENCODE LZO,
    "win_adid"                         VARCHAR(256)  ENCODE LZO,
    "win_hwid"                         VARCHAR(256)  ENCODE LZO,
    "win_naid"                         VARCHAR(256)  ENCODE LZO,
    "win_udid"                         VARCHAR(256)  ENCODE LZO,
    FOREIGN KEY (root_id) REFERENCES atomic.events(event_id)
)
DISTSTYLE KEY
DISTKEY (root_id)
SORTKEY (root_tstamp);

COMMENT ON TABLE com_adjust_snowplow_install_1 IS 'iglu:com.adjust.snowplow/install/jsonschema/1-0-0';
```

### 4. Create the correpsonding JSONpaths file

Finally add the following JSONpaths file to your jsonpaths folder (as `com.adjust.snowplow/install_1.json`). Your JSONpaths file should have already been auto-generated using schema-guru or Igluctl:

```json
{
    "jsonpaths": [
        "$.schema.vendor",
        "$.schema.name",
        "$.schema.format",
        "$.schema.version",
        "$.hierarchy.rootId",
        "$.hierarchy.rootTstamp",
        "$.hierarchy.refRoot",
        "$.hierarchy.refTree",
        "$.hierarchy.refParent",
        "$.data.adgroup_name",
        "$.data.adid",
        "$.data.android_id",
        "$.data.android_id_md5",
        "$.data.api_level",
        "$.data.app_id",
        "$.data.app_name",
        "$.data.app_name_dashboard",
        "$.data.campaign_name",
        "$.data.city",
        "$.data.click_attribution_window",
        "$.data.click_referer",
        "$.data.click_time",
        "$.data.connection_type",
        "$.data.country",
        "$.data.created_at",
        "$.data.creative_name",
        "$.data.device_name",
        "$.data.device_type",
        "$.data.engagement_time",
        "$.data.environment",
        "$.data.fb_adgroup_id",
        "$.data.fb_adgroup_name",
        "$.data.fb_campaign_group_id",
        "$.data.fb_campaign_group_name",
        "$.data.fb_campaign_id",
        "$.data.fb_campaign_name",
        "$.data.gclid",
        "$.data.gps_adid",
        "$.data.gps_adid_md5",
        "$.data.idfa",
        "$.data.idfa-android-id",
        "$.data.idfa-or-gps-adid",
        "$.data.idfa_md5",
        "$.data.idfa_md5_hex",
        "$.data.idfv",
        "$.data.impression_attribution_window",
        "$.data.impression_based",
        "$.data.inactive_user_definition",
        "$.data.installed_at",
        "$.data.installed_at_hour",
        "$.data.ip_address",
        "$.data.is_organic",
        "$.data.isp",
        "$.data.label",
        "$.data.language",
        "$.data.mac_md5",
        "$.data.mac_sha1",
        "$.data.match_type",
        "$.data.network_name",
        "$.data.os_name",
        "$.data.os_version",
        "$.data.reattributed_at",
        "$.data.reattribution_attribution_window",
        "$.data.referrer",
        "$.data.reftag",
        "$.data.rejection_reason",
        "$.data.sdk_version",
        "$.data.store",
        "$.data.timezone",
        "$.data.tracker",
        "$.data.tracker_name",
        "$.data.tracking_enabled",
        "$.data.tweet_id",
        "$.data.twitter_line_item_id",
        "$.data.user_agent",
        "$.data.win_adid",
        "$.data.win_hwid",
        "$.data.win_naid",
        "$.data.win_udid"
    ]
}
```

### 5. Extending the setup for reattribution events
To extend the setup for reattribution events you work through the same process as for installation events:

#### 5.1 Setup the callback

E.g. by creating the following callback for a reattribution event:

```
http://mycollector.mydomain.com/com.snowplowanalytics.iglu/v1?schema=iglu%3Acom.adjust.snowplow%2Freattribute%2Fjsonschema%2F1-0-0&app_id={app_id}&app_name={app_name}&app_name_dashboard={app_name_dashboard}&store={store}&tracker={tracker}&tracker_name={tracker_name}&last_tracker={last_tracker}&last_tracker_name={last_tracker_name}&network_name={network_name}&campaign_name={campaign_name}&adgroup_name={adgroup_name}&creative_name={creative_name}&impression_based={impression_based}&is_organic={is_organic}&gclid={gclid}&click_attribution_window={click_attribution_window}&impression_attribution_window={impression_attribution_window}&reattribution_attribution_window={reattribution_attribution_window}&inactive_user_definition={inactive_user_definition}&adid={adid}&idfa={idfa}&android_id={android_id}&android_id_md5={android_id_md5}&mac_sha1={mac_sha1}&mac_md5={mac_md5}&idfa-android-id={idfa||android_id}&idfa-or-gps-adid={idfa||gps_adid}&idfa_md5={idfa_md5}&idfa_md5_hex={idfa_md5_hex}&idfv={idfv}&gps_adid={gps_adid}&gps_adid_md5={gps_adid_md5}&win_udid={win_udid}&win_hwid={win_hwid}&win_naid={win_hwid}&win_adid={win_adid}&match_type={match_type}&reftag={reftag}&referrer={referrer}&user_agent={user_agent}&ip_address={ip_address}&click_time={click_time}&engagement_time={engagement_time}&installed_at={installed_at}&installed_at_hour={installed_at_hour}&created_at={created_at}&reattributed_at={reattributed_at}&connection_type={connection_type}&isp={isp}&city={city}&country={country}&language={language}&device_name={device_name}&device_type={device_type}&os_name={os_name}&api_level={api_level}&sdk_version={sdk_version}&os_version={os_version}&environment={environment}&tracking_enabled={tracking_enabled}&timezone={timezone}&time_spent={time_spent}&lifetime_session_count={lifetime_session_count}&deeplink={deeplink}&fb_campaign_group_name={fb_campaign_group_name}&fb_campaign_group_id={fb_campaign_group_id}&fb_campaign_name={fb_campaign_name}&fb_campaign_id={fb_campaign_id}&fb_adgroup_name={fb_adgroup_name}&fb_adgroup_id={fb_adgroup_id}&tweet_id={tweet_id}&twitter_line_item_id={twitter_line_item_id}&label={label}
```

As before, keep in mind that there is no requirement that the key in each key-value pair must match the spelling of the associated Adjust placeholder. For example, you might decide to use a property name for the `{impression_based}` placeholder that makes it clearer that this field contains a Boolean value and makes the naming more consistent with other Boolean fields: `is_impression_based={impression_based}`. The only requirement is that the keys must match the property names in your schema.

#### 5.2 Create a corresponding jsonschema for the reattribution event

E.g.:

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for Adjust reattribute event",
  "self": {
    "vendor": "com.adjust.snowplow",
    "name": "reattribute",
    "format": "jsonschema",
    "version": "1-0-0"
  },

  "type": "object",
  "properties": {
    "app_id": {
      "type": "string"
    },
    "app_name": {
      "type": "string",
      "maxLength": 1024
    },
    "app_name_dashboard": {
      "type": "string",
      "maxLength": 1024
    },
    "store": {
      "type": "string",
      "maxLength": 1024
    },
    "tracker": {
      "type": "string",
      "maxLength": 1024
    },
    "tracker_name": {
      "type": "string",
      "maxLength": 1024
    },
    "last_tracker": {
      "type": "string",
      "maxLength": 1024
    },
    "last_tracker_name": {
      "type": "string",
      "maxLength": 1024
    },
    "network_name": {
      "type": "string",
      "maxLength": 1024
    },
    "campaign_name": {
      "type": "string",
      "maxLength": 1024
    },
    "adgroup_name": {
      "type": "string",
      "maxLength": 1024
    },
    "creative_name": {
      "type": "string",
      "maxLength": 1024
    },
    "impression_based": {
      "type": "string",
      "maxLength": 1024
    },
    "is_organic": {
      "type": "string",
      "maxLength": 1024
    },
    "gclid": {
      "type": "string",
      "maxLength": 1024
    },
    "click_attribution_window": {
      "type": "string",
      "maxLength": 1024
    },
    "impression_attribution_window": {
      "type": "string",
      "maxLength": 1024
    },
    "reattribution_attribution_window": {
      "type": "string",
      "maxLength": 1024
    },
    "inactive_user_definition": {
      "type": "string",
      "maxLength": 1024
    },
    "adid": {
      "type": "string",
      "maxLength": 1024
    },
    "idfa": {
      "type": "string",
      "maxLength": 1024
    },
    "android_id": {
      "type": "string",
      "maxLength": 1024
    },
    "android_id_md5": {
      "type": "string",
      "maxLength": 1024
    },
    "mac_sha1": {
      "type": "string",
      "maxLength": 1024
    },
    "mac_md5": {
      "type": "string",
      "maxLength": 1024
    },
    "idfa-android-id": {
      "type": "string",
      "maxLength": 1024
    },
    "idfa-or-gps-adid": {
      "type": "string",
      "maxLength": 1024
    },
    "idfa_md5": {
      "type": "string",
      "maxLength": 1024
    },
    "idfa_md5_hex": {
      "type": "string",
      "maxLength": 1024
    },
    "idfv": {
      "type": "string",
      "maxLength": 1024
    },
    "gps_adid": {
      "type": "string",
      "maxLength": 1024
    },
    "gps_adid_md5": {
      "type": "string",
      "maxLength": 1024
    },
    "win_udid": {
      "type": "string",
      "maxLength": 1024
    },
    "win_hwid": {
      "type": "string",
      "maxLength": 1024
    },
    "win_naid": {
      "type": "string",
      "maxLength": 1024
    },
    "win_adid": {
      "type": "string",
      "maxLength": 1024
    },
    "match_type": {
      "type": "string",
      "maxLength": 1024
    },
    "reftag": {
      "type": "string",
      "maxLength": 1024
    },
    "referrer": {
      "type": "string",
      "maxLength": 1024
    },
    "user_agent": {
      "type": "string",
      "maxLength": 1024
    },
    "ip_address": {
      "type": "string",
      "maxLength": 1024
    },
    "click_time": {
      "type": "string",
      "maxLength": 1024
    },
    "engagement_time": {
      "type": "string",
      "maxLength": 1024
    },
    "installed_at": {
      "type": "string",
      "maxLength": 1024
    },
    "installed_at_hour": {
      "type": "string",
      "maxLength": 1024
    },
    "created_at": {
      "type": "string",
      "maxLength": 1024
    },
    "reattributed_at": {
      "type": "string",
      "maxLength": 1024
    },
    "connection_type": {
      "type": "string",
      "maxLength": 1024
    },
    "isp": {
      "type": "string",
      "maxLength": 1024
    },
    "city": {
      "type": "string",
      "maxLength": 1024
    },
    "country": {
      "type": "string",
      "maxLength": 1024
    },
    "language": {
      "type": "string",
      "maxLength": 1024
    },
    "device_name": {
      "type": "string",
      "maxLength": 1024
    },
    "device_type": {
      "type": "string",
      "maxLength": 1024
    },
    "os_name": {
      "type": "string",
      "maxLength": 1024
    },
    "api_level": {
      "type": "string",
      "maxLength": 1024
    },
    "sdk_version": {
      "type": "string",
      "maxLength": 1024
    },
    "os_version": {
      "type": "string",
      "maxLength": 1024
    },
    "environment": {
      "type": "string",
      "maxLength": 1024
    },
    "tracking_enabled": {
      "type": "string",
      "maxLength": 1024
    },
    "timezone": {
      "type": "string",
      "maxLength": 1024
    },
    "time_spent": {
      "type": "string",
      "maxLength": 1024
    },
    "fb_campaign_group_name": {
      "type": "string",
      "maxLength": 1024
    },
    "fb_campaign_group_id": {
      "type": "string",
      "maxLength": 1024
    },
    "fb_campaign_name": {
      "type": "string",
      "maxLength": 1024
    },
    "fb_campaign_id": {
      "type": "string",
      "maxLength": 1024
    },
    "fb_adgroup_name": {
      "type": "string",
      "maxLength": 1024
    },
    "fb_adgroup_id": {
      "type": "string",
      "maxLength": 1024
    },
    "tweet_id": {
      "type": "string",
      "maxLength": 1024
    },
    "twitter_line_item_id": {
      "type": "string",
      "maxLength": 1024
    },
    "label": {
      "type": "string",
      "maxLength": 1024
    }
  },
  "additionalProperties": true
}
```
#### 5.3 Implement the corresponding SQL table definitions and jsonpaths

Do this using [Schema Guru](https://github.com/snowplow/schema-guru) e.g. the SQL table definition by executing the following from the root of your schema registry:

```
$ /path/to/schema-guru-0.6.2 ddl --with-json-paths schemas/com.adjust.snowplow/reattribute
```

Or with [Igluctl](/docs/api-reference/iglu/igluctl-2/index.md):

```bash
$ /path/to/igluctl static generate --with-json-paths schemas/com.adjust.snowplow/reattribute
```

The generated SQL file (*Please note that this example might be outdated. Since first publishing this guide, Redshift has introduced the more efficient ZSTD encoding for column compression, which we have adopted as standard in Igluctl.*):

```sql
CREATE TABLE IF NOT EXISTS atomic.com_adjust_snowplow_reattribute_1 (
    "schema_vendor"                    VARCHAR(128)  ENCODE RUNLENGTH NOT NULL,
    "schema_name"                      VARCHAR(128)  ENCODE RUNLENGTH NOT NULL,
    "schema_format"                    VARCHAR(128)  ENCODE RUNLENGTH NOT NULL,
    "schema_version"                   VARCHAR(128)  ENCODE RUNLENGTH NOT NULL,
    "root_id"                          CHAR(36)      ENCODE RAW       NOT NULL,
    "root_tstamp"                      TIMESTAMP     ENCODE LZO       NOT NULL,
    "ref_root"                         VARCHAR(255)  ENCODE RUNLENGTH NOT NULL,
    "ref_tree"                         VARCHAR(1500) ENCODE RUNLENGTH NOT NULL,
    "ref_parent"                       VARCHAR(255)  ENCODE RUNLENGTH NOT NULL,
    "adgroup_name"                     VARCHAR(1024)  ENCODE LZO,
    "adid"                             VARCHAR(1024)  ENCODE LZO,
    "android_id"                       VARCHAR(1024)  ENCODE LZO,
    "android_id_md5"                   VARCHAR(1024)  ENCODE LZO,
    "api_level"                        VARCHAR(1024)  ENCODE LZO,
    "app_id"                           VARCHAR(4096) ENCODE LZO,
    "app_name"                         VARCHAR(1024)  ENCODE LZO,
    "app_name_dashboard"               VARCHAR(1024)  ENCODE LZO,
    "campaign_name"                    VARCHAR(1024)  ENCODE LZO,
    "city"                             VARCHAR(1024)  ENCODE LZO,
    "click_attribution_window"         VARCHAR(1024)  ENCODE LZO,
    "click_time"                       VARCHAR(1024)  ENCODE LZO,
    "connection_type"                  VARCHAR(1024)  ENCODE LZO,
    "country"                          VARCHAR(1024)  ENCODE LZO,
    "created_at"                       VARCHAR(1024)  ENCODE LZO,
    "creative_name"                    VARCHAR(1024)  ENCODE LZO,
    "device_name"                      VARCHAR(1024)  ENCODE LZO,
    "device_type"                      VARCHAR(1024)  ENCODE LZO,
    "engagement_time"                  VARCHAR(1024)  ENCODE LZO,
    "environment"                      VARCHAR(1024)  ENCODE LZO,
    "fb_adgroup_id"                    VARCHAR(1024)  ENCODE LZO,
    "fb_adgroup_name"                  VARCHAR(1024)  ENCODE LZO,
    "fb_campaign_group_id"             VARCHAR(1024)  ENCODE LZO,
    "fb_campaign_group_name"           VARCHAR(1024)  ENCODE LZO,
    "fb_campaign_id"                   VARCHAR(1024)  ENCODE LZO,
    "fb_campaign_name"                 VARCHAR(1024)  ENCODE LZO,
    "gclid"                            VARCHAR(1024)  ENCODE LZO,
    "gps_adid"                         VARCHAR(1024)  ENCODE LZO,
    "gps_adid_md5"                     VARCHAR(1024)  ENCODE LZO,
    "idfa"                             VARCHAR(1024)  ENCODE LZO,
    "idfa_android_id"                  VARCHAR(1024)  ENCODE LZO,
    "idfa_or_gps_adid"                 VARCHAR(1024)  ENCODE LZO,
    "idfa_md5"                         VARCHAR(1024)  ENCODE LZO,
    "idfa_md5_hex"                     VARCHAR(1024)  ENCODE LZO,
    "idfv"                             VARCHAR(1024)  ENCODE LZO,
    "impression_attribution_window"    VARCHAR(1024)  ENCODE LZO,
    "impression_based"                 VARCHAR(1024)  ENCODE LZO,
    "inactive_user_definition"         VARCHAR(1024)  ENCODE LZO,
    "installed_at"                     VARCHAR(1024)  ENCODE LZO,
    "installed_at_hour"                VARCHAR(1024)  ENCODE LZO,
    "ip_address"                       VARCHAR(1024)  ENCODE LZO,
    "is_organic"                       VARCHAR(1024)  ENCODE LZO,
    "isp"                              VARCHAR(1024)  ENCODE LZO,
    "label"                            VARCHAR(1024)  ENCODE LZO,
    "language"                         VARCHAR(1024)  ENCODE LZO,
    "last_tracker"                     VARCHAR(1024)  ENCODE LZO,
    "last_tracker_name"                VARCHAR(1024)  ENCODE LZO,
    "mac_md5"                          VARCHAR(1024)  ENCODE LZO,
    "mac_sha1"                         VARCHAR(1024)  ENCODE LZO,
    "match_type"                       VARCHAR(1024)  ENCODE LZO,
    "network_name"                     VARCHAR(1024)  ENCODE LZO,
    "os_name"                          VARCHAR(1024)  ENCODE LZO,
    "os_version"                       VARCHAR(1024)  ENCODE LZO,
    "reattributed_at"                  VARCHAR(1024)  ENCODE LZO,
    "reattribution_attribution_window" VARCHAR(1024)  ENCODE LZO,
    "referrer"                         VARCHAR(1024)  ENCODE LZO,
    "reftag"                           VARCHAR(1024)  ENCODE LZO,
    "sdk_version"                      VARCHAR(1024)  ENCODE LZO,
    "store"                            VARCHAR(1024)  ENCODE LZO,
    "time_spent"                       VARCHAR(1024)  ENCODE LZO,
    "timezone"                         VARCHAR(1024)  ENCODE LZO,
    "tracker"                          VARCHAR(1024)  ENCODE LZO,
    "tracker_name"                     VARCHAR(1024)  ENCODE LZO,
    "tracking_enabled"                 VARCHAR(1024)  ENCODE LZO,
    "tweet_id"                         VARCHAR(1024)  ENCODE LZO,
    "twitter_line_item_id"             VARCHAR(1024)  ENCODE LZO,
    "user_agent"                       VARCHAR(1024)  ENCODE LZO,
    "win_adid"                         VARCHAR(1024)  ENCODE LZO,
    "win_hwid"                         VARCHAR(1024)  ENCODE LZO,
    "win_naid"                         VARCHAR(1024)  ENCODE LZO,
    "win_udid"                         VARCHAR(1024)  ENCODE LZO,
    FOREIGN KEY (root_id) REFERENCES atomic.events(event_id)
)
DISTSTYLE KEY
DISTKEY (root_id)
SORTKEY (root_tstamp);

COMMENT ON TABLE atomic.com_adjust_snowplow_reattribute_1 IS 'iglu:com.adjust.snowplow/reattribute/jsonschema/1-0-0';
```

and the generated jsonpath file:

```
{
    "jsonpaths": [
        "$.schema.vendor",
        "$.schema.name",
        "$.schema.format",
        "$.schema.version",
        "$.hierarchy.rootId",
        "$.hierarchy.rootTstamp",
        "$.hierarchy.refRoot",
        "$.hierarchy.refTree",
        "$.hierarchy.refParent",
        "$.data.adgroup_name",
        "$.data.adid",
        "$.data.android_id",
        "$.data.android_id_md5",
        "$.data.api_level",
        "$.data.app_id",
        "$.data.app_name",
        "$.data.app_name_dashboard",
        "$.data.campaign_name",
        "$.data.city",
        "$.data.click_attribution_window",
        "$.data.click_time",
        "$.data.connection_type",
        "$.data.country",
        "$.data.created_at",
        "$.data.creative_name",
        "$.data.device_name",
        "$.data.device_type",
        "$.data.engagement_time",
        "$.data.environment",
        "$.data.fb_adgroup_id",
        "$.data.fb_adgroup_name",
        "$.data.fb_campaign_group_id",
        "$.data.fb_campaign_group_name",
        "$.data.fb_campaign_id",
        "$.data.fb_campaign_name",
        "$.data.gclid",
        "$.data.gps_adid",
        "$.data.gps_adid_md5",
        "$.data.idfa",
        "$.data.idfa-android-id",
        "$.data.idfa-or-gps-adid",
        "$.data.idfa_md5",
        "$.data.idfa_md5_hex",
        "$.data.idfv",
        "$.data.impression_attribution_window",
        "$.data.impression_based",
        "$.data.inactive_user_definition",
        "$.data.installed_at",
        "$.data.installed_at_hour",
        "$.data.ip_address",
        "$.data.is_organic",
        "$.data.isp",
        "$.data.label",
        "$.data.language",
        "$.data.last_tracker",
        "$.data.last_tracker_name",
        "$.data.mac_md5",
        "$.data.mac_sha1",
        "$.data.match_type",
        "$.data.network_name",
        "$.data.os_name",
        "$.data.os_version",
        "$.data.reattributed_at",
        "$.data.reattribution_attribution_window",
        "$.data.referrer",
        "$.data.reftag",
        "$.data.sdk_version",
        "$.data.store",
        "$.data.time_spent",
        "$.data.timezone",
        "$.data.tracker",
        "$.data.tracker_name",
        "$.data.tracking_enabled",
        "$.data.tweet_id",
        "$.data.twitter_line_item_id",
        "$.data.user_agent",
        "$.data.win_adid",
        "$.data.win_hwid",
        "$.data.win_naid",
        "$.data.win_udid"
    ]
}
```

You're now all set for capturing reattribution events as well as installation events.

### 6. Tailoring the setup

#### 6.1 Maximalist vs minimalist setup

The above setup is a maximalist setup: we've decided to grab as much data from Adjust as Adjust make available with their installation and reattribution events. Our corresponding callback, schema, SQL table definition and jsonpath file are all very long. (Because they contain all the different fields.)

You can choose to set this up for a more limited set of fields. In this case you'd simply remove the name value pairs from the callback, remove them from the schema, jsonpath and sql table definitions.

You might also want to setup Callbacks for other Adjust events, if you want to add more than the attribution data to your Snowplow data set.

#### 6.2 Adding custom parameters

Adjust supports sending your own [custom parameters](https://docs.adjust.com/en/callbacks/#reference-custom-sdk-parameters) with each callback.

To include these custom parameters in your Adjust-Snowplow integration, all you need to do is extend the schemas for each Adjust event types with the custom parameters you want to record into Snowplow. Note that you **do not need to update the webhook itself**. Whilst you do need to list each Adjust placeholder that you want passed into Snowplow on the webhook, Adjust will automatically add every custom parameter you record in it onto the callback. So as long as your event schema includes those custom parameters, they will automatically be fetched.

Once you've updated your schema to include the custom parameters, you'll need to similarly make sure that your corresponding Redshift table definition and jsonpath files have the additional parameters in too.

### 7. Integrating callbacks from other third parties

Adjust is not the only company to provide event-level data via a Callback or Webhook. Zendesk is another example. The same approach / methodology should work for Zendesk and any similar provider that lets you specify the Callback URL and individual data points passed on the querystring.
