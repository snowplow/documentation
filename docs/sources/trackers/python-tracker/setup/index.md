---
title: "Setup"
description: "Set up Python tracker for server-side behavioral event collection in Python applications."
schema: "TechArticle"
keywords: ["Python Setup", "Python Configuration", "Python Analytics", "Server Python", "Python Integration", "Backend Python"]
date: "2023-06-14"
sidebar_position: 10
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

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

### PyPI

The Snowplow Python Tracker is published to [PyPI](https://pypi.python.org/), the the official third-party software repository for the Python programming language.

This makes it easy to either install the tracker locally, or to add it as a dependency into your own Python app.

### pip

To install the Snowplow Python Tracker locally, assuming you already have `pip` installed:

```bash
$ pip install snowplow-tracker --upgrade
```
To add the Snowplow Tracker as a dependency to your own Python app, edit your `requirements.txt` and add:

<CodeBlock language="txt">{
`snowplow-tracker==${versions.pythonTracker}`
}</CodeBlock>

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