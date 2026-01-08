'use client';

import { motion } from 'framer-motion';

interface DashboardTabsProps {
  activeTab: 'single' | 'compare';
  onTabChange: (tab: 'single' | 'compare') => void;
}

export default function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="flex items-center gap-2 mb-8 border-b border-gray-200">
      <button
        onClick={() => onTabChange('single')}
        className={`relative px-6 py-3 text-sm font-medium transition-colors ${
          activeTab === 'single'
            ? 'text-[#8b7355]'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Single Brand
        {activeTab === 'single' && (
          <motion.div
            layoutId="activeTab"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8b7355]"
            initial={false}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </button>
      <button
        onClick={() => onTabChange('compare')}
        className={`relative px-6 py-3 text-sm font-medium transition-colors ${
          activeTab === 'compare'
            ? 'text-[#8b7355]'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Compare Brands
        {activeTab === 'compare' && (
          <motion.div
            layoutId="activeTab"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8b7355]"
            initial={false}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </button>
    </div>
  );
}




