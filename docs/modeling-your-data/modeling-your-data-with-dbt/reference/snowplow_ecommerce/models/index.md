---
title: "Snowplow E-Commerce Models"
description: Reference for snowplow_ecommerce dbt models developed by Snowplow
sidebar_position: 10
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export function DbtDetails(props) {
return <div className="dbt"><details>{props.children}</details></div>
}
```

:::caution

This page is auto-generated from our dbt packages, some information may be incomplete

:::
## Snowplow Ecommerce
### Snowplow Ecommerce Base Events This Run {#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run}

<DbtDetails><summary>
<code>models/base/scratch/&lt;adaptor&gt;/snowplow_ecommerce_base_events_this_run.sql</code>
</summary>

#### Description
For any given run, this table contains all required events to be consumed by subsequent nodes in the Snowplow dbt ecommerce package. This is a cleaned, deduped dataset, containing all columns from the raw events table as well as having the `page_view_id` joined in from the page view context, and all of the fields parsed from the various e-commerce contexts except the `product` context.

**Note: This table should be used as the input to any custom modules that require event level data, rather than selecting straight from `atomic.events`**

#### File Paths
<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery" >

`models/base/scratch/bigquery/snowplow_ecommerce_base_events_this_run.sql`
</TabItem>
<TabItem value="databricks" label="databricks" >

`models/base/scratch/databricks/snowplow_ecommerce_base_events_this_run.sql`
</TabItem>
<TabItem value="snowflake" label="snowflake" >

`models/base/scratch/snowflake/snowplow_ecommerce_base_events_this_run.sql`
</TabItem>
</Tabs>


#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| page_view_id | A UUID for each page view e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ |
| ecommerce_user_id | The ecommerce user id extracted from the ecommerce user context. |
| ecommerce_user_email | The ecommerce user email, extracted from the ecommerce user context. |
| ecommerce_user_is_guest | A boolean extracted from the ecommerce user context to ascertain whether a user is a guest or not. |
| checkout_step_number | The checkout step index e.g. 1 |
| checkout_account_type | The type of account that is conducting the checkout e.g. guest |
| checkout_billing_full_address | The full billing address provided at the checkout step e.g. 1 Lincoln Street |
| checkout_billing_postcode | The full billing postcode/zipcode provided at the checkout step e.g. 90210 |
| checkout_coupon_code | The coupon code used at the checkout step e.g. SNOWPLOW50 |
| checkout_delivery_method | The delivery method selected at the checkout step e.g. Store pickup |
| checkout_delivery_provider | The delivery provider selected at the checkout step e.g. SantaPost |
| checkout_marketing_opt_in | A boolean to describe whether or not the user has opted in for marketing emails at the checkout step |
| checkout_payment_method | The chosen payment method selected at the checkout step e.g. Credit Card |
| checkout_proof_of_payment | The proof of payment given at the checkout step, e.g. invoice or receipt |
| checkout_shipping_full_address | Full shipping address |
| checkout_shipping_postcode | Shipping address postcode |
| ecommerce_page_type | The type of the page that was visited E.g. homepage, product page, checkout page |
| ecommerce_page_language | The language that the web page is based in |
| ecommerce_page_locale | The locale version of the site that is running |
| transaction_id | The ID of the transaction |
| transaction_currency | The currency used for the transaction (ISO 4217). |
| transaction_payment_method | The payment method used for the transaction. |
| transaction_revenue | The revenue of the transaction. |
| transaction_total_quantity | Total quantity of items in the transaction. |
| transaction_credit_order | Whether the transaction is a credit order or not. |
| transaction_discount_amount | Discount amount taken off |
| transaction_discount_code | Discount code used. |
| transaction_shipping | Total cost of shipping on the transaction. |
| transaction_tax | Total amount of tax on the transaction. |
| cart_id | The unique ID representing this cart e.g. abc123 |
| cart_currency | The currency used for this cart (ISO 4217) |
| cart_total_value | The total value of the cart after this interaction |
| ecommerce_action_type | The type of ecommerce action that was performed, e.g. transaction, add_to_cart, etc. |
| ecommerce_action_name | The name that is associated with the ecommerce action. E.g. when a list_click occurs, the name of the product list such as 'recommended' or 'shop the look' |
| app_id | Application ID e.g. ‘angry-birds’ is used to distinguish different applications that are being tracked by the same Snowplow stack, e.g. production versus dev. |
| platform | Platform e.g. ‘web’ |
| etl_tstamp | Timestamp event began ETL e.g. ‘2017-01-26 00:01:25.292’ |
| collector_tstamp | Time stamp for the event recorded by the collector e.g. ‘2013-11-26 00:02:05’ |
| dvce_created_tstamp | Timestamp event was recorded on the client device e.g. ‘2013-11-26 00:03:57.885’ |
| event | The type of event recorded e.g. ‘page_view’ |
| event_id | A UUID for each event e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| txn_id | Transaction ID set client-side, used to de-dupe records e.g. 421828 |
| name_tracker | Tracker namespace e.g. ‘sp1’ |
| v_tracker | Tracker version e.g. ‘js-3.0.0’ |
| v_collector | Collector version e.g. ‘ssc-2.1.0-kinesis’ |
| v_etl | ETL version e.g. ‘snowplow-micro-1.1.0-common-1.4.2’ |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ |
| user_ipaddress | User IP address e.g. ‘92.231.54.234’ |
| user_fingerprint | A user fingerprint generated by looking at the individual browser features e.g. 2161814971 |
| domain_sessionidx | A visit / session index e.g. 3 |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. ‘ecdff4d0-9175-40ac-a8bb-325c49733607’ |
| geo_country | ISO 3166-1 code for the country the visitor is located in e.g. ‘GB’, ‘US’ |
| geo_region | ISO-3166-2 code for country region the visitor is in e.g. ‘I9’, ‘TX’ |
| geo_city | City the visitor is in e.g. ‘New York’, ‘London’ |
| geo_zipcode | Postcode the visitor is in e.g. ‘94109’ |
| geo_latitude | Visitor location latitude e.g. 37.443604 |
| geo_longitude | Visitor location longitude e.g. -122.4124 |
| geo_region_name | Visitor region name e.g. ‘Florida’ |
| ip_isp | Visitor’s ISP e.g. ‘FDN Communications’ |
| ip_organization | Organization associated with the visitor’s IP address – defaults to ISP name if none is found e.g. ‘Bouygues Telecom’ |
| ip_domain | Second level domain name associated with the visitor’s IP address e.g. ‘nuvox.net’ |
| ip_netspeed | Visitor’s connection type e.g. ‘Cable/DSL’ |
| page_url | The page URL e.g. ‘http://www.example.com’ |
| page_title | Web page title e.g. ‘Snowplow Docs – Understanding the structure of Snowplow data’ |
| page_referrer | URL of the referrer e.g. ‘http://www.referrer.com’ |
| page_urlscheme | Scheme aka protocol e.g. ‘https’ |
| page_urlhost | Host aka domain e.g. ‘“www.snowplow.io’ |
| page_urlport | Port if specified, 80 if not 80 |
| page_urlpath | Path to page e.g. ‘/product/index.html’ |
| page_urlquery | Querystring e.g. ‘id=GTM-DLRG’ |
| page_urlfragment | Fragment aka anchor e.g. ‘4-conclusion’ |
| refr_urlscheme | Referer scheme e.g. ‘http’ |
| refr_urlhost | Referer host e.g. ‘www.bing.com’ |
| refr_urlport | Referer port e.g. 80 |
| refr_urlpath | Referer page path e.g. ‘/images/search’ |
| refr_urlquery | Referer URL querystring e.g. ‘q=psychic+oracle+cards’ |
| refr_urlfragment | Referer URL fragment |
| refr_medium | Type of referer e.g. ‘search’, ‘internal’ |
| refr_source | Name of referer if recognised e.g. ‘Bing images’ |
| refr_term | Keywords if source is a search engine e.g. ‘psychic oracle cards’ |
| mkt_medium | Type of traffic source e.g. ‘cpc’, ‘affiliate’, ‘organic’, ‘social’ |
| mkt_source | The company / website where the traffic came from e.g. ‘Google’, ‘Facebook’ |
| mkt_term | Any keywords associated with the referrer e.g. ‘new age tarot decks’ |
| mkt_content | The content of the ad. (Or an ID so that it can be looked up.) e.g. 13894723 |
| mkt_campaign | The campaign ID e.g. ‘diageo-123’ |
| se_category | Category of event e.g. ‘ecomm’, ‘video’ |
| se_action | Action performed / event name e.g. ‘add-to-basket’, ‘play-video’ |
| se_label | The object of the action e.g. the ID of the video played or SKU of the product added-to-basket e.g. ‘pbz00123’ |
| se_property | A property associated with the object of the action e.g. ‘HD’, ‘large’ |
| se_value | A value associated with the event / action e.g. the value of goods added-to-basket e.g. 9.99 |
| tr_orderid | Order ID e.g. ‘#134’ |
| tr_affiliation | Transaction affiliation (e.g. store where sale took place) e.g. ‘web’ |
| tr_total | Total transaction value e.g. 12.99 |
| tr_tax | Total tax included in transaction value e.g. 3.00 |
| tr_shipping | Delivery cost charged e.g. 0.00 |
| tr_city | Delivery address, city e.g. ‘London’ |
| tr_state | Delivery address, state e.g. ‘Washington’ |
| tr_country | Delivery address, country e.g. ‘France’ |
| ti_orderid | Order ID e.g. ‘#134’ |
| ti_sku | Product SKU e.g. ‘pbz00123’ |
| ti_name | Product name e.g. ‘Cone pendulum’ |
| ti_category | Product category e.g. ‘New Age’ |
| ti_price | Product unit price e.g. 9.99 |
| ti_quantity | Number of product in transaction e.g. 2 |
| pp_xoffset_min | Minimum page x offset seen in the last ping period e.g. 0 |
| pp_xoffset_max | Maximum page x offset seen in the last ping period e.g. 100 |
| pp_yoffset_min | Minimum page y offset seen in the last ping period e.g. 0 |
| pp_yoffset_max | Maximum page y offset seen in the last ping period e.g. 200 |
| useragent | Raw useragent |
| br_name | Browser name e.g. ‘Firefox 12’ |
| br_family | Browser family e.g. ‘Firefox’ |
| br_version | Browser version e.g. ‘12.0’ |
| br_type | Browser type e.g. ‘Browser’ |
| br_renderengine | Browser rendering engine e.g. ‘GECKO’ |
| br_lang | Language the browser is set to e.g. ‘en-GB’ |
| br_features_pdf | Whether the browser recognizes PDFs e.g. True |
| br_features_flash | Whether Flash is installed e.g. True |
| br_features_java | Whether Java is installed e.g. True |
| br_features_director | Whether Adobe Shockwave is installed e.g. True |
| br_features_quicktime | Whether QuickTime is installed e.g. True |
| br_features_realplayer | Whether RealPlayer is installed e.g. True |
| br_features_windowsmedia | Whether mplayer2 is installed e.g. True |
| br_features_gears | Whether Google Gears is installed e.g. True |
| br_features_silverlight | Whether Microsoft Silverlight is installed e.g. True |
| br_cookies | Whether cookies are enabled e.g. True |
| br_colordepth | Bit depth of the browser color palette e.g. 24 |
| br_viewwidth | Viewport width e.g. 1000 |
| br_viewheight | Viewport height e.g. 1000 |
| os_name | Name of operating system e.g. ‘Android’ |
| os_family | Operating system family e.g. ‘Linux’ |
| os_manufacturer | Company responsible for OS e.g. ‘Apple’ |
| os_timezone | Client operating system timezone e.g. ‘Europe/London’ |
| dvce_type | Type of device e.g. ‘Computer’ |
| dvce_ismobile | Is the device mobile? e.g. True |
| dvce_screenwidth | Screen width in pixels e.g. 1900 |
| dvce_screenheight | Screen height in pixels e.g. 1024 |
| doc_charset | The page’s character encoding e.g. , ‘UTF-8’ |
| doc_width | The page’s width in pixels e.g. 1024 |
| doc_height | The page’s height in pixels e.g. 3000 |
| tr_currency | Currency e.g. ‘USD’ |
| tr_total_base | Total in base currency e.g. 12.99 |
| tr_tax_base | Total tax in base currency e.g. 3.00 |
| tr_shipping_base | decimal  Delivery cost in base currency e.g. 0.00 |
| ti_currency | Currency e.g. ‘EUR’ |
| ti_price_base | decimal Price in base currency e.g. 9.99 |
| base_currency | Reporting currency e.g. ‘GBP’ |
| geo_timezone | Visitor timezone name e.g. ‘Europe/London’ |
| mkt_clickid | The click ID e.g. ‘ac3d8e459’ |
| mkt_network | The ad network to which the click ID belongs e.g. ‘DoubleClick’ |
| etl_tags | JSON of tags for this ETL run e.g. “[‘prod’]” |
| dvce_sent_tstamp | When the event was sent by the client device e.g. ‘2013-11-26 00:03:58.032’ |
| refr_domain_userid | The Snowplow domain_userid of the referring website e.g. ‘bc2e92ec6c204a14’ |
| refr_dvce_tstamp | The time of attaching the domain_userid to the inbound link e.g. ‘2013-11-26 00:02:05’ |
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ |
| event_vendor | Who defined the event e.g. ‘com.acme’ |
| event_name | Event name e.g. ‘link_click’ |
| event_format | Format for event e.g. ‘jsonschema’ |
| event_version | Version of event schema e.g. ‘1-0-2’ |
| event_fingerprint | Hash client-set event fields e.g. AADCE520E20C2899F4CED228A79A3083 |
| true_tstamp | User-set “true timestamp” for the event e.g. ‘2013-11-26 00:02:04’ |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/base/scratch/bigquery/snowplow_ecommerce_base_events_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    tags=["this_run"]
  )
}}

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref('snowplow_ecommerce_base_sessions_this_run'),
                                                                          'start_tstamp',
                                                                          'end_tstamp') %}


select
  *,
  dense_rank() over (partition by ev.domain_sessionid order by ev.derived_tstamp) AS event_in_session_index,

from (
  -- without downstream joins, it's safe to dedupe by picking the first event_id found.
  select
    array_agg(e order by e.collector_tstamp limit 1)[offset(0)].*

  from (

  select
    a.contexts_com_snowplowanalytics_snowplow_web_page_1_0_0[safe_offset(0)].id as page_view_id,
    b.domain_userid,

  -- handling relations for integration tests
  {% if target.schema.startswith('gh_sp_ecom_dbt_') %}

      -- unpacking the ecommerce user object
    {{ snowplow_utils.get_optional_fields(
        enabled=true,
        fields=user_fields(),
        col_prefix='contexts_com_snowplowanalytics_snowplow_ecommerce_user_1_',
        relation=ref('snowplow_ecommerce_events_stg'),
        relation_alias='a') }},

    -- unpacking the ecommerce checkout step object
    {{ snowplow_utils.get_optional_fields(
        enabled=true,
        fields=checkout_step_fields(),
        col_prefix='contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1_',
        relation=ref('snowplow_ecommerce_events_stg'),
        relation_alias='a') }},

    -- unpacking the ecommerce page object
    {{ snowplow_utils.get_optional_fields(
        enabled=true,
        fields=tracking_page_fields(),
        col_prefix='contexts_com_snowplowanalytics_snowplow_ecommerce_page_1_',
        relation=ref('snowplow_ecommerce_events_stg'),
        relation_alias='a') }},

    -- unpacking the ecommerce transaction object
    {{ snowplow_utils.get_optional_fields(
        enabled=true,
        fields=transaction_fields(),
        col_prefix='contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1_',
        relation=ref('snowplow_ecommerce_events_stg'),
        relation_alias='a') }},

    -- unpacking the ecommerce cart object
    {{ snowplow_utils.get_optional_fields(
        enabled=true,
        fields=cart_fields(),
        col_prefix='contexts_com_snowplowanalytics_snowplow_ecommerce_cart_1_',
        relation=ref('snowplow_ecommerce_events_stg'),
        relation_alias='a') }},

    -- unpacking the ecommerce action object
    {{ snowplow_utils.get_optional_fields(
        enabled=true,
        fields=tracking_action_fields(),
        col_prefix='unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1_',
        relation=ref('snowplow_ecommerce_events_stg'),
        relation_alias='a') }},

    {% else %}
      -- unpacking the ecommerce user object
      {{ snowplow_utils.get_optional_fields(
          enabled=true,
          fields=user_fields(),
          col_prefix='contexts_com_snowplowanalytics_snowplow_ecommerce_user_1_',
          relation=source('atomic', 'events'),
          relation_alias='a') }},

      -- unpacking the ecommerce checkout step object
      {{ snowplow_utils.get_optional_fields(
          enabled=true,
          fields=checkout_step_fields(),
          col_prefix='contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1_',
          relation=source('atomic', 'events'),
          relation_alias='a') }},

      -- unpacking the ecommerce page object
      {{ snowplow_utils.get_optional_fields(
          enabled=true,
          fields=tracking_page_fields(),
          col_prefix='contexts_com_snowplowanalytics_snowplow_ecommerce_page_1_',
          relation=source('atomic', 'events'),
          relation_alias='a') }},

      -- unpacking the ecommerce transaction object
      {{ snowplow_utils.get_optional_fields(
          enabled=true,
          fields=transaction_fields(),
          col_prefix='contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1_',
          relation=source('atomic', 'events'),
          relation_alias='a') }},

      -- unpacking the ecommerce cart object
      {{ snowplow_utils.get_optional_fields(
          enabled=true,
          fields=cart_fields(),
          col_prefix='contexts_com_snowplowanalytics_snowplow_ecommerce_cart_1_',
          relation=source('atomic', 'events'),
          relation_alias='a') }},

      -- unpacking the ecommerce action object
      {{ snowplow_utils.get_optional_fields(
          enabled=true,
          fields=tracking_action_fields(),
          col_prefix='unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1_',
          relation=source('atomic', 'events'),
          relation_alias='a') }},
    {% endif %}

    a.* except (domain_userid,
                contexts_com_snowplowanalytics_snowplow_web_page_1_0_0)

    from {{ var('snowplow__events') }} as a
    inner join {{ ref('snowplow_ecommerce_base_sessions_this_run') }} as b
    on a.domain_sessionid = b.session_id

    where a.collector_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'b.start_tstamp') }}
    and a.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'a.dvce_created_tstamp') }}
    and a.collector_tstamp >= {{ lower_limit }}
    and a.collector_tstamp <= {{ upper_limit }}
    {% if var('snowplow__derived_tstamp_partitioned', true) and target.type == 'bigquery' | as_bool() %}
      and a.derived_tstamp >= {{ snowplow_utils.timestamp_add('hour', -1, lower_limit) }}
      and a.derived_tstamp <= {{ upper_limit }}
    {% endif %}
    and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
    and {{ snowplow_ecommerce.event_name_filter(var("snowplow__ecommerce_event_names", "['snowplow_ecommerce_action']")) }}
  ) e
  group by e.event_id
) ev
```
</TabItem>
<TabItem value="databricks" label="databricks" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/base/scratch/databricks/snowplow_ecommerce_base_events_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    tags=["this_run"]
  )
}}

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref('snowplow_ecommerce_base_sessions_this_run'),
                                                                          'start_tstamp',
                                                                          'end_tstamp') %}

