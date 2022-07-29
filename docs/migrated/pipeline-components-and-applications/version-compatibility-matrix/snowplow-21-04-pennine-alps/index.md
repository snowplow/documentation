---
title: "Snowplow 21.04 Pennine Alps"
date: "2021-04-29"
sidebar_position: 99990
---

### Recommended Stack

Please note, the `x` indicates that we recommend always being on the latest patched version. Components which have been updated since the last release are **highlighted**.

#### **AWS**

<table class="has-fixed-layout"><tbody><tr><td><strong><span style="color:#9b51e1" class="has-inline-color">Stream Collector</span></strong></td><td><strong><span style="color:#9b51e1" class="has-inline-color">Enrich</span></strong></td><td><span style="color:#9b51e1" class="has-inline-color"><strong>EMR ETL Runner</strong></span></td><td><strong><span style="color:#9b51e1" class="has-inline-color">Dataflow Runner</span></strong></td></tr><tr><td><a href="http://github.com/snowplow/stream-collector/releases">v2.2.x</a></td><td><a href="https://github.com/snowplow/stream-enrich/releases">v1.4.x</a></td><td><a href="https://github.com/snowplow/emr-etl-runner/releases">v1.0.x</a></td><td><a href="https://github.com/snowplow/dataflow-runner/releases">v0.5.1</a></td></tr></tbody></table>

<table class="has-fixed-layout"><tbody><tr><td><strong><span style="color:#9b51e1" class="has-inline-color">S3 Loader</span></strong></td><td><strong><span style="color:#9b51e1" class="has-inline-color">RDB Loader</span></strong></td><td>Snowflake Loader</td><td><strong><span style="color:#9b51e1" class="has-inline-color">ElasticSearch Loader</span></strong></td></tr><tr><td><a href="https://github.com/snowplow/snowplow-s3-loader/releases">v1.0.x</a></td><td><a href="https://github.com/snowplow/snowplow-rdb-loader/releases">R34</a></td><td><a href="https://github.com/snowplow-incubator/snowplow-snowflake-loader/releases">v0.8.x</a></td><td><a href="https://github.com/snowplow/dataflow-runner/releases"></a><a href="https://github.com/snowplow/snowplow-elasticsearch-loader/releases">v1.0.x</a></td></tr></tbody></table>

#### **GCP**

<table class="has-fixed-layout"><tbody><tr><td><strong><span style="color:#9b51e1" class="has-inline-color">Stream Collector</span></strong></td><td><strong><span style="color:#9b51e1" class="has-inline-color">Enrich</span></strong></td><td>GCS Loader</td><td><strong><span style="color:#9b51e1" class="has-inline-color">BigQuery Loader</span></strong></td></tr><tr><td><a href="https://github.com/snowplow/stream-collector/releases">v2.2.x</a></td><td><a href="https://github.com/snowplow/enrich/releases">v1.4.x</a></td><td><a href="https://github.com/snowplow-incubator/snowplow-google-cloud-storage-loader/releases">v0.3.x</a></td><td><a href="https://github.com/snowplow-incubator/snowplow-bigquery-loader/releases">v0.6.x</a></td></tr></tbody></table>

**Trackers**

<table class="has-fixed-layout"><tbody><tr><td><strong><span style="color:#9b51e1" class="has-inline-color">JS (Web &amp; Node)</span></strong></td><td><strong><span style="color:#9b51e1" class="has-inline-color">Android</span></strong></td><td><strong><span style="color:#9b51e1" class="has-inline-color">iOS</span></strong></td><td><strong><span style="color:#9b51e1" class="has-inline-color">React Native</span></strong></td><td>Java</td><td>.NET</td><td><strong><span style="color:#9b51e1" class="has-inline-color">Python</span></strong></td></tr><tr><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">v3.0.x</a></td><td><a href="https://github.com/snowplow/snowplow-android-tracker/releases">v1.7.x</a></td><td><a href="https://github.com/snowplow/snowplow-objc-tracker/releases">v1.6.x</a></td><td><a href="https://github.com/snowplow-incubator/snowplow-react-native-tracker/releases">v0.1.x</a></td><td><a href="https://github.com/snowplow/snowplow-java-tracker/releases">v0.9.x</a></td><td><a href="https://github.com/snowplow/snowplow-dotnet-tracker/releases">v1.0.x</a></td><td><a href="https://github.com/snowplow/snowplow-python-tracker/releases">v0.9.x</a></td></tr></tbody></table>

