import React, { ReactNode, Suspense, useEffect, useMemo, useState } from 'react'

import clsx from 'clsx'
import { Location } from 'history'

import { Grid } from '@mui/material'
import { useLocation } from '@docusaurus/router'
import type { Props } from '@theme/DocPage/Layout/Main'
import Steps from '@site/src/components/tutorials/Steps'
import { Header } from '@site/src/components/tutorials/Header'
import { getSteps } from '@site/src/components/tutorials/utils'
import { useDocsSidebar } from '@docusaurus/theme-common/internal'
import { Meta, Step } from '@site/src/components/tutorials/models'
import { useIsMobile, useTutorial } from '@site/src/components/tutorials/hooks'

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

function DefaultDocPageLayout({
  hiddenSidebarContainer,
  children,
}: Props): JSX.Element {
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
          'container padding-top--md padding-bottom--lg',
          styles.docItemWrapper,
          hiddenSidebarContainer && styles.docItemWrapperEnhanced
        )}
      >
        {children}
      </div>
    </main>
  )
}

function TutorialHomeDocPageLayout({
  hiddenSidebarContainer,
  children,
}: Props): JSX.Element {
  const sidebar = useDocsSidebar()

  useEffect(() => {
    const footers = document.getElementsByTagName('footer')
    footers[0].style.display = 'none'
    footers[1].style.display = 'none'
  }, [])

  return (
    <main
      className={clsx(
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced
      )}
    >
      {children}
    </main>
  )
}

function TutorialDocPageLayout({ hiddenSidebarContainer, children }: Props) {
  const sidebar = useDocsSidebar()
  const location = useLocation()
  const isMobile = useIsMobile()

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
  }, [])

  useEffect(() => {
    if (activeStep) {
      setNext(getNext(steps, activeStep))
      setPrev(getPrev(steps, activeStep))
    }
  }, [activeStep, steps])

  return (
    <main
      className={clsx(
        'tutorial-doc-page',
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced
      )}
    >
      {isMobile ? (
        <Mobile
          children={children}
          meta={meta}
          steps={steps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          next={next}
          prev={prev}
        />
      ) : (
        <Desktop
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

export default function DocPageLayoutMain({
  hiddenSidebarContainer,
  children,
}: Props): JSX.Element {
  const tutorial = useTutorial()

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

function Mobile({
  children,
  meta,
  steps,
  activeStep,
  setActiveStep,
  next,
  prev,
}: {
  children: ReactNode
  meta: Meta | null
  steps: Step[]
  activeStep: Step
  setActiveStep: (step: Step) => void
  next: Step | null
  prev: Step | null
}): JSX.Element {
  return (
    <Grid
      sx={{ m: 2, mt: 0 }}
      rowSpacing={2}
      container
      direction="column"
      wrap="nowrap"
    >
      <Grid item>
        <Header title={meta?.title || ''} label={meta?.label || ''} />
      </Grid>
      <Grid item xs={4}>
        <Steps
          steps={steps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      </Grid>
      <Grid item>{children}</Grid>
      <Paginators
        next={next}
        prev={prev}
        setActiveStep={setActiveStep}
        isMobile={true}
      />
    </Grid>
  )
}

function Desktop({
  children,
  meta,
  steps,
  activeStep,
  setActiveStep,
  next,
  prev,
}: {
  children: ReactNode
  meta: Meta | null
  steps: Step[]
  activeStep: Step | null
  setActiveStep: (step: Step) => void
  next: Step | null
  prev: Step | null
}): JSX.Element {
  return (
    <Grid container sx={{ m: 3 }} columnSpacing={5}>
      <Grid container item direction="column">
        <Grid item>
          <Header title={meta?.title || ''} label={meta?.label || ''} />
        </Grid>
        <Grid container item wrap="nowrap" columnGap={5}>
          <Grid item xs={4}>
            <Steps
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          </Grid>
          <Grid container item>
            <Grid sx={{ width: '100%' }} item>
              {children}
            </Grid>
            <Paginators
              next={next}
              prev={prev}
              setActiveStep={setActiveStep}
              isMobile={false}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
