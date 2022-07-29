---
title: "Installing the Elasticsearch Loader"
date: "2020-02-26"
sidebar_position: 10
---

### Getting started

You can choose to either:

1. Download the Elasticsearch Loader jarfile, _or:_
2. Compile it from source

### Downloading the jarfile

To get a local copy, you can download the executable jarfile directly from our Hosted Assets bucket on Amazon S3 - please see our [Hosted assets](https://github.com/snowplow/snowplow/wiki/Hosted-assets) page for details.

### Compiling from source

Alternatively, you can build it from the source files. To do so, you will need [scala](https://www.scala-lang.org) and [sbt](http://www.scala-sbt.org) installed.

To do so, clone the Elasticsearch loader repo:

```bash
$ git clone https://github.com/snowplow/snowplow-elasticsearch-loader.git
```

Use `sbt` to resolve dependencies, compile the source, and build a fat JAR file with all dependencies.

```bash
$ sbt "project http" assembly # if you want to use the HTTP API compatible with every ES versions.
$ sbt "project tcp" assembly # if you want to use the transport API with a 5.x cluster
$ sbt "project tcp2x" assembly # if you want to use the transport API with a 2.x cluster
```

You will then find the fat jar in the corresponding directory: `{http,tcp,tcp2x}/target/scala-2.11/snowplow-elasticsearch-loader-{http,tcp,tcp-2x}-0.10.0.jar`. It is now ready to be deployed.