<table class="has-fixed-layout"><tbody><tr><td><strong><span style="color:#9b51e1" class="has-inline-color">AMP</span></strong></td><td>Unity</td><td><strong><span style="color:#9b51e1" class="has-inline-color">PHP</span></strong></td><td><strong><span style="color:#9b51e1" class="has-inline-color">Golang</span></strong></td><td><strong><span style="color:#9b51e1" class="has-inline-color">Scala</span></strong></td><td>Ruby</td><td>C++</td></tr><tr><td>v1.0.2</td><td><a href="https://github.com/snowplow/snowplow-unity-tracker/releases">v0.4.0</a></td><td><a href="https://github.com/snowplow/snowplow-php-tracker/releases">v0.4.x</a></td><td><a href="https://github.com/snowplow/snowplow-golang-tracker/releases">v2.4.x</a></td><td><a href="https://github.com/snowplow/snowplow-scala-tracker/releases">v1.0.x</a></td><td><a href="https://github.com/snowplow/snowplow-ruby-tracker/releases">v.0.6.x</a></td><td><a href="https://github.com/snowplow/snowplow-cpp-tracker/releases">v0.1.x</a></td></tr></tbody></table>

#### **Data Model**ing

<table class="has-fixed-layout"><tbody><tr><td><strong><span style="color:#9b51e1" class="has-inline-color">Redshift web model</span></strong></td><td><strong><span style="color:#9b51e1" class="has-inline-color">BigQuery web model</span></strong></td><td><strong><span style="color:#9b51e1" class="has-inline-color">Snowflake web model</span></strong></td></tr><tr><td><a href="https://github.com/snowplow/data-models/releases">v1.2.x</a></td><td><a href="https://github.com/snowplow/data-models/releases">v.1.0.x</a></td><td><a href="https://github.com/snowplow/data-models/releases">v1.0.x</a></td></tr></tbody></table>

<table class="has-fixed-layout"><tbody><tr><td><span style="color:#9b51e1" class="has-inline-color"><strong>SQL Runner</strong></span></td></tr><tr><td><a href="https://github.com/snowplow/sql-runner/releases">v0.9.x</a></td></tr></tbody></table>

#### **Testing**

<table class="has-fixed-layout"><tbody><tr><td><strong><span style="color:#9b51e1" class="has-inline-color">Mini</span></strong></td><td><strong><span style="color:#9b51e1" class="has-inline-color">Micro</span></strong></td></tr><tr><td><a href="https://github.com/snowplow/snowplow-mini/releases">v0.12.x</a></td><td><a href="https://github.com/snowplow-incubator/snowplow-micro/releases">v1.1.x</a></td></tr></tbody></table>

#### **Analytics SDKs**

<table class="has-fixed-layout"><tbody><tr><td><strong><span style="color:#9b51e1" class="has-inline-color">Scala</span></strong></td><td>JavaScript</td><td>Python</td><td>.NET</td></tr><tr><td><a href="https://github.com/snowplow/snowplow-python-analytics-sdk/releases">v2.1.x</a></td><td><a href="https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/releases">v0.3.0</a></td><td><a href="https://github.com/snowplow/snowplow-python-analytics-sdk/releases">v0.2.x</a></td><td><a href="https://github.com/snowplow/snowplow-dotnet-analytics-sdk/releases">v0.2.x</a></td></tr></tbody></table>

We hope that the above provides clarity on our recommended stack, however if you have any questions or feedback please reach out to us on [discourse](https://discourse.snowplowanalytics.com/).
