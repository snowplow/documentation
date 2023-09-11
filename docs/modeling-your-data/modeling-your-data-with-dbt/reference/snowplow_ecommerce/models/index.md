---
title: "Snowplow Ecommerce Models"
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

<h4>Description</h4>

For any given run, this table contains all required events to be consumed by subsequent nodes in the Snowplow dbt ecommerce package. This is a cleaned, deduped dataset, containing all columns from the raw events table as well as having the `page_view_id` joined in from the page view context, and all of the fields parsed from the various e-commerce contexts except the `product` context.

**Note: This table should be used as the input to any custom modules that require event level data, rather than selecting straight from `atomic.events`**

<h4>File Paths</h4>

<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery">

`models/base/scratch/bigquery/snowplow_ecommerce_base_events_this_run.sql`

</TabItem>
<TabItem value="databricks" label="databricks">

`models/base/scratch/databricks/snowplow_ecommerce_base_events_this_run.sql`

</TabItem>
<TabItem value="default" label="default" default>

`models/base/scratch/default/snowplow_ecommerce_base_events_this_run.sql`

</TabItem>
<TabItem value="snowflake" label="snowflake">

`models/base/scratch/snowflake/snowplow_ecommerce_base_events_this_run.sql`

</TabItem>
</Tabs>


<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

:::note

Base event this run table column lists may be incomplete and is missing contexts/unstructs, please check your warehouse for a more accurate column list.

:::

| Column Name | Description |
|:------------|:------------|
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
<TabItem value="bigquery" label="bigquery">

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
      {% if var('snowplow__enable_mobile_events', false) %}
        coalesce(
          {{ snowplow_utils.get_optional_fields(
          enabled=var('snowplow__enable_mobile_events', false),
          fields=[{'field': 'id', 'dtype': 'string'}],
          col_prefix='contexts_com_snowplowanalytics_mobile_screen_1_',
          relation=source('atomic', 'events'),
          relation_alias='a',
          include_field_alias=false) }},
          a.contexts_com_snowplowanalytics_snowplow_web_page_1_0_0[safe_offset(0)].id
        ) as page_view_id,
        coalesce(
          {{ snowplow_utils.get_optional_fields(
          enabled=var('snowplow__enable_mobile_events', false),
          fields=[{'field': 'session_id', 'dtype': 'string'}],
          col_prefix='contexts_com_snowplowanalytics_snowplow_client_session_1_',
          relation=source('atomic', 'events'),
          relation_alias='a',
          include_field_alias=false) }},
          a.domain_sessionid
        ) as domain_sessionid,
      {% else %}
        a.contexts_com_snowplowanalytics_snowplow_web_page_1_0_0[safe_offset(0)].id as page_view_id,
        a.domain_sessionid,
      {% endif %}
      b.domain_userid,

      -- unpacking the ecommerce user object
      {{ snowplow_utils.get_optional_fields(
          enabled=not var('snowplow__disable_ecommerce_user_context', false),
          fields=user_fields(),
          col_prefix='contexts_com_snowplowanalytics_snowplow_ecommerce_user_1_',
          relation=source('atomic', 'events'),
          relation_alias='a') }},

      -- unpacking the ecommerce checkout step object
      {{ snowplow_utils.get_optional_fields(
          enabled=not var('snowplow__disable_ecommerce_checkouts', false),
          fields=checkout_step_fields(),
          col_prefix='contexts_com_snowplowanalytics_snowplow_ecommerce_checkout_step_1_',
          relation=source('atomic', 'events'),
          relation_alias='a') }},

      -- unpacking the ecommerce page object
      {{ snowplow_utils.get_optional_fields(
          enabled=not var('snowplow__disable_ecommerce_page_context', false),
          fields=tracking_page_fields(),
          col_prefix='contexts_com_snowplowanalytics_snowplow_ecommerce_page_1_',
          relation=source('atomic', 'events'),
          relation_alias='a') }},

      -- unpacking the ecommerce transaction object
      {{ snowplow_utils.get_optional_fields(
          enabled=not var('snowplow__disable_ecommerce_transactions', false),
          fields=transaction_fields(),
          col_prefix='contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1_',
          relation=source('atomic', 'events'),
          relation_alias='a') }},

      -- unpacking the ecommerce cart object
      {{ snowplow_utils.get_optional_fields(
          enabled=not var('snowplow__disable_ecommerce_carts', false),
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

    a.* except (domain_userid,
                contexts_com_snowplowanalytics_snowplow_web_page_1_0_0, domain_sessionid)

    from {{ var('snowplow__events') }} as a
    inner join {{ ref('snowplow_ecommerce_base_sessions_this_run') }} as b
    {% if var('snowplow__enable_mobile_events', false) %}
      on coalesce(
        {{ snowplow_utils.get_optional_fields(
        enabled=var('snowplow__enable_mobile_events', false),
        fields=[{'field': 'session_id', 'dtype': 'string'}],
        col_prefix='contexts_com_snowplowanalytics_snowplow_client_session_1_',
        relation=source('atomic', 'events'),
        relation_alias='a',
        include_field_alias=false) }},
        a.domain_sessionid
      ) = b.session_id
    {% else %}
      on a.domain_sessionid = b.session_id
    {% endif %}

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
<TabItem value="databricks" label="databricks">

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
      {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(
        a.contexts_com_snowplowanalytics_mobile_screen_1[0].id::string,
        a.contexts_com_snowplowanalytics_snowplow_web_page_1[0].id::string
      ) as page_view_id,
      coalesce(
        a.contexts_com_snowplowanalytics_snowplow_client_session_1[0].session_id::string,
        a.domain_sessionid
      ) as domain_sessionid,
    {% else %}
      a.contexts_com_snowplowanalytics_snowplow_web_page_1[0].id::string as page_view_id,
      a.domain_sessionid,
    {% endif %}

    b.domain_userid,

    -- unpacking the ecommerce user object
    {% if var('snowplow__disable_ecommerce_user_context', false) -%}
    cast(NULL as {{ type_string() }}) as ecommerce_user_id,
    cast(NULL as {{ type_string() }}) as ecommerce_user_email,
    cast(NULL as {{ type_boolean() }}) as ecommerce_user_is_guest,
    {%- else -%}
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_user_1[0].id::string as ecommerce_user_id,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_user_1[0].email::string as ecommerce_user_email,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_user_1[0].is_guest::boolean as ecommerce_user_is_guest,
    {%- endif %}

    -- unpacking the ecommerce checkout step object
    {% if var('snowplow__disable_ecommerce_checkouts', false) -%}
    cast(NULL as {{ type_int() }}) as checkout_step_number,
    cast(NULL as {{ type_string() }}) as checkout_account_type,
    cast(NULL as {{ type_string() }}) as checkout_billing_full_address,
    cast(NULL as {{ type_string() }}) as checkout_billing_postcode,
    cast(NULL as {{ type_string() }}) as checkout_coupon_code,
    cast(NULL as {{ type_string() }}) as checkout_delivery_method,
    cast(NULL as {{ type_string() }}) as checkout_delivery_provider,
    cast(NULL as {{ type_boolean() }}) as checkout_marketing_opt_in,
    cast(NULL as {{ type_string() }}) as checkout_payment_method,
    cast(NULL as {{ type_string() }}) as checkout_proof_of_payment,
    cast(NULL as {{ type_string() }}) as checkout_shipping_full_address,
    cast(NULL as {{ type_string() }}) as checkout_shipping_postcode,
    {%- else -%}
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
    {%- endif %}

    -- unpacking the ecommerce page object
    {% if var('snowplow__disable_ecommerce_page_context', false) -%}
    CAST(NULL as {{ type_string() }}) as ecommerce_page_type,
    CAST(NULL as {{ type_string() }}) as ecommerce_page_language,
    CAST(NULL as {{ type_string() }}) as ecommerce_page_locale,
    {%- else -%}
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_page_1[0].type::string as ecommerce_page_type,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_page_1[0].language::string as ecommerce_page_language,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_page_1[0].locale::string as ecommerce_page_locale,
    {%- endif %}

    -- unpacking the ecommerce transaction object
    {% if var('snowplow__disable_ecommerce_transactions', false) -%}
    CAST(NULL AS {{ type_string() }}) as transaction_id,
    CAST(NULL AS {{ type_string() }}) as transaction_currency,
    CAST(NULL AS {{ type_string() }}) as transaction_payment_method,
    CAST(NULL AS decimal(9,2)) as transaction_revenue,
    CAST(NULL AS {{ type_int() }}) as transaction_total_quantity,
    CAST(NULL AS {{ type_boolean() }}) as transaction_credit_order,
    CAST(NULL AS decimal(9,2)) as transaction_discount_amount,
    CAST(NULL AS {{ type_string() }}) as transaction_discount_code,
    CAST(NULL AS decimal(9,2)) as transaction_shipping,
    CAST(NULL AS decimal(9,2)) as transaction_tax,
    {%- else -%}
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].transaction_id::string as transaction_id,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].currency::string as transaction_currency,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].payment_method::string as transaction_payment_method,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].revenue::decimal(9,2) as transaction_revenue,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].total_quantity::int as transaction_total_quantity,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].credit_order::boolean as transaction_credit_order,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].discount_amount::decimal(9,2) as transaction_discount_amount,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].discount_code::string as transaction_discount_code,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].shipping::decimal(9,2) as transaction_shipping,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0].tax::decimal(9,2) as transaction_tax,
    {%- endif %}

    -- unpacking the ecommerce cart object
    {% if var('snowplow__disable_ecommerce_carts', false) -%}
    CAST(NULL AS {{ type_string() }}) as cart_id,
    CAST(NULL AS {{ type_string() }}) as cart_currency,
    CAST(NULL AS decimal(9,2)) as cart_total_value,
    {%- else -%}
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_cart_1[0].cart_id::string as cart_id,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_cart_1[0].currency::string as cart_currency,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_cart_1[0].total_value::decimal(9,2) as cart_total_value,
    {%- endif%}
    -- unpacking the ecommerce action object
    a.unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1.type::string as ecommerce_action_type,
    a.unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1.name::string as ecommerce_action_name,

    a.* except(contexts_com_snowplowanalytics_snowplow_web_page_1, domain_userid, domain_sessionid)

  from {{ var('snowplow__events') }} as a
  inner join {{ ref('snowplow_ecommerce_base_sessions_this_run') }} as b
  {% if var('snowplow__enable_mobile_events', false) %}
    on coalesce(
        a.contexts_com_snowplowanalytics_snowplow_client_session_1[0].session_id::string,
        a.domain_sessionid
      ) = b.session_id
  {% else %}
    on a.domain_sessionid = b.session_id
  {% endif %}

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
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/base/scratch/default/snowplow_ecommerce_base_events_this_run.sql">Source</a></i></b></center>

