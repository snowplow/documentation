import React, { FC, useState, useEffect } from 'react'
import Head from '@docusaurus/Head'
import { Meta, Tutorial } from '../models'
import { getSteps } from '../utils'
import TutorialGrid from '../TutorialGrid'
import TutorialSearch from '../TutorialSearch'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@site/src/components/ui/accordion'
import {
  useTutorialFilters,
  UseCaseFilter,
  TopicFilter,
  TechnologyFilter,
  SnowplowTechFilter,
} from './filters'
import '../tutorials-page.css'

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



// Shared filter and tutorial content hook
const useTutorialContent = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  const defaultAccordionValue = isMobile ? [] : ["use-cases", "topics", "technology"]

  return {
    filters: (
      <div className="space-y-4">
        <TutorialSearch onSearch={setSearch} />

        <Accordion type="multiple" variant="outline" className="w-full" defaultValue={defaultAccordionValue}>
          <AccordionItem value="use-cases">
            <AccordionTrigger>
              Filter by use case
            </AccordionTrigger>
            <AccordionContent>
              <UseCaseFilter
                selectedUseCases={selectedUseCases}
                setSelectedUseCases={setSelectedUseCases}
                allAvailableUseCases={allAvailableUseCases}
                availableUseCases={filteredAvailableOptions.availableUseCases}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="topics">
            <AccordionTrigger>
              Filter by topic
            </AccordionTrigger>
            <AccordionContent>
              <TopicFilter
                selectedTopics={selectedTopics}
                setSelectedTopics={setSelectedTopics}
                availableTopics={filteredAvailableOptions.availableTopics}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="technology">
            <AccordionTrigger>
              Filter by technology
            </AccordionTrigger>
            <AccordionContent>
              <TechnologyFilter
                selectedTechnologies={selectedTechnologies}
                setSelectedTechnologies={setSelectedTechnologies}
                allAvailableTechnologies={allAvailableTechnologies}
                availableTechnologies={filteredAvailableOptions.availableTechnologies}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="snowplow-tech">
            <AccordionTrigger>
              Filter by Snowplow technology
            </AccordionTrigger>
            <AccordionContent>
              <SnowplowTechFilter
                selectedSnowplowTech={selectedSnowplowTech}
                setSelectedSnowplowTech={setSelectedSnowplowTech}
                allAvailableSnowplowTech={allAvailableSnowplowTech}
                availableSnowplowTech={filteredAvailableOptions.availableSnowplowTech}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    ),
    tutorials: filteredTutorials,
  }
}

const TutorialList: FC = () => {
  const content = useTutorialContent()

  return (
    <>
      <Head>
        <title>Tutorials | Snowplow Documentation</title>
      </Head>

      <div className="w-full">
        {/* Mobile filters - Only shown on mobile */}
        <div className="block lg:hidden max-w-7xl mx-auto px-6 pt-6">
          <div className="p-4 mb-6">
            {content.filters}
          </div>
        </div>

        <div className="flex">
          {/* Sidebar - Hidden on mobile, shown on desktop - Sticks to left edge */}
          <div className="hidden lg:block w-[320px] flex-shrink-0">
            <div className="p-6 sticky top-12">
              {content.filters}
            </div>
          </div>

          {/* Main content - Center aligned with page */}
          <div className="flex-1 flex justify-center px-6 pb-6">
            <div className="w-full max-w-6xl">
              {/* Tutorial Grid */}
              <TutorialGrid tutorials={content.tutorials} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TutorialList
