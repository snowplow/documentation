import { findForcedRedirect, findFallbackRedirect } from './redirects.js';

function toResponse(redirect, url) {
  if (!redirect) return null;
  const target = redirect.to.startsWith('http')
    ? redirect.to
    : `${url.origin}${redirect.to}`;
  return Response.redirect(target, redirect.status);
}

const SNOWPLOW_ENDPOINT = "https://86976d04-0042-4716-aade-0d4e21159b7f.apps.snowplowanalytics.com/com.snowplowanalytics.snowplow/tp2"

function isPageRequest(pathname) {
  const dotIndex = pathname.lastIndexOf('.');
  if (dotIndex === -1 || dotIndex < pathname.lastIndexOf('/')) return true;
  return pathname.endsWith('.md');
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (isPageRequest(url.pathname)) {
      const snowplowPayload = {
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

      ctx.waitUntil(fetch(
        SNOWPLOW_ENDPOINT, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "SP-Anonymous": "*",
            ...(request.headers.get("signature-agent") && {
              "signature-agent": request.headers.get("signature-agent")
            })
          },
          body: JSON.stringify(snowplowPayload)
        })
      );
    }

    const forced = toResponse(findForcedRedirect(url.pathname), url);
    if (forced) return forced;

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    const fallback = toResponse(findFallbackRedirect(url.pathname), url);
    if (fallback) return fallback;

    return response;
  },
};
