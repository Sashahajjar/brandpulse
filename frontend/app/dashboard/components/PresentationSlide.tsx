'use client';

import { motion } from 'framer-motion';
import { Brand } from '@/stores/brandStore';
import BrandLogo from '@/components/BrandLogo';
import MetricChart from './MetricChart';

interface PresentationSlideProps {
  brand: Brand;
  index: number;
  isActive: boolean;
  insights?: any[]; // Optional insights data
}

export default function PresentationSlide({ brand, index, isActive, insights = [] }: PresentationSlideProps) {
  if (!isActive) return null;

  const platforms = brand.platforms || [];
  const instagramPlatform = platforms.find(p => p.platformType === 'instagram');
  const tiktokPlatform = platforms.find(p => p.platformType === 'tiktok');
  const totalFollowers = platforms.reduce((sum, p) => sum + (p.followers || 0), 0);
  const avgEngagement = platforms.length > 0
    ? platforms.reduce((sum, p) => sum + (p.engagementRate || 0), 0) / platforms.length
    : 0;

  // Prepare chart data (simplified for presentation)
  const followerData = instagramPlatform ? [{
    name: 'Current',
    value: (instagramPlatform.followers || 0) / 1000000,
  }] : [];

  const engagementData = instagramPlatform ? [{
    name: 'Current',
    value: parseFloat((instagramPlatform.engagementRate || 0).toFixed(2)),
  }] : [];

  return (
    <motion.div
      key={brand.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="w-full h-screen flex flex-col items-center justify-center px-12"
    >
      <div className="max-w-6xl w-full">
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <BrandLogo brandName={brand.name} size={120} logoUrl={brand.logo || undefined} />
          <h1 className="text-6xl font-light text-gray-900 mt-6 capitalize">
            {brand.name}
          </h1>
          <p className="text-xl text-gray-600 mt-4">
            Social Media Performance Analysis
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-8 mb-12"
        >
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Total Followers</p>
            <p className="text-4xl font-light text-gray-900">
              {(totalFollowers / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Avg Engagement</p>
            <p className="text-4xl font-light text-gray-900">
              {avgEngagement.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Platforms</p>
            <p className="text-4xl font-light text-gray-900">
              {brand.platforms?.length || 0}
            </p>
          </div>
        </motion.div>

        {/* Charts */}
        {instagramPlatform && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 gap-8"
          >
            <MetricChart
              data={followerData}
              type="line"
              title="Instagram Followers"
              description={`${(instagramPlatform.followers / 1000000).toFixed(1)}M followers`}
              yAxisLabel="Followers (Millions)"
              xAxisLabel="Time Period"
              valueFormatter={(value) => `${value.toFixed(1)}M`}
              color="#8b7355"
            />
            <MetricChart
              data={engagementData}
              type="bar"
              title="Engagement Rate"
              description={`${instagramPlatform.engagementRate.toFixed(1)}% engagement`}
              yAxisLabel="Engagement Rate (%)"
              xAxisLabel="Time Period"
              valueFormatter={(value) => `${value.toFixed(1)}%`}
              color="#8b7355"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

