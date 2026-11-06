---
title: "Harden the web tracker"
sidebar_label: "Hardening the web tracker"
description: "Reduce the web tracker's exposure to compromised third-party scripts using self-hosting, a Content-Security-Policy, and Subresource Integrity."
keywords: ["security", "hardening", "subresource integrity", "sri", "content security policy", "csp", "supply chain"]
date: "2026-11-06"
sidebar_position: 3300
---

The web tracker runs in the user's page, so any script it loads at runtime is part of that page's attack surface. You can reduce this exposure by controlling exactly which scripts the browser is allowed to run and by verifying that each one matches the version you expect, rather than trusting a CDN to continue serving the same code.

## Self-host or bundle the tracker and plugins

Loading `sp.js` or a plugin from a third-party CDN means the browser fetches whatever that CDN is currently serving at that URL. If the CDN or the upstream package is compromised, every page that loads the script picks up the change on its next request. [Self-hosting `sp.js`](/docs/sources/web-trackers/tracker-setup/hosting-the-javascript-tracker/index.md) removes this dependency, since you control when the file on your own server changes.

The same applies to plugins. Rather than loading a plugin by URL with [`addPlugin`](/docs/sources/web-trackers/plugins/configuring-tracker-plugins/index.md), you can bundle the tracker and its plugins together using npm, or produce a custom build that includes only the plugins you use by following the [white-label build](/docs/sources/web-trackers/tracker-setup/hosting-the-javascript-tracker/creating-a-whitelabel-build/index.md) process. Either approach means the plugin code ships as part of your own build output instead of being fetched from a separate origin at runtime.

If you do load a plugin by URL, always pin it to an exact version rather than a tag like `@latest` or a major-version range. The [plugin pages](/docs/sources/web-trackers/tracking-events/index.md) and the [GTM template's plugin documentation](/docs/sources/google-tag-manager/snowplow-template/plugins/index.md) show pinned URLs for this reason.

## Restrict script execution with a Content-Security-Policy

A [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) (CSP) tells the browser which origins are allowed to serve scripts for your page, so a script injected from an unexpected origin is blocked even if it ends up referenced somewhere in your page. At minimum, restrict `script-src` to the origins you actually load scripts from, and restrict `connect-src` to your collector:

```
Content-Security-Policy: script-src 'self' https://cdn.jsdelivr.net; connect-src https://collector.example.com;
```

If you self-host `sp.js` and bundle your plugins, you can remove the CDN origin from `script-src` entirely and rely on `'self'`.

## Add Subresource Integrity to pinned scripts

[Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) (SRI) lets the browser verify that a script it fetches matches a hash you specify, and refuse to execute it otherwise. Add an `integrity` attribute and `crossorigin="anonymous"` to the script tag:

```html
<script
  async
  src="https://cdn.jsdelivr.net/npm/@snowplow/javascript-tracker@<version>/dist/sp.js"
  integrity="sha384-<hash>"
  crossorigin="anonymous"
></script>
```

[jsDelivr](https://www.jsdelivr.com/) and [cdnjs](https://cdnjs.com/) both publish the SHA-384 hash for each exact version they serve, so you can copy it directly from the package page. If you self-host a file instead, compute the hash yourself:

```bash
openssl dgst -sha384 -binary sp.js | openssl base64 -A
```

Use the output as the `sha384-` value in the `integrity` attribute. Whenever you update the pinned version of the file, recompute and update the hash, otherwise the browser refuses to run the new file.

## Known limitations

SRI only verifies the script you tag with the `integrity` attribute; it does not cover anything that script loads afterwards. For example, the [YouTube tracking plugin](/docs/sources/web-trackers/tracking-events/media/youtube/index.md) loads Google's `https://www.youtube.com/iframe_api`, which is unversioned and offers no integrity hash to pin against. This is outside your control and outside Snowplow's control, so treat it as an accepted risk if you use the plugin, rather than something these measures can close.
