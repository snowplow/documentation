import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common'
import {
  CodeBlockContextProvider,
  createCodeBlockMetadata,
} from '@docusaurus/theme-common/internal'
import { bundledLanguages, codeToHtml } from 'shiki';
import styles from './styles.module.css';

// Copy icon component - matching screenshot design
function CopyIcon({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

// Check icon component
function CheckIcon({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

// Wrap lines icon component - three horizontal lines as shown in screenshot
function WrapIcon({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

// Copy button component
function CopyButton({ code, className }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={clsx(styles.codeActionButton, className)}
      title={isCopied ? "Copied!" : "Copy code"}
      aria-label={isCopied ? "Copied!" : "Copy code"}
    >
      {isCopied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

// Wrap toggle button component
function WrapButton({ isWrapped, onToggle, className }) {
  return (
    <button
      onClick={onToggle}
      className={clsx(
        styles.codeActionButton,
        styles.wrapButton,
        isWrapped && styles.wrapButtonActive,
        className
      )}
      title={isWrapped ? "Disable line wrap" : "Wrap long lines"}
      aria-label={isWrapped ? "Disable line wrap" : "Wrap long lines"}
    >
      <WrapIcon />
    </button>
  );
}

// Button container component
function CodeActionButtons({ code, hasOverflow, isWrapped, onWrapToggle }) {
  return (
    <div className={styles.codeActionButtonsContainer}>
      {hasOverflow && (
        <WrapButton
          isWrapped={isWrapped}
          onToggle={onWrapToggle}
        />
      )}
      <CopyButton code={code} />
    </div>
  );
}

function useCodeBlockMetadata(props) {
  const {prism} = useThemeConfig()
  return createCodeBlockMetadata({
    code: props.children,
    className: props.className,
    metastring: props.metastring,
    magicComments: prism.magicComments,
    defaultLanguage: prism.defaultLanguage,
    language: props.language,
    title: props.title,
    showLineNumbers: props.showLineNumbers,
  })
}


export default function CodeBlockString(props) {
  const metadata = useCodeBlockMetadata(props)
  const [highlightedCode, setHighlightedCode] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isWrapped, setIsWrapped] = useState(false);
  const codeBlockRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Detect horizontal overflow
  useEffect(() => {
    const detectOverflow = () => {
      if (codeBlockRef.current) {
        const element = codeBlockRef.current;

        // Try multiple methods to detect overflow
        const { scrollWidth, clientWidth, offsetWidth } = element;

        // Method 1: Basic scroll width check
        const method1 = scrollWidth > clientWidth + 2;

        // Method 2: Check if content is being clipped
        const method2 = scrollWidth > offsetWidth + 2;

        // Method 3: Check actual text content length vs visible width
        const textContent = element.textContent || metadata.code;
        const avgCharWidth = 8; // Approximate character width in pixels
        const approximateTextWidth = textContent.split('\n')[0].length * avgCharWidth;
        const method3 = approximateTextWidth > clientWidth;

        const hasHorizontalOverflow = method1 || method2 || method3;


        setHasOverflow(hasHorizontalOverflow);
      }
    };

    // Multiple detection methods for reliability
    const timeoutId1 = setTimeout(detectOverflow, 50);
    const timeoutId2 = setTimeout(detectOverflow, 200);
    const timeoutId3 = setTimeout(detectOverflow, 500);
    const timeoutId4 = setTimeout(detectOverflow, 1000); // Fallback

    const resizeObserver = new ResizeObserver(detectOverflow);

    if (codeBlockRef.current) {
      resizeObserver.observe(codeBlockRef.current);
    }

    window.addEventListener('resize', detectOverflow);

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      clearTimeout(timeoutId4);
      window.removeEventListener('resize', detectOverflow);
      resizeObserver.disconnect();
    };
  }, [highlightedCode, metadata.code]);

  const handleWrapToggle = () => {
    setIsWrapped(!isWrapped);
  };

  const getCodeStyle = () => {
    if (isWrapped) {
      return {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflowX: 'visible',
        wordWrap: 'break-word',
      };
    }
    return {
      whiteSpace: 'pre',
      overflowX: 'auto',
      wordBreak: 'normal',
    };
  };

  useEffect(() => {
    if (!isClient) return;

    const highlightCode = async () => {
      try {
        // Check if the language is supported
        const supportedLanguage = Object.keys(bundledLanguages).includes(metadata.language)
          ? metadata.language
          : 'text';

        const html = await codeToHtml(metadata.code, {
          lang: supportedLanguage,
          theme: 'github-dark',
          transformers: metadata.showLineNumbers ? [
            {
              name: 'line-numbers',
              line(node, line) {
                node.properties['data-line'] = line;
                node.children.unshift({
                  type: 'element',
                  tagName: 'span',
                  properties: {
                    class: 'line-number',
                    style: 'color: rgb(156, 163, 175); margin-right: 1rem; user-select: none;'
                  },
                  children: [{ type: 'text', value: String(line).padStart(2, ' ') }]
                });
              }
            }
          ] : []
        });

        setHighlightedCode(html);
      } catch (error) {
        console.error('Error highlighting code:', error);
        // Fallback to plain text
        setHighlightedCode(`<pre><code>${metadata.code}</code></pre>`);
      }
    };

    highlightCode();
  }, [metadata.code, metadata.language, metadata.showLineNumbers, isClient]);

  const codeStyle = getCodeStyle();

  // Server-side rendering fallback or while loading
  if (!isClient || !highlightedCode) {
    return (
      <CodeBlockContextProvider metadata={metadata} wordWrap={codeStyle}>
        <div className={styles.codeBlockContainer}>
          <pre
            ref={codeBlockRef}
            tabIndex={0}
            className={clsx(
              styles.codeBlock,
              metadata.language && `language-${metadata.language}`,
              'thin-scrollbar',
              isWrapped && styles.codeBlockWrapped
            )}
            style={codeStyle}
          >
            <code className={styles.codeBlockLines}>
              {metadata.code}
            </code>
          </pre>
          <CodeActionButtons
            code={metadata.code}
            hasOverflow={hasOverflow}
            isWrapped={isWrapped}
            onWrapToggle={handleWrapToggle}
          />
        </div>
      </CodeBlockContextProvider>
    );
  }

  return (
    <CodeBlockContextProvider metadata={metadata} wordWrap={codeStyle}>
      <div className={styles.codeBlockContainer}>
        <div
          ref={codeBlockRef}
          tabIndex={0}
          className={clsx(
            styles.codeBlock,
            metadata.language && `language-${metadata.language}`,
            'thin-scrollbar',
            isWrapped && styles.codeBlockWrapped
          )}
          style={codeStyle}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
        <CodeActionButtons
          code={metadata.code}
          hasOverflow={hasOverflow}
          isWrapped={isWrapped}
          onWrapToggle={handleWrapToggle}
        />
      </div>
    </CodeBlockContextProvider>
  );
}
