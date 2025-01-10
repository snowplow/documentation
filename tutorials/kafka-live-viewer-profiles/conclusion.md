---
position: 4
title: Conclusion
---

# Conclusion

In this tutorial, we have explored the **live viewer profiles** solution accelerator for video streaming, gaining practical insights into building, deploying, and extending real-time, event-driven architectures using Snowplow and Kafka.

## Key Takeaways

### Understanding the Process
We successfully have built a real time system for processing event data including:
- **Web Tracking Application** for collecting media events.
![Application Output](images/video.png)
- **Snowplow Collector and Snowbridge** for event processing and forwarding.
- **Live Viewer Backend** for managing real-time data with Kafka and DynamoDB.
- **Live Viewer Frontend** for visualizing real-time user activity on the web tracking application.
![Live viewer frontend](images/live-viewer.png)

This architecture highlights how real-time insights can be achieved using event-driven systems in a streaming context.

### Setting Up Locally with LocalStack
We learned how to:
1. Use LocalStack to emulate AWS services for local development and testing.
2. Launch and interact with the system components, such as the Kafka UI and LocalStack UI.
3. View and verify the real-time event data from the browser using Snowplow's media tracking capabilities.

### Deploying on AWS with Terraform
We also explored the process of deploying the solution in a production-ready environment using Terraform. This involved:
- Configuring the AWS environment.
- Initializing and applying the Terraform scripts.
- Managing the infrastructure to ensure smooth operations in the cloud.

### Practical Applications
This tutorial demonstrated how to utilize Snowplow event data for practical use cases, such as:
- Real-time viewer insights.
- Engagement analytics.
- Personalized recommendations.
- Ad performance tracking.

## Next Steps
- **Extend tracking**: Extend the solution to track more granular user interactions or integrate your own media
- **Additional platforms**: Implement the solution for other platforms, such as media interactions on mobile.
- **Extend dashboard**: Extend the Live Viewer to include information on the media being watched and the user. 

By completing this tutorial, you are equipped to harness the power of event-driven systems and Snowplow’s analytics framework to build dynamic, real-time solutions tailored to your streaming and analytics needs.