```jinja2
{{
    config(
        sort='collector_tstamp',
        dist='event_id',
        tags=["this_run"]
    )
}}

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref('snowplow_ecommerce_base_sessions_this_run'),
                                                                            'start_tstamp',
                                                                            'end_tstamp') %}

/* Dedupe logic: Per dupe event_id keep earliest row ordered by collector_tstamp.
   If multiple earliest rows, take arbitrary one using row_number(). */

with

{% if var('snowplow__enable_mobile_events', false) -%}
    {{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__context_mobile_session'), lower_limit, upper_limit, 'mob_session') }},
    {{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__context_screen'), lower_limit, upper_limit, 'mob_sc_view') }},
{%- endif %}

events_this_run AS (
    select
        a.app_id,
        a.platform,
        a.etl_tstamp,
        a.collector_tstamp,
        a.dvce_created_tstamp,
        a.event,
        a.event_id,
        a.txn_id,
        a.name_tracker,
        a.v_tracker,
        a.v_collector,
        a.v_etl,
        a.user_id,
        a.user_ipaddress,
        a.user_fingerprint,
        b.domain_userid, -- take domain_userid from manifest. This ensures only 1 domain_userid per session.
        a.domain_sessionidx,
        a.network_userid,
        a.geo_country,
        a.geo_region,
        a.geo_city,
        a.geo_zipcode,
        a.geo_latitude,
        a.geo_longitude,
        a.geo_region_name,
        a.ip_isp,
        a.ip_organization,
        a.ip_domain,
        a.ip_netspeed,
        a.page_url,
        a.page_title,
        a.page_referrer,
        a.page_urlscheme,
        a.page_urlhost,
        a.page_urlport,
        a.page_urlpath,
        a.page_urlquery,
        a.page_urlfragment,
        a.refr_urlscheme,
        a.refr_urlhost,
        a.refr_urlport,
        a.refr_urlpath,
        a.refr_urlquery,
        a.refr_urlfragment,
        a.refr_medium,
        a.refr_source,
        a.refr_term,
        a.mkt_medium,
        a.mkt_source,
        a.mkt_term,
        a.mkt_content,
        a.mkt_campaign,
        a.se_category,
        a.se_action,
        a.se_label,
        a.se_property,
        a.se_value,
        a.tr_orderid,
        a.tr_affiliation,
        a.tr_total,
        a.tr_tax,
        a.tr_shipping,
        a.tr_city,
        a.tr_state,
        a.tr_country,
        a.ti_orderid,
        a.ti_sku,
        a.ti_name,
        a.ti_category,
        a.ti_price,
        a.ti_quantity,
        a.pp_xoffset_min,
        a.pp_xoffset_max,
        a.pp_yoffset_min,
        a.pp_yoffset_max,
        a.useragent,
        a.br_name,
        a.br_family,
        a.br_version,
        a.br_type,
        a.br_renderengine,
        a.br_lang,
        a.br_features_pdf,
        a.br_features_flash,
        a.br_features_java,
        a.br_features_director,
        a.br_features_quicktime,
        a.br_features_realplayer,
        a.br_features_windowsmedia,
        a.br_features_gears,
        a.br_features_silverlight,
        a.br_cookies,
        a.br_colordepth,
        a.br_viewwidth,
        a.br_viewheight,
        a.os_name,
        a.os_family,
        a.os_manufacturer,
        a.os_timezone,
        a.dvce_type,
        a.dvce_ismobile,
        a.dvce_screenwidth,
        a.dvce_screenheight,
        a.doc_charset,
        a.doc_width,
        a.doc_height,
        a.tr_currency,
        a.tr_total_base,
        a.tr_tax_base,
        a.tr_shipping_base,
        a.ti_currency,
        a.ti_price_base,
        a.base_currency,
        a.geo_timezone,
        a.mkt_clickid,
        a.mkt_network,
        a.etl_tags,
        a.dvce_sent_tstamp,
        a.refr_domain_userid,
        a.refr_dvce_tstamp,
        {% if var('snowplow__enable_mobile_events', false) %}
            coalesce(
                ms.mob_session_session_id,
                a.domain_sessionid
            ) as domain_sessionid,
        {% else %}
            a.domain_sessionid,
        {% endif %}
        a.derived_tstamp,
        a.event_vendor,
        a.event_name,
        a.event_format,
        a.event_version,
        a.event_fingerprint,
        a.true_tstamp,
        {% if var('snowplow__enable_load_tstamp', true) %}
            a.load_tstamp,
        {% endif %}
        row_number() over (partition by a.event_id order by a.collector_tstamp) as event_id_dedupe_index,
        count(*) over (partition by a.event_id) as event_id_dedupe_count

    from {{ var('snowplow__events') }} as a
    {% if var('snowplow__enable_mobile_events', false) -%}
        left join {{ var('snowplow__context_mobile_session') }} ms on a.event_id = ms.mob_session__id and a.collector_tstamp = ms.mob_session__tstamp
    {%- endif %}
        inner join {{ ref('snowplow_ecommerce_base_sessions_this_run') }} as b
            on
            {% if var('snowplow__enable_mobile_events', false) %}
                coalesce(
                    ms.mob_session_session_id,
                    a.domain_sessionid
                )
            {% else %}
                a.domain_sessionid
            {% endif %} = b.session_id

    where a.collector_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'b.start_tstamp') }}
        and a.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'a.dvce_created_tstamp') }}
        and a.collector_tstamp >= {{ lower_limit }}
        and a.collector_tstamp <= {{ upper_limit }}
        and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
        and {{ snowplow_ecommerce.event_name_filter(var("snowplow__ecommerce_event_names", "['snowplow_ecommerce_action']")) }}

),


{% if not var('snowplow__disable_ecommerce_user_context', false) -%}
    {{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__context_ecommerce_user'), lower_limit, upper_limit, 'ecommerce_user') }},
{%- endif %}
{% if not var('snowplow__disable_ecommerce_checkouts', false) -%}
    {{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__context_ecommerce_checkout_step'), lower_limit, upper_limit, 'checkout') }},
{%- endif %}
{% if not var('snowplow__disable_ecommerce_page_context', false) -%}
    {{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__context_ecommerce_page'), lower_limit, upper_limit, 'ecommerce_page') }},
{%- endif %}
{% if not var('snowplow__disable_ecommerce_transactions', false) -%}
    {{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__context_ecommerce_transaction'), lower_limit, upper_limit, 'transaction') }},
{%- endif %}
{% if not var('snowplow__disable_ecommerce_carts', false) -%}
    {{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__context_ecommerce_cart'), lower_limit, upper_limit, 'cart') }},
{%- endif %}

{{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__sde_ecommerce_action'), lower_limit, upper_limit, 'ecommerce_action', single_entity = false) }},

{{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__context_web_page'), lower_limit, upper_limit, 'page_view') }}


select ev.*,
    {% if var('snowplow__enable_mobile_events', false) %}
        coalesce(
            sv.mob_sc_view_id,
            pv.page_view_id
        ) as page_view_id,
    {% else %}
        pv.page_view_id,
    {% endif %}

    {% if var('snowplow__disable_ecommerce_user_context', false) -%}
        cast(NULL as {{ type_string() }}) as ecommerce_user_id,
        cast(NULL as {{ type_string() }}) as ecommerce_user_email,
        cast(NULL as {{ type_boolean() }}) as ecommerce_user_is_guest,
    {%- else -%}
        usr.ecommerce_user_id,
        usr.ecommerce_user_email,
        usr.ecommerce_user_is_guest,
    {%- endif %}

    -- unpacking the ecommerce checkout step object
    {% if var('snowplow__disable_ecommerce_checkouts', false) -%}
        cast(NULL as {{ type_int() }}) as checkout_step_number,
        cast(NULL as {{ type_string() }}) as checkout_account_type,
        cast(NULL as {{ type_string() }}) as checkout_billing_full_address,
        cast(NULL as {{ type_string() }}) as checkout_billing_postcode,
        cast(NULL as {{ type_string() }}) as checkout_coupon_code,
        cast(NULL as {{ type_string() }}) as checkout_delivery_method,
        cast(NULL as {{ type_string() }}) as checkout_delivery_provider,
        cast(NULL as {{ type_boolean() }}) as checkout_marketing_opt_in,
        cast(NULL as {{ type_string() }}) as checkout_payment_method,
        cast(NULL as {{ type_string() }}) as checkout_proof_of_payment,
        cast(NULL as {{ type_string() }}) as checkout_shipping_full_address,
        cast(NULL as {{ type_string() }}) as checkout_shipping_postcode,
    {%- else -%}
        checkout.checkout_step as checkout_step_number,
        checkout.checkout_account_type,
        checkout.checkout_billing_full_address,
        checkout.checkout_billing_postcode,
        checkout.checkout_coupon_code,
        checkout.checkout_delivery_method,
        checkout.checkout_delivery_provider,
        checkout.checkout_marketing_opt_in,
        checkout.checkout_payment_method,
        checkout.checkout_proof_of_payment,
        checkout.checkout_shipping_full_address,
        checkout.checkout_shipping_postcode,
    {%- endif %}

    -- unpacking the ecommerce page object
    {% if var('snowplow__disable_ecommerce_page_context', false) -%}
        CAST(NULL as {{ type_string() }}) as ecommerce_page_type,
        CAST(NULL as {{ type_string() }}) as ecommerce_page_language,
        CAST(NULL as {{ type_string() }}) as ecommerce_page_locale,
    {%- else -%}
        ecom_page.ecommerce_page_type,
        ecom_page.ecommerce_page_language,
        ecom_page.ecommerce_page_locale,
    {%- endif %}

    -- unpacking the ecommerce transaction object
    {% if var('snowplow__disable_ecommerce_transactions', false) -%}
        CAST(NULL AS {{ type_string() }}) as transaction_id,
        CAST(NULL AS {{ type_string() }}) as transaction_currency,
        CAST(NULL AS {{ type_string() }}) as transaction_payment_method,
        CAST(NULL AS decimal(9,2)) as transaction_revenue,
        CAST(NULL AS {{ type_int() }}) as transaction_total_quantity,
        CAST(NULL AS {{ type_boolean() }}) as transaction_credit_order,
        CAST(NULL AS decimal(9,2)) as transaction_discount_amount,
        CAST(NULL AS {{ type_string() }}) as transaction_discount_code,
        CAST(NULL AS decimal(9,2)) as transaction_shipping,
        CAST(NULL AS decimal(9,2)) as transaction_tax,
    {%- else -%}
        trans.transaction_transaction_id as transaction_id,
        trans.transaction_currency,
        trans.transaction_payment_method,
        trans.transaction_revenue,
        trans.transaction_total_quantity,
        trans.transaction_credit_order,
        trans.transaction_discount_amount,
        trans.transaction_discount_code,
        trans.transaction_shipping,
        trans.transaction_tax,
    {%- endif %}

    -- unpacking the ecommerce cart object
    {% if var('snowplow__disable_ecommerce_carts', false) -%}
        CAST(NULL AS {{ type_string() }}) as cart_id,
        CAST(NULL AS {{ type_string() }}) as cart_currency,
        CAST(NULL AS decimal(9,2)) as cart_total_value,
    {%- else -%}
        carts.cart_cart_id as cart_id,
        carts.cart_currency,
        carts.cart_total_value,
    {%- endif%}

    -- unpacking the ecommerce action object
    action.ecommerce_action_type,
    action.ecommerce_action_name,

    dense_rank() over (partition by domain_sessionid order by derived_tstamp) AS event_in_session_index

from events_this_run ev

{% if not var('snowplow__disable_ecommerce_user_context', false) -%}
    left join {{ var('snowplow__context_ecommerce_user') }} usr on ev.event_id = usr.ecommerce_user__id and ev.collector_tstamp = usr.ecommerce_user__tstamp
{%- endif %}
{% if not var('snowplow__disable_ecommerce_checkouts', false) -%}
    left join {{ var('snowplow__context_ecommerce_checkout_step') }} checkout on ev.event_id = checkout.checkout__id and ev.collector_tstamp = checkout.checkout__tstamp
{%- endif %}
{% if not var('snowplow__disable_ecommerce_page_context', false) -%}
    left join {{ var('snowplow__context_ecommerce_page') }} ecom_page on ev.event_id = ecom_page.ecommerce_page__id and ev.collector_tstamp = ecom_page.ecommerce_page__tstamp
{%- endif %}
{% if not var('snowplow__disable_ecommerce_transactions', false) -%}
    left join {{ var('snowplow__context_ecommerce_transaction') }} trans on ev.event_id = trans.transaction__id and ev.collector_tstamp = trans.transaction__tstamp
{%- endif %}
{% if not var('snowplow__disable_ecommerce_carts', false) -%}
    left join {{ var('snowplow__context_ecommerce_cart') }} carts on ev.event_id = carts.cart__id and ev.collector_tstamp = carts.cart__tstamp
{%- endif %}
    left join {{ var('snowplow__sde_ecommerce_action') }} action on ev.event_id = action.ecommerce_action__id and ev.collector_tstamp = action.ecommerce_action__tstamp
    left join {{ var('snowplow__context_web_page') }} pv on ev.event_id = pv.page_view__id and ev.collector_tstamp = pv.page_view__tstamp
{% if var('snowplow__enable_mobile_events', false) -%}
    left join {{ var('snowplow__context_screen') }} sv on ev.event_id = sv.mob_sc_view__id and ev.collector_tstamp = sv.mob_sc_view__tstamp
{%- endif %}
where
    ev.event_id_dedupe_index = 1
```

