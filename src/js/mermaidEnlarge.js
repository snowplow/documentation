/**
 * Global Mermaid diagram enlargement functionality
 * Automatically adds click-to-enlarge to all Mermaid diagrams
 */

function initMermaidEnlargement() {
  // Function to add click-to-enlarge to a Mermaid diagram
  function addEnlargementToMermaid(mermaidElement) {
    // Skip if already processed
    if (mermaidElement.classList.contains('mermaid-enlarge-enabled')) {
      return;
    }

    // Mark as processed
    mermaidElement.classList.add('mermaid-enlarge-enabled');

    // Add container class for styling
    mermaidElement.classList.add('mermaid-container');

    // Add click handler
    mermaidElement.addEventListener('click', function(e) {
      // Only on mobile/tablet
      if (window.innerWidth <= 768) {
        try {
          // Find SVG in this diagram
          let svg = this.querySelector('svg');
          if (!svg) svg = this.querySelector('.mermaid svg');
          if (!svg) svg = document.querySelector('[id^="mermaid-"]');

          if (svg) {
            const svgString = svg.outerHTML;
            const encodedSvg = btoa(unescape(encodeURIComponent(svgString)));
            const newWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');

            if (newWindow) {
              newWindow.document.write(`
                <html>
                  <head>
                    <title>Mermaid Diagram</title>
                    <style>
                      body { margin: 0; padding: 20px; background: white; font-family: Arial, sans-serif; }
                      svg { max-width: 100%; height: auto; display: block; margin: 0 auto; }
                    </style>
                  </head>
                  <body>
                    <h2>Diagram</h2>
                    <img src="data:image/svg+xml;base64,${encodedSvg}" style="max-width:100%;height:auto;display:block;margin:0 auto;"/>
                  </body>
                </html>
              `);
              newWindow.document.close();
            }
          } else {
            // Fallback: wait and retry
            setTimeout(() => {
              const delaySvg = this.querySelector('svg') || document.querySelector('.mermaid svg');
              if (delaySvg) {
                const svgString = delaySvg.outerHTML;
                const encodedSvg = btoa(unescape(encodeURIComponent(svgString)));
                const newWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');
                if (newWindow) {
                  newWindow.document.write(`
                    <html>
                      <head><title>Mermaid Diagram</title></head>
                      <body style="margin:0;padding:20px;background:white;">
                        <h2>Diagram</h2>
                        <img src="data:image/svg+xml;base64,${encodedSvg}" style="max-width:100%;height:auto;display:block;margin:0 auto;"/>
                      </body>
                    </html>
                  `);
                  newWindow.document.close();
                }
              }
            }, 500);
          }
        } catch (error) {
          console.error('Error enlarging diagram:', error);
        }
      }
    });

    // Add visual indicator that it's clickable
    mermaidElement.style.cursor = 'pointer';
  }

  // Function to process all Mermaid diagrams
  function processAllMermaidDiagrams() {
    // Find all Mermaid diagrams using various selectors
    const mermaidElements = document.querySelectorAll('.mermaid, [class*="mermaid"], pre.mermaid, div.mermaid');

    mermaidElements.forEach(addEnlargementToMermaid);
  }

  // Initial processing
  processAllMermaidDiagrams();

  // Watch for new Mermaid diagrams (for dynamic content)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Safely check if the node is a Mermaid diagram
          if (node.classList && node.classList.contains('mermaid')) {
            addEnlargementToMermaid(node);
          } else if (node.className && typeof node.className === 'string' && node.className.includes('mermaid')) {
            addEnlargementToMermaid(node);
          }

          // Check if the added node contains Mermaid diagrams
          try {
            const mermaidElements = node.querySelectorAll && node.querySelectorAll('.mermaid, [class*="mermaid"], pre.mermaid, div.mermaid');
            if (mermaidElements && mermaidElements.length > 0) {
              mermaidElements.forEach(addEnlargementToMermaid);
            }
          } catch (e) {
            // Ignore errors from querySelectorAll on non-element nodes
          }
        }
      });
    });
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Re-process after page navigation (for SPAs like Docusaurus)
  window.addEventListener('popstate', () => {
    setTimeout(processAllMermaidDiagrams, 100);
  });

  // Re-process periodically to catch any missed diagrams
  setInterval(processAllMermaidDiagrams, 2000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMermaidEnlargement);
} else {
  initMermaidEnlargement();
}

// Also initialize on window load as backup
window.addEventListener('load', initMermaidEnlargement);