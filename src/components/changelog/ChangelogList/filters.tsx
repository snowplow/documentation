import React, { FC, useMemo, useState } from 'react'
import { Checkbox } from '@site/src/components/ui/checkbox'
import { Label } from '@site/src/components/ui/label'

import { ChangelogEntry, UpdateType, UpdateTypeOrder } from '../models'
import { useChangelogEntries } from '../utils'

function searchFilter(term: string, entry: ChangelogEntry): boolean {
  const needle = term.toLowerCase()
  return (
    entry.title.toLowerCase().includes(needle) ||
    entry.description.toLowerCase().includes(needle) ||
    entry.components.some((component) =>
      component.toLowerCase().includes(needle)
    )
  )
}

function updateTypeFilter(
  selectedTypes: string[],
  entry: ChangelogEntry
): boolean {
  if (selectedTypes.length === 0) return true
  return entry.updateType.some((type) => selectedTypes.includes(type))
}

function componentFilter(
  selectedComponents: string[],
  entry: ChangelogEntry
): boolean {
  if (selectedComponents.length === 0) return true
  return entry.components.some((component) =>
    selectedComponents.includes(component)
  )
}

function getAvailableComponents(entries: ChangelogEntry[]): string[] {
  const components = new Set<string>()
  entries.forEach((entry) =>
    entry.components.forEach((component) => components.add(component))
  )
  return Array.from(components).sort()
}

function getAvailableUpdateTypes(entries: ChangelogEntry[]): UpdateType[] {
  const types = new Set<UpdateType>()
  entries.forEach((entry) => entry.updateType.forEach((t) => types.add(t)))
  return UpdateTypeOrder.filter((type) => types.has(type))
}

// Work out which checkboxes still lead somewhere, ignoring the filter being calculated so
// that a facet never disables its own unselected options.
function getFilteredAvailableOptions(
  entries: ChangelogEntry[],
  search: string,
  selectedTypes: string[],
  selectedComponents: string[]
) {
  const getFilteredUpdates = (excludeFilter: 'types' | 'components') =>
    entries
      .filter((entry) => searchFilter(search, entry))
      .filter((entry) =>
        excludeFilter !== 'types' ? updateTypeFilter(selectedTypes, entry) : true
      )
      .filter((entry) =>
        excludeFilter !== 'components'
          ? componentFilter(selectedComponents, entry)
          : true
      )

  return {
    availableTypes: getAvailableUpdateTypes(getFilteredUpdates('types')),
    availableComponents: getAvailableComponents(getFilteredUpdates('components')),
  }
}

function filterEntries(
  search: string,
  selectedTypes: string[],
  selectedComponents: string[],
  entries: ChangelogEntry[]
): ChangelogEntry[] {
  return entries
    .filter((entry) => searchFilter(search, entry))
    .filter((entry) => updateTypeFilter(selectedTypes, entry))
    .filter((entry) => componentFilter(selectedComponents, entry))
}

// Manages all filter state and the derived option lists for the product entries page
export const useChangelogFilters = () => {
  const [search, setSearch] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedComponents, setSelectedComponents] = useState<string[]>([])

  const entries = useChangelogEntries()

  const allAvailableTypes = useMemo(
    () => getAvailableUpdateTypes(entries),
    [entries]
  )

  const allAvailableComponents = useMemo(
    () => getAvailableComponents(entries),
    [entries]
  )

  const filteredAvailableOptions = useMemo(
    () =>
      getFilteredAvailableOptions(
        entries,
        search,
        selectedTypes,
        selectedComponents
      ),
    [entries, search, selectedTypes, selectedComponents]
  )

  const filteredEntries = useMemo(
    () => filterEntries(search, selectedTypes, selectedComponents, entries),
    [search, selectedTypes, selectedComponents, entries]
  )

  return {
    search,
    setSearch,
    selectedTypes,
    setSelectedTypes,
    selectedComponents,
    setSelectedComponents,
    allAvailableTypes,
    allAvailableComponents,
    filteredAvailableOptions,
    filteredEntries,
    totalCount: entries.length,
  }
}

interface GenericFilterProps {
  title: string
  options: string[]
  selectedValues: string[]
  availableValues: string[]
  onChange: (value: string, checked: boolean) => void
}

const GenericFilter: FC<GenericFilterProps> = ({
  title,
  options,
  selectedValues,
  availableValues,
  onChange,
}) => (
  <div className="space-y-3">
    {options.map((option) => {
      const isAvailable =
        availableValues.includes(option) || selectedValues.includes(option)
      return (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={`${title}-${option}`}
            checked={selectedValues.includes(option)}
            onCheckedChange={(checked) => onChange(option, !!checked)}
            disabled={!isAvailable}
            className={`${!isAvailable ? 'opacity-50' : ''}`}
          />
          <Label
            htmlFor={`${title}-${option}`}
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

const toggle = (
  setter: React.Dispatch<React.SetStateAction<string[]>>,
  value: string,
  checked: boolean
) =>
  setter((prev) =>
    checked ? [...prev, value] : prev.filter((item) => item !== value)
  )

export const UpdateTypeFilter: FC<{
  selectedTypes: string[]
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>
  allAvailableTypes: string[]
  availableTypes: string[]
}> = ({ selectedTypes, setSelectedTypes, allAvailableTypes, availableTypes }) => (
  <GenericFilter
    title="Filter by update type"
    options={allAvailableTypes}
    selectedValues={selectedTypes}
    availableValues={availableTypes}
    onChange={(value, checked) => toggle(setSelectedTypes, value, checked)}
  />
)

export const ComponentFilter: FC<{
  selectedComponents: string[]
  setSelectedComponents: React.Dispatch<React.SetStateAction<string[]>>
  allAvailableComponents: string[]
  availableComponents: string[]
}> = ({
  selectedComponents,
  setSelectedComponents,
  allAvailableComponents,
  availableComponents,
}) => (
  <GenericFilter
    title="Filter by component"
    options={allAvailableComponents}
    selectedValues={selectedComponents}
    availableValues={availableComponents}
    onChange={(value, checked) => toggle(setSelectedComponents, value, checked)}
  />
)
