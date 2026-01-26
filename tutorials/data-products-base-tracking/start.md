---
position: 1
title: "Learn how to track web events with base tracking plans"
sidebar_label: "Introduction"
description: "Learn how to implement web tracking using Data Product Studio, source applications, and Snowtype code generation for a React TodoMVC application."
keywords: ["data product studio tutorial", "snowtype code generation"]
---

This guide will help you understand some of the basic capabilities of tracking plans and how they can be used in practice for most tracking implementation setups.

## Prerequisites
- A [collector](/docs/pipeline/collector/) endpoint.
- A [Console API key](/docs/event-studio/snowtype/using-the-cli/#authenticating-with-the-console) for generating code using Snowtype.

## What you'll be doing

This recipe will showcase how a basic tracking setup can be implemented using Event Studio capabilities such as Source Applications, tracking plans and their related Snowtype features.

This basic tracking setup will include:
- Page views and page pings
- Link clicks
- Custom events

For demonstration purposes we are going to be using a [TodoMVC](https://todomvc.com/) clone built with [React.js](https://react.dev/).

If you want to follow along you can:
1. Clone the repository using`git clone git@github.com:snowplow-incubator/data-products-basic-tracking-recipe.git`.
2. Change into the project directory and install the dependencies using `npm install`.
3. Run the development server using `npm run dev`.
4. Open http://localhost:5173/ to see the app.