</TabItem>
<TabItem value="snowflake" label="snowflake">

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
    {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(
        a.contexts_com_snowplowanalytics_mobile_screen_1[0]:id::varchar,
        a.contexts_com_snowplowanalytics_snowplow_web_page_1[0]:id::varchar
      ) as page_view_id,
      coalesce(
        a.contexts_com_snowplowanalytics_snowplow_client_session_1[0]:sessionId::varchar,
        a.domain_sessionid
      ) as domain_sessionid,
    {% else %}
      a.contexts_com_snowplowanalytics_snowplow_web_page_1[0]:id::varchar as page_view_id,
      a.domain_sessionid,
    {% endif %}
    b.domain_userid,

    -- unpacking the ecommerce user object
    {% if var('snowplow__disable_ecommerce_user_context', false) -%}
    cast(NULL as {{ type_string() }}) as ecommerce_user_id,
    cast(NULL as {{ type_string() }}) as ecommerce_user_email,
    cast(NULL as {{ type_boolean() }}) as ecommerce_user_is_guest,
    {%- else -%}
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_user_1[0]:id::varchar as ecommerce_user_id,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_user_1[0]:email::varchar as ecommerce_user_email,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_user_1[0]:is_guest::boolean as ecommerce_user_is_guest,
    {%- endif %}

    -- unpacking the ecommerce checkout step object
    {% if var('snowplow__disable_ecommerce_checkouts', false) -%}
    cast(NULL as {{ type_int() }}) as checkout_step_number,
    cast(NULL as {{ type_string() }}) as checkout_account_type,
    cast(NULL as {{ type_string() }}) as checkout_billing_full_address,
    cast(NULL as {{ type_string() }}) as checkout_billing_postcode,
    cast(NULL as {{ type_string() }}) as checkout_coupon_code,
    cast(NULL as {{ type_string() }}) as checkout_delivery_method,
    cast(NULL as {{ type_string() }}) as checkout_delivery_provider,
    cast(NULL as {{ type_boolean() }}) as checkout_marketing_opt_in,
    cast(NULL as {{ type_string() }}) as checkout_payment_method,
    cast(NULL as {{ type_string() }}) as checkout_proof_of_payment,
    cast(NULL as {{ type_string() }}) as checkout_shipping_full_address,
    cast(NULL as {{ type_string() }}) as checkout_shipping_postcode,
    {%- else -%}
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
    {%- endif %}

    -- unpacking the ecommerce page object
    {% if var('snowplow__disable_ecommerce_page_context', false) -%}
    CAST(NULL as {{ type_string() }}) as ecommerce_page_type,
    CAST(NULL as {{ type_string() }}) as ecommerce_page_language,
    CAST(NULL as {{ type_string() }}) as ecommerce_page_locale,

    {%- else -%}
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_page_1[0]:type::varchar as ecommerce_page_type,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_page_1[0]:language::varchar as ecommerce_page_language,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_page_1[0]:locale::varchar as ecommerce_page_locale,
    {%- endif %}

    -- unpacking the ecommerce transaction object
    {% if var('snowplow__disable_ecommerce_transactions', false) -%}
    CAST(NULL AS {{ type_string() }}) as transaction_id,
    CAST(NULL AS {{ type_string() }}) as transaction_currency,
    CAST(NULL AS {{ type_string() }}) as transaction_payment_method,
    CAST(NULL AS decimal(9,2)) as transaction_revenue,
    CAST(NULL AS {{ type_int() }}) as transaction_total_quantity,
    CAST(NULL AS {{ type_boolean() }}) as transaction_credit_order,
    CAST(NULL AS decimal(9,2)) as transaction_discount_amount,
    CAST(NULL AS {{ type_string() }}) as transaction_discount_code,
    CAST(NULL AS decimal(9,2)) as transaction_shipping,
    CAST(NULL AS decimal(9,2)) as transaction_tax,
    {%- else -%}
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:transaction_id::varchar as transaction_id,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:currency::varchar as transaction_currency,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:payment_method::varchar as transaction_payment_method,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:revenue::decimal(9,2) as transaction_revenue,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:total_quantity::int as transaction_total_quantity,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:credit_order::boolean as transaction_credit_order,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:discount_amount::decimal(9,2) as transaction_discount_amount,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:discount_code::varchar as transaction_discount_code,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:shipping::decimal(9,2) as transaction_shipping,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_transaction_1[0]:tax::decimal(9,2) as transaction_tax,
    {%- endif %}

    -- unpacking the ecommerce cart object
    {% if var('snowplow__disable_ecommerce_carts', false) -%}
    CAST(NULL AS {{ type_string() }}) as cart_id,
    CAST(NULL AS {{ type_string() }}) as cart_currency,
    CAST(NULL AS decimal(9,2)) as cart_total_value,
    {%- else -%}
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_cart_1[0]:cart_id::varchar as cart_id,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_cart_1[0]:currency::varchar as cart_currency,
    a.contexts_com_snowplowanalytics_snowplow_ecommerce_cart_1[0]:total_value::decimal(9,2) as cart_total_value,
    {%- endif%}

    -- unpacking the ecommerce action object
    a.unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1:type::varchar as ecommerce_action_type,
    a.unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1:name::varchar as ecommerce_action_name,

    a.* exclude(contexts_com_snowplowanalytics_snowplow_web_page_1, domain_userid, domain_sessionid)


  from {{ var('snowplow__events') }} as a
  inner join {{ ref('snowplow_ecommerce_base_sessions_this_run') }} as b
  {% if var('snowplow__enable_mobile_events', false) %}
    on coalesce(
        a.contexts_com_snowplowanalytics_snowplow_client_session_1[0]:sessionId::varchar,
        a.domain_sessionid
      ) = b.session_id
  {% else %}
    on a.domain_sessionid = b.session_id
  {% endif %}

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_ecommerce.cart_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.cart_fields)
- [macro.snowplow_ecommerce.checkout_step_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.checkout_step_fields)
- [macro.snowplow_ecommerce.event_name_filter](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.event_name_filter)
- [macro.snowplow_ecommerce.tracking_action_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.tracking_action_fields)
- [macro.snowplow_ecommerce.tracking_page_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.tracking_page_fields)
- [macro.snowplow_ecommerce.transaction_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.transaction_fields)
- [macro.snowplow_ecommerce.user_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.user_fields)
- [macro.snowplow_utils.app_id_filter](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.app_id_filter)
- [macro.snowplow_utils.get_optional_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_optional_fields)
- [macro.snowplow_utils.get_sde_or_context](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_sde_or_context)
- [macro.snowplow_utils.return_limits_from_model](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_limits_from_model)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

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

<h4>Description</h4>

This table contains the lower and upper timestamp limits for the given run of the web model. These limits are used to select new events from the events table.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| lower_limit | The lower `collector_tstamp` limit for the run | timestamp_ntz |
| upper_limit | The upper `collector_tstamp` limit for the run | timestamp_ntz |
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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_enabled_snowplow_models](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_enabled_snowplow_models)
- [macro.snowplow_utils.get_incremental_manifest_status](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_incremental_manifest_status)
- [macro.snowplow_utils.get_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_run_limits)
- [macro.snowplow_utils.print_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.print_run_limits)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

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

<h4>Description</h4>

