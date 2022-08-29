---
title: "Setup guide"
date: "2021-03-26"
sidebar_position: 1000
---

Please follow these steps to setup the Snowplow Indicative Relay on AWS Lambda:

### 1\. Create your Indicative account

If you do not have an Indicative account, go to [Indicative](https://app.indicative.com/#/login/register) to create an account.

![](images/1.png)

### 2\. Obtain an API key from Indicative

- If you are a new Indicative user, go to [https://app.indicative.com/#/onboarding/snowplow](https://app.indicative.com/#/onboarding/snowplow). Then select _Snowplow_ and copy the API Key. Save it, you will need it later

![](images/2.png)

- If you want to send data to an existing project, go to [https://app.indicative.com/#/account/projects](https://app.indicative.com/#/account/projects)

![](images/3.png)

### 3\. Create an IAM Role for the Lambda

Your AWS Lambda needs to have an Execution Role that allows it to use the Kinesis Stream and CloudWatch. Open the AWS Management Console and follow these steps:

1. Go to IAM Management in the Console, choose _Roles_ from the sidebar, then click _Create role_.
2. As shown in the screenshot below, for the type of trusted entity select _AWS Service_ and for the service that will use this role choose _Lambda_.

![](images/4.png)

3. Now you need to choose a permission policy for the role. The Lambda needs to have read access to Kinesis and write access to CloudWatch logs - for that we will choose _AWSLambdaKinesisExecutionRole_.
4. On the next screen provide a name for the newly created role, then click _Create role_ to finish the process.

![](images/5.png)

### 4\. Create the Lambda function

As with the IAM Role, we will be using the AWS Console to get our Lambda function up and running.

1. On the Console navigate to `Lambda` section and click `Create a function`. Runtime should be _Java 8_. In the _Role_ dropdown pick _Choose an existing role_, then in the dropdown below choose the name of the role you have created in the previous part of the guide. Click _Create function_.

![](images/6.png)

2. Jars for the Indicative Relay are hosted by us in S3. To find the S3 url to the appropriate hosted asset for the Snowplow Indicative Relay to provide to your Lambda function, you will need to choose the S3 bucket that is in the same region as your AWS Lambda function. For example, if your Lambda is `us-east-1` region, and the latest version `0.4.0`, then the jar you will provide to your Lambda function will be available at the following URL: `s3://snowplow-hosted-assets-us-east-1/relays/indicative/indicative-relay-0.4.0.jar`.

To find the name of the bucket for your region, consult this table:

| Region | Bucket |
| --- | --- |
| eu-west-1 | snowplow-hosted-assets |
| us-east-1 | snowplow-hosted-assets-us-east-1 |
| us-west-1 | snowplow-hosted-assets-us-west-1 |
| us-west-2 | snowplow-hosted-assets-us-west-2 |
| sa-east-1 | snowplow-hosted-assets-sa-east-1 |
| eu-central-1 | snowplow-hosted-assets-eu-central-1 |
| ap-southeast-1 | snowplow-hosted-assets-ap-southeast-1 |
| ap-southeast-2 | snowplow-hosted-assets-ap-southeast-2 |
| ap-northeast-1 | snowplow-hosted-assets-ap-northeast-1 |
| ap-south-1 | snowplow-hosted-assets-ap-south-1 |
| us-east-2 | snowplow-hosted-assets-us-east-2 |
| ca-central-1 | snowplow-hosted-assets-ca-central-1 |
| eu-west-2 | snowplow-hosted-assets-eu-west-2 |
| ap-northeast-2 | snowplow-hosted-assets-ap-northeast-2 |

2. Although the Lambda has been created, it does not do anything yet. We need to provide the code and configure the function. Take a look at the _Function code_ box. In the _Handler_ textbox paste: `com.snowplowanalytics.indicative.LambdaHandler::recordHandler`  
    From the _Code entry type_ dropdown pick _Upload a file from Amazon S3_. A textbox labeled _S3 Link URL_ will appear. Paste in the S3 url you found in the previous step.

![](images/7.png)

3. Below _Function code_ settings you will find a section called _Environment variables_. You need to use these environment variables to configure some additional settings for the relay, such as the the API key and filters.
    - **3.1 Setting up the API key**: In the first row, first column (the key) type `INDICATIVE_API_KEY`. In the second column (the value) paste your API Key obtained in the beginning of this guide.
    - **3.2 Setting up filters**: The relay lets you configure the following filters:
        - UNUSED\_EVENTS: events that will not be relayed to Indicative;
        - UNUSED\_ATOMIC\_FIELDS: fields of the [canonical](/docs/understanding-your-pipeline/canonical-event/index.md) Snowplow event that will not be relayed to Indicative;
        - UNUSED\_CONTEXTS: contexts whose fields will not be relayed to Indicative.

Out of the box, the relay is configured to use the following defaults:

| Unused events | Unused atomic fields | Unused contexts |
| --- | --- | --- |
| app\_heartbeat | etl\_tstamp | application\_context |
| app\_initialized | collector\_tstamp | application\_error |
| app\_shutdown | dvce\_created\_tstamp | duplicate |
| app\_warning | event | geolocation\_context |
| create\_event | txn\_id | instance\_identity\_document |
| emr\_job\_failed | name\_tracker | java\_context |
| emr\_job\_started | v\_tracker | jobflow\_step\_status |
| emr\_job\_status | v\_collector | parent\_event |
| emr\_job\_succeeded | v\_etl | performance\_timing |
| incident | user\_fingerprint | timing |
| incident\_assign | geo\_latitude |  |
| incident\_notify\_of\_close | geo\_longitude |  |
| incident\_notify\_user | ip\_isp |  |
| job\_update | ip\_organization |  |
| load\_failed | ip\_domain |  |
| load\_succeeded | ip\_netspeed |  |
| page\_ping | page\_urlscheme |  |
| s3\_notification\_event | page\_urlport |  |
| send\_email | page\_urlquery |  |
| send\_message | page\_urlfragment |  |
| storage\_write\_failed | refr\_urlscheme |  |
| stream\_write\_failed | refr\_urlport |  |
| task\_update | refr\_urlquery |  |
| wd\_access\_log | refr\_urlfragment |  |
|  | pp\_xoffset\_min |  |
|  | pp\_xoffset\_max |  |
|  | pp\_yoffset\_min |  |
|  | pp\_yoffset\_max |  |
|  | br\_features\_pdf |  |
|  | br\_features\_flash |  |
|  | br\_features\_java |  |
|  | br\_features\_director |  |
|  | br\_features\_quicktime |  |
|  | br\_features\_realplayer |  |
|  | br\_features\_windowsmedia |  |
|  | br\_features\_gears |  |
|  | br\_features\_silverlight |  |
|  | br\_cookies |  |
|  | br\_colordepth |  |
|  | br\_viewwidth |  |
|  | br\_viewheight |  |
|  | dvce\_ismobile |  |
|  | dvce\_screenwidth |  |
|  | dvce\_screenheight |  |
|  | doc\_charset |  |
|  | doc\_width |  |
|  | doc\_height |  |
|  | tr\_currency |  |
|  | mkt\_clickid |  |
|  | etl\_tags |  |
|  | dvce\_sent\_tstamp |  |
|  | refr\_domain\_userid |  |
|  | refr\_device\_tstamp |  |
|  | derived\_tstamp |  |
|  | event\_vendor |  |
|  | event\_name |  |
|  | event\_format |  |
|  | event\_version |  |
|  | event\_fingerprint |  |
|  | true\_tstamp |  |

To change the defaults, you can pass in your own lists of events, atomic fields or contexts to be filtered out. For example:

| Environment variable key | Environment variable value |
| --- | --- |
| UNUSED\_EVENTS | page\_ping,file\_download |
| UNUSED\_ATOMIC\_FIELDS | name\_tracker,event\_vendor |
| UNUSED\_CONTEXTS | performance\_timing,client\_context |

Similarly to setting up the API key, the first column (key) needs to be set to the specified environment variable name in ALLCAPS. The second column (value) is your own list as a comma-separated string with no spaces.

If you only specify the environment variable name but do not provide a list of values, then nothing will be filtered out.

If you do not set any of the environment variables, the defaults will be used.

- **3.3. Setting up the Indicative API URI**: By default, the relay uses the standard URI. To change that, you can set the `INDICATIVE_URI` environment variable.
- **3.4. Setting up the field whose value should be used as the event name for `struct` events**: In Snowplow's canonical event model, there's a legacy type of custom structured event, which is known as a `struct` or ['structured event'](/docs/understanding-your-pipeline/canonical-event/index.md#Custom_structured_events). These are still fairly popular with users, however the value of the `event_name` field for those events (which is simply `event`) can be confusing. To help group similar events, Snowplow users often designate one of their special fields (most commonly `se_action`) to be the 'event name field'. Since version 0.5.0 by default `se_action` is used as the event name field for structured events. But you can override that by setting the Lambda environment variable `STRUCTURED_EVENT_NAME_FIELD` to the field whose value you'd rather use, eg `se_category`.

4. Scroll down a bit and take a look at the _Basic settings_ box. There you can set memory and timeout limits for the Lambda. We recommend setting 256 MB of memory or higher (on AWS Lambda the CPU performance scales linearly with the amount of memory). The timeout should be set quite high - we recommend one and half minute - because of so-called _JVM cold starts_. The cold starts happen when the Lambda function is invoked for the first time on a new instance and it can take a significant amount of time.

![](images/8.png)

5. Now let's add our enriched Kinesis stream as an event source for the function. From the list of triggers in the Designer configuration up top, choose Kinesis.

![](images/9.png)

Take a look at the Configure triggers section which just appeared below. Choose your Kinesis stream that contains Snowplow enriched events. Set the batch size to your liking - 100 is a reasonable setting. Note that this a maximum batch size, the function can be triggered with less records. For the starting position we recommend Trim horizon, which starts processing the stream from an observable start. Click Add button to finish the trigger configuration. Make sure Enable trigger is selected.

6. Save the changes by clicking the Save button in the top-right part of the page.

## 5\. Observe the events in Indicative

After a while the events should start flowing into Indicative. You can go _Settings -> Events and Properties_ to see incoming event types, change their labels, descriptions and categories.

![](images/91.png)
