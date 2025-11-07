'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      title: 'Single Brand Analytics',
      description: 'Deep dive into individual brand performance with detailed metrics, historical trends, and platform-specific insights.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: 'Brand Comparison',
      description: 'Compare up to 3 brands side-by-side to identify competitive advantages and market positioning.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Executive Summaries',
      description: 'Professional consulting-grade insights with actionable recommendations and strategic analysis.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Platform Performance',
      description: 'Track Instagram and TikTok metrics including followers, engagement rates, and posting frequency.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-beige">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-6 text-5xl md:text-7xl font-light tracking-tight text-gray-900"
          >
            Brand<span className="font-normal">Pulse</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-4 text-xl md:text-2xl text-gray-700 font-light"
          >
            Luxury Brand Social Media Analytics
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-12 max-w-2xl mx-auto text-gray-600 text-base md:text-lg"
          >
            A consulting-grade dashboard for analyzing and comparing luxury fashion brands' 
            social media performance across Instagram and TikTok. Transform data into 
            actionable insights with professional visualizations and executive summaries.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-full bg-[#8b7355] px-8 py-4 text-white transition-all hover:scale-105 hover:shadow-lg hover:bg-[#9b8365]"
            >
              <span className="font-medium">Explore Dashboard</span>
              <svg 
                className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-32 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-sm border border-gray-200/50 hover:shadow-lg transition-all"
            >
              <div className="mb-4 text-[#8b7355]">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-xl font-medium text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Key Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-32 text-center"
        >
          <h2 className="mb-12 text-3xl font-light text-gray-900">Why BrandPulse?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2 text-center">
              <div className="text-3xl font-light text-[#8b7355] mb-2">Real-time Data</div>
              <p className="text-gray-600 text-sm">
                Live social media metrics updated daily from Instagram and TikTok platforms
              </p>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-3xl font-light text-[#8b7355] mb-2">Professional Insights</div>
              <p className="text-gray-600 text-sm">
                Consulting-grade analysis with executive summaries and strategic recommendations
          </p>
        </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-32 text-center"
        >
          <div className="rounded-3xl bg-gradient-to-br from-[#8b7355]/10 to-[#f5f1eb] p-12 border border-[#8b7355]/20">
            <h2 className="mb-4 text-3xl font-light text-gray-900">Ready to Get Started?</h2>
            <p className="mb-8 text-gray-600 max-w-xl mx-auto">
              Explore the dashboard to see how BrandPulse can transform your brand analytics workflow
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-[#8b7355] px-10 py-4 text-white transition-all hover:scale-105 hover:shadow-lg hover:bg-[#9b8365] font-medium"
            >
              <span>Launch Dashboard</span>
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </motion.div>
        </div>
    </div>
  );
}
