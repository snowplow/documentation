---
title: Testing attributes in Signals
position: 4
---


## Viewing attribute values

Once you have defined and published your attributes, attribute group, and service using the notebook, you can verify that they have been successfully created in your Snowplow Signals instance.

We will do this by going back to our [demo site](http://localhost:8086) and opening the developer console (Ctrl+Shift+I or equivalent) in your browser. Navigate to the Snowplow Inspector tab and then to the 'Attributes' tab.

## Performing some events

In our notebook we defined a number of attributes that we can now test. Let's test two straighforward ones now.

1. Click on the 'Destinations' link in the top navigation bar to go to the destinations page.
2. Click on any destination page (/destinations/id) that provides more specific information.
3. Once you have landed on this page refresh the page.

Open the extension and verify that:
- You can see page view events being successfully sent to your collector endpoint
- Switch to the 'Attributes' tab and view the `page_view_count` and `dest_page_view_count` attributes, these should now both be non-zero values.

If you are not using the Chrome extension you can also verify this by opening the developer console and looking in logs. Note that this Signals are outputted when the page is refreshed, so may lag behind values presented in the extension.

If these values are appearing as null or zero check that your events are being successfully sent to the collector and if using forwarding that your forwarding address is correct.

## Next steps

Now that we can use behavior to define attributes and retrieve these using a service we'll being to use these attributes to personalize how content on the site is displayed.


