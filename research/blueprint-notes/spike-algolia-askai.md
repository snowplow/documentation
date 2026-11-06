# Spike: Algolia Ask AI

Question from the blueprint: can we add Ask AI to the search modal, and what does it cost?

## What it is

Ask AI is a conversational mode in the DocSearch v4 modal. The reader asks a question, and an assistant answers from our Algolia index with links to the source pages. Docusaurus 3.9+ supports it through `themeConfig.algolia.askAi`.

## What we have

* Docusaurus 3.10.1 and `@docsearch/react` 4.6.2, so the client side is supported.
* Our swizzled `src/theme/SearchBar` was an old copy of upstream from before Ask AI, which would have blocked the feature. Phase 0 deleted it, so the stock component, which includes the Ask AI toggle, now renders.
* An existing Algolia app (`9HS3C2MKTH`) and index (`snowplow`), with Insights enabled.

## Requirements

* **An assistant ID.** Create an assistant in the Algolia dashboard (Agent Studio, or the Ask AI page for DocSearch), connected to the `snowplow` index. Then set:

  ```ts
  algolia: {
    appId: '9HS3C2MKTH',
    apiKey: '…',
    indexName: 'snowplow',
    askAi: { assistantId: '…', suggestedQuestions: true },
  }
  ```

* **An LLM provider key.** Ask AI is bring your own model: the assistant calls an LLM provider with our key, and we pay that provider for tokens.
* **Domain allowlist.** Ask AI only runs on domains listed in the dashboard. Add `docs.snowplow.io` and any preview domains.

## Cost

* Algolia doesn't charge separately for Ask AI. Each conversation makes search requests that count against our Algolia plan's search quota.
* The LLM cost is ours, per token, at the provider's price. A rough planning number is one to three model calls per question, each with a few thousand tokens of retrieved docs.
* Algolia doesn't publish a price list for Ask AI by plan. Confirm with our Algolia account contact whether our current plan includes Ask AI, and how its request quota applies.

## Recommendation

1. Ask the Algolia account owner which plan we're on and whether Ask AI is enabled for it.
2. Create the assistant against a copy of the index and test it on a preview build with `suggestedQuestions` on.
3. Track usage before rollout: Ask AI conversations are separate from search Insights, so add them to the search event described in `usage-baselines.md`.

## Not done locally

Needs dashboard access to the Algolia app and an LLM provider key. No config change is in this branch, because an `askAi` block without a valid assistant ID breaks the search modal.

## Sources

* Docusaurus search docs: https://docusaurus.io/docs/search
* DocSearch v4 API reference: https://docsearch.algolia.com/docs/v4/api
* Algolia Ask AI guide: https://www.algolia.com/doc/guides/algolia-ai/askai
* Algolia support, "Is Ask AI free": https://support.algolia.com/hc/en-us/articles/38478303035665-Is-Ask-AI-free
