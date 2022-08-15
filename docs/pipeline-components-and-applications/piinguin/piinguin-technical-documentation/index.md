---
title: "Piinguin technical documentation"
date: "2021-03-26"
sidebar_position: 10
---

The Piinguin project consists of three parts. Those are the:

- Protocol
- Server
- Client

### Protocol

Piinguin is based on GRPC \[grpc\] which is a protobuf based RPC framework. The protocol in the project specifies the interface between the client and server. There is a `.proto` file which describes the interactions between the client and the server for reading, writing and deleting records. That file is used with the excellent [scalapb](https://github.com/thesamet/sbt-protoc) scala compiler plug-in to generate `Java` code stubs for both the server and the client. These can then be used to implement any behavior based on that interface.

### Server

The server implements the behavior of the server according to the interface, which in this particular case means writing to and reading from Dynamo DB using the excellent [scanamo](https://www.scanamo.org/) library. In the highly unlikely event (as unlikely as a hash collision) that a hash coincides for two values, the last seen original value will be kept (there are thoughts of keeping all values in that case, although their utility is dubious. Feel free to discuss in the [relevant issue](https://github.com/snowplow-incubator/piinguin/issues/8) on GitHub).

### Client

Finally the client artifact provides a client API for use from `Scala`. There are three main ways to use the client API, which are the Scala Futures, [FS2](https://github.com/functional-streams-for-scala/fs2) IO and [FS2](https://github.com/functional-streams-for-scala/fs2) Streaming. The streaming implementation is _highly experimental_ and is use is currently discouraged as it is likely to change completely (but all comments and PRs are welcome).

## Piinguin relay

The piinguin relay is using the above mentioned Piinguin Client, in an AWS Lambda to forward all PII messages to the Piinguin Server. It uses the [Analytics SDK](/docs/modeling-your-data/analytics-sdk/) to read the Enriched Events that are contained in the stream and extract the relevant fields (currently modified and original value only), and perform a `createRecord` operation.
