# 📘 Docusaurus Page Schema Plugin

This plugin automatically injects **JSON-LD structured data** into your Docusaurus site’s pages.  
It improves SEO and enables Google rich results by generating **schema.org** entities like:

- WebPage  
- Article / TechArticle  
- HowTo  
- FAQPage  

---

## ✨ Features
- Reads **frontmatter** from your `.md` or `.mdx` pages  
- Generates JSON-LD `<script type="application/ld+json">` inside `<head>`  
- Supports **breadcrumbs**, **FAQs**, **How-To guides**, and **article metadata**  
- Provides **fallbacks** so schema stays valid even if fields are missing  
- Ensures **consistent SEO** across all docs/blog pages  

---

## ⚙️ Installation

```bash
npm install --save docusaurus-plugin-page-schema
# or
yarn add docusaurus-plugin-page-schema
```

### Add to `docusaurus.config.js`

```js
module.exports = {
  plugins: [
  './plugins/docusaurus-plugin-snowplow-schema',
  ],
}
```

---

## 📄 Usage

Define schema fields in **frontmatter** of your Markdown/MDX pages.  
The plugin will auto-generate schema based on these values.

---

## 🗂️ Frontmatter Fields

| Field          | Type                                | Required | Notes                                                                 |
|----------------|-------------------------------------|----------|-----------------------------------------------------------------------|
| `title`        | string                              | ✅        | Used as schema `headline` / `name`                                   |
| `description`  | string                              | ✅        | Short description of the page                                         |
| `slug`         | string                              | ❌        | Page URL (auto-generated if missing)                                  |
| `schema`       | `"Article"`, `"TechArticle"`, `"FAQPage"`, `"HowTo"`, `"WebPage"` | ❌ | Defaults to `WebPage` |
| `author`       | string                              | ❌        | Outputs as `author.name`                                              |
| `date`         | ISO string                          | ❌        | Mapped to `datePublished`                                             |
| `last_updated` | ISO string                          | ❌        | Mapped to `dateModified`                                              |
| `image`        | string (URL)                        | ❌        | Featured image (absolute or relative). Fallback: `/images/default-howto.png` |
| `keywords`     | string[]                            | ❌        | Extra keywords, merged with default set                               |
| `breadcrumbs`  | `{ name, url }[]`                   | ❌        | Adds `BreadcrumbList` schema                                          |
| `faqs`         | `{ question, answer }[]`            | Required if `FAQPage` | Each FAQ must include both `question` + `answer` |
| `step`         | `{ name, text, url?, image? }[]`    | Required if `HowTo` | Each step must include `name` + `text`. `url` and `image` optional. Fallbacks provided. |
| `tool`         | `{ name }[]`                        | ❌        | Tools for HowTo. Fallback: *No special tools required*                |
| `totalTime`    | ISO 8601 duration                   | ❌        | Estimated time (e.g. `PT30M`). Fallback: `PT15M`                      |

---

## 📝 Examples

### 1. WebPage (default)

```md
---
title: "Getting Started"
description: "Learn how to get started with our docs"
slug: "/getting-started"
---
```

---

### 2. Article / TechArticle

```md
---
title: "How to Use Snowplow"
description: "Step-by-step guide"
author: "John Doe"
date: "2023-10-01"
last_updated: "2023-12-05"
schema: "TechArticle"
image: "/img/guide.png"
keywords: ["Snowplow", "Tracking", "Analytics"]
---
```

---

### 3. FAQ Page

```md
---
title: "Common Questions"
description: "Frequently asked questions"
schema: "FAQPage"
faqs:
  - question: "What is Snowplow?"
    answer: "Snowplow is a behavioral data platform."
  - question: "Does it support real-time?"
    answer: "Yes, with Kinesis or Kafka."
---
```

⚠️ **Important**: If you set `schema: "FAQPage"`, you must include at least one FAQ.

---

### 4. HowTo

```md
---
title: "How to Install Snowplow"
description: "Step-by-step installation guide"
schema: "HowTo"
image: "/img/howto/install.png"
totalTime: "PT30M"
tool:
  - name: "Terminal"
  - name: "Docker"
step:
  - name: "Download"
    text: "Download the installer from the website."
    url: "/tutorials/install#step-1"
    image: "/img/howto/step1.png"
  - name: "Install"
    text: "Run the installer and follow instructions."
    url: "/tutorials/install#step-2"
  - name: "Verify"
    text: "Check if installation is successful."
---
```

---

## 🔄 Fallbacks if Missing

- `image` → `/images/default-howto.png`  
- `totalTime` → `PT15M`  
- `tool` → `"No special tools required"`  
- `step.image` → `/images/default-step.png`  
- `step` → Adds 2 default fallback steps  

---

## 🔍 Debugging

1. Open your page in the browser  
2. Right-click → **View Page Source**  
3. Search for `<script type="application/ld+json">`  
4. Copy the JSON and test in [Google Rich Results Test](https://search.google.com/test/rich-results)  

---

## 📌 Notes

- If no `schema` is provided → defaults to `WebPage`  
- All schemas include `mainEntityOfPage` with canonical page URL  
- `keywords` always merge with default set:  

```
Snowplow, Customer Data Infrastructure, Real-time, Terraform, AWS, GCP, Azure, Behavioral Data
```

---

## 🛠 Contributing

Pull requests are welcome!  
If you’d like to add features, fix bugs, or improve docs:

1. Fork the repo  
2. Create a new branch (`git checkout -b feature/my-feature`)  
3. Commit your changes (`git commit -m "Add my feature"`)  
4. Push to the branch (`git push origin feature/my-feature`)  
5. Open a Pull Request 🎉  

---