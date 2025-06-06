---
position: 4
title: (Optional) Add your own calculation
---

The package `com.evoura.snowplow.operator.product` contains all classes related to the product features. The features used by the product windows are:

1. `product_view_count`
2. `avg_viewed_price`
3. `return_view_count`
4. `price_range_viewed`

So let's imagine from now on it's required to also track the most viewed **Product Brand**. How would we do that?

When we check `com.evoura.snowplow.operator.product.ProductViewEvent`, we notice the brand of the product is not available on this class. But when we check the `product_view` (`.example/product_view.json`) event provided by Snowplow, the field `product.brand` is available inside the payload of the event. So how could we leverage this information on the system?

1. **Add the field on `ProductViewEvent`** 
    
    So your class should now look like this
    
    ```java
    package com.evoura.snowplow.operator.product;
    
    import com.evoura.operator.TimestampedEvent;
    
    public class ProductViewEvent implements TimestampedEvent {
      public String eventId;
      public String userId;
      public String productId;
      public double productPrice;
      public long timestamp;
      public String brand;
    
      public ProductViewEvent() {}
    
      public ProductViewEvent(
          String eventId, String userId, String productId, double productPrice, long timestamp, String brand) {
        this.eventId = eventId;
        this.userId = userId;
        this.productId = productId;
        this.productPrice = productPrice;
        this.timestamp = timestamp;
        this.brand = brand;
      }
    
      @Override
      public long getTimestamp() {
        return timestamp;
      }
    
      @Override
      public String toString() {
        return "ProductViewEvent{"
            + "eventId='"
            + eventId
            + '\''
            + ", userId='"
            + userId
            + '\''
            + ", productId='"
            + productId
            + '\''
            + ", productPrice="
            + productPrice
            + ", brand='"
            + brand
            + '\''
            + '}';
      }
    }
    ```
    
    This will add the field on the class but we will still lack the deserialization part.
    
2. **Desesialize the information in `com.evoura.snowplow.operator.product.ProductViewEventMap`**
    
     ****Since we added one field on `ProductViewEvent` and also changed the full arg constructor, let's also change the place where this object is created. 
    
    The class `ProductViewEventMap` is responsible for mapping a `SnowplowEvent` into a `ProductViewEvent`. To make sure the product event object is being properly created, let's go to the return of `ProductViewEventMap.map` and add the new field. It should look like this:
    
    ```java
      @Override
      public ProductViewEvent map(SnowplowEvent snowplowEvent) throws Exception {
        String eventId = snowplowEvent.getEventId();
        String userId = snowplowEvent.getUserId();
    
        JsonNode payloadNode = MAPPER.readTree(snowplowEvent.payload);
        JsonNode productNode = payloadNode.path("product");
    
        String productId = productNode.path("id").asText("");
        JsonNode priceNode = productNode.path("price");
        double productPrice = priceNode.isNumber() ? priceNode.asDouble() : 0.0;
    
        return new ProductViewEvent(
            eventId, userId, productId, productPrice, snowplowEvent.getTimestamp(), productNode.path("brand").asText());
      }
    ```
    
    From now on, all `ProductViewEvent` events will have the field brand in it.
    
3. **Calculate the most viewed brand by user**
    
    Since the field `brand` is now available, let's calculate which one is the most viewed by user. All the current features are already segmented by user_id, so the segmentation part will not be part of this. When checking the class `com.evoura.snowplow.operator.product.ProductFeatureRollingWindow` you will find that the method `ProductFeatureRollingWindow.processWindow` receives a `Iterable<ProductViewEvent> events` as the first argument. This variable will contain all `ProductViewEvent` by the defined window (for Products we have a **5m** and a **1h** window). You can iterate through these items to calculate the most viewed brand by user in this window. It would look like something like this:
    
    ```java
    String mostViewedBrand =
            uniqueEvents.values().stream()
                .collect(
                    Collectors.groupingBy(
                        productViewEvent -> productViewEvent.brand, Collectors.counting()))
                .entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("");
    ```
    
    With this feature calculated, we need to collect its value to be sure it will be available for Flink in a later stage. When we check the third argument of `ProductFeatureRollingWindow.processWindow`, we see this: `Collector<ProductFeature> out`.
    
    The class `Collector` in this context is responsible for collecting any object to the next operator in Flink. In this case, `ProductFeature` is the collected object. So let's find a way to add `mostViewedBrand` to `ProductFeature`.
    