with prep AS (

  select
    a.contexts_com_snowplowanalytics_snowplow_web_page_1[0].id::string as page_view_id,
    b.domain_userid,

    -- unpacking the ecommerce user object
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_user_1[0].id::string as ecommerce_user_id,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_user_1[0].email::string as ecommerce_user_email,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_user_1[0].is_guest::boolean as ecommerce_user_is_guest,

    -- unpacking the ecommerce checkout step object
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0].step::int as checkout_step_number,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0].account_type::string as checkout_account_type,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0].billing_full_address::string as checkout_billing_full_address,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0].billing_postcode::string as checkout_billing_postcode,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0].coupon_code::string as checkout_coupon_code,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0].delivery_method::string as checkout_delivery_method,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0].delivery_provider::string as checkout_delivery_provider,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0].marketing_opt_in::boolean as checkout_marketing_opt_in,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0].payment_method::string as checkout_payment_method,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0].proof_of_payment::string as checkout_proof_of_payment,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0].shipping_full_address::string as checkout_shipping_full_address,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0].shipping_postcode::string as checkout_shipping_postcode,

    -- unpacking the ecommerce page object
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_page_1[0].type::string as ecommerce_page_type,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_page_1[0].language::string as ecommerce_page_language,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_page_1[0].locale::string as ecommerce_page_locale,

    -- unpacking the ecommerce transaction object
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].transaction_id::string as transaction_id,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].currency::string as transaction_currency,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].payment_method::string as transaction_payment_method,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].revenue::decimal(7,2) as transaction_revenue,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].total_quantity::int as transaction_total_quantity,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].credit_order::boolean as transaction_credit_order,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].discount_amount::decimal(7,2) as transaction_discount_amount,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].discount_code::string as transaction_discount_code,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].shipping::decimal(7,2) as transaction_shipping,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].tax::decimal(7,2) as transaction_tax,

    -- unpacking the ecommerce cart object
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_cart_1[0].cart_id::string as cart_id,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_cart_1[0].currency::string as cart_currency,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_cart_1[0].total_value::decimal(7,2) as cart_total_value,

    -- unpacking the ecommerce action object
    a.unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1.type::string as ecommerce_action_type,
    a.unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1.name::string as ecommerce_action_name,

    a.* except(contexts_com_snowplowanalytics_snowplow_web_page_1, domain_userid)

  from {{ var('snowplow__events') }} as a
  inner join {{ ref('snowplow_ecommerce_base_sessions_this_run') }} as b
  on a.domain_sessionid = b.session_id

  where a.collector_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'b.start_tstamp') }}
  and a.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'a.dvce_created_tstamp') }}
  and a.collector_tstamp >= {{ lower_limit }}
  and a.collector_tstamp <= {{ upper_limit }}
  and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
  and {{ snowplow_ecommerce.event_name_filter(var("snowplow__ecommerce_event_names", "['snowplow_ecommerce_action']")) }}

  qualify row_number() over (partition by a.event_id order by a.collector_tstamp) = 1
)