This table contains any sessions that have been quarantined. Sessions are quarantined once they exceed the maximum allowed session length, defined by `snowplow__max_session_days`.
Once quarantined, no further events from these sessions will be processed. Events up until the point of quarantine remain in your derived tables.
The reason for removing long sessions is to reduce table scans on both the events table and all derived tables. This improves performance greatly.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| session_id | The `session_id` of the quarantined session | text |
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
    cast(null as {{ dbt.type_string() }}) session_id
)

select *

from prep
where false
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.type_string
- [macro.snowplow_ecommerce.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.allow_refresh)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Base Sessions Lifecycle Manifest {#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest}

<DbtDetails><summary>
<code>models/base/manifest/&lt;adaptor&gt;/snowplow_ecommerce_base_sessions_lifecycle_manifest.sql</code>
</summary>

<h4>Description</h4>

This incremental table is a manifest of all sessions that have been processed by the Snowplow dbt ecommerce package. For each session, the start and end timestamp is recorded.

By knowing the lifecycle of a session the model is able to able to determine which sessions and thus events to process for a given timeframe, as well as the complete date range required to reprocess all events of each session.

**Type**: Table

<h4>File Paths</h4>

<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery">

`models/base/manifest/bigquery/snowplow_ecommerce_base_sessions_lifecycle_manifest.sql`

</TabItem>
<TabItem value="databricks" label="databricks">

`models/base/manifest/databricks/snowplow_ecommerce_base_sessions_lifecycle_manifest.sql`

</TabItem>
<TabItem value="default" label="default" default>

`models/base/manifest/default/snowplow_ecommerce_base_sessions_lifecycle_manifest.sql`

</TabItem>
<TabItem value="snowflake" label="snowflake">

`models/base/manifest/snowflake/snowplow_ecommerce_base_sessions_lifecycle_manifest.sql`

</TabItem>
</Tabs>


<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| session_id | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ | text |
| start_tstamp | The `collector_tstamp` when the session began | timestamp_ntz |
| end_tstamp | The `collector_tstamp` when the session ended | timestamp_ntz |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery">

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/base/manifest/bigquery/snowplow_ecommerce_base_sessions_lifecycle_manifest.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized='incremental',
    unique_key='session_id',
    upsert_date_key='start_tstamp',
    sort='start_tstamp',
    dist='session_id',
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_val='start_tstamp_date'),
    cluster_by=snowplow_utils.get_value_by_target_type(bigquery_val=["session_id"], snowflake_val=["to_date(start_tstamp)"]),
    full_refresh=snowplow_ecommerce.allow_refresh(),
    tags=["manifest"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    },
    snowplow_optimize = true
  )
}}

-- Known edge cases:
-- 1: Rare case with multiple domain_userid per session.

{% set lower_limit, upper_limit, _ = snowplow_utils.return_base_new_event_limits(ref('snowplow_ecommerce_base_new_event_limits')) %}
{% set session_lookback_limit = snowplow_utils.get_session_lookback_limit(lower_limit) %}
{% set is_run_with_new_events = snowplow_utils.is_run_with_new_events('snowplow_ecommerce') %}

with new_events_session_ids as (
  select
    {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(
        {{ snowplow_utils.get_optional_fields(
          enabled=var('snowplow__enable_mobile_events', false),
          fields=[{'field': 'session_id', 'dtype': 'string'}],
          col_prefix='contexts_com_snowplowanalytics_snowplow_client_session_1_',
          relation=source('atomic', 'events'),
          relation_alias='e',
          include_field_alias=false) }},
        e.domain_sessionid
      ) as session_id,
      max(coalesce(
      {{ snowplow_utils.get_optional_fields(
          enabled=var('snowplow__enable_mobile_events', false),
          fields=[{'field': 'user_id', 'dtype': 'string'}],
          col_prefix='contexts_com_snowplowanalytics_snowplow_client_session_1_',
          relation=source('atomic', 'events'),
          relation_alias='e',
          include_field_alias=false) }},
        e.domain_userid
      )) as domain_userid,
    {% else %}
      e.domain_sessionid as session_id,
      max(e.domain_userid) as domain_userid, -- Edge case 1: Arbitary selection to avoid window function like first_value.
    {% endif %}
    min(e.collector_tstamp) as start_tstamp,
    max(e.collector_tstamp) as end_tstamp

  from {{ var('snowplow__events') }} e

  where
    {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(
      {{ snowplow_utils.get_optional_fields(
        enabled=var('snowplow__enable_mobile_events', false),
        fields=[{'field': 'session_id', 'dtype': 'string'}],
        col_prefix='contexts_com_snowplowanalytics_snowplow_client_session_1_',
        relation=source('atomic', 'events'),
        relation_alias='e',
        include_field_alias=false) }},
      e.domain_sessionid
    ) is not null
          and not exists (select 1 from {{ ref('snowplow_ecommerce_base_quarantined_sessions') }} as a where a.session_id = coalesce(
      {{ snowplow_utils.get_optional_fields(
        enabled=var('snowplow__enable_mobile_events', false),
        fields=[{'field': 'session_id', 'dtype': 'string'}],
        col_prefix='contexts_com_snowplowanalytics_snowplow_client_session_1_',
        relation=source('atomic', 'events'),
        relation_alias='e',
        include_field_alias=false) }},
      e.domain_sessionid
    )) -- don't continue processing v.long sessions
    {% else %}
      e.domain_sessionid is not null
      and not exists (select 1 from {{ ref('snowplow_ecommerce_base_quarantined_sessions') }} as a where a.session_id = e.domain_sessionid) -- don't continue processing v.long sessions
    {% endif %}
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

{% if is_incremental() %}

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
<TabItem value="databricks" label="databricks">

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/base/manifest/databricks/snowplow_ecommerce_base_sessions_lifecycle_manifest.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized='incremental',
    unique_key='session_id',
    upsert_date_key='start_tstamp',
    sort='start_tstamp',
    dist='session_id',
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_val='start_tstamp_date'),
    cluster_by=snowplow_utils.get_value_by_target_type(bigquery_val=["session_id"], snowflake_val=["to_date(start_tstamp)"]),
    full_refresh=snowplow_ecommerce.allow_refresh(),
    tags=["manifest"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    },
    snowplow_optimize = true
  )
}}

-- Known edge cases:
-- 1: Rare case with multiple domain_userid per session.

{% set lower_limit, upper_limit, _ = snowplow_utils.return_base_new_event_limits(ref('snowplow_ecommerce_base_new_event_limits')) %}
{% set session_lookback_limit = snowplow_utils.get_session_lookback_limit(lower_limit) %}
{% set is_run_with_new_events = snowplow_utils.is_run_with_new_events('snowplow_ecommerce') %}

with new_events_session_ids as (
  select
    {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(
        e.contexts_com_snowplowanalytics_snowplow_client_session_1[0].session_id::string,
        e.domain_sessionid
      ) as session_id,
      max(coalesce(
        e.contexts_com_snowplowanalytics_snowplow_client_session_1[0].user_id::string,
        e.domain_userid
      )) as domain_userid,
    {% else %}
      e.domain_sessionid as session_id,
      max(e.domain_userid) as domain_userid, -- Edge case 1: Arbitary selection to avoid window function like first_value.
    {% endif %}
    min(e.collector_tstamp) as start_tstamp,
    max(e.collector_tstamp) as end_tstamp

  from {{ var('snowplow__events') }} e

  where
    {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(
        e.contexts_com_snowplowanalytics_snowplow_client_session_1[0].session_id::string,
        e.domain_sessionid
      ) is not null
      and not exists (select 1 from {{ ref('snowplow_ecommerce_base_quarantined_sessions') }} as a where a.session_id = coalesce(
        e.contexts_com_snowplowanalytics_snowplow_client_session_1[0].session_id::string,
        e.domain_sessionid
      )) -- don't continue processing v.long sessions
    {% else %}
      e.domain_sessionid is not null
      and not exists (select 1 from {{ ref('snowplow_ecommerce_base_quarantined_sessions') }} as a where a.session_id = e.domain_sessionid) -- don't continue processing v.long sessions
    {% endif %}
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

{% if is_incremental() %}

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
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/base/manifest/default/snowplow_ecommerce_base_sessions_lifecycle_manifest.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized='incremental',
    unique_key='session_id',
    upsert_date_key='start_tstamp',
    sort='start_tstamp',
    dist='session_id',
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_val='start_tstamp_date'),
    cluster_by=snowplow_utils.get_value_by_target_type(bigquery_val=["session_id"], snowflake_val=["to_date(start_tstamp)"]),
    full_refresh=snowplow_ecommerce.allow_refresh(),
    tags=["manifest"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    },
    snowplow_optimize = true
  )
}}

-- Known edge cases:
-- 1: Rare case with multiple domain_userid per session.

{% set lower_limit, upper_limit, _ = snowplow_utils.return_base_new_event_limits(ref('snowplow_ecommerce_base_new_event_limits')) %}
{% set session_lookback_limit = snowplow_utils.get_session_lookback_limit(lower_limit) %}
{% set is_run_with_new_events = snowplow_utils.is_run_with_new_events('snowplow_ecommerce') %}

with

