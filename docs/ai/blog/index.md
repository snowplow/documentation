---
title: "AI Blog"
sidebar_label: "Blog"
sidebar_position: 4
description: "Updates, announcements, and articles about AI work in Snowplow." 
date: "2026-06-22"
---

import { CardGrid } from '@site/src/components/CardGrid'
import { BlogPostCard } from '@site/src/components/blog/BlogPostCard'
import { Laptop } from 'lucide-react'

A running feed of Snowplow's thinking on AI agents, behavioral data, and where the two intersect. We'll add to this page as our product and the industry evolve.

<CardGrid cols={2}>
  <BlogPostCard
    title="Introducing Agent Self-Tracking"
    category="Agentic AI"
    author="Jordan Peck"
    date="Apr 28, 2026"
    href="https://snowplow.io/blog/introducing-agent-self-tracking"
    icon={<Laptop size={64} strokeWidth={1.5} />}
  />
  <BlogPostCard
    title="Not All AI Agents Are the Same"
    category="Agentic AI"
    author="Jordan Peck"
    date="Apr 2, 2026"
    href="https://snowplow.io/blog/not-all-ai-agents-are-the-same"
    icon={<Laptop size={64} strokeWidth={1.5} />}
  />
</CardGrid>
