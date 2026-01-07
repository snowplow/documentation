import React, { useState, useRef, useEffect, useMemo } from 'react'
import Layout from '@theme/Layout'
import Head from '@docusaurus/Head'
import { motion, useInView } from 'framer-motion'
import { PlaceholdersAndVanishInput } from '../components/ui/placeholders-and-vanish-input'
import { FloatingNav } from '../components/ui/floating-navbar'
import { BackgroundGradientAnimation } from '../components/ui/background-gradient-animation'
import { GridBackground } from '../components/ui/grid-background'
import { BackgroundLines } from '../components/ui/background-lines'
import { getMetaData, getSteps } from '../components/tutorials/utils'
import { Meta, Tutorial } from '../components/tutorials/models'
import TutorialGrid from '../components/tutorials/TutorialGrid'
import { Snippet } from '../components/ui/snippet'
import ProductTabs from '../components/ui/product-tabs'

// Solution Grid Component for landing page
const SolutionGrid = () => {
  const solutionTutorials = useMemo(() => {
    try {
      const parsedTutorials = Object.values(getMetaData())
        .map((metaJson) => {
          const meta = Meta.parse(metaJson)
          const steps = getSteps(meta.id)
          return { meta, steps }
        })
        .map((tutorial) => Tutorial.parse(tutorial))

      // Filter for "Solution accelerator" and "Signals implementation" topics only
      return parsedTutorials.filter(
        (tutorial) =>
          tutorial.meta.label === 'Solution accelerator' ||
          tutorial.meta.label === 'Signals implementation'
      )
    } catch (error) {
      console.error('Error loading tutorials:', error)
      return []
    }
  }, [])

  return <TutorialGrid tutorials={solutionTutorials} />
}

// MCP Installation Component
const MCPInstallation = () => {
  return (
    <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-primary/10 rounded-lg p-3">
          <span className="text-2xl">🚀</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Get Started with Snowplow MCP
          </h3>
          <p className="text-muted-foreground">
            Set up the Snowplow Model Context Protocol server in seconds.
            Install Claude Desktop and run:
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-foreground mb-2">
            Install Claude Desktop:
          </p>
          <Snippet
            text="brew install --cask claude"
            prompt={true}
            dark={false}
            width="100%"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-2">
            Or install Snowplow MCP globally:
          </p>
          <Snippet
            text="npm install -g @snowplow/mcp-server"
            prompt={true}
            dark={false}
            width="100%"
          />
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            💡 Need help? Check our{' '}
            <a
              href="/docs/mcp/"
              className="text-primary hover:text-primary/80 underline"
            >
              MCP documentation
            </a>{' '}
            for detailed setup instructions.
          </p>
        </div>
      </div>
    </div>
  )
}

// Path Card Component
const PathCard = ({
  title,
  subtitle,
  description,
  forText,
  builds,
  ctaText,
  ctaLink,
  icon,
  variant,
  shouldAnimate = false,
}) => {
  const isSignals = variant === 'signals'

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
        isSignals ? 'hover:shadow-cyan-500/20' : 'hover:shadow-violet-500/20'
      }`}
    >
      <div className="bg-white border border-gray-200 rounded-2xl p-8 h-full shadow-sm">
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
            isSignals
              ? 'bg-cyan-50 border border-cyan-100'
              : 'bg-violet-50 border border-violet-100'
          }`}
        >
          <span className="text-2xl">{icon}</span>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p
          className={`text-sm font-medium mb-4 ${
            isSignals ? 'text-cyan-600' : 'text-violet-600'
          }`}
        >
          {subtitle}
        </p>
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

        {/* For text */}
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
          Built for
        </p>
        <p className="text-sm text-gray-600 mb-6">{forText}</p>

        {/* Builds list */}
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">
          You'll build
        </p>
        <ul className="space-y-2 mb-8">
          {builds.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSignals ? 'bg-cyan-500' : 'bg-violet-500'
                }`}
              />
              {item}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <motion.a
          href={ctaLink}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
            isSignals
              ? 'bg-cyan-50 text-cyan-700 hover:bg-cyan-500 hover:text-white border border-cyan-200'
              : 'bg-violet-50 text-violet-700 hover:bg-violet-500 hover:text-white border border-violet-200'
          }`}
          animate={shouldAnimate ? { y: [20, 0] } : { y: 0 }}
          transition={{
            duration: shouldAnimate ? 0.5 : 0,
            delay: shouldAnimate ? 0.3 : 0,
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {ctaText}
          <motion.svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </motion.svg>
        </motion.a>
      </div>
    </div>
  )
}