{% if var('snowplow__enable_mobile_events', false) -%}
    {{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__context_mobile_session'), lower_limit, upper_limit, 'mob_session') }},
{%- endif %}

new_events_session_ids as (
  select
    {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(ms.mob_session_session_id, e.domain_sessionid) as session_id,
      max(coalesce(ms.mob_session_user_id, e.domain_userid)) as domain_userid,
    {% else %}
      e.domain_sessionid as session_id,
      max(e.domain_userid) as domain_userid, -- Edge case 1: Arbitary selection to avoid window function like first_value.
    {% endif %}
    min(e.collector_tstamp) as start_tstamp,
    max(e.collector_tstamp) as end_tstamp

  from {{ var('snowplow__events') }} e
  {% if var('snowplow__enable_mobile_events', false) -%}
      left join {{ var('snowplow__context_mobile_session') }} ms on e.event_id = ms.mob_session__id and e.collector_tstamp = ms.mob_session__tstamp
  {%- endif %}
  where
    {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(ms.mob_session_session_id, e.domain_sessionid) is not null
      and not exists (select 1 from {{ ref('snowplow_ecommerce_base_quarantined_sessions') }} as a where a.session_id = coalesce(ms.mob_session_session_id, e.domain_sessionid)) -- don't continue processing v.long sessions
    {% else %}
      e.domain_sessionid is not null
      and not exists (select 1 from {{ ref('snowplow_ecommerce_base_quarantined_sessions') }} as a where a.session_id = e.domain_sessionid) -- don't continue processing v.long sessions
    {% endif %}
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

{% if is_incremental() %}

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
<TabItem value="snowflake" label="snowflake">

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/base/manifest/snowflake/snowplow_ecommerce_base_sessions_lifecycle_manifest.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized='incremental',
    unique_key='session_id',
    upsert_date_key='start_tstamp',
    sort='start_tstamp',
    dist='session_id',
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_val='start_tstamp_date'),
    cluster_by=snowplow_utils.get_value_by_target_type(bigquery_val=["session_id"], snowflake_val=["to_date(start_tstamp)"]),
    full_refresh=snowplow_ecommerce.allow_refresh(),
    tags=["manifest"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    },
    snowplow_optimize = true
  )
}}

-- Known edge cases:
-- 1: Rare case with multiple domain_userid per session.

{% set lower_limit, upper_limit, _ = snowplow_utils.return_base_new_event_limits(ref('snowplow_ecommerce_base_new_event_limits')) %}
{% set session_lookback_limit = snowplow_utils.get_session_lookback_limit(lower_limit) %}
{% set is_run_with_new_events = snowplow_utils.is_run_with_new_events('snowplow_ecommerce') %}

with new_events_session_ids as (
  select
    {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(
        e.contexts_com_snowplowanalytics_snowplow_client_session_1[0]:sessionId::varchar,
        e.domain_sessionid
      ) as session_id,
      max(coalesce(
        e.contexts_com_snowplowanalytics_snowplow_client_session_1[0]:userId::varchar,
        e.domain_userid
      )) as domain_userid,
    {% else %}
      e.domain_sessionid as session_id,
      max(e.domain_userid) as domain_userid, -- Edge case 1: Arbitary selection to avoid window function like first_value.
    {% endif %}
    min(e.collector_tstamp) as start_tstamp,
    max(e.collector_tstamp) as end_tstamp

  from {{ var('snowplow__events') }} e

  where
    {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(
        e.contexts_com_snowplowanalytics_snowplow_client_session_1[0]:sessionId::varchar,
        e.domain_sessionid
      ) is not null
      and not exists (select 1 from {{ ref('snowplow_ecommerce_base_quarantined_sessions') }} as a where a.session_id = coalesce(
        e.contexts_com_snowplowanalytics_snowplow_client_session_1[0]:sessionId::varchar,
        e.domain_sessionid
      )) -- don't continue processing v.long sessions
    {% else %}
      e.domain_sessionid is not null
      and not exists (select 1 from {{ ref('snowplow_ecommerce_base_quarantined_sessions') }} as a where a.session_id = e.domain_sessionid) -- don't continue processing v.long sessions
    {% endif %}
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

{% if is_incremental() %}

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_quarantined_sessions)
- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)

</TabItem>
<TabItem value="macro" label="Macros">

- macro.dbt.is_incremental
- [macro.snowplow_ecommerce.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.allow_refresh)
- [macro.snowplow_ecommerce.event_name_filter](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.event_name_filter)
- [macro.snowplow_utils.app_id_filter](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.app_id_filter)
- [macro.snowplow_utils.get_optional_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_optional_fields)
- [macro.snowplow_utils.get_sde_or_context](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_sde_or_context)
- [macro.snowplow_utils.get_session_lookback_limit](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_session_lookback_limit)
- [macro.snowplow_utils.get_value_by_target_type](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target_type)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.return_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_base_new_event_limits)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Base Sessions This Run {#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run}

<DbtDetails><summary>
<code>models/base/scratch/snowplow_ecommerce_base_sessions_this_run.sql</code>
</summary>

<h4>Description</h4>

For any given run, this table contains all the required sessions.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| session_id | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ | text |
| start_tstamp | The `collector_tstamp` when the session began | timestamp_ntz |
| end_tstamp | The `collector_tstamp` when the session ended | timestamp_ntz |
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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_quarantined_sessions)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.quarantine_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.quarantine_sessions)
- [macro.snowplow_utils.return_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_base_new_event_limits)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Cart Interactions {#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions}

<DbtDetails><summary>
<code>models/carts/snowplow_ecommerce_cart_interactions.sql</code>
</summary>

<h4>Description</h4>

This derived incremental table contains all historic cart interactions and should be the end point for any analysis or BI tools.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| event_id | A UUID for each event e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| page_view_id | A UUID for each page view e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| event_in_session_index | The index of the event in the corresponding session. | number |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ | text |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. ‘ecdff4d0-9175-40ac-a8bb-325c49733607’ | text |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ | text |
| ecommerce_user_id | The ecommerce user id extracted from the ecommerce user context. | text |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ | timestamp_ntz |
| derived_tstamp_date | Date value of the timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ | date |
| cart_id | The unique ID representing this cart e.g. abc123 | text |
| cart_currency | The currency used for this cart (ISO 4217) | text |
| cart_total_value | The total value of the cart after this interaction | number |
| cart_created | A boolean to describe whether the cart was created in this action | boolean |
| cart_emptied | A boolean to describe whether the cart was emptied in this action | boolean |
| cart_transacted | A boolean to describe whether the cart was transacted (purchased) in this action | boolean |
| ecommerce_action_type | The type of ecommerce action that was performed, e.g. transaction, add_to_cart, etc. | text |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/carts/snowplow_ecommerce_cart_interactions.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized="incremental",
    unique_key='event_id',
    upsert_date_key='derived_tstamp',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val = {
      "field": "derived_tstamp",
      "data_type": "timestamp"
    }, databricks_val='derived_tstamp_date'),
    tags=["derived"],
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    },
    snowplow_optimize=true
  )
}}

select *

from {{ ref('snowplow_ecommerce_cart_interactions_this_run') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_ecommerce') }}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_value_by_target_type](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target_type)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Cart Interactions This Run {#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions_this_run}

<DbtDetails><summary>
<code>models/carts/scratch/snowplow_ecommerce_cart_interactions_this_run.sql</code>
</summary>

<h4>Description</h4>

This staging table tracks and stores information about cart interactions that occurred within the current run, with interactions being when a user adds or removes an item from their cart. It possesses all of the same columns as `snowplow_ecommerce_cart_interactions`. If building a custom module that requires cart interactions, this is the table you should reference for that information.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| event_id | A UUID for each event e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| page_view_id | A UUID for each page view e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| event_in_session_index | The index of the event in the corresponding session. | number |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ | text |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. ‘ecdff4d0-9175-40ac-a8bb-325c49733607’ | text |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ | text |
| ecommerce_user_id | The ecommerce user id extracted from the ecommerce user context. | text |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ | timestamp_ntz |
| derived_tstamp_date | Date value of the timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ | date |
| cart_id | The unique ID representing this cart e.g. abc123 | text |
| cart_currency | The currency used for this cart (ISO 4217) | text |
| cart_total_value | The total value of the cart after this interaction | number |
| cart_created | A boolean to describe whether the cart was created in this action | boolean |
| cart_emptied | A boolean to describe whether the cart was emptied in this action | boolean |
| cart_transacted | A boolean to describe whether the cart was transacted (purchased) in this action | boolean |
| ecommerce_action_type | The type of ecommerce action that was performed, e.g. transaction, add_to_cart, etc. | text |
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
        {% if var('snowplow__disable_ecommerce_products', false) -%}
            cast(NULL as {{ type_float() }}) as product_value_added
        {%- else -%}
            SUM(pi.product_price) as product_value_added
        {%- endif %}


    from {{ ref('snowplow_ecommerce_base_events_this_run') }} as e
    {% if not var('snowplow__disable_ecommerce_products', false) -%}
        left join {{ ref('snowplow_ecommerce_product_interactions_this_run') }} as pi on e.event_id = pi.event_id AND pi.is_add_to_cart
    {%- endif %}
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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Checkout Interactions {#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions}

<DbtDetails><summary>
<code>models/checkouts/snowplow_ecommerce_checkout_interactions.sql</code>
</summary>

<h4>Description</h4>

This derived incremental table contains all historic checkout interactions and should be the end point for any analysis or BI tools.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| event_id | A UUID for each event e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| page_view_id | A UUID for each page view e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| event_in_session_index | The index of the event in the corresponding session. | number |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ | text |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. ‘ecdff4d0-9175-40ac-a8bb-325c49733607’ | text |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ | text |
| ecommerce_user_id | The ecommerce user id extracted from the ecommerce user context. | text |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ | timestamp_ntz |
| derived_tstamp_date | Date value of the timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ | date |
| ecommerce_action_type | The type of ecommerce action that was performed, e.g. transaction, add_to_cart, etc. | text |
| ecommerce_action_name | The name that is associated with the ecommerce action. E.g. when a list_click occurs, the name of the product list such as 'recommended' or 'shop the look' | text |
| ecommerce_page_type | The type of the page that was visited E.g. homepage, product page, checkout page | text |
| checkout_step_number | The checkout step index e.g. 1 | number |
| checkout_account_type | The type of account that is conducting the checkout e.g. guest | text |
| checkout_billing_full_address | The full billing address provided at the checkout step e.g. 1 Lincoln Street | text |
| checkout_billing_postcode | The full billing postcode/zipcode provided at the checkout step e.g. 90210 | text |
| checkout_coupon_code | The coupon code used at the checkout step e.g. SNOWPLOW50 | text |
| checkout_delivery_method | The delivery method selected at the checkout step e.g. Store pickup | text |
| checkout_delivery_provider | The delivery provider selected at the checkout step e.g. SantaPost | text |
| checkout_marketing_opt_in | A boolean to describe whether or not the user has opted in for marketing emails at the checkout step | boolean |
| checkout_payment_method | The chosen payment method selected at the checkout step e.g. Credit Card | text |
| checkout_proof_of_payment | The proof of payment given at the checkout step, e.g. invoice or receipt | text |
| checkout_shipping_full_address | Full shipping address | text |
| checkout_shipping_postcode | Shipping address postcode | text |
| session_entered_at_step | A boolean to describe whether the session was entered at this checkout step | boolean |
| checkout_succeeded | A boolean to describe whether the checkout succeeded | boolean |
| ecommerce_user_email | The ecommerce user email, extracted from the ecommerce user context. | text |
| ecommerce_user_is_guest | A boolean extracted from the ecommerce user context to ascertain whether a user is a guest or not. | boolean |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/checkouts/snowplow_ecommerce_checkout_interactions.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized="incremental",
    unique_key='event_id',
    upsert_date_key='derived_tstamp',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val = {
      "field": "derived_tstamp",
      "data_type": "timestamp"
    }, databricks_val='derived_tstamp_date'),
    tags=["derived"],
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    },
    snowplow_optimize=true
  )
}}

select *

