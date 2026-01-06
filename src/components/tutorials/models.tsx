import { z } from 'zod'

// The Topics allowed for the tutorials
export const Topic = z.enum([
  'Data modeling',
  'Data governance',
  'Solution accelerator',
  'Tracking implementation',
  'Signals implementation',
])

export type Topic = z.infer<typeof Topic>

// The metadata for a tutorial
export const Meta = z.object({
  id: z.string(),
  title: z.string(),
  label: Topic,
  description: z.string(),
  useCases: z.array(z.string()),
  technologies: z.array(z.string()),
  snowplowTech: z.array(z.string()),
})

export type Meta = z.infer<typeof Meta>

export const Step = z.object({
  position: z.number(),
  title: z.string(),
  sidebar_label: z.string().optional(),
  path: z.string(),
})

export type Step = z.infer<typeof Step>

export const Tutorial = z.object({
  meta: Meta,
  steps: z.array(Step),
})

export type Tutorial = z.infer<typeof Tutorial>

// The front matter for a tutorial step (https://docusaurus.io/docs/markdown-features#front-matter)
// - Position: used to sort the steps
// - Title: title of the step shown in the sidebar/paginator
// - Sidebar Label: optional label for sidebar (falls back to title if not provided)
export const FrontMatter = z.object({
  position: z.number(),
  title: z.string(),
  sidebar_label: z.string().optional(),
})

export type FrontMatter = z.infer<typeof FrontMatter>

export const MDXContent = z.object({
  default: z.function().returns(z.unknown()),
  frontMatter: FrontMatter,
})

export type MDXContent = z.infer<typeof MDXContent>
