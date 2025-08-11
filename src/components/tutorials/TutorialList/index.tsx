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

function snowplowTechFilter(
  selectedSnowplowTech: string[],
  tutorial?: Tutorial
): boolean {
  if (!tutorial) return false
  if (selectedSnowplowTech.length === 0) return true
  return tutorial.meta.snowplowTech.some((tech) =>
    selectedSnowplowTech.includes(tech)
  )
}

function technologyFilter(
  selectedTechnologies: string[],
  tutorial?: Tutorial
): boolean {
  if (!tutorial) return false
  if (selectedTechnologies.length === 0) return true
  return tutorial.meta.technologies.some((tech) =>
    selectedTechnologies.includes(tech)
  )
}

function useCaseFilter(
  selectedUseCases: string[],
  tutorial?: Tutorial
): boolean {
  if (!tutorial) return false
  if (selectedUseCases.length === 0) return true
  return tutorial.meta.useCases.some((useCase) =>
    selectedUseCases.includes(useCase)
  )
}

function topicFilter(selectedTopics: string[], tutorial?: Tutorial): boolean {
  if (!tutorial) return false
  if (selectedTopics.length === 0) return true
  return selectedTopics.includes(tutorial.meta.label)
}

const TopicValues: string[] = Object.values(TopicType.Values)

// Get available options based on current filters
function getFilteredAvailableOptions(
  tutorials: Tutorial[],
  search: string,
  selectedTopics: string[],
  selectedUseCases: string[],
  selectedTechnologies: string[],
  selectedSnowplowTech: string[]
) {
  // Filter tutorials based on current selections (excluding the filter we're calculating for)
  const getFilteredTutorials = (excludeFilter: string) => {
    return tutorials
      .filter((tutorial) => searchFilter(search, tutorial))
      .filter((tutorial) =>
        excludeFilter !== 'topics'
          ? topicFilter(selectedTopics, tutorial)
          : true
      )
      .filter((tutorial) =>
        excludeFilter !== 'useCases'
          ? useCaseFilter(selectedUseCases, tutorial)
          : true
      )
      .filter((tutorial) =>
        excludeFilter !== 'technologies'
          ? technologyFilter(selectedTechnologies, tutorial)
          : true
      )
      .filter((tutorial) =>
        excludeFilter !== 'snowplowTech'
          ? snowplowTechFilter(selectedSnowplowTech, tutorial)
          : true
      )
  }

  // Get available options for each filter type
  const availableTopics = new Set<string>()
  const availableUseCases = new Set<string>()
  const availableTechnologies = new Set<string>()
  const availableSnowplowTech = new Set<string>()

  getFilteredTutorials('topics').forEach((tutorial) => {
    availableTopics.add(tutorial.meta.label)
  })

  getFilteredTutorials('useCases').forEach((tutorial) => {
    tutorial.meta.useCases.forEach((useCase) => availableUseCases.add(useCase))
  })

  getFilteredTutorials('technologies').forEach((tutorial) => {
    tutorial.meta.technologies.forEach((tech) =>
      availableTechnologies.add(tech)
    )
  })

  getFilteredTutorials('snowplowTech').forEach((tutorial) => {
    tutorial.meta.snowplowTech.forEach((tech) =>
      availableSnowplowTech.add(tech)
    )
  })

  return {
    availableTopics: Array.from(availableTopics),
    availableUseCases: Array.from(availableUseCases),
    availableTechnologies: Array.from(availableTechnologies),
    availableSnowplowTech: Array.from(availableSnowplowTech),
  }
}

// Extract unique use cases from all tutorials
function getAvailableUseCases(tutorials: Tutorial[]): string[] {
  const useCases = new Set<string>()
  tutorials.forEach((tutorial) => {
    tutorial.meta.useCases.forEach((useCase) => useCases.add(useCase))
  })
  return Array.from(useCases).sort()
}

// Extract unique technologies from all tutorials
function getAvailableTechnologies(tutorials: Tutorial[]): string[] {
  const technologies = new Set<string>()
  tutorials.forEach((tutorial) => {
    tutorial.meta.technologies.forEach((tech) => technologies.add(tech))
  })
  return Array.from(technologies).sort()
}