select *,
       dense_rank() over (partition by domain_sessionid order by derived_tstamp) AS event_in_session_index

from prep
```
</TabItem>
<TabItem value="snowflake" label="snowflake" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/base/scratch/snowflake/snowplow_ecommerce_base_events_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    tags=["this_run"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref('snowplow_ecommerce_base_sessions_this_run'),
                                                                          'start_tstamp',
                                                                          'end_tstamp') %}

with prep as (

  select
    a.contexts_com_snowplowanalytics_snowplow_web_page_1[0]:id::varchar as page_view_id,
    b.domain_userid,

    -- unpacking the ecommerce user object
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_user_1[0]:id::varchar as ecommerce_user_id,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_user_1[0]:email::varchar as ecommerce_user_email,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_user_1[0]:is_guest::boolean as ecommerce_user_is_guest,

    -- unpacking the ecommerce checkout step object
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0]:step::int as checkout_step_number,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0]:account_type::varchar as checkout_account_type,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0]:billing_full_address::varchar as checkout_billing_full_address,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0]:billing_postcode::varchar as checkout_billing_postcode,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0]:coupon_code::varchar as checkout_coupon_code,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0]:delivery_method::varchar as checkout_delivery_method,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0]:delivery_provider::varchar as checkout_delivery_provider,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0]:marketing_opt_in::boolean as checkout_marketing_opt_in,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0]:payment_method::varchar as checkout_payment_method,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0]:proof_of_payment::varchar as checkout_proof_of_payment,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0]:shipping_full_address::varchar as checkout_shipping_full_address,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1[0]:shipping_postcode::varchar as checkout_shipping_postcode,

    -- unpacking the ecommerce page object
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_page_1[0]:type::varchar as ecommerce_page_type,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_page_1[0]:language::varchar as ecommerce_page_language,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_page_1[0]:locale::varchar as ecommerce_page_locale,

    -- unpacking the ecommerce transaction object
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:transaction_id::varchar as transaction_id,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:currency::varchar as transaction_currency,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:payment_method::varchar as transaction_payment_method,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:revenue::decimal(7,2) as transaction_revenue,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:total_quantity::int as transaction_total_quantity,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:credit_order::boolean as transaction_credit_order,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:discount_amount::decimal(7,2) as transaction_discount_amount,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:discount_code::varchar as transaction_discount_code,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:shipping::decimal(7,2) as transaction_shipping,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:tax::decimal(7,2) as transaction_tax,

    -- unpacking the ecommerce cart object
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_cart_1[0]:cart_id::varchar as cart_id,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_cart_1[0]:currency::varchar as cart_currency,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_cart_1[0]:total_value::decimal(7,2) as cart_total_value,

    -- unpacking the ecommerce action object
    a.unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1:type::varchar as ecommerce_action_type,
    a.unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1:name::varchar as ecommerce_action_name,

    a.* exclude(contexts_com_snowplowanalytics_snowplow_web_page_1, domain_userid)


  from {{ var('snowplow__events') }} as a
  inner join {{ ref('snowplow_ecommerce_base_sessions_this_run') }} as b
  on a.domain_sessionid = b.session_id

  where a.collector_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'b.start_tstamp') }}
  and a.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'a.dvce_created_tstamp') }}
  and a.collector_tstamp >= {{ lower_limit }}
  and a.collector_tstamp <= {{ upper_limit }}
  and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
  and {{ snowplow_ecommerce.event_name_filter(var("snowplow__ecommerce_event_names", "['snowplow_ecommerce_action']")) }}

  qualify row_number() over (partition by a.event_id order by a.collector_tstamp) = 1
)

select *,
       dense_rank() over (partition by domain_sessionid order by derived_tstamp) AS event_in_session_index

from prep
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_ecommerce.cart_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.cart_fields)
- [macro.snowplow_ecommerce.checkout_step_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.checkout_step_fields)
- [macro.snowplow_ecommerce.event_name_filter](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.event_name_filter)
- [macro.snowplow_ecommerce.tracking_action_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.tracking_action_fields)
- [macro.snowplow_ecommerce.tracking_page_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.tracking_page_fields)
- [macro.snowplow_ecommerce.transaction_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.transaction_fields)
- [macro.snowplow_ecommerce.user_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.user_fields)
- [macro.snowplow_utils.app_id_filter](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.app_id_filter)
- [macro.snowplow_utils.get_optional_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_optional_fields)
- [macro.snowplow_utils.return_limits_from_model](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_limits_from_model)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Base New Event Limits {#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits}

<DbtDetails><summary>
<code>models/base/scratch/snowplow_ecommerce_base_new_event_limits.sql</code>
</summary>

#### Description
This table contains the lower and upper timestamp limits for the given run of the web model. These limits are used to select new events from the events table.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| lower_limit | The lower `collector_tstamp` limit for the run |
| upper_limit | The upper `collector_tstamp` limit for the run |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/base/scratch/snowplow_ecommerce_base_new_event_limits.sql">Source</a></i></b></center>

```jinja2
{{ config(
   post_hook=["{{snowplow_utils.print_run_limits(this)}}"],
   sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
   )
}}


{%- set models_in_run = snowplow_utils.get_enabled_snowplow_models('snowplow_ecommerce') -%}

{% set min_last_success,
         max_last_success,
         models_matched_from_manifest,
         has_matched_all_models = snowplow_utils.get_incremental_manifest_status(ref('snowplow_ecommerce_incremental_manifest'),
                                                                                 models_in_run) -%}


{% set run_limits_query = snowplow_utils.get_run_limits(min_last_success,
                                                          max_last_success,
                                                          models_matched_from_manifest,
                                                          has_matched_all_models,
                                                          var("snowplow__start_date","2020-01-01")) -%}


{{ run_limits_query }}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.get_enabled_snowplow_models](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_enabled_snowplow_models)
- [macro.snowplow_utils.get_incremental_manifest_status](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_incremental_manifest_status)
- [macro.snowplow_utils.get_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_run_limits)
- [macro.snowplow_utils.print_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.print_run_limits)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions)
- [model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Base Quarantined Sessions {#model.snowplow_ecommerce.snowplow_ecommerce_base_quarantined_sessions}

<DbtDetails><summary>
<code>models/base/manifest/snowplow_ecommerce_base_quarantined_sessions.sql</code>
</summary>

#### Description
This table contains any sessions that have been quarantined. Sessions are quarantined once they exceed the maximum allowed session length, defined by `snowplow__max_session_days`.
Once quarantined, no further events from these sessions will be processed. Events up until the point of quarantine remain in your derived tables.
The reason for removing long sessions is to reduce table scans on both the events table and all derived tables. This improves performance greatly.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| session_id | The `session_id` of the quarantined session |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/base/manifest/snowplow_ecommerce_base_quarantined_sessions.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized='incremental',
    full_refresh=snowplow_ecommerce.allow_refresh(),
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
  )
}}

/*
Boilerplate to generate table.
Table updated as part of post-hook on sessions_this_run
Any sessions exceeding max_session_days are quarantined
Once quarantined, any subsequent events from the session will not be processed.
This significantly reduces table scans
*/

with prep as (
  select
    cast(null as {{ snowplow_utils.type_string(64) }}) session_id
)

select *

from prep
where false
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_ecommerce.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.allow_refresh)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.type_string](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.type_string)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Base Sessions Lifecycle Manifest {#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest}

<DbtDetails><summary>
<code>models/base/manifest/snowplow_ecommerce_base_sessions_lifecycle_manifest.sql</code>
</summary>

#### Description
This incremental table is a manifest of all sessions that have been processed by the Snowplow dbt ecommerce package. For each session, the start and end timestamp is recorded.

By knowing the lifecycle of a session the model is able to able to determine which sessions and thus events to process for a given timeframe, as well as the complete date range required to reprocess all events of each session.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| session_id | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ |
| start_tstamp | The `collector_tstamp` when the session began |
| end_tstamp | The `collector_tstamp` when the session ended |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/base/manifest/snowplow_ecommerce_base_sessions_lifecycle_manifest.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized=var("snowplow__incremental_materialization"),
    unique_key='session_id',
    upsert_date_key='start_tstamp',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }),
    full_refresh=snowplow_ecommerce.allow_refresh(),
    tags=["manifest"]
  )
}}

-- Known edge cases:
-- 1: Rare case with multiple domain_userid per session.

{% set lower_limit, upper_limit, _ = snowplow_utils.return_base_new_event_limits(ref('snowplow_ecommerce_base_new_event_limits')) %}
{% set session_lookback_limit = snowplow_utils.get_session_lookback_limit(lower_limit) %}
{% set is_run_with_new_events = snowplow_utils.is_run_with_new_events('snowplow_ecommerce') %}

with new_events_session_ids as (
  select
    e.domain_sessionid as session_id,
    max(e.domain_userid) as domain_userid, -- Edge case 1: Arbitary selection to avoid window function like first_value.
    min(e.collector_tstamp) as start_tstamp,
    max(e.collector_tstamp) as end_tstamp

  from {{ var('snowplow__events') }} e

  where
    e.domain_sessionid is not null
    and not exists (select 1 from {{ ref('snowplow_ecommerce_base_quarantined_sessions') }} as a where a.session_id = e.domain_sessionid) -- don't continue processing v.long sessions
    and e.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'dvce_created_tstamp') }} -- don't process data that's too late
    and e.collector_tstamp >= {{ lower_limit }}
    and e.collector_tstamp <= {{ upper_limit }}
    and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
    and {{ event_name_filter(var("snowplow__ecommerce_event_names", ["snowplow_ecommerce_event"]))}}
    and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.
    {% if var('snowplow__derived_tstamp_partitioned', true) and target.type == 'bigquery' | as_bool() %} -- BQ only
      and e.derived_tstamp >= {{ lower_limit }}
      and e.derived_tstamp <= {{ upper_limit }}
    {% endif %}

  group by 1
  )

