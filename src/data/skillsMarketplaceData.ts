/**
 * Data source for the Snowplow Skills Marketplace page.
 *
 * Update this file when a skill is added, renamed, or moved to a different
 * category. The page component (index.tsx) reads from this list and needs
 * no changes when the list changes.
 */

export type SkillCategory =
  | 'Build & Design'
  | 'Operate'
  | 'Troubleshoot'
  | 'Real-Time & AI';

export interface Skill {
  /** Matches the folder name in github.com/snowplow/skills */
  id: string;
  name: string;
  /** One sentence, shown on the collapsed row */
  summary: string;
  category: SkillCategory;
  /** GitHub URL for this skill's folder in the skills repo */
  githubUrl: string;
}

const REPO_BASE =
  'https://github.com/snowplow/skills/tree/main/plugins/snowplow/skills/';

export const skills: Skill[] = [
  {
    id: 'tracking-design',
    name: 'Tracking Design',
    summary:
      "Plan the events, entities, and schemas you'll track before you start building.",
    category: 'Build & Design',
    githubUrl: `${REPO_BASE}tracking-design`,
  },
  {
    id: 'implementation-guidance',
    name: 'Implementation Guidance',
    summary:
      'Add Snowplow trackers to your website, app, or backend, and confirm your events are firing correctly.',
    category: 'Build & Design',
    githubUrl: `${REPO_BASE}implementation-guidance`,
  },
  {
    id: 'signals',
    name: 'Signals',
    summary:
      'Set up real-time customer attributes and interventions to personalize experiences as behavior happens.',
    category: 'Real-Time & AI',
    githubUrl: `${REPO_BASE}signals`,
  },
  {
    id: 'pipeline-infrastructure',
    name: 'Pipeline Infrastructure',
    summary:
      'Configure collectors and enrichments, and monitor pipeline health from collection through to your warehouse.',
    category: 'Operate',
    githubUrl: `${REPO_BASE}pipeline-infrastructure`,
  },
  {
    id: 'console-operations',
    name: 'Console Operations',
    summary:
      'Manage pipelines, enrichments, and tracking plans directly in Snowplow Console.',
    category: 'Operate',
    githubUrl: `${REPO_BASE}console-operations`,
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting',
    summary:
      'Diagnose failed events and enrichment issues, and get pointed toward a fix.',
    category: 'Troubleshoot',
    githubUrl: `${REPO_BASE}troubleshooting`,
  },
];

export const categories: SkillCategory[] = [
  'Build & Design',
  'Real-Time & AI',
  'Operate',
  'Troubleshoot',
];
