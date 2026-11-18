---
title: "Documentation for LLMs"
sidebar_label: "Documentation for LLMs"
sidebar_position: 6
description: "Give LLMs efficient access to the Snowplow documentation through the llms.txt index and Markdown versions of every page."
keywords: ["llms.txt", "LLMs", "Markdown", "AI-readable documentation", "AI assistants"]
date: "2026-09-28"
content_type: reference
---

The Snowplow documentation is available in formats designed for LLMs, so your AI assistant can find and read the pages it needs.

If your assistant is connected to the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md), it can also fetch documentation pages through the server's documentation tool, alongside working with your Snowplow account.

## Documentation index in `llms.txt`

This documentation follows the [`llms.txt` standard](https://llmstxt.org/), providing structured information to help an LLM use the site.

An index is available at [`llms.txt`](pathname:///llms.txt). To keep the file small, it lists the pages as a tree that follows the URL path, instead of a list of links. Each line has one path segment, the page title, and the page description, and is indented one space deeper than its parent:

```text
docs: Snowplow documentation. ...
 sources: Snowplow sources overview. ...
  web-trackers: Web tracker SDKs. ...
   tracking-events: Track data out-of-the-box with the web trackers. ...
```

To get the URL of a page, join the segments from the top of the tree down to the page's line with `/`, put `https://docs.snowplow.io/` in front, and add `.md` at the end. The last line in the example is `https://docs.snowplow.io/docs/sources/web-trackers/tracking-events.md`. The file explains this to the LLM before the tree.

Release notes have their own index at [`release-notes/llms.txt`](pathname:///release-notes/llms.txt), newest first.

An extended version is also available at [`llms-full.txt`](pathname:///llms-full.txt), that includes the complete text of the current pages. For token efficiency, sections relating to older versions of components aren't included in this file. These sections are still listed in the `llms.txt` index, labeled as `[previous version]`.

The `llms-full.txt` file is very large. It might be more effective to access individual pages as needed, using the Markdown access method described below.

### Product indexes

The root `llms.txt` has a list of smaller indexes before the page tree, one for each part of the docs. An agent working on one product can fetch only the index it needs:

| Index | Covers |
| --- | --- |
| [`/docs/cdi/llms.txt`](pathname:///docs/cdi/llms.txt) | Snowplow CDI: tracking design, trackers, pipeline, destinations, data models, and monitoring |
| [`/docs/signals/llms.txt`](pathname:///docs/signals/llms.txt) | Snowplow Signals: attributes, services, interventions, and SDKs |
| [`/docs/api-reference/llms.txt`](pathname:///docs/api-reference/llms.txt) | Reference: APIs, SDK and configuration reference, versions, and previous versions |
| [`/docs/platform/llms.txt`](pathname:///docs/platform/llms.txt) | Pages shared by both products: fundamentals, AI, account management, and policies |

Each index lists the same pages as the matching parts of the root `llms.txt`, as a list of links to the Markdown version of each page.

### Tell your agent about the indexes

Agents rarely fetch `llms.txt` unless their instructions say to. Add the snippet from [connect your coding agent](/docs/ai/index.md#connect-your-coding-agent) to your project's `AGENTS.md` or `CLAUDE.md`.

## Documentation pages as Markdown

Every documentation page is available as Markdown. To copy a page's content, use the **Copy page** button above the page title. Its menu also has **View as Markdown**, **Download Markdown**, **Open in Claude**, and **Open in ChatGPT**.

Following the `llms.txt` standard, you can access the Markdown page directly by changing the trailing `/` in the URL to `.md`. For example:

- HTML: `https://docs.snowplow.io/docs/signals/concepts/`
- Markdown: `https://docs.snowplow.io/docs/signals/concepts.md`

Let your LLM know that this format is available, so it can retrieve content efficiently.

### Tutorials as single pages

Each tutorial is also available as a single Markdown file containing all of its steps in order. Tutorials have no page of their own on the site, so these files don't follow the URL pattern above. Append `.md` to the tutorial's directory path instead:

- Tutorial step: `https://docs.snowplow.io/tutorials/signals-interventions/start/`
- Complete tutorial: `https://docs.snowplow.io/tutorials/signals-interventions.md`

The combined file opens with a list of the tutorial's steps and their URLs, followed by the content of each step. The `llms.txt` index lists these files rather than individual steps, so an LLM retrieves a whole tutorial in one request.
