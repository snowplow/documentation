import React, { FC, useMemo, useState } from 'react'

import Link from '@docusaurus/Link'
import Head from '@docusaurus/Head'
import { useHistory } from '@docusaurus/router'
import { ChevronRight } from '@mui/icons-material'
import {
  Box,
  Grid,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { getSteps } from '../utils'
import {
  SearchBarFormControl,
  SearchBarInput,
  SnowplowPurpleSearchIcon,
  TutorialCardTitle,
  Grid as TutorialGrid,
  TopicFilterSidebar,
} from './styledComponents'
import { Meta, Tutorial } from '../models'
import { Card, Description, StartButton, Topic } from './styledComponents'
import {
  useTutorialFilters,
  UseCaseFilter,
  TopicFilter,
  TechnologyFilter,
  SnowplowTechFilter,
} from './filters'

function getParsedTutorials(tutorials: Meta[]): Tutorial[] {
  return Object.values(tutorials).map((metaJson) => {
    const meta = Meta.parse(metaJson)
    const steps = getSteps(meta.id)
    const tutorial = { meta, steps }
    const parsedTutorials = Tutorial.parse(tutorial)

    // Ensure no duplicate positions
    const duplicates = new Set<number>()
    for (const step of parsedTutorials.steps) {
      if (duplicates.has(step.position)) {
        throw new Error(
          `Duplicate step position ${step.position} in tutorial "${parsedTutorials.meta.id}"` +
            `\nCheck steps: \n${parsedTutorials.steps
              .filter((s) => s.position === step.position)
              .map((s) => s.path)
              .join('\n')}\n`
        )
      }
      duplicates.add(step.position)
    }

    return parsedTutorials
  })
}

const SearchBar: FC<{
  setSearch: React.Dispatch<React.SetStateAction<string>>
}> = ({ setSearch }) => {
  return (
    <Grid item>
      <SearchBarFormControl variant="outlined">
        <SearchBarInput
          startAdornment={
            <InputAdornment position="start">
              <SnowplowPurpleSearchIcon />
            </InputAdornment>
          }
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by tutorial name"
        />
      </SearchBarFormControl>
    </Grid>
  )
}

function getFirstStepPath(meta: Meta): string | null {
  const steps = getSteps(meta.id)
  if (steps.length === 0) {
    return null
  }
  return steps[0].path
}

const TutorialCard: FC<{ tutorial: Tutorial }> = ({ tutorial }) => {
  const history = useHistory()
  const firstStep = getFirstStepPath(tutorial.meta)

  return (
    <Card sx={{ height: '100%' }}>
      <Grid
        container
        direction="column"
        sx={{ height: '100%' }}
        justifyContent="space-between"
      >
        <Grid item container direction="column">
          <Grid item>
            {firstStep ? (
              <Link
                style={{ color: 'inherit', cursor: 'pointer' }}
                to={firstStep}
              >
                <TutorialCardTitle>{tutorial.meta.title}</TutorialCardTitle>
              </Link>
            ) : (
              <TutorialCardTitle sx={{ color: 'red' }}>
                {tutorial.meta.title} (No steps found)
              </TutorialCardTitle>
            )}
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {tutorial.meta.useCases.length > 0 && (
                <Topic label={tutorial.meta.useCases[0]}></Topic>
              )}
              <Topic label={tutorial.meta.label}></Topic>
            </Box>
          </Grid>
          <Grid item>
            <Description>{tutorial.meta.description}</Description>
          </Grid>
        </Grid>
        <Grid item>
          <StartButton
            disabled={!firstStep}
            onClick={() => {
              const [first] = getSteps(tutorial.meta.id)
              history.push(first.path)
            }}
            endIcon={<ChevronRight />}
          >
            Start Learning
          </StartButton>
        </Grid>
      </Grid>
    </Card>
  )
}

// Shared filter and tutorial content hook
const useTutorialContent = () => {
  const {
    setSearch,
    selectedTopics,
    setSelectedTopics,
    selectedUseCases,
    setSelectedUseCases,
    allAvailableUseCases,
    selectedTechnologies,
    setSelectedTechnologies,
    allAvailableTechnologies,
    selectedSnowplowTech,
    setSelectedSnowplowTech,
    allAvailableSnowplowTech,
    filteredAvailableOptions,
    filteredTutorials,
  } = useTutorialFilters(getParsedTutorials)

  return {
    filters: (
      <>
        <SearchBar setSearch={setSearch} />
        <UseCaseFilter
          selectedUseCases={selectedUseCases}
          setSelectedUseCases={setSelectedUseCases}
          allAvailableUseCases={allAvailableUseCases}
          availableUseCases={filteredAvailableOptions.availableUseCases}
        />
        <TopicFilter
          selectedTopics={selectedTopics}
          setSelectedTopics={setSelectedTopics}
          availableTopics={filteredAvailableOptions.availableTopics}
        />
        <TechnologyFilter
          selectedTechnologies={selectedTechnologies}
          setSelectedTechnologies={setSelectedTechnologies}
          allAvailableTechnologies={allAvailableTechnologies}
          availableTechnologies={filteredAvailableOptions.availableTechnologies}
        />
        <SnowplowTechFilter
          selectedSnowplowTech={selectedSnowplowTech}
          setSelectedSnowplowTech={setSelectedSnowplowTech}
          allAvailableSnowplowTech={allAvailableSnowplowTech}
          availableSnowplowTech={filteredAvailableOptions.availableSnowplowTech}
        />
      </>
    ),
    tutorials: filteredTutorials.map((tutorial: Tutorial) => (
      <Grid item key={tutorial.meta.id}>
        <TutorialCard tutorial={tutorial} />
      </Grid>
    )),
  }
}

const TutorialList: FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const content = useTutorialContent()

  return (
    <>
      <Head>
        <title>Tutorials | Snowplow Documentation</title>
      </Head>
      {isMobile ? (
        <MobileTutorialLayout
          filters={content.filters}
          tutorials={content.tutorials}
        />
      ) : (
        <DesktopTutorialLayout
          filters={content.filters}
          tutorials={content.tutorials}
        />
      )}
    </>
  )
}

const MobileTutorialLayout: FC<{
  filters: React.ReactNode
  tutorials: React.ReactNode[]
}> = ({ filters, tutorials }) => {
  return (
    <Box sx={{ mt: 1 }}>
      <Grid container direction="column" rowSpacing={2}>
        {filters}
        {tutorials}
      </Grid>
    </Box>
  )
}

const DesktopTutorialLayout: FC<{
  filters: React.ReactNode
  tutorials: React.ReactNode[]
}> = ({ filters, tutorials }) => {
  return (
    <Box marginX={8} marginY={3} sx={{ minWidth: '90vw', mr: 0 }}>
      <Grid container columnSpacing={4}>
        {/* Left sidebar with filters */}
        <Grid item xs={3}>
          <TopicFilterSidebar>{filters}</TopicFilterSidebar>
        </Grid>

        {/* Main content area */}
        <Grid item xs={9}>
          <TutorialGrid mb={2}>{tutorials}</TutorialGrid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TutorialList
