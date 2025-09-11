---
title: "Analytics SDK - Go"
description: "Go Analytics SDK API reference for processing behavioral event data in scalable backend services."
schema: "TechArticle"
keywords: ["Go SDK", "Golang SDK", "Go API", "Server SDK", "Backend SDK", "Go Analytics"]
date: "2021-05-26"
sidebar_position: 300
---

## 1. Overview

The [Snowplow Analytics SDK for Go](https://github.com/snowplow/snowplow-golang-analytics-sdk) lets you work with [Snowplow enriched events](/docs/fundamentals/canonical-event/index.md) in your Go event processing, data modeling and machine-learning jobs. You can use this SDK with [AWS Lambda](https://aws.amazon.com/lambda/), [Google Cloud Functions](https://cloud.google.com/functions/), [Google App Engine](https://cloud.google.com/appengine) and other Golang-compatible data processing frameworks.

## 2. Compatibility

Snowplow Analytics SDK fo Go was tested with Go versions 1.13-1.15.

There are only two external dependencies currently:

- `github.com/json-iterator/go` - used to parse JSON

- `github.com/pkg/errors` - used to provide an improvement on the standard error reporting.

## 3. Setup

snowplow/snowplow-golang-analytics-sdk can be imported to a project as a go module:

`go get github.com/snowplow/snowplow-golang-analytics-sdk`

## 4. Usage

### 4.1 Overview

The [Snowplow Analytics SDK for Go](https://github.com/snowplow/snowplow-golang-analytics-sdk) provides you an API to parse an enriched event from it's TSV-string form to a `ParsedEvent` slice of strings, then a set of methods to transform the entire event or a subset of fields into either `JSON` or `map` form. It also offers methods to efficiently get a field from the `ParsedEvent`.

### 4.2 Summary of example usage

```bash
go get github.com/snowplow/snowplow-golang-analytics-sdk
```

```go
import "github.com/snowplow/snowplow-golang-analytics-sdk/analytics"


parsed, err := ParseEvent(event) // Where event is a valid TSV string Snowplow event.
if err != nil {
  fmt.Println(err)
}

parsed.ToJson() // whole event to JSON
parsed.ToMap() // whole event to map
parsed.GetValue("page_url") // get a value for a single canonical field
parsed.GetSubsetMap("page_url", "domain_userid", "contexts", "derived_contexts") // Get a map of values for a set of canonical fields
parsed.GetSubsetJson("page_url", "unstruct_event") // Get a JSON of values for a set of canonical fields
```

### 4.3 API

```go
func ParseEvent(event string) (ParsedEvent, error)
```

ParseEvent takes a Snowplow Enriched event tsv string as input, and returns a 'ParsedEvent' typed slice of strings. Methods may then be called on the resulting ParsedEvent type to transform the event, or a subset of the event to Map or Json.

```go
func (event ParsedEvent) ToJson() ([]byte, error)
```

ToJson transforms a valid Snowplow ParsedEvent to a JSON object.

```go
func (event ParsedEvent) ToMap() (map[string]interface{}, error)
```

ToMap transforms a valid Snowplow ParsedEvent to a Go map.

```go
func (event ParsedEvent) GetSubsetJson(fields ...string) ([]byte, error)
```

GetSubsetJson returns a JSON object containing a subset of the event, containing only the atomic fields provided, without processing the rest of the event.

For custom events and contexts, only "unstruct_event", "contexts", or "derived_contexts" may be provided, which will produce the entire data object for that field.

For contexts, the resultant map will contain all occurrences of all contexts within the provided field.

```go
func (event ParsedEvent) GetSubsetMap(fields ...string) (map[string]interface{}, error)
```

GetSubsetMap returns a map of a subset of the event, containing only the atomic fields provided, without processing the rest of the event.

For custom events and entites, only "unstruct_event", "contexts", or "derived_contexts" may be provided, which will produce the entire data object for that field.

For contexts, the resultant map will contain all occurrences of all contexts within the provided field.

```go
func (event ParsedEvent) GetValue(field string) (interface{}, error)
```

GetValue returns the value for a provided atomic field, without processing the rest of the event. For unstruct_event, it returns a map of only the data for the unstruct event. For contexts and derived_contexts, it returns the data for all contexts or derived_contexts in the event.

```go
func (event ParsedEvent) ToJsonWithGeo() ([]byte, error)
```

ToJsonWithGeo adds the geo_location field, and transforms a valid Snowplow ParsedEvent to a JSON object.

```go
func (event ParsedEvent) ToMapWithGeo() (map[string]interface{}, error)
```

ToMapWithGeo adds the geo_location field, and transforms a valid Snowplow ParsedEvent to a Go map.
