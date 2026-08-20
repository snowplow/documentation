import React, { FC, useMemo, useState } from 'react'
import { Checkbox } from '@site/src/components/ui/checkbox'
import { Label } from '@site/src/components/ui/label'

import {
  ReleaseNote,
  ComponentOrder,
  PlatformOrder,
  UpdateType,
  UpdateTypeOrder,
  orderBy,
} from '../models'
import { useReleaseNotes } from '../utils'

type Facet = 'types' | 'components' | 'platforms'

function searchFilter(term: string, entry: ReleaseNote): boolean {
  const needle = term.toLowerCase()
  return (
    entry.title.toLowerCase().includes(needle) ||
    entry.description.toLowerCase().includes(needle) ||
    entry.components.some((c) => c.toLowerCase().includes(needle)) ||
    entry.platforms.some((p) => p.toLowerCase().includes(needle))
  )
}

// An empty selection means "no opinion", so it matches everything
const matchesAny = (selected: string[], values: string[]) =>
  selected.length === 0 || values.some((value) => selected.includes(value))

function getAvailable(
  entries: ReleaseNote[],
  pick: (entry: ReleaseNote) => string[],
  order: string[]
): string[] {
  const values = new Set<string>()
  entries.forEach((entry) => pick(entry).forEach((value) => values.add(value)))
  return Array.from(values).sort(orderBy(order))
}

// Work out which checkboxes still lead somewhere, ignoring the facet being calculated so that
// a facet never disables its own unselected options.
function getFilteredAvailableOptions(
  entries: ReleaseNote[],
  search: string,
  selectedTypes: string[],
  selectedComponents: string[],
  selectedPlatforms: string[]
) {
  const survivors = (exclude: Facet) =>
    entries
      .filter((entry) => searchFilter(search, entry))
      .filter((e) => exclude === 'types' || matchesAny(selectedTypes, e.updateType))
      .filter(
        (e) => exclude === 'components' || matchesAny(selectedComponents, e.components)
      )
      .filter(
        (e) => exclude === 'platforms' || matchesAny(selectedPlatforms, e.platforms)
      )

  return {
    availableTypes: getAvailable(
      survivors('types'),
      (e) => e.updateType,
      UpdateTypeOrder
    ) as UpdateType[],
    availableComponents: getAvailable(
      survivors('components'),
      (e) => e.components,
      ComponentOrder
    ),
    availablePlatforms: getAvailable(
      survivors('platforms'),
      (e) => e.platforms,
      PlatformOrder
    ),
  }
}

// Manages all filter state and the derived option lists for the release notes page
export const useReleaseNoteFilters = () => {
  const [search, setSearch] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedComponents, setSelectedComponents] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  const entries = useReleaseNotes()

  const allAvailableTypes = useMemo(
    () => getAvailable(entries, (e) => e.updateType, UpdateTypeOrder) as UpdateType[],
    [entries]
  )

  const allAvailableComponents = useMemo(
    () => getAvailable(entries, (e) => e.components, ComponentOrder),
    [entries]
  )

  const allAvailablePlatforms = useMemo(
    () => getAvailable(entries, (e) => e.platforms, PlatformOrder),
    [entries]
  )

  const filteredAvailableOptions = useMemo(
    () =>
      getFilteredAvailableOptions(
        entries,
        search,
        selectedTypes,
        selectedComponents,
        selectedPlatforms
      ),
    [entries, search, selectedTypes, selectedComponents, selectedPlatforms]
  )

  const filteredEntries = useMemo(
    () =>
      entries
        .filter((entry) => searchFilter(search, entry))
        .filter((entry) => matchesAny(selectedTypes, entry.updateType))
        .filter((entry) => matchesAny(selectedComponents, entry.components))
        .filter((entry) => matchesAny(selectedPlatforms, entry.platforms)),
    [entries, search, selectedTypes, selectedComponents, selectedPlatforms]
  )

  return {
    search,
    setSearch,
    selectedTypes,
    setSelectedTypes,
    selectedComponents,
    setSelectedComponents,
    selectedPlatforms,
    setSelectedPlatforms,
    allAvailableTypes,
    allAvailableComponents,
    allAvailablePlatforms,
    filteredAvailableOptions,
    filteredEntries,
    totalCount: entries.length,
  }
}

interface CheckboxFilterProps {
  name: string
  options: string[]
  selectedValues: string[]
  availableValues: string[]
  setSelected: React.Dispatch<React.SetStateAction<string[]>>
}

export const CheckboxFilter: FC<CheckboxFilterProps> = ({
  name,
  options,
  selectedValues,
  availableValues,
  setSelected,
}) => {
  const toggle = (value: string, checked: boolean) =>
    setSelected((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    )

  return (
    <div className="space-y-3">
      {options.map((option) => {
        const isAvailable =
          availableValues.includes(option) || selectedValues.includes(option)
        return (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`${name}-${option}`}
              checked={selectedValues.includes(option)}
              onCheckedChange={(checked) => toggle(option, !!checked)}
              disabled={!isAvailable}
              className={`${!isAvailable ? 'opacity-50' : ''}`}
            />
            <Label
              htmlFor={`${name}-${option}`}
              className={`text-sm leading-none cursor-pointer ${
                !isAvailable
                  ? 'opacity-50 text-muted-foreground'
                  : 'text-foreground'
              }`}
            >
              {option}
            </Label>
          </div>
        )
      })}
    </div>
  )
}