from {{ ref('snowplow_ecommerce_checkout_interactions_this_run') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_ecommerce') }}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_value_by_target_type](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target_type)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Checkout Interactions This Run {#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions_this_run}

<DbtDetails><summary>
<code>models/checkouts/scratch/snowplow_ecommerce_checkout_interactions_this_run.sql</code>
</summary>

<h4>Description</h4>

This staging table tracks and stores information about checkout interactions that occurred within the current run, with interactions being when a user progresses through the checkout flow or completes a transaction. It possesses all of the same columns as `snowplow_ecommerce_checkout_interactions`. If building a custom module that requires checkout interactions, this is the table you should reference for that information.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| event_id | A UUID for each event e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| page_view_id | A UUID for each page view e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| event_in_session_index | The index of the event in the corresponding session. | number |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ | text |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. ‘ecdff4d0-9175-40ac-a8bb-325c49733607’ | text |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ | text |
| ecommerce_user_id | The ecommerce user id extracted from the ecommerce user context. | text |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ | timestamp_ntz |
| derived_tstamp_date | Date value of the timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ | date |
| ecommerce_action_type | The type of ecommerce action that was performed, e.g. transaction, add_to_cart, etc. | text |
| ecommerce_action_name | The name that is associated with the ecommerce action. E.g. when a list_click occurs, the name of the product list such as 'recommended' or 'shop the look' | text |
| ecommerce_page_type | The type of the page that was visited E.g. homepage, product page, checkout page | text |
| checkout_step_number | The checkout step index e.g. 1 | number |
| checkout_account_type | The type of account that is conducting the checkout e.g. guest | text |
| checkout_billing_full_address | The full billing address provided at the checkout step e.g. 1 Lincoln Street | text |
| checkout_billing_postcode | The full billing postcode/zipcode provided at the checkout step e.g. 90210 | text |
| checkout_coupon_code | The coupon code used at the checkout step e.g. SNOWPLOW50 | text |
| checkout_delivery_method | The delivery method selected at the checkout step e.g. Store pickup | text |
| checkout_delivery_provider | The delivery provider selected at the checkout step e.g. SantaPost | text |
| checkout_marketing_opt_in | A boolean to describe whether or not the user has opted in for marketing emails at the checkout step | boolean |
| checkout_payment_method | The chosen payment method selected at the checkout step e.g. Credit Card | text |
| checkout_proof_of_payment | The proof of payment given at the checkout step, e.g. invoice or receipt | text |
| checkout_shipping_full_address | Full shipping address | text |
| checkout_shipping_postcode | Shipping address postcode | text |
| session_entered_at_step | A boolean to describe whether the session was entered at this checkout step | boolean |
| checkout_succeeded | A boolean to describe whether the checkout succeeded | boolean |
| ecommerce_user_email | The ecommerce user email, extracted from the ecommerce user context. | text |
| ecommerce_user_is_guest | A boolean extracted from the ecommerce user context to ascertain whether a user is a guest or not. | boolean |
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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Incremental Manifest {#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest}

<DbtDetails><summary>
<code>models/base/manifest/snowplow_ecommerce_incremental_manifest.sql</code>
</summary>

<h4>Description</h4>

This incremental table is a manifest of the timestamp of the latest event consumed per model within the Snowplow dbt ecommerce package as well as any models leveraging the incremental framework provided by the package. The latest event's timestamp is based off `collector_tstamp`. This table is used to determine what events should be processed in the next run of the model.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| model | The name of the model. | text |
| last_success | The timestamp of the latest event consumed by the model, based on `collector_tstamp` | timestamp_ntz |
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
    full_refresh=snowplow_ecommerce.allow_refresh(),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
  )
}}

-- Boilerplate to generate table.
-- Table updated as part of end-run hook

with prep as (
  select
    cast(null as {{ snowplow_utils.type_max_string() }}) model,
    cast('1970-01-01' as {{ type_timestamp() }}) as last_success
)

select *

from prep
where false
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.type_timestamp
- [macro.snowplow_ecommerce.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.allow_refresh)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.type_max_string](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.type_max_string)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

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

<h4>Description</h4>

This derived incremental table contains all historic product interactions and should be the end point for any analysis or BI tools.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| product_event_id | A surrogate key which is a combination of `product_id` and `event_id` | text |
| event_id | A UUID for each event e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| page_view_id | A UUID for each page view e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| event_in_session_index | The index of the event in the corresponding session. | number |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ | text |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. ‘ecdff4d0-9175-40ac-a8bb-325c49733607’ | text |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ | text |
| ecommerce_user_id | The ecommerce user id extracted from the ecommerce user context. | text |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ | timestamp_ntz |
| derived_tstamp_date | Date value of the timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ | date |
| product_id | The SKU or product ID. | text |
| product_category | The category the product belongs to. Use a consistent separator to express multiple levels. E.g. Woman/Shoes/Sneakers | text |
| product_subcategory_1 |   | text |
| product_subcategory_2 |   | text |
| product_subcategory_3 |   | text |
| product_subcategory_4 |   | text |
| product_currency | The currency in which the product is being priced (ISO 4217). | text |
| product_price | The price of the product at the current time. | number |
| product_brand | The brand of the product. | text |
| product_creative_id | Identifier/Name/Url for the creative presented on a list or product view. | text |
| product_inventory_status | The inventory status of the product E.g. in stock, out of stock, preorder, backorder. | text |
| product_list_price | The list or recommended retail price of a product. | number |
| product_name | The name or title of the product | text |
| product_list_position | The position the product was presented in a list of products E.g. search results, product list page. | number |
| product_quantity | The quantity of the product taking part in the ecommerce action. | number |
| product_size | The size of the product. | text |
| product_variant | The variant of the product. | text |
| is_product_view | A boolean to describe whether this product interaction was a product view | boolean |
| product_view_type | The type of product view that occurred, e.g. list_view or product_view | text |
| is_add_to_cart | A boolean to describe whether this product interaction was an add to cart action | boolean |
| is_remove_from_cart | A boolean to describe whether this product interaction was a remove from cart action | boolean |
| product_list_name | The name of the list presented to the user E.g. product list, search results, shop the look, frequently bought with. | text |
| is_product_transaction | A boolean to describe whether this product interaction was a transaction (purchase) interaction | boolean |
| transaction_id | The ID of the transaction | text |
| ecommerce_user_email | The ecommerce user email, extracted from the ecommerce user context. | text |
| ecommerce_user_is_guest | A boolean extracted from the ecommerce user context to ascertain whether a user is a guest or not. | boolean |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/products/snowplow_ecommerce_product_interactions.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized="incremental",
    unique_key='product_event_id',
    upsert_date_key='derived_tstamp',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val = {
      "field": "derived_tstamp",
      "data_type": "timestamp"
    }, databricks_val='derived_tstamp_date'),
    tags=["derived"],
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    },
    snowplow_optimize=true
  )
}}

select *

from {{ ref('snowplow_ecommerce_product_interactions_this_run') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_ecommerce') }}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_value_by_target_type](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target_type)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Product Interactions This Run {#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run}

<DbtDetails><summary>
<code>models/products/scratch/&lt;adaptor&gt;/snowplow_ecommerce_product_interactions_this_run.sql</code>
</summary>

<h4>Description</h4>

This staging table tracks and stores information about product interactions that occurred within the current run, such as a user viewing a product on a product page, or in a product list. It possesses all of the same columns as `snowplow_ecommerce_product_interactions`. If building a custom module that requires checkout interactions, this is the table you should reference for that information.

**Type**: Table

<h4>File Paths</h4>

<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery">

`models/products/scratch/bigquery/snowplow_ecommerce_product_interactions_this_run.sql`

</TabItem>
<TabItem value="databricks" label="databricks">

`models/products/scratch/databricks/snowplow_ecommerce_product_interactions_this_run.sql`

</TabItem>
<TabItem value="default" label="default" default>

`models/products/scratch/default/snowplow_ecommerce_product_interactions_this_run.sql`

</TabItem>
<TabItem value="snowflake" label="snowflake">

`models/products/scratch/snowflake/snowplow_ecommerce_product_interactions_this_run.sql`

</TabItem>
</Tabs>


<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| product_event_id | A surrogate key which is a combination of `product_id` and `event_id` | text |
| event_id | A UUID for each event e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| page_view_id | A UUID for each page view e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| event_in_session_index | The index of the event in the corresponding session. | number |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ | text |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. ‘ecdff4d0-9175-40ac-a8bb-325c49733607’ | text |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ | text |
| ecommerce_user_id | The ecommerce user id extracted from the ecommerce user context. | text |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ | timestamp_ntz |
| derived_tstamp_date | Date value of the timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ | date |
| product_id | The SKU or product ID. | text |
| product_category | The category the product belongs to. Use a consistent separator to express multiple levels. E.g. Woman/Shoes/Sneakers | text |
| product_subcategory_1 |   | text |
| product_subcategory_2 |   | text |
| product_subcategory_3 |   | text |
| product_subcategory_4 |   | text |
| product_currency | The currency in which the product is being priced (ISO 4217). | text |
| product_price | The price of the product at the current time. | number |
| product_brand | The brand of the product. | text |
| product_creative_id | Identifier/Name/Url for the creative presented on a list or product view. | text |
| product_inventory_status | The inventory status of the product E.g. in stock, out of stock, preorder, backorder. | text |
| product_list_price | The list or recommended retail price of a product. | number |
| product_name | The name or title of the product | text |
| product_list_position | The position the product was presented in a list of products E.g. search results, product list page. | number |
| product_quantity | The quantity of the product taking part in the ecommerce action. | number |
| product_size | The size of the product. | text |
| product_variant | The variant of the product. | text |
| is_product_view | A boolean to describe whether this product interaction was a product view | boolean |
| product_view_type | The type of product view that occurred, e.g. list_view or product_view | text |
| is_add_to_cart | A boolean to describe whether this product interaction was an add to cart action | boolean |
| is_remove_from_cart | A boolean to describe whether this product interaction was a remove from cart action | boolean |
| product_list_name | The name of the list presented to the user E.g. product list, search results, shop the look, frequently bought with. | text |
| is_product_transaction | A boolean to describe whether this product interaction was a transaction (purchase) interaction | boolean |
| transaction_id | The ID of the transaction | text |
| ecommerce_user_email | The ecommerce user email, extracted from the ecommerce user context. | text |
| ecommerce_user_is_guest | A boolean extracted from the ecommerce user context to ascertain whether a user is a guest or not. | boolean |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery">

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/products/scratch/bigquery/snowplow_ecommerce_product_interactions_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    tags=["this_run"]
  )
}}


