---
title: "ObjC client"
description: "Iglu Objective-C client library for resolving JSON schemas from embedded and remote repositories in macOS and iOS applications."
date: "2021-03-26"
sidebar_position: 30
---

## Overview

The [Iglu Objc client](https://github.com/snowplow/iglu-objc-client) allows you to resolve JSON Schemas from embedded and remote repositories. It does not yet let you write to repositories in any way (e.g. you can't publish new schemas to an Iglu repository).

This client library should be straightforward to use if you are comfortable with Objective-C development.

### Client compatibility

The Obj-C client is compatible with OSX 10.9+ and iOS 7.0+.

### Dependencies

The library is dependant on  [KiteJSONValidator](https://github.com/samskiter/KiteJSONValidator) for all JSONSchema validation.

## Setup

### CocoaPods

We support installing the Obj-C Client via CocoaPods since it's the easiest way to install the client. Doing so is simple:

1. Install CocoaPods using `gem install cocoapods`
2. Create the file `Podfile` in the root of your XCode project directory, if you don't have one already
3. Add the following line into it:

```ruby
pod 'SnowplowIgluClient'
```

4. Run `pod install` in the same directory

### Manual Setup

If you prefer not to use CocoaPods, you can grab the client from our [GitHub repo](https://github.com/snowplow/iglu-objc-client.git) and import it into your project.

#### Clone the client

First, git clone the latest version of the client to your local machine:

```bash
git clone https://github.com/snowplow/iglu-objc-client.git
```

If you don't have git installed locally, [install it](http://git-scm.com/downloads) first.

#### Copy the client into your project

You first need to copy the client's `SnowplowIgluClient` sub-folder into your XCode project's folder. The command will look something like this:

```bash
cp -r iglu-objc-client/SnowplowIgluClient MyObjcApp/MyObjcApp/
```

- Replace `MyObjcApp` with the name of your own app, and tweak the source code sub-folder accordingly.
- Next, drag and drop the sub-folder `MyObjcApp/MyObjcApp/SnowplowIgluClient` into your XCode project's workspace.
- Make sure that the suggested options for adding `SnowplowIgluClient` are set **Create groups**, then click **Finish**.

#### Copy required resources (Optional)

The client requires two schemas for initial operation; the first for validating that a JSON is a correct self-describing JSON and the second for validating the resolver-config JSON passed to it in startup. The client will look for these in a resource bundle named `SnowplowIgluResources`.

To get this bundle you will need to:

- Open the `SnowplowIgluClient.xcworkspace` in XCode.
- Build the `SnowplowIgluResources` schema.
- In your `Products` folder within XCode you should now see a `SnowplowIgluResources.bundle`.
- Copy this bundle to your project.

Alternatively you can also include the standard Snowplow repository in your resolver-config:

```json
{
  "name": "Iglu Central",
  "vendorPrefixes": [
    "com.snowplowanalytics"
  ],
  "connection": {
    "http": {
      "uri": "http://iglucentral.com"
    }
  },
  "priority": 0
}
```

This will allow the client to download the required schemas at runtime.

## Initialization

Assuming you have completed the setup for your Objective-C project, you are now ready to initialize the Obj-C client.

### Importing the library

All interactions are handled through the ObjC client's `IGLUClient` class.

Import the header for the client like so:

```objc
#import "IGLUClient.h"
```

You are now ready to create your Obj-C Client.

### JSON-based initialization

You will need to supply either a resolver-config as an `NSString` or the URL to your resolver-config as an argument for the client. If a valid resolver-config is not passed in the client will throw an **exception**.

To make this step a touch easier we have included several utility functions for getting `NSString's` from URLs and File Paths.

For example; grabbing your resolver-config from a local source and creating the client could look like this:

```objc
#import "IGLUUtilities.h"

// Create Client
NSString * resolverAsString = [IGLUUtilities
  getStringWithFilePath:@"your_iglu_resolver.json"
  andDirectory:@"Your_Directory" 
  andBundle:[NSBundle bundleForClass:[self class]]];

IGLUClient * client = [[IGLUClient alloc]
  initWithJsonString:resolverAsString
  andBundles:nil];
```

To create a client from a URL:

```objc
// The URL is passed as an NSString
IGLUClient * client = [[IGLUClient alloc] initWithUrlPath:@"https://raw.githubusercontent.com/snowplow/snowplow/master/3-enrich/config/iglu_resolver.json" andBundles:nil];
```

The `andBundle:` argument of the client init accepts an `NSMutableArray` of bundle objects. These objects will be used to search for files for any embedded repositories you include.

To add to the available bundles you can use:

```objc
[client addToBundles:yourBundleObject];
```

## Validating JSON

Once you have successfully created a client you can start validating your self-describing JSON.

**NOTE:** All JSONs must first be parsed into an NSDictionary before they can be validated.

To parse your JSON String as an `NSDictionary` you can use `IGLUUtilities` like so:

```objc
NSDictionary * jsonDictionary = [IGLUUtilities parseToJsonWithString:yourStringHere];
```

To validate your JSON:

```objc
BOOL result = [client validateJson:jsonDictionary];
```

The above command is telling the client to:

- Check the JSON is a valid self-describing JSON
- Check the JSON validates against it's own schema

Currently the only output from the client will be a `YES` or `NO` response as the underlying library does not support error printing as of yet.
