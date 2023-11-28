---
title: "Getting started with the Snowtype CLI"
sidebar_position: 1
---

## Introduction to the Snowtype CLI

Snowtype is a command-line interface that assists developers in implementing custom Snowplow tracking faster, more accurately and more intuitively. Since Snowplow events are always bound to a schema to ensure data quality, we can use this feature to enable type-checking, provide inline documentation and reduce time writing custom code. All that integrated into **your development workflow**.

## Installation

The Snowtype CLI is distributed through `npm` and `brew`. You can choose either one depending on your needs. 

```sh
npm install @snowtype/cli --save-dev
# or 
brew install @snowtype/cli
```

_We will show example commands using `npm` but it should work the same with either system._

