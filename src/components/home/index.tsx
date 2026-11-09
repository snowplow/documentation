import React, { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
import { useHistory, useLocation } from '@docusaurus/router'
import { ArrowRight, Search } from 'lucide-react'
import { Card, CardGrid } from '@site/src/components/Card'
import { useReleaseNotes, formatUpdateDate } from '@site/src/components/release-notes/utils'
import { QUICKSTARTS, LIFECYCLE, type ProductKey } from '@site/src/data/home'

export { default as AgentSetup } from './AgentSetup'
export { default as PipelineMap } from './PipelineMap'

// --- Search -----------------------------------------------------------------

/**
 * A large search field that opens the DocSearch modal from the navbar. It is
 * a real form, so without JavaScript it submits to the /search page.
 */
export function HomeSearch(): JSX.Element {
  const openDocSearch = (e: React.SyntheticEvent) => {
    const button = document.querySelector<HTMLButtonElement>('.DocSearch-Button')
    if (button) {
      e.preventDefault()
      button.click()
    }
  }

  return (
    <form className="home-search" action="/search" method="get" role="search" onSubmit={openDocSearch}>
      <label htmlFor="home-search-input" className="sr-only">
        Search the documentation
      </label>
      <Search size={18} aria-hidden="true" className="home-search__icon" />
      <input
        id="home-search-input"
        name="q"
        type="search"
        className="home-search__input"
        placeholder="Search the docs"
        autoComplete="off"
        onFocus={openDocSearch}
        onClick={openDocSearch}
        readOnly
      />
      <kbd className="home-search__kbd" aria-hidden="true">
        ⌘K
      </kbd>
    </form>
  )
}

// --- Lifecycle strip --------------------------------------------------------

/** One tab per product, each a row of stages from design to model or serve */
export function Lifecycle(): JSX.Element {
  return (
    <div className="home-lifecycle breakout">
      <Tabs groupId="product" queryString="product">
        {(Object.keys(LIFECYCLE) as ProductKey[]).map((product, index) => (
          <TabItem key={product} value={product} label={LIFECYCLE[product].label} default={index === 0}>
            <ol className={clsx('home-lifecycle__stages', `home-lifecycle__stages--${LIFECYCLE[product].stages.length}`)}>
              {LIFECYCLE[product].stages.map((stage, i) => (
                <li key={stage.title} className="home-lifecycle__stage">
                  <span className="home-lifecycle__step" aria-hidden="true">
                    {i + 1}
                  </span>
                  <Link to={stage.href} className="home-lifecycle__title">
                    {stage.title}
                  </Link>
                  <p className="home-lifecycle__summary">{stage.summary}</p>
                  <ul className="home-lifecycle__links">
                    {stage.links.map((link) => (
                      <li key={link.href}>
                        <Link to={link.href}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </TabItem>
        ))}
      </Tabs>
    </div>
  )
}

// --- Quickstarts ------------------------------------------------------------

const FILTERS: { value: 'all' | ProductKey; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'cdi', label: 'Snowplow CDI' },
  { value: 'signals', label: 'Signals' },
]

/**
 * Quickstarts with time estimates. `?filter=cdi` or `?filter=signals` narrows
 * the list, so each view can be linked. The server-rendered list, and the
 * Markdown copy, always show every quickstart.
 */
export function Quickstarts(): JSX.Element {
  const location = useLocation()
  const history = useHistory()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const filter = useMemo(() => {
    const value = new URLSearchParams(location.search).get('filter')
    return mounted && (value === 'cdi' || value === 'signals') ? value : 'all'
  }, [location.search, mounted])

  const setFilter = (value: string) => {
    const params = new URLSearchParams(location.search)
    if (value === 'all') params.delete('filter')
    else params.set('filter', value)
    const search = params.toString()
    history.replace({ ...location, search: search ? `?${search}` : '' })
  }

  const visible = QUICKSTARTS.filter((q) => filter === 'all' || q.product === filter)

  return (
    <div className="home-quickstarts breakout">
      <div className="home-quickstarts__filter" role="radiogroup" aria-label="Show quickstarts for">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            role="radio"
            aria-checked={filter === f.value}
            className={clsx('home-quickstarts__chip', filter === f.value && 'home-quickstarts__chip--active')}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <CardGrid cols={3}>
        {visible.map((q) => (
          <Card
            key={q.href}
            variant="quickstart"
            title={q.title}
            href={q.href}
            description={q.description}
            eyebrow={q.product === 'cdi' ? 'Snowplow CDI' : 'Signals'}
            time={q.time}
          />
        ))}
      </CardGrid>
    </div>
  )
}

// --- Latest releases --------------------------------------------------------

/** The three most recent release notes, from plugins/docusaurus-plugin-release-notes */
export function LatestReleases({ count = 3 }: { count?: number }): JSX.Element {
  const notes = useReleaseNotes()
  const latest = [...notes].sort((a, b) => b.date.localeCompare(a.date)).slice(0, count)

  return (
    <div className="home-releases">
      <ul className="home-releases__list">
        {latest.map((note) => (
          <li key={note.permalink} className="home-releases__item">
            <time dateTime={note.date} className="home-releases__date">
              {formatUpdateDate(note.date)}
            </time>
            <Link to={note.permalink} className="home-releases__title">
              {note.title}
            </Link>
            {note.description && <p className="home-releases__description">{note.description}</p>}
          </li>
        ))}
      </ul>
      <Link to="/release-notes/" className="home-releases__all">
        All release notes
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </div>
  )
}
