'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface AIAnalysisProps {
  brandName: string;
  followerData: Array<{ name: string; value: number }>;
  engagementData: Array<{ name: string; value: number }>;
  platforms?: Array<{ platformType: string; followers: number; engagementRate: number }>;
  autoAnalyze?: boolean;
}

export default function AIAnalysis({ 
  brandName, 
  followerData, 
  engagementData,
  platforms = [],
  autoAnalyze = true
}: AIAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  // Auto-analyze when brand or data changes
  useEffect(() => {
    if (autoAnalyze && brandName && (followerData.length > 0 || engagementData.length > 0)) {
      setAnalysis(null); // Clear previous analysis
      generateAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandName, JSON.stringify(followerData), JSON.stringify(engagementData), autoAnalyze]);

  const generateAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis (in production, this would call an AI API)
    setTimeout(() => {
      const totalFollowers = platforms.reduce((sum, p) => sum + (p.followers || 0), 0);
      const avgEngagement = platforms.length > 0
        ? platforms.reduce((sum, p) => sum + (p.engagementRate || 0), 0) / platforms.length
        : 0;

      const followerTrend = followerData.length > 1
        ? followerData[followerData.length - 1].value > followerData[0].value
          ? 'growing'
          : 'declining'
        : 'stable';

      const engagementTrend = engagementData.length > 1
        ? engagementData[engagementData.length - 1].value > engagementData[0].value
          ? 'improving'
          : 'declining'
        : 'stable';

      let analysisSections = [];
      
      // Follower analysis
      if (followerTrend === 'growing') {
        const growthRate = ((followerData[followerData.length - 1].value - followerData[0].value) / followerData[0].value * 100).toFixed(1);
        analysisSections.push(`Follower Growth: ${brandName} demonstrates strong follower growth with a ${growthRate}% increase over the analyzed period. This upward trajectory indicates effective audience acquisition strategies and growing brand awareness.`);
      } else if (followerTrend === 'declining') {
        analysisSections.push(`Follower Growth: The follower count shows a declining trend. We recommend reviewing content strategy, posting frequency, and audience engagement tactics to reverse this trend.`);
      } else {
        analysisSections.push(`Follower Growth: ${brandName} maintains a stable follower base, indicating consistent brand presence and audience retention.`);
      }

      // Engagement analysis
      if (avgEngagement > 4.5) {
        analysisSections.push(`Engagement Performance: ${brandName} achieves an excellent engagement rate of ${avgEngagement.toFixed(1)}%, significantly exceeding the luxury brand industry average of 3.0-3.5%. This high engagement reflects strong audience connection and content resonance.`);
      } else if (avgEngagement > 3.0) {
        analysisSections.push(`Engagement Performance: With an engagement rate of ${avgEngagement.toFixed(1)}%, ${brandName} performs on par with luxury brand standards. The brand maintains healthy audience interaction levels across platforms.`);
      } else {
        analysisSections.push(`Engagement Performance: The current engagement rate of ${avgEngagement.toFixed(1)}% presents an opportunity for improvement. Consider implementing more interactive content formats, user-generated content campaigns, and strategic engagement initiatives to enhance audience participation.`);
      }

      // Platform comparison
      const instagram = platforms.find(p => p.platformType === 'instagram');
      const tiktok = platforms.find(p => p.platformType === 'tiktok');
      
      if (instagram && tiktok) {
        if (tiktok.engagementRate > instagram.engagementRate) {
          analysisSections.push(`Platform Strategy: TikTok demonstrates superior engagement performance (${tiktok!.engagementRate.toFixed(1)}% vs ${instagram!.engagementRate.toFixed(1)}% on Instagram), suggesting strong potential for increased TikTok content investment. Consider reallocating resources to capitalize on this platform's higher engagement potential.`);
        } else if (instagram.engagementRate > tiktok.engagementRate) {
          analysisSections.push(`Platform Strategy: Instagram remains the primary engagement driver with ${(instagram!.followers / 1000000).toFixed(1)}M followers and an engagement rate of ${instagram!.engagementRate.toFixed(1)}%. This platform continues to be the cornerstone of ${brandName}'s social media presence.`);
        } else {
          analysisSections.push(`Platform Strategy: Both Instagram and TikTok show balanced engagement levels, indicating a well-distributed social media strategy. This multi-platform approach maximizes reach and audience diversity.`);
        }
      } else if (instagram) {
        analysisSections.push(`Platform Strategy: Instagram serves as the primary platform with ${(instagram!.followers / 1000000).toFixed(1)}M followers. Consider expanding to additional platforms to diversify audience reach.`);
      } else if (tiktok) {
        analysisSections.push(`Platform Strategy: TikTok is the primary platform with ${(tiktok!.followers / 1000000).toFixed(1)}M followers. Consider expanding to Instagram to reach a broader demographic.`);
      }

      // Overall assessment
      if (totalFollowers > 10000000) {
        analysisSections.push(`Brand Positioning: ${brandName} maintains a substantial social media presence with ${(totalFollowers / 1000000).toFixed(1)}M+ total followers across platforms. This scale reinforces the brand's premium positioning and market leadership in the luxury fashion sector.`);
      } else if (totalFollowers > 5000000) {
        analysisSections.push(`Brand Positioning: ${brandName} has established a significant social media footprint with ${(totalFollowers / 1000000).toFixed(1)}M+ total followers, demonstrating strong brand equity and digital presence in the luxury market.`);
      } else {
        analysisSections.push(`Brand Positioning: ${brandName} is building a solid social media foundation with ${(totalFollowers / 1000000).toFixed(1)}M+ total followers. Continued strategic content development and engagement initiatives will further strengthen brand visibility.`);
      }

      setAnalysis(analysisSections.join('\n\n'));
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-light text-gray-900 mb-1">Performance Analysis</h3>
          <p className="text-xs text-gray-500 font-light">AI-powered insights for {brandName}</p>
        </div>
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#8b7355]"></div>
            <span className="font-light">Analyzing</span>
          </div>
        )}
      </div>

      {isAnalyzing ? (
        <div className="flex items-center gap-3 text-sm text-gray-500 py-8">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#8b7355]"></div>
          <span className="font-light">Analyzing {brandName}'s social media performance...</span>
        </div>
      ) : analysis ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {analysis.split('\n\n').map((section, index) => (
            <div
              key={index}
              className="border-l-2 border-[#8b7355] pl-4 py-2"
            >
              <p className="text-sm text-gray-700 leading-relaxed font-light">
                {section}
              </p>
            </div>
          ))}
        </motion.div>
      ) : (
        <p className="text-sm text-gray-400 italic font-light py-8">
          Analysis will appear automatically when a brand is selected.
        </p>
      )}
    </motion.div>
  );
}

