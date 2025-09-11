---
position: 5
title: Braze Campaign Setup
description: "Create Braze campaigns using abandoned browse behavioral data for personalized customer re-engagement."
schema: "HowTo"
keywords: ["Braze Campaign", "Marketing Campaign", "Customer Engagement", "Braze Integration", "Marketing Automation", "Campaign Tutorial"]
---

This guide will walk you through setting up and testing an abandoned browse campaign in Braze using the product view data synced from Census.

## Setting up the campaign

1. Log into your Braze dashboard
2. Navigate to **Campaigns** and click **Create campaign**
3. Select **Email** as the channel
4. Name your campaign (e.g. "Abandoned browse - product reminder")

![Create Campaign](images/retl-braze-create-campaign.png)

## Configure campaign trigger

1. In the **Delivery** section, select **Action-Based**
2. Set up the trigger criteria

## Create email template

![Braze Campaign Builder](images/retl-braze-preview.png)

1. Click **Edit Campaign** in the campaign builder and click **Edit Email Body**
2. Design your email using Braze's visual editor:
   ```html
   Subject: Don't miss out on {{custom_attribute.${product}}}!
   
   Hey {{${first_name}}} we saw you were interested in {{custom_attribute.${PRODUCT}}} 
   
   <a href="{{custom_attribute.${product_url}}}?abandonedEmail=true">
     You spent {{custom_attribute.${TIME_ENGAGED_IN_S}}} seconds checking it out.... Why not check it out once more before it sells out?!!
   </a>
   ```

3. Add personalization:
   - product name using `{{custom_attribute.${product}}}`
   - product URL using `{{custom_attribute.${product_url}}}`
   - add dynamic product images if available
   
:::tip
   - The `abandonedEmail=true` parameter in the URL helps track when users click through from abandoned browse emails
   - You can use this parameter to:
     - track email campaign success
     - remove users from the campaign audience once they've engaged. See image below for how to configure this in your Reverse ETL audience.
:::

![Filter Winback](images/retl-winback-filtered.png)


## Campaign settings

1. Configure timing:
   - set delay after trigger e.g. 1 hour
   - set quiet hours e.g. 9 PM - 9 AM local time
   - set frequency capping e.g. max 1 email per user per 24 hours

2. Set conversion tracking:
   - primary conversion: "Purchase"
   - secondary conversion: "Add to Cart"

## Testing the campaign

1. Return to **Edit Campaign** and click **Preview** at the bottom of the page
   - select **Search User** under preview message as user
   - if the user can't be found, ensure Census has synced product view data for this user
   - verify custom attributes are populated correctly in the email
   - click **Send Test** to send the test email

2. Verify email content:
   - check all personalization renders correctly
   - verify product links work
   - test on multiple email clients

3. Verify winback success:
    - click on the link you receive in the test email with the `abandonedEmail=true` parameter
    - in Snowflake or Census, check the `winback_successful` column for the user has been set to true

---
![Braze Test Email](images/retl-email.png)

---

## Best practices

- keep email content focused on one product
- include social proof (reviews, ratings)
- add sense of urgency (limited time offer)
- ensure mobile responsiveness
- include clear unsubscribe option

## Congratulations

Thanks for your effort! You have now set up an abandoned browse campaign in Braze, sent an email, and verified winback success. Let's review what we have achieved in the [conclusion](./conclusion.md).