// Extract unique Snowplow technologies from all tutorials
function getAvailableSnowplowTech(tutorials: Tutorial[]): string[] {
  const snowplowTech = new Set<string>()
  tutorials.forEach((tutorial) => {
    tutorial.meta.snowplowTech.forEach((tech) => snowplowTech.add(tech))
  })
  return Array.from(snowplowTech).sort()
}

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
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([])
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([])
  const [selectedSnowplowTech, setSelectedSnowplowTech] = useState<string[]>([])
  const parsedTutorials = useMemo<Tutorial[]>(
    () => getParsedTutorials(getMetaData()),
    []
  )
  const allAvailableUseCases = useMemo<string[]>(
    () => getAvailableUseCases(parsedTutorials),
    [parsedTutorials]
  )
  const allAvailableTechnologies = useMemo<string[]>(
    () => getAvailableTechnologies(parsedTutorials),
    [parsedTutorials]
  )
  const allAvailableSnowplowTech = useMemo<string[]>(
    () => getAvailableSnowplowTech(parsedTutorials),
    [parsedTutorials]
  )

  // Calculate filtered available options based on current selections
  const filteredAvailableOptions = useMemo(() => {
    return getFilteredAvailableOptions(
      parsedTutorials,
      search,
      selectedTopics,
      selectedUseCases,
      selectedTechnologies,
      selectedSnowplowTech
    )
  }, [
    parsedTutorials,
    search,
    selectedTopics,
    selectedUseCases,
    selectedTechnologies,
    selectedSnowplowTech,
  ])
  const tutorials = useMemo<Tutorial[]>(
    () =>
      filterTutorials(
        search,
        selectedTopics,
        selectedUseCases,
        selectedTechnologies,
        selectedSnowplowTech,
        parsedTutorials
      ),
    [
      search,
      selectedTopics,
      selectedUseCases,
      selectedTechnologies,
      selectedSnowplowTech,
      parsedTutorials,
    ]
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
          selectedUseCases={selectedUseCases}
          setSelectedUseCases={setSelectedUseCases}
          allAvailableUseCases={allAvailableUseCases}
          selectedTechnologies={selectedTechnologies}
          setSelectedTechnologies={setSelectedTechnologies}
          allAvailableTechnologies={allAvailableTechnologies}
          selectedSnowplowTech={selectedSnowplowTech}
          setSelectedSnowplowTech={setSelectedSnowplowTech}
          allAvailableSnowplowTech={allAvailableSnowplowTech}
          filteredAvailableOptions={filteredAvailableOptions}
          tutorials={tutorials}
        />
      ) : (
        <DesktopTutorialList
          setSearch={setSearch}
          selectedTopics={selectedTopics}
          setSelectedTopics={setSelectedTopics}
          selectedUseCases={selectedUseCases}
          setSelectedUseCases={setSelectedUseCases}
          allAvailableUseCases={allAvailableUseCases}
          selectedTechnologies={selectedTechnologies}
          setSelectedTechnologies={setSelectedTechnologies}
          allAvailableTechnologies={allAvailableTechnologies}
          selectedSnowplowTech={selectedSnowplowTech}
          setSelectedSnowplowTech={setSelectedSnowplowTech}
          allAvailableSnowplowTech={allAvailableSnowplowTech}
          filteredAvailableOptions={filteredAvailableOptions}
          tutorials={tutorials}
        />
      )}
    </>
  )
}

function filterTutorials(
  search: string,
  selectedTopics: string[],
  selectedUseCases: string[],
  selectedTechnologies: string[],
  selectedSnowplowTech: string[],
  tutorials: Tutorial[]
): Tutorial[] {
  return tutorials
    .filter((tutorial) => searchFilter(search, tutorial))
    .filter((tutorial) => topicFilter(selectedTopics, tutorial))
    .filter((tutorial) => useCaseFilter(selectedUseCases, tutorial))
    .filter((tutorial) => technologyFilter(selectedTechnologies, tutorial))
    .filter((tutorial) => snowplowTechFilter(selectedSnowplowTech, tutorial))
}

