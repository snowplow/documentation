---
title: "Harden the JavaScript tracker against compromised scripts"
sidebar_label: "Hardening the tracker"
description: "Reduce the JavaScript tracker's exposure to compromised third-party scripts by self-hosting, pinning versions, restricting scripts with a Content Security Policy, and adding Subresource Integrity checks."
keywords: ["security", "hardening", "subresource integrity", "sri", "content security policy", "csp", "supply chain"]
date: "2026-11-06"
sidebar_position: 3300
content_type: how-to
---

The JavaScript tracker runs in your page, so every script it loads, including `sp.js`, plugins, and libraries that plugins load, runs with the same access as your own code. If a CDN or an upstream package serving one of those scripts is compromised, the change reaches your page the next time the script loads.

This page describes three measures that limit this exposure. You can apply them independently, but they work best together.

## Self-host or bundle the tracker and plugins

When you load `sp.js` or a plugin from a third-party CDN, the browser runs whatever that CDN serves at that URL. Hosting the files yourself means they only change when you deploy a new version.

You can remove third-party script loading for the tracker and its plugins in any of these ways:

* Self-host `sp.js` by following the [hosting guides](/docs/sources/web-trackers/tracker-setup/hosting-the-javascript-tracker/index.md)
* Install the tracker and plugins from npm and bundle them into your application
* Create a [custom build](/docs/sources/web-trackers/tracker-setup/hosting-the-javascript-tracker/creating-a-whitelabel-build/index.md) of `sp.js` that includes only the plugins you use

If you load plugins by URL using [`addPlugin`](/docs/sources/web-trackers/plugins/configuring-tracker-plugins/index.md), self-host the plugin files too, or pin each URL to an exact version, such as `@4.10.2`. Never use `@latest` or a major-version range such as `@4` in production, since the file behind those URLs changes with each release.

## Restrict which origins can serve scripts

A [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) (CSP) tells the browser which origins your page can load scripts from and send requests to. The browser blocks a script from any other origin, even if the script is injected into your page.

Add the origins the tracker needs to your existing policy. The tracker needs `script-src` to allow the origin you load `sp.js` and plugins from, and `connect-src` to allow your Collector. For example, if you self-host the tracker and your Collector is at `collector.example.com`:

```text
Content-Security-Policy: script-src 'self'; connect-src 'self' https://collector.example.com
```

The [tag snippet](/docs/sources/web-trackers/tracker-setup/index.md) that loads `sp.js` is an inline script, so a policy without `'unsafe-inline'` also needs to allow the snippet with a [nonce or hash](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).

Some plugins load additional scripts that also need to be allowed:

* Web Vitals plugin: loads the `web-vitals` library from `https://unpkg.com` by default. Allow that origin, or self-host the library and set the [`webVitalsSource`](/docs/sources/web-trackers/tracking-events/web-vitals/index.md) option to its URL
* YouTube tracking plugin: loads the YouTube IFrame Player API from `https://www.youtube.com`

## Verify scripts with Subresource Integrity

[Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) (SRI) lets the browser check that a script matches a hash you provide, and refuse to run it if it doesn't. SRI only works with a URL that points to an exact version, because the hash changes whenever the file changes.

To get the hash for an exact version on jsDelivr, open the package page on [jsDelivr](https://www.jsdelivr.com/package/npm/@snowplow/javascript-tracker) and copy the SRI hash for the file. For a file you host yourself, compute the hash:

```bash
openssl dgst -sha384 -binary sp.js | openssl base64 -A
```

The standard [tag snippet](/docs/sources/web-trackers/tracker-setup/index.md) creates the `script` element in JavaScript, so set the hash on that element rather than on a `<script>` tag. This version of the snippet adds `n.integrity` and `n.crossOrigin` before the script loads:

```html
<script type="text/javascript" async=1>
;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[]; p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments) };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1; n.integrity="sha384-{{hash}}"; n.crossOrigin="anonymous"; n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","https://cdn.jsdelivr.net/npm/@snowplow/javascript-tracker@{{version}}/dist/sp.js","snowplow"));
</script>
```

When you upgrade the tracker, update the version and the hash together. If they don't match, the browser doesn't run the tracker and no events are sent.

## Understand what these measures don't cover

SRI checks only the script that has the `integrity` attribute. It doesn't check scripts that script loads afterwards.

The [YouTube tracking plugin](/docs/sources/web-trackers/tracking-events/media/youtube/index.md) loads the IFrame Player API from `https://www.youtube.com/iframe_api`. Google doesn't version this file or publish a hash for it, so you can't pin it or verify it with SRI. If you use the YouTube plugin, your page runs whatever version of the API Google serves, which is also true of any page that embeds the YouTube player.
