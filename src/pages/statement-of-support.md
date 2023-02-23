# Statement of Support

This Statement of Support defines the scope of support provided for Snowplow BDP Cloud, BDP Enterprise and all other Snowplow products and services. Our friendly team is available 24x7 to provide product expertise, technical advice, and assistance throughout your journey with Snowplow.

The level of support and products that we support for you are described in your contract. This document augments your contract and our Product Description by offering general guidance on the scope of services provided by Snowplow to our customers. In simplest terms, the scope of support is what we support and what we don’t support at this time. Any support we provide you beyond this scope is discretionary and on a best-effort basis.

Snowplow Support is here to ensure you gain full value from Snowplow’s products and services. We work with you both in the run-up to go-live and in production, providing a broad range of support. This includes use-case and setup questions, handling product issues and enhancement requests, and resolving implementation-specific problems.

## All Products

The following services are provided for all BDP Cloud and BDP Enterprise customers. The support described here is not currently available to Open Source users.

### Support Channels

All requests for service should be raised to the team by email (provided to you during implementation), BDP Console, or through our integrated support portal, creating a ticket in our support system.

Inbound calling is not currently offered as a channel, however, agents may proactively schedule calls to troubleshoot complex cases. Customers may request a scheduled call with us at any time.

### Help & Support

We’re here to help, providing product support, answering questions, and giving guidance on our entire product suite and integrations, including advice on the capability of trackers, infrastructure, and configuration options. We also offer troubleshooting and assistance post-implementation to help you collect, enrich, load, and model your data. Our commitment to your success with data quality and usability is paramount, and you will always receive our best-effort assistance.

### Product Feedback

If you have feedback on any of our products including BDP Console, pipeline components, or trackers, don’t hesitate to reach out to our team. We’ll ensure any feedback is reviewed and let you know the outcome.

### Contact Management

Let us know when you’ve experienced staff changes so that we are able to update our internal systems to ensure we’re reaching out to the right people with notifications and updates when they’re required.

### Pipeline Monitoring

Our 24/7 team of engineers monitor your pipeline for errors, failures, and data latency events. This drives reliability, integrity, SLA compliance, and ensures you’re in-the-know of any disruptions or delays. If we detect an ongoing problem we’ll proactively notify your nominated contact(s).

### Pipeline Management

For BDP Enterprise and Cloud customers we use proprietary means to manage the configuration of pipeline infrastructure and environments. Where appropriate, we’ll work with you to make and deploy certain configuration and secrets changes to the Snowplow pipeline setup on your behalf. 

### Major Incident Response

