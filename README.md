# Snowplow Documentation Website (BETA! coming soon)

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern
static website generator.

## Possible pre-requisites

You might need to install some tools to get this running.

```bash
brew install yarn
```

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window.
Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be
served using any static contents hosting service.

## Deployment

Push changes back to your branch and then merge into main branch.  The Github
Actions will deploy the change across into gh_pages branch that GitHub pages
picks up.

Note that when setting up in GitHub, create two branches:

- main - default branch, protected
- gh-pages - protected

## Importing from Wordpress

First, initialise the `wordpress-export-to-markdown` submodule:

```bash
pushd wordpress-export-to-markdown
npm install
popd
```

Next, install some more tools:

```bash
pip3 install yq
# on Mac
brew install moreutils
# on Linux use your preferred package manager to install the same
```

Then export the content from Wordpress (choose “All content”).

Finally, run the import script.

```bash
./import.sh <your-export-file.xml>
```

You can now compare the changes introduced by the import by running:

```
git diff --no-index --stat docs /tmp/docs
```