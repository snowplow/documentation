---
title: "Browser Tracker"
date: "2021-03-24"
sidebar_position: 100
---

```mdx-code-block
import Badges from '@site/src/components/Badges';

<Badges badgeType="Actively Maintained"></Badges>
```

The Browser Tracker is available via `npm` and can be directly bundled into your application. It supports core tracking methods out of the box and can be extended through plugins.

```mdx-code-block
import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

<DocCardList items={useCurrentSidebarCategory().items}/>
```