An incident is an unplanned interruption to a service, or reduction in the quality of a business-critical service. Our team are here to provide communication, assistance, and insights when a major incident occurs. For [Priority 1](https://snowplow.io/snowplow-bdp-product-description/) incidents (and for certain mutually agreed other business critical situations), we’ll work with your team as required to establish root cause, perform remediation, and put in place future mitigation strategies. We can provide post incident reports to ensure your team are informed and feeling confident that plans are in place to reduce the chances of a reoccurrence.

How we respond to an individual incident varies depending on its severity and the affected feature(s). If you have any questions to clarify our coverage and response procedures for service incidents, don’t hesitate to reach out to our friendly team.

### Upgrades

Snowplow releases regular patches, improvements, and new features across our infrastructure stack. Our team seamlessly performs pipeline infrastructure upgrades as new versions become available, assessing risk and prioritizing bug fixes and critical security vulnerabilities. Where appropriate, we’ll communicate major feature releases and client side improvements, and work with your team to carefully manage your pipeline components, ensuring they’re operating on the latest recommended versions.

## BDP Enterprise

The following additional services are provided with BDP Enterprise (formerly Snowplow Insights). Services may differ between Snowplow BDP tiers and other bespoke contractual obligations. 

### Bad Data Recoveries

The Snowplow pipeline is designed to ensure that collected events are always available for reprocessing, even when they don’t pass validation. Data which fails validation is stored in a dedicated location and we can work with you in defining and designing options to recover those failed events, if possible.

### Access Management, Control, & Permissions

Managing your pipeline usually requires Snowplow to assist with user access management for the GitHub snowplow-proservices pipeline repository. We also manage the configuration of your Snowplow Console account enabling fine-grained user permissions and SSO if these features are included in your product tier or contract.

### Deferred Upgrades

Customers on our *Summit* plan, for major updates, can request a deferred upgrade within a four week window. Our team will liaise with you to schedule the upgrade at a time convenient to you.

### Infrastructure Reviews

As part of our Infrastructure Review service, our team review your current infrastructure and make recommendations in the following areas:

- History of recent infrastructure management activities (such as upgrades)
- Security
- Functional changes to better enable the pipeline
- Performance
- Reliability
- Efficiency and cost management

## Version Support

Unless otherwise stated in your contract, we provide official support for the currently recommended stack and two preceding stacks as defined in our [product description](https://snowplow.io/snowplow-bdp-product-description/). The currently recommended versions of components can be found on our [public technical documentation](https://docs.snowplow.io/docs/pipeline-components-and-applications/version-compatibility-matrix/latest-version-compatibility-matrix/).

### Try Snowplow & Open Source

If you’re seeking assistance with your Try Snowplow or Open Source pipelines, our team currently do not provide direct support for these products. We encourage you to make use of these resources :

- [Snowplow Docs](https://docs.snowplow.io/docs): Extensive product and engineering documentation of Snowplow features, functionality, and configuration.
- [Snowplow Discourse](https://discourse.snowplow.io/): Community forum where free & open source users, customers, and our team come together to discuss everything Snowplow.

## Access Needed to Support Your Pipeline

Customers should ensure that all pipeline and infrastructure users and roles configured by Snowplow retain their required permissions. These roles and users are necessary to run and monitor your pipeline and are protected by technical access policies and operational policies. If the configured permissions are changed, or any users or roles removed, your pipeline may not function correctly and our team will be unable to respond to problems that occur.

Should we need additional access to your infrastructure we will acquire your written consent. Any extension of the initial access set up (for example, data access) is only enabled on a per-case basis and with your prior approval.

## Out of Scope

The following items are out of scope of the support services offered to Snowplow BDP customers. From time to time we may offer help and support on these items, however, it is done so at Snowplow’s discretion and as a courtesy.

| Out of Scope | Example | What is in scope? |
| ------------ | ------- | ----------------- |
| Custom dashboards | Building custom CloudWatch dashboards in the AWS sub-account | If your team seeks to monitor the pipeline we can provide a list of the key metrics for them to configure a dashboard with |
| Custom alerting | Sending of notifications via Slack for pipeline failures | We send notifications of failures and errors by email to the nominated contact email(s) |
| Troubleshooting custom data modelling jobs | Modified or custom SQL data and DBT modelling jobs that have failed and require troubleshooting | Assisting with triggering reruns and unlocking hard-locked data modelling jobs |
| Managing SSL certificates | Registering or renewing SSL certificates for your domain(s) | Updating the configuration of your pipeline to apply the new certificate to the collector |
| User access management | Provisioning and removing IAM users in AWS, or Project users in GCP | Although users are managed directly by your team, roles are managed through your pipeline configuration and our team are available to help create and manage roles |
| Custom consumers | Development and ongoing maintenance and support of custom consumers | We’ll provide support for our Analytics SDKs which can be used for consumers |
| AWS reservations | Consulting with AWS and making reservations for AWS resources | We can investigate usage changes over time to provide recommendations so you can lead informed discussions with AWS about making reservations |
| Proxy management | Managing CloudFlare, Akamai, Fastly reverse proxy in front of the collector endpoint with custom domains and SSL in the proxy itself | Reverse proxies are supported: we can still add any custom records to our configurations, ensuring we can monitor that endpoints are responding |
| Lifecycle rules | Configuring lifecycle rules and data retention policies for pipeline infrastructure (e.g. AWS S3) | Our team can provide general recommendations for select components such as AWS S3 buckets (see [S3 Buckets and Recommended Lifecycle Rules](https://support.snowplow.io/hc/en-us/articles/360019773617-54-01-S3-Buckets-and-Recommended-Lifecycle-Rules)) |
| Cost management | Managing or monitoring the infrastructure costs associated with running your pipeline | We are able to provide general recommendations and best practice on right-sizing your infrastructure and storage. As part of our Infrastructure Review service, we are able to make more specific recommendations |

## Alpha & Beta Features and Services

We may offer a limited level of support for new features and offerings that are advertised as alpha or beta. This is agreed on a case-by-case basis: please contact us to discuss any of these options or features.
