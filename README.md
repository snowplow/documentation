# Snowplow Documentation Website

This is the source for https://docs.snowplow.io/docs.

- [Contributing](#contributing)
- [How to preview locally](#how-to-preview-locally)
- [Checking spelling and grammar](#checking-spelling-and-grammar)
  - [VS Code extension](#vs-code-extension)
  - [Vale command-line interface](#vale-command-line-interface)
- [Organizing content](#organizing-content)
  - [Sidebar](#sidebar)
    - [Updating sidebar attributes for multiple sections at once](#updating-sidebar-attributes-for-multiple-sections-at-once)
  - [Offerings](#offerings)
  - [Links](#links)
  - [Concepts](#concepts)
  - [Reusable fragments](#reusable-fragments)
  - [Versioned modules](#versioned-modules)
  - [Moving pages around](#moving-pages-around)
    - [Moving multiple pages around at once](#moving-multiple-pages-around-at-once)
- [Formatting content](#formatting-content)
  - [Formatting your work using prettier](#formatting-your-work-using-prettier)
  - [Images](#images)
- [VSCode Snippets](#vscode-snippets)

## Contributing

Follow the [Snowplow style guide](https://docs.snowplow.io/style-guide) when contributing documentation.

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

## Checking spelling and grammar

This repository uses Vale for linting prose. To run Vale, you will need to install the VS Code extension, and/or install Vale onto your computer.

Vale has three levels of alert: error, warning, and suggestion. It won't automatically correct your text, it just flags potential problems.

Vale only checks normal prose. Text that's marked as code—code blocks or in-line code—isn't included for linting, nor file paths in links.

### VS Code extension

To install the extension, find "[Vale VSCode](https://marketplace.visualstudio.com/items?itemName=ChrisChinchilla.vale-vscode)" in the Extensions Marketplace within VS Code, then click **Install**.

The Vale extension will automatically check files when they're opened or saved. It underlines the flagged sections in different colors, based on the severity of the alert - red for errors, orange for warnings, and blue for suggestions. Mouse-over the underlined section to see the alert message, or check the VS Code **Problems** tab.

### Vale command-line interface

To [install the Vale CLI](https://vale.sh/docs/install) globally in your Mac, run:

```bash
$ brew install vale
```

Lint files by passing a path to the `vale` command.
`$ vale {path}`

It works recursively with folders or individual files, for example:
`$ vale docs/account-management` or `$ vale docs/sources/trackers/mobile-trackers/client-side-properties/index.md`

To see only alerts over a certain level, use the `--minAlertLevel` flag, for example:
`$ vale --minAlertLevel=warning docs/account-management`


[Vale CLI options](https://vale.sh/docs/cli)


## Organizing content

In this section you’ll find some general tips on how the docs are structured.

### Sidebar

The sidebar on the left follows [file structure](https://github.com/snowplow/documentation/tree/main/docs) (all docs are in the `/docs` folder). So when you add new pages, create folders as you see fit.

To control the position of a section in the sidebar, go to the `index.md` file for that section and adjust the `sidebar_position` attribute at the top (see [this example](https://github.com/snowplow/documentation/blob/main/docs/tutorials/index.md)). Sidebar positions are just numbers, and you can use any number as long as the order is correct.

The text shown in the sidebar doesn't have to be the same as the page title. Use the `sidebar_label` attribute to specify a different label for the section.

#### Updating sidebar attributes for multiple sections at once

To update the `sidebar_position`, `sidebar_label`, and/or page title for multiple sections in one go, you can use the `extract_index_attributes.rb` script followed by the `update_index_attributes.rb` script. They're both in the root of this repo.

Use the `extract_index_attributes.rb` script like this, providing a path to the parent folder you're interested in:

```bash
ruby extract_index_attributes.rb docs/collecting-data
```

It will output the relevant attributes of that folder's `index.md` file, and the `index.md` files of subfolders in it (just 1 level deep), into a new file called `update_attributes_here.txt` (in the repo root). The file will look something like this:

```txt
docs/data-product-studio/data-quality/failed-events
- title: "Managing data quality"
- sidebar_label: "Failed events"
- sidebar_position: 3

	docs/data-product-studio/data-quality/failed-events/exploring-failed-events
	- title: "Exploring failed events"
	- sidebar_label: "Explore"
	- sidebar_position: 3
```
Update the attributes to the new values you want. You can delete the sections for any folders you don't want to edit.

To also output the attributes of the next level of subfolders inside each subfolder (so 2 levels deep in total), use the `-r` flag:

```bash
ruby extract_index_attributes.rb -r docs/collecting-data
```

Once you finish editing `update_attributes_here.txt`, save the file and run the `update_index_attributes.rb` script:

```bash
ruby update_index_attributes.rb
```

It'll update the `index.md` files as appropriate.

You can now delete the `update_attributes_here.txt` file.

### Offerings

Some documentation is only relevant to a particular offering. You can indicate it like this:
```
---
title: ...
...
sidebar_custom_props:
  offerings:
    - cdi
...
---
```

This will result in an icon appearing in the sidebar, as well as an automatic banner on the page, specifying that the docs only apply to a given offering.

The available values are: `cdi` and `community`. Do not specify both values at once — if a piece of documentation is relevant to all offerings, there should be no `offerings` property as that’s the default.

Whenever the same functionality can be achieved in multiple offerings but in a different way (e.g. managing schemas), create a parent folder (“Managing schemas”) that’s offering-neutral, and then add offering-specific pages inside it. This way, other pages can link to the generic page without having to specify different methods for different offerings.

### Links

For links within this documentation, please end the link with `/index.md`. This way all links will be checked, and you’ll get an error if a link is broken at any point.

If you forgot to do this, you can quickly fix a bunch of links by running `./make-links-validatable.sh`. (You might need to install the `moreutils` package via `brew install moreutils` to get the `sponge` command.)

Avoid using relative links (e.g. `../../setup/index.md`) unless within a versioned module section.

### Concepts

There are several key concepts in Snowplow: events (self-describing, structured), entities, schemas. We must ensure that we use and explain them consistently.

**Please, use up-to-date terms:**
* _Self-describing event_, not _unstructured event_
* _Entities_, not _contexts_ (it’s ok-ish to refer to a set of entities as “context”, but only in a casual sense, as in “these provide some context to the event”)
* _Failed events_ and not _bad rows_, unless specifically referring to the legacy bad row JSON format and associated tooling
* If you are writing about schemas, pick “schema” or “data structure” and stick with it

**Please, do not over-explain these in any of your writing.** Instead, just link to one of the existing concept pages:
* Events in general: `/docs/fundamentals/events/index.md`
* Custom events: `/docs/fundamentals/events/index.md#self-describing-events`
* Self-describing events: `/docs/fundamentals/events/index.md#self-describing-events`
* Structured events: `/docs/fundamentals/events/index.md#structured-events`
* Entities in general: `/docs/fundamentals/entities/index.md`
* Custom entities: `/docs/fundamentals/entities/index.md#custom-entities`
* Schemas: `/docs/fundamentals/schemas/index.md`
* Iglu resolvers/registries: `/docs/fundamentals/schemas/index.md#iglu`
* Failed events: `/docs/fundamentals/failed-events/index.md`

### Reusable fragments

You can create reusable fragments and include them in multiple files (see [this example](https://github.com/snowplow/documentation/blob/303165da0698b15d7ad13a50e40eeacadcaea098/docs/storing-querying/storage-options/index.md)).

### Versioned modules

Some of our modules are versioned (e.g. trackers, loaders). Here are a few simple rules to follow.

* Within pages for versioned modules ONLY, use **relative links** (e.g. `../setup/index.md`) when pointing to pages for the same version. This helps moving directories around without breaking the links.
* For the latest docs, **don’t include the version number in the URL**. Otherwise we’d need to update internal links to it with every version change (also, it would get indexed and we’ll need to add a redirect later to avoid breaking external links). For example, see the [Scala tracker docs](https://github.com/snowplow/documentation/tree/main/docs/collecting-data/collecting-from-own-applications/scala-tracker) — the path ends with `scala-tracker` rather than `scala-tracker-2-0`.
* **Put older versions in a single folder, e.g. `previous-versions/`**. In the `index.md` for that folder, add the following:
  ```
  sidebar_custom_props:
    outdated: true
  ```
  This automatically enables the “you are looking at an old version” warning. See the [Scala tracker docs](https://github.com/snowplow/documentation/tree/main/docs/collecting-data/collecting-from-own-applications/scala-tracker) for an example of how to add the `previous-versions` directory and what to put there.
* When a new version is released, you can either update the latest version pages, or move them to `previous-versions` and replace with the new content. If there are not too many breaking changes, you might want to do the former to avoid having too many previous version directories.
* Put the latest bugfix version for each component into [componentVersions.js](https://github.com/snowplow/documentation/blob/main/src/componentVersions.js). This way you only need to update it in one place when a new bugfix release comes out. See the [Scala tracker docs](https://raw.githubusercontent.com/snowplow/documentation/main/docs/collecting-data/collecting-from-own-applications/scala-tracker/setup/index.md) for how to then use this on the page. If you need to use them in a markdown table you will have to render it in a particular way for it to work, see the [dbt package docs](https://raw.githubusercontent.com/snowplow/documentation/main/docs/modeling-your-data/modeling-your-data-with-dbt/index.md) for an example.

### Moving pages around

When you move pages around, make sure to add a redirect in `static/_redirects`.
This ensures that any external links pointing to the old URL still work.

To easily accomplish this, you can use `./move.sh`. (You might need to install the `moreutils` package via `brew install moreutils` to get the `sponge` command.)

```bash
./move.sh docs/old/page/location docs/new/page/location
```

This command will automatically move the pages, create redirect rules, and add all changes to git.

Note: the script is somewhat brittle, and you need to follow these rules:
* Only run it from the root of the repo
* Use relative paths, starting with `docs/` (like above)
* End the path on a directory, rather than an `index.md`
* Do not include trailing slashes

#### Moving multiple pages around at once

To move multiple sections at once, use the `move-multiple.sh` script. It's a wrapper around the `move.sh` script, so it has the same limitations as that one.

Add the old and new paths to the `moves` array at the top of the `move-multiple.sh` script. For example:

```bash
moves=(
    "docs/collecting-data docs/sources",
    "docs/contributing docs/resources/contributing"
)
```

Run the script with

```bash
./move-multiple.sh
```

It will run the `move.sh` script for each move command, in order. If a folder in the new path doesn't exist, it'll create it.

Additionally, you can add a new sidebar label for each move command. It'll be added to (or update existing) the `index.md` file of the moved folder. This can make it easier to find your rearranged pages.

For example:

```bash
moves=(
    "docs/collecting-data docs/sources Sources NEW Update this",
)
```

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
- If you are editing a page with an existing diagram you cannot recreate, you can replace the existing image link with the below, which will add the light background even in dark mode. If you do this please also comment on the [issue here](https://github.com/snowplow/documentation/issues/308) to let us know so we can try and re-make the diagram in the future.
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
