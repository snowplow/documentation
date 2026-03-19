import React from 'react';
import Mermaid from '@theme-original/Mermaid';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function MermaidWrapper(props) {
  const isBrowser = useIsBrowser();

  return (
    <>
      {!isBrowser && (
        <div data-mermaid-source="" style={{display: 'none'}}>
          {props.value}
        </div>
      )}
      <Mermaid {...props} />
    </>
  );
}
