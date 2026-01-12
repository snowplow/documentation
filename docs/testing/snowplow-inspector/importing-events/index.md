---
title: "Import events into Snowplow Inspector from multiple sources"
sidebar_label: "Importing events"
sidebar_position: 20
description: "Import events into Inspector from HAR files, failed events, ElasticSearch, ngrok tunnels, or remote debugging sessions. View and debug events from mobile devices and other sources as if generated locally."
keywords: ["import events", "har files", "failed events", "remote debugging", "ngrok", "elasticsearch"]
---

Within the Snowplow Inspector, the main **Events** view allows you to import events from other devices that you can view, as if your own browser generated them.

Import events via the **Import Events** icon button at the top of the events list. The extension supports several file types.

## Importing from HAR files

[HAR](https://en.wikipedia.org/wiki/HAR_(file_format)) files are JSON representations of HTTP sessions.
They include a list of requests and responses made to servers by a single client, including all the metadata such as headers.

You can export the current contents of the **Network** panel in your DevTools to a HAR file, and then later load them into the extension as a record that events fired and successfully validated, or failed to validate.
This can be useful for troubleshooting, or as a record of the QA process.

Aside from the browser, other tools like [Charles Proxy](https://www.charlesproxy.com/) or [Fiddler](https://www.telerik.com/fiddler), commonly used as proxies for verifying analytics from mobile applications, can also export to this format.

## Importing failed events

You can import historical events that have already failed the enrichment process into the extension to allow you to easily find the errors with the events.

The extension will accept an uncompressed file, which you can paste a selection from, or in total straight from your clipboard.

## Importing events from ElasticSearch / OpenSearch

If you use [ElasticSearch](https://www.elastic.co/) / [OpenSearch](https://opensearch.org/) as a destination for your events (or as used in [Snowplow Mini](/docs/api-reference/snowplow-mini/index.md)) you can specify a query to use and the extension will load events as they're indexed.

This can be useful for testing many devices at once, e.g. multiple mobile devices that are all sending events to your Snowplow Mini instance.

## Importing events from an ngrok tunnel

[ngrok](https://ngrok.com/) is a service for creating ad-hoc network endpoints that can accept / tunnel requests and offers an API for other services to introspect and act on the requests that it received.
Using ngrok, you can create an endpoint, use that endpoint as a Collector destination for your tracking, and then examine any events sent to it via the extension.

When you attempt to import from ngrok, the extension will attempt to connect to the ngrok tool running on your local machine on port 4040 (`localhost:4040`) to access the [ngrok Agent API](https://ngrok.com/docs/ngrok-agent/api/).
If successful, any Snowplow events sent to the corresponding tunnel endpoint will appear in the extension.

## Remote debugging with Chrome DevTools

You can [remotely inspect](https://developer.chrome.com/docs/devtools/remote-debugging/) some non-web applications using the [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).
This includes some mobile browsers, some mobile applications, WebViews on Android, [Chromium Embedded Framework](https://github.com/chromiumembedded/cef) applications, and more.
You may need to access the remote DevTools via the URL `chrome://inspect/#devices` to access DevTools with Snowplow Inspector and other browser extensions active.
Network requests made on the remote device should appear in the extension as usual.
