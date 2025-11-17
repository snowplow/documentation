import React from 'react';
import Layout from '@theme/Layout';
import InstantSearchWithEvents from '../components/InstantSearchWithEvents';
import insights from 'search-insights';

export default function SearchTest() {
  const handleTestConversion = () => {
    // Send a test conversion event
    insights('convertedObjectIDs', {
      index: 'snowplow',
      eventName: 'Test Conversion - Manual Click',
      objectIDs: ['test-object-id'],
    });
    alert('Test conversion event sent! Check the Algolia Events Debugger.');
  };

  return (
    <Layout
      title="Search Test"
      description="Test page for InstantSearch with Algolia Events"
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col">
            <h1>InstantSearch with Algolia Events</h1>
            <p>
              This page demonstrates InstantSearch with automatic events collection enabled.
              Try searching for something and clicking on results - events will be automatically tracked!
            </p>

            <InstantSearchWithEvents />

            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <h3>What's being tracked:</h3>
              <ul>
                <li><strong>Search events</strong>: Automatically tracked when you type</li>
                <li><strong>View events</strong>: When search results are displayed</li>
                <li><strong>Click events</strong>: When you click on a search result (requires queryID)</li>
                <li><strong>Conversion events</strong>: When you click on search results (simulates page views)</li>
              </ul>

              <button
                onClick={handleTestConversion}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#0066cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Send Test Conversion Event
              </button>

              <p style={{ marginTop: '15px' }}>
                <small>
                  <strong>Note:</strong> To verify events are being sent, check your browser's Network tab
                  for requests to insights.algolia.io or use the Algolia Events Debugger in your dashboard.
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}