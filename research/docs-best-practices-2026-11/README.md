# Documentation best practices research (November 2026)

Research into how Snowplow should structure and design its documentation for CDI and Signals. It covers documentation research and frameworks, how the AI labs (Anthropic, OpenAI, Google, Mistral, Cohere) and leading developer-tool companies build their docs, how data-infrastructure and feature-store peers handle multi-product docs, and an audit of this repository.

The combined report is `blueprint.html`. Open it in a browser. It is also published as a private artifact: https://claude.ai/artifact/H9JM7YYZJzBUb43HToRjAw

The combined report applies the corrections from the adversarial review (`09`). Where `07` or `08` disagrees with `blueprint.html`, the blueprint is the reconciled version.

| File | Contents |
|---|---|
| `01-research-frameworks-and-papers.md` | Diátaxis and its critiques, Good Docs Project, Google and Write the Docs guidance, minimalism, information foraging, API documentation studies, survey data, docs for AI agents |
| `02-research-ai-labs.md` | Anthropic, OpenAI, Gemini, Mistral and Cohere docs: navigation, home pages, code samples, agent features, visual design |
| `03-research-devtools-and-platforms.md` | Stripe, Vercel, Supabase, Cloudflare and others, plus Mintlify, Fern, Starlight and Fumadocs; Docusaurus feasibility |
| `04-research-data-infra-peers.md` | Segment, RudderStack, mParticle, Amplitude, PostHog, dbt, Snowflake, Confluent, Fivetran, Hightouch, Feast, Tecton, Hopsworks |
| `05-audit-information-architecture.md` | Current sidebar, page counts, getting-started paths, content-type mixing, duplicates, LLM readiness |
| `06-audit-visual-design.md` | Tokens, layout, components, dark mode, mobile, technical debt, with file and line references |
| `07-recommendations-structure.md` | Proposed IA, page templates, persona journeys, catalogs, migration plan |
| `08-recommendations-design.md` | Design principles, token values, layout spec, components, Docusaurus implementation plan |
| `09-adversarial-review.md` | Errors, conflicts and gaps found in `07` and `08`, with spot-checked claims |

This directory is outside `docs/` and `tutorials/`, so Docusaurus doesn't build it.
