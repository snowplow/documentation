Your task is to recreate the code block with a title found in ./tmp-code-block/code-block-example.png. The code for this example component is in ./tmp-code-block/code-block-example.tsx.

## Functionality

- The code block should always have a header.
- In the header, left-aligned, there is a badge with the code language. Next to that is the title of the code block, if provided. For example, our code blocks can reference files on the internet, like below, and that should have the title pre-populated.
```
<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/targets/kafka-minimal-example.hcl
`}</CodeBlock>
```
- In the header, right-aligned, are copy and text wrap buttons. The copy button should always appear; the text wrap button only appears when there is a horizontal scroll required.
- Use a light theme to replace shadesOfPurple when the docusaurus site is in light mode

## Technical details

- Use tailwind for styling
- DO NOT use this component exactly, but rather restyle the out-of-the-box docusaurus component to look like this.
