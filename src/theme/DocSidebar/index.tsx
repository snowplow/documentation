import React, {type ReactNode} from 'react';
import DocSidebar from '@theme-original/DocSidebar';
import type DocSidebarType from '@theme/DocSidebar';
import type {WrapperProps} from '@docusaurus/types';
import {useLocation} from '@docusaurus/router';

type Props = WrapperProps<typeof DocSidebarType>;

/**
 * Filters sidebar items based on the current route.
 * - On /docs/signals/* routes: show only Signals content
 * - On other /docs/* routes: hide Signals from sidebar
 */
function filterSidebarForRoute(items: any[], pathname: string): any[] {
  const isSignalsRoute = pathname.startsWith('/docs/signals');

  if (isSignalsRoute) {
    // Find the Signals category and return its children (flattened to top level)
    const signalsCategory = items.find(item => item.label === 'Signals');
    if (signalsCategory?.items) {
      // Add Introduction link at the top, pointing to the Signals index page
      const introLink = {
        type: 'link',
        label: 'Introduction',
        href: signalsCategory.href || '/docs/signals/',
        docId: signalsCategory.docId,
      };
      return [introLink, ...signalsCategory.items];
    }
    // Fallback: return items that match signals
    return items.filter(item =>
      item.label === 'Signals' || item.href?.includes('/signals')
    );
  } else {
    // Hide Signals from main docs sidebar
    return items.filter(item =>
      item.label !== 'Signals' && !item.href?.includes('/signals')
    );
  }
}

export default function DocSidebarWrapper(props: Props): ReactNode {
  const {pathname} = useLocation();

  const filteredSidebar = props.sidebar
    ? filterSidebarForRoute(props.sidebar, pathname)
    : props.sidebar;

  return <DocSidebar {...props} sidebar={filteredSidebar} />;
}
