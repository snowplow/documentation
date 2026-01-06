---
position: 2
title: "Track screen views using the Android tracker"
sidebar_label: "Track screen views"
---

In a Jetpack Compose app, screen views aren't tracked automatically. Screen view tracking can be manually added to every screen, but it’s more efficient to add a navigation listener. Here's how to track screen views using the navigation component:

1. Within the `Analytics` object, create a listener function:

    ```kotlin
    fun addScreenViewNavListener(navController: NavController){
     navController.addOnDestinationChangedListener { _, destination, ->
      Snowplow.defaultTracker?.track(ScreenView(destination.route ?: "unknown"))
    ```

2. Call this function by passing in your navigation, in your main composable:

    ```kotlin

    @Composable
    fun JetSurveyNavHost(
      navController = rememberNavController()
    ) {
      Analytics.start(LocalContext.current)
      Analytics.addScreenViewNavListener(navController)

      ...
    }

    ```

This setup will track a screen view event every time the navigation destination changes. The screen name will be set to the route of the destination.

Additionally, the Snowplow Android tracker uses the screen view events to automatically track screen engagement, including how long a user spends on each screen and whether the app is in the foreground or background.
