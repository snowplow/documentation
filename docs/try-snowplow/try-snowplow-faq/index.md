---
title: "Troubleshooting"
date: "2020-10-28"
sidebar_position: 50
---

### How can I get help with my Try Snowplow setup?

You can ask any questions about set up, tracking, accessing or modeling data with Try Snowplow in [the dedicated discourse category](https://discourse.snowplowanalytics.com/c/try-snowplow/62) and one of our engineers will get back to you.

### I get an error trying to run the CloudFormation. How do I resolve it?

- Check your input parameters for hidden characters.
- Check your input parameters for leading or trailing whitespace or other unsupported characters.
- If the deployment hangs this is likely due to AWS. Your best bet is to start from scratch with a new deployment. If this fails again reach out to AWS Support.
- If your stack destroy hangs leave it be: CloudFormation can take several hours to resolve hanging issues. If it has not been cleaned up after 6+ hours reach out to AWS Support for help in destroying the resources.
- Ensure you have sufficient IAM permissions before beginning the deployment. Partial permissions can cause issues with some resources not being able to be deployed. Speak to your internal SysAdmin / DevOps team to get help with permissions on your company's AWS account. More information on what IAM permissions Try Snowplow requires click [here](/docs/try-snowplow/setting-up-your-pipeline/installing-try-snowplow-on-aws/index.md#required-iam-roles).

### My database login details are not working.

The username and password for logging into your database are those that you specified during the installation process, they are not the details that you use to login to the dashboard.

If you have forgotten your username of password you can solve this with the following steps:

- Navigate to [RDS in AWS Console](https://console.aws.amazon.com/rds/home)
- In the _Resources_ panel click on _DB Instances_, locate your database and click on it

##### Forgotten username

- Find and click the _Configuration_ tab
- In this tab you will see a heading for _Availability_, and a sub-heading for _Master username_
- This is your username

**Forgotten password**

- Click the _Modify_ button at the top
- In the top section locate the _New master password_ field
- Enter a new password and follow the steps to confirm the change

### Where can I see the Try Snowplow logs?

Your pipeline is a set of ECS containers grouped in a Task Definition. You can access them by:

- Going to [AWS CloudFormation console](https://console.aws.amazon.com/ecs/home),
- Choosing your Try Snowplow stack,
- Then choosing Resources tab,
- Clicking on ECSCluster resource takes you to ECS console for your cluster,
- Then clicking Tasks in the newly opened ECS console,
- Choosing the task definition from a tabular list takes you to the instance you're interested in (you can filter instances by state, by default only running instances are shown),
- And navigating to Logs tab and choosing one of Try Snowplow containers (pipeline is the one of interest).
