---
title: "Critical Snowplow security updates and their impact on open source software users"
description: "This is an update to our previous notification informing users of Snowplow Open Source Software releases (pre-2024) of the release of security patches for 5 CVEs, of which 4 are critical DOS type issues."
date: "2025-04-02"
update_type:
  - "Product news"
components:
  - "Trackers"
  - "Pipeline components"
  - "Destinations"
  - "Security"
---
> **Action may be required.**

This is an update to our [previous notification](/changelog/) informing users of Snowplow Open Source Software releases (pre-2024)* of the release of security patches for 5 CVEs, of which 4 are critical DOS type issues.

In line with responsible disclosure practices, we filed these vulnerabilities with [cve.org](http://cve.org/), and now 90 days have elapsed, we are hereby publicly disclosing the technical details. These are listed below, by Snowplow component.

_*Note, you can access the latest code containing the security patch today, but the_ [_Snowplow Limited Use License_](/limited-use-license-1.1/) _restricts usage of this software in a production environment._ To remove this restriction, or if you have any questions, please don't hesitate to reach out to [Snowplow Support](https://support.snowplow.io/).

## Iglu Server

Iglu Server is an important component of the Snowplow pipeline that’s responsible for storing and retrieving schemas (data structures). Enrichment, validation, loading, and various other processes and tools rely on this component.

### **CVE-2024-47212:** **Iglu Server Denial of Service #1**

|                |                                                     |
| -------------- | --------------------------------------------------- |
| Classification | Critical DoS Vulnerability - 8.8 CVSS Overall Score |
| Resolved in    | Iglu Server 0.13.1                                  |

This vulnerability affects Iglu Server 0.13.0 and below. It involves sending very large payloads to a particular API endpoint of Iglu Server and can render it completely unresponsive. If the operation of Iglu Server is not restored, event processing in the pipeline would eventually halt.

### **CVE-2024-47214****: Iglu Server Denial of Service #2**

|                |                                                     |
| -------------- | --------------------------------------------------- |
| Classification | Critical DoS Vulnerability - 9.1 CVSS Overall Score |
| Resolved in    | Iglu Server 0.13.1                                  |

This vulnerability affects Iglu Server 0.13.0 and below. It is similar to CVE-2024-47212, but involves a different kind of malicious payload. As above, it can render Iglu Server completely unresponsive. If the operation of Iglu Server is not restored, event processing in the pipeline would eventually halt.

### **CVE-2024-47217:** **Iglu Server Denial of Service #3**

|                |                                                     |
| -------------- | --------------------------------------------------- |
| Classification | Critical DoS Vulnerability - 8.1 CVSS Overall Score |
| Resolved in    | Iglu Server 0.13.1                                  |

This vulnerability affects Iglu Server 0.13.0 and below. It is similar to CVE-2024-47214, but involves an authenticated endpoint (hence the lower CVSS score). As above, it can render Iglu Server completely unresponsive. If the operation of Iglu Server is not restored, event processing in the pipeline would eventually halt.

##

## Collector

Collector is the principal component of the Snowplow pipeline, responsible for receiving all events from trackers and webhooks.

### **CVE-2024-56528:** **Collector Denial of Service**

|                |                                                     |
| -------------- | --------------------------------------------------- |
| Classification | Critical DoS Vulnerability - 7.0 CVSS Overall Score |
| Resolved in    | Collector 3.3.0                                     |

This vulnerability affects Collector 3.x (unless it’s set up behind a reverse proxy that establishes payload limits). It involves sending very large payloads to the Collector and can render it unresponsive to the rest of the requests. As a result, data would not enter the pipeline and would be potentially lost.

## Enrich

Enrich is a key Snowplow pipeline application responsible for enriching events and validating them against schemas.

### **CVE-2024-47213:** **Enrich Denial of Service**

|                |                                                     |
| -------------- | --------------------------------------------------- |
| Classification | Critical DoS Vulnerability - 9.1 CVSS Overall Score |
| Resolved in    | Enrich 5.1.1                                        |

This vulnerability affects Enrich 5.1.0 and below. It involves sending a maliciously crafted Snowplow event to the pipeline. Upon receiving this event and trying to validate it, Enrich crashes and attempts to restart indefinitely. As a result, event processing would be halted.

## Snowbridge

Snowbridge is an application used to forward Snowplow data to streams (e.g. Kafka) and third party applications via their HTTP API (e.g. Google Tag Manager).

### **CVE-2024-47215:** **Snowbridge Denial of Service**

|                |                                                 |
| -------------- | ----------------------------------------------- |
| Classification | High DoS Vulnerability - 8.9 CVSS Overall Score |
| Resolved in    | Configuration change (see below)                |

This vulnerability affects Snowbridge setups sending data to Google Tag Manager Server Side. It involves attaching an invalid GTM SS preview header to events, causing them to be retried indefinitely. As a result, the performance of forwarding events to GTM SS overall can be affected (latency, throughput).

To mitigate this attack, we recommend adding the following filter to Snowbridge configuration (already in place for all Snowplow CDI customers).

|                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| if ("contexts_com_google_tag-manager_server-side_preview_mode_1" in input.Data) \{  var ctst = String(input.Data\["collector_tstamp"])  var isoCtst = ctst.replace(" +0000 UTC", "Z").replace(" ", "T")  var dateCtst = new Date(isoCtst)  if (Date.now() - dateCtst > 300000) \{    return \{      FilterOut: true    \};  \}\} |

---

> **Action may be required.**

Users of Snowplow Open Source Software releases (pre-2024) should be aware that we have recently released security patches for 5 recently discovered CVEs, 4 of which are critical DOS type issues.

In line with responsible disclosure practices, we have filed these vulnerabilities with [cve.org](http://cve.org/) and in 90 days (April 2025), we will publicly disclose the technical details, allowing time for our subscription customers to upgrade before the exploit details are publicly disclosed.

If you are a Snowplow Open Source user you can access the latest code containing the security patch today, but note that the [Snowplow Limited Use License](/limited-use-license-1.1/) restricts usage of this software in a production environment.  To remove this restriction, [please reach out to the Snowplow team](https://snowplow.io/snowplow-oss-license-change).

If you are a Snowplow HA Pipeline customer, you may freely apply these patches today.  Please contact Snowplow Customer Support if you did not receive upgrade instructions.

If you are a Snowplow CDI customer, you do not have to worry, as no action is required. Your software has already been patched.