{% if snowplow_utils.snowplow_is_incremental() %}

, previous_sessions as (
  select *

  from {{ this }}

  where start_tstamp >= {{ session_lookback_limit }}
  and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.
)

, session_lifecycle as (
  select
    ns.session_id,
    coalesce(self.domain_userid, ns.domain_userid) as domain_userid, -- Edge case 1: Take previous value to keep domain_userid consistent. Not deterministic but performant
    least(ns.start_tstamp, coalesce(self.start_tstamp, ns.start_tstamp)) as start_tstamp,
    greatest(ns.end_tstamp, coalesce(self.end_tstamp, ns.end_tstamp)) as end_tstamp -- BQ 1 NULL will return null hence coalesce

  from new_events_session_ids ns
  left join previous_sessions as self
    on ns.session_id = self.session_id

  where
    self.session_id is null -- process all new sessions
    or self.end_tstamp < {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'self.start_tstamp') }} --stop updating sessions exceeding 3 days
  )

{% else %}

, session_lifecycle as (

  select * from new_events_session_ids

)

{% endif %}

select
  sl.session_id,
  sl.domain_userid,
  sl.start_tstamp,
  least({{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'sl.start_tstamp') }}, sl.end_tstamp) as end_tstamp -- limit session length to max_session_days
  {% if target.type in ['databricks', 'spark'] -%}
  , DATE(sl.start_tstamp) as start_tstamp_date
  {%- endif %}

from session_lifecycle sl
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_quarantined_sessions)
- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_ecommerce.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.allow_refresh)
- [macro.snowplow_ecommerce.event_name_filter](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.event_name_filter)
- [macro.snowplow_utils.app_id_filter](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.app_id_filter)
- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.get_session_lookback_limit](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_session_lookback_limit)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.return_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_base_new_event_limits)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.snowplow_is_incremental](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_is_incremental)
- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Base Sessions This Run {#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run}

<DbtDetails><summary>
<code>models/base/scratch/snowplow_ecommerce_base_sessions_this_run.sql</code>
</summary>

#### Description
For any given run, this table contains all the required sessions.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| session_id | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ |
| start_tstamp | The `collector_tstamp` when the session began |
| end_tstamp | The `collector_tstamp` when the session ended |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/base/scratch/snowplow_ecommerce_base_sessions_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    tags=["this_run"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    post_hook=[
      "{{ snowplow_utils.quarantine_sessions('snowplow_ecommerce', var('snowplow__max_session_days')) }}"
    ],
  )
}}

{%- set lower_limit,
        upper_limit,
        session_start_limit = snowplow_utils.return_base_new_event_limits(ref('snowplow_ecommerce_base_new_event_limits')) %}

select
  s.session_id,
  s.domain_userid,
  s.start_tstamp,
  -- end_tstamp used in next step to limit events. When backfilling, set end_tstamp to upper_limit if end_tstamp > upper_limit.
  -- This ensures we don't accidentally process events after upper_limit
  case when s.end_tstamp > {{ upper_limit }} then {{ upper_limit }} else s.end_tstamp end as end_tstamp

from {{ ref('snowplow_ecommerce_base_sessions_lifecycle_manifest')}} s

where
-- General window of start_tstamps to limit table scans. Logic complicated by backfills.
-- To be within the run, session start_tstamp must be >= lower_limit - max_session_days as we limit end_tstamp in manifest to start_tstamp + max_session_days
s.start_tstamp >= {{ session_start_limit }}
and s.start_tstamp <= {{ upper_limit }}
-- Select sessions within window that either; start or finish between lower & upper limit, start and finish outside of lower and upper limits
and not (s.start_tstamp > {{ upper_limit }} or s.end_tstamp < {{ lower_limit }})
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_quarantined_sessions)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.quarantine_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.quarantine_sessions)
- [macro.snowplow_utils.return_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_base_new_event_limits)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Cart Interactions {#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions}

<DbtDetails><summary>
<code>models/carts/snowplow_ecommerce_cart_interactions.sql</code>
</summary>

#### Description
This derived incremental table contains all historic cart interactions and should be the end point for any analysis or BI tools.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| event_id | A UUID for each event e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| page_view_id | A UUID for each page view e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| event_in_session_index | The index of the event in the corresponding session. |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. ‘ecdff4d0-9175-40ac-a8bb-325c49733607’ |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ |
| ecommerce_user_id | The ecommerce user id extracted from the ecommerce user context. |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ |
| derived_tstamp_date | Date value of the timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ |
| cart_id | The unique ID representing this cart e.g. abc123 |
| cart_currency | The currency used for this cart (ISO 4217) |
| cart_total_value | The total value of the cart after this interaction |
| cart_created | A boolean to describe whether the cart was created in this action |
| cart_emptied | A boolean to describe whether the cart was emptied in this action |
| cart_transacted | A boolean to describe whether the cart was transacted (purchased) in this action |
| ecommerce_action_type | The type of ecommerce action that was performed, e.g. transaction, add_to_cart, etc. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/carts/snowplow_ecommerce_cart_interactions.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized=var("snowplow__incremental_materialization"),
    unique_key='event_id',
    upsert_date_key='derived_tstamp',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by = {
      "field": "derived_tstamp",
      "data_type": "timestamp"
    }, databricks_partition_by='derived_tstamp_date'),
    tags=["derived"],
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
  )
}}

select *