4. **Forward the `mostViewedBrand` downstream**
    
    The class `ProductFeature` is responsible for forwarding all calculations that happened on `ProductFeatureRollingWindow.processWindow` so let's make sure we have a place there to store the new `mostViewedBrand` feature.
    
    ```java
    public class ProductFeature implements Serializable {
      public String userId;
      public int uniqueProductCount;
      public double averagePrice;
      public double minPrice;
      public double maxPrice;
      public String windowSize;
      public Map<String, Long> views;
      public String mostViewedBrand;
    
      public ProductFeature() {}
    
      public ProductFeature(
          String userId,
          int uniqueProductCount,
          double averagePrice,
          double minPrice,
          double maxPrice,
          String windowSize,
          Map<String, Long> views,
          String mostViewedBrand) {
        this.userId = userId;
        this.uniqueProductCount = uniqueProductCount;
        this.averagePrice = averagePrice;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.windowSize = windowSize;
        this.views = views;
        this.mostViewedBrand = mostViewedBrand;
      }
      
      ...
    }
    ```
    
    In this class, we see a new piece of code. Something named `TypeInfoFactory`. In Flink context, a `TypeInfoFactory` is a way to tell Flink what is being forwarded to the next operator. This is required because we decided to disable Kryo deserialization on Flink. To make sure Flink understands our object properly, let's add `mostViewedBrand` in `ProductFeature` `TypeInfoFactory`. The desired output will be:
    
    ```java
    public class ProductFeature implements Serializable {
    	...
    
      public static class InfoFactory extends TypeInfoFactory<ProductFeature> {
    
        public static TypeInformation<ProductFeature> typeInfo() {
          InfoFactory factory = new InfoFactory();
          return factory.createTypeInfo(null, null);
        }
    
        @Override
        public TypeInformation<ProductFeature> createTypeInfo(
            Type t, Map<String, TypeInformation<?>> genericParameters) {
          Map<String, TypeInformation<?>> fields = new HashMap<>();
    
          fields.put("userId", Types.STRING);
          fields.put("uniqueProductCount", Types.INT);
          fields.put("averagePrice", Types.DOUBLE);
          fields.put("minPrice", Types.DOUBLE);
          fields.put("maxPrice", Types.DOUBLE);
          fields.put("windowSize", Types.STRING);
          fields.put("views", Types.MAP(Types.STRING, Types.LONG));
          fields.put("mostViewedBrand", Types.STRING);
    
          return Types.POJO(ProductFeature.class, fields);
        }
      }
    }
    ```
    
    After this change we may go back to `ProductFeatureRollingWindow.processWindow` and pass `mostViewedBrand` on.
    
    ```java
        out.collect(
            new ProductFeature(
                ctx.getCurrentKey(),
                uniqueViewsCount,
                avgUniquePrice,
                uniqueViewsCount == 0 ? 0.0 : priceStats.getMin(),
                uniqueViewsCount == 0 ? 0.0 : priceStats.getMax(),
                windowIdentifier,
                productViewCounts,
                mostViewedBrand));
    ```
    
5. **Getting the feature in Redis**
    
    After this steps, we have `mostViewedBrand` available to be projected to Redis. The class `com.evoura.snowplow.operator.product.ProductMetricsGeneratorRichFunction` is responsible for converting the generated metrics in something the Redis operator understands. The method `ProductMetricsGeneratorRichFunction.processElement` has multiple feature collections. Let's add our brand new `mostViewedBrand`:
    
    ```java
    out.collect(
            new MetricValue(
                String.format(
                    "user:%s:most_viewed_brand_%s", productFeature.userId, productFeature.windowSize),
                String.valueOf(productFeature.mostViewedBrand)));
    ```
    
6. **Running the pipeline**
    
    After these changes, let's re-run the script `./up.sh`. It will rebuild the docker image and restart the containers. From now on you should be able to see the most seen brand by user. 
    
    ![image.png](./images/live-shopper-add-calculation-redis.webp)