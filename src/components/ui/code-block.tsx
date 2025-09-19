"use client";

import React, { useState, useEffect } from "react";
import { bundledLanguages, codeToHtml } from "shiki";
import { cn } from "../../lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  theme?: string;
  showLineNumbers?: boolean;
  className?: string;
}

interface CodeBlockCodeProps extends CodeBlockProps {}

interface CodeBlockGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-background",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CodeBlockCode({
  code,
  language = "text",
  theme = "github-dark",
  showLineNumbers = false,
  className,
}: CodeBlockCodeProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const codeRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const highlightCode = async () => {
      try {
        // Check if the language is supported
        const supportedLanguage = Object.keys(bundledLanguages).includes(language)
          ? language
          : "text";

        const html = await codeToHtml(code, {
          lang: supportedLanguage,
          theme: theme,
          transformers: showLineNumbers ? [
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
        console.error("Error highlighting code:", error);
        // Fallback to plain text
        setHighlightedCode(`<pre><code>${code}</code></pre>`);
      }
    };

    highlightCode();
  }, [code, language, theme, showLineNumbers, isClient]);

  // Server-side rendering fallback
  if (!isClient || !highlightedCode) {
    return (
      <pre className={cn("p-4 overflow-auto text-sm", className)}>
        <code ref={codeRef}>{code}</code>
      </pre>
    );
  }

  return (
    <code
      ref={codeRef}
      className={cn("block overflow-auto text-sm", className)}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
}

export function CodeBlockGroup({
  children,
  className,
  ...props
}: CodeBlockGroupProps) {
  return (
    <div
      className={cn("space-y-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}