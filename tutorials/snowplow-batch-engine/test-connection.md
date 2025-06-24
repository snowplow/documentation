---
position: 2
title: Testing Your Connection
---

Before we start working with Snowplow Signals, let's make sure we can connect to all the necessary services. This step is crucial as it verifies that:
- Your API credentials are correct
- All required services are accessible
- Your network connection is working properly

## Testing the Connection

You can test your connection using the following command:

```bash
snowplow-batch-autogen test-connection \
  --api-url "YOUR_API_URL" \
  --api-key "YOUR_API_KEY" \
  --api-key-id "YOUR_API_KEY_ID" \
  --org-id "YOUR_ORG_ID" \
  --verbose
```

If you've set up the environment variables as shown in the previous step, you can use this simpler command:

```bash
snowplow-batch-autogen test-connection --verbose
```

## What's Being Tested?

The connection test checks several important components:

- 🔐 Authentication service: verifies your API credentials
- 🌐 API service: ensures the main service is accessible
- 📊 Checks the status of:
  - Database connections
  - Cache service
  - Storage systems

## Successful Connection

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

## Troubleshooting Connection Issues

If you encounter any problems:

1. Double-check your API credentials
2. Verify your network connection
3. Ensure your API key has the required permissions
4. Use the `--verbose` flag for detailed error messages
5. Check if your organization's services are up and running

Once you see the success message, you're ready to create your first project!
