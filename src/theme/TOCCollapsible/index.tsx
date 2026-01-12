import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useCollapsible, Collapsible} from '@docusaurus/theme-common';
import TOCItems from '@theme/TOCItems';
import CollapseButton from '@theme/TOCCollapsible/CollapseButton';
import type {Props} from '@theme/TOCCollapsible';

export default function TOCCollapsible({
  toc,
  className,
  minHeadingLevel,
  maxHeadingLevel,
}: Props): ReactNode {
  const {collapsed, toggleCollapsed} = useCollapsible({
    initialState: true,
  });
  return (
    <div className={clsx("toc-collapsible", !collapsed && "toc-collapsible-expanded", className)}>
      <CollapseButton collapsed={collapsed} onClick={toggleCollapsed} />
      <Collapsible
        lazy
        className="toc-collapsible-content [&>ul]:p-3 [&>ul]:text-base [&>ul]:m-0 [&_a]:no-underline"
        collapsed={collapsed}>
        <TOCItems
          toc={toc}
          minHeadingLevel={minHeadingLevel}
          maxHeadingLevel={maxHeadingLevel}
        />
      </Collapsible>
    </div>
  );
}