const MobileTutorialList: FC<{
  setSearch: React.Dispatch<React.SetStateAction<string>>
  selectedTopics: string[]
  setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>
  selectedUseCases: string[]
  setSelectedUseCases: React.Dispatch<React.SetStateAction<string[]>>
  allAvailableUseCases: string[]
  selectedTechnologies: string[]
  setSelectedTechnologies: React.Dispatch<React.SetStateAction<string[]>>
  allAvailableTechnologies: string[]
  selectedSnowplowTech: string[]
  setSelectedSnowplowTech: React.Dispatch<React.SetStateAction<string[]>>
  allAvailableSnowplowTech: string[]
  filteredAvailableOptions: {
    availableTopics: string[]
    availableUseCases: string[]
    availableTechnologies: string[]
    availableSnowplowTech: string[]
  }
  tutorials: Tutorial[]
}> = ({
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
  tutorials,
}) => {
  return (
    <Box sx={{ mt: 1 }}>
      <Grid container direction="column" rowSpacing={2}>
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
  selectedUseCases: string[]
  setSelectedUseCases: React.Dispatch<React.SetStateAction<string[]>>
  allAvailableUseCases: string[]
  selectedTechnologies: string[]
  setSelectedTechnologies: React.Dispatch<React.SetStateAction<string[]>>
  allAvailableTechnologies: string[]
  selectedSnowplowTech: string[]
  setSelectedSnowplowTech: React.Dispatch<React.SetStateAction<string[]>>
  allAvailableSnowplowTech: string[]
  filteredAvailableOptions: {
    availableTopics: string[]
    availableUseCases: string[]
    availableTechnologies: string[]
    availableSnowplowTech: string[]
  }
  tutorials: Tutorial[]
}> = ({
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
  tutorials,
}) => {
  return (
    <Box marginX={8} marginY={3} sx={{ minWidth: '90vw', mr: 0 }}>
      <Grid container columnSpacing={4}>
        {/* Left sidebar with filters */}
        <Grid item xs={3}>
          <TopicFilterSidebar>
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
              availableTechnologies={
                filteredAvailableOptions.availableTechnologies
              }
            />
            <SnowplowTechFilter
              selectedSnowplowTech={selectedSnowplowTech}
              setSelectedSnowplowTech={setSelectedSnowplowTech}
              allAvailableSnowplowTech={allAvailableSnowplowTech}
              availableSnowplowTech={
                filteredAvailableOptions.availableSnowplowTech
              }
            />
          </TopicFilterSidebar>
        </Grid>

        {/* Main content area */}
        <Grid item xs={9}>
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
          placeholder="Search by tutorial name"
        />
      </SearchBarFormControl>
    </Grid>
  )
}

const SnowplowTechFilter: FC<{
  selectedSnowplowTech: string[]
  setSelectedSnowplowTech: React.Dispatch<React.SetStateAction<string[]>>
  allAvailableSnowplowTech: string[]
  availableSnowplowTech: string[]
}> = ({
  selectedSnowplowTech,
  setSelectedSnowplowTech,
  allAvailableSnowplowTech,
  availableSnowplowTech,
}) => {
  const handleSnowplowTechChange = (tech: string, checked: boolean) => {
    if (checked) {
      setSelectedSnowplowTech((prev) => [...prev, tech])
    } else {
      setSelectedSnowplowTech((prev) => prev.filter((t) => t !== tech))
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontSize: '16px', fontWeight: 600 }}
      >
        Filter by Snowplow technology
      </Typography>
      {allAvailableSnowplowTech.map((tech) => {
        const isAvailable =
          availableSnowplowTech.includes(tech) ||
          selectedSnowplowTech.includes(tech)
        return (
          <FormControlLabel
            key={tech}
            control={
              <Checkbox
                checked={selectedSnowplowTech.includes(tech)}
                onChange={(e) =>
                  handleSnowplowTechChange(tech, e.target.checked)
                }
                disabled={!isAvailable}
                sx={{
                  '&.Mui-checked': { color: 'rgba(102, 56, 184, 1)' },
                  '&.Mui-disabled': { opacity: 0.5 },
                }}
              />
            }
            label={tech}
            sx={{
              display: 'block',
              mb: 1,
              opacity: isAvailable ? 1 : 0.5,
              color: isAvailable ? 'inherit' : 'rgba(0, 0, 0, 0.38)',
            }}
          />
        )
      })}
    </Box>
  )
}

