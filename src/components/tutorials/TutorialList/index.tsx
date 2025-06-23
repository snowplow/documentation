import React, { FC, useMemo, useState } from 'react'

import Link from '@docusaurus/Link'
import Head from '@docusaurus/Head'
import { useHistory } from '@docusaurus/router'
import { ChevronRight } from '@mui/icons-material'
import {
  Box,
  Grid,
  InputAdornment,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { getMetaData, getSteps } from '../utils'
import {
  SearchBarFormControl,
  SearchBarInput,
  SnowplowPurpleSearchIcon,
  TopicFilterFormControl,
  TopicFilterSelect,
  TutorialCardTitle,
  Grid as TutorialGrid,
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

function topicFilter(topic: TopicDropdown, tutorial?: Tutorial): boolean {
  if (!tutorial) return false
  if (topic === 'All topics') return true
  return tutorial ? tutorial?.meta.label === topic : false
}

type TopicDropdown = keyof typeof TopicType.Values | 'All topics'
const TopicDropdownValues: TopicDropdown[] = [
  'All topics',
  ...Object.values(TopicType.Values),
]

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
  const [topic, setTopic] = useState<TopicDropdown>('All topics')
  const parsedTutorials = useMemo<Tutorial[]>(
    () => getParsedTutorials(getMetaData()),
    []
  )
  const tutorials = useMemo<Tutorial[]>(
    () => filterTutorials(search, topic, parsedTutorials),
    [search, topic, parsedTutorials]
  )

  return (
    <>
      <Head>
        <title>Tutorials | Snowplow Documentation</title>
      </Head>{' '}
      {isMobile ? (
        <MobileTutorialList
          setSearch={setSearch}
          topic={topic}
          setTopic={setTopic}
          tutorials={tutorials}
        />
      ) : (
        <DesktopTutorialList
          setSearch={setSearch}
          topic={topic}
          setTopic={setTopic}
          tutorials={tutorials}
        />
      )}
    </>
  )
}

function filterTutorials(
  search: string,
  topic: TopicDropdown,
  tutorials: Tutorial[]
): Tutorial[] {
  return tutorials
    .filter((tutorial) => searchFilter(search, tutorial))
    .filter((tutorial) => topicFilter(topic, tutorial))
}

const IntroductionText: FC = () => {
  return (
    <div>
      <p>
        Choose from our different tutorial categories depending on what you want
        to learn.
      </p>
      <ul>
        <li>Data governance: tracking design</li>
        <li>
          Tracking implementation: adding Snowplow tracking to your applications
        </li>
        <li>Data modeling: using our dbt models</li>
        <li>
          Solution accelerator: advanced use cases, using Snowplow alongside
          other tools
        </li>
      </ul>
      <br />
    </div>
  )
}

const MobileTutorialList: FC<{
  setSearch: React.Dispatch<React.SetStateAction<string>>
  topic: TopicDropdown
  setTopic: React.Dispatch<React.SetStateAction<TopicDropdown>>
  tutorials: Tutorial[]
}> = ({ setSearch, topic, setTopic, tutorials }) => {
  return (
    <Box sx={{ mt: 1 }}>
      <Grid container direction="column" rowSpacing={2}>
        <SearchBar setSearch={setSearch} />
        <TopicFilter topic={topic} setTopic={setTopic} />

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
  topic: TopicDropdown
  setTopic: React.Dispatch<React.SetStateAction<TopicDropdown>>
  tutorials: Tutorial[]
}> = ({ setSearch, topic, setTopic, tutorials }) => {
  return (
    <Box marginX={8} marginY={3} sx={{ minWidth: '90vw', mr: 0 }}>
      <Grid container columnSpacing={2}>
        <SearchBar setSearch={setSearch} />
        <TopicFilter topic={topic} setTopic={setTopic} />
      </Grid>

      <IntroductionText />

      <TutorialGrid mb={2}>
        {tutorials.map((tutorial: Tutorial) => (
          <Grid item key={tutorial.meta.id}>
            <TutorialCard tutorial={tutorial} />
          </Grid>
        ))}
      </TutorialGrid>
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
  topic: TopicDropdown
  setTopic: React.Dispatch<React.SetStateAction<TopicDropdown>>
}> = ({ topic, setTopic }) => {
  return (
    <Grid item>
      <TopicFilterFormControl variant="outlined">
        <TopicFilterSelect
          value={topic}
          onChange={(e) => setTopic(e.target.value as TopicDropdown)}
        >
          {TopicDropdownValues.map((topic) => (
            <MenuItem key={topic} value={topic}>
              {topic}
            </MenuItem>
          ))}
        </TopicFilterSelect>
      </TopicFilterFormControl>
    </Grid>
  )
}

export default TutorialList
