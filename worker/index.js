import { findForcedRedirect, findFallbackRedirect } from './redirects.js';

function toResponse(redirect, url) {
  if (!redirect) return null;
  const target = redirect.to.startsWith('http')
    ? redirect.to
    : `${url.origin}${redirect.to}`;
  return Response.redirect(target, redirect.status);
}

const SNOWPLOW_ENDPOINT = "https://c.snowplow.io/com.snowplowanalytics.snowplow/tp2"

function trackRequest(pathname) {
  const dotIndex = pathname.lastIndexOf('.');
  if (dotIndex === -1 || dotIndex < pathname.lastIndexOf('/')) return true;
  return pathname.endsWith('.md') || pathname.endsWith('llms.txt');
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (trackRequest(url.pathname)) {
      const headers = {
        "content-type": "application/json",
        "SP-Anonymous": "*",
      };
      for (const name of ["signature-agent", "signature-input", "signature"]) {
        const value = request.headers.get(name);
        if (value) headers[name] = value;
      }

      const payload = {
        schema: "iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4",
        data: [
          {
            e: "pv",
            ua: request.headers.get("user-agent"),
            aid: "docs-cloudflare",
            p: "srv",
            tv: "cf-worker-1.0.0",
            url: request.url
          }
        ]
      };

      ctx.waitUntil(
        (async () => {
          try {
            await fetch(SNOWPLOW_ENDPOINT, {
              method: "POST",
              headers,
              body: JSON.stringify(payload)
            });
            console.log("Sent Snowplow event")
          } catch (e) {
            console.warn("Error sending Snowplow event", e)
          }
        })()
      )
    }

    const forced = toResponse(findForcedRedirect(url.pathname), url);
    if (forced) {
      console.log(`${request.method} ${url.pathname} -> ${forced.status} (redirect)`);
      return forced;
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) {
      console.log(`${request.method} ${url.pathname} -> ${response.status} (asset)`);
      return response;
    }

    const fallback = toResponse(findFallbackRedirect(url.pathname), url);
    if (fallback) {
      console.log(`${request.method} ${url.pathname} -> ${fallback.status} (fallback redirect)`);
      return fallback;
    }

    console.log(`${request.method} ${url.pathname} -> 404`);
    return response;
  },
};
