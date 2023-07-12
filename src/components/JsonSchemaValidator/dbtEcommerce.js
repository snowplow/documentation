export const dbtSnowplowEcommerceConfigSchema = {
  type: 'object',
  properties: {
    snowplow__atomic_schema: {
      type: 'string',
      title: 'Schema',
      description: 'Schema (dataset) that contains your atomic events',
    },
    snowplow__categories_separator: {
      type: 'string',
      title: 'Categories Separator',
      length: 1,
      description:
        'Separator used to split out your subcategories from your main subcategory',
    },
    snowplow__database: {
      type: 'string',
      title: 'Database',
      description: 'Database that contains your atomic events',
    },
    snowplow__dev_target_name: {
      type: 'string',
      title: 'Dev Target',
      description:
        'Target name of your development environment as defined in your `profiles.yml` file',
    },
    snowplow__number_category_levels: {
      type: 'number',
      minimum: 1,
      title: 'Number of Category Levels',
      description: 'The **maximum** number of levels (depth) of subcategories',
    },
    snowplow__number_checkout_steps: {
      type: 'number',
      minimum: 1,
      title: 'Number of Checkout Steps',
      description:
        'Index of the checkout step which represents a completed transaction',
    },
    snowplow__allow_refresh: {
      type: 'boolean',
      title: 'Allow Refresh',
    },
    snowplow__backfill_limit_days: {
      type: 'number',
      minimum: 0,
      title: 'Backfill Limit',
      description:
        'The maximum numbers of days of new data to be processed since the latest event processed',
    },
    snowplow__days_late_allowed: {
      type: 'number',
      minimum: 0,
      title: 'Days Late Allowed',
      description:
        'The maximum allowed number of days between the event creation and it being sent to the collector',
    },
    snowplow__ecommerce_event_names: {
      type: 'array',
      minItems: 0,
      title: 'E-Commerce Event Names',
      items: { type: 'string' },
      description: '> Click the plus sign to add a new entry',
    },
    snowplow__enable_mobile_events : {
      type: 'boolean',
      title: 'Enable Mobile Events'
    },
    snowplow__lookback_window_hours: {
      type: 'number',
      minimum: 0,
      title: 'Event Lookback Window',
      description:
        'The number of hours to look before the latest event processed - to account for late arriving data, which comes out of order',
    },
    snowplow__max_session_days: {
      type: 'number',
      minimum: 0,
      title: 'Max Session Length',
      description:
        'The maximum allowed session length in days. For a session exceeding this length, all events after this limit will stop being processed',
    },
    snowplow__session_lookback_days: {
      type: 'number',
      minimum: 0,
      title: 'Session Lookback Window',
      description:
        'Number of days to limit scan on `snowplow_web_base_sessions_lifecycle_manifest` manifest',
    },
    snowplow__start_date: {
      type: 'string',
      format: 'date',
      title: 'Start Date',
      description:
        'The date to start processing events from in the package on first run or a full refresh, based on `collector_tstamp`',
    },
    snowplow__upsert_lookback_days: {
      type: 'number',
      minimum: 0,
      title: 'Upsert Lookback Days',
      description:
        'Number of days to look back over the incremental derived tables during the upsert',
    },
    snowplow__use_product_quantity: {
      type: 'boolean',
      title: 'Use Product Quantity?',
    },
    snowplow__app_id: {
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      title: 'App IDs',
      items: { type: 'string' },
    },
    snowplow__disable_ecommerce_carts: {
      type: 'boolean',
      title: 'Disable Carts',
    },
    snowplow__disable_ecommerce_checkouts: {
      type: 'boolean',
      title: 'Disable Checkouts',
    },
    snowplow__disable_ecommerce_page_context: {
      type: 'boolean',
      title: 'Disable Page Context',
    },
    snowplow__disable_ecommerce_products: {
      type: 'boolean',
      title: 'Disable Products',
    },
    snowplow__disable_ecommerce_transactions: {
      type: 'boolean',
      title: 'Disable Transactions',
    },
    snowplow__disable_ecommerce_user_context: {
      type: 'boolean',
      title: 'Disable User Context',
    },
    snowplow__databricks_catalog: {
      type: 'string',
      title: '(Databricks) Catalog',
      description: 'The catalogue your atomic events table is in',
    },
    snowplow__context_ecommerce_user: {
      type: 'string',
      title: '(Redshift) E-Commerce User Context Table',
    },
    snowplow__context_ecommerce_checkout_step: {
      type: 'string',
      title: '(Redshift) E-Commerce Checkout StepContext Table',
    },
    snowplow__context_ecommerce_page: {
      type: 'string',
      title: '(Redshift) E-Commerce Page Context Table',
    },
    snowplow__context_ecommerce_transaction: {
      type: 'string',
      title: '(Redshift) E-Commerce Transaction Context Table',
    },
    snowplow__context_ecommerce_cart: {
      type: 'string',
      title: '(Redshift) E-Commerce Cart Context Table',
    },
    snowplow__context_web_page: {
      type: 'string',
      title: '(Redshift) Web Page Context Table',
    },
    snowplow__context_mobile_session: {
      type: 'string',
      title: '(Redshift) Mobile Session Context Table',
    },
    snowplow__context_screen: {
      type: 'string',
      title: '(Redshift) Mobile Screen Context Table',
    },
    snowplow__context_ecommerce_product: {
      type: 'string',
      title: '(Redshift) E-Commerce Product Context Table',
    },
    snowplow__sde_ecommerce_action: {
        type: 'string',
        title: '(Redshift) E-Commerce Action Self Describing Event Table',
      },
    snowplow__derived_tstamp_partitioned: {
      type: 'boolean',
      title: '(Bigquery) Dervied Timestamp Partition',
    },
  },
}
