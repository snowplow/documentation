import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Getting Started with Snowplow',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    link: "docs/migrated",
    description: (
      <>
        Information on how to get started with the various flavours of Snowplow.
      </>
    ),
  },
  {
    title: 'Understanding your pipeline',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    link: "docs/migrated/understanding-your-pipeline/architecture-overview-aws",
    description: (
      <>
        What is the Snowplow pipeline and what to use to achieve your data needs.
      </>
    ),
  },
  {
    title: 'Modelling your data',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    link: "docs/migrated/modeling-your-data/what-is-data-modeling",
    description: (
      <>
        Guidance on how to model your data.
      </>
    ),
  },
  {
    title: 'Trackers',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    link: "docs/migrated/collecting-data/collecting-from-own-applications",
    description: (
      <>
        Information on all the trackers available.
      </>
    ),
  },
  {
    title: 'Pipeline components and applications',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    link: "docs/migrated/pipeline-components-and-applications",
    description: (
      <>
        Information on all the pipeline components and applications available.
      </>
    ),
  },
  {
    title: 'Tutorials',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    link: "docs/migrated/tutorials",
    description: (
      <>
        A number of tutorials on techniques to get your pipelines running.
      </>
    ),
  },
];

function Feature({ Svg, title, description, link }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
        <a href={link}><button>Read more</button></a>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
