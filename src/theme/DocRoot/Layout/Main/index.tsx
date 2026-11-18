/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode, useMemo, useState, useEffect} from 'react';
import clsx from 'clsx';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import { useLocation } from '@docusaurus/router';
import type {Props} from '@theme/DocRoot/Layout/Main';
import { getSteps } from '@site/src/components/tutorials/utils';
import { Meta, Step } from '@site/src/components/tutorials/models';
import { useTutorial, TutorialKind } from '@site/src/components/tutorials/hooks';
import TutorialProgressTracker from '@site/src/components/tutorials/TutorialProgressTracker';
import { Paginators } from './Paginators';

import styles from './styles.module.css';

function getMeta(location: any): Meta {
  const [root, id] = location.pathname.split('/').filter(Boolean)
  const context = require.context('@site/tutorials/', true)

  try {
    const meta = context(`./${id}/meta.json`)
    meta['id'] = id
    return Meta.parse(meta)
  } catch (e) {
    if (root === 'tutorials' && id === undefined) {
      return {}
    }
    throw new Error(
      `Could not find meta.json for tutorial ${id}, location: ${location.pathname}`
    )
  }
}

function getPrev(steps: Step[], activeStep: Step): Step | null {
  const current = steps.indexOf(activeStep)
  if (current === 0) {
    return null
  }
  return steps[current - 1]
}

function getNext(steps: Step[], activeStep: Step): Step | null {
  const current = steps.indexOf(activeStep)
  if (current === steps.length - 1) {
    return null
  }
  return steps[current + 1]
}

function findStepFromLocation(location: any, steps: Step[]): Step | null {
  const [root, _id, step] = location.pathname.split('/').filter(Boolean)
  if (root === 'tutorials' && step) {
    return steps.find((s) => {
      const [_root, _step_id, step_step] = s.path.split('/').filter(Boolean)
      return step === step_step
    })
  }
  return null
}

/**
 * Tutorial pages: the progress tracker beside the content, stacked on narrow
 * screens. Plain CSS grid (tutorial-layout in chrome.css), no MUI.
 */
const TutorialLayout: React.FC<{children: ReactNode}> = ({ children }) => {
  const location = useLocation()

  const meta = useMemo<Meta>(() => getMeta(location), [location])
  const steps = useMemo<Step[]>(() => getSteps(meta.id), [meta.id])

  const [activeStep, setActiveStep] = useState<Step | null>(null)
  const [next, setNext] = useState<Step | null>(null)
  const [prev, setPrev] = useState<Step | null>(null)

  useEffect(() => {
    setActiveStep(findStepFromLocation(location, steps))
  }, [location, steps])

  useEffect(() => {
    if (activeStep) {
      setNext(getNext(steps, activeStep))
      setPrev(getPrev(steps, activeStep))
    }
  }, [activeStep, steps])

  return (
    <main className="tutorial-doc-page tutorial-layout">
      <div className="tutorial-layout__tracker">
        <TutorialProgressTracker
          meta={meta}
          steps={steps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      </div>
      <div className="tutorial-layout__content">
        <div className={clsx("tutorial-content", styles.docItemWrapper)}>
          {children}
        </div>
        <div className="tutorial-layout__paginator">
          <Paginators
            next={next}
            prev={prev}
            setActiveStep={setActiveStep}
            currentStep={activeStep}
            tutorialId={meta?.id}
          />
        </div>
      </div>
    </main>
  )
}

export default function DocRootLayoutMain({
  hiddenSidebarContainer,
  children,
}: Props): ReactNode {
  const sidebar = useDocsSidebar();
  const location = useLocation();
  const tutorial = useTutorial();

  // Check if we're on a tutorial page
  if (tutorial === TutorialKind.Tutorial) {
    return <TutorialLayout>{children}</TutorialLayout>
  }

  // Default layout for non-tutorial pages
  return (
    <main
      className={clsx(
        'doc-main',
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced,
      )}>
      <div
        className={clsx(
          'doc-main__inner',
          styles.docItemWrapper,
          hiddenSidebarContainer && styles.docItemWrapperEnhanced,
        )}>
        {children}
      </div>
    </main>
  );
}