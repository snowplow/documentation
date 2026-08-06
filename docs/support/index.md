---
title: "Support"
sidebar_position: 101
sidebar_label: "Support"
description: "Get support through the Snowplow Knowledge Base, community forum, or support ticketing portal."
keywords: ["support", "help center", "knowledge base", "community forum", "support ticket"]
date: "2026-08-06"
---

import { CardGrid, LinkCard } from '@site/src/components/CardGrid'
import Link from '@docusaurus/Link'

Choose the right Snowplow support channel for your needs.

<CardGrid cols={3}>
  <LinkCard
    title="Knowledge Base"
    description="Browse Snowplow help articles and documentation for common questions."
    href="https://support.snowplow.io/hc/en-us"
    centered
  />
  <LinkCard
    title="Community"
    description="Join the Snowplow community forum to discuss ideas and ask questions."
    href="https://support.snowplow.io/hc/en-us/community/topics"
    centered
  />
  <LinkCard
    title="Submit a ticket"
    description="Open a support ticket for account, product, or implementation help."
    href="https://snplow.atlassian.net/servicedesk/customer/portals"
    centered
  />
</CardGrid>

<div className="margin-top--lg text--center">
  <Link to="/docs/" className="button button--secondary">Browse documentation</Link>
</div>