from {{ ref('snowplow_ecommerce_cart_interactions_this_run') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_ecommerce') }}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Cart Interactions This Run {#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions_this_run}

<DbtDetails><summary>
<code>models/carts/scratch/snowplow_ecommerce_cart_interactions_this_run.sql</code>
</summary>

#### Description
This staging table tracks and stores information about cart interactions that occurred within the current run, with interactions being when a user adds or removes an item from their cart. It possesses all of the same columns as `snowplow_ecommerce_cart_interactions`. If building a custom module that requires cart interactions, this is the table you should reference for that information.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| event_id | A UUID for each event e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| page_view_id | A UUID for each page view e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| event_in_session_index | The index of the event in the corresponding session. |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. ‘ecdff4d0-9175-40ac-a8bb-325c49733607’ |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ |
| ecommerce_user_id | The ecommerce user id extracted from the ecommerce user context. |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ |
| derived_tstamp_date | Date value of the timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ |
| cart_id | The unique ID representing this cart e.g. abc123 |
| cart_currency | The currency used for this cart (ISO 4217) |
| cart_total_value | The total value of the cart after this interaction |
| cart_created | A boolean to describe whether the cart was created in this action |
| cart_emptied | A boolean to describe whether the cart was emptied in this action |
| cart_transacted | A boolean to describe whether the cart was transacted (purchased) in this action |
| ecommerce_action_type | The type of ecommerce action that was performed, e.g. transaction, add_to_cart, etc. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/carts/scratch/snowplow_ecommerce_cart_interactions_this_run.sql">Source</a></i></b></center>

```jinja2
{{
    config(
        tags=["this_run"],
        sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
    )
}}

with cart_product_interactions AS (
    select
        e.event_id,
        e.page_view_id,

        -- session fields
        e.domain_sessionid,
        e.event_in_session_index,

        -- user fields
        e.domain_userid,
        e.network_userid,
        e.user_id,
        e.ecommerce_user_id,

        -- timestamp fields
        e.derived_tstamp,
        DATE(e.derived_tstamp) as derived_tstamp_date,

        -- ecommerce cart fields
        e.cart_id,
        e.cart_currency,
        e.cart_total_value,

        -- ecommerce action field
        e.ecommerce_action_type,
        SUM(pi.product_price) as product_value_added


    from {{ ref('snowplow_ecommerce_base_events_this_run') }} as e
    left join {{ ref('snowplow_ecommerce_product_interactions_this_run') }} as pi on e.event_id = pi.event_id AND pi.is_add_to_cart
    where e.ecommerce_action_type IN ('add_to_cart', 'remove_from_cart', 'transaction')
    group by 1,2,3,4,5,6,7,8,9,10,11,12,13,14
)

select
    -- event fields
    event_id,
    page_view_id,

    -- session fields
    domain_sessionid,
    event_in_session_index,

    -- user fields
    domain_userid,
    network_userid,
    user_id,
    ecommerce_user_id,

    -- timestamp fields
    derived_tstamp,
    derived_tstamp_date,

    -- ecommerce cart fields
    cart_id,
    cart_currency,
    cart_total_value,
    product_value_added = cart_total_value as cart_created,
    cart_total_value = 0 as cart_emptied,
    ecommerce_action_type = 'transaction' as cart_transacted,

    -- ecommerce action field
    ecommerce_action_type


from cart_product_interactions
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Checkout Interactions {#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions}

<DbtDetails><summary>
<code>models/checkouts/snowplow_ecommerce_checkout_interactions.sql</code>
</summary>

#### Description
This derived incremental table contains all historic checkout interactions and should be the end point for any analysis or BI tools.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| event_id | A UUID for each event e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| page_view_id | A UUID for each page view e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| event_in_session_index | The index of the event in the corresponding session. |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. ‘ecdff4d0-9175-40ac-a8bb-325c49733607’ |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ |
| ecommerce_user_id | The ecommerce user id extracted from the ecommerce user context. |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ |
| derived_tstamp_date | Date value of the timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ |
| ecommerce_action_type | The type of ecommerce action that was performed, e.g. transaction, add_to_cart, etc. |
| ecommerce_action_name | The name that is associated with the ecommerce action. E.g. when a list_click occurs, the name of the product list such as 'recommended' or 'shop the look' |
| ecommerce_page_type | The type of the page that was visited E.g. homepage, product page, checkout page |
| checkout_step_number | The checkout step index e.g. 1 |
| checkout_account_type | The type of account that is conducting the checkout e.g. guest |
| checkout_billing_full_address | The full billing address provided at the checkout step e.g. 1 Lincoln Street |
| checkout_billing_postcode | The full billing postcode/zipcode provided at the checkout step e.g. 90210 |
| checkout_coupon_code | The coupon code used at the checkout step e.g. SNOWPLOW50 |
| checkout_delivery_method | The delivery method selected at the checkout step e.g. Store pickup |
| checkout_delivery_provider | The delivery provider selected at the checkout step e.g. SantaPost |
| checkout_marketing_opt_in | A boolean to describe whether or not the user has opted in for marketing emails at the checkout step |
| checkout_payment_method | The chosen payment method selected at the checkout step e.g. Credit Card |
| checkout_proof_of_payment | The proof of payment given at the checkout step, e.g. invoice or receipt |
| checkout_shipping_full_address | Full shipping address |
| checkout_shipping_postcode | Shipping address postcode |
| session_entered_at_step | A boolean to describe whether the session was entered at this checkout step |
| checkout_succeeded | A boolean to describe whether the checkout succeeded |
| ecommerce_user_email | The ecommerce user email, extracted from the ecommerce user context. |
| ecommerce_user_is_guest | A boolean extracted from the ecommerce user context to ascertain whether a user is a guest or not. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/checkouts/snowplow_ecommerce_checkout_interactions.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized=var("snowplow__incremental_materialization"),
    unique_key='event_id',
    upsert_date_key='derived_tstamp',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by = {
      "field": "derived_tstamp",
      "data_type": "timestamp"
    }, databricks_partition_by='derived_tstamp_date'),
    tags=["derived"],
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
  )
}}

select *

from {{ ref('snowplow_ecommerce_checkout_interactions_this_run') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_ecommerce') }}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Checkout Interactions This Run {#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions_this_run}

<DbtDetails><summary>
<code>models/checkouts/scratch/snowplow_ecommerce_checkout_interactions_this_run.sql</code>
</summary>

#### Description
This staging table tracks and stores information about checkout interactions that occurred within the current run, with interactions being when a user progresses through the checkout flow or completes a transaction. It possesses all of the same columns as `snowplow_ecommerce_checkout_interactions`. If building a custom module that requires checkout interactions, this is the table you should reference for that information.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| event_id | A UUID for each event e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| page_view_id | A UUID for each page view e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| event_in_session_index | The index of the event in the corresponding session. |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. ‘ecdff4d0-9175-40ac-a8bb-325c49733607’ |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ |
| ecommerce_user_id | The ecommerce user id extracted from the ecommerce user context. |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ |
| derived_tstamp_date | Date value of the timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ |
| ecommerce_action_type | The type of ecommerce action that was performed, e.g. transaction, add_to_cart, etc. |
| ecommerce_action_name | The name that is associated with the ecommerce action. E.g. when a list_click occurs, the name of the product list such as 'recommended' or 'shop the look' |
| ecommerce_page_type | The type of the page that was visited E.g. homepage, product page, checkout page |
| checkout_step_number | The checkout step index e.g. 1 |
| checkout_account_type | The type of account that is conducting the checkout e.g. guest |
| checkout_billing_full_address | The full billing address provided at the checkout step e.g. 1 Lincoln Street |
| checkout_billing_postcode | The full billing postcode/zipcode provided at the checkout step e.g. 90210 |
| checkout_coupon_code | The coupon code used at the checkout step e.g. SNOWPLOW50 |
| checkout_delivery_method | The delivery method selected at the checkout step e.g. Store pickup |
| checkout_delivery_provider | The delivery provider selected at the checkout step e.g. SantaPost |
| checkout_marketing_opt_in | A boolean to describe whether or not the user has opted in for marketing emails at the checkout step |
| checkout_payment_method | The chosen payment method selected at the checkout step e.g. Credit Card |
| checkout_proof_of_payment | The proof of payment given at the checkout step, e.g. invoice or receipt |
| checkout_shipping_full_address | Full shipping address |
| checkout_shipping_postcode | Shipping address postcode |
| session_entered_at_step | A boolean to describe whether the session was entered at this checkout step |
| checkout_succeeded | A boolean to describe whether the checkout succeeded |
| ecommerce_user_email | The ecommerce user email, extracted from the ecommerce user context. |
| ecommerce_user_is_guest | A boolean extracted from the ecommerce user context to ascertain whether a user is a guest or not. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/checkouts/scratch/snowplow_ecommerce_checkout_interactions_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    tags=["this_run"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

select
  -- event fields
  event_id,
  page_view_id,

  -- session fields
  domain_sessionid,
  event_in_session_index,

  -- user fields
  domain_userid,
  network_userid,
  user_id,
  ecommerce_user_id,

  -- timestamp fields
  derived_tstamp,
  DATE(derived_tstamp) as derived_tstamp_date,

  -- ecommerce action fields
  ecommerce_action_type,
  ecommerce_action_name,
  ecommerce_page_type,

  -- checkout step fields
  CASE WHEN ecommerce_action_type = 'transaction' THEN {{ var("snowplow__number_checkout_steps", 4) }}
    ELSE checkout_step_number END as checkout_step_number,
  checkout_account_type,
  checkout_billing_full_address,
  checkout_billing_postcode,
  checkout_coupon_code,
  checkout_delivery_method,
  checkout_delivery_provider,
  checkout_marketing_opt_in,
  checkout_payment_method,
  checkout_proof_of_payment,
  checkout_shipping_full_address,
  checkout_shipping_postcode,
  event_in_session_index = 1 as session_entered_at_step,
  ecommerce_action_type = 'transaction' as checkout_succeeded,

  -- ecommerce user fields
  ecommerce_user_email,
  ecommerce_user_is_guest

from {{ ref("snowplow_ecommerce_base_events_this_run") }}
where ecommerce_action_type IN ('transaction', 'checkout_step') -- the two checkout step action types. Either you've initiated the checkout or you've finished with a transaction step
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Incremental Manifest {#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest}

<DbtDetails><summary>
<code>models/base/manifest/snowplow_ecommerce_incremental_manifest.sql</code>
</summary>

#### Description
This incremental table is a manifest of the timestamp of the latest event consumed per model within the Snowplow dbt ecommerce package as well as any models leveraging the incremental framework provided by the package. The latest event's timestamp is based off `collector_tstamp`. This table is used to determine what events should be processed in the next run of the model.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| model | The name of the model. |
| last_success | The timestamp of the latest event consumed by the model, based on `collector_tstamp` |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/base/manifest/snowplow_ecommerce_incremental_manifest.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized='incremental',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    full_refresh=snowplow_ecommerce.allow_refresh()
  )
}}

-- Boilerplate to generate table.
-- Table updated as part of end-run hook

with prep as (
  select
    cast(null as {{ snowplow_utils.type_string(4096) }}) model,
    cast('1970-01-01' as {{ type_timestamp() }}) as last_success
)

select *

from prep
where false
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- macro.dbt.type_timestamp
- [macro.snowplow_ecommerce.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.allow_refresh)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.type_string](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.type_string)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions)
- [model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Product Interactions {#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions}

<DbtDetails><summary>
<code>models/products/snowplow_ecommerce_product_interactions.sql</code>
</summary>

#### Description
This derived incremental table contains all historic product interactions and should be the end point for any analysis or BI tools.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| product_event_id | A surrogate key which is a combination of `product_id` and `event_id` |
| event_id | A UUID for each event e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| page_view_id | A UUID for each page view e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| event_in_session_index | The index of the event in the corresponding session. |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. ‘ecdff4d0-9175-40ac-a8bb-325c49733607’ |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ |
| ecommerce_user_id | The ecommerce user id extracted from the ecommerce user context. |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ |
| derived_tstamp_date | Date value of the timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ |
| product_id | The SKU or product ID. |
| product_category | The category the product belongs to. Use a consistent separator to express multiple levels. E.g. Woman/Shoes/Sneakers |
| product_subcategory | The subcategories derived from the defined product category using a user-defined separator |
| product_currency | The currency in which the product is being priced (ISO 4217). |
| product_price | The price of the product at the current time. |
| product_brand | The brand of the product. |
| product_creative_id | Identifier/Name/Url for the creative presented on a list or product view. |
| product_inventory_status | The inventory status of the product E.g. in stock, out of stock, preorder, backorder. |
| product_list_price | The list or recommended retail price of a product. |
| product_name | The name or title of the product |
| product_list_position | The position the product was presented in a list of products E.g. search results, product list page. |
| product_quantity | The quantity of the product taking part in the ecommerce action. |
| product_size | The size of the product. |
| product_variant | The variant of the product. |
| is_product_view | A boolean to describe whether this product interaction was a product view |
| product_view_type | The type of product view that occurred, e.g. list_view or product_view |
| is_add_to_cart | A boolean to describe whether this product interaction was an add to cart action |
| is_remove_from_cart | A boolean to describe whether this product interaction was a remove from cart action |
| product_list_name | The name of the list presented to the user E.g. product list, search results, shop the look, frequently bought with. |
| is_product_transaction | A boolean to describe whether this product interaction was a transaction (purchase) interaction |
| transaction_id | The ID of the transaction |
| ecommerce_user_email | The ecommerce user email, extracted from the ecommerce user context. |
| ecommerce_user_is_guest | A boolean extracted from the ecommerce user context to ascertain whether a user is a guest or not. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/products/snowplow_ecommerce_product_interactions.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized=var("snowplow__incremental_materialization"),
    unique_key='product_event_id',
    upsert_date_key='derived_tstamp',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by = {
      "field": "derived_tstamp",
      "data_type": "timestamp"
    }, databricks_partition_by='derived_tstamp_date'),
    tags=["derived"],
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
  )
}}

select *

from {{ ref('snowplow_ecommerce_product_interactions_this_run') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_ecommerce') }}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Product Interactions This Run {#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run}

<DbtDetails><summary>
<code>models/products/scratch/&lt;adaptor&gt;/snowplow_ecommerce_product_interactions_this_run.sql</code>
</summary>

#### Description
This staging table tracks and stores information about product interactions that occurred within the current run, such as a user viewing a product on a product page, or in a product list. It possesses all of the same columns as `snowplow_ecommerce_product_interactions`. If building a custom module that requires checkout interactions, this is the table you should reference for that information.

#### File Paths
<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery" >

`models/products/scratch/bigquery/snowplow_ecommerce_product_interactions_this_run.sql`
</TabItem>
<TabItem value="databricks" label="databricks" >

`models/products/scratch/databricks/snowplow_ecommerce_product_interactions_this_run.sql`
</TabItem>
<TabItem value="snowflake" label="snowflake" >

`models/products/scratch/snowflake/snowplow_ecommerce_product_interactions_this_run.sql`
</TabItem>
</Tabs>


#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| product_event_id | A surrogate key which is a combination of `product_id` and `event_id` |
| event_id | A UUID for each event e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| page_view_id | A UUID for each page view e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| event_in_session_index | The index of the event in the corresponding session. |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. ‘ecdff4d0-9175-40ac-a8bb-325c49733607’ |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ |
| ecommerce_user_id | The ecommerce user id extracted from the ecommerce user context. |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ |
| derived_tstamp_date | Date value of the timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ |
| product_id | The SKU or product ID. |
| product_category | The category the product belongs to. Use a consistent separator to express multiple levels. E.g. Woman/Shoes/Sneakers |
| product_subcategory | The subcategories derived from the defined product category using a user-defined separator |
| product_currency | The currency in which the product is being priced (ISO 4217). |
| product_price | The price of the product at the current time. |
| product_brand | The brand of the product. |
| product_creative_id | Identifier/Name/Url for the creative presented on a list or product view. |
| product_inventory_status | The inventory status of the product E.g. in stock, out of stock, preorder, backorder. |
| product_list_price | The list or recommended retail price of a product. |
| product_name | The name or title of the product |
| product_list_position | The position the product was presented in a list of products E.g. search results, product list page. |
| product_quantity | The quantity of the product taking part in the ecommerce action. |
| product_size | The size of the product. |
| product_variant | The variant of the product. |
| is_product_view | A boolean to describe whether this product interaction was a product view |
| product_view_type | The type of product view that occurred, e.g. list_view or product_view |
| is_add_to_cart | A boolean to describe whether this product interaction was an add to cart action |
| is_remove_from_cart | A boolean to describe whether this product interaction was a remove from cart action |
| product_list_name | The name of the list presented to the user E.g. product list, search results, shop the look, frequently bought with. |
| is_product_transaction | A boolean to describe whether this product interaction was a transaction (purchase) interaction |
| transaction_id | The ID of the transaction |
| ecommerce_user_email | The ecommerce user email, extracted from the ecommerce user context. |
| ecommerce_user_is_guest | A boolean extracted from the ecommerce user context to ascertain whether a user is a guest or not. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/products/scratch/bigquery/snowplow_ecommerce_product_interactions_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    tags=["this_run"]
  )
}}


with product_info as (
  select
    {{ dbt_utils.generate_surrogate_key(['t.event_id', 'r.id']) }} as product_event_id,
    t.event_id,
    t.page_view_id,

    -- session fields
    t.domain_sessionid,
    t.event_in_session_index,

    -- user fields
    t.domain_userid,
    t.network_userid,
    t.user_id,
    t.ecommerce_user_id,

    -- timestamp fields
    t.derived_tstamp,
    DATE(derived_tstamp) as derived_tstamp_date,

    -- ecommerce product fields
    r.id as product_id,
    r.category as product_category,
    SPLIT(r.category, '{{ var("snowplow__categories_separator", "/") }}') as product_categories_split,
    r.currency as product_currency,
    r.price as product_price,
    r.brand as product_brand,
    r.creative_id as product_creative_id,
    r.inventory_status as product_inventory_status,
    r.list_price as product_list_price,
    r.name as product_name,
    r.position as product_list_position,
    r.quantity as product_quantity,
    r.size as product_size,
    r.variant as product_variant,
    t.ecommerce_action_type,
    t.ecommerce_action_name,

    -- ecommerce action booleans
    t.ecommerce_action_type IN ('product_view', 'list_view') as is_product_view,
    CASE WHEN t.ecommerce_action_type IN ('product_view', 'list_view') THEN t.ecommerce_action_type END as product_view_type,
    t.ecommerce_action_type = 'add_to_cart' as is_add_to_cart,
    t.ecommerce_action_type = 'remove_from_cart' as is_remove_from_cart,
    CASE WHEN t.ecommerce_action_type = 'list_view' THEN t.ecommerce_action_name END as product_list_name,
    t.ecommerce_action_type = 'transaction' as is_product_transaction,

    t.ecommerce_user_is_guest,
    t.ecommerce_user_email,
    t.transaction_id


  from {{ ref('snowplow_ecommerce_base_events_this_run') }} as t, unnest( {{coalesce_columns_by_prefix(ref('snowplow_ecommerce_base_events_this_run'), 'contexts_com_snowplowanalytics_snowplow_ecommerce_product_1') }}) r

)

select
  product_event_id,
  -- event fields
  event_id,
  page_view_id,

  -- session fields
  domain_sessionid,
  event_in_session_index,

  -- user fields
  domain_userid,
  network_userid,
  user_id,
  ecommerce_user_id,

  -- timestamp fields
  derived_tstamp,
  derived_tstamp_date,

  -- ecommerce product fields
  product_id,
  product_category,
  {%- for i in range(var("snowplow__number_category_levels", 4)) %}
  product_categories_split[safe_offset({{i}})] as product_subcategory_{{i+1}},
  {%- endfor %}
  product_currency,
  product_price,
  product_brand,
  product_creative_id,
  product_inventory_status,
  product_list_price,
  product_name,
  product_list_position,
  product_quantity,
  product_size,
  product_variant,

  -- ecommerce action booleans
  is_product_view,
  product_view_type,
  is_add_to_cart,
  is_remove_from_cart,
  product_list_name,
  is_product_transaction,

  -- transaction and user fields
  transaction_id,
  ecommerce_user_email,
  ecommerce_user_is_guest

from product_info
```
</TabItem>
<TabItem value="databricks" label="databricks" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/products/scratch/databricks/snowplow_ecommerce_product_interactions_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    tags=["this_run"]
  )
}}

