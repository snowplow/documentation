import React from 'react';
import { algoliasearch } from 'algoliasearch';
import { InstantSearch, SearchBox, Hits, Configure } from 'react-instantsearch';
import insights from 'search-insights';

// Initialize the search client
const searchClient = algoliasearch('9HS3C2MKTH', 'f22e24c1b333034a75914759b0f045c3');

// Initialize insights for automatic events collection
insights('init', {
  appId: '9HS3C2MKTH',
  apiKey: 'f22e24c1b333034a75914759b0f045c3',
  useCookie: true,
});

// Custom Hit component that tracks click events
function Hit({ hit }) {
  const handleClick = () => {
    // Send click event when user clicks on a result
    if (hit.__queryID) {
      insights('clickedObjectIDsAfterSearch', {
        index: 'snowplow',
        eventName: 'Documentation Search Result Clicked',
        objectIDs: [hit.objectID],
        positions: [hit.__position || 1],
        queryID: hit.__queryID,
      });
    }

    // Also send a conversion event for viewing documentation
    setTimeout(() => {
      insights('convertedObjectIDs', {
        index: 'snowplow',
        eventName: 'Documentation Page Viewed',
        objectIDs: [hit.objectID],
      });
    }, 1000); // Small delay to ensure click is tracked first
  };

  return (
    <div className="hit">
      <a
        href={hit.url}
        style={{ textDecoration: 'none', color: 'inherit' }}
        onClick={handleClick}
      >
        <div style={{ padding: '10px', border: '1px solid #eee', margin: '5px 0', borderRadius: '4px', cursor: 'pointer' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#0066cc' }}>
            {hit.title}
          </h3>
          <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
            {hit.content && hit.content.length > 150
              ? `${hit.content.substring(0, 150)}...`
              : hit.content
            }
          </p>
          <small style={{ color: '#999' }}>{hit.url}</small>
        </div>
      </a>
    </div>
  );
}

export default function InstantSearchWithEvents() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <InstantSearch
        searchClient={searchClient}
        indexName="snowplow"
        insights={true}  // Enable insights
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <Configure
          facetFilters={['language:en']}
          hitsPerPage={10}
          clickAnalytics={true}  // Enable click analytics
        />

        <SearchBox
          placeholder="Search documentation..."
          classNames={{
            root: 'mb-4',
            form: 'relative',
            input: 'w-full p-3 border border-gray-300 rounded-lg text-base',
            submit: 'absolute right-3 top-3 text-gray-400',
            reset: 'absolute right-10 top-3 text-gray-400',
          }}
          searchAsYouType={true}
        />

        <Hits
          hitComponent={Hit}
        />
      </InstantSearch>
    </div>
  );
}