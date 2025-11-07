'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Brand } from '@/stores/brandStore';
import BrandLogo from '@/components/BrandLogo';

interface BrandCardProps {
  brand: Brand;
  index: number;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function BrandCard({ brand, index, onClick, isSelected = false }: BrandCardProps) {
  const totalFollowers = brand.platforms?.reduce((sum, p) => sum + p.followers, 0) || 0;
  const platformCount = brand.platforms?.length || 1;
  const totalEngagement = brand.platforms?.reduce((sum, p) => sum + p.engagementRate, 0) || 0;
  const avgEngagement = totalEngagement / platformCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -6, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      whileTap={{ scale: 0.98 }}
      className={`group cursor-pointer rounded-2xl p-6 shadow-sm transition-all ${
        isSelected ? 'bg-gradient-beige border-2 border-[#8b7355] shadow-md' : 'bg-white hover:shadow-xl'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <BrandLogo 
            brandName={brand.name} 
            size={64} 
            logoUrl={brand.logo || undefined}
          />
          <div>
            <h3 className="text-xl font-medium text-gray-900 capitalize">{brand.name}</h3>
            <p className="text-sm text-gray-500">{brand.platforms?.length || 0} platforms</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-500">Total Followers</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {(totalFollowers / 1000000).toFixed(1)}M
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Engagement</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {avgEngagement.toFixed(1)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
}

