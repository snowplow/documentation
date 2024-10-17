import React, { FC, useEffect, useState } from 'react'

import Link from '@docusaurus/Link'
import { grey } from '@mui/material/colors'
import { useHistory } from '@docusaurus/router'
import { ChevronRight, Search } from '@mui/icons-material'
import {
  Box,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { getMetaData, getSteps } from '../utils'
import { Grid as TutorialGrid } from './styledComponents'
import { Meta, Topic as TopicType, Tutorial } from '../models'
import {
  Card,
  Description,
  shadow,
  StartButton,
  Topic,
} from './styledComponents'

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
    <Card>
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
                <Typography variant="h5" sx={{ fontSize: '18px', mb: 1 }}>
                  {tutorial.meta.title}
                </Typography>
              </Link>
            ) : (
              <Typography
                variant="h5"
                sx={{ fontSize: '18px', mb: 1, color: 'red' }}
              >
                {tutorial.meta.title} (No steps found)
              </Typography>
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

const TutorialList: FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [search, setSearch] = useState('')
  const [topic, setTopic] = useState<TopicDropdown>('All topics')
  const [parsedTutorials, setParsedTutorials] = useState<Tutorial[]>([])
  const [tutorials, _] = useState<Meta[]>(() => getMetaData())

  useEffect(() => {
    setParsedTutorials(
      Object.values(tutorials).map((metaJson) => {
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
    )
  }, [tutorials])

  return isMobile ? (
    <MobileTutorialList
      search={search}
      setSearch={setSearch}
      topic={topic}
      setTopic={setTopic}
      parsedTutorials={parsedTutorials}
    />
  ) : (
    <DesktopTutorialList
      search={search}
      setSearch={setSearch}
      topic={topic}
      setTopic={setTopic}
      parsedTutorials={parsedTutorials}
    />
  )
}

const MobileTutorialList: FC<{
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  topic: TopicDropdown
  setTopic: React.Dispatch<React.SetStateAction<TopicDropdown>>
  parsedTutorials: Tutorial[]
}> = ({ search, setSearch, topic, setTopic, parsedTutorials }) => {
  return (
    <Box sx={{ mt: 1 }}>
      <Grid container direction="column" rowSpacing={2}>
        <SearchBar setSearch={setSearch} />
        <TopicFilter topic={topic} setTopic={setTopic} />

        {parsedTutorials
          .filter((tutorial: Tutorial) => searchFilter(search, tutorial))
          .filter((tutorial: Tutorial) => topicFilter(topic, tutorial))
          .map((tutorial: Tutorial) => (
            <Grid item key={tutorial.meta.id}>
              <TutorialCard tutorial={tutorial} />
            </Grid>
          ))}
      </Grid>
    </Box>
  )
}

const DesktopTutorialList: FC<{
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  topic: TopicDropdown
  setTopic: React.Dispatch<React.SetStateAction<TopicDropdown>>
  parsedTutorials: Tutorial[]
}> = ({ search, setSearch, topic, setTopic, parsedTutorials }) => {
  return (
    <Box marginX={8} marginY={3} minWidth="90vw">
      <Grid container columnSpacing={2}>
        <SearchBar setSearch={setSearch} />
        <TopicFilter topic={topic} setTopic={setTopic} />
      </Grid>

      <TutorialGrid mb={2}>
        {parsedTutorials
          .filter((tutorial: Tutorial) => searchFilter(search, tutorial))
          .filter((tutorial: Tutorial) => topicFilter(topic, tutorial))
          .map((tutorial: Tutorial) => (
            <TutorialCard key={tutorial.meta.id} tutorial={tutorial} />
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
      <FormControl
        variant="outlined"
        sx={{
          width: '22rem',
          mb: 4,
        }}
      >
        <OutlinedInput
          sx={{
            backgroundColor: 'var(--mui-palette-background-paper)',
            color: 'var(--mui-palette-text-primary)',
            boxShadow: shadow,
            height: '44px',
          }}
          startAdornment={
            <InputAdornment position="start">
              <Search
                sx={{
                  color: 'rgba(102, 56, 184, 1)',
                }}
              />
            </InputAdornment>
          }
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name of the tutorial or guide..."
        />
      </FormControl>
    </Grid>
  )
}

const TopicFilter: FC<{
  topic: TopicDropdown
  setTopic: React.Dispatch<React.SetStateAction<TopicDropdown>>
}> = ({ topic, setTopic }) => {
  return (
    <Grid item>
      <FormControl
        variant="outlined"
        sx={{
          border: grey[300],
          boxShadow: shadow,
          width: '12rem',
          mb: 4,
          transformOrigin: 'top',
        }}
      >
        <Select
          sx={{
            backgroundColor: 'var(--mui-palette-background-paper)',
            color: 'var(--mui-palette-text-primary)',
            height: '44px',
          }}
          value={topic}
          onChange={(e) => setTopic(e.target.value as TopicDropdown)}
        >
          {TopicDropdownValues.map((topic) => (
            <MenuItem key={topic} value={topic}>
              {topic}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  )
}

export default TutorialList
