---
title: "Set up Snowplow tracking"
sidebar_label: "Tracking setup"
position: 3
description: "Initialize the Snowplow Browser SDK, track page views on client-side route changes, and wire the tracker into the React layout."
keywords: ["Snowplow Browser SDK", "tracker", "page views", "activity tracking", "link clicks"]
date: "2026-04-17"
---

Signals needs a behavioral event stream to work with. This step gets that stream flowing. You don't need custom events — standard page views, page pings, and link clicks are enough to build meaningful context.

The Snowplow Browser SDK (`@snowplow/browser-tracker`) handles the tracking. It also sets a cookie with a unique session ID, which is what you'll use as the lookup key when fetching attributes from Signals.

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

## Track page views on route changes

In single-page apps, client-side navigation doesn't trigger full page reloads, so you need to track page views when the route changes. Create a provider component that fires a page view on every route change:

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
The scaffold uses `usePathname` from `next/navigation` for route-change detection. In a Vite or CRA app, swap this for `useLocation` from `react-router-dom`. The Snowplow tracker itself is framework-agnostic.
:::

## Wire it into the root component

Wrap your app with the `SnowplowProvider` outside the CopilotKit provider. This is important: the Snowplow tracker must initialize first so its cookie exists before `CopilotProvider` tries to read the session ID.

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

`CopilotProvider` is a thin wrapper around `<CopilotKit>`. Create the placeholder version now so the layout compiles — you'll extend it in the next step to read the Snowplow session ID from the tracker cookie and forward it to the agent on every request (including the very first chat message).

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

With this in place, every route change fires a page view event, page pings track ongoing engagement, and link clicks are captured automatically. That gives Signals a rich behavioral stream to compute attributes from, and the agentic chat sidebar stays open throughout.
