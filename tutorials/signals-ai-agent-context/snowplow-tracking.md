---
title: "Implement Snowplow tracking in the Next.js app"
position: 3
sidebar_label: "Implement Snowplow tracking"
description: "Initialize the Snowplow Browser tracker in your Next.js app to capture page views, page pings, and link clicks."
keywords: ["snowplow browser tracker", "page views", "activity tracking", "link clicks", "next.js tracking"]
date: "2026-04-10"
---

[Snowplow Signals](/docs/signals/get-started/) computes user attributes from your Snowplow behavioral event stream. Follow these steps to create events to work with.

Signals doesn't need custom events: standard [page views](/docs/sources/web-trackers/tracking-events/page-views/), [page pings](/docs/sources/web-trackers/tracking-events/activity-page-pings/), and [link clicks](/docs/sources/web-trackers/tracking-events/link-click/) are enough to build meaningful real-time context.

Since you're building a Next.js app, you'll use the [Snowplow Browser tracker](/docs/sources/web-trackers/), which is designed for npm-based frameworks.

## Initialize the tracker

Create a module that initializes the Snowplow tracker once, and exports a helper to read the session ID. This module runs client-side only.

```tsx
// lib/snowplow.ts
import {
  newTracker,
  trackPageView,
  enableActivityTracking,
  type BrowserTracker,
} from "@snowplow/browser-tracker";
import {
  LinkClickTrackingPlugin,
  enableLinkClickTracking,
} from "@snowplow/browser-plugin-link-click-tracking";

let tracker: BrowserTracker | null = null;

export function initSnowplow() {
  if (tracker || typeof window === "undefined") return;

  tracker = newTracker("sp", process.env.NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL!, {
    appId: "signals-agent",
    plugins: [LinkClickTrackingPlugin()],
  }) ?? null;

  enableActivityTracking({
    minimumVisitLength: 30,
    heartbeatDelay: 10,
  });

  enableLinkClickTracking({ pseudoClicks: true });
}

export function trackPage() {
  trackPageView();
}

export function getDomainSessionId(): string {
  if (!tracker) return "";
  try {
    // getDomainUserInfo() returns the _sp_id cookie as an array.
    // Index [6] is the domain_sessionid.
    const cookieValues = tracker.getDomainUserInfo();
    return cookieValues?.[6] ?? "";
  } catch {
    return "";
  }
}
```

The [session ID](/docs/events/identifiers/#session-identifiers) is stored in the [`_sp_id` cookie](/docs/sources/web-trackers/cookies-and-local-storage/), which the [`getDomainUserInfo()` method](/docs/sources/web-trackers/cookies-and-local-storage/getting-cookie-values/) reads. You'll use this value later to fetch the current user's Signals attributes.

## Track page views on route changes

In a Next.js App Router app, client-side navigation doesn't trigger full page reloads.

Create a client component to track page views when the route changes:

```tsx
// components/snowplow-tracker.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initSnowplow, trackPage } from "@/lib/snowplow";

export function SnowplowTracker() {
  const pathname = usePathname();

  useEffect(() => {
    initSnowplow();
  }, []);

  useEffect(() => {
    trackPage();
  }, [pathname]);

  return null;
}
```

The scaffolded `app/layout.tsx` already includes font imports, a `lang` attribute, and CSS classes. Add the `SnowplowTracker` import and place it as alongside `{children}`:

```tsx
// app/layout.tsx — add these two changes to your scaffolded layout:

// 1. Add this import at the top
import { SnowplowTracker } from "@/components/snowplow-tracker";

// 2. Add SnowplowTracker inside the <body> tag:
<body className={/* ...keep existing classes... */}>
  <SnowplowTracker />
  {children}
</body>
```

With this in place, every route change fires a page view event, page pings track ongoing engagement, and link clicks are captured automatically. That gives Signals a rich behavioral event stream to compute attributes from.
