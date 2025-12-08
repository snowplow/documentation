import React, { useState } from 'react';
import Layout from '@theme/Layout'
import Head from '@docusaurus/Head'

// Path Card Component
const PathCard = ({ title, subtitle, description, forText, builds, ctaText, ctaLink, icon, variant }) => {
  const isSignals = variant === 'signals';

  return (
    <div className={`relative group cursor-pointer transition-all duration-300 hover:-translate-y-2 ${
      isSignals ? 'hover:shadow-cyan-500/20' : 'hover:shadow-violet-500/20'
    } hover:shadow-xl`}>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 h-full">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
          isSignals ? 'bg-cyan-500/10' : 'bg-violet-500/10'
        }`}>
          <span className="text-2xl">{icon}</span>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className={`text-sm font-medium mb-4 ${isSignals ? 'text-cyan-400' : 'text-violet-400'}`}>
          {subtitle}
        </p>
        <p className="text-slate-400 mb-6 leading-relaxed">{description}</p>

        {/* For text */}
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Built for</p>
        <p className="text-sm text-slate-400 mb-6">{forText}</p>

        {/* Builds list */}
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">You'll build</p>
        <ul className="space-y-2 mb-8">
          {builds.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
              <span className={`w-1.5 h-1.5 rounded-full ${isSignals ? 'bg-cyan-400' : 'bg-violet-400'}`} />
              {item}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href={ctaLink}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
            isSignals
              ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900'
              : 'bg-violet-500/10 text-violet-400 hover:bg-violet-500 hover:text-white'
          }`}
        >
          {ctaText}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

// FAQ Accordion Item
const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-slate-800 last:border-0">
    <button
      onClick={onClick}
      className="w-full py-5 flex items-center justify-between text-left"
    >
      <span className="text-base text-slate-200 hover:text-white transition-colors pr-8">
        {question}
      </span>
      <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center transition-transform duration-300 ${
        isOpen ? 'rotate-180 bg-violet-600' : ''
      }`}>
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${
      isOpen ? 'max-h-96 pb-5' : 'max-h-0'
    }`}>
      <p className="text-slate-400 leading-relaxed">{answer}</p>
    </div>
  </div>
);

// Main Landing Page
export default function SnowplowDocsLanding() {
  const [openFAQ, setOpenFAQ] = useState(null);

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
      </Head>

      <div className="min-h-screen bg-slate-950 text-white">

        {/* Hero Section */}
        <section className="px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <span className="text-sm text-violet-300">Snowplow Documentation</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">From Raw Behavior</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
                to Intelligent Action
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Collect, govern, and activate behavioral data you own — for analytics in your warehouse or real-time intelligence in your applications.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#paths"
                className="px-8 py-4 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-white transition-colors"
              >
                Build Your Data Foundation →
              </a>
              <a
                href="#paths"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold text-white transition-colors"
              >
                Power Real-Time Applications ⚡
              </a>
            </div>
          </div>
        </section>

        {/* Two Paths Section */}
        <section id="paths" className="px-6 py-24">
          <div className="max-w-5xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Two Products. One Foundation.
              </h2>
              <p className="text-slate-400">
                Your journey depends on what you're building.
              </p>
            </div>

            {/* Path Cards */}
            <div className="grid md:grid-cols-2 gap-8">
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
              />
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
              />
            </div>
          </div>
        </section>

        {/* Better Together Section */}
        <section className="px-6 py-24">
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                They Work Together
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto mb-8">
                CDI captures and governs your data. Signals serves it to your applications in real-time. Use one or both — they share the same foundation.
              </p>

              {/* Flow diagram */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
                  <span className="text-xl">📱</span>
                  <span className="text-sm text-slate-300">Sources</span>
                </div>

                <span className="text-slate-600">→</span>

                <div className="flex items-center gap-2 px-4 py-2 bg-violet-500/20 border border-violet-500/30 rounded-lg">
                  <span className="text-xl">🔷</span>
                  <span className="text-sm text-violet-300 font-medium">CDI</span>
                </div>

                <span className="text-slate-600">→</span>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
                    <span className="text-lg">🏢</span>
                    <span className="text-xs text-slate-400">Warehouse</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
                    <span className="text-lg">⚡</span>
                    <span className="text-xs text-cyan-300">Signals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Get Started Section */}
        <section className="px-6 py-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Start Here
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <a
                href="/docs/fundamentals/"
                className="group p-6 bg-slate-900 border border-slate-800 rounded-xl transition-all hover:border-violet-500/50 hover:-translate-y-1"
              >
                <span className="text-3xl mb-4 block">📘</span>
                <h3 className="text-lg font-semibold text-white mb-2">New to Snowplow?</h3>
                <span className="text-sm text-violet-400 group-hover:text-violet-300">
                  Read the Fundamentals →
                </span>
              </a>

              <a
                href="/docs/get-started/"
                className="group p-6 bg-slate-900 border border-slate-800 rounded-xl transition-all hover:border-fuchsia-500/50 hover:-translate-y-1"
              >
                <span className="text-3xl mb-4 block">🔧</span>
                <h3 className="text-lg font-semibold text-white mb-2">Ready to Implement?</h3>
                <span className="text-sm text-fuchsia-400 group-hover:text-fuchsia-300">
                  First Steps →
                </span>
              </a>

              <a
                href="https://try-signals.snowplow.io/"
                className="group p-6 bg-slate-900 border border-slate-800 rounded-xl transition-all hover:border-cyan-500/50 hover:-translate-y-1"
              >
                <span className="text-3xl mb-4 block">⚡</span>
                <h3 className="text-lg font-semibold text-white mb-2">Try Signals Sandbox</h3>
                <span className="text-sm text-cyan-400 group-hover:text-cyan-300">
                  Launch Sandbox →
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="px-6 py-16 border-t border-b border-slate-800">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-6">
              Powering behavioral data at scale
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-slate-600">
              {['Strava', 'HelloFresh', 'Burberry', 'Supercell', 'Auto Trader', 'DPG Media', '1Password'].map((brand) => (
                <span key={brand} className="text-base font-medium">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 py-24">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Common Questions
            </h2>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
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
                className="text-sm text-violet-400 hover:text-violet-300"
              >
                See full comparisons →
              </a>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="px-6 py-24">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-cyan-600/10 border border-slate-800 rounded-2xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to own your behavioral data?
              </h2>
              <p className="text-slate-400 mb-8">
                Start building with Snowplow today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://snowplow.io/get-started/book-a-demo-of-snowplow-bdp/"
                  className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
                >
                  Book a Demo
                </a>
                <a
                  href="https://community.snowplow.io/"
                  className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-xl font-semibold text-white hover:bg-slate-700 transition-colors"
                >
                  Join the Community
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t border-slate-800">
          <div className="max-w-3xl mx-auto text-center text-sm text-slate-500">
            <p>© 2025 Snowplow Analytics Ltd. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Layout>
  );
}