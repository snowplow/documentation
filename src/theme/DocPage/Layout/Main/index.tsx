import React, { FC, ReactNode, useEffect, useMemo, useState } from 'react'

import clsx from 'clsx'
import { Location } from 'history'

import { useLocation } from '@docusaurus/router'
import { Grid, useMediaQuery, useTheme } from '@mui/material'
import type { Props } from '@theme/DocPage/Layout/Main'
import Steps from '@site/src/components/tutorials/Steps'
import { Header } from '@site/src/components/tutorials/Header'
import { getSteps } from '@site/src/components/tutorials/utils'
import { useDocsSidebar } from '@docusaurus/theme-common/internal'
import { Meta, Step } from '@site/src/components/tutorials/models'
import { useTutorial } from '@site/src/components/tutorials/hooks'
import TutorialProgressTracker from '@site/src/components/tutorials/TutorialProgressTracker'
import TutorialProgressTrackerMobile from '@site/src/components/tutorials/TutorialProgressTrackerMobile'

import styles from './styles.module.css'
import { Paginators } from './Paginators'
import { TutorialKind } from '../../../../components/tutorials/hooks'

function getMeta(location: Location): Meta {
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

function getPrev(steps: Steps, activeStep: Step): Step | null {
  const current = steps.indexOf(activeStep)
  if (current === 0) {
    return null
  }

  return steps[current - 1]
}

function getNext(steps: Steps, activeStep: Step): Step | null {
  const current = steps.indexOf(activeStep)
  if (current === steps.length - 1) {
    return null
  }
  return steps[current + 1]
}

function findStepFromLocation(location: Location, steps: Steps): Step | null {
  const [root, _id, step] = location.pathname.split('/').filter(Boolean)
  if (root === 'tutorials' && step) {
    return steps.find((s) => {
      const [_root, _step_id, step_step] = s.path.split('/').filter(Boolean)
      return step === step_step
    })
  }
  return null
}

const DefaultDocPageLayout: FC<Props> = ({
  hiddenSidebarContainer,
  children,
}) => {
  const sidebar = useDocsSidebar()


  return (
    <main
      className={clsx(
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced
      )}
    >
      <div
        className={clsx(
          'doc_wrapper', 'py-4',
          styles.docItemWrapper,
          hiddenSidebarContainer && styles.docItemWrapperEnhanced
        )}
        style={{
          maxWidth: 'none',
          paddingLeft: 0,
          paddingRight: 0,
          marginLeft: 0,
          marginRight: 0
        }}
      >
        {children}
      </div>
    </main>
  )
}

const TutorialHomeDocPageLayout: FC<Props> = ({
  hiddenSidebarContainer,
  children,
}) => {
  const sidebar = useDocsSidebar()

  return (
    <main
      className={clsx(
        'tutorial-home-page',
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced
      )}
    >
      {children}
    </main>
  )
}

const TutorialDocPageLayout: FC<Props> = ({
  hiddenSidebarContainer,
  children,
}) => {
  const sidebar = useDocsSidebar()
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
    }
  }, [location, steps])

  useEffect(() => {
    if (activeStep) {
      setNext(getNext(steps, activeStep))
      setPrev(getPrev(steps, activeStep))
    }
  }, [activeStep, steps])

  return (
    <main
      className={clsx(
        'tutorial-doc-page', 'flex', 'w-full',
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced
      )}
    >
      {isMobile ? (
        <TutorialDocPageLayoutMobile
          children={children}
          meta={meta}
          steps={steps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          next={next}
          prev={prev}
        />
      ) : (
        <TutorialDocPageLayoutDesktop
          children={children}
          meta={meta}
          steps={steps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          next={next}
          prev={prev}
        />
      )}
    </main>
  )
}

const DocPageLayoutMain: FC<Props> = ({ hiddenSidebarContainer, children }) => {
  const tutorial = useTutorial()
  const location = useLocation()

  // Debug logging to understand what's happening
  console.log('DocPageLayoutMain - Location:', location.pathname)
  console.log('DocPageLayoutMain - Tutorial type:', tutorial)


  switch (tutorial) {
    case TutorialKind.Tutorial:
      return (
        <TutorialDocPageLayout
          hiddenSidebarContainer={hiddenSidebarContainer}
          children={children}
        />
      )
    case TutorialKind.TutorialHome:
      return (
        <TutorialHomeDocPageLayout
          hiddenSidebarContainer={hiddenSidebarContainer}
          children={children}
        />
      )
    case TutorialKind.Docs:
      return (
        <DefaultDocPageLayout
          hiddenSidebarContainer={hiddenSidebarContainer}
          children={children}
        />
      )
    default:
      return (
        <DefaultDocPageLayout
          hiddenSidebarContainer={hiddenSidebarContainer}
          children={children}
        />
      )
  }
}

export default DocPageLayoutMain

const TutorialDocPageLayoutMobile: FC<{
  children: ReactNode
  meta: Meta | null
  steps: Step[]
  activeStep: Step | null
  setActiveStep: (step: Step) => void
  next: Step | null
  prev: Step | null
}> = ({ children, meta, steps, activeStep, setActiveStep, next, prev }) => {
  return (
    <Grid
      sx={{ m: 0, mt: 0 }}
      rowSpacing={2}
      container
      direction="column"
      wrap="nowrap"
      className='p-4'
    >
      <Grid item>
        <Header title={meta?.title || ''} label={meta?.label || ''} />
      </Grid>
      <Grid item xs={4}>
        <Steps
          steps={steps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          isMobile
        />
      </Grid>

      {/* Mobile Progress Tracker */}
      <Grid item>
        <TutorialProgressTrackerMobile className={styles.tutorialProgressTrackerMobile} />
      </Grid>

      <Grid item>
        <div className={clsx("tutorial-content", styles.tutorialContent)}>
          {children}
        </div>
        <Paginators next={next} prev={prev} setActiveStep={setActiveStep} />
      </Grid>

    </Grid>
  )
}

const TutorialDocPageLayoutDesktop: FC<{
  children: ReactNode
  meta: Meta | null
  steps: Step[]
  activeStep: Step | null
  setActiveStep: (step: Step) => void
  next: Step | null
  prev: Step | null
}> = ({ children, meta, steps, activeStep, setActiveStep, next, prev }) => {
  return (
    <Grid container sx={{width: '100%' }} columnSpacing={2} className='px-4 py-8'>
      <Grid container item direction="column">
        <Grid item>
          <Header title={meta?.title || ''} label={meta?.label || ''} />
        </Grid>
        <Grid container item wrap="nowrap" columnGap={3}>
          {/* Tutorial Steps Sidebar */}
          <Grid item xs={2} sx={{ minWidth: '240px' }}>
            <Steps
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          </Grid>

          {/* Main Content */}
          <Grid container item xs={7}>
            <Grid sx={{ width: '100%' }} item>
              <div className={clsx("tutorial-content", styles.tutorialContent)}>
                {children}
              </div>
              <Paginators className="max-w-[75%]" next={next} prev={prev} setActiveStep={setActiveStep} />
            </Grid>
          </Grid>

          {/* Progress Tracker Sidebar */}
          <Grid item xs={3} sx={{ minWidth: '280px' }}>
            <TutorialProgressTracker className={styles.tutorialProgressTracker} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
