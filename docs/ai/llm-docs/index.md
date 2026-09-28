---
title: "Documentation for LLMs"
sidebar_label: "Documentation for LLMs"
sidebar_position: 6
description: "Give LLMs efficient access to the Snowplow documentation through the llms.txt index and Markdown versions of every page."
keywords: ["llms.txt", "LLMs", "Markdown", "AI-readable documentation", "AI assistants"]
date: "2026-09-28"
---

The Snowplow documentation is available in formats designed for LLMs, so your AI assistant can find and read the pages it needs.

## Documentation index in `llms.txt`

This documentation follows the [`llms.txt` standard](https://llmstxt.org/), providing structured information to help an LLM use the site.

An index is available at [`llms.txt`](pathname:///llms.txt).

An extended version is also available at [`llms-full.txt`](pathname:///llms-full.txt), that includes the complete text of the current pages. For token efficiency, sections relating to older versions of components aren't included in this file. These sections are still listed in the `llms.txt` index, labeled as `[previous version]`.

The `llms-full.txt` file is very large. It might be more effective to access individual pages as needed, using the Markdown access method described below.

## Documentation pages as Markdown

Every documentation page is available as Markdown. To download a page's content, use the **Download** or **Copy Markdown** buttons above the page title.

Following the `llms.txt` standard, you can access the Markdown page directly by changing the trailing `/` in the URL to `.md`. For example:

- HTML: `https://docs.snowplow.io/docs/signals/concepts/`
- Markdown: `https://docs.snowplow.io/docs/signals/concepts.md`

Let your LLM know that this format is available, so it can retrieve content efficiently.

### Tutorials as single pages

Each tutorial is also available as a single Markdown file containing all of its steps in order. Tutorials have no page of their own on the site, so these files don't follow the URL pattern above. Append `.md` to the tutorial's directory path instead:

- Tutorial step: `https://docs.snowplow.io/tutorials/signals-quickstart/start/`
- Complete tutorial: `https://docs.snowplow.io/tutorials/signals-quickstart.md`

The combined file opens with a list of the tutorial's steps and their URLs, followed by the content of each step. The `llms.txt` index links to these files rather than to individual steps, so an LLM retrieves a whole tutorial in one request.
