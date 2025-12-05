# Testing Algolia Events Implementation

## Quick Test (5 minutes)

1. **Start the development server**:
   ```bash
   yarn start
   ```

2. **Open the test page**:
   - Go to: http://localhost:3000/search-test

3. **Test search events**:
   - Type something in the search box (e.g., "tracking", "events", "snowplow")
   - You should see search results appear

4. **Test click and conversion events**:
   - Click on any search result
   - This sends both a click event AND a conversion event

5. **Test manual conversion**:
   - Click the blue "Send Test Conversion Event" button
   - You'll get an alert confirming the event was sent

## Verifying Events Are Working

### Method 1: Browser Developer Tools
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Filter by "insights" (type "insights" in the filter box)
4. Perform the tests above
5. Look for requests to `insights.algolia.io` - these contain your event data

### Method 2: Algolia Dashboard
1. Log into your Algolia Dashboard
2. Go to **Events** → **Debugger**
3. Perform the tests above
4. You should see events appearing in real-time:
   - `search` events (when typing)
   - `clickedObjectIDsAfterSearch` events (when clicking results)
   - `convertedObjectIDs` events (when clicking results + test button)

### Method 3: Analytics Dashboard
1. In Algolia Dashboard, go to **Events** → **Events Health**
2. Wait 5-10 minutes after testing
3. The warnings about "No click events" and "No conversion events" should disappear

## What Each Event Does

| Event Type | When It Fires | Purpose |
|------------|---------------|---------|
| **Search events** | When you type in the search box | Tracks what users are searching for |
| **View events** | When search results are displayed | Tracks what results users see |
| **Click events** | When you click a search result | Tracks which results users find useful |
| **Conversion events** | When you click a result or the test button | Tracks successful user interactions |

## Expected Results

✅ **Success indicators**:
- Search results appear when typing
- No console errors
- Network requests to `insights.algolia.io` visible in DevTools
- Events appearing in Algolia Events Debugger
- Analytics warnings disappear after 5-10 minutes

❌ **Failure indicators**:
- Console errors about missing packages
- No network requests to insights.algolia.io
- No events in Algolia Debugger
- Persistent warnings in Analytics dashboard

## Troubleshooting

- **No search results**: Check that you have data in your "snowplow" Algolia index
- **Console errors**: Make sure all packages are installed (`yarn install`)
- **No events in debugger**: Check your browser's ad blocker isn't blocking insights.algolia.io
- **Still getting warnings**: Wait longer (can take up to 30 minutes for analytics to update)