with product_info as (
  select
    {{ dbt_utils.generate_surrogate_key(['t.event_id', 'r.id', 'index']) }} as product_event_id,
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


  from {{ ref('snowplow_ecommerce_base_events_this_run') }} as t, unnest( {{coalesce_columns_by_prefix(ref('snowplow_ecommerce_base_events_this_run'), 'contexts_com_snowplowanalytics_snowplow_ecommerce_product_1') }}) r WITH OFFSET AS INDEX

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
<TabItem value="databricks" label="databricks">

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

    POSEXPLODE(contexts_com_snowplowanalytics_snowplow_ecommerce_product_1) as (index, contexts_com_snowplowanalytics_snowplow_ecommerce_product_1)

  from {{ ref('snowplow_ecommerce_base_events_this_run') }} as t

), product_info as (
  select
    {{ dbt_utils.generate_surrogate_key(['event_id', 'contexts_com_snowplowanalytics_snowplow_ecommerce_product_1.id', 'index']) }} as product_event_id,
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
    contexts_com_snowplowanalytics_snowplow_ecommerce_product_1.price::decimal(9,2) as product_price,
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
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/products/scratch/default/snowplow_ecommerce_product_interactions_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    tags=["this_run"],
    sort='derived_tstamp',
    dist='product_event_id'
  )
}}

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref('snowplow_ecommerce_base_sessions_this_run'),
                                                                            'start_tstamp',
                                                                            'end_tstamp') %}


with {{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__context_ecommerce_product'), lower_limit, upper_limit, 'ecommerce_product', single_entity = false) }},

product_info as (
  select
    {{ dbt_utils.generate_surrogate_key(['t.event_id', 'r.ecommerce_product_id', 'r.ecommerce_product__index']) }} as product_event_id,
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
    r.ecommerce_product_id as product_id,
    r.ecommerce_product_category as product_category,
    {{ snowplow_utils.get_split_to_array('ecommerce_product_category', 'r', var('snowplow__categories_separator', '/')) }} as product_categories_split,
    r.ecommerce_product_currency as product_currency,
    r.ecommerce_product_price as product_price,
    r.ecommerce_product_brand as product_brand,
    r.ecommerce_product_creative_id as product_creative_id,
    r.ecommerce_product_inventory_status as product_inventory_status,
    r.ecommerce_product_list_price as product_list_price,
    r.ecommerce_product_name as product_name,
    r.ecommerce_product_position as product_list_position,
    r.ecommerce_product_quantity as product_quantity,
    r.ecommerce_product_size as product_size,
    r.ecommerce_product_variant as product_variant,
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


  from {{ ref('snowplow_ecommerce_base_events_this_run') }} t
  inner join {{ var('snowplow__context_ecommerce_product') }} r on t.event_id = r.ecommerce_product__id and t.collector_tstamp = r.ecommerce_product__tstamp and mod(r.ecommerce_product__index, t.event_id_dedupe_count) = 0 -- ensure only a single match per total number of dupes

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
  {% if target.type in ['postgres'] %}
  product_categories_split[{{i+1}}]::varchar as product_subcategory_{{i+1}},
  {% else %}
  product_categories_split[{{i}}]::varchar as product_subcategory_{{i+1}},
  {% endif %}
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
<TabItem value="snowflake" label="snowflake">

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
    {{ dbt_utils.generate_surrogate_key(['t.event_id', 'r.value:id', 'r.index']) }} as product_event_id,
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
    r.value:price::decimal(9,2) as product_price,
    r.value:brand::string as product_brand,
    r.value:creative_id::string as product_creative_id,
    r.value:inventory_status::string as product_inventory_status,
    r.value:list_price::decimal(9,2) as product_list_price,
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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- macro.dbt_utils.generate_surrogate_key
- [macro.snowplow_ecommerce.coalesce_columns_by_prefix](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.coalesce_columns_by_prefix)
- [macro.snowplow_utils.get_sde_or_context](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_sde_or_context)
- [macro.snowplow_utils.get_split_to_array](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_split_to_array)
- [macro.snowplow_utils.return_limits_from_model](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_limits_from_model)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

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

<h4>Description</h4>

This derived incremental table contains all historic sessions data specifically for ecommerce actions and should be the end point for any analysis or BI tools.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ | text |
| start_tstamp | The first time the session interacted with the website | timestamp_ntz |
| end_tstamp | The last time the session interacted with the website | timestamp_ntz |
| number_unique_cart_ids | The total number of unique `cart_id`s over the session's lifetime | number |
| number_carts_created | The total number of carts created over the session's lifetime | number |
| number_carts_emptied | The total number of carts emptied over the session's lifetime | number |
| number_carts_transacted | The total number of carts transacted over the session's lifetime | number |
| first_cart_created | The timestamp of when the session first created a cart | timestamp_ntz |
| last_cart_created | The timestamp of when the session last created a cart | timestamp_ntz |
| first_cart_transacted | The timestamp of when the session first transacted (purchased) the contents of a cart | timestamp_ntz |
| last_cart_transacted | The timestamp of when the session last transacted (purchased) the contents of a cart | timestamp_ntz |
| session_cart_abandoned | A boolean to describe whether the session's cart was abandoned | boolean |
| session_entered_at_checkout |   | boolean |
| number_unique_checkout_steps_attempted | The total distinct number of checkout steps that a session went through | number |
| number_checkout_steps_visited | The total number of (non-unique) checkout steps that a session went through | number |
| checkout_succeeded | A boolean to describe whether the checkout succeeded | boolean |
| first_checkout_attempted | The timestamp of when the session first attempted any checkout steps | timestamp_ntz |
| last_checkout_attempted | The timestamp of when the session last attempted any checkout steps | timestamp_ntz |
| first_checkout_succeeded | The timestamp of when the session first succeeded in checking out products | timestamp_ntz |
| last_checkout_succeeded | The timestamp of when the session last succeeded in checking out products | timestamp_ntz |
| first_product_view | The timestamp of when the session first viewed a product | timestamp_ntz |
| last_product_view | The timestamp of when the session last viewed a product | timestamp_ntz |
| first_product_add_to_cart | The timestamp of when the session first added a product to their cart | timestamp_ntz |
| last_product_add_to_cart | The timestamp of when the session last added a product to their cart | timestamp_ntz |
| first_product_remove_from_cart | The timestamp of when the session first removed a product from their cart | timestamp_ntz |
| last_product_remove_from_cart | The timestamp of when the session last removed a product from their cart | timestamp_ntz |
| first_product_transaction | The timestamp of when the session first purchased a product | timestamp_ntz |
| last_product_transaction | The timestamp of when the session last purchased a product | timestamp_ntz |
| number_product_views | The number of product views that occurred within a session | number |
| number_add_to_carts | The number of add to cart actions that occurred within a session | number |
| number_remove_from_carts | The number of remove from cart actions that occurred within a session | number |
| number_product_transactions | The number of product transaction actions that occurred within a session | number |
| first_transaction_completed | The timestamp of when the session first completed a transaction | timestamp_ntz |
| last_transaction_completed | The timestamp of when the session last completed a transaction | timestamp_ntz |
| total_transaction_revenue | The total amount of revenue coming from transactions over the session's lifetime | number |
| total_transaction_quantity | The total quantity of products coming from transactions over the session's lifetime | number |
| total_number_transactions | The total number of transactions over the session's lifetime | number |
| total_transacted_products | The total number of transacted products over the session's lifetime | number |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/sessions/snowplow_ecommerce_sessions.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized="incremental",
    unique_key='domain_sessionid',
    upsert_date_key='start_tstamp',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val = {
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_val='start_tstamp_date'),
    tags=["derived"],
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    },
    snowplow_optimize=true
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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_value_by_target_type](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target_type)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Sessions This Run {#model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run}

<DbtDetails><summary>
<code>models/sessions/scratch/snowplow_ecommerce_sessions_this_run.sql</code>
</summary>

<h4>Description</h4>

This staging table tracks and stores aggregate information about sessions that occurred within the current run. It possesses all of the same columns as `snowplow_ecommerce_sessions`. If building a custom module that requires session level data, this is the table you should reference for that information.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ | text |
| start_tstamp | The first time the session interacted with the website | timestamp_ntz |
| end_tstamp | The last time the session interacted with the website | timestamp_ntz |
| number_unique_cart_ids | The total number of unique `cart_id`s over the session's lifetime | number |
| number_carts_created | The total number of carts created over the session's lifetime | number |
| number_carts_emptied | The total number of carts emptied over the session's lifetime | number |
| number_carts_transacted | The total number of carts transacted over the session's lifetime | number |
| first_cart_created | The timestamp of when the session first created a cart | timestamp_ntz |
| last_cart_created | The timestamp of when the session last created a cart | timestamp_ntz |
| first_cart_transacted | The timestamp of when the session first transacted (purchased) the contents of a cart | timestamp_ntz |
| last_cart_transacted | The timestamp of when the session last transacted (purchased) the contents of a cart | timestamp_ntz |
| session_cart_abandoned | A boolean to describe whether the session's cart was abandoned | boolean |
| session_entered_at_checkout | A boolean to describe whether the session started within the checkout | boolean |
| number_unique_checkout_steps_attempted | The total distinct number of checkout steps that a session went through | number |
| number_checkout_steps_visited | The total number of (non-unique) checkout steps that a session went through | number |
| checkout_succeeded | A boolean to describe whether the checkout succeeded | boolean |
| first_checkout_attempted | The timestamp of when the session first attempted any checkout steps | timestamp_ntz |
| last_checkout_attempted | The timestamp of when the session last attempted any checkout steps | timestamp_ntz |
| first_checkout_succeeded | The timestamp of when the session first succeeded in checking out products | timestamp_ntz |
| last_checkout_succeeded | The timestamp of when the session last succeeded in checking out products | timestamp_ntz |
| first_product_view | The timestamp of when the session first viewed a product | timestamp_ntz |
| last_product_view | The timestamp of when the session last viewed a product | timestamp_ntz |
| first_product_add_to_cart | The timestamp of when the session first added a product to their cart | timestamp_ntz |
| last_product_add_to_cart | The timestamp of when the session last added a product to their cart | timestamp_ntz |
| first_product_remove_from_cart | The timestamp of when the session first removed a product from their cart | timestamp_ntz |
| last_product_remove_from_cart | The timestamp of when the session last removed a product from their cart | timestamp_ntz |
| first_product_transaction | The timestamp of when the session first purchased a product | timestamp_ntz |
| last_product_transaction | The timestamp of when the session last purchased a product | timestamp_ntz |
| number_product_views | The number of product views that occurred within a session | number |
| number_add_to_carts | The number of add to cart actions that occurred within a session | number |
| number_remove_from_carts | The number of remove from cart actions that occurred within a session | number |
| number_product_transactions | The number of product transaction actions that occurred within a session | number |
| first_transaction_completed | The timestamp of when the session first completed a transaction | timestamp_ntz |
| last_transaction_completed | The timestamp of when the session last completed a transaction | timestamp_ntz |
| total_transaction_revenue | The total amount of revenue coming from transactions over the session's lifetime | number |
| total_transaction_quantity | The total quantity of products coming from transactions over the session's lifetime | number |
| total_number_transactions | The total number of transactions over the session's lifetime | number |
| total_transacted_products | The total number of transacted products over the session's lifetime | number |
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
    {% if var('snowplow__disable_ecommerce_carts', false) -%}
        select
        CAST(NULL as {{ type_string() }}) as domain_sessionid,
        CAST(NULL as {{ type_int() }}) as number_unique_cart_ids,
        CAST(NULL as {{ type_int() }}) as number_carts_created,
        CAST(NULL as {{ type_int() }}) as number_carts_emptied,
        CAST(NULL as {{ type_int() }}) as number_carts_transacted,
        CAST(NULL as {{ type_timestamp() }}) as first_cart_created,
        CAST(NULL as {{ type_timestamp() }}) as last_cart_created,
        CAST(NULL as {{ type_timestamp() }}) as first_cart_transacted,
        CAST(NULL as {{ type_timestamp() }}) as last_cart_transacted,
        CAST(NULL as {{ type_boolean() }}) as session_cart_abandoned

    {%- else -%}
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
    {%- endif %}
), checkout_session_stats AS (
    {% if var('snowplow__disable_ecommerce_checkouts', false) -%}
       select
            CAST(NULL as {{ type_string() }}) as domain_sessionid,
            CAST(NULL as {{ type_boolean() }}) as session_entered_at_checkout,
            CAST(NULL as {{ type_int() }}) as number_unique_checkout_steps_attempted,
            CAST(NULL as {{ type_int() }}) as number_checkout_steps_visited,
            CAST(NULL as {{ type_boolean() }}) as checkout_succeeded,
            CAST(NULL as {{ type_timestamp() }}) as first_checkout_attempted,
            CAST(NULL as {{ type_timestamp() }}) as last_checkout_attempted,
            CAST(NULL as {{ type_timestamp() }}) as first_checkout_succeeded,
            CAST(NULL as {{ type_timestamp() }}) as last_checkout_succeeded
    {%- else -%}
     select
            domain_sessionid,

            CAST(MAX(CAST(session_entered_at_step as {{ type_int() }})) as {{ type_boolean() }}) as session_entered_at_checkout,
            COUNT(DISTINCT checkout_step_number) as number_unique_checkout_steps_attempted,
            COUNT(DISTINCT event_id) as number_checkout_steps_visited,
            CAST(MAX(CAST(checkout_succeeded as {{ type_int() }})) as {{ type_boolean() }}) as checkout_succeeded,

            MIN(CASE WHEN checkout_step_number = 1 THEN derived_tstamp END) as first_checkout_attempted,
            MAX(CASE WHEN checkout_step_number = 1 THEN derived_tstamp END) as last_checkout_attempted,
            MIN(CASE WHEN checkout_succeeded THEN derived_tstamp END) as first_checkout_succeeded,
            MAX(CASE WHEN checkout_succeeded THEN derived_tstamp END) as last_checkout_succeeded

        from {{ ref('snowplow_ecommerce_checkout_interactions_this_run') }}
        group by 1

    {%- endif %}
), product_session_stats AS (
    {% if var('snowplow__disable_ecommerce_products', false) -%}
        select
            CAST(NULL as {{ type_string() }}) AS domain_sessionid,
            CAST(NULL as {{ type_timestamp() }}) AS first_product_view,
            CAST(NULL as {{ type_timestamp() }}) AS last_product_view,
            CAST(NULL as {{ type_timestamp() }}) AS first_product_add_to_cart,
            CAST(NULL as {{ type_timestamp() }}) AS last_product_add_to_cart,
            CAST(NULL as {{ type_timestamp() }}) AS first_product_remove_from_cart,
            CAST(NULL as {{ type_timestamp() }}) AS last_product_remove_from_cart,
            CAST(NULL as {{ type_timestamp() }}) AS first_product_transaction,
            CAST(NULL as {{ type_timestamp() }}) AS last_product_transaction,
            CAST(NULL as {{ type_int() }}) AS number_product_views,
            CAST(NULL as {{ type_int() }}) AS number_add_to_carts,
            CAST(NULL as {{ type_int() }}) AS number_remove_from_carts,
            CAST(NULL as {{ type_int() }}) AS number_product_transactions,
            CAST(NULL as {{ type_int() }}) AS number_distinct_products_viewed
    {%- else -%}
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

    {%- endif %}
), transaction_session_stats AS (
    {% if var('snowplow__disable_ecommerce_transactions', false) -%}
        select
            CAST(NULL as {{ type_string() }}) AS domain_sessionid,
            CAST(NULL as {{ type_timestamp() }}) AS first_transaction_completed,
            CAST(NULL as {{ type_timestamp() }}) AS last_transaction_completed,
            CAST(NULL as {{ type_float() }}) AS total_transaction_revenue,
            CAST(NULL as {{ type_int() }}) AS total_transaction_quantity,
            CAST(NULL as {{ type_int() }}) AS total_number_transactions,
            CAST(NULL as {{ type_int() }}) AS total_transacted_products

    {%- else -%}
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
    {%- endif %}
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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- macro.dbt.type_boolean
- macro.dbt.type_int
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Transaction Interactions {#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions}

<DbtDetails><summary>
<code>models/transactions/snowplow_ecommerce_transaction_interactions.sql</code>
</summary>

<h4>Description</h4>

This derived incremental table contains all historic transaction interactions and should be the end point for any analysis or BI tools.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| event_id | A UUID for each event e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| page_view_id | A UUID for each page view e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| event_in_session_index | The index of the event in the corresponding session. | number |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ | text |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. ‘ecdff4d0-9175-40ac-a8bb-325c49733607’ | text |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ | text |
| ecommerce_user_id | The ecommerce user id extracted from the ecommerce user context. | text |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ | timestamp_ntz |
| derived_tstamp_date | Date value of the timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ | date |
| transaction_id | The ID of the transaction | text |
| transaction_currency | The currency used for the transaction (ISO 4217). | text |
| transaction_payment_method | The payment method used for the transaction. | text |
| transaction_revenue | The revenue of the transaction. | number |
| transaction_total_quantity | Total quantity of items in the transaction. | number |
| transaction_credit_order | Whether the transaction is a credit order or not. | boolean |
| transaction_discount_amount | Discount amount taken off | number |
| transaction_discount_code | Discount code used. | text |
| transaction_shipping | Total cost of shipping on the transaction. | number |
| transaction_tax | Total amount of tax on the transaction. | number |
| ecommerce_user_email | The ecommerce user email, extracted from the ecommerce user context. | text |
| ecommerce_user_is_guest | A boolean extracted from the ecommerce user context to ascertain whether a user is a guest or not. | boolean |
| number_products | The number of products that are contained in a transaction, counted from the product interactions | number |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/models/transactions/snowplow_ecommerce_transaction_interactions.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized="incremental",
    unique_key='transaction_id',
    upsert_date_key='derived_tstamp',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val = {
      "field": "derived_tstamp",
      "data_type": "timestamp"
    }, databricks_val='derived_tstamp_date'),
    tags=["derived"],
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    },
    snowplow_optimize=true
  )
}}

