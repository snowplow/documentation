
# Snowplow Guides & Tutorials

This directory contains the tutorials present at `/tutorials`.

## Structure

Each tutorial is a directory containing the following files:

### `meta.json`

This file keeps the metadata of the tutorial. It contains the following fields:

| Field        | Description                                                        |Format|
|--------------|--------------------------------------------------------------------|-|
| `title`      | The title of the tutorial, shown on the card and the tutorial page. |`string`|
| `description`| A short description of the tutorial, shown on the card.             |`string`|
| `topic`      | The topic of the tutorial, shown on the card  and the tutorial page.                      | One of: `'Tracking design'`, `'Tracking implementation'`, `'Data modeling'`, `'Infrastructure'`|

Example:

```json
{
  "title": "Video & Media Analytics",
  "description": "Track video events across media players",
  "topic": "Tracking design"
}
```

### Tutorial content

Each page of a tutorial is an MDX ([Markdown + JSX](https://docusaurus.io/docs/markdown-features/react)) file.

Each file expect two properties in the front matter:

| Field        | Description                                                        |Format|
|--------------|--------------------------------------------------------------------|-|
| `position`   | The position of the page in the tutorial.                          |`number`|
| `title`      | The title of the page. | `string`|

Example:

```mdx
---
position: 0
title: "Introduction"
---
```
