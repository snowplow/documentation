---
title: "Set up Snowplow tracking"
position: 3
sidebar_label: "Snowplow tracking"
description: "Initialize the Snowplow Browser Tracker in your Next.js app to capture page views, page pings, and link clicks."
keywords: ["snowplow browser tracker", "page views", "activity tracking", "link clicks", "next.js tracking"]
date: "2026-04-10"
---

Snowplow Signals computes user attributes from your Snowplow behavioral event stream. This step gets that stream flowing. You don't need custom events — standard page views, page pings, and link clicks are enough to build meaningful real-time context.

Since you're building a Next.js app, you'll use the [Snowplow Browser Tracker](/docs/sources/web-trackers/quick-start-guide/) (`@snowplow/browser-tracker`), which is designed for npm-based frameworks and gives you proper imports, tree-shaking, and TypeScript support.

## Initialize the tracker

Create a module that initializes the Snowplow tracker once and exports a helper to read the session ID. This module runs client-side only.

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
    const info = tracker.getDomainUserInfo();
    return info?.[6] ?? "";
  } catch {
    return "";
  }
}
```

## Track page views on route changes

In a Next.js App Router app, client-side navigation doesn't trigger full page reloads, so you need to track page views when the route changes. Create a client component for this:

```tsx
// components/snowplow-provider.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initSnowplow, trackPage } from "@/lib/snowplow";

export function SnowplowProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Initialize tracker on mount
  useEffect(() => {
    initSnowplow();
  }, []);

  // Track page view on every route change
  useEffect(() => {
    trackPage();
  }, [pathname]);

  return <>{children}</>;
}
```

Then wrap your app with this provider in the root layout. The scaffolded `app/layout.tsx` already includes font imports, a `lang` attribute, and CSS classes — you just need to add the `SnowplowProvider` import and wrap `{children}` with it:

```tsx
// app/layout.tsx — add these two changes to your scaffolded layout:

// 1. Add this import at the top
import { SnowplowProvider } from "@/components/snowplow-provider";

// 2. Wrap {children} inside the <body> tag:
<body className={/* ...keep existing classes... */}>
  <SnowplowProvider>{children}</SnowplowProvider>
</body>
```

With this in place, every route change fires a page view event, page pings track ongoing engagement, and link clicks are captured automatically. That gives Signals a rich behavioral stream to compute attributes from.
