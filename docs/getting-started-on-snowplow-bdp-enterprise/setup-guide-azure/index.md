---
title: "Setup Snowplow BDP on Azure"
sidebar_position: 30
---

## Request your pipeline through Snowplow BDP Console

Login to Snowplow BDP Console where you'll be able to follow a step-by-step guide to getting started (including the steps below).

## Setting up your Azure account

To get your cloud environment ready for your Snowplow pipeline to be installed:

### Create a new account

Create a new Azure account and tenant segregated from anything else you have running in Azure. For the latest documentation on setting up a new account and tenant please refer to the [Azure documentation](https://azure.microsoft.com/).

### Enable billing for the account

Enable billing in the tenant by creating a subscription. Otherwise, the pipeline will fail to deploy. For details on enabling billing for your tenant, please refer to the Azure documentation for [subscriptions](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/create-subscription).

### Set up access and required permissions

Snowplow deploys into your tenant using a verified [application service principal](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals?tabs=browser#service-principal-object) (Enterprise application). We require a custom role to be assigned to the application service principal. This will allow us to create custom pipeline roles needed for deploying and managing different components of your infrastructure.

#### Consent to Snowplow BDP Enterprise Deployment application

You will need to grant our verified application service principal the access into your Azure tenant. Once that’s done, you should see the application service principal under _Microsoft Entra ID_ → _Enterprise Applications_.

1. Grab your Azure tenant ID by navigating to Microsoft Entra ID
2. Complete the consent URL where `<TenantID>` is your tenant ID. The `client_id` set is for “Snowplow BDP Enterprise Deployment” application service principal
    ```
    https://login.microsoftonline.com/<TenantID>/oauth2/authorize?client_id=0581feb4-b614-42c7-b8e7-b4e7fba9153a&response_type=code
    ```
3. Have your Azure tenant admin consent to setting up an Enterprise application trust within your tenant
4. Verify the trust has been established by viewing “Snowplow BDP Enterprise Deployment” application in the Enterprise Applications section of Entra ID

#### Create and assign role to application service principal

Create a custom role and assign it the “Snowplow BDP Enterprise Deployment” application service principal under your subscription. This grants the permission to create distinct roles for deploying and managing infrastructure resources that make up your pipeline.

1. Navigate to your newly created subscription
2. Click into “Access Control (IAM)”
3. Click “Add custom role”
4. Create the following role, which allows Snowplow to create various roles that are specific to components that make up your pipeline. The `customer_subscription_id` should be the subscription ID that Snowplow will deploy into
    ```json
    {
        "properties": {
            "roleName": "Snowplow-Deployment-Role-Creator-Role",
            "description": "Custom policy to allow creation of individual Azure stack related roles",
            "assignableScopes": [
                "/subscriptions/<customer_subscription_id>"
            ],
            "permissions": [
                {
                    "actions": [
                        "Microsoft.Authorization/roleAssignments/write",
                        "Microsoft.Authorization/roleAssignments/read",
                        "Microsoft.Authorization/roleAssignments/delete",
                        "Microsoft.Authorization/roleDefinitions/write",
                        "Microsoft.Authorization/roleDefinitions/read",
                        "Microsoft.Authorization/roleDefinitions/delete",
                        "Microsoft.Resources/subscriptions/resourcegroups/read"
                    ],
                    "notActions": [],
                    "dataActions": [],
                    "notDataActions": []
                }
            ]
        }
    }
    ```
5. Within “Access Control (IAM)”, click “Add role assignment”
6. Assign the `Snowplow-Deployment-Role-Creator-Role` to service principal “Snowplow BDP Enterprise Deployment”

### Final checklist

If you are sending a request to our team to set up deployment into your Azure account, please ensure you provide the following information:
1. The tenant ID
2. The subscription ID
3. Azure region to deploy into
4. The ID of the `Snowplow-Deployment-Role-Creator-Role`
