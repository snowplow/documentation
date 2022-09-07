# Snowplow Documentation Website

This is the source for https://docs.snowplow.io/docs.

* [Contributing](#contributing)
* [How to preview locally](#how*to-preview-locally)
* [Organizing content](#organizing-content)
* [Formatting content](#formatting-content)

## Contributing

All contributions are welcome, from [reporting issues](https://github.com/snowplow/snowplow.github.io/issues/new) to correcting typos and formatting to full-blown how-tos and guides.

If you are new to Github, the easiest way to propose changes is [via the UI](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files#editing-files-in-another-users-repository).

For more substantial contributions, below you can find tips on how to preview your changes, as well as how to organize and format your content.

## How to preview locally

Step 1. Clone this repository.

Step 2 (one-time setup). Install some tools:

```bash
brew install yarn
# On Linux, use your favorite package manager
```

Step 3. Install dependencies and start the preview:

```bash
yarn
yarn start
```

Step 4. Go to `localhost:3000` in your browser and enjoy!

## Organizing content

In this section you’ll find some general tips on how the docs are structured.

### File naming

Take a look at the [file structure](https://github.com/snowplow/snowplow.github.io/tree/main/docs) (all docs are in the `docs` folder).

If you are adding a new page, there are 2 options for how to name the file:

If the page does not contain any subpages or images, name it `<page>.md`. For example:

```
docs/collecting-data/collecting-from-own-applications/flutter-tracker/
├── adding-data.md
├── getting-started.md
...
├── initialization-and-configuration.md
├── sessions-and-data-model.md
└── tracking-events.md
```

Otherwise, create a directory for the page, and name the page itself `index.md`. For example:

```
docs/collecting-data/collecting-data-from-third-parties/mailgun/
├── images
│   ├── mailgun-1.png
│   ├── mailgun-2.png
│   └── mailgun-3.png
└── index.md
```

You can of course mix the two approaches:

```
docs/understanding-tracking-design/
├── introduction-to-tracking-design.md                 ← using a file
├── managing-data-structures                           ← using a directory
│   ├── images
│   └── index.md
...
└── versioning-your-data-structures.md
```

### Sidebar

The sidebar on the left follows the [file structure](https://github.com/snowplow/snowplow.github.io/tree/main/docs) automatically.

To control the position of a section in the sidebar, go to the Markdown file for that section (either a `<page>.md` or an `index.md`) and adjust the `sidebar_position` attribute at the top (see [this example](https://github.com/snowplow/snowplow.github.io/blob/main/docs/tutorials/index.md)). Sidebar positions are just numbers, and you can use any number as long as the order is correct.

### Links

For links within this documentation, please end the link with `.md` (i.e. `<page>/index.md` or `<page>.md`, depending on how the files are structured). This way all links will be checked, and you’ll get an error if a link is broken at any point.

### Reusable fragments

You can create reusable fragments and include them in multiple files (see [this example](https://github.com/snowplow/snowplow.github.io/blob/main/docs/getting-started-with-snowplow-bdp/what-is-snowplow-bdp/feature-comparison.md)).

## Formatting content

In this section you’ll find some general tips on how to write the pages.

The documentation is written in Markdown. In addition, since we are using Docusaurus, [more features are available](https://docusaurus.io/docs/markdown-features). Here are a few of our favorites:

* Use [“admonitions”](https://docusaurus.io/docs/markdown-features/admonitions) (e.g. `:::note`) to draw attention to a certain paragraph.
* Use [code blocks](https://docusaurus.io/docs/markdown-features/code-blocks) for code, and don’t forget to specify the languange.
* Use [tabs](https://docusaurus.io/docs/markdown-features/tabs) for content where multiple alternatives are possible (e.g. iOS code vs Android code). Inside the tabs, try to only put the content that differs.

### Formatting your work using prettier
To ensure consistency of our codebase we also utilize [prettier](https://prettier.io) to format our source files and enforce correctness in a CI step.

For the best experience set up your IDE to automatically format files on save. Here's a [guide for VSCode](https://blog.yogeshchavan.dev/automatically-format-code-on-file-save-in-visual-studio-code-using-prettier).

You can also run the formatter command before committing changes manually:

```bash
yarn format
```
