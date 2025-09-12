---
title: "Setup"
description: "Setup guide for Python tracker version 0.15 in server-side applications."
schema: "TechArticle"
keywords: ["Python V0.15", "Legacy Setup", "Previous Version", "Python Setup", "Deprecated Setup", "Legacy Installation"]
date: "2020-02-26"
sidebar_position: 10
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

## Integration options

### Tracker compatibility

As a programming language that lets you work more quickly and integrate your systems more effectively, Python is available in a huge number of different computing environments and platforms, from Civilization IV through [Django framework](https://www.djangoproject.com/) to Ubuntu One.

To make the Snowplow Python Tracker work out-of-the-box with as many different Python programs as possible, we have tried to:

1. Minimize external dependencies and third party libraries
2. Provide setup instructions

### Dependencies

To make the Snowplow Python Tracker work with as many different Python programs as possible, we have tried to keep external dependencies to a minimum. The main external dependencies currently are:

- [Requests](https://pypi.python.org/pypi/requests) – HTTP library
- [Python typing extensions](https://pypi.org/project/typing-extensions/) – Backported type hints for Python

These dependencies can be installed from the package manager of the host system or through PyPi.

In addition, since version **0.9.0**, extra functionality, like the redis and celery emitters, was separated and needs to be explicitly installed, so as to keep the core version as light as possible.

## Setup

### PyPI

The Snowplow Python Tracker is published to [PyPI](https://pypi.python.org/), the the official third-party software repository for the Python programming language.

This makes it easy to either install the tracker locally, or to add it as a dependency into your own Python app.

### pip

To install the Snowplow Python Tracker locally, assuming you already have Pip installed:

```bash
$ pip install snowplow-tracker --upgrade
```

**_\*\*New in v0.9.0_** : To install the Snowplow Tracker with extras:

```bash
# Redis extra
$ pip install snowplow-tracker[redis]
# Celery extra
$ pip install snowplow-tracker[celery]
```

To add the Snowplow Tracker as a dependency to your own Python app, edit your `requirements.txt` and add:


<CodeBlock language="bash">{
`snowplow-tracker==0.15.0`
}</CodeBlock>


### easy_install

If you are still using easy_install:

```bash
$ easy_install -U snowplow-tracker
```

## Python version support

Please refer to the table below to identify the recommended tracker version for your Python version.

<table>
    <tr>
        <th>Python Version</th>
        <th>snowplow-tracker Version</th>
    </tr>
    <tr>
        <td>>=3.5</td>
        <td>{versions.pythonTracker}</td>
    </tr>
    <tr>
        <td>2.7</td>
        <td>0.9.1</td>
    </tr>
</table>