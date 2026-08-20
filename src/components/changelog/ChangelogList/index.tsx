import React, { FC, useEffect, useState } from 'react'
import Head from '@docusaurus/Head'
import SearchInput from '@site/src/components/ui/search-input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@site/src/components/ui/accordion'
import ChangelogTable from '../ChangelogTable'
import { CheckboxFilter, useChangelogFilters } from './filters'

// Below this width the filter sidebar moves above the list
const MOBILE_BREAKPOINT = 1024

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

const ChangelogList: FC = () => {
  const isMobile = useIsMobile()
  const {
    setSearch,
    selectedTypes,
    setSelectedTypes,
    allAvailableTypes,
    selectedComponents,
    setSelectedComponents,
    allAvailableComponents,
    selectedPlatforms,
    setSelectedPlatforms,
    allAvailablePlatforms,
    filteredAvailableOptions,
    filteredEntries,
    totalCount,
  } = useChangelogFilters()

  // Collapsed on mobile so the list stays reachable without scrolling past every filter
  const defaultAccordionValue = isMobile
    ? []
    : ['update-type', 'components', 'platforms']

  const filters = (
    <div className="space-y-4">
      <SearchInput onSearch={setSearch} placeholder="Search the changelog" />

      <Accordion
        type="multiple"
        variant="outline"
        className="w-full"
        defaultValue={defaultAccordionValue}
      >
        <AccordionItem value="update-type">
          <AccordionTrigger>Filter by update type</AccordionTrigger>
          <AccordionContent>
            <CheckboxFilter
              name="update-type"
              options={allAvailableTypes}
              selectedValues={selectedTypes}
              availableValues={filteredAvailableOptions.availableTypes}
              setSelected={setSelectedTypes}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="components">
          <AccordionTrigger>Filter by component</AccordionTrigger>
          <AccordionContent>
            <CheckboxFilter
              name="component"
              options={allAvailableComponents}
              selectedValues={selectedComponents}
              availableValues={filteredAvailableOptions.availableComponents}
              setSelected={setSelectedComponents}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="platforms">
          <AccordionTrigger>Filter by platform</AccordionTrigger>
          <AccordionContent>
            <CheckboxFilter
              name="platform"
              options={allAvailablePlatforms}
              selectedValues={selectedPlatforms}
              availableValues={filteredAvailableOptions.availablePlatforms}
              setSelected={setSelectedPlatforms}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  return (
    <>
      <Head>
        <title>Changelog | Snowplow Documentation</title>
      </Head>

      <div className="w-full">
        {/* Mobile filters - Only shown on mobile */}
        {isMobile && (
          <div className="max-w-7xl mx-auto px-6 pt-6">
            <div className="p-4 mb-6">{filters}</div>
          </div>
        )}

        <div className="flex">
          {/* Sidebar - Hidden on mobile, shown on desktop - Sticks to left edge */}
          {!isMobile && (
            <div className="w-[320px] flex-shrink-0">
              {/* Three facets can run past the fold, so the sticky column scrolls on its own */}
              <div className="p-6 sticky top-12 max-h-[calc(100vh-4rem)] overflow-y-auto">
                {filters}
              </div>
            </div>
          )}

          {/* Main content - Aligned next to the filter sidebar, which already pads its right edge.
              Top padding matches the sidebar's so the column headers line up with the search box. */}
          <div className="flex-1 pt-6 pr-6 pb-6">
            <div className="w-full max-w-6xl">
              <p className="text-sm text-muted-foreground mb-4">
                Showing {filteredEntries.length} of {totalCount} entries
              </p>
              <ChangelogTable entries={filteredEntries} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChangelogList
