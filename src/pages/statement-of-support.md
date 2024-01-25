# Statement of Support

This Statement of Support defines the current scope of support provided for Snowplow’s products and services. As our product and service offerings change, this document will evolve to accommodate those changes. Further information on Snowplow products and additional definitions can be found in the associated [Product Description](#available-services).

The level of support and products that we support for you are described in your contract. This document augments your contract and our Product Description by offering general guidance on the scope of services provided by Snowplow to our customers.

In its simplest terms, this Statement of Support outlines what we support and what we don’t support at this time.

## Working With Support

We’re here to help 24x7 to provide product expertise, technical advice, and assistance throughout your journey with Snowplow. Don’t hesitate to contact us if you have product or implementation questions, or would like to discuss any aspect of our products or service.

:::info

Visit our docs to find out more about [Getting Started with Support](https://docs.snowplow.io/getting-started-with-support).

:::

### Raising Support Tickets

Customers are able to raise support tickets through our integrated support portal, by email (provided during onboarding), or using the form in BDP Console.

You’ll receive notifications by email when a support ticket has been updated, and also when the status changes. Whichever method you use to update support tickets (by email reply, or leaving responses in the support portal), all activity is recorded in the ticket. You can view and manage all your tickets in the Support Portal at any time.

Inbound calling is not currently offered as a support channel, however, we may proactively schedule calls with you to troubleshoot complex issues.

## Severity Levels

When you raise a ticket through Snowplow Support, they are prioritized as levels 1 (highest) to 4 (lowest), depending on the severity and impact of the issue or question. These severity levels are defined as follows. Support SLAs are defined in your Product Description and are dependent on these severity levels.

| Severity Level | Description |
| --- | --- |
| 1 (Urgent) | Product is not functioning reliably or securely in a production environment, rendering use of the service impossible with no alternative available. |
| 2 (High) | An error manifests in the product such that production usage is unreliable; or significant product functions do not work or cannot be used. A workaround might exist, but it is complex, requires significant effort or doesn’t always work. Product is functional but data/functionality is partially impacted, or intermittently impacted. |
| 3 (Normal) | General product usage questions and advice. Otherwise, a minor feature doesn’t work or fails eventually. The issue does not have a significant impact on product usage. There is an easy workaround that always avoids the problem or it happens rarely. |
| 4 (Low) | Usability errors, screen or report errors that do not materially affect quality and correctness of function, intended use or results. |

### Version Support

Unless otherwise stated in your contract, we provide official support for software that’s either in its latest version or the preceding version. If you need support for an older version, you may be asked to upgrade the component to a more recent version before we can provide assistance. You can find the [current versions of components](https://docs.snowplow.io/docs/pipeline-components-and-applications/versions/) in our documentation.

### Cloud Account Access

Customers should ensure that all users and roles configured by Snowplow retain their [required permissions](https://support.snowplow.io/hc/en-us/articles/9330740930717-FAQ-Pipeline-Data-Access). These are necessary to run and monitor your pipeline. If the permissions are changed or any users or roles removed, your pipeline may not function and our team will be unable to respond to problems.

Should we need additional access to your infrastructure, we will acquire your consent. Any extension of the initial access set up (for example, data access) is only enabled on a per-case basis and with your prior approval.

### Ticket Escalation

Snowplow Support is committed to serving your needs within the SLA terms outlined in the associated [Product Description](#available-services). We have escalation processes in the event that we need to engage other teams within Snowplow, either due to

- the technical complexity, access or other policy restrictions, or
- the nature of the issue or response, or in the case of policy or contractual limitations which require the guidance of more senior leadership at Snowplow.

Whatever happens, we will keep you in the loop on any changes to your support ticket or incident. If you wish to discuss the priority of a ticket, or otherwise request further attention on it, please reply to the ticket or use the *Please Prioritize* button on that ticket in the [Help Center](https://snowplow.zendesk.com/hc/en-us/requests/).

For details on your Service Level Agreements or Objectives, and any associated entitlements, please see the relevant [Product Description](#available-services).

### Cloud Provider Engagement

When resolving pipeline errors we may need to engage with your cloud support provider. We may ask you to initiate contact with them on our behalf in these situations. Alternatively, we are happy to engage with them on your behalf (once the necessary authorisation and access has been given).

We recommend having a business level of support with your cloud provider. If your cloud support entitlement is lower than business or enterprise equivalent, then in the event that we need to engage them, the service we are able to provide may be limited or reduced.

## Available Services

This table provides an outline of the support services provided by Snowplow available to our paid packages. Any support we provide you beyond this scope is on a discretionary basis, and might only be offered as part of a separate Statement of Work, with associated additional costs.

| | [Snowplow Community Edition](https://docs.snowplow.io/docs/getting-started-on-community-edition) | [Snowplow HA Pipeline](https://snowplow.io/snowplow-ha-pipeline-product-description) | [Try Snowplow (Trial)](https://try.snowplowanalytics.com) | [BDP Cloud](https://docs.snowplow.io/docs/getting-started-on-snowplow-bdp-cloud) | [BDP Enterprise](https://snowplow.io/snowplow-bdp-product-description) | [Data Model Packs](https://snowplow.io/snowplow-data-model-pack) |
| --- | --- | --- | --- | --- | --- | --- |
| Documentation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Community Support | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 24x7 Technical Support | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| Help Center, Knowledge Base & Snow School | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| Pipeline Health Monitoring | - | - | ✅ | ✅ | ✅ | - |
| Infrastructure-as-Code Management | - | - | ✅ | ✅ | ✅ | - |
| Managed Component Upgrades | - | - | ✅ | ✅ | ✅ | - |
| Deferred Upgrades | - | - | - | - | ✅ (Summit tier) | - |
| GitHub User Management | - | - | - | - | ✅ | - |
| Bad Data Recoveries | - | - | - | - | ✅ | - |
| Infrastructure Reviews | - | - | - | - | ✅ (Summit tier or standalone service) | - |

### Pipeline Health Monitoring

Our 24/7 team monitors your managed infrastructure components, in efforts to maintain uptime and data latency commitments. We also monitor real-time data delivery and work with you to resolve any issues impacting the flow of data through the pipeline. 

### Infrastructure-as-Code Management

We use proprietary means (via technologies such as Terraform) to manage the configuration of pipeline infrastructure and environments. Where appropriate, we’ll work with you to make and deploy certain configuration and secrets changes to the Snowplow pipeline setup on your behalf. 

We encourage you to reach out to us if you are considering setting up new use cases, or are expecting seasonal or periodic (eg daily) peaks in volume or usage; we will work with you to ensure your pipeline is optimally tuned for performance and cost management according to your changing needs.

### Managed Component Upgrades

Snowplow releases regular patches, improvements, and new features across our infrastructure stack. Our team seamlessly performs pipeline infrastructure upgrades as new versions become available, assessing risk and prioritizing bug fixes and critical security vulnerabilities. Where appropriate, we’ll communicate major feature releases and client side improvements, and work with your team to carefully manage your pipeline components, ensuring they’re operating on the latest recommended versions.

### Deferred Upgrades

Customers with this entitlement, for major updates, can request a deferred upgrade within a four week window. Our team will liaise with you to schedule the upgrade at a time convenient to you.

### GitHub User Management

Managing your pipeline usually requires Snowplow to assist with user access management for the GitHub snowplow-proservices pipeline repository. 

### Bad Data Recoveries

The Snowplow pipeline is designed to ensure that collected events are always available for reprocessing, even when they don’t pass validation. Data which fails validation is stored in a dedicated location and we can work with you in defining and designing options to recover those failed events, if possible.

### Infrastructure Reviews

Our team can provide valuable insights by conducting a review of your pipeline infrastructure and configuration. We’ll provide a report outlining recently performed infrastructure management activities (i.e. upgrades), your event delivery performance, and a summary of your pipeline health. This includes expert advice on how to maintain and improve the performance, reliability, security, and efficiency of your pipeline.

## Out of Scope

The following items are out of scope of the support services offered to Snowplow customers, unless by prior arrangement. Any support we provide you beyond this scope is on a discretionary basis, and might only be offered as part of a separate Statement of Work, with associated additional costs.

### Monitoring and Alerting

| Out of Scope | Example | What is in scope? |
| --- | --- | --- |
| Custom dashboards | Building custom CloudWatch dashboards in the AWS sub-account | If your team seeks to monitor the pipeline we can provide a list of the key metrics for them to configure a dashboard with |
| Custom alerting | Sending of notifications via Slack for pipeline failures | We send notifications of failures and errors by email to the nominated contact email(s) |

### Cloud Management

| Out of Scope | Example | What is in scope? |
| --- | --- | --- |
| Managing SSL certificates | Registering or renewing SSL certificates for your domain(s) | Updating the configuration of your pipeline to apply the new certificate to the collector |
| User access management | Provisioning and removing IAM users in AWS, or Project users in GCP | Although users are managed directly by your team, roles are managed through your pipeline configuration and our team are available to help create and manage roles |
| AWS reservations | Consulting with AWS and making reservations for AWS resources | We can investigate usage changes over time to provide recommendations so you can lead informed discussions with AWS about making reservations |
| Proxy management | Managing CloudFlare, Akamai, Fastly reverse proxy in front of the collector endpoint with  custom domains and SSL in the proxy itself | Reverse proxies are supported: we can still add any custom records to our configurations, ensuring we can monitor that endpoints are responding |
| Lifecycle rules | Configuring lifecycle rules and data retention policies for pipeline infrastructure (e.g. AWS S3) | Our team can provide general recommendations for select components such as AWS S3 buckets (see [S3 Buckets and Recommended Lifecycle Rules]( https://support.snowplow.io/hc/en-us/articles/360019773617)) |
| Cost management | Managing or monitoring the infrastructure costs associated with running your pipeline | We are able to provide general recommendations and best practice on right-sizing your infrastructure and storage. As part of our Infrastructure Review service, we are able to make more specific recommendations |
| Data warehouse migrations | Migration of data from one data warehouse to another, or the loading of historical data into a new data warehouse | Helping you to understand best practices surrounding data reprocessing if it’s required for your pipeline |
| Pipeline migrations | Migration of pipeline components between sub-accounts within your cloud provider or between cloud providers | Deployment and management of your pipeline in line with our https://snowplow.io/snowplow-bdp-product-description/ |
| Destination management | Managing Redshift or Elastic/Open Search clusters on your behalf. 

Note: some legacy agreements include destination management. Snowplow has sunset this service and therefore we do not offer 
* destination management for new customers
* management of additional destinations for existing customers with legacy agreements. | Helping you understand the requirements of destination setup for Snowplow, and advising on best practice. |

### Custom or Third-party Code

| Out of Scope | Example | What is in scope? |
| --- | --- | --- |
| Third-party data | Customisation and usage of data models to support data collected outside of a Snowplow pipeline | Customisation and usage of data models to support data collected inside a Snowplow pipeline |
| Third-party services | Providing advice on the capability and use of third-party APIs and services | Giving advice on the configuration and usage of Snowplow trackers and components |
| Custom code support | Technical support for forked or modified components, custom components, or code created externally to Snowplow. | Assistance and technical support on the full range of Snowplow developed components. |
| Troubleshooting custom data modeling jobs | Modified or custom SQL data and DBT modeling jobs that have failed and require troubleshooting | Assisting with triggering reruns and unlocking hard-locked data modeling jobs |
| Custom consumers | Development and ongoing maintenance and support of custom consumers | We’ll provide support for our Analytics SDKs which can be used for consumers |

## Preview Features and Services

We may offer a limited level of support for new features and offerings that are advertised as preview. This is agreed on a case-by-case basis: please contact us to discuss any of these options or features.

## Changes to the Statement of Support

Snowplow may change any aspect of this Statement of Support (and associated Product Description), provided that no such change materially reduces or otherwise has a materially adverse effect on your contracted support levels or the service we deliver in accordance with your contract.