with prep as (

  select
    t.event_id,
    t.page_view_id,

    -- session fields
    t.domain_sessionid,
    t.event_in_session_index,

    -- user fields
    t.domain_userid,
    t.network_userid,
    t.user_id,
    t.ecommerce_user_id,

    -- timestamp fields
    t.derived_tstamp,
    DATE(derived_tstamp) as derived_tstamp_date,

    t.ecommerce_action_type,
    t.ecommerce_action_name,

    -- ecommerce action booleans
    t.ecommerce_action_type IN ('product_view', 'list_view') as is_product_view,
    CASE WHEN t.ecommerce_action_type IN ('product_view', 'list_view') THEN t.ecommerce_action_type END as product_view_type,
    t.ecommerce_action_type = 'add_to_cart' as is_add_to_cart,
    t.ecommerce_action_type = 'remove_from_cart' as is_remove_from_cart,
    CASE WHEN t.ecommerce_action_type = 'list_view' THEN t.ecommerce_action_name END as product_list_name,
    t.ecommerce_action_type = 'transaction' as is_product_transaction,

    t.ecommerce_user_is_guest,
    t.ecommerce_user_email,
    t.transaction_id,

    EXPLODE(contexts_com_snowplowanalytics_snowplow_ecommerce_product_1) as contexts_com_snowplowanalytics_snowplow_ecommerce_product_1

  from {{ ref('snowplow_ecommerce_base_events_this_run') }} as t

), product_info as (
  select
    {{ dbt_utils.generate_surrogate_key(['event_id', 'contexts_com_snowplowanalytics_snowplow_ecommerce_product_1.id']) }} as product_event_id,
    event_id,
    page_view_id,

    -- session fields
    domain_sessionid,
    event_in_session_index,

    -- user fields
    domain_userid,
    network_userid,
    user_id,
    ecommerce_user_id,

    -- timestamp fields
    derived_tstamp,
    derived_tstamp_date,

    -- ecommerce product fields
    contexts_com_snowplowanalytics_snowplow_ecommerce_product_1.id::string as product_id,
    contexts_com_snowplowanalytics_snowplow_ecommerce_product_1.category::string as product_category,
    {%- for i in range(var("snowplow__number_category_levels", 4)) %}
    split_part(contexts_com_snowplowanalytics_snowplow_ecommerce_product_1.category::string, '{{ var("snowplow__categories_separator", "/") }}', {{i+1}}) as product_subcategory_{{i+1}},
    {%- endfor %}
    contexts_com_snowplowanalytics_snowplow_ecommerce_product_1.currency::string as product_currency,
    contexts_com_snowplowanalytics_snowplow_ecommerce_product_1.price::decimal(7,2) as product_price,
    contexts_com_snowplowanalytics_snowplow_ecommerce_product_1.brand::string as product_brand,
    contexts_com_snowplowanalytics_snowplow_ecommerce_product_1.creative_id::string as product_creative_id,
    contexts_com_snowplowanalytics_snowplow_ecommerce_product_1.inventory_status::string as product_inventory_status,
    contexts_com_snowplowanalytics_snowplow_ecommerce_product_1.list_price::float as product_list_price,
    contexts_com_snowplowanalytics_snowplow_ecommerce_product_1.name::string as product_name,
    contexts_com_snowplowanalytics_snowplow_ecommerce_product_1.position::integer as product_list_position,
    contexts_com_snowplowanalytics_snowplow_ecommerce_product_1.quantity::integer as product_quantity,
    contexts_com_snowplowanalytics_snowplow_ecommerce_product_1.size::string as product_size,
    contexts_com_snowplowanalytics_snowplow_ecommerce_product_1.variant::string as product_variant,
    ecommerce_action_type,
    ecommerce_action_name,

    -- ecommerce action booleans
    is_product_view,
    product_view_type,
    is_add_to_cart,
    is_remove_from_cart,
    product_list_name,
    is_product_transaction,

    ecommerce_user_is_guest,
    ecommerce_user_email,
    transaction_id


  from prep

)

select
  product_event_id,
  -- event fields
  event_id,
  page_view_id,

  -- session fields
  domain_sessionid,
  event_in_session_index,

  -- user fields
  domain_userid,
  network_userid,
  user_id,
  ecommerce_user_id,

  -- timestamp fields
  derived_tstamp,
  derived_tstamp_date,

  -- ecommerce product fields
  product_id,
  product_category,
  {%- for i in range(var("snowplow__number_category_levels", 4)) %}
  CASE WHEN product_subcategory_{{i+1}} = '' THEN NULL ELSE product_subcategory_{{i+1}} END as product_subcategory_{{i+1}}, -- in case the product itself has less than the maximum number of category levels, we stay consistent with BQ/Snowflake
  {%- endfor %}
  product_currency,
  product_price,
  product_brand,
  product_creative_id,
  product_inventory_status,
  product_list_price,
  product_name,
  product_list_position,
  product_quantity,
  product_size,
  product_variant,

  -- ecommerce action booleans
  is_product_view,
  product_view_type,
  is_add_to_cart,
  is_remove_from_cart,
  product_list_name,
  is_product_transaction,

  -- transaction and user fields
  transaction_id,
  ecommerce_user_email,
  ecommerce_user_is_guest

