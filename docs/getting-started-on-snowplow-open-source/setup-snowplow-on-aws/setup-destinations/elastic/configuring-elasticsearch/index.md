---
title: "Configuring Elasticsearch"
date: "2020-02-26"
sidebar_position: 10
---

### Getting started

First off, install and set up Elasticsearch version 5.x or 2.x.x. For more information check out the [installation guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html).

### Raising the file limit

Elasticsearch keeps a lot of files open simultaneously so you will need to increase the maximum number of files a user can have open. To do this:

```bash
$ sudo vim /etc/security/limits.conf
```

Append the following lines to the file:

```bash
{{USERNAME}} soft nofile 32000
{{USERNAME}} hard nofile 32000
```

Where {{USERNAME}} is the name of the user running Elasticsearch. You will need to logout and restart Elasticsearch before the new file limit takes effect.

To check that this new limit has taken effect you can run the following command from the terminal:

```bash
$ curl localhost:9200/_nodes/process?pretty
```

If the `max_file_descriptors` equals 32000 it is running with the new limit.

### [](https://github.com/snowplow/snowplow/wiki/elasticsearch-loader-setup#defining-the-mapping)

### Defining the mapping

Use the following request to create the mapping for the enriched event type:

```bash
$ curl -XPUT 'http://localhost:9200/snowplow' -d '{
    "settings": {
        "analysis": {
            "analyzer": {
                "default": {
                    "type": "keyword"
                }
            }
        }
    },
    "mappings": {
        "enriched": {
            "_ttl": {
              "enabled":true,
              "default": "604800000"
            },
            "properties": {
                "geo_location": {
                    "type": "geo_point"
                }
            }
        }
    }
}'
```

Elasticsearch will then treat the collector\_tstamp field as the timestamp and the geo\_location field as a "geo\_point". Documents will be automatically deleted one week (604800000 milliseconds) after their collector\_tstamp.

This initialization sets the default analyzer to "keyword". This means that string fields will not be split into separate tokens for the purposes of searching. This saves space and ensures that URL fields are handled correctly.

If you want to tokenize specific string fields, you can change the "properties" field in the mapping like this:

```bash
$ curl -XPUT 'http://localhost:9200/snowplow' -d '{
    "settings": {
        "analysis": {
            "analyzer": {
                "default": {
                    "type": "keyword"
                }
            }
        }
    },
    "mappings": {
        "enriched": {
            "_timestamp" : {
                "enabled" : "yes",
                "path" : "collector_tstamp"
            },
            "_ttl": {
              "enabled":true,
              "default": "604800000"
            },
            "properties": {
                "geo_location": {
                    "type": "geo_point"
                },
                "field_to_tokenize": {
                    "type": "string",
                    "analyzer": "english"
                }
            }
        }
    }
}'
```
