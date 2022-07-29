---
title: "Marketo"
date: "2020-02-26"
sidebar_position: 70
---

## Overview

This webhook integration lets you track webhook events logged by [Marketo](https://www.marketo.com/).

### Compatibility

- [Snowplow R107 Trypillia](https://github.com/snowplow/snowplow/releases/tag/r107-trypillia)
- [Marketo webhooks](http://developers.marketo.com/webhooks/)

## Setup

Integrating Marketo's webhooks into Snowplow is a two-stage process:

1. Configure Marketo to send events to Snowplow
2. (Optional) Create the Marketo events tables for Amazon Redshift

## Marketo

### Creating the webhook

1. Go to **Admin** and click on **Webhooks**.
2. Click **New Webhook**.
3. Name and configure your webhook.

### Webhook payload template

Set the ‘Request Token Encoding’ to JSON and the ‘Request Type’ to POST. Enter your URL endpoint in the ‘URL’ box. The URL for your webhook is:

```markup
http://collector.domain.com/com.marketo/v1?aid=<company code>
```

To further distinguish the webhooks 3 additional fields are included: “name”, “description” and “step”. In order to populate these fields custom tokens must be created for each webhook. Custom tokens (begins with ‘{{my.’ followed by the name you created for the token) can be created in either campaign folders or programs. For our custom “step” field please create the custom token as a “number” type.

In the below example the webhook is called at the 3rd step in Campaign A’s flow.

**_NOTE:_ change the token names for the first 3 fields to align with the event your own webhook is activated on.**

```json
{   
   "name": {{my.Campaign A}},
   "description": {{my.Campaign A desc}},
   "step": {{my.Campaign A step}},
   "campaign": {
      "description": {{campaign.description}},
      "id": {{campaign.id}},
      "name": {{campaign.name}}
   },
   "company": {
      "account_owner_email_address": {{company.Account Owner Email Address}},
      "account_owner_first_name": {{company.Account Owner First Name}},
      "account_owner_last_name": {{company.Account Owner Last Name}},
      "annual_revenue": {{company.Annual Revenue}},
      "billing_address": {{company.Billing Address}},
      "billing_city": {{company.Billing City}},
      "billing_country": {{company.Billing Country}},
      "billing_postal_code": {{company.Billing Postal Code}},
      "billing_state": {{company.Billing State}},
      "name": {{company.Company Name}},
      "notes": {{company.Company Notes}},
      "industry": {{company.Industry}},
      "main_phone": {{company.Main Phone}},
      "num_employees": {{company.Num Employees}},
      "parent_company_name": {{company.Parent Company Name}},
      "sic_code": {{company.SIC Code}},
      "site": {{company.Site}},
      "website": {{company.Website}}
   },
   "lead": {
      "acquisition_date": {{lead.Acquisition Date}},
      "acquisition_program_name": {{lead.Acquisition Program Name}},
      "acquisition_program": {{lead.Acquisition Program}},
      "address": {{lead.Address}},
      "anonymous_ip": {{lead.Anonymous IP}},
      "black_listed": {{lead.Black Listed}},
      "city": {{lead.City}},
      "country": {{lead.Country}},
      "created_at": {{lead.Created At}},
      "date_of_birth": {{lead.Date of Birth}},
      "department": {{lead.Department}},
      "do_not_call_reason": {{lead.Do Not Call Reason}},
      "do_not_call": {{lead.Do Not Call}},
      "email_address": {{lead.Email Address}},
      "email_invalid_cause": {{lead.Email Invalid Cause}},
      "email_invalid": {{lead.Email Invalid}},
      "email_suspended_at": {{lead.Email Suspended At}},
      "email_suspended_cause": {{lead.Email Suspended Cause}},
      "email_suspended": {{lead.Email Suspended}},
      "fax_number": {{lead.Fax Number}},
      "first_name": {{lead.First Name}},
      "full_name": {{lead.Full Name}},
      "inferred_city": {{lead.Inferred City}},
      "inferred_company": {{lead.Inferred Company}},
      "inferred_country": {{lead.Inferred Country}},
      "inferred_metropolitan_area": {{lead.Inferred Metropolitan Area}},
      "inferred_phone_area_code": {{lead.Inferred Phone Area Code}},
      "inferred_postal_code": {{lead.Inferred Postal Code}},
      "inferred_state_region": {{lead.Inferred State Region}},
      "is_customer": {{lead.Is Customer}},
      "is_partner": {{lead.Is Partner}},
      "job_title": {{lead.Job Title}},
      "last_interesting_moment_date": {{lead.Last Interesting Moment Date}},
      "last_interesting_moment_description": {{lead.Last Interesting Moment Desc}},
      "last_interesting_moment_source": {{lead.Last Interesting Moment Source}},
      "last_interseting_moment_type": {{lead.Last Interesting Moment Type}},
      "last_name": {{lead.Last Name}},
      "lead_owner_email_address": {{lead.Lead Owner Email Address}},
      "lead_owner_first_name": {{lead.Lead Owner First Name}},
      "lead_owner_job_title": {{lead.Lead Owner Job Title}},
      "lead_owner_last_name": {{lead.Lead Owner Last Name}},
      "lead_owner_phone_numnber": {{lead.Lead Owner Phone Number}},
      "lead_rating": {{lead.Lead Rating}},
      "lead_score": {{lead.Lead Score}},
      "lead_source": {{lead.Lead Source}},
      "lead_status": {{lead.Lead Status}},
      "lead_marketing_suspended": {{lead.Marketing Suspended}},
      "facebook_display_name": {{lead.Marketo Social Facebook Display Name}},
      "facebook_id": {{lead.Marketo Social Facebook Id}},
      "facebook_photo_url": {{lead.Marketo Social Facebook Photo URL}},
      "facebook_profile_url": {{lead.Marketo Social Facebook Profile URL}},
      "facebook_reach": {{lead.Marketo Social Facebook Reach}},
      "facebook_referred_enrollments": {{lead.Marketo Social Facebook Referred Enrollments}},
      "facebook_referred_visits": {{lead.Marketo Social Facebook Referred Visits}},
      "gender": {{lead.Marketo Social Gender}},
      "last_referred_enrollment": {{lead.Marketo Social Last Referred Enrollment}},
      "last_referred_visit": {{lead.Marketo Social Last Referred Visit}},
      "linkedin_display_name": {{lead.Marketo Social LinkedIn Display Name}},
      "linkedin_id": {{lead.Marketo Social LinkedIn Id}},
      "linkedin_photo_url": {{lead.Marketo Social LinkedIn Photo URL}},
      "linkedin_profile_url": {{lead.Marketo Social LinkedIn Profile URL}},
      "linkedin_reach": {{lead.Marketo Social LinkedIn Reach}},
      "linkedin_referred_enrollments": {{lead.Marketo Social LinkedIn Referred Enrollments}},
      "linkedin_referred_visits": {{lead.Marketo Social LinkedIn Referred Visits}},
      "syndication_id": {{lead.Marketo Social Syndication Id}},
      "total_referred_enrollments": {{lead.Marketo Social Total Referred Enrollments}},
      "total_referred_visits": {{lead.Marketo Social Total Referred Visits}},
      "twitter_display_name": {{lead.Marketo Social Twitter Display Name}},
      "twitter_id": {{lead.Marketo Social Twitter Id}},
      "twitter_photo_url": {{lead.Marketo Social Twitter Photo URL}},
      "twitter_profile_url": {{lead.Marketo Social Twitter Profile URL}},
      "twitter_reach": {{lead.Marketo Social Twitter Reach}},
      "twitter_referred_enrollments": {{lead.Marketo Social Twitter Referred Enrollments}},
      "twitter_referred_visits": {{lead.Marketo Social Twitter Referred Visits}},
      "middle_name": {{lead.Middle Name}},
      "mobile_phone_number": {{lead.Mobile Phone Number}},
      "number_of_optys": {{lead.Number of Optys}},
      "original_referrer": {{lead.Original Referrer}},
      "original_search_engine": {{lead.Original Search Engine}},
      "original_search_phrase": {{lead.Original Search Phrase}},
      "original_source_info": {{lead.Original Source Info}},
      "original_source_type": {{lead.Original Source Type}},
      "person_note": {{lead.Person Notes}},
      "person_timezone": {{lead.Person Time Zone}},
      "phone_number": {{lead.Phone Number}},
      "postal_code": {{lead.Postal Code}},
      "priority": {{lead.Priority}},
      "registration_source_info": {{lead.Registration Source Info}},
      "registration_source_type": {{lead.Registration Source Type}},
      "relative_score": {{lead.Relative Score}},
      "relative_urgency": {{lead.Relative Urgency}},
      "role": {{lead.Role}},
      "salutation": {{lead.Salutation}},
      "state": {{lead.State}},
      "total_opty_amount": {{lead.Total Opty Amount}},
      "total_opty_expected_revenue": {{lead.Total Opty Expected Revenue}},
      "unsubscribed_reason": {{lead.Unsubscribed Reason}},
      "unsubscribed": {{lead.Unsubscribed}},
      "updated_at": {{lead.Updated At}},
      "urgency": {{lead.Urgency}}
   },
   "program": {
      "description": {{program.description}},
      "id": {{program.id}},
      "name": {{program.name}}
   },
   "social": {
      "promo_code": {{social.Promo Code}},
      "share_url": {{social.Share Url}},
      "email": {{social.Social Email}}
   },
   "sp_send_alert_info": {{SP_Send_Alert_Info}},
   "datetime": {{system.dateTime}},
   "forward_to_friend_link": {{system.forwardToFriendLink}},
   "munkinId": {{system.munchkinId}},
   "unsubscribed_link": {{system.unsubscribeLink}},
   "view_as_webpage_link": {{system.viewAsWebpageLink}}
}
```

### [](https://github.com/snowplow/snowplow/wiki/Marketo-webhook-setup#213-using-the-webhook)2.1.3 Using the webhook

1. Create or edit an existing smart campaign.
2. Go to the **Flow** tab and drag in the **Call Webhook** flow action.
3. Select the name of the webhook from the first step.
    - You can also use webhooks in a smart list.
    - You can also use webhooks in **Add Choice** in a flow step.

The selected webhook will now be called whenever people enter the smart campaign flow. If you’d like to test a webhook before sending to Snowplow we recommend substituting the Snowplow webhook URL with a [Request Bin](https://requestb.in/)
