---
title: "Static Iglu repository on web servers"
sidebar_label: "Static repo"
date: "2021-03-26"
sidebar_position: 4000
description: "Host Iglu schemas as a static website on S3, Apache, Nginx, or IIS for HTTP-accessible schema repositories."
keywords: ["static iglu repo", "s3 schema hosting", "static schema registry"]
---

A static repo is simply an Iglu repository server structured as a static website. [Iglu Central](/docs/api-reference/iglu/iglu-central-setup/index.md) can be used as an example, [serving](https://iglucentral.com/) its whole content over http.

## 1. Choose a hosting partner

We host static Iglu registry using Amazon S3, but you can choose any existing webserver your company is already using, such as Apache, IIS or Nginx.

## 2. Prepare your files

You need to create a file structure for your JSON Schemas. Please check out the template we provide here:

[https://github.com/snowplow/iglu/tree/master/2-repositories/static-registry/template](https://github.com/snowplow/iglu/tree/master/2-repositories/static-registry/template)

Make the following changes:

- Replace `com.myvendor` with your company domain, reverse-ordered
- Replace `myschema` with the name of your first JSON Schema
- Leave `jsonschema` as-is (we only support JSON Schemas for now)
- Replace `1-0-0` with the schema specification of your first JSON Schema

Writing JSON Schemas is out of scope for this setup guide - see [Self-describing-JSONs-and-JSON-Schemas](/docs/api-reference/iglu/common-architecture/self-describing-json-schemas/index.md) for details.

Done? Now you are ready to host your files.

## 3. Host the files in your schema registry

To host your static schema registry, follow the AWS guide, [Host a Static Website on Amazon Web Services](http://docs.aws.amazon.com/gettingstarted/latest/swh/website-hosting-intro.html).

To host your static schema on an alternative webserving platform, please consult the appropriate webserver documentation or talk to your Systems team.

## 4. Update your Iglu client configuration

Finally, update your Iglu client configuration so that it can resolve your new registry.

For details on how to do this, check out the page on [Iglu client configuration](/docs/api-reference/iglu/iglu-resolver/index.md).
