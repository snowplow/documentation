# Snowplow Documentation Website

This is the source for https://docs.snowplow.io/docs.

* [Contributing](#contributing)
* [How to preview locally](#how*to-preview-locally)
* [Organizing content](#organizing-content)
* [Formatting content](#formatting-content)

## Contributing

All contributions are welcome, from [reporting issues](https://github.com/snowplow/documentation/issues/new) to correcting typos and formatting to full-blown how-tos and guides.

If you are new to Github, the easiest way to propose changes is [via the UI](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files#editing-files-in-another-users-repository).

For more substantial contributions, below you can find tips on how to preview your changes, as well as how to organize and format your content.

## How to preview locally

Step 1. Clone this repository.

Step 2 (one-time setup). Install some tools:

```bash
brew install node
brew install yarn
# On Linux, use your favorite package manager
```

Step 3. Install dependencies and start the preview:

```bash
yarn
yarn start
```

(Hitting an error with `yarn start`? `brew upgrade yarn` and try again. Yarn might also suggest further commands to update `docusaurus`.)

Step 4. Go to `localhost:3000` in your browser and enjoy!

## Organizing content

In this section you’ll find some general tips on how the docs are structured.

### Sidebar

The sidebar on the left follows [file structure](https://github.com/snowplow/documentation/tree/main/docs) (all docs are in the `/docs` folder). So when you add new pages, create folders as you see fit.

To control the position of a section in the sidebar, go to the `index.md` file for that section and adjust the `sidebar_position` attribute at the top (see [this example](https://github.com/snowplow/documentation/blob/main/docs/tutorials/index.md)). Sidebar positions are just numbers, and you can use any number as long as the order is correct.

### Links

For links within this documentation, please end the link with `/index.md`. This way all links will be checked, and you’ll get an error if a link is broken at any point.

### Reusable fragments

You can create reusable fragments and include them in multiple files (see [this example](https://github.com/snowplow/documentation/blob/main/docs/getting-started-with-snowplow-bdp/what-is-snowplow-bdp/feature-comparison/index.md)).

### Versioned modules

Some of our modules are versioned (e.g. trackers, loaders). Here are a few simple rules to follow.

* Within pages for versioned modules, use **relative links** (e.g. `../setup/index.md`) when pointing to pages for the same version. This helps moving directories around without breaking the links.
* For the latest docs, **don’t include the version number in the URL**. Otherwise we’d need to update internal links to it with every version change (also, it would get indexed and we’ll need to add a redirect later to avoid breaking external links). For example, see the [Scala tracker docs](https://github.com/snowplow/documentation/tree/main/docs/collecting-data/collecting-from-own-applications/scala-tracker) — the path ends with `scala-tracker` rather than `scala-tracker-2-0`.
* **Put older versions under `previous-versions/`**. This automatically enables the “you are looking at an old version” warning. See the [Scala tracker docs](https://github.com/snowplow/documentation/tree/main/docs/collecting-data/collecting-from-own-applications/scala-tracker) for an example of how to add the `previous-versions` directory and what to put there.
* When a new version is released, you can either update the latest version pages, or move them to `previous-versions` and replace with the new content. If there are not too many breaking changes, you might want to do the former to avoid having too many previous version directories.
* Put the latest bugfix version for each component into [componentVersions.js](https://github.com/snowplow/documentation/blob/main/src/componentVersions.js). This way you only need to update it in one place when a new bugfix release comes out. See the [Scala tracker docs](https://raw.githubusercontent.com/snowplow/documentation/main/docs/collecting-data/collecting-from-own-applications/scala-tracker/setup/index.md) for how to then use this on the page.

### Moving pages around

When you move pages around, make sure to add a redirect in `static/_redirects`.
This ensures that any external links pointing to the old URL still work.

## Formatting content

In this section you’ll find some general tips on how to write the pages.

The documentation is written in Markdown. In addition, since we are using Docusaurus, [more features are available](https://docusaurus.io/docs/markdown-features). Here are a few of our favorites:

* Use [“admonitions”](https://docusaurus.io/docs/markdown-features/admonitions) (e.g. `:::note`) to draw attention to a certain paragraph.
* Use [collapsible blocks](https://docusaurus.io/docs/markdown-features#details) for information that most readers will want to skip.
* Use [code blocks](https://docusaurus.io/docs/markdown-features/code-blocks) for code, and don’t forget to specify the languange.
* Use [tabs](https://docusaurus.io/docs/markdown-features/tabs) for content where multiple alternatives are possible (e.g. iOS code vs Android code). Inside the tabs, try to only put the content that differs.

### Formatting your work using prettier

To ensure consistency of our codebase we also utilize [prettier](https://prettier.io) to format our source files and enforce correctness in a CI step.

For the best experience set up your IDE to automatically format files on save. Here's a [guide for VSCode](https://blog.yogeshchavan.dev/automatically-format-code-on-file-save-in-visual-studio-code-using-prettier).

You can also run the formatter command before committing changes manually:

```bash
yarn format
```

### Images
We need to ensure that all images are visible in both light and dark themes, if your image does not have a background this can be achieved in a few ways:
- Where possible for diagrams prefer the use of [mermaid diagrams](https://mermaid.js.org/intro/) as these adjust automatically
- If you are using `drawio` diagrams, ensure that either the diagram has a non-transparent background, or provide a dark and light mode version using [Themed images](https://docusaurus.io/docs/next/markdown-features/assets#themed-images). If possible also include a copy of your diagram in the image as part of the export to allow easy editing in the future.
- If you are editing a page with an existing diagram you cannot recreate, you can replace the existing image link with the below, which will add the light background even in dark mode. If you do this please also comment on the [issue here](TBC) to let us know so we can try and re-make the diagram in the future.
    ```html
    <div style={{"background-color": '#F2F4F7'}}>
    <img src={require("./images/IMAGE_NAME.png").default}/>
    </div>
    ```


## VSCode Snippets

We have created a selection of [VSCode Snippets](https://code.visualstudio.com/docs/editor/userdefinedsnippets) that cover some of the common, but fiddly, blocks of code you may require when writing docs. You can trigger these by starting to type their name and then pressing tab or use `Insert Snippet` in the Command Palette. All snippets we have created can be found [here](https://github.com/snowplow/documentation/blob/main/.vscode/snowplow-docs.code-snippets) and we currently have ones for:
- [Admonitions](https://docusaurus.io/docs/markdown-features/admonitions) 
- [Collapsible blocks](https://docusaurus.io/docs/markdown-features#details)
- [Tabs](https://docusaurus.io/docs/markdown-features/tabs) 
- [Themed images](https://docusaurus.io/docs/next/markdown-features/assets#themed-images)
- [DocCards](https://docusaurus.io/docs/sidebar/items#embedding-generated-index-in-doc-page)
- [Mdx blocks](https://docusaurus.io/docs/markdown-features/react#importing-components) for enabling tabs and themed images
- [Front matter](https://docusaurus.io/docs/markdown-features#front-matter) 
