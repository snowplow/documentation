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
import { Grid, useMediaQuery, useTheme } from '@mui/material';
import type {Props} from '@theme/DocRoot/Layout/Main';
import Steps from '@site/src/components/tutorials/Steps';
import { getSteps } from '@site/src/components/tutorials/utils';
import { Meta, Step } from '@site/src/components/tutorials/models';
import { useTutorial, TutorialKind } from '@site/src/components/tutorials/hooks';
import TutorialProgressTracker from '@site/src/components/tutorials/TutorialProgressTracker';
import { Paginators } from '@site/src/theme/DocPage/Layout/Main/Paginators';

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

const TutorialLayout: React.FC<{children: ReactNode}> = ({ children }) => {
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const meta = useMemo<Meta>(() => getMeta(location), [location])
  const steps = useMemo<Step[]>(() => getSteps(meta.id), [meta.id])

  const [activeStep, setActiveStep] = useState<Step | null>(null)
  const [next, setNext] = useState<Step | null>(null)
  const [prev, setPrev] = useState<Step | null>(null)

  useEffect(() => {
    const step = findStepFromLocation(location, steps)
    if (step) {
      setActiveStep(step)
    } else {
      setActiveStep(null)
    }
  }, [location, steps])

  useEffect(() => {
    if (activeStep) {
      setNext(getNext(steps, activeStep))
      setPrev(getPrev(steps, activeStep))
    }
  }, [activeStep, steps])

  if (isMobile) {
    return (
      <main className="tutorial-doc-page flex w-full">
        <Grid
          sx={{ m: 0, mt: 0 }}
          rowSpacing={2}
          container
          direction="column"
          wrap="nowrap"
          className='p-4'
        >
          <Grid item>
            <TutorialProgressTracker
              className="w-full max-w-none"
              meta={meta}
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          </Grid>

          <Grid item>
            <div className={clsx("tutorial-content", styles.docItemWrapper)}>
              {children}
            </div>
            <div style={{ marginTop: '2rem', marginBottom: '2rem', maxWidth: '100%' }}>
              <Paginators
                next={next}
                prev={prev}
                setActiveStep={setActiveStep}
                isMobile
                currentStep={activeStep}
                tutorialId={meta?.id}
              />
            </div>
          </Grid>
        </Grid>
      </main>
    )
  }

  return (
    <main className="tutorial-doc-page flex w-full">
      <Grid container sx={{width: '100%' }} columnSpacing={2} className='px-4 py-8'>
        <Grid container item direction="column">
          <Grid container item wrap="nowrap" columnGap={3}>
            {/* Progress Tracker Sidebar - Responsive sizing */}
            <Grid item xs={12} sm={4} md={3} lg={3} sx={{
              minWidth: { xs: '200px', sm: '220px', md: '240px', lg: '280px' },
              maxWidth: { xs: '200px', sm: '220px', md: '240px', lg: '280px' }
            }}>
              <TutorialProgressTracker
                className="sticky top-4"
                meta={meta}
                steps={steps}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
              />
            </Grid>

            {/* Main Content - Responsive sizing */}
            <Grid container item xs={12} sm={8} md={9} lg={9}>
              <Grid sx={{ width: '100%' }} item>
                <div className={clsx("tutorial-content", styles.docItemWrapper)}>
                  {children}
                </div>
                <div style={{ marginTop: '2rem', marginBottom: '2rem', maxWidth: '75%' }}>
                  <Paginators
                    next={next}
                    prev={prev}
                    setActiveStep={setActiveStep}
                    currentStep={activeStep}
                    tutorialId={meta?.id}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced,
      )}>
      <div
        className={clsx(
          styles.docItemWrapper,
          hiddenSidebarContainer && styles.docItemWrapperEnhanced,
        )}>
        {children}
      </div>
    </main>
  );
}