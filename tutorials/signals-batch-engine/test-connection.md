---
position: 3
title: Test the Signals batch engine connections
sidebar_label: Test the connection
description: "Verify connectivity to Snowplow Signals API and check database, cache, and storage service health before initializing dbt projects."
keywords: ["signals api connection test", "batch engine authentication"]
---

The first step is to confirm that you can connect to all the necessary services.

The connection test checks several important components:
* Verifies your API credentials
* Ensures the main Signals API service is accessible
* Checks the status of:
  * Database connections
  * Cache service
  * Storage systems

Test your connection using the following command:

```bash
snowplow-batch-engine test-connection --verbose
```

If you didn't set up environment variables, you can also provide the credentials as command-line flags:

```bash
snowplow-batch-engine test-connection \
  --api-url "YOUR_API_URL" \
  --api-key "YOUR_API_KEY" \
  --api-key-id "YOUR_API_KEY_ID" \
  --org-id "YOUR_ORG_ID" \
  --verbose
```

When everything is working correctly, you'll see a clear success message:

```bash
🔐 Testing authentication service...
✅ Authentication service is healthy

🌐 Testing API service...
✅ API service is healthy
📊 Dependencies status:
   ✅ database: ok
   ✅ cache: ok
   ✅ storage: ok

✨ All services are operational!
```

You can continue to the next step.

## Troubleshooting

If you encounter any problems:

1. Double-check your API credentials
2. Verify your network connection
3. Ensure your API key has the required permissions
4. Use the `--verbose` flag for detailed error messages
5. Check if your organization's services are up and running
