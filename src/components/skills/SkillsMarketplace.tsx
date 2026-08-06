import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import {skills, categories, type SkillCategory} from '../../data/skillsMarketplaceData';
import styles from './styles.module.css';

const REPO_URL = 'https://github.com/snowplow/skills';

type FilterValue = 'all' | SkillCategory;

export default function SkillsMarketplace(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<FilterValue>('all');

  const visibleCategories =
    activeCategory === 'all' ? categories : categories.filter((c) => c === activeCategory);

  return (
    <>
      <p>
        These skills connect your AI assistant, whether that's Claude,
        Cursor, Codex, or another MCP-compatible tool, to your Snowplow
        workspace, so it can see your pipelines, schemas, and Console data
        instead of just describing them.
      </p>
      <p>
        Every skill on this page needs a one-time connection to the{' '}
        <a href="/docs/ai/snowplow-mcp-server/" target="_blank" rel="noopener noreferrer">Snowplow MCP server</a>,
        which links your AI assistant to your Snowplow Console account.
        The first time you use a skill, you'll be prompted to log in and
        authorize access. After that, it's ready to go.
      </p>

      <div className={styles.installStrip}>
        <div className={styles.installCodeContainer}>
          <CodeBlock language="txt">
            {`/plugin marketplace add snowplow/skills
/plugin install snowplow@snowplow`}
          </CodeBlock>
        </div>
        <Link
          className={`button button--primary ${styles.githubButton}`}
          style={{color: 'white', WebkitTextFillColor: 'white', textDecoration: 'none'}}
          to={REPO_URL}>
          View on GitHub
        </Link>
      </div>

      <div className={styles.categoryTabs}>
          <button
            type="button"
            className={
              activeCategory === 'all'
                ? styles.categoryTabButtonActive
                : styles.categoryTabButton
            }
            onClick={() => setActiveCategory('all')}>
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? styles.categoryTabButtonActive
                  : styles.categoryTabButton
              }
              onClick={() => setActiveCategory(category)}>
              {category}
            </button>
          ))}
        </div>

        {visibleCategories.map((category) => (
          <section key={category} className={styles.categoryGroup}>
            <h2>{category}</h2>
            {skills
              .filter((skill) => skill.category === category)
              .map((skill) => (
                <div key={skill.id} className={styles.skillRow}>
                  <div className={styles.skillRowText}>
                    <h3>{skill.name}</h3>
                    <span className={styles.skillBadge}>Requires MCP connection</span>
                    <p>{skill.summary}</p>
                  </div>
                  <Link className={styles.skillRowLink} to={skill.githubUrl}>
                    View on GitHub
                  </Link>
                </div>
              ))}
          </section>
        ))}
    </>
  );
}
