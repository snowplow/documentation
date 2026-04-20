---
title: "Set up Snowplow tracking"
sidebar_label: "Set up Snowplow tracking"
position: 3
description: "Initialize the Snowplow Browser tracker, track page views on client-side route changes, and wire the tracker into the React layout."
keywords: ["Snowplow Browser SDK", "tracker", "page views", "activity tracking", "link clicks"]
date: "2026-04-17"
---

[Snowplow Signals](/docs/signals/get-started/) computes user attributes from your Snowplow behavioral event stream. Follow these steps to create events to work with.

Signals doesn't need custom events: standard [page views](/docs/sources/web-trackers/tracking-events/page-views/), [page pings](/docs/sources/web-trackers/tracking-events/activity-page-pings/), and [link clicks](/docs/sources/web-trackers/tracking-events/link-click/) are enough to build meaningful real-time context.

Since you're building a Next.js app, you'll use the [Snowplow Browser tracker](/docs/sources/web-trackers/), which is designed for npm-based frameworks.

## Initialize the tracker

Create a module that initializes the tracker once and exports a helper to read the session ID. This module runs client-side only.

```tsx
// src/lib/snowplow.ts
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

  const collectorUrl = process.env.NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL;
  if (!collectorUrl) return;

  tracker =
    newTracker("sp", collectorUrl, {
      appId: "signals-adk-agent",
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

The [session ID](/docs/events/identifiers/#session-identifiers) is stored in the [`_sp_id` cookie](/docs/sources/web-trackers/cookies-and-local-storage/), which the [`getDomainUserInfo()` method](/docs/sources/web-trackers/cookies-and-local-storage/getting-cookie-values/) reads. You'll use this value later to fetch the current user's Signals attributes.

## Track page views on route changes

In a Next.js App Router app, client-side navigation doesn't trigger full page reloads.

Create a client component to track page views when the route changes:

```tsx
// src/components/snowplow-provider.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initSnowplow, trackPage } from "@/lib/snowplow";

export function SnowplowProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initSnowplow();
  }, []);

  useEffect(() => {
    trackPage();
  }, [pathname]);

  return <>{children}</>;
}
```

:::note[Using a different framework?]
The scaffold uses `usePathname` from `next/navigation` for route-change detection. In a Vite application, swap this for `useLocation` from `react-router-dom`. The Snowplow tracker itself is framework-agnostic.
:::

## Add to the root layout

Wrap your app with the `SnowplowProvider` outside the CopilotKit provider. The Snowplow tracker must initialize first so its cookie exists before `CopilotProvider` tries to read the session ID.

```tsx
// src/app/layout.tsx — modify the scaffolded root component:
import type { Metadata } from "next";
import { SnowplowProvider } from "@/components/snowplow-provider";
import { CopilotProvider } from "@/components/copilot-provider";
import { ChatShell } from "@/components/chat-shell";
import "./globals.css";
import "@copilotkit/react-ui/styles.css";

export const metadata: Metadata = {
  title: "Signals ADK Agent",
  description: "Real-time user context for AI agents with Snowplow Signals",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={"antialiased"}>
        <SnowplowProvider>
          <CopilotProvider>
            <ChatShell>{children}</ChatShell>
          </CopilotProvider>
        </SnowplowProvider>
      </body>
    </html>
  );
}
```

`CopilotProvider` is a thin wrapper around `<CopilotKit>`. Create the placeholder version now so the layout compiles. You'll extend it in the next step to read the Snowplow session ID from the tracker cookie.

```tsx
// src/components/copilot-provider.tsx
"use client";

import { CopilotKit } from "@copilotkit/react-core";

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="my_agent">
      {children}
    </CopilotKit>
  );
}
```

`ChatShell` mounts the CopilotKit sidebar at the layout level so the chat persists across route changes.

```tsx
// src/components/chat-shell.tsx
"use client";

import { CopilotSidebar } from "@copilotkit/react-ui";

export function ChatShell({ children }: { children: React.ReactNode }) {
  return (
    <CopilotSidebar
      clickOutsideToClose={false}
      defaultOpen={true}
      labels={{
        title: "Signal Shop Assistant",
        initial:
          "Hi! I'm your Signal Shop assistant. Browse around the store and I'll personalize my help based on what you're interested in.",
      }}
    >
      {children}
    </CopilotSidebar>
  );
}
```

With this in place, every route change fires a page view event, page pings track ongoing engagement, and link clicks are captured automatically. That gives Signals a rich behavioral event stream to compute attributes from.
