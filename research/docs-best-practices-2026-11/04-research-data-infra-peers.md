# Documentation patterns at CDI, CDP, and feature-store vendors, and what applies to Snowplow CDI and Signals

All findings come from pages fetched on 2026-11-05. The last section lists the pages I couldn't fetch. Where a fetch returned only part of a page, the claim says so.

## 1. How each vendor splits multiple products

| Vendor | How the products are split | Source |
|---|---|---|
| **RudderStack** | The sidebar follows the data lifecycle: Get Started → AI Features → **Collect** (Sources, Destinations, Transformations, Event Spec) → **Unify** (Profiles) → **Activate** (Audiences, Models, Lookout) → **Govern** → **Monitor** → Developer Hub (CLI, API Guides) → Dashboard Guides → Archive. Release Notes sit in the top nav. | https://www.rudderstack.com/docs/ |
| **Segment (Twilio)** | The landing page has Quickstarts, then "Connect your app" (5 SDK links plus a catalog link), then "Learn more", split into *Getting data in* (Spec, Common fields, Semantic events) and *Features* (Connections, Engage, Protocols, Privacy). The landing page doesn't mention Unify. The Spec is a top-level concept that both collection and destinations depend on. | https://www.twilio.com/docs/segment |
| **mParticle** | The top nav is split by content type: **Guides** (concepts and tasks), **Developers** (SDKs and APIs), **Integrations** (catalog), and Changelog (external). Other products sit on separate hosts: Analytics on the help center, and Cortex on vidora.com. The getting-started path is 3 steps: Collect → Validate → Connect. | https://docs.mparticle.com/ |
| **Amplitude** | Each product has its own section (Analytics, Session Replay, Web Experiment, Feature Experiment, Guides and Surveys, Heatmaps, and so on). There are **4 role-based quickstarts** for engineers, product teams, growth teams, and data teams. | https://amplitude.com/docs |
| **Hightouch** | Products are grouped into **Marketing** (Customer Studio, Agents, AI Decisioning, and so on) and **Data platform** (Models, Syncs, Events, Real-Time Personalization, Identity Resolution). A role table gives the order to read in: admins → data teams → marketers. | https://docs.hightouch.com/ |
| **Fivetran (now hosting Census)** | After the acquisition, Census became an "Activations" section inside Fivetran docs, with its own Overview, Glossary, Sources, Destinations, REST API, and Release Notes. The fetched page shows a broken link: the body points to `/docs/getting-started/faq/census-migration-faq` but the nav points to `/docs/activations/census-migration-faq`. | https://fivetran.com/docs/activations |
| **Databricks** | The landing page groups content into Try, Explore (by product area), and Manage (Admin, Security, Unity Catalog). Top nav: Get started, Guides, Develop, Reference, Resources, Release notes. | https://docs.databricks.com/aws/en/ |
| **Snowflake** | Top tabs follow content types: Get started, Guides, Developer, Reference, Release notes, Tutorials. | https://docs.snowflake.com/ |
| **dbt** | Top tabs are Docs, Guides, APIs, Help, and Community. Reference and Best practices sit in the Docs dropdown. The sidebar runs About → Get started → **AI and dbt** → Build and develop → Deploy and explore → Compute → Release information. | https://docs.getdbt.com/docs/introduction |
| **Anthropic** | The home page has a hero with one code sample in 9 languages (Python, TS, Go, Java, Ruby, PHP, C#, cURL, CLI). A "Choose how you build" section has one card per developer surface (Messages, Managed Agents), and each card has three links: Quickstart, API reference, SDKs. A "Developer journey" section uses tabs per surface, each with 4 lifecycle steps: Get started → Build → Evaluate and ship → Operate. | https://platform.claude.com/docs/en/home |
| **Snowplow (today)** | The home page has two hero cards (CDI, Signals). Six CDI cards follow: Fundamentals, Event collection, Destinations, Trackers, Pipeline, Data modeling. Signals appears only in the hero and isn't one of the product cards. | https://docs.snowplow.io/docs/ |

**Patterns that apply to Snowplow:**
- **One card per product, each with the same three links (Anthropic).** For Snowplow, the CDI card would link Quickstart, Tracker/API reference, and SDKs. The Signals card would link Quickstart, Signals API/SDK reference, and Define attributes. This puts the two products on equal footing; today Signals is a hero card off to the side.
- **A lifecycle journey with one tab per product (Anthropic).** Snowplow CDI maps onto Collect → Validate → Load → Model. Signals maps onto Define attributes → Compute → Serve → Intervene.
- **Sidebar sections named by verb (RudderStack Collect/Unify/Activate/Govern/Monitor).** Snowplow's natural stages are Collect (trackers), Validate (schemas, failed events), Enrich, Load (destinations), Model (dbt), and Activate (Signals, forwarding). This avoids sections named after internal components. Snowplow's current "Pipeline" card lists Collector and Enrichments, which are component names.
- **Role-based quickstarts (Amplitude, Hightouch).** Snowplow serves distinct roles: app engineers instrument trackers, data engineers run loaders and dbt, and ML/app engineers consume Signals. Hightouch tells admins, data teams, and marketers which order to read in. Snowplow could do the same: platform setup, then tracking, then modeling, then Signals.
- **A shared spec as the bridge between collection and destinations (Segment).** Segment's Spec, Common fields, and Semantic events sit above both collection and destinations. Snowplow's `/docs/fundamentals/` already plays this role and should stay the hub every product links to.

## 2. Integration catalogs: hubs, filters, and page templates

### Catalog hub pages
- **mParticle** uses a sidebar filter, "Filter by Category", with 8 parent groups (Advertising, Analytics, Customer Service, Data Warehousing, Finance, Marketing, Privacy, Security), each with subcategories. Filters are query strings (`/integrations/?category=...`, `?isFeed=true`), so a filtered view has its own link. The catalog is split into **Inputs** (data in) and **Outputs** (data out). Tile text didn't come through in the fetch, so I couldn't confirm whether tiles show names. https://docs.mparticle.com/integrations/
- **RudderStack** lists Event Stream and Warehouse destinations in tables. Each row shows which source types the destination supports (Event Stream, Reverse ETL, Cloud Extract). Reverse-ETL-only destinations are shown as logo cards. The page has no filter UI. https://www.rudderstack.com/docs/destinations/
- **Fivetran** has type tabs (Applications, Databases, Events, Files, Functions, Logs, AI Connector Agent, Show all) and claims "700+" connectors. Cards carry badges ("Beta", "Lite", "Connector SDK"). The nav also has "By Request" and "Partner-Built" sections, which separate connectors by who maintains them. https://fivetran.com/docs/connectors
- **Segment** has a "Destination methods" comparison chart: one row per destination, one column per method (Track, Page, Identify, Group, Alias), with ✅/⬜️ cells and ℹ️ for Beta. Cloud and device variants get separate rows, for example "Braze Cloud Mode (Actions)" and "Braze Web Device Mode (Actions)". https://www.twilio.com/docs/segment/connections/destinations/methods-compare

### Per-integration page templates
- **Segment** (Amplitude Actions). Sections in order: Destination Info (accepted calls, Integrations object name) → Getting started → Connection modes → **Destination Settings** table (Field, Description, Required, Type) → **Available Presets** table (Preset Name, Trigger, Default Action) → **Available Actions**, each with a field table. The settings and action tables look generated from the integration's own definition; the field lists match the product UI exactly. That is an inference: I couldn't fetch the repo to confirm generation. https://www.twilio.com/docs/segment/connections/destinations/catalog/actions-amplitude
- **RudderStack** (Amplitude). The parent page is only a hub linking to Setup Guide, Cloud Mode, Device Mode, and Other Features (https://www.rudderstack.com/docs/destinations/streaming-destinations/amplitude/). The Setup Guide starts with a **Connection compatibility** matrix (rows are sources such as AMP, Android, iOS, Web, Warehouse; columns are Cloud, Device, and Hybrid mode, plus Device Mode Transformations). A **Supported message types** matrix follows (rows are mode × source; columns are Identify, Page, Track, Screen, Group, Alias, Record, AudienceList). Then come Connection settings and Configuration settings, with one subsection per mode. https://www.rudderstack.com/docs/destinations/streaming-destinations/amplitude/setup-guide/
- **Hightouch** (Braze). Overview → **Supported syncing** table (Sync Type, Summary, Supported Sync Modes, **API Reference** link) → Connect (API key, required permissions, region) → Sync configuration (one H3 per sync type, each with the same H4s: Record matching, Field mapping, ...) → Tips and troubleshooting (Behavior and limitations, Validate your setup) → **Common errors** table with one subsection per error. https://docs.hightouch.com/destinations/braze
- **Fivetran** (Salesforce). A **Features** table first (Feature Name, Supported, Notes; rows include Capture deletes, History mode, Re-sync, Row filtering, Private networking) → Supported products, environments, and deployment models → Setup guide → Sync overview → Schema information (diagram, plus links to an **interactive ERD and a Markdown version**) → Type conversion. Each connector also has its own sub-nav: Setup Guide, API Configuration, FAQ, Troubleshooting, **Release Notes**. https://fivetran.com/docs/connectors/applications/salesforce
- **mParticle** (Braze event). Starts with implementation scenarios, then a long Event Data Mapping section with one property table per commerce event (mParticle attribute, Braze property, Required?, Data Type). The fetched part contains prose sections nested to H5, with no compatibility table at the top. https://docs.mparticle.com/integrations/braze/event/

**What to use for Snowplow destinations and event forwarding:**
1. **Start every page with a fixed set of summary tables:** a Features or compatibility table (Fivetran), a supported-modes table with API reference links (Hightouch), and a settings table with Field, Required, and Type (Segment). These answer "will this work for me?" before any prose. For Snowplow, the columns could be: loader or forwarder, supported clouds, delivery (batch or streaming), entity handling, and lifecycle status.
2. **Use the same H2s in the same order on every page:** Overview → Compatibility → Connect → Configure → Troubleshooting → Common errors (Hightouch). Readers learn the layout once. Snowplow's rule of 3–5 H2 sections per page fits this.
3. **Put the full compatibility matrix on the hub page** (Segment's methods chart, RudderStack's source-type columns). This replaces a page-by-page hunt.
4. **Use query-string filters on the catalog hub** (mParticle `?category=`). Each filter combination then has its own link.
5. **Label who maintains each integration** ("Partner-Built", "By Request" at Fivetran; core vs community at Feast, section 4).

## 3. SDK documentation across many languages

- **PostHog** has one libraries page listing 20+ SDKs with a **feature support matrix**. Columns: Event capture, User identification, Autocapture, Session recording, Feature flags, Group analytics, Error tracking, Logs, Tracing. It states the rule outright: "Session recording and autocapture are not possible in server libraries." https://posthog.com/docs/libraries
- **Amplitude** groups SDKs by **product family first, then platform**. Every link carries a lifecycle label: "(current)", "(legacy)", or "(maintenance)". The page tells readers that new implementations should use the current SDK. https://amplitude.com/docs/sdks
- **RudderStack** groups SDKs as Web, Mobile, and Server cards. "Legacy" is the only status label. https://www.rudderstack.com/docs/sources/event-streams/sdks/
- **Segment** puts a **Support** status block (Community, Maintenance, Flagship) at the top of each SDK page. Version requirements appear inline as callouts ("requires snippet 4.1.0", "5.2.1"). The Analytics.js page has about 21 H2s, with methods first, then configuration, then performance and privacy. https://www.twilio.com/docs/segment/connections/sources/catalog/libraries/website/javascript
- **Confluent** publishes each client language as its own versioned subsite: `/kafka-clients/{java,python,go,dotnet,javascript,rust,librdkafka}/current/`. https://docs.confluent.io/
- **Anthropic** shows the same request in 9 language tabs in the home page hero, so readers see language parity at first glance. https://platform.claude.com/docs/en/home
- **Snowplow (today)** has tracker tables with columns Tracker, Language, Used in, Snowtype?, Supported data models, GitHub, Installed using. The only status marker is "deprecated" on the Tracking CLI. There are no maintenance tiers and no matrix of what each tracker supports. https://docs.snowplow.io/docs/sources/

**What to use for Snowplow's ~20 trackers:**
- Add a **feature support matrix** like PostHog's to the trackers hub. Candidate columns: page/screen views, activity tracking, built-in entities (for example, client session), anonymous tracking, media plugin, e-commerce plugin, Snowtype, emitter batching, consent. Snowplow's table already has data-model and Snowtype columns, so this extends it.
- Add **Segment-style support tiers** (Flagship, Maintenance, Community) or **Amplitude's labels** (current, maintenance, legacy) to every tracker. This matters for trackers such as the Lua and C++ ones, where readers can't tell how actively each is maintained.
- Put version requirements in **inline "requires vX.Y" callouts** (Segment) rather than separate pages per version.

## 4. Feature-store and real-time docs (patterns for Signals)

- **Feast**: the online-stores overview has a **Functionality Matrix**. Columns are stores; rows are capabilities such as write, read, update/teardown infra, on-demand transforms, readable by Python/Java/Go, TTL at retrieval, and collocated by entity key. The text names 5 **core** implementations and calls the rest **community-contributed**, "not guaranteed to be stable or to match the functionality of the core implementations." Getting started is split into Quickstart, Concepts, Architecture (including "push-vs-pull model" and "feature transformation"), and Components (offline store, online store). https://docs.feast.dev/reference/online-stores/overview, https://docs.feast.dev/
- **Tecton**: the Concepts page uses **one running example** in this order: Feature Views (Sources, Entities, Features, Timestamp, Transformation) → Feature Services → Workspaces → "Next Steps: Build a Pipeline". A separate Glossary is linked from the sidebar. The sidebar goes Get Started → **Feature Development** (Define, Deploy, Read, Test, Change, Materialize, Monitor, Optimize Costs) → Integrations → **For Administrators**. A Reference dropdown splits SDK, CLI, HTTP API, Java client, and Python client. A version selector covers Beta and 1.2 back to 0.3. https://docs.tecton.ai/docs/introduction, https://docs.tecton.ai/docs/concepts/tecton-concepts
- **Hopsworks**: top tabs are Concepts, Guides, Administration, Python API, Java API, Reference, **Docs for AI agents**, and Releases. A "Find your path" section routes six personas (Developer, Data scientist, Platform engineer, Security engineer, Administrator, Evaluator). "Where Hopsworks runs" separates Managed SaaS from Self-deployed. https://docs.hopsworks.ai/latest/
- **Redis Feature Form** (from search results only; I didn't fetch the pages): the overview describes a 7-step flow: register providers → datasets → transformations → entities/features → apply → materialize to Redis → retrieve. https://redis.io/docs/latest/develop/ai/featureform/overview

**What to use for Signals:**
- **Organize the Signals sidebar by workflow verbs,** as Tecton does with Feature Development: Define attributes → Publish → Serve (pull services) → Intervene (push) → Monitor. This matches the order Signals users work in. It also gives the "Activate" stage in section 1 a concrete structure.
- **Explain the concepts through one running example** (Tecton), and give **push vs pull** its own architecture page (Feast). Signals has both services (pull) and interventions (push).
- **Publish a capability matrix** wherever Signals has variants, such as stream vs batch attribute sources, or supported warehouses for batch attributes (Feast's format).
- **Add a persona router to the Signals landing page** (Hopsworks). ML engineers and application developers come to Signals with different questions.

## 5. Self-hosted vs managed, and versioned components

- **Confluent**: Cloud (`/cloud/current/`) and Platform (`/platform/current/`) are **two parallel doc trees**. "Browse by product" tags each product Cloud, Platform, or both. https://docs.confluent.io/
- **Databricks**: the cloud is chosen with a **switcher in the header** and encoded in the URL path (`/aws/en/`). Azure and GCP point to other hosts. https://docs.databricks.com/aws/en/
- **PostHog**: one self-host page. It opens with a **decision flowchart** that recommends Cloud for most users and states the limits plainly: no CVEs or versioned releases, no support, free-plan features only, Kubernetes retired. https://posthog.com/docs/self-host
- **dbt**: a **version selector** in the header (v2, v1, 1.13 beta, 1.12, 1.11), plus inline "(Applies to dbt v1.11 and later)" markers on features that changed. The packages page sends users to the Package Hub, which shows semantic versions and a "v2-compatible" badge. https://docs.getdbt.com/docs/introduction, https://docs.getdbt.com/docs/build/packages
- **Tecton**: whole-site version snapshots; old versions move to separate hosts. https://docs.tecton.ai/docs/introduction
- **Fivetran**: release notes **per connector** in the connector's sub-nav. https://fivetran.com/docs/connectors/applications/salesforce

**What fits Snowplow:**
- **Mark deployment variants inline,** as dbt and Confluent do with "applies to" markers and product tags. Don't build parallel trees. Most Snowplow content is the same across deployments, so a "Managed / Self-hosted" marker on the pages that differ costs less than maintaining two copies.
- **Put versions on components, not on the site.** Use "Requires collector X.Y / tracker X.Y" callouts (dbt's "Applies to") and per-component release notes (Fivetran). Each Snowplow component (loaders, trackers, dbt packages) ships independently, so Tecton-style whole-site snapshots don't fit.
- **Give dbt packages a compatibility table** for package version × dbt version × warehouse, in the spirit of dbt's adapter lifecycle table (Adapter, Lifecycle: Generally available / Beta / Private beta). https://docs.getdbt.com/docs/supported-data-platforms

## 6. Docs for AI agents and design details

**Current baseline.** Every one of these offers llms.txt plus a Markdown version of each page:
- PostHog: `llms.txt` with an "Instructions for AI Coding Assistants" section; pages have `.md` twins. https://posthog.com/llms.txt
- Amplitude: `.md` suffix or an `Accept: text/markdown` header. https://amplitude.com/docs
- Hightouch: llms.txt plus a **docs MCP server**. https://docs.hightouch.com/
- Hopsworks: MCP server (`search_docs`, `get_page`, `list_sections`), llms.txt, llms-full.txt, `.md` pages, and a "Copy for LLM" button. https://docs.hopsworks.ai/latest/ai/
- OpenAI: llms.txt, llms-full.txt, and `.md` on any page. https://developers.openai.com/api/docs
- Also present at: Snowflake (https://docs.snowflake.com/), Mixpanel (https://docs.mixpanel.com/docs), and Feast (https://docs.feast.dev/).
- RudderStack and dbt go further and give AI its own top-level docs section (MCP, Agent Skills, Copilot). https://www.rudderstack.com/docs/, https://docs.getdbt.com/docs/introduction
- For comparison, Snowplow links an MCP page from its home page hero. https://docs.snowplow.io/docs/

**Design details I could confirm from page structure** (WebFetch returns text, so I couldn't judge visual design):
- Anthropic's home page is built from typed components (HomeHero, HomePlatformCard, HomeJourney, CardGroup), with an icon on every link and a code sample in the first screen. https://platform.claude.com/docs/en/home
- Hightouch puts H4 subsections under every sync type in the same order, so integration pages can be scanned quickly. https://docs.hightouch.com/destinations/braze
- Fivetran offers an interactive ERD with a Markdown alternative. https://fivetran.com/docs/connectors/applications/salesforce

## 7. Priority recommendations for CDI and Signals

1. **Home page:** two equal product cards, each with Quickstart, Reference, and SDKs links, plus a lifecycle journey with one tab per product (Anthropic). This replaces the current layout, where Signals is a hero card outside the six CDI cards.
2. **Sidebar:** organize by lifecycle verb (RudderStack), with Fundamentals as a hub every section links to (Segment Spec).
3. **Trackers hub:** add a feature support matrix (PostHog) and support tiers (Segment, Amplitude).
4. **Destinations and forwarding:** a fixed page template that opens with Features, Compatibility, and Settings tables (Fivetran, Hightouch, RudderStack), plus a matrix on the hub (Segment) and query-string filters (mParticle). Generate the settings tables from component config schemas where possible; Segment's tables match its product UI field for field, which suggests generation.
5. **Signals:** a workflow sidebar (Tecton), concepts taught with one running example, a push vs pull architecture page (Feast), and persona entry points (Hopsworks).
6. **Versions:** inline "Requires vX" markers and per-component release notes (dbt, Fivetran). Mark managed and self-hosted differences inline (Confluent tags).
7. **Agents:** keep the MCP server. Check that llms.txt, `.md` pages, and "Copy for LLM" are present across the whole site (Hopsworks has all of them).

## Pages I couldn't fetch, or couldn't fully read
- `segment.com/docs/` and `segment.com/docs/connections/catalog/` returned 403. I used the twilio.com/docs/segment mirror instead. The Segment GitHub repo README returned 404, and GitHub API access to that repo isn't enabled for this session, so I couldn't verify how its catalog pages are generated.
- `heap.io/docs` and `getcensus.com/docs` returned 404. `docs.getcensus.com` redirects to Fivetran Activations.
- The mParticle web SDK getting-started page returned 404.
- The Redis Feature Form page returned 404. The Redis findings above come from search-result summaries only.
- I didn't fetch docs.featureform.com.
- The PostHog docs landing page and the PostHog feature-flags page returned only header and body content, with no sidebar, so I couldn't describe PostHog's product switcher.
- The Mixpanel fetch returned only a concepts page, so I couldn't describe its information architecture.
- The fetched part of the Segment catalog hub page doesn't describe its filters or categories.
- The RudderStack destinations page shows no catalog filters.