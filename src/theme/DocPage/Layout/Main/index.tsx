import React, { useEffect } from 'react'

import clsx from 'clsx'
import { Location } from 'history'

import { Box, Grid } from '@mui/material'
import { useLocation } from '@docusaurus/router'
import PaginatorNavLink from '@theme/PaginatorNavLink'
import type { Props } from '@theme/DocPage/Layout/Main'
import { useDocsSidebar } from '@docusaurus/theme-common/internal'

import styles from './styles.module.css'
import { Header } from '../../../../components/tutorials/Tutorial'
import { Meta, Step } from '../../../../components/tutorials/models'
import Steps, { stepToHistory } from '../../../../components/tutorials/Steps'

function getMeta(location: Location): Meta {
  const locationSplit = location.pathname.split('/')
  const tutorialName = locationSplit[2]
  const context = require.context('@site/tutorials/', true)

  try {
    const meta = context(`./${tutorialName}/meta.json`)
    meta['id'] = tutorialName
    return Meta.parse(meta)
  } catch (e) {
    throw new Error(
      `Could not find meta.json for tutorial ${tutorialName}, location: ${location.pathname}`
    )
  }
}

function getSteps(location: Location): Step[] {
  const locationSplit = location.pathname.split('/')
  const tutorialName = locationSplit[2]
  const context = require.context('@site/tutorials/', true)

  // Filter to ones that are in the `tutorialname` dir
  const steps = context
    .keys()
    .filter((key) => key.includes(tutorialName) && key.endsWith('md'))
    .map((key) => [key, context(key)])
    .map(([path, mdFile]) => Step.parse({ ...mdFile.frontMatter, path }))

  steps.sort((a, b) => a.position - b.position)

  return steps
}

function getPrev(location: Location): Step | null {
  const steps = getSteps(location)
  const asPath = steps.map((step) => stepToHistory(step))
  const current = asPath.findIndex((path) => {
    return location.pathname == path || location.pathname == path + '/'
  })
  if (current === -1) {
    return null
  }

  if (current > 0) {
    const ret = steps[current - 1]
    ret.path = stepToHistory(ret)
    return ret
  }

  return null
}

function getNext(location: Location): Step | null {
  const steps = getSteps(location)
  const asPath = steps.map((step) => stepToHistory(step))
  const current = asPath.findIndex((path) => {
    return location.pathname == path || location.pathname == path + '/'
  })

  if (current === -1) {
    return null
  }

  if (current + 1 < steps.length) {
    const ret = steps[current + 1]
    ret.path = stepToHistory(ret)
    return ret
  }

  return null
}

function Paginators({
  next,
  prev,
}: {
  next: Step | null
  prev: Step | null
}): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      <Grid justifyContent="space-between" container columnSpacing={2}>
        <Grid item xs={6}>
          {prev ? (
            <PaginatorNavLink
              isNext={false}
              permalink={prev.path}
              title={prev.title}
              subLabel="Previous"
            />
          ) : (
            // Zero width element so space-between aligns right correctly if there is no previous
            <></>
          )}
        </Grid>

        {next && (
          <Grid item xs={6}>
            <PaginatorNavLink
              isNext={true}
              permalink={next.path}
              title={next.title}
              subLabel="Next"
            />
          </Grid>
        )}
      </Grid>
      <Box className="col col--3"></Box>
    </Box>
  )
}

export default function DocPageLayoutMain({
  hiddenSidebarContainer,
  children,
}: Props): JSX.Element {
  const sidebar = useDocsSidebar()
  const location = useLocation()
  const [isTutorial, setIsTutorial] = React.useState(() =>
    location.pathname.startsWith('/tutorials')
  )
  const [steps, setSteps] = React.useState(() =>
    isTutorial ? getSteps(location) : []
  )
  const [meta, setMeta] = React.useState<Meta | null>(null)
  const [next, setNext] = React.useState<Step | null>(null)
  const [prev, setPrev] = React.useState<Step | null>(null)

  useEffect(() => {
    setIsTutorial(location.pathname.startsWith('/tutorials'))
  }, [location])

  useEffect(() => {
    if (!isTutorial) return
    setMeta(getMeta(location))
    setSteps(getSteps(location))
    setNext(getNext(location))
    setPrev(getPrev(location))
  }, [location])

  if (isTutorial) {
    return (
      <main
        className={clsx(
          styles.docMainContainer,
          (hiddenSidebarContainer || !sidebar) &&
            styles.docMainContainerEnhanced
        )}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
                    .pagination-nav {
                        margin-top: 2rem;
                    }
                    
                    .feedbackPrompt_src-theme-DocItem-Footer-styles-module {
                      margin-top: 3rem
                    }
                `,
          }}
        />

        <Grid container sx={{ m: 3 }} columnSpacing={5}>
          <Grid container item direction="column">
            <Grid item>
              <Header title={meta?.title || ''} label={meta?.label || ''} />
            </Grid>
            <Grid container item wrap="nowrap" columnGap={5}>
              <Grid item xs={4}>
                <Steps steps={steps} />
              </Grid>
              <Grid item container>
                <Grid sx={{ width: '100%' }} item>
                  {children}
                </Grid>
                <Paginators next={next} prev={prev} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </main>
    )
  }
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
