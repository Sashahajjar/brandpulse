'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brand } from '@/stores/brandStore';

interface ExecutiveSummaryProps {
  brand?: Brand | null;
  brands?: Brand[]; // For comparison mode
}

export default function ExecutiveSummary({ brand, brands }: ExecutiveSummaryProps) {
  const summary = useMemo(() => {
    if (brands && brands.length > 1) {
      // Comparison summary
      return generateComparisonSummary(brands);
    } else if (brand) {
      // Single brand summary
      return generateBrandSummary(brand);
    }
    return null;
  }, [brand, brands]);

  if (!summary) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-sm border-l-4 border-[#8b7355] px-6 py-5 rounded-lg mt-6"
    >
      <h3 className="font-semibold text-[#8b7355] mb-4 text-lg">Executive Summary</h3>
      <div className="space-y-4 text-sm leading-relaxed text-gray-700">
        {summary.sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <h4 className="font-medium text-gray-900 mb-1">{section.title}</h4>
            <p className="text-gray-600">{section.content}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function generateBrandSummary(brand: Brand) {
  const platforms = brand.platforms || [];
  const instagram = platforms.find(p => p.platformType === 'instagram');
  const tiktok = platforms.find(p => p.platformType === 'tiktok');
  
  const totalFollowers = platforms.reduce((sum, p) => sum + (p.followers || 0), 0);
  const avgEngagement = platforms.length > 0
    ? platforms.reduce((sum, p) => sum + (p.engagementRate || 0), 0) / platforms.length
    : 0;

  const sections = [];

  // Growth Overview
  if (instagram && tiktok) {
    const totalM = (totalFollowers / 1000000).toFixed(1);
    sections.push({
      title: 'Growth Overview',
      content: `${brand.name} maintains a strong social media presence with ${totalM}M total followers across Instagram and TikTok. The brand demonstrates balanced growth across both platforms, with Instagram leading in absolute follower count (${(instagram.followers / 1000000).toFixed(1)}M) while TikTok shows higher engagement potential (${tiktok.engagementRate.toFixed(1)}% vs ${instagram.engagementRate.toFixed(1)}%).`,
    });
  } else if (instagram) {
    sections.push({
      title: 'Growth Overview',
      content: `${brand.name} has established a significant presence on Instagram with ${(instagram.followers / 1000000).toFixed(1)}M followers. The platform serves as the primary channel for audience engagement and brand communication.`,
    });
  }

  // Engagement Performance
  if (avgEngagement > 4.5) {
    sections.push({
      title: 'Engagement Performance',
      content: `The brand achieves exceptional engagement rates (${avgEngagement.toFixed(1)}% average), significantly exceeding luxury industry benchmarks. This high engagement indicates strong audience connection and content resonance, positioning ${brand.name} as a leader in digital engagement within the luxury fashion sector.`,
    });
  } else if (avgEngagement > 3.0) {
    sections.push({
      title: 'Engagement Performance',
      content: `With an average engagement rate of ${avgEngagement.toFixed(1)}%, ${brand.name} performs on par with luxury brand standards. The brand maintains healthy audience interaction levels, suggesting effective content strategy and community management.`,
    });
  } else {
    sections.push({
      title: 'Engagement Performance',
      content: `The current engagement rate of ${avgEngagement.toFixed(1)}% presents opportunities for improvement. Consider implementing more interactive content formats, user-generated content campaigns, and strategic engagement initiatives to enhance audience participation.`,
    });
  }

  // Platform Comparison
  if (instagram && tiktok) {
    if (tiktok.engagementRate > instagram.engagementRate) {
      sections.push({
        title: 'Platform Strategy',
        content: `TikTok demonstrates superior engagement performance (${tiktok.engagementRate.toFixed(1)}% vs ${instagram.engagementRate.toFixed(1)}% on Instagram), suggesting strong potential for increased TikTok content investment. The platform's higher engagement rate indicates a more receptive audience and potential for viral content amplification.`,
      });
    } else {
      sections.push({
        title: 'Platform Strategy',
        content: `Instagram remains the primary engagement driver with ${(instagram.followers / 1000000).toFixed(1)}M followers and an engagement rate of ${instagram.engagementRate.toFixed(1)}%. This platform continues to be the cornerstone of ${brand.name}'s social media presence, offering a mature audience and established content ecosystem.`,
      });
    }
  }

  // Next Actions
  const recommendations = [];
  if (avgEngagement < 3.5) {
    recommendations.push('enhance content interactivity and engagement tactics');
  }
  if (tiktok && tiktok.engagementRate > instagram?.engagementRate) {
    recommendations.push('increase TikTok content investment');
  }
  if (instagram && !tiktok) {
    recommendations.push('consider expanding to TikTok to reach a younger demographic');
  }

  if (recommendations.length > 0) {
    sections.push({
      title: 'Recommended Actions',
      content: `To further strengthen ${brand.name}'s social media performance, we recommend: ${recommendations.join(', ')}. These strategic initiatives will help optimize audience engagement and expand brand reach across key platforms.`,
    });
  }

  return { sections };
}

function generateComparisonSummary(brands: Brand[]) {
  const sections = [];

  // Compare total followers
  const brandFollowers = brands.map(b => ({
    name: b.name,
    followers: (b.platforms || []).reduce((sum, p) => sum + (p.followers || 0), 0),
  })).sort((a, b) => b.followers - a.followers);

  sections.push({
    title: 'Growth Overview',
    content: `Comparing ${brands.length} brands reveals ${brandFollowers[0].name} leads in total follower count with ${(brandFollowers[0].followers / 1000000).toFixed(1)}M followers, followed by ${brandFollowers.slice(1).map(b => `${b.name} (${(b.followers / 1000000).toFixed(1)}M)`).join(', ')}. This analysis highlights the competitive landscape and market positioning of each brand.`,
  });

  // Compare engagement
  const brandEngagement = brands.map(b => ({
    name: b.name,
    engagement: (b.platforms || []).length > 0
      ? (b.platforms || []).reduce((sum, p) => sum + (p.engagementRate || 0), 0) / (b.platforms || []).length
      : 0,
  })).sort((a, b) => b.engagement - a.engagement);

  sections.push({
    title: 'Engagement Performance',
    content: `Engagement analysis shows ${brandEngagement[0].name} achieves the highest engagement rate at ${brandEngagement[0].engagement.toFixed(1)}%, indicating superior content resonance and audience connection. ${brandEngagement.slice(1).map(b => `${b.name} (${b.engagement.toFixed(1)}%)`).join(', ')} follow with strong performance metrics.`,
  });

  sections.push({
    title: 'Strategic Insights',
    content: `This comparative analysis reveals distinct positioning strategies across the luxury fashion sector. Brands with higher engagement rates demonstrate effective content strategies and audience connection, while those with larger follower bases benefit from broader reach and brand awareness.`,
  });

  return { sections };
}




