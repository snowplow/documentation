---
title: "What is installed into my cloud? (old version)"
date: "2020-11-23"
sidebar_position: 0
---

#### Overview

Try Snowplow is a minified version of the Snowplow BDP technology that uses the same core components as Snowplow BDP. It is deployed into your own cloud environment, and consists of the following:

1. A Postgres database, for which you create a username and password during setup.
2. The 'pipeline', a small version of the Snowplow BDP technology that collects and processes events, and then writes them to the database.
3. The 'agent', an API application that provides a communication gateway between the Try Snowplow UI and your deployment, as well as us (Snowplow) and your deployment (more details on this can be found in the agent section).
4. A Traefik load balancer, responsible for generating TLS certificates via LetsEncrypt, and routing traffic to the pipeline and agent.
5. Cloud-native resources to support the deployment of the components listed above (more details can be found in the infrastructure section).

Access to your infrastructure

Snowplow does not have any access to your cloud environment to manage the running of Try Snowplow in any way.

#### Infrastructure

Try Snowplow uses the following AWS services:

- Secrets Manager (storing credentials)
- EC2 Networking Stack with Elastic Load Balancer (routing HTTP requests to Try Snowplow)
- Elastic Container Service (hosting the Try Snowplow containers)
- IAM (managing security roles for the Try Snowplow containers)
- RDS (hosting the Postgres database)

#### The agent

The agent has an http API that can expose details of your pipeline. 

The Try Snowplow UI communicates with the agent to populate information fields in the UI. Requests to the agent must contain an authorization header with an access token signed by AWS Cognito, and belong to the specific user who deployed the infrastructure.

The agent also exposes certain metrics about your pipeline to Snowplow, such as the health of your pipeline and aggregated information about how the pipeline is used (number of events collected good and bad, types of events collected, trackers used, etc).

Access to your data

The agent does not expose the content of any database table.

The agent application (as well as the pipeline) is provided as a docker image.