const TechnologyFilter: FC<{
  selectedTechnologies: string[]
  setSelectedTechnologies: React.Dispatch<React.SetStateAction<string[]>>
  allAvailableTechnologies: string[]
  availableTechnologies: string[]
}> = ({
  selectedTechnologies,
  setSelectedTechnologies,
  allAvailableTechnologies,
  availableTechnologies,
}) => {
  const handleTechnologyChange = (technology: string, checked: boolean) => {
    if (checked) {
      setSelectedTechnologies((prev) => [...prev, technology])
    } else {
      setSelectedTechnologies((prev) =>
        prev.filter((tech) => tech !== technology)
      )
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontSize: '16px', fontWeight: 600 }}
      >
        Filter by technology
      </Typography>
      {allAvailableTechnologies.map((technology) => {
        const isAvailable =
          availableTechnologies.includes(technology) ||
          selectedTechnologies.includes(technology)
        return (
          <FormControlLabel
            key={technology}
            control={
              <Checkbox
                checked={selectedTechnologies.includes(technology)}
                onChange={(e) =>
                  handleTechnologyChange(technology, e.target.checked)
                }
                disabled={!isAvailable}
                sx={{
                  '&.Mui-checked': { color: 'rgba(102, 56, 184, 1)' },
                  '&.Mui-disabled': { opacity: 0.5 },
                }}
              />
            }
            label={technology}
            sx={{
              display: 'block',
              mb: 1,
              opacity: isAvailable ? 1 : 0.5,
              color: isAvailable ? 'inherit' : 'rgba(0, 0, 0, 0.38)',
            }}
          />
        )
      })}
    </Box>
  )
}

const UseCaseFilter: FC<{
  selectedUseCases: string[]
  setSelectedUseCases: React.Dispatch<React.SetStateAction<string[]>>
  allAvailableUseCases: string[]
  availableUseCases: string[]
}> = ({
  selectedUseCases,
  setSelectedUseCases,
  allAvailableUseCases,
  availableUseCases,
}) => {
  const handleUseCaseChange = (useCase: string, checked: boolean) => {
    if (checked) {
      setSelectedUseCases((prev) => [...prev, useCase])
    } else {
      setSelectedUseCases((prev) => prev.filter((uc) => uc !== useCase))
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontSize: '16px', fontWeight: 600 }}
      >
        Filter by use case
      </Typography>
      {allAvailableUseCases.map((useCase) => {
        const isAvailable =
          availableUseCases.includes(useCase) ||
          selectedUseCases.includes(useCase)
        return (
          <FormControlLabel
            key={useCase}
            control={
              <Checkbox
                checked={selectedUseCases.includes(useCase)}
                onChange={(e) => handleUseCaseChange(useCase, e.target.checked)}
                disabled={!isAvailable}
                sx={{
                  '&.Mui-checked': { color: 'rgba(102, 56, 184, 1)' },
                  '&.Mui-disabled': { opacity: 0.5 },
                }}
              />
            }
            label={useCase}
            sx={{
              display: 'block',
              mb: 1,
              opacity: isAvailable ? 1 : 0.5,
              color: isAvailable ? 'inherit' : 'rgba(0, 0, 0, 0.38)',
            }}
          />
        )
      })}
    </Box>
  )
}

const TopicFilter: FC<{
  selectedTopics: string[]
  setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>
  availableTopics: string[]
}> = ({ selectedTopics, setSelectedTopics, availableTopics }) => {
  const handleTopicChange = (topic: string, checked: boolean) => {
    if (checked) {
      setSelectedTopics((prev) => [...prev, topic])
    } else {
      setSelectedTopics((prev) => prev.filter((t) => t !== topic))
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontSize: '16px', fontWeight: 600 }}
      >
        Filter by topic
      </Typography>
      {TopicValues.map((topic) => {
        const isAvailable =
          availableTopics.includes(topic) || selectedTopics.includes(topic)
        return (
          <FormControlLabel
            key={topic}
            control={
              <Checkbox
                checked={selectedTopics.includes(topic)}
                onChange={(e) => handleTopicChange(topic, e.target.checked)}
                disabled={!isAvailable}
                sx={{
                  '&.Mui-checked': { color: 'rgba(102, 56, 184, 1)' },
                  '&.Mui-disabled': { opacity: 0.5 },
                }}
              />
            }
            label={topic}
            sx={{
              display: 'block',
              mb: 1,
              opacity: isAvailable ? 1 : 0.5,
              color: isAvailable ? 'inherit' : 'rgba(0, 0, 0, 0.38)',
            }}
          />
        )
      })}
    </Box>
  )
}

export default TutorialList
