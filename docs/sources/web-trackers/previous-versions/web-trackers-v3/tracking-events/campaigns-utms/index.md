---
title: "Campaigns and UTMs"
sidebar_position: 90
description: "Documentation for Campaigns and UTMs in the web tracker."
keywords: ["tracker", "configuration"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Campaign tracking is used to identify the source of traffic coming to a website.

At the highest level, we can distinguish **paid** traffic (that derives from ad spend) with **non-paid** traffic: visitors who come to the website by entering the URL directly, clicking on a link from a referrer site or clicking on an organic link returned in a search results, for example.

In order to identify **paid** traffic, Snowplow users need to set five query parameters on the links used in ads. Snowplow checks for the presence of these query parameters on the web pages that users load: if it finds them, it knows that that user came from a paid source, and stores the values of those parameters so that it is possible to identify the paid source of traffic exactly.

If the query parameters are not present, Snowplow reasons that the user is from a **non-paid** source of traffic. It then checks the page referrer (the url of the web page the user was on before visiting our website), and uses that to deduce the source of traffic:

1. If the URL is identified as a search engine, the traffic medium is set to "organic" and Snowplow tries to derive the search engine name from the referrer URL domain and the keywords from the query string.
2. If the URL is a non-search 3rd party website, the medium is set to "referrer". Snowplow derives the source from the referrer URL domain.

Campaign information is **automatically tracked**.

### Identifying paid sources

Your different ad campaigns (PPC campaigns, display ads, email marketing messages, Facebook campaigns etc.) will include one or more links to your website e.g.:

```html
<a href="http://mysite.com/myproduct.html">Visit website</a>
```

We want to be able to identify people who've clicked on ads e.g. in a marketing email as having come to the site having clicked on a link in that particular marketing email. To do that, we modify the link in the marketing email with query parameters, like so:

```html
<a href="http://mysite.com/myproduct.html?utm_source=newsletter-october&utm_medium=email&utm_campaign=cn0201">Visit website</a>
```

For the prospective customer clicking on the link, adding the query parameters does not change the user experience. (The user is still directed to the webpage at `http://mysite.com/myproduct.html`.) But Snowplow then has access to the fields given in the query string, and uses them to identify this user as originating from the October Newsletter, an email marketing campaign with campaign id = cn0201.

### Anatomy of the query parameters

Snowplow uses the same query parameters used by Google Analytics. Because of this, Snowplow users who are also using GA do not need to do any additional work to make their campaigns trackable in Snowplow as well as GA. Those parameters are:

| **Parameter**  | **Name**         | **Description**                                                                                                                                       |
| -------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `utm_source`   | Campaign source  | Identify the advertiser driving traffic to your site e.g. Google, Facebook, autumn-newsletter etc.                                                    |
| `utm_medium`   | Campaign medium  | The advertising / marketing medium e.g. cpc, banner, email newsletter, in-app ad, cpa                                                                 |
| `utm_campaign` | Campaign id      | A unique campaign id. This can be a descriptive name or a number / string that is then looked up against a campaign table as part of the analysis     |
| `utm_term`     | Campaign term(s) | Used for search marketing in particular, this field is used to identify the search terms that triggered the ad being displayed in the search results. |
| `utm_content`  | Campaign content | Used either to differentiate similar content or two links in the same ad. (So that it is possible to identify which is generating more traffic.)      |

The parameters are described in the [Google Analytics help page](https://support.google.com/analytics/answer/1033863). Google also provides a [urlbuilder](https://support.google.com/analytics/answer/1033867?hl=en) which can be used to construct the URL incl. query parameters to use in your campaigns.
