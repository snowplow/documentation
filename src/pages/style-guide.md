# Snowplow style guide

This guide is for anyone writing for Snowplow. Please follow these rules so that all Snowplow content is consistent and easy to read.

This includes writings such as:
- technical product documentation, including the [documentation site](/docs/), public [Knowledge Base](https://support.snowplow.io/hc/en-us) articles, GitHub READMEs, dbt package documentation, etc.
- other API documentation generated from code documentation, by tools such as Swagger or API Extractor
- blog posts
- release notes
- text within the Console
- other marketing content for the [main Snowplow website](https://snowplow.io/)

Some rules, annotated with "❗️", are different depending on the purpose of the writing.

If you're using an AI tool to help you write, provide it with the link to this page and instruct it to follow this style guide.

This guide is linked from the [docs GitHub README](https://github.com/snowplow/documentation).

## Grammar and spelling

### US English
- Use US English spelling

  | ✅               | ❌                |
  | --------------- | ---------------- |
  | behavioral data | behavioural data |
  | data center     | data centre      |
  | organize        | organise         |
  | modeled         | modelled         |

- [Reference for US vs UK differences](https://radix-communications.com/uk-vs-us-english-a-fairly-comprehensive-checklist/)
- Be careful with "anonymization". We accidentally used the British spelling for some config options in our trackers (`withServerAnonymisation` in the JavaScript tracker, `serverAnonymisation` and `userAnonymisation` on mobile)
- Don't worry about US vs UK grammar rules aside from spelling

### Data
- Use "data" as singular

    | ✅                    | ❌                     |
    | -------------------- | --------------------- |
    | the data is captured | the data are captured |

### Set up and log in
- "Set up" is a verb, "setup" is a noun or adjective
  - Prefer "configuration" over "setup"
  - Avoid the hyphenated version, "set-up", because it's unclear

    | ✅   verb             | ✅         noun                             | ✅ adjective |
    | -------------------- | ------------------------------------------ | ----------- |
    | set up your tracking | your tracking implementation setup         | setup page  |
    |                      | your tracking implementation configuration |             |

- "Log in" is a verb, "login" is a noun or adjective
  - Prefer "credentials" over "login"
  - Avoid the hyphenated version, "log-in", because it's unclear

    | ✅   verb               | ✅         noun                      | ✅ adjective |
    | ---------------------- | ----------------------------------- | ----------- |
    | log in to your account | set up a login for your account     | login page  |
    |                        | set up credentials for your account |             |

## Formatting and punctuation
### Quotation marks ❗️
- Use double quotation marks (") rather than single (')

    | ✅                    | ❌                    |
    | -------------------- | -------------------- |
    | the "Filters" button | the 'Filters' button |

- For **documentation**, use straight quotes (") rather than smart ones (“)

    | ✅               | ❌               |
    | --------------- | --------------- |
    | a "spiky" value | a “spiky” value |

- For **all other writing**, smart quotes are fine as long as this is consistent within the piece of writing

    | ✅               | ✅               |
    | --------------- | --------------- |
    | a "spiky" value | a “spiky” value |

### Oxford comma
- Use a comma before the last item in a list

    | ✅                                                            | ❌                                                           |
    | ------------------------------------------------------------ | ----------------------------------------------------------- |
    | digital products, customer experiences, and fraud mitigation | digital products, customer experiences and fraud mitigation |

### Titles and headings ❗️
- Headings never finish with a full stop
- For **documentation** and **release notes**, use sentence case for titles and headings

    | ✅                               | ❌                               |
    | ------------------------------- | ------------------------------- |
    | Configuring how events are sent | Configuring How Events Are Sent |

- For the **main website** and **blog posts**, use title case

    | ✅                    | ❌                    |
    | -------------------- | -------------------- |
    | Sample Snowplow Data | Sample Snowplow data |

### List punctuation
- For bullet points and numbered lists, don't put a full stop at the end of the sentence
- Exception: list items that have multiple sentences within them should have full stops at the end
- Lists should be consistent - either single sentence (no full stop) or multiple sentences (with full stop)

### Ampersands
- Use "and" rather than "&"
- This is partly for consistency and aesthetic reasons, but also helps with screen reader accessibility

    | ✅                                | ❌                              |
    | -------------------------------- | ------------------------------ |
    | version and amend                | version & amend                |
    | User and Marketing Analytics app | User & Marketing Analytics app |

## Writing style
### Tone ❗️
- For **documentation**, **release notes**, and the **main website**, use a calm, conversational, professional tone
  - Contractions such as "don't" are fine
- For **blog posts**, a more casual and friendly tone is welcome

### Brevity
- Explain the point as simply as possible, without any extra words or phrases that don't add meaningful information

    | ❌              |
    | -------------- |
    | simply         |
    | on top of that |
    | quickly        |

- Link to existing pages, such as those in the [Fundamentals](/docs/fundamentals/) docs section, rather than explaining concepts again

### Voice
- Use active rather than passive voice

    | ✅                             | ❌                                    |
    | ----------------------------- | ------------------------------------ |
    | the Collector receives events | events are received by the Collector |

    - Exception: use passive voice if it makes for better writing

    | ✅                                                                                | ❌                                                                       |
    | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
    | Set up your tracking and send events. These events are received by the Collector | Set up your tracking and send events. The Collector receives the events |

### Pronouns ❗️
- Refer to the reader directly as "you" (second-person pronoun) where possible

    | ✅                                   | ❌                                         |
    | ----------------------------------- | ----------------------------------------- |
    | you can find your organization's ID | the user can find their organization's ID |

- Use "the user" to refer to users of the reader's products - the people who are generating the data

    | ✅                                                  |
    | -------------------------------------------------- |
    | you can track information about the user's browser |

- For **documentation**, primarily refer to Snowplow as "Snowplow"
  -  Exception: use "our", "we", "us" (first-person pronouns) if it makes for a better sentence

    | ✅                                            | ❌                                       |
    | -------------------------------------------- | --------------------------------------- |
    | Snowplow supports two types of Iglu registry | we support two types of Iglu registry   |
    | Snowplow provides                            | we provide                              |
    | but you can also build your own              | but we also encourage building your own |
    | use the Snowplow trackers                    | use our trackers                        |
    | because we discard stray pings               | because Snowplow discards stray pings   |

- For **release notes**, **blog posts**, and the **main website**, using first-person pronouns as well as "Snowplow" is fine

    | ✅                          |
    | -------------------------- |
    | we are pleased to announce |
    | we have fixed a bug        |
    | the Snowplow trackers      |

### Timelessness ❗️
- For all **documentation** except for **migration guides**, stay within the current moment in time
    - We won't remember to come back and update it
    - The documentation is not an appropriate place to announce upcoming features

    | ❌                 |
    | ----------------- |
    | currently         |
    | in the future     |
    | you can now       |
    | Snowplow plans to |

- For **migration guides** and **release notes**, it's fine to compare to the past, or make reference to already-announced upcoming features
  - Referring to previous functionality is the point of migration guides, after all

    | ✅                        |
    | ------------------------ |
    | the tracker now supports |
    | will be coming soon      |
    | currently                |

### Exclamation marks ❗️
- For **documentation** and **release notes**, avoid exclamation marks

    | ✅                           | ❌                           |
    | --------------------------- | --------------------------- |
    | That's it for installation. | That's it for installation! |

- For **other writing**, occasional exclamation marks are fine
  - They can help maintain a friendly, casual tone

    | ✅                                                    |
    | ---------------------------------------------------- |
    | keep your data AI-ready from collection to delivery! |

### Emojis ❗️
- For most **documentation**, emojis can be used sparingly, to provide information
  - Emojis must not be used for decoration

    | ✅                    | ❌                                    |
    | -------------------- | ------------------------------------ |
    | ✅ Geolocation entity | 🏔️ “Glass-box” technical architecture |


- For **release notes** and **API documentation**, no emojis at all

- For **blog posts** and the **main website**, occasional emojis are fine
  - They can help maintain a friendly, casual tone

    | ✅                                              |
    | ---------------------------------------------- |
    | 🎉 Reduce your data loading costs by up to 80%. |

### Diagrams and images
- Adding diagrams and images is encouraged
- Diagrams and images should have white backgrounds
- For images, use `.webp` or `.png` format
- For **documentation** diagrams, [Mermaid](http://mermaid.js.org/#/) code is recommended as they adjust automatically

## Inclusive language
### Allowlist and denylist
- Use allowlist and denylist instead of the older white/blacklist terminology

    | ✅                         | ❌                         |
    | ------------------------- | ------------------------- |
    | allowed form elements     | whitelisted form elements |
    | allowlisted form elements | whitelisted form elements |

### Gendered language
- Avoid gendered language
- Use plural, or the gender-neutral "they" third-person pronoun

  | ✅                  | ❌                   |
  | ------------------ | ------------------- |
  | users will need to | he will need to     |
  | they will need to  | he/she will need to |
  | five person-hours  | five man-hours      |

## General technical terms
### Acronyms
- Acronyms should be in capitals

    | ✅    |
    | ---- |
    | HTTP |
    | CDI  |
    | CLI  |
    | API  |
    | SQL  |
    | SDK  |
    | URL  |

- Some can be pluralized with an "s", but not all

  | ✅            | ❌     |
  | ------------ | ----- |
  | JSON         | JSONs |
  | JSON schemas | JSONs |
  | APIs         |       |
  | SDKs         |       |
  | URLs         |       |

- For the **documentation** website, we have a docs plugin that adds a dotted line and a tooltip explanation to acronyms, e.g. hovering over "BDP" will show that it stands for "Behavioral Data Platform": add new acronym definitions to the `src/remark/abbreviations.js` file to enable this behavior
- (Technically, these are all initialisms, not acronyms)

### Capitalization
- Third-party products should be capitalized as appropriate

    | ✅         |
    | --------- |
    | Google    |
    | Snowflake |
    | dbt       |
    | Kafka     |
    | npm       |

- Don't use capitalization to highlight things

  | ✅                            | ❌                            |
  | ---------------------------- | ---------------------------- |
  | using machine learning       | using Machine Learning       |
  | due to an enrichment failure | due to an Enrichment Failure |

- Use lower case for "web"

  | ✅             | ❌             |
  | ------------- | ------------- |
  | a web browser | a Web browser |

### Hyphenation
- "Real-time" is hyphenated if it's used as an adjective
  - It's two separate words if it's being used as a noun

    | ✅   adjective                       | ✅         noun              |
    | ----------------------------------- | --------------------------- |
    | data available in real-time streams | data available in real time |

- "Back-end" and "front-end" are hyphenated
  - Strictly speaking, they should only be hyphenated if they're used as adjectives, and two separate words when used as nouns
  - We are going for consistency instead of being entirely grammatically correct here

    | ✅   adjective        | ✅         noun           |
    | -------------------- | ------------------------ |
    | front-end developers | working on the front-end |
    | back-end tracking    | a storage back-end       |

- "Server-side" and "client-side" are hyphenated

    | ✅                                     | ❌                                     |
    | ------------------------------------- | ------------------------------------- |
    | ingestion from server-side            | ingestion from server side            |
    | Google Tag Manager Server-side        | Google Tag Manager Server Side        |
    | enable client-side anonymous tracking | enable client side anonymous tracking |

- Use "ecommerce" without hyphen or capitalization (similar to "email")
    - Exception: you're referring to a specific Snowplow product or feature, in which case it should be capitalized

    | ✅                        | ❌                        |
    | ------------------------ | ------------------------ |
    | track ecommerce events   | track e-commerce events  |
    | the Ecommerce plugin     | the E-commerce plugin    |
    | the Ecommerce data model | the ecommerce data model |

## Product-specific terms

### Snowplow
- Snowplow is called Snowplow, not Snowplow Analytics
- Most products can have "Snowplow" appended to their name if it helps clarify what's being referred to

  | ✅                               |
  | ------------------------------- |
  | the Snowplow JavaScript tracker |
  | the Snowplow Collector endpoint |
  | the Snowplow dbt data models    |

### Capitalization
- A few products/concepts always have capital letters

    | ✅                                     |
    | ------------------------------------- |
    | Data Product Studio                   |
    | Snowtype                              |
    | Snowplow Customer Data Infrastructure |

- Most products or features should not have capital letters when being used in a sentence

   | ✅                                              | ❌                                              |
   | ---------------------------------------------- | ---------------------------------------------- |
   | track a page view                              | track a Page View                              |
   | creating data products                         | creating Data Products                         |
   | all the source applications                    | all the Source Applications                    |
   | Unified Digital data model                     | Unified Digital Data Model                     |
   | stream that contains all of your failed events | stream that contains all of your Failed Events |
   | custom self-describing event                   | custom Self-describing event                   |
   | Attribution Modeling data app                  | Attribution Modeling Data App                  |
   | Snowplow tag template                          | Snowplow Tag Template                          |

- Product names should be in normal text, not code markup

   | ✅            | ❌              |
   | ------------ | -------------- |
   | Snowplow CLI | `snowplow-cli` |

### Deprecated terminology
- Use "entity", not "context"
    - It's unavoidable to use "context" when referring to some table columns or APIs, but use the correct nomenclature around them anyway
    - Link to the Fundamentals [page about entities](https://docs.snowplow.io/docs/fundamentals/entities/) if it feels unclear

   | ✅                                                | ❌                                                |
   | ------------------------------------------------ | ------------------------------------------------ |
   | these entities provide some context to the event | these contexts provide some context to the event |
   | all versions of the entity                       | all versions of the context                      |
   | pass a list of entities using the `context` key  | pass a list of contexts using the `context` key  |
   | the derived entities                             | the derived contexts                             |

- Use "self-describing event", not "unstructured event"
- Use "failed events", not "bad rows"
  - Exception: if specifically referring to the legacy bad row JSON format and associated tooling

### Pipeline components
- Console is capitalized, and gets a definite article ("the")

   | ✅                              | ❌                              |
   | ------------------------------ | ------------------------------ |
   | data structures in the Console | data structures in the console |
   |                                | data structures in Console     |

- Collector is capitalized, and gets a definite article ("the")
    - Use "the Collector endpoint" where possible for clarity - the reader might not know what we mean by "Collector", but they probably know what an endpoint is

    | ✅                                    |
    | ------------------------------------ |
    | events hit the Collector             |
    | events hit the Collector application |
    | events hit the Collector endpoint    |

- Enrich is capitalized, but doesn't always get a definite article ("the")

    | ✅                                                |
    | ------------------------------------------------ |
    | enabled by default within the Enrich application |
    | enabled by default within Enrich                 |
    | Enrich can enrich an event                       |

- All the Loaders are capitalized, and get a definite article ("the")

   | ✅                                         | ❌                                     |
   | ----------------------------------------- | ------------------------------------- |
   | the Lake Loader on AWS                    | the lake loader on AWS                |
   | the BigQuery Loader reads enriched events | BigQuery loader reads enriched events |

- Iglu is capitalized, as are Iglu Central and Iglu Server, but not any other Iglu components

   | ✅                                                   | ❌                                                   |
   | --------------------------------------------------- | --------------------------------------------------- |
   | an Iglu client resolving a schema from Iglu Central | an Iglu Client resolving a schema from Iglu Central |
   | setting up an instance of the Iglu Server           | setting up an instance of the Iglu server           |
   | the Iglu webhook adapter                            | the Iglu Webhook adapter                            |

### Trackers
- The trackers have the specific language capitalized, followed by lowercase "tracker"
- Refer to the iOS and Android trackers together as the "native mobile" trackers (no capitalization)

   | ✅                           | ❌                           |
   | --------------------------- | --------------------------- |
   | the Java tracker            | the Java Tracker            |
   | the Snowplow Python tracker | the Snowplow Python Tracker |
   | the native mobile trackers  | the mobile native trackers  |

- Use "JavaScript tracker" to refer to the web trackers collectively - the one loaded via tags and the one installed using npm (a.k.a. browser tracker)
    - This doesn't apply within the docs pages for the web trackers themselves

   | ✅                                              | ❌                                        |
   | ---------------------------------------------- | ---------------------------------------- |
   | track a page view using the JavaScript tracker | track a page view using the web trackers |

### Data applications
- The name of the app is capitalized, followed by lowercase "data application" or "data app"
- Just "applications"/"apps" is fine as long as it's clear what's meant, and no other types of app are being referred to within the writing

   | ✅                                  | ❌                                  |
   | ---------------------------------- | ---------------------------------- |
   | Video and Media Analytics data app | Video and Media Analytics Data App |
   | ready-made applications            | ready-made data applications       |
   | Funnel Builder app                 | Funnel Builder App                 |

### Events without schemas
- Use "baked-in events" for events that don't have a schema
- Specifically, these are page views, page pings, and the legacy ecommerce transaction events
- We've previously referred to them as primitive, canonical, or standard events

    | ✅                                            |
    | -------------------------------------------- |
    | baked-in events aren't described by a schema |

## Accessibility
### Images
- Images should have alt text provided
- Save the image using a useful file name
- [Guidelines for writing alt text](https://accessibility.huit.harvard.edu/describe-content-images)

   | ✅                                                                                                          | ❌                                       |
   | ---------------------------------------------------------------------------------------------------------- | --------------------------------------- |
   | `![screenshot of the Template Editor showing how to modify permissions](images/modifying_permissions.png)` | `![](images/modifying_permissions.png)` |
   | `snowbridge-architecture.png`                                                                              | `image.png`                             |

### Links
- Links should be clearly described, either by the preceding text or the link itself
- Use the name of the page you're linking to where possible
- [Guidelines for writing link text](https://developers.google.com/style/link-text)

   | ✅                                                        | ❌                                         |
   | -------------------------------------------------------- | ----------------------------------------- |
   | `for more information, see [Tracking specific events]()` | `for more information, see [this page]()` |
   | `the schema for this event is found [here]()`            | `[here]() is the schema for this event`   |


## Markdown formatting
The rules in this section apply only to the main D**documentation** site.

### Headings
- Use only heading levels 1, 2 and 3
- The title of the page should have header level 1 (#)
- Subheadings should be H2 (##), with any sections under that as H3 (###)
- Do not use smaller headings as they look confusingly like normal text, and aren't included in the table of contents

### Admonitions
- Highlight blocks of text using the built-in [Docusaurus admonitions](https://docusaurus.io/docs/markdown-features/admonitions) feature
- Use admonitions sparingly; having multiple within one page is overwhelming
- Set a custom heading where possible

   | ✅                            | ❌         |
   | ---------------------------- | --------- |
   | `:::info Function signature` | `:::info` |

- Use "Tip" blocks to encourage readers to take action

    | ✅                                                                                                                                |
    | -------------------------------------------------------------------------------------------------------------------------------- |
    | :::tip Avoiding duplicate column names<br></br>Make sure you include a prefix value to avoid duplicate column names.<br></br>::: |

- Use "Note" or "Info" blocks to highlight information that doesn't necessarily require action, such as that about a newer version being available, how a specific component works, or what versions are supported
- The "Warning" and "Danger" blocks are reserved for information about potential data loss or permissions breaches

### Bold and italic
- Highlight specific key words or phrases using bold (`**`, preferred) or italic (`_`)
- Choose bold _or_ italic, don't combine them for the same words, or within the same sentence
- Don't use bold or italic for components such as buttons or page titles (use quotation marks instead), or entire paragraphs

   | ✅                                                    | ❌                                                      |
   | ---------------------------------------------------- | ------------------------------------------------------ |
   | events are **automatically tracked** once configured | **events** are _automatically tracked_ once configured |
   | click on the "Add action" button                     | click on the _**Add action**_ button                   |

### Code
- Use inline code (single backticks, <code>`</code>) for field names, classes, file names, etc.

    | ✅                             |
    | ----------------------------- |
    | a single `geo_location` field |
    | a `event_id` UUID string      |
    | tracking a `ScreenView` event |

- Use code blocks (triple backticks, <code>```</code>) for code examples
  - Specify the language next to the opening backticks, so that the code block is rendered correctly

    | ✅                                                          |
    | ---------------------------------------------------------- |
    | \`\`\`json<br></br>{"accessToken":"string"}<br></br>\`\`\` |
