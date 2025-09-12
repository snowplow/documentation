---
position: 1
title: Installation and Setup
description: "Install and configure Android tracker for behavioral event collection in mobile applications."
schema: "HowTo"
keywords: ["Android Installation", "Mobile Setup", "Android SDK", "App Installation", "Mobile Integration", "Android Guide"]
---

### Requirements

- Snowplow pipeline running
- Android Studio installed

## Installation and Setup

To begin tracking events using Snowplow Analytics' Android tracker, you'll need to set up your project and initialize the tracker. We’ll be following the modern JetPack Compose framework using Kotlin as our langauge.

1. Clone the official Android JetSurvey example app here, or import it from Android Studio as described [here](https://developer.android.com/develop/ui/compose/setup#sample).

    ```bash
    git clone https://github.com/android/compose-samples/tree/main
    cd jetsurvey
    ```

2. Add the Snowplow Android tracker dependency to your project-level `libs.versions.toml` file (Replace `x.x.x` with the latest version of the tracker.)

    ```
    snowplow = "x.x.x"
    ```

3. Add the dependency to your `build.gradle.kts` file

    ```kotlin
    implementation(libs.snowplow.analytics)
    ```

4. Create a new package in your project for analytics-related code, and create a `Analytics.kt` file inside it.
5. Now we’ll create the `Analytics` object in that `Analytics.kt` file by adding the following code. Replace `"YOUR_NAMESPACE"` with a unique identifier for your tracker and `"YOUR_COLLECTOR_URL"` with your Snowplow collector endpoint.

    ```kotlin
    package com.example.compose.jetsurvey.analytics
    
    import android.content.Context
    
    object Analytics {
     fun start(context: Context) {
      Snowplow.createTracker(
       context, 
       namespace: "YOUR_NAMESPACE",
       endpoint: "YOUR_COLLECTOR_URL"
      )
     }
    }
    ```

6. In the entrypoint for your app, you’ll now want to initialize the tracker. In this case the first composable function called is the `JetsurveyNavHost()`, inside the `Navigation.kt` file. Add this line to the start of the function, before the `NavHost` instantiation:
