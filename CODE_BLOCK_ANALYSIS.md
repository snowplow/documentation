# Docusaurus Code Block Implementation Analysis

## Overview
This document provides a comprehensive analysis of the Snowplow documentation code block implementation, including custom styling approaches, theme configuration, and architectural structure.

---

## 1. Custom CodeBlock Components

### Location
- **Main location**: `/src/theme/` directory
- **Not a custom component**: The project does NOT override the Docusaurus CodeBlock component directly

### Current Approach
The project uses:
1. **Docusaurus Classic Theme** - Default code block component from `@docusaurus/theme-classic`
2. **GitHub CodeBlock Plugin** - `docusaurus-theme-github-codeblock` for reference code blocks
3. **CSS Styling Only** - Customizations applied through CSS in `/src/css/custom.css`

---

## 2. Styling Architecture

### Current Styling Approach

#### CSS Custom Properties (in `src/css/custom.css`)
```css
/* Code block scrollbar styling */
.prose pre.prism-code {
  scrollbar-color: rgba(125, 118, 188, 0.5) transparent;
  margin-bottom: 0;
}

.prose pre.prism-code:hover {
  scrollbar-color: rgba(125, 118, 188, 1) transparent;
}

.prose pre.prism-code::-webkit-scrollbar-thumb:hover {
  background: rgba(125, 118, 188, 1);
}
```

#### Code Block Content Padding
```css
div[class^='codeBlockContent'] {
  padding-top: 2rem !important;
}
```

#### Prism Theme Variables (set by Container)
The `CodeBlockContainer` component applies CSS variables from `prismTheme`:
```
--prism-background-color
--prism-color
--prism-* (syntax highlighting colors)
```

---

## 3. shadesOfPurple Theme Configuration

### Location
**File**: `/Users/edwardcatterall/code/snowplow/documentation/docusaurus.config.js`

### Current Configuration
```javascript
prism: {
  theme: require('prism-react-renderer').themes.shadesOfPurple,
  additionalLanguages: [
    'arduino', 'csharp', 'dart', 'docker', 'gradle', 'hcl',
    'java', 'lua', 'php', 'properties', 'r', 'ruby', 'scala',
    'swift', 'brightscript', 'rust', 'toml', 'django', 'yaml',
    'kotlin', 'bash', 'diff', 'json',
  ],
}
```

### How It Works
- Uses `prism-react-renderer` package (v2.1.0)
- `shadesOfPurple` is a built-in theme from the prism-react-renderer library
- Applied via CSS variables in the CodeBlockContainer component

---

## 4. Docusaurus Theme Configuration Files

### Main Configuration
**File**: `/Users/edwardcatterall/code/snowplow/documentation/docusaurus.config.js`

#### Key Sections:
```javascript
// Theme configuration
themes: ['@docusaurus/theme-mermaid', 'docusaurus-theme-github-codeblock'],

// Preset configuration
presets: [
  ['@docusaurus/preset-classic', {
    docs: {
      showLastUpdateTime: true,
      editUrl: 'https://github.com/snowplow/documentation/tree/main/',
      remarkPlugins: [abbreviations, math],
      rehypePlugins: [require('rehype-raw').default, katex],
    },
    theme: {
      customCss: require.resolve('./src/css/custom.css'),
    },
  }]
],

// Theme config
themeConfig: {
  codeblock: {
    showGithubLink: true,
    githubLinkLabel: 'View on GitHub',
  },
  prism: {
    theme: require('prism-react-renderer').themes.shadesOfPurple,
    // ... additionalLanguages
  },
}
```

### Custom CSS File
**File**: `/Users/edwardcatterall/code/snowplow/documentation/src/css/custom.css`

**Size**: ~28 KB
**Purpose**: Global styling overrides for:
- Tailwind utilities initialization
- shadcn UI theme variables
- Infima framework overrides
- Code block scrollbar styling
- Sidebar styling
- Navigation styling
- Footer styling
- Grid layout controls

---

## 5. Code Block Component Architecture

### Component Hierarchy (Docusaurus Classic Theme)

```
CodeBlock (Main component)
├── CodeBlockString (for string content)
│   ├── useCodeBlockMetadata
│   └── CodeBlockLayout
│       ├── Container
│       │   └── Renders with Prism CSS variables
│       ├── Title (if metadata.title exists)
│       ├── Content
│       │   └── Pre (renders highlighted code)
│       │       └── Line (individual lines)
│       │           └── Token (syntax highlighted tokens)
│       └── Buttons
│           ├── CopyButton
│           └── WordWrapButton
└── ElementContent (for React element content)
```

### Key Component Files

#### 1. CodeBlockContainer
**Location**: `node_modules/@docusaurus/theme-classic/src/theme/CodeBlock/Container/index.tsx`

**Purpose**: Applies Prism theme CSS variables
**Key Code**:
```typescript
const prismTheme = usePrismTheme();
const prismCssVariables = getPrismCssVariables(prismTheme);
return (
  <As
    {...props}
    style={prismCssVariables}
    className={clsx(
      props.className,
      styles.codeBlockContainer,
      ThemeClassNames.common.codeBlock,
    )}
  />
);
```