from product_info
```
</TabItem>
<TabItem value="snowflake" label="snowflake" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/products/scratch/snowflake/snowplow_ecommerce_product_interactions_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    tags=["this_run"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

with product_info as (
  select
    {{ dbt_utils.generate_surrogate_key(['t.event_id', 'r.value:id']) }} as product_event_id,
    t.event_id,
    t.page_view_id,

    -- session fields
    t.domain_sessionid,
    t.event_in_session_index,

    -- user fields
    t.domain_userid,
    t.network_userid,
    t.user_id,
    t.ecommerce_user_id,

    -- timestamp fields
    t.derived_tstamp,
    DATE(derived_tstamp) as derived_tstamp_date,

    -- ecommerce product fields
    r.value:id::string as product_id,
    r.value:category::string as product_category,
    SPLIT(r.value:category, '{{ var("snowplow__categories_separator", "/") }}') as product_categories_split,
    r.value:currency::string as product_currency,
    r.value:price::decimal(7,2) as product_price,
    r.value:brand::string as product_brand,
    r.value:creative_id::string as product_creative_id,
    r.value:inventory_status::string as product_inventory_status,
    r.value:list_price::decimal(7,2) as product_list_price,
    r.value:name::string as product_name,
    r.value:position::integer as product_list_position,
    r.value:quantity::integer as product_quantity,
    r.value:size::string as product_size,
    r.value:variant::string as product_variant,
    t.ecommerce_action_type,
    t.ecommerce_action_name,

    -- ecommerce action booleans
    t.ecommerce_action_type IN ('product_view', 'list_view') as is_product_view,
    CASE WHEN t.ecommerce_action_type IN ('product_view', 'list_view') THEN t.ecommerce_action_type END as product_view_type,
    t.ecommerce_action_type = 'add_to_cart' as is_add_to_cart,
    t.ecommerce_action_type = 'remove_from_cart' as is_remove_from_cart,
    CASE WHEN t.ecommerce_action_type = 'list_view' THEN t.ecommerce_action_name END as product_list_name,
    t.ecommerce_action_type = 'transaction' as is_product_transaction,

    t.ecommerce_user_is_guest,
    t.ecommerce_user_email,
    t.transaction_id


  from {{ ref('snowplow_ecommerce_base_events_this_run') }} as t,
  LATERAL FLATTEN(input => t.contexts_com_snowplowanalytics_snowplow_ecommerce_product_1) r

)

select
  product_event_id,
  -- event fields
  event_id,
  page_view_id,

  -- session fields
  domain_sessionid,
  event_in_session_index,

  -- user fields
  domain_userid,
  network_userid,
  user_id,
  ecommerce_user_id,

  -- timestamp fields
  derived_tstamp,
  derived_tstamp_date,

  -- ecommerce product fields
  product_id,
  product_category,
  {%- for i in range(var("snowplow__number_category_levels", 4)) %}
  product_categories_split[{{i}}]::string as product_subcategory_{{i+1}},
  {%- endfor %}
  product_currency,
  product_price,
  product_brand,
  product_creative_id,
  product_inventory_status,
  product_list_price,
  product_name,
  product_list_position,
  product_quantity,
  product_size,
  product_variant,

  -- ecommerce action booleans
  is_product_view,
  product_view_type,
  is_add_to_cart,
  is_remove_from_cart,
  product_list_name,
  is_product_transaction,

  -- transaction and user fields
  transaction_id,
  ecommerce_user_email,
  ecommerce_user_is_guest

from product_info
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- macro.dbt_utils.generate_surrogate_key
- [macro.snowplow_ecommerce.coalesce_columns_by_prefix](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.coalesce_columns_by_prefix)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Sessions {#model.snowplow_ecommerce.snowplow_ecommerce_sessions}

<DbtDetails><summary>
<code>models/sessions/snowplow_ecommerce_sessions.sql</code>
</summary>

#### Description
This derived incremental table contains all historic sessions data specifically for ecommerce actions and should be the end point for any analysis or BI tools.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| start_tstamp | The first time the session interacted with the website |
| end_tstamp | The last time the session interacted with the website |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ |
| number_unique_cart_ids | The total number of unique `cart_id`s over the session's lifetime |
| number_carts_created | The total number of carts created over the session's lifetime |
| number_carts_emptied | The total number of carts emptied over the session's lifetime |
| number_carts_transacted | The total number of carts transacted over the session's lifetime |
| first_cart_created | The timestamp of when the session first created a cart |
| last_cart_created | The timestamp of when the session last created a cart |
| first_cart_transacted | The timestamp of when the session first transacted (purchased) the contents of a cart |
| last_cart_transacted | The timestamp of when the session last transacted (purchased) the contents of a cart |
| session_cart_abandoned | A boolean to describe whether the session's cart was abandoned |
| session_entered_at_step | A boolean to describe whether the session was entered at this checkout step |
| number_unique_checkout_steps_attempted | The total distinct number of checkout steps that a session went through |
| number_checkout_steps_visited | The total number of (non-unique) checkout steps that a session went through |
| checkout_succeeded | A boolean to describe whether the checkout succeeded |
| first_checkout_attempted | The timestamp of when the session first attempted any checkout steps |
| last_checkout_attempted | The timestamp of when the session last attempted any checkout steps |
| first_checkout_succeeded | The timestamp of when the session first succeeded in checking out products |
| last_checkout_succeeded | The timestamp of when the session last succeeded in checking out products |
| first_product_view | The timestamp of when the session first viewed a product |
| last_product_view | The timestamp of when the session last viewed a product |
| first_product_add_to_cart | The timestamp of when the session first added a product to their cart |
| last_product_add_to_cart | The timestamp of when the session last added a product to their cart |
| first_product_remove_from_cart | The timestamp of when the session first removed a product from their cart |
| last_product_remove_from_cart | The timestamp of when the session last removed a product from their cart |
| first_product_transaction | The timestamp of when the session first purchased a product |
| last_product_transaction | The timestamp of when the session last purchased a product |
| number_product_views | The number of product views that occurred within a session |
| number_add_to_carts | The number of add to cart actions that occurred within a session |
| number_remove_from_carts | The number of remove from cart actions that occurred within a session |
| number_product_transactions | The number of product transaction actions that occurred within a session |
| first_transaction_completed | The timestamp of when the session first completed a transaction |
| last_transaction_completed | The timestamp of when the session last completed a transaction |
| total_transaction_revenue | The total amount of revenue coming from transactions over the session's lifetime |
| total_transaction_quantity | The total quantity of products coming from transactions over the session's lifetime |
| total_number_transactions | The total number of transactions over the session's lifetime |
| total_transacted_products | The total number of transacted products over the session's lifetime |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/sessions/snowplow_ecommerce_sessions.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized=var("snowplow__incremental_materialization"),
    unique_key='domain_sessionid',
    upsert_date_key='start_tstamp',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by = {
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_partition_by='start_tstamp_date'),
    tags=["derived"],
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
  )
}}

select *
  {% if target.type in ['databricks', 'spark'] -%}
  , DATE(start_tstamp) as start_tstamp_date
  {%- endif %}
from {{ ref('snowplow_ecommerce_sessions_this_run') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_ecommerce') }}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Sessions This Run {#model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run}

<DbtDetails><summary>
<code>models/sessions/scratch/snowplow_ecommerce_sessions_this_run.sql</code>
</summary>

#### Description
This staging table tracks and stores aggregate information about sessions that occurred within the current run. It possesses all of the same columns as `snowplow_ecommerce_sessions`. If building a custom module that requires session level data, this is the table you should reference for that information.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| start_tstamp | The first time the session interacted with the website |
| end_tstamp | The last time the session interacted with the website |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ |
| number_unique_cart_ids | The total number of unique `cart_id`s over the session's lifetime |
| number_carts_created | The total number of carts created over the session's lifetime |
| number_carts_emptied | The total number of carts emptied over the session's lifetime |
| number_carts_transacted | The total number of carts transacted over the session's lifetime |
| first_cart_created | The timestamp of when the session first created a cart |
| last_cart_created | The timestamp of when the session last created a cart |
| first_cart_transacted | The timestamp of when the session first transacted (purchased) the contents of a cart |
| last_cart_transacted | The timestamp of when the session last transacted (purchased) the contents of a cart |
| session_cart_abandoned | A boolean to describe whether the session's cart was abandoned |
| session_entered_at_checkout | A boolean to describe whether the session started within the checkout |
| number_unique_checkout_steps_attempted | The total distinct number of checkout steps that a session went through |
| number_checkout_steps_visited | The total number of (non-unique) checkout steps that a session went through |
| checkout_succeeded | A boolean to describe whether the checkout succeeded |
| first_checkout_attempted | The timestamp of when the session first attempted any checkout steps |
| last_checkout_attempted | The timestamp of when the session last attempted any checkout steps |
| first_checkout_succeeded | The timestamp of when the session first succeeded in checking out products |
| last_checkout_succeeded | The timestamp of when the session last succeeded in checking out products |
| first_product_view | The timestamp of when the session first viewed a product |
| last_product_view | The timestamp of when the session last viewed a product |
| first_product_add_to_cart | The timestamp of when the session first added a product to their cart |
| last_product_add_to_cart | The timestamp of when the session last added a product to their cart |
| first_product_remove_from_cart | The timestamp of when the session first removed a product from their cart |
| last_product_remove_from_cart | The timestamp of when the session last removed a product from their cart |
| first_product_transaction | The timestamp of when the session first purchased a product |
| last_product_transaction | The timestamp of when the session last purchased a product |
| number_product_views | The number of product views that occurred within a session |
| number_add_to_carts | The number of add to cart actions that occurred within a session |
| number_remove_from_carts | The number of remove from cart actions that occurred within a session |
| number_product_transactions | The number of product transaction actions that occurred within a session |
| number_distinct_products_viewed | The number of distinct product IDs that were viewed within a session |
| first_transaction_completed | The timestamp of when the session first completed a transaction |
| last_transaction_completed | The timestamp of when the session last completed a transaction |
| total_transaction_revenue | The total amount of revenue coming from transactions over the session's lifetime |
| total_transaction_quantity | The total quantity of products coming from transactions over the session's lifetime |
| total_number_transactions | The total number of transactions over the session's lifetime |
| total_transacted_products | The total number of transacted products over the session's lifetime |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/sessions/scratch/snowplow_ecommerce_sessions_this_run.sql">Source</a></i></b></center>

```jinja2
{{
    config(
        tags=["this_run"],
        sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
    )
}}

