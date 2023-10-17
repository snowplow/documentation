---
title: "Tag guide"
date: "2021-11-18"
sidebar_position: 200
---

This template implements the Snowplow JavaScript tracker v3. The template supports all the features of the tracker, with a few exceptions due to the limitations of custom templates’ sandboxed JavaScript.

## Install the template

To **install the template**, browse to **Templates** in the Google Tag Manager user interface.

Under **Tag Templates**, click **Search Gallery**, and type `Snowplow v3` into the gallery overlay search bar.

![search Snowplow v3 in GTM gallery](images/search_snowplow_v3.png)

Click the **Snowplow v3** template name, and then click **Add to Workspace** in the next screen. Review the permissions and click **Add** to finalize the import.

After importing the template, you can follow the normal process of creating a **new tag** in Google Tag Manager, and the **Snowplow v3** template will be listed among the **Custom** tag types you can choose from.

## Caveats

To begin with, some of the caveats of using the Custom Template.

- Any methods that require the parsing of HTML elements (e.g. link tracking filter functions, cross domain linking) will not work and are thus disabled.
- Automatic error tracking does not work due to lack of support for the `ErrorEvent` API.
- There is no implementation for the [standard ecommerce](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/index.md#ecommerce-tracking) events. Users are encouraged to implement the [enhanced ecommerce](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/index.md#enhanced-ecommerce-tracking) setup instead.

## Instructions

Here are basic instructions for how to instrument the JavaScript tracker v3.

In general, when the tag fires, it first checks if the Snowplow JavaScript library has been loaded from the self-hosted URL provided in the template settings (more on this below). Then, the tag checks whether a tracker with the given **Tracker Name** has already been initialized. If not, it proceeds to initialize the new tracker.

Finally, the tag bundles a **command** from the settings in the tag, and sends it to the given **Collector Endpoint**.

### Settings Configuration

The Tag template requires a [Snowplow v3 Settings](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/google-tag-manager-custom-template/settings-variable-guide/index.md) Variable template to be configured which can be referenced within the Tag. This settings template contains the information required for the Tag to appropriate initialize the tracker.

Once a settings variable has been configured, it can be attached to the Tag in the **Tracker Initialisation** section.

![tracker initialization](images/tracker_initialization.png)

You can also choose to override some of the parameters specifically for this tag if you wish to, such as the Tracker Name or the Collector Endpoint.

#### Self Hosted JavaScript Tracker

If you have the Snowplow library [self-hosted](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/hosting-the-javascript-tracker/index.md), and have configured it as such in your Settings variable, you need to update the **Injects Scripts** permission to reflect the new location, by editing the **Snowplow Analytics v3 Tag template**. Delete the content of the **Allowed URL Match Patterns** field, and type the full URL to the library there. Again, it must match what you input into the tag itself when creating it.

![modifying permissions](images/modifying_permissions.png)

Modifying permissions **breaks the gallery link** and you will no longer be notified about updates to the template.

![modifying permissions breaks gallery link](images/modifying_breaks_gallery_link.png)

:::note

Since v1.1.0, an alternative to prevent breaking the gallery update link is to use the `Do not load` option from the corresponding drop down menu:

![library host drop down 'Do not load' option](images/host_drop_down_no_load.png)

Using this option means that the Snowplow v3 Tag will not inject the Snowplow JavaScript Tracker library on the page and can be used **only** when the Tracker Snippet is loaded with another technique, e.g. directly on the page or through another GTM tag. (This is also supported as a configuration option since v1.2.0 of the [Snowplow v3 Settings](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/google-tag-manager-custom-template/settings-variable-guide/index.md) Variable.)

:::

### Tag Type

Under **Tag Type**, you can choose what type of command is compiled and sent to the endpoint. The tag types are split here into three groups: commands that utilize a common **parameters** object, commands that have **special conditions**, and **custom commands**.

#### Tags with a parameter object

Tags that can derive their parameters from a Google Tag Manager variable are:

- Ad Tracking
- Cart Tracking
- Error Tracking
- Consent
- Self-describing Event
- Site Search
- Social Interaction
- Structured Event
- Timing

You can set the **Retrieve Parameters From Variable** setting to a Google Tag Manager variable. This parameter _must_ return an object. In the object, the key-value pairs should reflect the named parameters in the [event documentation](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/index.md). For example, to have the variable populate an [Error event](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/index.md#error-tracking), you could use a Custom JavaScript variable like this:

```javascript
function() {
  return {
    message: 'Some Error Happened',
    filename: 'somefile.js',
    lineno: 5,
    colno: 236,
    error: null
  }
}
```

Alternatively, you can set the drop-down to the value `No`, and add the parameters manually instead:

![adding parameters manually](images/adding_parameters_manually.png)

Some tag types will add additional selections to this section. Follow the [official tracker documentation](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/index.md) for more information about what each option does.

#### Special tags

Some tag types have special conditions and have been separated into their own configurations.

##### Enhanced Ecommerce

When you select Enhanced Ecommerce, you are left with two options: **Use Data Layer** or **Choose Variable**. The way it works is very similar to Enhanced Ecommerce in Google Analytics.

If you choose the first, the template will look into the `dataLayer` structure for the **most recently** pushed [Enhanced Ecommerce object](https://www.simoahava.com/analytics/enhanced-ecommerce-guide-for-google-tag-manager/#data-types-actions), and map this object to the request to Snowplow Analytics.

If you selected **Choose Variable**, you need to provide a GTM variable that returns an object in the correct, expected format.

##### Form Tracking

Form tracking has just two options, because **filters** and **transformations** won’t work with the custom template (due to lack of support for processing HTML elements). The options are to set form and/or field **blacklists** and **whitelists**.

Blacklists and whitelists for forms are a list of comma-separated HTML class names. If blacklisted, then any form element with a listed class will not trigger the form event. If whitelisted, then _only_ form elements with a listed classname will be tracked.

For fields, blacklists and whitelists work similarly, except they use the `name` attribute rather than the class.

##### Link Click Tracking

The **Track Link Click** event is similar to regular parameter-based events, as it lets you add parameters and track a link click as a manually encoded hit.

The **Enable Automatic Link Click Tracking** adds listeners to the page, which will track clicks on links permitting they adhere to the blacklisted/whitelisted class names you can optionally provide.

The **Fix Middle-click Tracking** adds a fix for some browsers where middle-clicks were not tracked properly.

If you check **Track HTML Content Of Clicked Link**, then the full text content of the link element will be sent to Snowplow as well.

##### Page View

You can provide a **Custom Page Title** if you wish, and you can add a [custom context](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/index.md#custom-context) to the request, as also described [here](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/index.md#trackpageview).

If you enable **Page Activity Tracking**, the tag will setup a _heartbeat_ tracker, and send page pings to Snowplow at intervals that you can specify.

The **Callback Function** is something you can set to a JavaScript function. If you set the callback, then instead of sending the page ping to Snowplow, the function gets invoked instead.

#### Custom Commands

For any other commands which are supported by the Snowplow JavaScript Tracker v3, you can select the **[Custom Command]** option. Once select, you can enter any function name and the associated parameter for that function. The parameter can either be a simple string, in examples such as `setUserId`:

![setUserId](images/setUserId.png)

Or it can be set to a Custom JavaScript Variable in the instances where an Object should be passed to the function, such as with `enableAnonymousTracking`:

![enableAnonymousTracking Custom JavaScript variable](images/enableAnonymousTracking_custom_variable.png)

And then use this variable as your Command Argument:

![enableAnonymousTracking Custom Command argument](images/enableAnonymousTracking_argument.png)

### Additional Tracking Parameters

![](images/additional_tracking_parameters.png)

#### Add Custom Context Entities

Using the **Context Entities** table allows you to attach [custom context entities](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/index.md#custom-context) to the Snowplow event. Each row should be set to a variable value that must be an **array of custom context objects** that will all be concatenated to add to the Event.

#### Set Custom Timestamp

You can also choose to [set the True Timestamp](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/index.md#setting-the-true-timestamp) with this field. The format must be UNIX time in milliseconds.

## Acknowledgements

Thanks to [Simo Ahava](https://www.simoahava.com/) for building the initial release of this template.
