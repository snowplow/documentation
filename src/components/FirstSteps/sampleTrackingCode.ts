export const sampleTrackingCode = `window.snowplow('trackSelfDescribingEvent',
  {
    event: {
      schema: 'iglu:com.snowplowanalytics.snowplow/add_to_cart/jsonschema/1-0-0',
      data: { sku: 'ASO01043', unitPrice: 49.95, quantity: 1000 }
    }
  }
)
window.snowplow('trackSelfDescribingEvent',
  {
    event: {
      schema: 'iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1',
      data: {
        targetUrl: 'https://snowplow.io'
      }
    }
  }
)
window.snowplow('trackSelfDescribingEvent',
  {
    event: {
      schema: 'iglu:com.snowplowanalytics.mobile/deep_link/jsonschema/1-0-0',
      data: {
        url: 'https://snowplowanalytics.com'
      }
    }
  }
)
window.snowplow('trackSelfDescribingEvent',
  {
    event: {
      schema: 'iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1',
      data: {
        targetUrl: 'https://snowplow.io'
      }
    },
    context: [
      {
        schema: 'iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0',
        data: {
          id: '6a2a8c7c-8e7a-4e9f-9b4c-0f4f9a3f35a9'
        }
      }
    ]
  }
)
window.snowplow('trackPageView', undefined)
window.snowplow('trackPageView', { title: 'My custom page title' })

// Bad Events
window.snowplow('trackSelfDescribingEvent',
  {
    event: {
      schema: 'iglu:com.fake_event/event/jsonschema/1-0-0',
      data: { foo: 'bar' }
    }
  }
)
window.snowplow('trackSelfDescribingEvent',
  {
    event: {
      schema: '',
      data: {}
    }
  }
)
window.snowplow('trackSelfDescribingEvent',
  {
    event: {
      schema: 'iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1',
      data: {
        invalidProperty: "This schema doesn't have this property"
      }
    }
  }
)`
