import React, { useState, useRef, useEffect } from 'react';
import Layout from '@theme/Layout'
import Head from '@docusaurus/Head'
import { motion, useInView } from 'framer-motion';
import { PlaceholdersAndVanishInput } from '../components/ui/placeholders-and-vanish-input';
import { FloatingNav } from '../components/ui/floating-navbar';
import { BackgroundGradientAnimation } from '../components/ui/background-gradient-animation';
import { GridBackground } from '../components/ui/grid-background';
import { BackgroundLines } from '../components/ui/background-lines';
import LogoCloudDemo from '../components/ui/infinite-logo-slider';

// Fixed JSX syntax issues

// Path Card Component
const PathCard = ({ title, subtitle, description, forText, builds, ctaText, ctaLink, icon, variant, shouldAnimate = false }) => {
  const isSignals = variant === 'signals';

  return (
    <div className={`relative group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
      isSignals ? 'hover:shadow-cyan-500/20' : 'hover:shadow-violet-500/20'
    }`}>
      <div className="bg-white border border-gray-200 rounded-2xl p-8 h-full shadow-sm">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
          isSignals ? 'bg-cyan-50 border border-cyan-100' : 'bg-violet-50 border border-violet-100'
        }`}>
          <span className="text-2xl">{icon}</span>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className={`text-sm font-medium mb-4 ${isSignals ? 'text-cyan-600' : 'text-violet-600'}`}>
          {subtitle}
        </p>
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

        {/* For text */}
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Built for</p>
        <p className="text-sm text-gray-600 mb-6">{forText}</p>

        {/* Builds list */}
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">You'll build</p>
        <ul className="space-y-2 mb-8">
          {builds.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
              <span className={`w-1.5 h-1.5 rounded-full ${isSignals ? 'bg-cyan-500' : 'bg-violet-500'}`} />
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
          animate={shouldAnimate ?
            { y: [20, 0] } :
            { y: 0 }
          }
          transition={{
            duration: shouldAnimate ? 0.5 : 0,
            delay: shouldAnimate ? 0.3 : 0
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </motion.svg>
        </motion.a>
      </div>
    </div>
  );
};

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
      <span className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-transform duration-300 ${
        isOpen ? 'rotate-180 bg-accent-foreground border-accent text-accent-foreground' : 'bg-muted border-border text-muted-foreground'
      }`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${
      isOpen ? 'max-h-96 pb-5' : 'max-h-0'
    }`}>
      <p className="text-muted-foreground leading-relaxed">{answer}</p>
    </div>
  </div>
);

// Main Landing Page
export default function SnowplowDocsLanding() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [hasScrolledToSection, setHasScrolledToSection] = useState(false);
  const pathsRef = useRef(null);
  const isInView = useInView(pathsRef, { threshold: 0.2 });

  const scrollToSection = (sectionId) => {
    console.log('Button clicked - starting scroll');

    const element = document.getElementById(sectionId);
    if (element) {
      // Start the scroll immediately
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // After scroll completes, trigger animation
      setTimeout(() => {
        console.log('Triggering animation');
        setShouldAnimate(true);
      }, 800);
    }
  };

  // Effect to detect natural scrolling to section
  useEffect(() => {
    const handleScroll = () => {
      if (isInView && !hasScrolledToSection && !shouldAnimate) {
        const pathsElement = document.getElementById('paths');
        if (pathsElement) {
          const rect = pathsElement.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= 0) {
            console.log('Natural scroll detected - triggering animation');
            setShouldAnimate(true);
            setHasScrolledToSection(true);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInView, hasScrolledToSection, shouldAnimate]);

  const navItems = [
    {
      name: "Get Started",
      link: "#paths",
      icon: <span>🚀</span>,
      onClick: () => scrollToSection('paths')
    },
    {
      name: "Tutorials",
      link: "/docs/tutorials/",
      icon: <span>📖</span>,
    },
  ];

  const faqs = [
    {
      question: "How is Snowplow different from Google Analytics or Adobe?",
      answer: "You own everything — your cloud, your warehouse, your schemas. Data lands in seconds (not hours), with 130+ properties out of the box. No sampling, no black boxes, no vendor lock-in."
    },
    {
      question: "How is Snowplow different from CDPs like Segment?",
      answer: "Schema validation happens at collection, not as a paid add-on. Data syncs in seconds, not 15+ minutes. And you control the pipeline end-to-end — it runs in your infrastructure."
    },
    {
      question: "Do I need both CDI and Signals?",
      answer: "No. Use CDI alone if your focus is analytics and BI. Add Signals when you need sub-second personalization or real-time context for AI agents."
    },
    {
      question: "Can Snowplow replace my current analytics stack?",
      answer: "Yes. Teams use Snowplow to replace GA4, Segment, or homegrown pipelines — or to complement them with richer, governed data."
    }
  ];

  return (
    <Layout
      title="Snowplow Documentation"
      description="From Raw Behavior to Intelligent Action - Collect, govern, and activate behavioral data you own"
    >
      <Head>
        <meta name='zd-site-verification' content='fly2zzu1qcv51s1ma9jds' />
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
           



            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-[800] mb-16 leading-tight">
              From Raw Behavior Data

              to AI powered Fuel

            </h1>

            {/* Interactive Search Bar */}
            <div className="max-w-xl mx-auto mb-10">
              <div className="relative">
                <PlaceholdersAndVanishInput
                  placeholders={[
                    "Search for tracking guides...",
                    "Find API documentation...",
                    "Explore data modeling...",
                    "Look up enrichment configs...",
                    "Search pipeline setup...",
                    "Find troubleshooting guides...",
                  ]}
                  onClick={() => {
                    // Trigger Algolia search modal immediately when clicked
                    const searchButton = document.querySelector('.DocSearch-Button');
                    if (searchButton) {
                      searchButton.click();
                    }
                  }}
                  onFocus={() => {
                    // Also trigger on focus for better UX
                    setTimeout(() => {
                      const searchButton = document.querySelector('.DocSearch-Button');
                      if (searchButton) {
                        searchButton.click();
                      }
                    }, 100);
                  }}
                  onChange={() => {
                    // Optional: could handle text changes here if needed
                  }}
                  onSubmit={(e) => {
                    // Trigger search on submit
                    e.preventDefault();
                    const searchButton = document.querySelector('.DocSearch-Button');
                    if (searchButton) {
                      searchButton.click();
                    }
                  }}
                  className="shadow-lg border-gray-300"
                />

                {/* Command+K indicator */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                  <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-200 rounded text-gray-600">⌘</kbd>
                  <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-200 rounded text-gray-600">K</kbd>
                </div>
              </div>
            </div>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            We are the leader in customer data infrastructure (CDI)—including advanced analytics, real-time personalization engines, and AI agents.
            </p>

            </div>
          </div>
        </section>

                {/* Trust Strip */}
                <LogoCloudDemo />

        {/* Two Paths Section */}
        <section ref={pathsRef} id="paths" className="px-6 py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            {/* Section header */}
            <motion.div
              className="text-center mb-16"
              animate={shouldAnimate ?
                { y: [30, 0] } :
                { y: 0 }
              }
              transition={{
                duration: shouldAnimate ? 0.6 : 0,
                delay: shouldAnimate ? 0.2 : 0,
                ease: "easeOut"
              }}
              onAnimationStart={() => shouldAnimate && console.log('Header animation started')}
              onAnimationComplete={() => shouldAnimate && console.log('Header animation completed')}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
                animate={shouldAnimate ?
                  { y: [20, 0] } :
                  { y: 0 }
                }
                transition={{
                  duration: shouldAnimate ? 0.6 : 0,
                  delay: shouldAnimate ? 0.4 : 0,
                  ease: "easeOut"
                }}
              >
                Two Products. One Foundation.
              </motion.h2>
              <motion.p
                className="text-gray-600"
                animate={shouldAnimate ?
                  { y: [20, 0] } :
                  { y: 0 }
                }
                transition={{
                  duration: shouldAnimate ? 0.6 : 0,
                  delay: shouldAnimate ? 0.6 : 0,
                  ease: "easeOut"
                }}
              >
                Your journey depends on what you're building.
              </motion.p>
            </motion.div>

            {/* Path Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                animate={shouldAnimate ?
                  { y: [40, 0], scale: [0.95, 1] } :
                  { y: 0, scale: 1 }
                }
                transition={{
                  duration: shouldAnimate ? 0.8 : 0,
                  delay: shouldAnimate ? 0.8 : 0,
                  ease: "easeOut"
                }}
              >
                <PathCard
                  title="Snowplow CDI"
                  subtitle="Governed, AI-ready behavioral data — in your warehouse"
                  description="Collect event-level data from every touchpoint. Validate against schemas at collection — not after. Deliver to your warehouse, lake, or stream in seconds, with complete ownership."
                  forText="Data Engineers · Analytics Engineers · Platform Teams"
                  builds={[
                    "Composable analytics & BI",
                    "Customer 360 & journey analytics",
                    "Attribution modeling",
                    "ML feature pipelines"
                  ]}
                  ctaText="Explore CDI Docs"
                  ctaLink="/docs/get-started/"
                  icon="🔷"
                  variant="cdi"
                  shouldAnimate={shouldAnimate}
                />
              </motion.div>
              <motion.div
                animate={shouldAnimate ?
                  { y: [40, 0], scale: [0.95, 1] } :
                  { y: 0, scale: 1 }
                }
                transition={{
                  duration: shouldAnimate ? 0.8 : 0,
                  delay: shouldAnimate ? 1.0 : 0,
                  ease: "easeOut"
                }}
              >
                <PathCard
                  title="Snowplow Signals"
                  subtitle="Real-time customer intelligence — for AI-powered applications"
                  description="Access rich user context in 45ms. Combine live in-session behavior with historical data. Trigger personalized interventions at exactly the right moment."
                  forText="Product Engineers · Software Developers · ML/AI Teams"
                  builds={[
                    "In-session personalization",
                    "AI agents with customer context",
                    "Recommendation engines",
                    "Dynamic pricing & proactive nudges"
                  ]}
                  ctaText="Explore Signals Docs"
                  ctaLink="/docs/signals/"
                  icon="⚡"
                  variant="signals"
                  shouldAnimate={shouldAnimate}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Better Together Section */}
        <section className="px-6 py-24 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-violet-50 to-cyan-50 border border-gray-200 rounded-2xl p-10 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                They Work Together
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto mb-8">
                CDI captures and governs your data. Signals serves it to your applications in real-time. Use one or both — they share the same foundation.
              </p>

              {/* Flow diagram */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <span className="text-xl">📱</span>
                  <span className="text-sm text-gray-700">Sources</span>
                </div>

                <span className="text-gray-400">→</span>

                <div className="flex items-center gap-2 px-4 py-2 bg-violet-100 border border-violet-200 rounded-lg">
                  <span className="text-xl">🔷</span>
                  <span className="text-sm text-violet-700 font-medium">CDI</span>
                </div>

                <span className="text-gray-400">→</span>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <span className="text-lg">🏢</span>
                    <span className="text-xs text-gray-600">Warehouse</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-cyan-100 border border-cyan-200 rounded-lg">
                    <span className="text-lg">⚡</span>
                    <span className="text-xs text-cyan-700">Signals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Get Started Section */}
        <section className="px-6 py-24 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
              Start Here
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <a
                href="/docs/fundamentals/"
                className="group p-6 bg-white border border-gray-200 rounded-xl transition-all hover:border-violet-300 hover:-translate-y-1 shadow-sm"
              >
                <span className="text-3xl mb-4 block">📘</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">New to Snowplow?</h3>
                <span className="text-sm text-violet-600 group-hover:text-violet-700">
                  Read the Fundamentals →
                </span>
              </a>

              <a
                href="/docs/get-started/"
                className="group p-6 bg-white border border-gray-200 rounded-xl transition-all hover:border-fuchsia-300 hover:-translate-y-1 shadow-sm"
              >
                <span className="text-3xl mb-4 block">🔧</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Implement?</h3>
                <span className="text-sm text-fuchsia-600 group-hover:text-fuchsia-700">
                  First Steps →
                </span>
              </a>

              <a
                href="https://try-signals.snowplow.io/"
                className="group p-6 bg-white border border-gray-200 rounded-xl transition-all hover:border-cyan-300 hover:-translate-y-1 shadow-sm"
              >
                <span className="text-3xl mb-4 block">⚡</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Try Signals Sandbox</h3>
                <span className="text-sm text-cyan-600 group-hover:text-cyan-700">
                  Launch Sandbox →
                </span>
              </a>
            </div>
          </div>
        </section>



        {/* FAQ Section */}
        <section className="px-6 py-24 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
              Common Questions
            </h2>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === i}
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                />
              ))}
            </div>

            <div className="text-center mt-8">
              <a
                href="https://snowplow.io/compare"
                className="text-sm text-violet-600 hover:text-violet-700"
              >
                See full comparisons →
              </a>
            </div>
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
  );
}