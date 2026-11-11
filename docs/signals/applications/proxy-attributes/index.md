---
title: "Serve attributes to the browser through a server-side proxy"
sidebar_position: 22
sidebar_label: "Proxy attributes to the browser"
description: "Build a small server-side or edge endpoint, for example on Vercel or Cloudflare Workers, that reads the Snowplow tracker cookies, fetches attributes from Signals, and returns them to the browser."
keywords: ["signals proxy", "edge function", "cloudflare workers", "vercel", "next.js", "domain_userid", "real-time personalization"]
date: "2026-11-05"
content_type: how-to
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Signals API credentials must never reach the browser, so your front-end can't call Signals directly to [retrieve attributes](/docs/signals/applications/retrieve-attributes/index.md). Instead, add a small endpoint on your own domain that acts as a proxy: it reads the user's identifier from the Snowplow tracker cookies sent with the request, calls Signals with your credentials, and returns only the attribute values your front-end needs.

Use this pattern when you want to personalize a web page in the browser, for example to show a discount banner, reorder content, or change a call to action, based on what the user has just done. Running the proxy as an edge function, such as a Vercel Function or a Cloudflare Worker, keeps the extra round trip short.

The request flow looks like this:

1. The user's browser calls your endpoint, for example `GET /api/signals`. Because the endpoint is on your site's domain, the browser sends the Snowplow cookies automatically.
2. The endpoint parses the `domain_userid` from the `_sp_id` cookie.
3. The endpoint calls Signals to get the attributes for a [service](/docs/signals/applications/services/index.md), using that identifier as the [attribute key](/docs/signals/attributes/attribute-keys/index.md) value.
4. The endpoint returns a filtered JSON response, and your front-end acts on the values.

## Read the user identifier from the tracker cookies

The JavaScript tracker stores its identifiers in a first-party cookie named `_sp_id.{{DOMAIN HASH}}`, for example `_sp_id.4209`. The cookie value is a dot-separated list: the `domain_userid` is the first segment, and the `domain_sessionid` is the sixth. The Collector sets the `network_userid` in a separate cookie, named `sp` by default. See [cookies and local storage](/docs/sources/web-trackers/cookies-and-local-storage/index.md) for the full cookie format.

```text
_sp_id.4209=8e554b10-4fcf-49e9-a0d8-48b6b6458df3.1730800000.3.1730900000.1730850000.6b1dc54e-3f2a-4c8d-9e7b-1a2b3c4d5e6f.null...
            └───────── domain_userid ──────────┘                                    └──────── domain_sessionid ────────┘
sp=c2c2bd8e-8a9e-4f1b-9f0a-6d1e3c4b5a69
   └───────── network_userid ─────────┘
```

Start with a helper that finds a cookie in the request's `Cookie` header by name prefix:

```typescript title="lib/snowplow-cookies.ts"
export function getCookie(cookieHeader: string | null, matches: (name: string) => boolean): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (matches(name)) return decodeURIComponent(rest.join("="));
  }
  return null;
}
```

Then extract the identifier that matches the [attribute key](/docs/signals/attributes/attribute-keys/index.md) of your attribute groups:

<Tabs groupId="signals-identifier" queryString>
<TabItem value="domain_userid" label="domain_userid" default>

```typescript title="lib/snowplow-cookies.ts"
export function getDomainUserId(cookieHeader: string | null, prefix = "_sp_id."): string | null {
  const value = getCookie(cookieHeader, (name) => name.startsWith(prefix));
  return value?.split(".")[0] || null;
}
```

The `domain_userid` persists across sessions for the lifetime of the cookie, two years by default. It's the most common attribute key for web personalization.

</TabItem>
<TabItem value="domain_sessionid" label="domain_sessionid">

```typescript title="lib/snowplow-cookies.ts"
export function getDomainSessionId(cookieHeader: string | null, prefix = "_sp_id."): string | null {
  const value = getCookie(cookieHeader, (name) => name.startsWith(prefix));
  return value?.split(".")[5] || null;
}
```

The `_sp_id` cookie keeps the last session ID after the session times out. The tracker generates a new one only when it sends its next event. To avoid returning attributes for an expired session, also check that the session cookie, `_sp_ses.{{DOMAIN HASH}}`, is present:

```typescript
const sessionActive = getCookie(cookieHeader, (name) => name.startsWith("_sp_ses.")) !== null;
```

</TabItem>
<TabItem value="network_userid" label="network_userid">

```typescript title="lib/snowplow-cookies.ts"
export function getNetworkUserId(cookieHeader: string | null, name = "sp"): string | null {
  return getCookie(cookieHeader, (cookieName) => cookieName === name) || null;
}
```

Your endpoint only receives the `sp` cookie if it's first-party to your site. This requires your Collector to run on a subdomain of your site, for example `collector.example.com`, with the cookie domain set to `.example.com`. If you've changed the cookie name in your Collector configuration, pass that name instead.

</TabItem>
</Tabs>

If you've changed the tracker's cookie prefix with the `cookieName` option, update the `_sp_id.` and `_sp_ses.` prefixes to match. If your site runs more than one tracker with different cookie names, read the cookies that belong to the tracker whose events feed your attribute groups.

The examples in the rest of this page use `domain_userid`. To use a different identifier, swap the helper and change `attribute_key` in the Signals request.

:::note[Cookieless tracking]
If the tracker uses [anonymous tracking](/docs/events/anonymous-tracking/index.md), or stores state only in local storage, there's no cookie for the proxy to read. In that case, use a different attribute key, such as a logged-in `user_id` from your own session cookie.
:::

## Create the proxy endpoint

