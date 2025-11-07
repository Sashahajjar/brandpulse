'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brand } from '@/stores/brandStore';

interface BrandComparisonProps {
  brands: Brand[];
  metric: 'followers' | 'engagement';
  platform: 'instagram' | 'tiktok';
  insightsMap?: Record<string, any[]>; // Map of brandId to insights
}

export default function BrandComparison({ brands, metric, platform, insightsMap = {} }: BrandComparisonProps) {
  const chartData = useMemo(() => {
    if (brands.length === 0) return [];

    // Get all unique months from all brands
    const allMonths = new Set<string>();
    const brandDataMap = new Map<string, Map<string, number>>();

    brands.forEach(brand => {
      const platformData = brand.platforms?.find(p => p.platformType === platform);
      if (!platformData) return;

      // Use insights from insightsMap if available, otherwise fall back to brand.insights
      const brandInsights = insightsMap[brand.id] || brand.insights || [];
      const relevantInsights = brandInsights.filter((i: any) => {
        const isPlatformMatch = i.metadata?.platform === platform;
        const isMetricMatch = metric === 'followers' 
          ? i.metricType === 'growth'
          : i.metricType === 'engagement';
        return isPlatformMatch && isMetricMatch;
      });

      const monthlyData = new Map<string, number>();
      relevantInsights.forEach(insight => {
        const date = new Date(insight.date);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        allMonths.add(monthKey);
        
        const value = metric === 'followers' 
          ? insight.value / 1000000 // Convert to millions
          : parseFloat(insight.value.toFixed(2));
        
        monthlyData.set(monthKey, value);
      });

      // Fallback to current platform value if no insights
      if (monthlyData.size === 0) {
        const currentValue = metric === 'followers'
          ? (platformData.followers || 0) / 1000000
          : parseFloat((platformData.engagementRate || 0).toFixed(2));
        const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        allMonths.add(currentMonth);
        monthlyData.set(currentMonth, currentValue);
      }

      brandDataMap.set(brand.id, monthlyData);
    });

    // Create chart data structure
    const sortedMonths = Array.from(allMonths).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    return sortedMonths.map(month => {
      const dataPoint: any = { month };
      brands.forEach(brand => {
        const brandData = brandDataMap.get(brand.id);
        const value = brandData?.get(month);
        if (value !== undefined) {
          dataPoint[brand.name] = value;
        }
      });
      return dataPoint;
    });
  }, [brands, metric, platform]);

  const colors = ['#8b7355', '#CBB26A', '#E3D7C5', '#6B5B73', '#9B8B7A'];

  if (brands.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        Select brands to compare
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-white p-6 shadow-sm"
    >
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {platform.charAt(0).toUpperCase() + platform.slice(1)} {metric === 'followers' ? 'Followers' : 'Engagement Rate'} Comparison
        </h3>
        <p className="text-sm text-gray-500">
          Comparing {brands.map(b => b.name).join(', ')}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#9ca3af" 
            fontSize={12}
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={12}
            label={{ 
              value: metric === 'followers' ? 'Followers (Millions)' : 'Engagement Rate (%)', 
              angle: -90, 
              position: 'insideLeft',
              fill: '#6b7280'
            }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          {brands.map((brand, index) => (
            <Line
              key={brand.id}
              type="monotone"
              dataKey={brand.name}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

