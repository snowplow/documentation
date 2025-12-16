# Snowplow documentation style guide

## Grammar and spelling

* Use US spelling: "behavioral", "center", "organize", "modeled".
* Treat "data" as singular: "the data is captured".
* "Set up" is a verb. "Setup" is a noun or adjective. Never use "set-up".
* "Log in" is a verb. "Login" is a noun or adjective. Never use "log-in".
* Prefer "configuration" over "setup".
* Prefer "credentials" over "login".
* Spell out single-digit numbers as words: "three events" not "3 events".

## Formatting and punctuation

* Use straight double quotes ("). Never use single quotes (') or smart quotes (").
* Use the Oxford comma: "events, entities, and schemas".
* Use "and", never "&".

## Headings

* Use only H2, H3, and rarely H4. Never use smaller headings.
* H2 is for main sections. H3 is for subsections.
* Never end headings with punctuation.
* Use sentence case: "Configure how events are sent".
* Use imperative voice: "Configure the tracker" not "Tracker configuration".

## Bold, italic, and code

* Use **bold** for UI elements: buttons, page titles, tabs, menus.
* Use bold or italic to highlight key phrases. Never combine both on the same text.
* Never bold entire paragraphs.
* Use `backticks` for table names, field names, column names, class names, file names, and code references.
* If the name has underscores, use code formatting.

## Lists

* Introduce lists with a sentence ending in a colon.
* Capitalize the first word of each item.
* After a colon within a list item, continue lowercase: "Boolean: the value will be etc."
* No period at the end unless the item contains multiple sentences.

## Tables

* Capitalize the first word of cell text.
* Exception: code should use appropriate case (e.g., `true`).
* Never use bold for column headings.

## Page structure

* Precede every heading and list with at least one paragraph of prose.
* Never use page dividers (`---`).
* Never use ellipses (`...`).

## Writing style

* Use a calm, professional, encouraging tone. Contractions are fine.
* Never use marketing language: remove "effortlessly", "easily", "quickly", "best", "enhanced", "seamlessly".
* Remove filler words: "simply", "on top of that", "in order to".
* Never re-explain concepts. Link to Fundamentals pages instead.
* Use active voice: "the Collector receives events" not "events are received by the Collector".
* Always address readers as "you".
* Use "the user" for the reader's end users.
* Refer to Snowplow as "Snowplow", not "we" or "our".
* Stay in the present tense. Never use "currently", "now", "in the future", "latest", "Snowplow plans to".
* Never use exclamation marks.
* Use emojis only for information (✅ or ❌ in tables). Never use emojis for decoration.

## Diagrams and images

* Always provide alt text.
* Prefer Mermaid diagrams for architecture visuals.
* Use descriptive file names: `snowbridge-architecture.png` not `image.png`.

## Inclusive language

* Use "allowlist" and "denylist". Never use "whitelist" or "blacklist".
* Avoid gendered language. Use plural or "they".
* Use "person-hours". Never use "man-hours".

## Links

* Describe links clearly. Use the target page name where possible.
* Acceptable: `see [Tracking specific events]()` or `the schema is found [here]()`.
* Never lead with the link: `[here]() is the schema`.

## Snowplow terminology

* Use "Snowplow". Never use "Snowplow Analytics".
* Always capitalized: Data Product Studio, Snowtype, Snowplow Customer Data Infrastructure, Data Model Packs, Signals.
* Console: Capitalized, no article. "Data structures in Console."
* Collector: Capitalized, with "the". "Events hit the Collector endpoint."
* Enrich: Capitalized. "Enrich can enrich an event."
* Loaders: Capitalized, with "the". "The BigQuery Loader reads enriched events."
* Iglu, Iglu Central, Iglu Server: Capitalized. Other Iglu components are lowercase.
* Never capitalized: entities, events, schemas, data structures, data products, page view, self-describing event, source applications, failed events.
* Use "entity". Never use "context".
* Use "self-describing event". Never use "unstructured event".
* Use "failed events". Never use "bad rows" (except for legacy JSON format).
* Use "visualization". Never use "data application".
* Language capitalized, "tracker" lowercase: "JavaScript tracker", "Python tracker".
* Use "native mobile trackers" for iOS and Android together.
* Use "JavaScript tracker" for all web trackers collectively.
* Call events without schemas "baked-in events" (page views, page pings, legacy ecommerce).
* Use "version 1.3.0" or "1.3.0". Never use "v1.3.0".

## General technical terms

* Capitalize acronyms: HTTP, CDI, CLI, API, SQL, SDK, URL.
* Pluralize naturally: APIs, SDKs, URLs. Never write "JSONs"—use "JSON schemas".
* Match third-party official styling: Google, Snowflake, dbt, Kafka, npm.
* "Real-time" as adjective. "Real time" as noun.
* Always hyphenate: back-end, front-end, server-side, client-side.
* No hyphen in "ecommerce". Capitalize only for product names: "Ecommerce plugin".
* Use lowercase "web": "a web browser".

## Markdown formatting

* Use `-` or `*` for bullet points.
* Use triple backticks and specify the language for code blocks.
* Use Docusaurus admonitions sparingly. Always set custom headings.
* Use Tip for actions, Note or Info for information, Warning for data loss or security risks.
