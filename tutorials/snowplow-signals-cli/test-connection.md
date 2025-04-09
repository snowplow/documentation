---
position: 2
title: Testing Connection
---

Let's start by verifying that we can connect to the Snowplow Signals services:

```bash
snowplow-batch-autogen test-connection \
  --api-url "YOUR_API_URL" \
  --api-key "YOUR_API_KEY" \
  --api-key-id "YOUR_API_KEY_ID" \
  --org-id "YOUR_ORG_ID" \
  --verbose
```

If you've set up environment variables, you can simply run:

```bash
snowplow-batch-autogen test-connection --verbose
```

This command will:

- Test authentication service connectivity
- Check API service health
- Verify all dependencies
- Provide detailed status information

## Expected Output

When the connection is successful, you should see:

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

## Troubleshooting

If you encounter any issues:

1. Verify your API credentials are correct
2. Check your network connectivity
3. Ensure your API key has the necessary permissions
4. Use the `--verbose` flag for more detailed error messages

Once you've successfully tested your connection, you're ready to initialize your dbt project. 