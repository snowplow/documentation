---
title: "Setup"
description: "Set up PHP tracker for server-side behavioral event collection in PHP applications."
schema: "TechArticle"
keywords: ["PHP Setup", "PHP Configuration", "PHP Analytics", "Server PHP", "PHP Integration", "Backend PHP"]
date: "2020-02-26"
sidebar_position: 10
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

## Installation

Currently the only supported method of installation is through Composer. For a tutorial on setting up a PHP project with Composer please follow this [link](https://getcomposer.org/doc/00-intro.md).

### Composer

If using Composer to manage your dependencies, simply add the Snowplow PHP Tracker to your project by running:

```bash
composer require snowplow/snowplow-tracker
```

to include it in your `composer.json` file as a dependency.

You can also add it manually:

<CodeBlock language="json" title="composer.json">{
`{
    "require": {
        "snowplow/snowplow-tracker": "${versions.phpTracker}"
    }
}`
}</CodeBlock>

Assuming you have Composer setup correctly in the root of your project. Type the following command line argument:

```bash
composer update # Will update lockfile and install dependencies
```

This will install the Snowplow Tracker and allow you to initialize a Tracker object:

```php
// Bare minimum Tracker initialization.

use Snowplow\Tracker\Tracker;
use Snowplow\Tracker\Subject;
use Snowplow\Tracker\Emitters\SyncEmitter;

$emitter = new SyncEmitter("collector_uri");
$subject = new Subject();
$tracker = new Tracker($emitter, $subject);
```
