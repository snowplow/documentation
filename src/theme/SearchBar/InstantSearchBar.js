import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, Configure } from 'react-instantsearch';
import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares';

const searchClient = algoliasearch('9HS3C2MKTH', 'f22e24c1b333034a75914759b0f045c3');

// Create insights middleware for automatic event tracking
const insightsMiddleware = createInsightsMiddleware({
  insightsClient: window.aa, // This will use your Algolia Insights client
});

function Hit({ hit }) {
  return (
    <div className="hit">
      <a href={hit.url}>
        <h3>{hit.title}</h3>
        <p>{hit.content}</p>
      </a>
    </div>
  );
}

export default function InstantSearchBar() {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="snowplow"
    >
      <Configure
        facetFilters={['language:en']}
      />
      <SearchBox
        placeholder="Search documentation..."
        classNames={{
          root: 'searchbox',
          form: 'searchbox-form',
          input: 'searchbox-input',
          submit: 'searchbox-submit',
          reset: 'searchbox-reset',
        }}
      />
      <Hits hitComponent={Hit} />
    </InstantSearch>
  );
}