---
title: Summary
description: "Conclusion and best practices for managing Snowplow data structures using Git version control workflows."
schema: "HowTo"
keywords: ["Git Conclusion", "Schema Git", "Version Control", "Git Tutorial", "Schema Management", "Git Workflow"]
position: 7
---

## Let's break down what we've done

* We have seen how snowplow-cli can be used to work with data structures from the command line
* We have applied that knowledge to build github workflows which support automated validation and publication
* We have added source applications, data products and event specifications to use the same approach as data structures.

This approach provides you with:
- **Version control** for your data structures with full change history
- **Automated validation** to catch errors before they reach production
- **Approval workflows** through pull requests
- **Environment promotion** from development to production
- **Integration with data products** for comprehensive data governance

You now have a complete CI/CD pipeline for managing your Snowplow data structures using industry-standard tools and practices.
