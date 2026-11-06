import MDXComponents from '@theme-original/MDXComponents'
import ThemedImage from '@theme/ThemedImage'
import ReactMarkdown from 'react-markdown'

import Button from '@site/src/components/Button'
import { Card, CardGrid } from '@site/src/components/Card'
import {
  Badge,
  BadgeGroup,
  TierBadge,
  LifecycleBadge,
  VersionBadge,
  LicenseBadge,
  Availability,
} from '@site/src/components/Badge'
import CodeGroup from '@site/src/components/CodeGroup'
import Steps from '@site/src/components/Steps'
import ParamTable, { Param } from '@site/src/components/ParamTable'
import FeatureMatrix from '@site/src/components/FeatureMatrix'
import AppliesTo from '@site/src/components/AppliesTo'
import NotebookLinks from '@site/src/components/NotebookLinks'

/**
 * Components available in every MDX file without an import. The component
 * set is documented at /style-guide/components/.
 */
export default {
  ...MDXComponents,
  ThemedImage,
  ReactMarkdown,
  NotebookLinks,

  // Component set (src/components)
  Button,
  Card,
  CardGrid,
  Badge,
  BadgeGroup,
  TierBadge,
  LifecycleBadge,
  VersionBadge,
  LicenseBadge,
  Availability,
  CodeGroup,
  Steps,
  ParamTable,
  Param,
  FeatureMatrix,
  AppliesTo,
}