#### 2. CodeBlockLayout
**Location**: `node_modules/@docusaurus/theme-classic/src/theme/CodeBlock/Layout/index.tsx`

**Purpose**: Orchestrates the code block layout
**Structure**:
```typescript
<Container>
  {metadata.title && <Title>{metadata.title}</Title>}
  <Content /> {/* The actual code */}
  <Buttons /> {/* Copy and word wrap buttons */}
</Container>
```

#### 3. CodeBlockButtons
**Location**: `node_modules/@docusaurus/theme-classic/src/theme/CodeBlock/Buttons/index.tsx`

**Features**:
- WordWrapButton - Only shows when horizontal scroll is needed
- CopyButton - Always visible
- Browser-only rendering (not SSR'd for performance)

---

## 6. CSS Styling Layers

### CSS Module Styles (from theme-classic)

#### Container Styles
```css
.codeBlockContainer {
  background: var(--prism-background-color);
  color: var(--prism-color);
  margin-bottom: var(--ifm-leading);
  box-shadow: var(--ifm-global-shadow-lw);
  border-radius: var(--ifm-code-border-radius);
}
```

#### Layout Styles
```css
.codeBlockTitle {
  border-bottom: 1px solid var(--ifm-color-emphasis-300);
  font-size: var(--ifm-code-font-size);
  font-weight: 500;
  padding: 0.75rem var(--ifm-pre-padding);
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.codeBlockContent {
  position: relative;
  direction: ltr;
  border-radius: inherit;
}
```

#### Content Styles
```css
.codeBlock {
  --ifm-pre-background: var(--prism-background-color);
  margin: 0;
  padding: 0;
}

.codeBlockLines {
  font: inherit;
  float: left;
  min-width: 100%;
  padding: var(--ifm-pre-padding);
}
```

#### Button Styles
```css
.buttonGroup {
  display: flex;
  column-gap: 0.2rem;
  position: absolute;
  right: calc(var(--ifm-pre-padding) / 2);
  top: calc(var(--ifm-pre-padding) / 2);
}

.buttonGroup button {
  display: flex;
  align-items: center;
  background: var(--prism-background-color);
  color: var(--prism-color);
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: var(--ifm-global-radius);
  padding: 0.4rem;
  opacity: 0;
  transition: opacity var(--ifm-transition-fast) ease-in-out;
}

.buttonGroup button:focus-visible,
.buttonGroup button:hover {
  opacity: 1 !important;
}

:global(.theme-code-block:hover) .buttonGroup button {
  opacity: 0.4;
}
```

### Custom CSS Overrides (from custom.css)

**Scrollbar Styling**:
```css
.prose pre.prism-code {
  margin-bottom: 0;
  scrollbar-color: rgba(125, 118, 188, 0.5) transparent;
}

.prose pre.prism-code:hover {
  scrollbar-color: rgba(125, 118, 188, 1) transparent;
}

.prose pre.prism-code::-webkit-scrollbar-thumb:hover {
  background: rgba(125, 118, 188, 1);
}
```

**Content Padding Override**:
```css
div[class^='codeBlockContent'] {
  padding-top: 2rem !important;
}
```

---

## 7. Theme Customization Approach

### Current Customization Points

1. **Prism Theme Selection** (docusaurus.config.js)
   - Currently: `shadesOfPurple`
   - Can be swapped to other themes from `prism-react-renderer`

2. **CSS Variables** (custom.css)
   - Scrollbar colors: `rgba(125, 118, 188, ...)`
   - Can be customized for light/dark modes

3. **CodeBlock Configuration** (docusaurus.config.js)
   ```javascript
   codeblock: {
     showGithubLink: true,
     githubLinkLabel: 'View on GitHub',
   }
   ```

### Available Themes from prism-react-renderer
- `shadesOfPurple` (current)
- `github`
- `nightOwl`
- `palenight`
- `dracula`
- `duotoneLight`
- `duotoneDark`
- `vsLight`
- `vsDark`

---

## 8. GitHub CodeBlock Plugin

### Package
**Name**: `docusaurus-theme-github-codeblock` (v2.0.2)

### Purpose
Enables referencing code examples from GitHub repositories with the `reference` attribute

### Wrapper Implementation
```typescript
const componentWrapper = (Component) => {
  const WrappedComponent = (props) => {
    if (hasReferenceMeta(props)) {
      return <ReferenceCodeBlock {...props} />;
    }
    return <CodeBlock {...props} />;
  };
  return WrappedComponent;
};
```

### Usage Example
```markdown
<CodeBlock language="hcl" reference>
{`https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/targets/kafka-minimal-example.hcl`}
</CodeBlock>
```

---

## 9. Related Dependencies

### Key Packages
- `@docusaurus/core`: ^3.9.2
- `@docusaurus/preset-classic`: ^3.9.2
- `@docusaurus/theme-mermaid`: ^3.9.2
- `prism-react-renderer`: ^2.1.0
- `docusaurus-theme-github-codeblock`: ^2.0.2
- `tailwindcss`: 3.3.0
- `@tailwindcss/typography`: ^0.5.16

### MDX and Markdown
- `@mdx-js/react`: ^3.0.0
- `react-markdown`: ^8.0.5
- `remark-gfm`: ^3.0.1
- `remark-math`: 3
- `rehype-raw`: ^7.0.0
- `rehype-katex`: 5

---

## 10. File Listing - Key Code Block Related Files

### Project Files
```
/Users/edwardcatterall/code/snowplow/documentation/
├── docusaurus.config.js                    # Main Docusaurus config with Prism theme
├── src/css/custom.css                      # Custom CSS including scrollbar styling
├── src/theme/MDXComponents.js              # MDX component overrides
├── src/theme/                              # Custom theme overrides (not CodeBlock)
├── tmp-code-block/                         # Design specification files
│   ├── spec.md                             # Specification for new code block design
│   ├── code-block-example.tsx              # Reference component implementation
│   └── code-block-example.png              # Design mockup
├── node_modules/@docusaurus/theme-classic/src/theme/CodeBlock/
│   ├── index.tsx                           # Main CodeBlock wrapper
│   ├── Container/index.tsx                 # Applies Prism CSS variables
│   ├── Layout/index.tsx                    # Code block layout structure
│   ├── Content/
│   │   ├── index.tsx                       # Content wrapper
│   │   ├── String.tsx                      # String code rendering
│   │   └── Element.tsx                     # React element rendering
│   ├── Buttons/
│   │   ├── index.tsx                       # Button group wrapper
│   │   ├── CopyButton/index.tsx            # Copy button
│   │   ├── WordWrapButton/index.tsx        # Word wrap toggle
│   │   └── styles.module.css               # Button styling
│   ├── Line/index.tsx                      # Individual code lines
│   ├── Title/index.tsx                     # Code block title
│   ├── Container/styles.module.css         # Container styles
│   ├── Layout/styles.module.css            # Layout styles
│   └── Content/styles.module.css           # Content styles
├── node_modules/docusaurus-theme-github-codeblock/
│   ├── build/theme/CodeBlock/index.js      # GitHub codeblock wrapper
│   └── build/theme/ReferenceCodeBlock/     # Reference code fetcher
└── node_modules/@docusaurus/theme-common/
    └── hooks/usePrismTheme.ts              # Hook to get current Prism theme
```

---

## 11. Temporary Code Block Work

### Location
`/Users/edwardcatterall/code/snowplow/documentation/tmp-code-block/`

### Files
1. **spec.md** - Design specification
   - Requirements for new code block design
   - Uses Tailwind for styling
   - Light theme replacement for shadesOfPurple
   - References GitHub links in headers
   - Copy and text wrap buttons in header

2. **code-block-example.tsx** - Reference implementation
   - Custom CodeBlock component using Shiki
   - CodeBlock, CodeBlockCode, CodeBlockGroup components
   - Styling with Tailwind and shadcn utilities

3. **code-block-example.png** - Design mockup
   - Visual reference for the desired code block appearance

---

## 12. Current Implementation Summary

### What's Used
- Docusaurus v3.9.2 with Classic Theme
- shadesOfPurple Prism theme
- GitHub CodeBlock plugin for reference code
- Custom CSS for scrollbar styling
- Infima framework for default styling

### What's NOT Used
- Custom CodeBlock component override
- Shiki for syntax highlighting (using Prism instead)
- Custom light theme component
- Tailwind styling for code blocks (only custom.css)

### Customization Points for Future Work
1. Create swizzled CodeBlock component in `/src/theme/CodeBlock/`
2. Update Prism theme selection for light mode
3. Implement Tailwind-based styling
4. Add language badge and title styling
5. Customize button appearance and positioning

---

## 13. How Prism Theme CSS Variables Work

The `getPrismCssVariables()` function converts a Prism theme object into CSS custom properties:

```
--prism-background-color: (background color from theme)
--prism-color: (text color from theme)
--prism-highlight-color: (highlight color)
--prism-highlight-add-bg: (addition highlight)
--prism-highlight-remove-bg: (deletion highlight)
--prism-comment-color: (comment syntax color)
--prism-keyword-color: (keyword syntax color)
--prism-string-color: (string syntax color)
... and more token colors ...
```

These variables are applied to:
- `.codeBlockContainer` background and text color
- Button styling (background/color)
- Syntax highlighting tokens
- Border and emphasis colors

---

## Summary

The Snowplow documentation uses a **layered customization approach**:

1. **Base Layer**: Docusaurus Classic Theme CodeBlock component
2. **Enhancement Layer**: GitHub CodeBlock plugin for references
3. **Styling Layer**: CSS variables from shadesOfPurple theme
4. **Override Layer**: Custom CSS in `src/css/custom.css` for scrollbars

**To modify code block appearance**, you can:
- Edit `/src/css/custom.css` for CSS-only changes
- Create `/src/theme/CodeBlock/` to swizzle and override the component
- Update `docusaurus.config.js` to change the Prism theme
- Add dark/light mode theme switching logic

