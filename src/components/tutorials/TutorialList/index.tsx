import React, { FC, useMemo, useState } from 'react'

import Link from '@docusaurus/Link'
import Head from '@docusaurus/Head'
import { useHistory } from '@docusaurus/router'
import { ChevronRight } from '@mui/icons-material'
import {
  Box,
  Grid,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { getMetaData, getSteps } from '../utils'
import {
  SearchBarFormControl,
  SearchBarInput,
  SnowplowPurpleSearchIcon,
  TutorialCardTitle,
  Grid as TutorialGrid,
  TopicFilterSidebar,
} from './styledComponents'
import { Meta, Topic as TopicType, Tutorial } from '../models'
import { Card, Description, StartButton, Topic } from './styledComponents'

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
            <Topic label={tutorial.meta.label} sx={{ mb: 2 }}></Topic>
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

function searchFilter(term: string, tutorial?: Tutorial): boolean {
  return tutorial
    ? tutorial?.meta.title.toLowerCase().includes(term.toLowerCase()) ||
        tutorial?.meta.description.toLowerCase().includes(term.toLowerCase())
    : false
}

function topicFilter(selectedTopics: string[], tutorial?: Tutorial): boolean {
  if (!tutorial) return false
  if (selectedTopics.length === 0) return true
  return selectedTopics.includes(tutorial.meta.label)
}

const TopicValues: string[] = Object.values(TopicType.Values)

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

const TutorialList: FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [search, setSearch] = useState('')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const parsedTutorials = useMemo<Tutorial[]>(
    () => getParsedTutorials(getMetaData()),
    []
  )
  const tutorials = useMemo<Tutorial[]>(
    () => filterTutorials(search, selectedTopics, parsedTutorials),
    [search, selectedTopics, parsedTutorials]
  )

  return (
    <>
      <Head>
        <title>Tutorials | Snowplow Documentation</title>
      </Head>{' '}
      {isMobile ? (
        <MobileTutorialList
          setSearch={setSearch}
          selectedTopics={selectedTopics}
          setSelectedTopics={setSelectedTopics}
          tutorials={tutorials}
        />
      ) : (
        <DesktopTutorialList
          setSearch={setSearch}
          selectedTopics={selectedTopics}
          setSelectedTopics={setSelectedTopics}
          tutorials={tutorials}
        />
      )}
    </>
  )
}

function filterTutorials(
  search: string,
  selectedTopics: string[],
  tutorials: Tutorial[]
): Tutorial[] {
  return tutorials
    .filter((tutorial) => searchFilter(search, tutorial))
    .filter((tutorial) => topicFilter(selectedTopics, tutorial))
}

const IntroductionText: FC = () => {
  return (
    <div>
      <p>
        Solution accelerators are advanced tutorials that guide you through use
        cases combining Snowplow with other tools.
      </p>
    </div>
  )
}

const MobileTutorialList: FC<{
  setSearch: React.Dispatch<React.SetStateAction<string>>
  selectedTopics: string[]
  setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>
  tutorials: Tutorial[]
}> = ({ setSearch, selectedTopics, setSelectedTopics, tutorials }) => {
  return (
    <Box sx={{ mt: 1 }}>
      <Grid container direction="column" rowSpacing={2}>
        <SearchBar setSearch={setSearch} />
        <TopicFilter selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics} />

        <IntroductionText />

        {tutorials.map((tutorial: Tutorial) => (
          <Grid item key={tutorial.meta.id}>
            <TutorialCard tutorial={tutorial} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

const DesktopTutorialList: FC<{
  setSearch: React.Dispatch<React.SetStateAction<string>>
  selectedTopics: string[]
  setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>
  tutorials: Tutorial[]
}> = ({ setSearch, selectedTopics, setSelectedTopics, tutorials }) => {
  return (
    <Box marginX={8} marginY={3} sx={{ minWidth: '90vw', mr: 0 }}>
      <Grid container columnSpacing={4}>
        {/* Left sidebar with filters */}
        <Grid item xs={3}>
          <TopicFilterSidebar>
            <SearchBar setSearch={setSearch} />
            <TopicFilter selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics} />
          </TopicFilterSidebar>
        </Grid>
        
        {/* Main content area */}
        <Grid item xs={9}>
          <IntroductionText />
          <TutorialGrid mb={2}>
            {tutorials.map((tutorial: Tutorial) => (
              <Grid item key={tutorial.meta.id}>
                <TutorialCard tutorial={tutorial} />
              </Grid>
            ))}
          </TutorialGrid>
        </Grid>
      </Grid>
    </Box>
  )
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
          placeholder="Search by name of the tutorial or guide..."
        />
      </SearchBarFormControl>
    </Grid>
  )
}

const TopicFilter: FC<{
  selectedTopics: string[]
  setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>
}> = ({ selectedTopics, setSelectedTopics }) => {
  const handleTopicChange = (topic: string, checked: boolean) => {
    if (checked) {
      setSelectedTopics((prev) => [...prev, topic])
    } else {
      setSelectedTopics((prev) => prev.filter((t) => t !== topic))
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontSize: '16px', fontWeight: 600 }}>
        Filter by Topic
      </Typography>
      {TopicValues.map((topic) => (
        <FormControlLabel
          key={topic}
          control={
            <Checkbox
              checked={selectedTopics.includes(topic)}
              onChange={(e) => handleTopicChange(topic, e.target.checked)}
              sx={{ '&.Mui-checked': { color: 'rgba(102, 56, 184, 1)' } }}
            />
          }
          label={topic}
          sx={{ display: 'block', mb: 1 }}
        />
      ))}
    </Box>
  )
}

export default TutorialList
