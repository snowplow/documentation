---
title: "Setup"
sidebar_label: "Setup"
date: "2021-03-31"
sidebar_position: 1000
description: "Install the Node.js tracker v3 using npm for your Node.js applications."
keywords: ["node.js tracker v3 setup", "npm installation"]
---

## Compatibility

The Snowplow Node.js Tracker is tested and compatible with Node.js versions from 10 to 20. Installation requires [npm](https://www.npmjs.org/), [pnpm](https://pnpm.js.org/) or [yarn](https://yarnpkg.com/).

## Installation

Setting up the tracker should be straightforward if you are familiar with npm:

```bash
npm install @snowplow/node-tracker
```

alternative you can use pnpm or yarn:

```bash
pnpm add @snowplow/node-tracker
```

```bash
yarn add @snowplow/node-tracker
```

The Snowplow Node.js Tracker is also **bundled with TypeScript types and interfaces** so will integrate easily with TypeScript applications.
