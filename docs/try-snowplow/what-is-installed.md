---
title: "What is installed?"
date: "2021-09-17"
sidebar_position: 10
---

Try Snowplow is a minified version of the Snowplow BDP technology that uses the same core components as Snowplow BDP. It is hosted by Snowplow, and consists of the following:

1. A small version of the Snowplow BDP technology that collects and processes events, and then writes them to the database (referred to as the 'pipeline').
2. A Postgres database.

Try Snowplow is single tenanted, i.e. each trialist has their own pipeline and their own Postgres database. The entire stack is deleted upon expiry of the trial, including all data collected and stored in Postgres. Please note it is not possible to recover any part of the stack or the data once the trial has expired.
