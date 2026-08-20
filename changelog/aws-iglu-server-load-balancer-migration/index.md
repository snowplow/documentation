---
title: "[AWS] Iglu Server load balancer migration"
description: "As part of our ongoing efforts to make the pipeline more cost-effective and easier to manage, we are migrating various applications from Amazon Elastic Container Service (ECS) to Elastic Kubernetes Service (EKS)."
date: "2025-01-27"
update_type:
  - "Maintenance notification"
components:
  - "AWS"
  - "Iglu"
---
> **This notice only applies to AWS customers.**

As part of our ongoing efforts to make the pipeline more cost-effective and easier to manage, we are migrating various applications from Amazon Elastic Container Service (ECS) to Elastic Kubernetes Service (EKS).

We are currently focused on Iglu Server — the pipeline component responsible for storing your schemas (data structures). To migrate it to EKS, we will transition from Application Load Balancers (ALBs) to Network Load Balancers (NLBs) combined with [Traefik](https://traefik.io/traefik/). This brings a notable cost benefit: with the new setup we’ll only need a single AWS load balancer rather than two independent ones for development and production Iglu Servers.

At this point, the migration is only possible for your infrastructure if you are _not_ using a Web Application Firewall (WAF) in front of the Iglu Server ALBs. If you are, please let us know by opening a support ticket. In any case, we will proceed to verify this on our side, for which we are going to add a `wafv2:ListWebACLs` permission to our IAM roles. This permission will allow us to see if a WAF is being used; it does not have any other impact on your infrastructure.

If you have any questions or concerns about this update, please don’t hesitate to reach out to us at support\@snowplow\.io.