Store your [connection credentials](/docs/signals/connection/index.md#get-your-connection-credentials) as environment secrets in your hosting platform. The proxy only reads attributes, so use an API key with the **View** permission. The examples below call a service named `web_personalization` and return two attributes from it.

<Tabs groupId="signals-proxy" queryString>
<TabItem value="vercel" label="Vercel (Next.js)" default>

This Next.js route handler uses the [Signals Node.js SDK](/docs/signals/connection/index.md#install-the-sdk), which handles authentication and token refresh. Create the client at module scope so that warm invocations reuse the access token.

```typescript title="app/api/signals/route.ts"
import { NextRequest, NextResponse } from "next/server";
import { Signals } from "@snowplow/signals-node";
import { getDomainUserId } from "@/lib/snowplow-cookies";

const signals = new Signals({
  baseUrl: process.env.SIGNALS_API_URL!,
  apiKey: process.env.SNOWPLOW_API_KEY!,
  apiKeyId: process.env.SNOWPLOW_API_KEY_ID!,
  organizationId: process.env.SNOWPLOW_ORG_ID!,
});

const noStore = { "Cache-Control": "private, no-store" };

export async function GET(request: NextRequest) {
  const domainUserId = getDomainUserId(request.headers.get("cookie"));
  if (!domainUserId) {
    return NextResponse.json({ attributes: null }, { headers: noStore });
  }

  try {
    const values = await signals.getServiceAttributes({
      name: "web_personalization",
      attribute_key: "domain_userid",
      identifier: domainUserId,
    });

    // Return only what the front-end needs
    return NextResponse.json(
      {
        attributes: {
          page_view_count: values.page_view_count ?? null,
          viewed_pricing: values.viewed_pricing ?? null,
        },
      },
      { headers: noStore }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ attributes: null }, { status: 502, headers: noStore });
  }
}
```

</TabItem>
<TabItem value="cloudflare" label="Cloudflare Workers">

This Worker also uses the [Signals Node.js SDK](/docs/signals/connection/index.md#install-the-sdk). The SDK relies on Node.js APIs, so enable the `nodejs_compat` compatibility flag in your Wrangler configuration:

```toml title="wrangler.toml"
compatibility_date = "2025-09-01"
compatibility_flags = ["nodejs_compat"]
```

Secrets are only available inside the request handler, so the Worker creates the client on the first request and keeps it in module scope. Later requests handled by the same isolate reuse the client and its access token.

```typescript title="src/index.ts"
import { Signals } from "@snowplow/signals-node";
import { getDomainUserId } from "./snowplow-cookies";

interface Env {
  SIGNALS_API_URL: string;
  SNOWPLOW_API_KEY: string;
  SNOWPLOW_API_KEY_ID: string;
  SNOWPLOW_ORG_ID: string;
}

let signals: Signals | undefined;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "private, no-store" },
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const domainUserId = getDomainUserId(request.headers.get("Cookie"));
    if (!domainUserId) return json({ attributes: null });

    signals ??= new Signals({
      baseUrl: env.SIGNALS_API_URL,
      apiKey: env.SNOWPLOW_API_KEY,
      apiKeyId: env.SNOWPLOW_API_KEY_ID,
      organizationId: env.SNOWPLOW_ORG_ID,
    });

    try {
      const values = await signals.getServiceAttributes({
        name: "web_personalization",
        attribute_key: "domain_userid",
        identifier: domainUserId,
      });

      // Return only what the front-end needs
      return json({
        attributes: {
          page_view_count: values.page_view_count ?? null,
          viewed_pricing: values.viewed_pricing ?? null,
        },
      });
    } catch (error) {
      console.error(error);
      return json({ attributes: null }, 502);
    }
  },
};
```

Store the credentials with `wrangler secret put`, and add a [route](https://developers.cloudflare.com/workers/configuration/routing/routes/) so the Worker serves a path on your site's domain, for example `example.com/api/signals*`. A `*.workers.dev` URL won't receive your site's cookies.

</TabItem>
</Tabs>

If your runtime doesn't support Node.js APIs, call the [Signals API](/docs/signals/connection/index.md#signals-api) directly with `fetch` instead. See the Swagger documentation for your deployment, at `{{API_URL}}/docs/`, for the attribute retrieval endpoints.

## Call the endpoint from your front-end

Call the endpoint with a same-origin `fetch`. The browser includes the Snowplow cookies, so the front-end doesn't need to pass the identifier.

```javascript
async function getPersonalization() {
  const response = await fetch("/api/signals", { credentials: "same-origin" });
  if (!response.ok) return null;
  const { attributes } = await response.json();
  return attributes;
}

const attributes = await getPersonalization();

if (attributes?.viewed_pricing && attributes.page_view_count > 5) {
  document.querySelector("#demo-banner")?.removeAttribute("hidden");
}
```

Plan for missing values. On a user's first page view, the tracker might not have set the `_sp_id` cookie before your request runs, and Signals needs to process the user's events before attribute values appear. Render a sensible default, then update the page when values arrive. To refresh values as the user browses, call the endpoint again after key events, rather than polling on a tight interval.

To have Signals tell your application when a user meets a condition, instead of fetching attributes on demand, [subscribe to interventions](/docs/signals/applications/subscribe/index.md).

## Secure the endpoint

The proxy exposes attribute data on a public URL, so limit what it can return and to whom:

* Read the identifier from the cookie, not from the request: don't accept a `domain_userid` in a query string or body. If the endpoint trusts a client-supplied identifier, anyone can request attributes for other users.
* Return only the attributes the front-end uses: filter the Signals response instead of passing it through. Keep sensitive or internal attributes on the server.
* Hard-code the service name: don't let the caller choose which service or attribute group to read.
* Prevent shared caching: send `Cache-Control: private, no-store` so that a CDN or edge cache never serves one user's attributes to another.
* Keep credentials server-side: store the API key, API key ID, and organization ID as platform secrets, and never bundle them into client code.
* Rate-limit the endpoint: use your platform's rate limiting to protect your Signals deployment from excessive traffic.

Remember that cookie values, and therefore the attributes tied to them, describe a pseudonymous browser rather than an authenticated user. Don't use this endpoint to make access-control decisions.
