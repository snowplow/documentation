import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState('cdi');

  const tabs = {
    cdi: {
      title: 'Snowplow CDI',
      icon: '🔷',
      color: 'violet',
      subtitle: 'Governed, AI-ready behavioral data — in your warehouse',
      description: 'Collect event-level data from every touchpoint. Validate against schemas at collection — not after. Deliver to your warehouse, lake, or stream in seconds, with complete ownership.',
      getStarted: {
        href: '/docs/get-started/index.md',
        text: 'Learn about the different Snowplow CDI platforms'
      },
      links: [
        {
          label: 'Event Studio',
          href: '/docs/data-product-studio/index.md',
          description: 'Design and manage your event specifications and data structures'
        },
        {
          label: 'Tracker SDKs',
          href: '/docs/sources/index.md',
          description: 'Collect behavioral data from web, mobile, and server-side applications'
        },
        {
          label: 'Event forwarding',
          href: '/docs/destinations/forwarding-events/index.md',
          description: 'Send your validated events to warehouses, lakes, and streams in real-time'
        },
        {
          label: 'Data modeling',
          href: '/docs/modeling-your-data/index.md',
          description: 'Transform raw events into analytics-ready tables with dbt'
        },
      ],
    },
    signals: {
      title: 'Snowplow Signals',
      icon: '⚡',
      color: 'cyan',
      subtitle: 'Real-time customer intelligence — for AI-powered applications',
      description: 'Access rich user context in 45ms. Combine live in-session behavior with historical data. Trigger personalized interventions at exactly the right moment.',
      getStarted: {
        href: 'https://try-signals.snowplow.io/',
        text: 'Try it out in the Signals Sandbox',
        external: true
      },
      links: [
        {
          label: 'Concepts',
          href: '/docs/signals/concepts/index.md',
          description: 'Understand how real-time customer intelligence works'
        },
        {
          label: 'Define attributes',
          href: '/docs/signals/define-attributes/index.md',
          description: 'Configure user attributes and behavioral signals for your application'
        },
        {
          label: 'Receive interventions',
          href: '/docs/signals/receive-interventions/index.md',
          description: 'Integrate real-time intelligence into your product experience'
        },
      ],
    },
  };

  const currentTab = tabs[activeTab];
  const isViolet = currentTab.color === 'violet';

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200">
          {Object.entries(tabs).map(([key, tab]) => {
            const isActive = activeTab === key;
            const isTabViolet = tab.color === 'violet';

            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 px-6 py-4 text-left font-semibold transition-all duration-200 relative ${
                  isActive
                    ? isTabViolet
                      ? 'text-violet-700 bg-violet-50/50'
                      : 'text-cyan-700 bg-cyan-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.title}</span>
                </span>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute bottom-0 left-0 right-0 h-1 ${
                      isTabViolet ? 'bg-violet-500' : 'bg-cyan-500'
                    }`}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8"
        >
          {/* Tab Description */}
          <div className="mb-8 text-center max-w-3xl mx-auto">
            <h3 className={`text-xl font-semibold mb-2 ${
              isViolet ? 'text-violet-700' : 'text-cyan-700'
            }`}>
              {currentTab.subtitle}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {currentTab.description}
            </p>
          </div>

          {/* Get Started Panel */}
          <a
            href={currentTab.getStarted.href}
            target={currentTab.getStarted.external ? '_blank' : undefined}
            rel={currentTab.getStarted.external ? 'noopener noreferrer' : undefined}
            className={`block mb-6 p-6 rounded-xl border-2 transition-all duration-200 ${
              isViolet
                ? 'bg-violet-50 border-violet-200 hover:border-violet-400 hover:bg-violet-100'
                : 'bg-cyan-50 border-cyan-200 hover:border-cyan-400 hover:bg-cyan-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                <div>
                  <h4 className={`font-semibold text-lg ${
                    isViolet ? 'text-violet-900' : 'text-cyan-900'
                  }`}>
                    Get started
                  </h4>
                  <p className="text-sm text-gray-700">
                    {currentTab.getStarted.text}
                  </p>
                </div>
              </div>
              <svg
                className={`w-6 h-6 ${
                  isViolet ? 'text-violet-600' : 'text-cyan-600'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </a>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentTab.links.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className={`block p-5 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 group ${
                  isViolet
                    ? 'hover:bg-violet-50 hover:border-violet-300 hover:shadow-md'
                    : 'hover:bg-cyan-50 hover:border-cyan-300 hover:shadow-md'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-semibold text-base mb-2 flex items-center gap-2">
                      {link.label}
                      {link.external && (
                        <span className="text-xs text-gray-500">↗</span>
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {link.description}
                    </p>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <motion.svg
                      className={`w-5 h-5 ${
                        isViolet ? 'text-violet-500' : 'text-cyan-500'
                      }`}
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
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductTabs;
