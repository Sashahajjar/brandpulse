'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrandStore } from '@/stores/brandStore';
import { useUIStore } from '@/stores/uiStore';
import { getBrandInsights } from '@/lib/api';
import BrandCard from './components/BrandCard';
import MetricChart from './components/MetricChart';
import InsightsPanel from './components/InsightsPanel';
import BrandComparison from './components/BrandComparison';
import BrandSelector from './components/BrandSelector';
import ExecutiveSummary from './components/ExecutiveSummary';
import DashboardTabs from './components/DashboardTabs';
import PlatformIcon from '@/components/PlatformIcon';

export default function Dashboard() {
  const { brands, loading, error, fetchBrands } = useBrandStore();
  const { 
    selectedBrands, 
    setSelectedBrands
  } = useUIStore();
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'compare'>('single');
  const [comparisonMetric, setComparisonMetric] = useState<'followers' | 'engagement'>('followers');
  const [comparisonPlatform, setComparisonPlatform] = useState<'instagram' | 'tiktok'>('instagram');

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  useEffect(() => {
    if (selectedBrand) {
      fetchBrandInsights(selectedBrand.id);
    }
  }, [selectedBrand]);

  const [allBrandsInsights, setAllBrandsInsights] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (selectedBrands.length > 1) {
      selectedBrands.forEach(async (brandId) => {
        try {
          const data = await getBrandInsights(brandId);
          setAllBrandsInsights(prev => ({
            ...prev,
            [brandId]: data.data || [],
          }));
        } catch (err) {
          console.error(`Error fetching insights for brand ${brandId}:`, err);
        }
      });
    }
  }, [selectedBrands]);

  const comparisonBrands = useMemo(() => {
    return brands.filter(b => selectedBrands.includes(b.id));
  }, [brands, selectedBrands]);

  useEffect(() => {
    if (activeTab === 'single') {
      if (selectedBrands.length === 1) {
        const brand = brands.find(b => b.id === selectedBrands[0]);
        if (brand) setSelectedBrand(brand);
      }
    } else if (activeTab === 'compare') {
      setSelectedBrand(null);
    }
  }, [activeTab, brands, selectedBrands]);

  const fetchBrandInsights = async (brandId: string) => {
    setInsightsLoading(true);
    try {
      const data = await getBrandInsights(brandId);
      setInsights(data.data || []);
    } catch (err) {
      console.error('Error fetching insights:', err);
      setInsights([]);
    } finally {
      setInsightsLoading(false);
    }
  };

  const instagramPlatform = useMemo(() => {
    return selectedBrand?.platforms?.find((p: any) => p.platformType === 'instagram') || null;
  }, [selectedBrand]);

  const tiktokPlatform = useMemo(() => {
    return selectedBrand?.platforms?.find((p: any) => p.platformType === 'tiktok') || null;
  }, [selectedBrand]);

  const instagramFollowerData = useMemo(() => {
    if (!instagramPlatform) return [];

    const igInsights = insights
      .filter(i => i.metricType === 'growth' && i.metadata?.platform === 'instagram')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const monthlyData = new Map<string, any>();
    igInsights.forEach(insight => {
      const date = new Date(insight.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthlyData.has(monthKey) || new Date(insight.date) > new Date(monthlyData.get(monthKey).date)) {
        monthlyData.set(monthKey, insight);
      }
    });
    
    const uniqueInsights = Array.from(monthlyData.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-3);

    if (uniqueInsights.length > 0) {
      return uniqueInsights.map((insight) => {
        const date = new Date(insight.date);
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        return {
          name: monthName,
          value: insight.value / 1000000,
        };
      });
    }

    return [{
      name: 'Current',
      value: (instagramPlatform.followers || 0) / 1000000,
    }];
  }, [instagramPlatform, insights]);

  const tiktokFollowerData = useMemo(() => {
    if (!tiktokPlatform) return [];

    const ttInsights = insights
      .filter(i => i.metricType === 'growth' && i.metadata?.platform === 'tiktok')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const monthlyData = new Map<string, any>();
    ttInsights.forEach(insight => {
      const date = new Date(insight.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthlyData.has(monthKey) || new Date(insight.date) > new Date(monthlyData.get(monthKey).date)) {
        monthlyData.set(monthKey, insight);
      }
    });
    
    const uniqueInsights = Array.from(monthlyData.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-3);

    if (uniqueInsights.length > 0) {
      return uniqueInsights.map((insight) => {
        const date = new Date(insight.date);
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        return {
          name: monthName,
          value: insight.value / 1000000,
        };
      });
    }

    return [{
      name: 'Current',
      value: (tiktokPlatform.followers || 0) / 1000000,
    }];
  }, [tiktokPlatform, insights]);

  const instagramEngagementData = useMemo(() => {
    if (!instagramPlatform) return [];

    const igInsights = insights
      .filter(i => i.metricType === 'engagement' && i.metadata?.platform === 'instagram')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const monthlyData = new Map<string, any>();
    igInsights.forEach(insight => {
      const date = new Date(insight.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthlyData.has(monthKey) || new Date(insight.date) > new Date(monthlyData.get(monthKey).date)) {
        monthlyData.set(monthKey, insight);
      }
    });
    
    const uniqueInsights = Array.from(monthlyData.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-3);

    if (uniqueInsights.length > 0) {
      return uniqueInsights.map((insight) => {
        const date = new Date(insight.date);
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        return {
          name: monthName,
          value: parseFloat(insight.value.toFixed(2)),
        };
      });
    }

    return [{
      name: 'Current',
      value: parseFloat((instagramPlatform.engagementRate || 0).toFixed(2)),
    }];
  }, [instagramPlatform, insights]);

  const tiktokEngagementData = useMemo(() => {
    if (!tiktokPlatform) return [];

    const ttInsights = insights
      .filter(i => i.metricType === 'engagement' && i.metadata?.platform === 'tiktok')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const monthlyData = new Map<string, any>();
    ttInsights.forEach(insight => {
      const date = new Date(insight.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthlyData.has(monthKey) || new Date(insight.date) > new Date(monthlyData.get(monthKey).date)) {
        monthlyData.set(monthKey, insight);
      }
    });
    
    const uniqueInsights = Array.from(monthlyData.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-3);

    if (uniqueInsights.length > 0) {
      return uniqueInsights.map((insight) => {
        const date = new Date(insight.date);
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        return {
          name: monthName,
          value: parseFloat(insight.value.toFixed(2)),
        };
      });
    }

    return [{
      name: 'Current',
      value: parseFloat((tiktokPlatform.engagementRate || 0).toFixed(2)),
    }];
  }, [tiktokPlatform, insights]);

  const combinedFollowerData = useMemo(() => {
    if (!instagramPlatform && !tiktokPlatform) return [];
    
    return [
      {
        name: 'Instagram',
        value: (instagramPlatform?.followers || 0) / 1000000,
      },
      {
        name: 'TikTok',
        value: (tiktokPlatform?.followers || 0) / 1000000,
      },
    ];
  }, [instagramPlatform, tiktokPlatform]);

  const combinedEngagementData = useMemo(() => {
    if (!instagramPlatform && !tiktokPlatform) return [];
    
    return [
      {
        name: 'Instagram',
        value: parseFloat((instagramPlatform?.engagementRate || 0).toFixed(2)),
      },
      {
        name: 'TikTok',
        value: parseFloat((tiktokPlatform?.engagementRate || 0).toFixed(2)),
      },
    ];
  }, [instagramPlatform, tiktokPlatform]);

  const brandInsights = useMemo(() => {
    if (!selectedBrand) return [];

    const insightsList = [];

    const totalFollowers = selectedBrand.platforms?.reduce((sum: number, p: any) => sum + (p.followers || 0), 0) || 0;
    
    const engagementRates = selectedBrand.platforms?.map((p: any) => p.engagementRate).filter((r: number) => r > 0) || [];
    const avgEngagement = engagementRates.length > 0
      ? engagementRates.reduce((a: number, b: number) => a + b, 0) / engagementRates.length
      : 0;

    const topPlatform = selectedBrand.platforms?.reduce((top: any, p: any) => {
      return (p.followers || 0) > (top.followers || 0) ? p : top;
    }, selectedBrand.platforms?.[0]);

    if (topPlatform) {
      insightsList.push({
        id: '1',
        message: `Top platform: ${topPlatform.platformType}`,
        type: 'positive' as const,
        metric: 'platform',
        change: Math.round((topPlatform.followers / totalFollowers) * 100),
      });
    }

    if (avgEngagement > 4.5) {
      insightsList.push({
        id: '2',
        message: 'Excellent engagement rate',
        type: 'positive' as const,
        metric: 'engagement',
        change: Math.round(avgEngagement * 10) / 10,
      });
    } else if (avgEngagement > 3.0) {
      insightsList.push({
        id: '3',
        message: 'Good engagement rate',
        type: 'neutral' as const,
        metric: 'engagement',
        change: Math.round(avgEngagement * 10) / 10,
      });
    }

    insightsList.push({
      id: '4',
      message: `${(totalFollowers / 1000000).toFixed(1)}M total followers`,
      type: 'neutral' as const,
      metric: 'followers',
      change: Math.round(totalFollowers / 1000000),
    });

    return insightsList;
  }, [selectedBrand]);

  const displayBrands = brands.length > 0 ? brands : [];

  return (
    <div className="min-h-screen bg-gradient-beige">
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-[#f5f1eb] via-[#fafafa] to-[#e8f4f8] -z-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div id="dashboard-report">
          <>
              <AnimatePresence mode="wait">
                <motion.div
                  key="header"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <h1 className="mb-2 text-4xl font-light text-gray-900">Dashboard</h1>
                  <p className="text-gray-600">
                    {activeTab === 'compare'
                      ? 'Compare performance across multiple brands'
                      : 'Analyze individual brand performance'
                    }
                  </p>
                </motion.div>
              </AnimatePresence>

              {loading && (
                <div className="text-center text-gray-600 py-12">Loading brands...</div>
              )}

              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-red-700 mb-8">
                  Error: {error}
                </div>
              )}

              {/* Tab Navigation */}
              {displayBrands.length > 0 && (
                <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
              )}

              {/* Single Brand View */}
              {activeTab === 'single' && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="single-view"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Brands Grid - Always show when no brand selected */}
                    {!selectedBrand && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                      >
                        <div className="mb-8">
                          <h2 className="text-2xl font-light text-gray-900 mb-2">Brand Analytics</h2>
                          <p className="text-gray-600 text-sm">
                            Select a brand below to view detailed performance analytics, engagement metrics, and insights
                          </p>
                        </div>
                        {displayBrands.length > 0 ? (
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {displayBrands.map((brand, index) => (
                              <BrandCard
                                key={brand.id}
                                brand={brand}
                                index={index}
                                onClick={() => {
                                  setSelectedBrand(brand);
                                  setSelectedBrands([brand.id]);
                                }}
                                isSelected={false}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 text-gray-400">
                            <p>No brands available. Sync brands to get started.</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Comparison View */}
              {activeTab === 'compare' && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="compare-view"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Brand Comparison Selector */}
                    {displayBrands.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                      >
                        <h2 className="text-xl font-medium text-gray-900 mb-4">Select Brands to Compare</h2>
                        <BrandSelector
                          brands={displayBrands}
                          selectedBrands={selectedBrands}
                          onSelectionChange={(brandIds) => {
                            setSelectedBrands(brandIds);
                            setSelectedBrand(null);
                          }}
                          maxSelection={3}
                        />
                      </motion.div>
                    )}

                    {/* Comparison Charts */}
                    {selectedBrands.length > 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                      >
                        <div className="mb-6 flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-light text-gray-900 mb-2">Brand Comparison</h2>
                            <p className="text-gray-600 text-sm">
                              Comparing {comparisonBrands.map(b => b.name).join(', ')}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <select
                              value={comparisonPlatform}
                              onChange={(e) => setComparisonPlatform(e.target.value as 'instagram' | 'tiktok')}
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8b7355] bg-white"
                            >
                              <option value="instagram">Instagram</option>
                              <option value="tiktok">TikTok</option>
                            </select>
                            <select
                              value={comparisonMetric}
                              onChange={(e) => setComparisonMetric(e.target.value as 'followers' | 'engagement')}
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8b7355] bg-white"
                            >
                              <option value="followers">Followers</option>
                              <option value="engagement">Engagement Rate</option>
                            </select>
                          </div>
                        </div>

                        <BrandComparison
                          brands={comparisonBrands}
                          metric={comparisonMetric}
                          platform={comparisonPlatform}
                          insightsMap={allBrandsInsights}
                        />

                        <ExecutiveSummary brands={comparisonBrands} />
                      </motion.div>
                    )}

                    {selectedBrands.length <= 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-gray-400"
                      >
                        <p>Select 2-3 brands above to start comparing</p>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Single Brand Analytics - Only show in single tab */}
              {selectedBrand && activeTab === 'single' && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedBrand.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Selected Brand Header */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8 rounded-2xl bg-white p-6 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-medium text-gray-900 capitalize">
                            {selectedBrand.name}
                          </h2>
                          <p className="text-sm text-gray-500 mt-1">
                            {selectedBrand.platforms?.length || 0} platforms tracked • 
                            {selectedBrand.platforms?.reduce((sum: number, p: any) => sum + (p.followers || 0), 0) 
                              ? ` ${(selectedBrand.platforms.reduce((sum: number, p: any) => sum + (p.followers || 0), 0) / 1000000).toFixed(1)}M total followers`
                              : ' No follower data'
                            }
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedBrand(null);
                            setSelectedBrands([]);
                          }}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Clear selection
                        </button>
                      </div>
                    </motion.div>

                    {/* Platform-Specific Analytics */}
                    <div className="mb-12">
                      <div className="mb-6">
                        <h2 className="text-2xl font-light text-gray-900 mb-2">Platform Performance</h2>
                        <p className="text-gray-600 text-sm">
                          Detailed analytics for each platform - Instagram and TikTok
                        </p>
                      </div>

                      {/* Instagram Section */}
                      {instagramPlatform && (
                        <div className="mb-8">
                          <div className="mb-4 flex items-center gap-3">
                            <PlatformIcon platform="instagram" size={32} />
                            <h3 className="text-xl font-medium text-gray-900">Instagram</h3>
                            <span className="text-sm text-gray-500">
                              @{instagramPlatform.username}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <MetricChart
                              data={instagramFollowerData}
                              type="line"
                              title="Instagram Followers"
                              description={`Current: ${(instagramPlatform.followers / 1000000).toFixed(1)}M followers. Historical growth trends.`}
                              yAxisLabel="Followers (Millions)"
                              xAxisLabel="Time Period"
                              valueFormatter={(value) => `${value.toFixed(1)}M`}
                              color="#8b7355"
                            />
                            <MetricChart
                              data={instagramEngagementData}
                              type="bar"
                              title="Instagram Engagement Rate"
                              description={`Current: ${instagramPlatform.engagementRate.toFixed(1)}% engagement rate. Percentage of followers interacting with posts.`}
                              yAxisLabel="Engagement Rate (%)"
                              xAxisLabel="Time Period"
                              valueFormatter={(value) => `${value.toFixed(1)}%`}
                              color="#8b7355"
                            />
                          </div>
                          
                          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-gray-500">Followers</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {(instagramPlatform.followers / 1000000).toFixed(1)}M
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-gray-500">Engagement</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {instagramPlatform.engagementRate.toFixed(1)}%
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-gray-500">Posts/Month</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {instagramPlatform.postingFrequency}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TikTok Section */}
                      {tiktokPlatform && (
                        <div className="mb-8">
                          <div className="mb-4 flex items-center gap-3">
                            <PlatformIcon platform="tiktok" size={32} />
                            <h3 className="text-xl font-medium text-gray-900">TikTok</h3>
                            <span className="text-sm text-gray-500">
                              @{tiktokPlatform.username}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <MetricChart
                              data={tiktokFollowerData}
                              type="line"
                              title="TikTok Followers"
                              description={`Current: ${(tiktokPlatform.followers / 1000000).toFixed(1)}M followers. Historical growth trends.`}
                              yAxisLabel="Followers (Millions)"
                              xAxisLabel="Time Period"
                              valueFormatter={(value) => `${value.toFixed(1)}M`}
                              color="#000000"
                            />
                            <MetricChart
                              data={tiktokEngagementData}
                              type="bar"
                              title="TikTok Engagement Rate"
                              description={`Current: ${tiktokPlatform.engagementRate.toFixed(1)}% engagement rate. Percentage of followers interacting with videos.`}
                              yAxisLabel="Engagement Rate (%)"
                              xAxisLabel="Time Period"
                              valueFormatter={(value) => `${value.toFixed(1)}%`}
                              color="#000000"
                            />
                          </div>
                          
                          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-gray-500">Followers</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {(tiktokPlatform.followers / 1000000).toFixed(1)}M
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-gray-500">Engagement</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {tiktokPlatform.engagementRate.toFixed(1)}%
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-gray-500">Videos/Month</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {tiktokPlatform.postingFrequency}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    {!instagramPlatform && !tiktokPlatform && (
                      <div className="text-center py-8 text-gray-400">
                        No platform data available for this brand
                      </div>
                    )}
                    </div>

                    {/* Platform Comparison */}
                    {(instagramPlatform || tiktokPlatform) && (
                      <div className="mb-12">
                        <div className="mb-6">
                          <h2 className="text-2xl font-light text-gray-900 mb-2">Platform Comparison</h2>
                          <p className="text-gray-600 text-sm">
                            Side-by-side comparison of Instagram vs TikTok performance
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                          <MetricChart
                            data={combinedFollowerData}
                            type="bar"
                            title="Total Followers Comparison"
                            description="Current follower count across both platforms"
                            yAxisLabel="Followers (Millions)"
                            xAxisLabel="Platform"
                            valueFormatter={(value) => `${value.toFixed(1)}M`}
                            color="#8b7355"
                          />
                          <MetricChart
                            data={combinedEngagementData}
                            type="bar"
                            title="Engagement Rate Comparison"
                            description="Which platform has better engagement with the audience"
                            yAxisLabel="Engagement Rate (%)"
                            xAxisLabel="Platform"
                            valueFormatter={(value) => `${value.toFixed(1)}%`}
                            color="#8b7355"
                          />
                        </div>
                      </div>
                    )}

                    {/* Combined Analysis & Insights */}
                    <div className="mb-12">
                      <div className="mb-6">
                        <h2 className="text-2xl font-light text-gray-900 mb-2">Combined Analysis</h2>
                        <p className="text-gray-600 text-sm">
                          Overall performance summary combining insights from both platforms
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                          <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Summary</h3>
                            <div className="space-y-4">
                              {instagramPlatform && (
                                <div className="border-l-4 border-[#8b7355] pl-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">Instagram</span>
                                    <span className="text-sm text-gray-500">
                                      {(instagramPlatform.followers / 1000000).toFixed(1)}M followers
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    Engagement: {instagramPlatform.engagementRate.toFixed(1)}% • 
                                    Posting: {instagramPlatform.postingFrequency} posts/month
                                  </p>
                                </div>
                              )}
                              {tiktokPlatform && (
                                <div className="border-l-4 border-black pl-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">TikTok</span>
                                    <span className="text-sm text-gray-500">
                                      {(tiktokPlatform.followers / 1000000).toFixed(1)}M followers
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    Engagement: {tiktokPlatform.engagementRate.toFixed(1)}% • 
                                    Posting: {tiktokPlatform.postingFrequency} videos/month
                                  </p>
                                </div>
                              )}
                              {instagramPlatform && tiktokPlatform && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <p className="text-sm font-medium text-gray-900 mb-2">Key Insights:</p>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    <li>
                                      • Total reach: {((instagramPlatform.followers + tiktokPlatform.followers) / 1000000).toFixed(1)}M followers
                                    </li>
                                    <li>
                                      • {tiktokPlatform.engagementRate > instagramPlatform.engagementRate ? 'TikTok' : 'Instagram'} has higher engagement ({Math.max(tiktokPlatform.engagementRate, instagramPlatform.engagementRate).toFixed(1)}%)
                                    </li>
                                    <li>
                                      • {instagramPlatform.followers > tiktokPlatform.followers ? 'Instagram' : 'TikTok'} has more followers
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <InsightsPanel insights={brandInsights} />
                      </div>
                    </div>

                    {/* Executive Summary */}
                    <ExecutiveSummary brand={selectedBrand} />
                  </motion.div>
                </AnimatePresence>
              )}

              {displayBrands.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No brands found. Sync some brands to see data!</p>
                  <p className="text-sm text-gray-500">
                    Use: <code className="bg-gray-100 px-2 py-1 rounded">POST /api/brands/sync/:brandName</code>
                  </p>
                </div>
              )}
          </>
        </div>
      </div>
    </div>
  );
}