// FAQ Accordion Item
const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-border last:border-0">
    <button
      onClick={onClick}
      className="w-full py-5 flex items-center justify-between text-left text-foreground bg-card border-border border-solid border-1 border-t-0 border-l-0 border-r-0"
    >
      <span className="text-base text-muted-foreground hover:text-foreground transition-colors pr-8">
        {question}
      </span>
      <span
        className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-transform duration-300 ${
          isOpen
            ? 'rotate-180 bg-accent-foreground border-accent text-accent-foreground'
            : 'bg-muted border-border text-muted-foreground'
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </span>
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 pb-5' : 'max-h-0'
      }`}
    >
      <p className="text-muted-foreground leading-relaxed">{answer}</p>
    </div>
  </div>
)

// Main Landing Page
export default function SnowplowDocsLanding() {
  const [openFAQ, setOpenFAQ] = useState(null)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [hasScrolledToSection, setHasScrolledToSection] = useState(false)
  const pathsRef = useRef(null)
  const isInView = useInView(pathsRef, { threshold: 0.2 })

  const scrollToSection = (sectionId) => {
    console.log('Button clicked - starting scroll')

    const element = document.getElementById(sectionId)
    if (element) {
      // Start the scroll immediately
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })

      // After scroll completes, trigger animation
      setTimeout(() => {
        console.log('Triggering animation')
        setShouldAnimate(true)
      }, 800)
    }
  }

  // Effect to detect natural scrolling to section
  useEffect(() => {
    const handleScroll = () => {
      if (isInView && !hasScrolledToSection && !shouldAnimate) {
        const pathsElement = document.getElementById('paths')
        if (pathsElement) {
          const rect = pathsElement.getBoundingClientRect()
          if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= 0) {
            console.log('Natural scroll detected - triggering animation')
            setShouldAnimate(true)
            setHasScrolledToSection(true)
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isInView, hasScrolledToSection, shouldAnimate])

  const navItems = [
    {
      name: 'CDI',
      link: '/docs/',
      icon: <span>🔧</span>,
    },
    {
      name: 'Signals',
      link: '/docs/signals/',
      icon: <span>📊</span>,
    },
    {
      name: 'Tutorials',
      link: '/tutorials/',
      icon: <span>📖</span>,
    },
    {
      name: 'Get Started',
      link: '#paths',
      icon: <span>🚀</span>,
      onClick: () => scrollToSection('paths'),
      isPrimary: true,
    },
  ]

  const faqs = [
    {
      question: 'What is the Snowplow Model Context Protocol (MCP)?',
      answer:
        'Snowplow MCP is a standardized way for Claude Desktop to interact with your Snowplow data pipeline. It enables Claude to help you manage schemas, analyze tracking implementation, and troubleshoot data collection issues directly from your chat interface.',
    },
    {
      question: 'How do I install and configure Snowplow MCP?',
      answer:
        'Install Claude Desktop, then add the Snowplow MCP server to your configuration. You can install it via npm or configure it directly in Claude Desktop. Check our MCP documentation for step-by-step instructions.',
    },
    {
      question: 'What can I do with Snowplow MCP?',
      answer:
        'Query your schemas, validate tracking implementations, analyze event data, generate schema definitions, troubleshoot pipeline issues, and get AI-powered insights into your Snowplow setup - all through natural language conversations with Claude.',
    },
    {
      question: 'Do I need a Snowplow Cloud account to use MCP?',
      answer:
        'No. Snowplow MCP works with both Snowplow Cloud and Open Source deployments. You just need access to your Snowplow infrastructure and the appropriate API credentials or connection details.',
    },
  ]

  return (
    <Layout
      title="Snowplow Documentation"
      description="From Raw Behavior to Intelligent Action - Collect, govern, and activate behavioral data you own"
    >
      <Head>
        <meta name="zd-site-verification" content="fly2zzu1qcv51s1ma9jds" />
        <style>{`
          .navbar { display: none !important; }
          main { margin-top: 0 !important; padding-top: 0 !important; }
          .main-wrapper { margin-top: 0 !important; padding-top: 0 !important; }
        `}</style>
      </Head>

      <div className="min-h-screen bg-white text-gray-900">
        <FloatingNav navItems={navItems} showBadge={true} />

        {/* Hero Section */}
        <section className="relative min-h-screen overflow-hidden">
          {/* Grid Background - Top Layer */}
          <GridBackground
            containerClassName="absolute inset-0 z-15"
            gridSize="72px"
            gridColor="rgba(55, 65, 81, 0.2)"
            darkGridColor="rgba(55, 65, 81, 0.2)"
            maskRadialGradient={true}
          />

          {/* Background Lines - Middle Layer */}
          <BackgroundLines className="absolute inset-0 z-10 pointer-events-none" />

          {/* Gradient Animation - Bottom Layer */}
          <BackgroundGradientAnimation
            gradientBackgroundStart="rgb(255, 255, 255)"
            gradientBackgroundEnd="rgb(240, 240, 255)"
            firstColor="124, 58, 237"
            secondColor="168, 85, 247"
            thirdColor="139, 92, 246"
            fourthColor="99, 102, 241"
            fifthColor="67, 56, 202"
            pointerColor="124, 58, 237"
            size="140%"
            blendingValue="normal"
            interactive={false}
            containerClassName="absolute inset-0 z-5"
          />
          <div className="relative z-20 min-h-screen flex items-center px-10 py-40 lg:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
                Snowplow documentation
              </h1>

              {/* Interactive Search Bar */}
              <div className="max-w-xl mx-auto mb-12">
                <div className="relative">
                  <PlaceholdersAndVanishInput
                    placeholders={[
                      'Search for tracking guides...',
                      'Find API documentation...',
                      'Explore data modeling...',
                      'Look up enrichment configs...',
                      'Search pipeline setup...',
                      'Find troubleshooting guides...',
                    ]}
                    onClick={() => {
                      // Trigger Algolia search modal immediately when clicked
                      const searchButton =
                        document.querySelector('.DocSearch-Button')
                      if (searchButton) {
                        searchButton.click()
                      }
                    }}
                    onFocus={() => {
                      // Also trigger on focus for better UX
                      setTimeout(() => {
                        const searchButton =
                          document.querySelector('.DocSearch-Button')
                        if (searchButton) {
                          searchButton.click()
                        }
                      }, 100)
                    }}
                    onChange={() => {
                      // Optional: could handle text changes here if needed
                    }}
                    onSubmit={(e) => {
                      // Trigger search on submit
                      e.preventDefault()
                      const searchButton =
                        document.querySelector('.DocSearch-Button')
                      if (searchButton) {
                        searchButton.click()
                      }
                    }}
                    className="shadow-lg border-gray-300"
                  />

                  {/* Command+K indicator */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                    <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-200 rounded text-gray-600">
                      ⌘
                    </kbd>
                    <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-200 rounded text-gray-600">
                      K
                    </kbd>
                  </div>
                </div>
              </div>

              {/* Product Tabs */}
              <ProductTabs />
            </div>
          </div>
        </section>
        {/* Get Started Section */}
        <section className="px-6 py-24 bg-card">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-[800] text-center mb-12 text-foreground tracking-tight">
              Accelerate Your Solution
            </h2>

            <SolutionGrid />
          </div>
        </section>
        {/* Footer CTA */}
        <section className="px-6 py-24 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-violet-50 via-fuchsia-50 to-cyan-50 border border-gray-200 rounded-2xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Ready to own your behavioral data?
              </h2>
              <p className="text-gray-600 mb-8">
                Start building with Snowplow today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://snowplow.io/get-started/book-a-demo-of-snowplow-bdp/"
                  className="px-8 py-4 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
                >
                  Book a Demo
                </a>
                <a
                  href="https://community.snowplow.io/"
                  className="px-8 py-4 bg-white border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Join the Community
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