select *

from {{ ref('snowplow_ecommerce_transaction_interactions_this_run') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_ecommerce') }}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_value_by_target_type](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target_type)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Transaction Interactions This Run {#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions_this_run}

<DbtDetails><summary>
<code>models/transactions/scratch/snowplow_ecommerce_transaction_interactions_this_run.sql</code>
</summary>

<h4>Description</h4>

This staging table tracks and stores information about transaction interactions that occurred within the current run, with interactions being when a user completes a transaction. It possesses all of the same columns as `snowplow_ecommerce_transaction_interactions`. If building a custom module that requires checkout interactions, this is the table you should reference for that information.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| event_id | A UUID for each event e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| page_view_id | A UUID for each page view e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| domain_sessionid | A visit / session UUID e.g. ‘c6ef3124-b53a-4b13-a233-0088f79dcbcb’ | text |
| event_in_session_index | The index of the event in the corresponding session. | number |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. ‘bc2e92ec6c204a14’ | text |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. ‘ecdff4d0-9175-40ac-a8bb-325c49733607’ | text |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ | text |
| ecommerce_user_id | The ecommerce user id extracted from the ecommerce user context. | text |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ | timestamp_ntz |
| derived_tstamp_date | Date value of the timestamp making allowance for innaccurate device clock e.g. ‘2013-11-26 00:02:04’ | date |
| transaction_id | The ID of the transaction | text |
| transaction_currency | The currency used for the transaction (ISO 4217). | text |
| transaction_payment_method | The payment method used for the transaction. | text |
| transaction_revenue | The revenue of the transaction. | number |
| transaction_total_quantity | Total quantity of items in the transaction. | number |
| transaction_credit_order | Whether the transaction is a credit order or not. | boolean |
| transaction_discount_amount | Discount amount taken off | number |
| transaction_discount_code | Discount code used. | text |
| transaction_shipping | Total cost of shipping on the transaction. | number |
| transaction_tax | Total amount of tax on the transaction. | number |
| ecommerce_user_email | The ecommerce user email, extracted from the ecommerce user context. | text |
| ecommerce_user_is_guest | A boolean extracted from the ecommerce user context to ascertain whether a user is a guest or not. | boolean |
| number_products | The number of products that are contained in a transaction, counted from the product interactions | number |
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
        sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
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

        {% if (var("snowplow__use_product_quantity", false) and not var("snowplow__disable_ecommerce_products", false) | as_bool() )  -%}
        SUM(pi.product_quantity) as number_products
        {%- else -%}
        COUNT(*) as number_products -- count all products added
        {%- endif %}

    from {{ ref('snowplow_ecommerce_base_events_this_run') }} as e
    {% if not var("snowplow__disable_ecommerce_products", false)  -%}
    left join {{ ref('snowplow_ecommerce_product_interactions_this_run') }} as pi on e.transaction_id = pi.transaction_id AND pi.is_product_transaction
    {%- endif %}
    where ecommerce_action_type = 'transaction'
    group by 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22
)

select *

from transaction_info
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions)

</TabItem>
</Tabs>
</DbtDetails>

