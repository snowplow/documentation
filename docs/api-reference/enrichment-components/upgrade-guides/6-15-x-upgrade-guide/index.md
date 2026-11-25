---
title: "Enrich 6.15.x upgrade guide for SQL Query Enrichment certificate verification"
sidebar_label: "6.15.x upgrade guide"
sidebar_position: -10
description: "Upgrade guide for Enrich 6.15.x, where the SQL Query Enrichment verifies the database server certificate and hostname when sslMode is true."
keywords: ["enrich 6.15", "sql query enrichment", "sslMode", "certificate verification"]
date: "2026-11-25"
content_type: how-to
---

This guide only applies if you use the [SQL Query Enrichment](/docs/pipeline/enrichments/available-enrichments/custom-sql-enrichment/index.md) with `sslMode: true`.

From Enrich 6.15.0, when `sslMode` is `true`, Enrich verifies the database server certificate against the JVM truststore, and checks that the certificate matches the `host` in the enrichment configuration. Earlier versions encrypted the connection but accepted any certificate.

Before you upgrade, make sure that:

* the server certificate is signed by a certificate authority that the JVM trusts
* the `host` in your enrichment configuration matches a name on the certificate

If your database uses a certificate from a private or provider-specific certificate authority, add that authority to a truststore and point Enrich's JVM at it using the standard `javax.net.ssl.trustStore` system property.