with cart_session_stats AS (
    select
        t.*,
        number_carts_transacted < number_carts_created as session_cart_abandoned

    from (
        select domain_sessionid,

        COUNT(DISTINCT cart_id) as number_unique_cart_ids,
        COUNT(DISTINCT CASE WHEN cart_created THEN event_id END) as number_carts_created,
        COUNT(DISTINCT CASE WHEN cart_emptied THEN event_id END) as number_carts_emptied,
        COUNT(DISTINCT CASE WHEN cart_transacted THEN event_id END) as number_carts_transacted,

        MIN(CASE WHEN cart_created THEN derived_tstamp END) as first_cart_created,
        MAX(CASE WHEN cart_created THEN derived_tstamp END) as last_cart_created,

        MIN(CASE WHEN cart_transacted THEN derived_tstamp END) as first_cart_transacted,
        MAX(CASE WHEN cart_transacted THEN derived_tstamp END) as last_cart_transacted


        from {{ ref('snowplow_ecommerce_cart_interactions_this_run') }}
        group by 1

    ) as t
), checkout_session_stats AS (
    select
        domain_sessionid,

        MAX(session_entered_at_step) as session_entered_at_checkout,
        COUNT(DISTINCT checkout_step_number) as number_unique_checkout_steps_attempted,
        COUNT(DISTINCT event_id) as number_checkout_steps_visited,
        MAX(checkout_succeeded) as checkout_succeeded,

        MIN(CASE WHEN checkout_step_number = 1 THEN derived_tstamp END) as first_checkout_attempted,
        MAX(CASE WHEN checkout_step_number = 1 THEN derived_tstamp END) as last_checkout_attempted,
        MIN(CASE WHEN checkout_succeeded THEN derived_tstamp END) as first_checkout_succeeded,
        MAX(CASE WHEN checkout_succeeded THEN derived_tstamp END) as last_checkout_succeeded

    from {{ ref('snowplow_ecommerce_checkout_interactions_this_run') }}
    group by 1
), product_session_stats AS (
    select
        domain_sessionid,

        MIN(CASE WHEN is_product_view THEN derived_tstamp END) AS first_product_view,
        MAX(CASE WHEN is_product_view THEN derived_tstamp END) AS last_product_view,
        MIN(CASE WHEN is_add_to_cart THEN derived_tstamp END) AS first_product_add_to_cart,
        MAX(CASE WHEN is_add_to_cart THEN derived_tstamp END) AS last_product_add_to_cart,
        MIN(CASE WHEN is_remove_from_cart THEN derived_tstamp END) AS first_product_remove_from_cart,
        MAX(CASE WHEN is_remove_from_cart THEN derived_tstamp END) AS last_product_remove_from_cart,
        MIN(CASE WHEN is_product_transaction THEN derived_tstamp END) AS first_product_transaction,
        MAX(CASE WHEN is_product_transaction THEN derived_tstamp END) AS last_product_transaction,

        COUNT(DISTINCT CASE WHEN is_product_view THEN event_id END) AS number_product_views,
        COUNT(DISTINCT CASE WHEN is_add_to_cart THEN event_id END) AS number_add_to_carts,
        COUNT(DISTINCT CASE WHEN is_remove_from_cart THEN event_id END) AS number_remove_from_carts,
        COUNT(DISTINCT CASE WHEN is_product_transaction THEN event_id END) AS number_product_transactions,
        COUNT(DISTINCT CASE WHEN is_product_view THEN product_id END) as number_distinct_products_viewed


    from {{ ref('snowplow_ecommerce_product_interactions_this_run') }}
    group by 1
), transaction_session_stats AS (
    select
        domain_sessionid,

        MIN(derived_tstamp) AS first_transaction_completed,
        MAX(derived_tstamp) AS last_transaction_completed,
        SUM(transaction_revenue) as total_transaction_revenue,
        SUM(transaction_total_quantity) as total_transaction_quantity,
        COUNT(DISTINCT transaction_id) as total_number_transactions,
        SUM(number_products) as total_transacted_products


    from {{ ref('snowplow_ecommerce_transaction_interactions_this_run') }}
    group by 1
)
select
    s.session_id as domain_sessionid,
    s.domain_userid,
    s.start_tstamp,
    s.end_tstamp,

    css.number_unique_cart_ids,
    css.number_carts_created,
    css.number_carts_emptied,
    css.number_carts_transacted,

    css.first_cart_created,
    css.last_cart_created,
    css.first_cart_transacted,
    css.last_cart_transacted,
    css.session_cart_abandoned,

    chss.session_entered_at_checkout,
    chss.number_unique_checkout_steps_attempted,
    chss.number_checkout_steps_visited,
    chss.checkout_succeeded,
    chss.first_checkout_attempted,
    chss.last_checkout_attempted,
    chss.first_checkout_succeeded,
    chss.last_checkout_succeeded,

    pss.first_product_view,
    pss.last_product_view,
    pss.first_product_add_to_cart,
    pss.last_product_add_to_cart,
    pss.first_product_remove_from_cart,
    pss.last_product_remove_from_cart,
    pss.first_product_transaction,
    pss.last_product_transaction,
    pss.number_product_views,
    pss.number_add_to_carts,
    pss.number_remove_from_carts,
    pss.number_product_transactions,

    tss.first_transaction_completed,
    tss.last_transaction_completed,
    tss.total_transaction_revenue,
    tss.total_transaction_quantity,
    tss.total_number_transactions,
    tss.total_transacted_products



from {{ ref('snowplow_ecommerce_base_sessions_this_run') }} as s
left join cart_session_stats as css on s.session_id = css.domain_sessionid
left join checkout_session_stats as chss on s.session_id = chss.domain_sessionid
left join product_session_stats as pss on s.session_id = pss.domain_sessionid
left join transaction_session_stats as tss on s.session_id = tss.domain_sessionid
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Transaction Interactions {#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions}

<DbtDetails><summary>
<code>models/transactions/snowplow_ecommerce_transaction_interactions.sql</code>
</summary>

#### Description
This derived incremental table contains all historic transaction interactions and should be the end point for any analysis or BI tools.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| transaction_id | The ID of the transaction |
| event_id | A UUID for each event e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| page_view_id | A UUID for each page view e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| event_in_session_index | The index of the event in the corresponding session. |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. ‘ecdff4d0-9175-40ac-a8bb-325c49733607’ |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ |
| ecommerce_user_id | The ecommerce user id extracted from the ecommerce user context. |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ |
| derived_tstamp_date | Date value of the timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ |
| transaction_currency | The currency used for the transaction (ISO 4217). |
| transaction_payment_method | The payment method used for the transaction. |
| transaction_revenue | The revenue of the transaction. |
| transaction_total_quantity | Total quantity of items in the transaction. |
| transaction_credit_order | Whether the transaction is a credit order or not. |
| transaction_discount_amount | Discount amount taken off |
| transaction_discount_code | Discount code used. |
| transaction_shipping | Total cost of shipping on the transaction. |
| transaction_tax | Total amount of tax on the transaction. |
| ecommerce_user_email | The ecommerce user email, extracted from the ecommerce user context. |
| ecommerce_user_is_guest | A boolean extracted from the ecommerce user context to ascertain whether a user is a guest or not. |
| number_products | The number of products that are contained in a transaction, counted from the product interactions |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/transactions/snowplow_ecommerce_transaction_interactions.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized=var("snowplow__incremental_materialization"),
    unique_key='transaction_id',
    upsert_date_key='derived_tstamp',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by = {
      "field": "derived_tstamp",
      "data_type": "timestamp"
    }, databricks_partition_by='derived_tstamp_date'),
    tags=["derived"],
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
  )
}}

select *

from {{ ref('snowplow_ecommerce_transaction_interactions_this_run') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_ecommerce') }}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Transaction Interactions This Run {#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions_this_run}

<DbtDetails><summary>
<code>models/transactions/scratch/snowplow_ecommerce_transaction_interactions_this_run.sql</code>
</summary>

#### Description
This staging table tracks and stores information about transaction interactions that occurred within the current run, with interactions being when a user completes a transaction. It possesses all of the same columns as `snowplow_ecommerce_transaction_interactions`. If building a custom module that requires checkout interactions, this is the table you should reference for that information.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| transaction_id | The ID of the transaction |
| event_id | A UUID for each event e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| page_view_id | A UUID for each page view e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ |
| event_in_session_index | The index of the event in the corresponding session. |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. ‘ecdff4d0-9175-40ac-a8bb-325c49733607’ |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ |
| ecommerce_user_id | The ecommerce user id extracted from the ecommerce user context. |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ |
| derived_tstamp_date | Date value of the timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ |
| transaction_currency | The currency used for the transaction (ISO 4217). |
| transaction_payment_method | The payment method used for the transaction. |
| transaction_revenue | The revenue of the transaction. |
| transaction_total_quantity | Total quantity of items in the transaction. |
| transaction_credit_order | Whether the transaction is a credit order or not. |
| transaction_discount_amount | Discount amount taken off |
| transaction_discount_code | Discount code used. |
| transaction_shipping | Total cost of shipping on the transaction. |
| transaction_tax | Total amount of tax on the transaction. |
| ecommerce_user_email | The ecommerce user email, extracted from the ecommerce user context. |
| ecommerce_user_is_guest | A boolean extracted from the ecommerce user context to ascertain whether a user is a guest or not. |
| number_products | The number of products that are contained in a transaction, counted from the product interactions |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/transactions/scratch/snowplow_ecommerce_transaction_interactions_this_run.sql">Source</a></i></b></center>

```jinja2
{{
    config(
        tags=["this_run"],
        sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    )
}}

with transaction_info AS (
    select
        -- event fields
        e.event_id,
        e.page_view_id,

        -- session fields
        e.domain_sessionid,
        e.event_in_session_index,

        -- user fields
        e.domain_userid,
        e.network_userid,
        e.user_id,
        e.ecommerce_user_id,

        -- timestamp fields
        e.derived_tstamp,
        DATE(e.derived_tstamp) as derived_tstamp_date,

        -- ecommerce transaction fields
        e.transaction_id as transaction_id,
        e.transaction_currency as transaction_currency,
        e.transaction_payment_method,
        e.transaction_revenue,
        e.transaction_total_quantity,
        e.transaction_credit_order,
        e.transaction_discount_amount,
        e.transaction_discount_code,
        e.transaction_shipping,
        e.transaction_tax,

        -- ecommerce user fields
        e.ecommerce_user_email,
        e.ecommerce_user_is_guest,

        {% if var("snowplow__use_product_quantity", false) -%}
        SUM(pi.product_quantity) as number_products
        {%- else -%}
        COUNT(*) as number_products -- count all products added
        {%- endif %}

    from {{ ref('snowplow_ecommerce_base_events_this_run') }} as e
    left join {{ ref('snowplow_ecommerce_product_interactions_this_run') }} as pi on e.transaction_id = pi.transaction_id AND pi.is_product_transaction
    where ecommerce_action_type = 'transaction'
    group by 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22
)

select *

from transaction_info
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions)

</TabItem>
</Tabs>
</DbtDetails>

