---
title: "Example Roku app with Snowplow tracking"
date: "2021-11-16"
sidebar_position: 5000
---

The tracker comes with a demo app that shows it in use. It is a simple video player with a fixed collection of played videos and an interface to switch between them. The demo app may serve you to understand how to embed Snowplow tracking within a BrightScript channel.

The project in included in the [tracker repository](https://github.com/snowplow-incubator/snowplow-roku-tracker), in the `src-demo-app` subfolder. The following steps to build and deploy the channel assume that you have enabled developer mode on your Roku device and it is connected to your network.

1. Download the [Roku tracker project](https://github.com/snowplow-incubator/snowplow-roku-tracker).
2. Run `npm install` within the project.
3. Install ropm `npm i ropm -g`.
4. Install ropm packages `ropm install`.
5. Create `.env` file with environment variables in the root of this repository with the following content:  
    `ROKU_IP=192.168.100.129`  
    `ROKU_PASSWORD=XXXX`
6. Add configuration for Snowplow collector to `src-demo-app/manifest`:  
    `snowplow_collector=http://192.168.100.127:9090`  
    `snowplow_method=POST`
7. Start the demo app using `npm run demo-app`.

Alternatively, you may run the demo app from Visual Studio Code as the debug configuration is already prepared. Install the BrightScript extension to Visual Studio Code and choose "Run demo app" in the debug options.

Events will be sent to the Snowplow collector as you navigate through the app.
