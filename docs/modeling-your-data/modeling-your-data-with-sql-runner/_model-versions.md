```mdx-code-block
import {versions} from '@site/src/componentVersions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
```

<ReactMarkdown children={`
Model | Redshift | BigQuery | Snowflake
:--|:-:|:-:|:-:
[Web](/docs/modeling-your-data/modeling-your-data-with-sql-runner/sql-runner-web-data-model/index.md) | ${versions.sqlRunnerWebRedshift} | ${versions.sqlRunnerWebBigQuery} | ${versions.sqlRunnerWebSnowflake}
[Mobile](/docs/modeling-your-data/modeling-your-data-with-sql-runner/sql-runner-mobile-data-model/index.md) | ${versions.sqlRunnerMobileRedshift} | ${versions.sqlRunnerMobileBigQuery} | ${versions.sqlRunnerMobileSnowflake}
`} remarkPlugins={[remarkGfm]} />
