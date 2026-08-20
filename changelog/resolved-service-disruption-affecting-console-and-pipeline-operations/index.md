---
title: "[RESOLVED] Service disruption affecting Console and pipeline operations"
description: "Pipeline processing jobs are now running normally and working through any backlog accumulated during the disruption."
date: "2026-04-16"
update_type:
  - "Maintenance notification"
components:
  - "Console"
---
**Update (17 April 2026, 11:12 UTC):** This incident is now resolved. All services have been restored.

Pipeline processing jobs are now running normally and working through any backlog accumulated during the disruption. Some customers may notice a temporary delay in data appearing in their warehouse destinations as jobs catch up. All buffered data will be delivered and no data has been lost.

**Update (17 April 2026, 08:40 UTC):** We are experiencing a recurrence of the service disruption reported yesterday. Snowplow Console were again briefly affected by the same underlying issue during a planned infrastructure update this morning.

Console access has been restored as of approximately 08:33 UTC. However, the following services remain affected while our team completes the infrastructure update:

* Pipeline processing jobs (including shredder and data modeling) are temporarily paused. Some customers may observe a delay in data delivery to their warehouse destinations. Events continue to be collected and buffered, and all data will be processed once jobs resume. No data will be lost.

* Event Specification deployments are temporarily blocked.

**Update (16 April 2026, 11:47 UTC):** This incident has been fully resolved. All affected services have been verified as operational.

**Update (16 April 2026, 11:04 UTC):** All affected services have been restored. Our team is currently verifying that all dependent services, including alerting, are functioning as expected. We will confirm full resolution once monitoring is complete.

**Update (16 April 2026 09:15 UTC)** We are currently investigating a service disruption affecting the Console.

**Current Status:** Resolved
