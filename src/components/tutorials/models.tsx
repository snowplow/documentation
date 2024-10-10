import { z } from 'zod'

// The Topics allowed for the tutorials
export const Topic = z.enum([
  'Tracking design',
  'Tracking implementation',
  'Data modeling',
  'Infrastructure',
])

export type Topic = z.infer<typeof Topic>

// The metadata for a tutorial
export const Meta = z.object({
  id: z.string(),
  title: z.string(),
  label: Topic,
  description: z.string(),
})

export type Meta = z.infer<typeof Meta>

export const Step = z.object({
  position: z.number(),
  title: z.string(),
  path: z.string(),
})

export type Step = z.infer<typeof Step>

// The tutorial model
// Files is an array of strings that represent the file paths to the tutorial steps
export const Tutorial = z.object({
  meta: Meta,
  files: z.array(Step),
})

export type Tutorial = z.infer<typeof Tutorial>

// The front matter for a tutorial step (https://docusaurus.io/docs/markdown-features#front-matter)
// - Position: used to sort the steps
// - Title: title of the step shown in the sidebar/paginator
export const FrontMatter = z.object({
  position: z.number(),
  title: z.string(),
})

export type FrontMatter = z.infer<typeof FrontMatter>

export const MDXContent = z.object({
  default: z.function().returns(z.unknown()),
  frontMatter: FrontMatter,
})

export type MDXContent = z.infer<typeof MDXContent>
