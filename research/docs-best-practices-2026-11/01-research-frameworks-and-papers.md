# Evidence base for technical and developer documentation (research brief, 2026-11-05)

Every claim below links to a page I fetched. If a claim rests only on search-result snippets, or a page could not be fetched, I say so where it comes up and again in the gaps section at the end.

---

## 1. Frameworks

### Diátaxis
- **The model.** Diátaxis names "four distinct needs, and four corresponding forms of documentation": tutorials, how-to guides, reference and explanation ([diataxis.fr](https://diataxis.fr/)).
- **Two axes.** The map page shows two axes without naming them. One runs from action (guiding: tutorials and how-to guides) to cognition (stating and explaining: reference and explanation). The other runs from acquiring a skill (tutorials) to applying it (how-to guides) ([diataxis.fr/map](https://diataxis.fr/map/)).
- **Why the boundaries matter.** When types blur, "writing style and content make their way into inappropriate places." The worst case is that tutorials and how-to guides merge, and the result serves neither need ([diataxis.fr/map](https://diataxis.fr/map/)).
- **How to adopt it.** The site warns against setting up empty sections for the four types. It also says "every step in the right direction is worth publishing immediately", and that Diátaxis "changes the structure of your documentation from the inside" ([diataxis.fr/how-to-use-diataxis](https://diataxis.fr/how-to-use-diataxis/)). Restructure gradually, page by page, rather than creating four folders first.

### Critiques of Diátaxis
- **Hillel Wayne** says the model "was designed for documenting tools and doesn't fully address the needs of frameworks and programming languages." He adds two missing types ([hillelwayne.com](https://www.hillelwayne.com/post/problems-with-the-4doc-model/)):
  - **Conceptual overviews**, which come before the tutorial and are for people deciding whether to learn something.
  - **Snippets and examples.** Examples are complete code you study; snippets are code you reuse.
- **Steve Arrants** makes two further points ([field guide](https://stevearrants.substack.com/p/documentation-frameworks-a-field), seen only as a search snippet, not fetched):
  - Diátaxis sorts content by purpose but says nothing about how to write it.
  - It is "a strong default, not a mandate" to have exactly four folders.
- **Relevance to a platform product.** CDI and Signals have dense, interrelated concepts. That puts them in the territory Wayne describes, so a conceptual overview before tutorials is justified.

### The Good Docs Project
- **Template packs** ([templates page](https://www.thegooddocsproject.dev/template)):
  - Core: Concept, How-to, README, Reference, Release notes, Troubleshooting, Tutorial.
  - Miscellaneous: API getting started, API reference, Glossary, Installation guide, Quickstart, SDK overview, Style guide, Terminology system, User personas.
  - Community: Bug report, Changelog, Contributing guide and similar project files.
- **How-to template sections** ([how-to](https://www.thegooddocsproject.dev/template/how-to)):
  - Overview, covering when and why you would do the task.
  - Before you begin, listing prerequisites "so users don't discover gaps partway through."
  - Steps, each starting with a verb, about 8 to 10 steps per task.
  - See also.
- The template page does not mention Diátaxis. The how-to template lists Diátaxis under additional resources.

### Google developer documentation style guide
- **Highlights** ([highlights](https://developers.google.com/style/highlights)):
  - Address the reader as "you".
  - Use active voice.
  - Put conditions before instructions.
  - Use sentence-case headings and descriptive link text.
  - Use numbered lists for sequences.
  - Use code font for code and bold for UI elements.
- **Procedures** ([procedures](https://developers.google.com/style/procedures)):
  - One action per step.
  - Name the location before the action.
  - Write "To start a new document, click…" (goal before action).
  - Prefix optional steps with "Optional:".
  - Document one clear method rather than several.
  - Link to an earlier procedure instead of repeating it.
  - Don't write "above" or "below".
- **Headings** ([headings](https://developers.google.com/style/headings)):
  - Task headings start with a base-form verb ("Create an instance", not "Creating…").
  - Concept headings are noun phrases.
  - Don't skip heading levels.
  - "Don't use empty headings. Make sure headings are followed by content."
  - No links in headings.

### Write the Docs
- **Content principles** ([docs principles](https://www.writethedocs.org/guide/writing/docs-principles/)):
  - ARID ("Accept (some) Repetition In Documentation").
  - Skimmable ("writing like a newspaper instead of a novel").
  - Exemplary ("Many readers look first towards examples").
  - Current ("Consider incorrect documentation to be worse than missing documentation").
- **Publication principles**, same page: Discoverable, Addressable (link to content at a granular level), Cumulative, Complete ("cover concepts in full, or not at all"), Nearby (keep sources close to the code) and Unique (no overlap between sources).
- **Docs-as-code** ([docs-as-code](https://www.writethedocs.org/guide/docs-as-code/)):
  - Docs live in Git and are written in plain-text markup.
  - Doc changes go through code review and automated tests.
  - "you can block merging of new features if they don't include documentation."

### Every Page is Page One (Mark Baker)
- **Core argument.** "People don't arrive at your site, they arrive at your pages" ([EPPO book page](https://everypageispageone.com/the-book/)).
- **Seven traits of a topic**, same page:
  1. Self-contained ("designed not merely to stand alone, but to function alone").
  2. Specific, limited purpose.
  3. Conforms to a type.
  4. Establishes its context.
  5. Assumes a qualified reader.
  6. Stays on one level.
  7. Links richly.
- This 2013 model now applies directly to LLM retrieval, which pulls single pages or chunks out of context (see section 4).

### Minimalism (John Carroll)
- **Principles** ([instructionaldesign.org](https://www.instructionaldesign.org/theories/minimalism/)):
  - "Allow learners to start immediately on meaningful tasks."
  - Minimize passive reading.
  - "Include error recognition and recovery activities."
  - "Make all learning activities self-contained and independent of sequence."
- **Replication evidence.** Lazonder and van der Meij (1993) randomized 64 students between a minimal manual and a standard manual for a word processor. "Minimalist users learned faster and better," closely matching Carroll et al. (1987). The effect did not depend on prior computer experience ([U. Twente record](https://research.utwente.nl/en/publications/f811580e-953a-4312-a1ee-9916b3f98e05)).
- **Not verified from a primary source:**
  - The commonly cited four principles: action-oriented, anchored in the real task, error recovery, and supporting reading to do, study and locate.
  - The claim that the minimal manual was "about an eighth as much verbiage".
  - The Glasgow page summarizing the original study returned HTTP 503 ([psy.gla.ac.uk](https://www.psy.gla.ac.uk/~steve/MinMan2.html)).

### Information foraging (Pirolli and Card)
- **Source.** Pirolli and Card, "Information Foraging," *Psychological Review* 106(4), 1999 (citation [bibsonomy](https://bibsonomy.org/bibtex/2f5cdb3b5a6a14b960024cbe12e1d9b44/lemmi), from a search result).
- **Core idea.** People "adapt their information-seeking behavior to maximize the rate of gain of valuable information per unit cost of interaction" ([UX Tigers / Nielsen](https://www.uxtigers.com/post/information-foraging)).
- **Two key concepts**, same page:
  - Scent: the reader's estimate of a path's value, judged from labels.
  - Patch-leaving: readers leave a page when its yield drops to the average they could get elsewhere.
- **Design implications**, same page:
  - Put the most informative words first in links and headings.
  - Make each page deliver what its label promised.
  - Deliver the main value on the first screen.
- **NN/g's scent guidance** ([NN/g](https://www.nngroup.com/articles/information-foraging/)):
  - Avoid jargon, branded terms and vague labels such as "More".
  - Don't rely on surrounding context to carry meaning.

### How people scan (NN/g eyetracking)
- **F-pattern.** First found in 2006 and reconfirmed in 2017 on desktop and mobile. It appears when text is unformatted and the reader wants efficiency ([NN/g F-pattern](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/)).
- **Other patterns:** layer-cake (reading only headings), spotted, marking, bypassing and commitment.
- **Recommendations**, same page:
  - Put the most important points in the first two paragraphs.
  - Make the first two words of a heading carry its meaning.
  - Use bullets, bold keywords and descriptive link text.
- **Tabs** ([NN/g tabs](https://www.nngroup.com/articles/tabs-used-right/)):
  - Use tabs only when "users don't need to simultaneously see information presented under different tabs."
  - Keep critical content out of non-default tabs ("Ensure that the content within nondefault tabs is supplemental rather than critical").

---

## 2. Academic research on API documentation

| Study | Method | Key finding |
|---|---|---|
| Uddin and Robillard, "How API Documentation Fails," *IEEE Software* 2015 ([PDF](https://www.cs.mcgill.ca/~martin/papers/ieeesw2015.pdf)) | 2 surveys, 323 developers, 179 doc units | See below |
| Robillard and DeLine, "A field study of API learning obstacles," *Empirical Software Engineering* 2011 ([PDF](https://www.cs.mcgill.ca/~martin/papers/ese2011.pdf)) | Surveys and interviews, more than 440 Microsoft developers | Some of the most severe obstacles to learning a new API were documentation and other learning resources. Five factors: documentation of intent, code examples, matching APIs with scenarios, penetrability and format/presentation. |
| Meng, Steinhardt and Schubert, *Communication Design Quarterly* 2019 ([PDF](https://mangold-international.com/resources/meng-et-al-how-developers-use-api-documentation-2019.pdf)) | Observation study | See below |
| Meng, Steinhardt and Schubert, "Optimizing API Documentation," SIGDOC 2020 ([PDF](https://mangold-international.com/resources/meng-et-al-optimizing-api-documentation-2020.pdf)) | Controlled test, n=22 | See below |
| Meng, Steinhardt and Schubert, *Journal of Technical Writing and Communication* 2018 | Interviews and questionnaire | Developers first try to "form a global understanding regarding the overall purpose and main features of an API," then follow either a concepts-oriented or a code-oriented strategy ([Content Wrangler summary](https://www.thecontentwrangler.com/p/developer-experiences-with-api-docs)). ResearchGate full text returned 403. |
| Google page-view log study, arXiv 2310.10817 ([arXiv](https://arxiv.org/html/2310.10817v2)) | Logs from 94,096 users of 4 Google APIs | See below |

**Uddin and Robillard (2015):**
- The three most severe problems were ambiguity, incompleteness and incorrectness.
- Six problems were rated "blockers" that made developers switch APIs: incompleteness, ambiguity, obsoleteness, incorrectness, inconsistency and unexplained examples.
- Respondents "cared most about quality content" over presentation.
- They disliked fragmentation: "10s of clicks through links to find the information you need".
- On examples, they quote Nasehi et al.: "explanations accompanying an example are as important as the examples themselves."

**Meng et al. (2019):**
- Participants spent about 49% of their time in the documentation (range 31–68%).
- The API reference was used most, followed by Recipes. Recipes and Samples together were active about 21% of the time.
- Five of 11 participants spent 0–5.6% of their time on the Concepts page. The other six spent 12.5–42.9%.
- Opportunistic developers started from example code and "did not take time to get a general overview."

**Meng et al. (2020):**
- Documentation rewritten to the guidelines led to fewer errors. Participants spent less time outside the docs planning and executing the tasks. Overall task time was not significantly lower.
- The guidelines tested were:
  - 1.1: organize content by usage scenario.
  - 1.2: put concepts next to the tasks that need them.
  - 1.3: if search is weak, keep the information on one page.
  - 2.1: "clean and working code examples … copy-and-paste."
  - 2.4: a concise overview on the start page.
  - 3.1: separate text from code visually (multi-column layout).
  - 3.3: present important concepts "redundantly. Present it wherever needed."
  - 3.4: try-out functionality.

**Google log study (arXiv 2310.10817):**
- For users with no prior API calls, visiting Guide pages was associated with 3.92 times the odds of making successful API calls in the next three months.
- Experienced users were more likely to visit reference pages (OR 1.34) and less likely to visit meta pages (OR 0.67).

**Combined takeaways from these studies:**
- Readers go straight to examples and reference, and many skip standalone concept pages.
- Put concepts inside task pages, and repeat them where needed.
- Accuracy and completeness matter more than visual polish.
- Avoid fragmenting a topic across many small pages.

---

## 3. Survey and industry data

- **Stack Overflow 2025.** Asked "How did you learn to code in the past year?", 67.8% chose technical documentation, the top answer. Stack Overflow was at 51.4%, videos at 50% and AI tools at 44% ([survey](https://survey.stackoverflow.co/2025/developers)). In 2024, documentation was at 83.9% ([2024](https://survey.stackoverflow.co/2024/developer-profile/), from search results).
- **GitBook State of Docs 2026** ([GitBook blog](https://www.gitbook.com/blog/state-of-docs-2026), [stateofdocs.com/2026](https://www.stateofdocs.com/2026)):
  - 76% of teams use AI regularly; only 44% have AI guidelines.
  - 70% factor AI into information architecture, up from 31%.
  - 88% say a product's docs matter when buying.
  - 57% don't track leads from their documentation.
  - Discovery channels (35% of teams say readers find them through AI search, 18% through coding assistants, 16% through MCP) appeared only in a search summary. Neither fetched page showed them, so treat these as unverified.
- **GitBook AI-traffic data.** AI readers on GitBook-hosted docs went from about 9% of traffic in January 2025 to about 41–42% in December 2025 ([GitBook](https://www.gitbook.com/blog/ai-docs-data-2025)). This is vendor data from GitBook's own platform.
- **Postman State of the API 2025**, via the [Nordic APIs summary](https://nordicapis.com/a-deep-dive-into-the-state-of-the-api-2025/). I did not fetch the full report.
  - 24% design APIs with AI agents in mind; 60% design for humans only.
  - More than half cite inconsistent documentation as a collaboration blocker.
  - 41% use generative AI to write API docs.
  - The sample fell from 37,000 respondents to 5,700.

---

## 4. The 2025–2026 shift to docs read by AI agents

### llms.txt
- **The proposal.** Jeremy Howard published it on 2024-09-03; the page is now at v2, modified 2026-08-10 ([llmstxt.org](https://llmstxt.org/)).
- **Format**, same page:
  - H1 with the site name (required), then a blockquote summary.
  - H2 sections of links, plus an "Optional" section agents can skip.
  - It can sit at a subpath such as `/docs/llms.txt`.
- **Markdown versions of pages.** Pages should have a `.md` version at the same URL, discoverable through `rel="alternate" type="text/markdown"`.
- **llms-full.txt is not in the v2 spec text.** It is a convention attributed to Mintlify and Anthropic. That attribution comes only from secondary sources ([layer3labs](https://www.layer3labs.io/guides/llms-full-txt)), so treat it as unverified.

### What major vendors ship
- **Anthropic** ([platform.claude.com/llms.txt](https://platform.claude.com/llms.txt)):
  - The second section of the file announces a docs MCP server at `https://platform.claude.com/docs/mcp`.
  - Every link points to a `.md` page.
  - It covers about 886 English pages plus 11 language variants, with a footer pointer to llms-full.txt.
- **OpenAI**:
  - A hub `llms.txt` links per-product `llms.txt` indexes and a "Common tasks" list ([developers.openai.com/llms.txt](https://developers.openai.com/llms.txt)).
  - A read-only Docs MCP server at `https://developers.openai.com/mcp` ([Docs MCP page](https://developers.openai.com/learn/docs-mcp.md)).
  - The Docs MCP page offers an `AGENTS.md` snippet, because without it "you need to explicitly tell your agent to consult the Docs MCP server," plus a companion Docs Skill.
- **Stripe** ([docs.stripe.com/llms.txt](https://docs.stripe.com/llms.txt)):
  - The llms.txt includes an "Instructions for Large Language Model Agents" section.
  - It says "never recommend the Charges API" and "must not call deprecated API endpoints such as the Sources API".
  - It tells agents to "always check the npm registry for the latest version rather than relying on memorized version numbers."
  - The pattern: use llms.txt to steer agents away from deprecated paths that are in their training data.
- **Mintlify contextual menu** ([Mintlify docs PR](https://github.com/mintlify/docs/pull/727.patch), from search results):
  - Per-page options: "Copy page" (copies Markdown), "View as Markdown", "Open in ChatGPT" and "Open in Claude".
  - Appending `.md` to a URL returns the Markdown version.
- **Cloudflare "Markdown for Agents."** With `Accept: text/markdown`, Cloudflare converts HTML to Markdown at the edge and returns `x-markdown-tokens` ([Cloudflare docs](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents), from search results, not fetched).

### Evidence on what agents actually use
- **Ahrefs study of 137,210 domains (May 2026)** ([Ahrefs](https://ahrefs.com/blog/llmstxt-study/)):
  - 28% publish llms.txt.
  - 97% of those files got zero requests.
  - No AI bot asked for llms.txt on domains that don't have one.
  - Coding agents (Claude-Code) fetched it more than any retrieval or assistant bot.
  - "Agents fetch llms.txt when directed, not speculatively."
  - Conclusion: llms.txt helps agents and IDE tools that are pointed at it. It does not help search visibility.
- **Vercel agent evals** ([Vercel](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)), on Next.js 16 APIs missing from training data:

  | Setup | Pass rate |
  |---|---|
  | No docs (baseline) | 53% |
  | Skill | 53% (not invoked in 56% of cases) |
  | Skill with explicit instructions | 79% |
  | 8 KB `AGENTS.md` docs index | 100% |

  Vercel's explanation: "there's no moment where the agent must decide" whether to look something up.
- **Implication.** Ship a short, pasteable index or `AGENTS.md` snippet that points to `.md` pages, and say clearly where the MCP server is.

### How page design changes for retrieval
kapa.ai's guide ([kapa.ai](https://docs.kapa.ai/improving/writing-best-practices)) recommends:
- "Front-load essential context and include complete information within each section boundary."
- Avoid back-references such as "as mentioned above".
- Include prerequisites inside the procedure.
- Use the same term for each product concept everywhere.
- Quote exact error messages next to their fixes.
- Restate workflow diagrams as numbered steps.
- Keep a table only when each row stands alone.
- "Replace complex JavaScript widgets with plain-text alternatives."

**On tabs:** I found no primary source showing that LLMs lose content inside tabs. The evidence is indirect:
- NN/g says not to put critical content in non-default tabs.
- kapa.ai advises against JavaScript-driven content.
- Fern's Markdown export keeps every tab ([Fern tabs.md](https://buildwithfern.com/learn/docs/writing-content/components/tabs.md), from search results).

So the risk depends on the renderer and exporter. Check what the `.md` export actually contains rather than assuming tabs are safe or unsafe.

---

## 5. Principles with the strongest evidence

1. **Accuracy and completeness come before presentation.** Ambiguity, incompleteness and incorrectness are the most severe problems, and six problem types make developers abandon an API ([Uddin and Robillard](https://www.cs.mcgill.ca/~martin/papers/ieeesw2015.pdf)). "Incorrect documentation [is] worse than missing" ([WTD](https://www.writethedocs.org/guide/writing/docs-principles/)).
2. **Ship complete, working, copy-pasteable code examples, and explain them.** Developers start from examples ([Meng 2019](https://mangold-international.com/resources/meng-et-al-how-developers-use-api-documentation-2019.pdf)). Unexplained examples are a blocker ([Uddin and Robillard](https://www.cs.mcgill.ca/~martin/papers/ieeesw2015.pdf)). Clean examples are Guideline 2.1 in a test that reduced errors ([Meng 2020](https://mangold-international.com/resources/meng-et-al-optimizing-api-documentation-2020.pdf)).
3. **Organize by user task or scenario, not by product internals.** Matching APIs with scenarios is one of Robillard and DeLine's five factors ([Robillard and DeLine](https://www.cs.mcgill.ca/~martin/papers/ese2011.pdf)). Organizing by scenario is Meng Guideline 1.1, and minimalism anchors instruction in real tasks ([Lazonder and van der Meij](https://research.utwente.nl/en/publications/f811580e-953a-4312-a1ee-9916b3f98e05)).
4. **Put concepts inside the tasks that need them, and accept some repetition.** About half of observed developers barely used the Concepts page ([Meng 2019](https://mangold-international.com/resources/meng-et-al-how-developers-use-api-documentation-2019.pdf)). Meng Guidelines 1.2 and 3.3 say this directly, and Write the Docs' ARID principle accepts some repetition.
5. **Make every page work as the first page.** Baker's self-contained, context-establishing topics ([EPPO](https://everypageispageone.com/the-book/)), minimalism's "independent of sequence" ([instructionaldesign.org](https://www.instructionaldesign.org/theories/minimalism/)) and kapa.ai's self-contained sections for retrieval ([kapa.ai](https://docs.kapa.ai/improving/writing-best-practices)) all point the same way.
6. **Provide a short overview of purpose and capabilities, easy to reach from the start page.** Developers first form a "global understanding" ([Meng 2018 summary](https://www.thecontentwrangler.com/p/developer-experiences-with-api-docs)). This is Meng Guideline 2.4, and Wayne's "conceptual overview" type ([Wayne](https://www.hillelwayne.com/post/problems-with-the-4doc-model/)).
7. **Keep content types separate (learning, doing, looking up, understanding), and adopt the split gradually.** Mixing types degrades all of them, and restructuring should happen page by page, never as empty scaffolding ([Diátaxis map](https://diataxis.fr/map/), [how to use](https://diataxis.fr/how-to-use-diataxis/)).
8. **Write for scanning.** Lead with the key point, front-load headings, use lists and bold keywords ([NN/g](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/)). Scent theory says to put the informative words first ([Pirolli/Nielsen](https://www.uxtigers.com/post/information-foraging)).
9. **Use descriptive labels everywhere: headings, links and navigation.** Use task-verb headings, no "click here", and no branded or jargon labels ([Google headings](https://developers.google.com/style/headings), [NN/g scent](https://www.nngroup.com/articles/information-foraging/)).
10. **Write procedures as one numbered action per step, with the goal and location first, and one recommended method.** See [Google procedures](https://developers.google.com/style/procedures) and [Good Docs how-to](https://www.thegooddocsproject.dev/template/how-to), which caps a task at about 8–10 steps.
11. **Avoid fragmentation; prefer fewer, more complete pages.** "10s of clicks" was a named problem ([Uddin and Robillard](https://www.cs.mcgill.ca/~martin/papers/ieeesw2015.pdf)). Meng Guideline 1.3 says to keep information on one page when search is weak.
12. **Treat docs as code.** Use version control, review and CI tests, and gate feature merges on documentation. This targets the obsoleteness problem ([WTD docs-as-code](https://www.writethedocs.org/guide/docs-as-code/)).
13. **Serve machine-readable docs that agents can be pointed at:**
    - A `.md` version of every page.
    - A curated `llms.txt` with an Optional section.
    - A docs MCP server, announced in llms.txt.
    - A pasteable `AGENTS.md` snippet.

    Agents fetch these files when told to, not on their own ([Ahrefs](https://ahrefs.com/blog/llmstxt-study/)). Passive context reached 100% versus 53–79% ([Vercel](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)). This is the pattern used by [Anthropic](https://platform.claude.com/llms.txt), [OpenAI](https://developers.openai.com/learn/docs-mcp.md) and [Stripe](https://docs.stripe.com/llms.txt).
14. **Use llms.txt to tell agents which APIs to prefer and which are deprecated.** Agents rely on stale training data. Stripe's file states this explicitly ([Stripe](https://docs.stripe.com/llms.txt)).
15. **Never hide required information in tabs, diagrams or widgets.** Keep non-default tabs supplemental ([NN/g tabs](https://www.nngroup.com/articles/tabs-used-right/)). Give text equivalents and numbered steps for diagrams ([kapa.ai](https://docs.kapa.ai/improving/writing-best-practices)).

**What this means for this repo.** CLAUDE.md requires tabs for cross-platform content. Platform tabs are acceptable because they are mutually exclusive. Prerequisites, warnings and concept explanations must sit outside the tabs. Then confirm that the site's Markdown or llms export includes every tab panel.

---

## Gaps and pages I could not fetch
- **Meng 2018 full text.** ResearchGate returned HTTP 403, so I used a secondary summary.
- **Carroll's minimal manual summary.** The Glasgow page returned HTTP 503. Carroll's original 1987 numbers and the van der Meij and Carroll (1995) principles are not verified from a primary source.
- **Postman 2025 full report.** Not fetched; I used the Nordic APIs summary.
- **GitBook discovery-channel figures** (35% / 18% / 16%). These appeared only in a search summary, not on the fetched pages.
- **Cloudflare Markdown for Agents and the Mintlify contextual menu.** Taken from search results, not fetched directly.
- **The Hillel Wayne critique page on engineered.at** was only an AI summary. I fetched the original on hillelwayne.com instead.
- **Peer-reviewed critique of Diátaxis.** I found none; all critiques are from practitioners.
- **NN/g research specific to developers or developer documentation.** I found none. The closest empirical source is the Google log study.