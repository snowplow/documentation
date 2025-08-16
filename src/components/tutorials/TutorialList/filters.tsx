import React, { FC, useMemo, useState } from 'react'
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material'

import { getMetaData } from '../utils'
import { Meta, Topic as TopicType, Tutorial } from '../models'

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

// Custom hook to manage all filter state and derived data
export const useTutorialFilters = (getParsedTutorials: (tutorials: Meta[]) => Tutorial[]) => {
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
  
  const filteredTutorials = useMemo<Tutorial[]>(
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

  return {
    search,
    setSearch,
    selectedTopics,
    setSelectedTopics,
    selectedUseCases,
    setSelectedUseCases,
    selectedTechnologies,
    setSelectedTechnologies,
    selectedSnowplowTech,
    setSelectedSnowplowTech,
    allAvailableUseCases,
    allAvailableTechnologies,
    allAvailableSnowplowTech,
    filteredAvailableOptions,
    filteredTutorials,
  }
}

interface GenericFilterProps {
  title: string
  options: string[]
  selectedValues: string[]
  availableValues: string[]
  onChange: (value: string, checked: boolean) => void
  customOrdering?: (options: string[]) => string[]
}

const GenericFilter: FC<GenericFilterProps> = ({
  title,
  options,
  selectedValues,
  availableValues,
  onChange,
  customOrdering,
}) => {
  const orderedOptions = customOrdering ? customOrdering(options) : options

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontSize: '16px', fontWeight: 600 }}
      >
        {title}
      </Typography>
      {orderedOptions.map((option) => {
        const isAvailable =
          availableValues.includes(option) || selectedValues.includes(option)
        return (
          <FormControlLabel
            key={option}
            control={
              <Checkbox
                checked={selectedValues.includes(option)}
                onChange={(e) => onChange(option, e.target.checked)}
                disabled={!isAvailable}
                sx={{
                  '&.Mui-checked': { color: 'rgba(102, 56, 184, 1)' },
                  '&.Mui-disabled': { opacity: 0.5 },
                }}
              />
            }
            label={option}
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



export const SnowplowTechFilter: FC<{
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
  const handleChange = (tech: string, checked: boolean) => {
    if (checked) {
      setSelectedSnowplowTech((prev) => [...prev, tech])
    } else {
      setSelectedSnowplowTech((prev) => prev.filter((t) => t !== tech))
    }
  }

  return (
    <GenericFilter
      title="Filter by Snowplow technology"
      options={allAvailableSnowplowTech}
      selectedValues={selectedSnowplowTech}
      availableValues={availableSnowplowTech}
      onChange={handleChange}
    />
  )
}

export const TechnologyFilter: FC<{
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
  const handleChange = (technology: string, checked: boolean) => {
    if (checked) {
      setSelectedTechnologies((prev) => [...prev, technology])
    } else {
      setSelectedTechnologies((prev) =>
        prev.filter((tech) => tech !== technology)
      )
    }
  }

  return (
    <GenericFilter
      title="Filter by technology"
      options={allAvailableTechnologies}
      selectedValues={selectedTechnologies}
      availableValues={availableTechnologies}
      onChange={handleChange}
    />
  )
}

export const UseCaseFilter: FC<{
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
  const handleChange = (useCase: string, checked: boolean) => {
    if (checked) {
      setSelectedUseCases((prev) => [...prev, useCase])
    } else {
      setSelectedUseCases((prev) => prev.filter((uc) => uc !== useCase))
    }
  }

  return (
    <GenericFilter
      title="Filter by use case"
      options={allAvailableUseCases}
      selectedValues={selectedUseCases}
      availableValues={availableUseCases}
      onChange={handleChange}
    />
  )
}

export const TopicFilter: FC<{
  selectedTopics: string[]
  setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>
  availableTopics: string[]
}> = ({ selectedTopics, setSelectedTopics, availableTopics }) => {
  const handleChange = (topic: string, checked: boolean) => {
    if (checked) {
      setSelectedTopics((prev) => [...prev, topic])
    } else {
      setSelectedTopics((prev) => prev.filter((t) => t !== topic))
    }
  }

  // Put "Solution accelerator" first, then the rest in their original order
  const customOrdering = useMemo(() => {
    return (topics: string[]) => {
      const solutionAccelerator = 'Solution accelerator'
      const otherTopics = topics.filter(topic => topic !== solutionAccelerator)
      return topics.includes(solutionAccelerator) 
        ? [solutionAccelerator, ...otherTopics]
        : topics
    }
  }, [])

  return (
    <GenericFilter
      title="Filter by topic"
      options={TopicValues}
      selectedValues={selectedTopics}
      availableValues={availableTopics}
      onChange={handleChange}
      customOrdering={customOrdering}
    />
  )
}
