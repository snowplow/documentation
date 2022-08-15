---
title: "Setup"
date: "2020-02-25"
sidebar_position: 10
---

## Integration options

### Tracker compatibility

The Snowplow AS3 Tracker has been built, tested and compiled using the Adobe Flex 3.5 SDK, but is not dependent on Flex. You can use it in pure Actionscript projects.

It is compatible with Flash Player 9.0.124 and later.

### Dependencies

There are no external dependencies. The FlashBuilder project includes any necessary external classes, and the binary swc file is standalone, ready to be included in your project and referenced in your AS3 code.

## Setup

### Hosting

The Tracker is available as source code for inclusion and compilation in your project, or as a binary .SWC file which you can just add to your project as is.

- The binary is published to Snowplow's [hosted Bintray repository](http://dl.bintray.com/snowplow/snowplow-generic/snowplow_actionscript3_tracker_0.1.0.zip).
- The source code is available on [Snowplow's GitHub repository](https://github.com/snowplow/snowplow-actionscript3-tracker).
- The current version of the Snowplow AS3 Tracker is 0.1.0.

### FlashBuilder

If you are using FlashBuilder for building your Flash application, then either:

#### Install using binary

The binary is available for download from our public BinTray repository. Installation steps as follows:

1. Download the [snowplow\_actionscript3\_tracker\_0.1.0.zip](http://dl.bintray.com/snowplow/snowplow-generic/snowplow_actionscript3_tracker_0.1.0.zip) file
2. Unzip the binary (.SWC) file
3. Include it in your project under "Properties > Build Path > Library Path > Add SWC..."

#### Install from source

You can also install this Flash analytics SDK from source:

1. Download the project source code from GitHub under the [0.1.0 tag](https://github.com/snowplow/snowplow-actionscript3-tracker/tree/0.1.0)
2. Import the source into your FlashBuilder project using "Import > Other... > Existing Projects into Workspace"
3. Link this new project to your project using "Properties > Build Path > Library Path > Add Project..."
