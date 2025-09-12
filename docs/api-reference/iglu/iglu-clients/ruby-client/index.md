---
title: "Ruby client"
description: "Iglu Ruby client API reference for behavioral data schema resolution in Ruby applications."
schema: "TechArticle"
keywords: ["Ruby Client", "Iglu Ruby", "Ruby Integration", "Ruby Registry", "Ruby Schema", "Ruby Validation"]
date: "2021-03-26"
sidebar_position: 60
---

## Overview

The [Iglu Ruby client](https://github.com/snowplow/iglu-ruby-client) allows you to resolve JSON Schemas from embedded and remote repositories.

This client library should be straightforward to use if you are comfortable with Ruby development.

### Client compatibility

The Ruby client was tested with Ruby `2.1`, `2.2`, `2.4`, `JRuby 9.0.5.0` and `JRuby 9.1.6.0`.

### Dependencies

The library is dependant on [Ruby JSON Schema Validator](https://github.com/ruby-json-schema/json-schema) library for all JSON Schema validation and [httparty](https://github.com/jnunemaker/httparty) for HTTP requests.

## Setup

### RubyGems

Ruby Iglu Client is published on [RubyGems.org](https://rubygems.org/).

You can either install it in shell via `gem`:

```bash
$ gem install iglu-ruby-client
```

or add it to `Gemfile`:

```ruby
gem 'iglu-ruby-client'
```

## Initialization

Assuming you have completed the setup for your Ruby project, you are now ready to initialize the Ruby client.

### Importing the library

All entities can be accessed by importing `iglu-client` package.  
Client is placed in `Iglu::Resolver` module, while core entities are in root `Iglu` module.

You are now ready to instantiate a Ruby Client.

### JSON-based initialization

```ruby
require 'iglu-client'

resolver_config = {:schema => "iglu:com.snowplowanalytics.iglu/resolver-config/jsonschema/1-0-2",
 :data => {
   :cacheSize => 500,
   :repositories => [{:name => "Iglu Central", :priority => 0, :vendorPrefixes => ["com.snowplowanalytics"], :connection => {:http => {:uri => "http://iglucentral.com"}}}]
  }
}

resolver = Iglu::Resolver.parse(resolver_config)
```

Note that it is highly recommended to use JSONs as hashes with symbolized keys, you can use `JSON.parse(json, {:symbolize_names => true})` to parse JSON with all keys as symbols instead of strings.

## Usage

## Validating JSON

Once you have successfully created a client you can start validating your self-describing JSON.

```ruby
json = resolver_config      # resolver config is plain self-describing JSON!
resolver.validate(json)     # this will return same `json` value in case of success or throw IgluError in case of any failure
```

Unlike Iglu Scala Client which never throws exceptions and return errors as values, Ruby client uses more common for dynamic languages approach,  
specifically it throws `IgluError` exception on any non-success case, like non-self-describing JSON, not found schema, connection error etc and returns plain value (same self-describing JSON) on success.

To just lookup schema without any self-describing JSON, you can use `lookup_schema` method, which accepts schema key as object or URI.

### Core entities

`iglu-ruby-client` gem also provides entities specific to [Iglu core's](/docs/api-reference/iglu/common-architecture/iglu-core/index.md).  
Specifically, you can initialize and utilize entities such as schema key, self-describing data, SchemaVer etc.  
Same classes will be included in Iglu Ruby Core library when it'll be released.

```ruby
schema_key = SchemaKey.new("com.acme", "event", "jsonschema", SchemaVer.new(1,0,2))
# or 
schema_key = SchemaKey.parse("iglu:com.acme/event/jsonschema/1-0-2")
```

### Embedded registry

Ruby Client supports somewhat similar to [JVM embedded](/docs/api-reference/iglu/iglu-repositories/jvm-embedded-repo/index.md) registry.  
It also can be constructed from `embedded` connection using path inside gems and JRuby jars (created using warbler) but it has few important differences with JVM embedded registry:

- It can accept absolute filesystem paths
- Paths are relative from ruby file where registry is initialized
- There's no way to automatically merge all embedded registries, each should be created explicitly

Our own's [bootstrap resolver](https://github.com/snowplow/iglu-ruby-client/blob/0.1.0/lib/iglu-client/bootstrap.rb) can be used as an example on how to use embedded registries in Ruby.
