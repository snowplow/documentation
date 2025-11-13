# Supporting Restrictive Access Models

## Introduction

Snowplow’s PMC ("Private Managed Cloud") deployment model leverages a proprietary Infrastructure-as-Code (IaC) platform to deploy and manage the various components for a Snowplow Pipeline into customer-managed cloud environments such as AWS, GCP, or Azure. Our deployment architecture has been intentionally designed over the years to strike a balance between customer-specific configurability and Snowplow’s own best practices for running this pipeline at scale. It has also been designed to operate seamlessly within our overall Console experience, which is hosted and managed by Snowplow. While we do offer significant configurability for both the pipeline itself and the deployment model to accommodate the widest possible variety of customer-specific requirements, there are certain constraints that prevent us from supporting certain cloud environments or custom solutions that impose significant restrictions on access, deployment, and monitoring capabilities.

## Access to dedicated networking resources

Our architecture is designed for resilience with certain patterns including auto-scaling nodes and resources. Whether with VMs, K8S Nodes and Pods, or Databases, we require dedicated subnets to ensure the pipeline can scale to meet traffic demands. Because of this, we cannot support deploying into subnets containing resources not managed by Snowplow.

## Access to the Latest Managed Services

Our solution relies on the continuous availability and access to the latest versions of managed services offered by cloud providers. This includes resources such as node types, OS flavors and versions, database engines and versions, etc. Restrictions that limit our ability to utilize the latest common services would result in an inability to maintain the performance, security, and functionality of our managed deployment. For instance, environments like AWS GovCloud (US), which are designed to meet specific regulatory requirements, restrict access to certain managed services and may not support the latest versions of those services promptly. Similarly, GCP Sovereign Cloud or Azure Government Cloud can impose similar limitations, thereby impacting our ability to deliver our solution effectively.

## Jurisdictional Restrictions on Operators

Our global SRE and Support teams play a crucial role in the 24/7 monitoring and maintaining the health and uptime of our deployed pipelines. Any restrictions on citizenship or residency for our operators directly conflicts with our global operational model and would be untenable to support. Additionally, our internal control plane, which orchestrates most of the deployments, modifications and monitoring, is also global, and any jurisdictional restriction on operators poses a significant barrier to delivering our managed services.

## Public Internet Access and Networking Considerations

Our deployment and monitoring processes require secure access to customer environments over the public internet. Restrictions that require the use of controls such as customer-managed VPN connections or SSO authentication to handle deployments or monitoring are not supported. While we do support locking down customer endpoints to desired IP ranges through firewall rules, we do require at least our internal IP ranges to have direct access over the public internet. Cloud environments or custom architectures that impose such restrictions are therefore incompatible with this deployment model.

## Impact of Restrictive Organizational Policies

We require a level of access that allows us to create and manage service accounts, roles, policies, and other necessary configurations within the customer’s cloud environment. Environments with overly restrictive organizational policies, service control policies (SCP), or permission boundaries would limit our ability to perform essential tasks and may prevent us from deploying or managing our solution effectively. As each cloud is different, please see our latest documentation for specific details on access requirements for our deployment and administration roles or service accounts.

## Conclusion

While we are currently unable to support cloud environments that impose significant restrictions—such as AWS GovCloud, Google Sovereign Cloud, Azure Government Cloud, or custom-managed solutions that impose similar levels of restrictions—we remain committed to delivering a high-quality managed cloud experience. Our team continuously explores ways to tailor our solution to meet diverse customer needs within the bounds of our operational and security standards. Additionally, we do understand that some organizations have restrictions that cannot change. Snowplow does offer a Hosted solution for situations where PMC may not be the best fit. We welcome discussions on how we can best accommodate specific requirements and look forward to finding solutions that align with both our capabilities and your organizational needs.
