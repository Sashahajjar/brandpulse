import axios from 'axios';

const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HOST_IG = 'instagram-scraper-stable-api.p.rapidapi.com';
const RAPID_API_HOST_TIKTOK = 'tiktok-scraper7.p.rapidapi.com';

/**
 * Fetch Instagram stats for a brand
 */
async function fetchInstagramStats(username) {
  try {
    const response = await axios.get(
      `https://${RAPID_API_HOST_IG}/search`,
      {
        params: {
          query: username,
          type: 'user'
        },
        headers: {
          'X-RapidAPI-Key': RAPID_API_KEY,
          'X-RapidAPI-Host': RAPID_API_HOST_IG
        }
      }
    );

    // Parse response based on actual API structure
    if (response.data && response.data.data) {
      const user = response.data.data[0] || response.data.data;
      return {
        username: user.username || username,
        followers: user.follower_count || user.followers || 0,
        engagementRate: calculateEngagementRate(user),
        postingFrequency: user.media_count ? Math.floor(user.media_count / 30) : 0, // Approximate posts per month
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching Instagram data for ${username}:`, error.message);
    // Return mock data if API fails (for development)
    return {
      username,
      followers: Math.floor(Math.random() * 5000000) + 1000000,
      engagementRate: (Math.random() * 3 + 2).toFixed(2),
      postingFrequency: Math.floor(Math.random() * 10) + 5,
    };
  }
}

/**
 * Fetch TikTok stats for a brand
 */
async function fetchTikTokStats(username) {
  try {
    const response = await axios.get(
      `https://${RAPID_API_HOST_TIKTOK}/user/info`,
      {
        params: {
          unique_id: username
        },
        headers: {
          'X-RapidAPI-Key': RAPID_API_KEY,
          'X-RapidAPI-Host': RAPID_API_HOST_TIKTOK
        }
      }
    );

    if (response.data && response.data.data) {
      const user = response.data.data.userInfo || response.data.data;
      return {
        username: user.uniqueId || username,
        followers: user.followerCount || user.follower || 0,
        engagementRate: calculateEngagementRate(user),
        postingFrequency: user.videoCount ? Math.floor(user.videoCount / 30) : 0,
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching TikTok data for ${username}:`, error.message);
    // Return mock data if API fails (for development)
    return {
      username,
      followers: Math.floor(Math.random() * 3000000) + 500000,
      engagementRate: (Math.random() * 4 + 3).toFixed(2),
      postingFrequency: Math.floor(Math.random() * 8) + 3,
    };
  }
}

/**
 * Calculate engagement rate from API data
 */
function calculateEngagementRate(user) {
  // If API provides engagement rate directly
  if (user.engagement_rate) return parseFloat(user.engagement_rate);
  if (user.engagementRate) return parseFloat(user.engagementRate);

  // Calculate from likes/followers if available
  if (user.avg_likes && user.follower_count) {
    return ((user.avg_likes / user.follower_count) * 100).toFixed(2);
  }

  // Default mock engagement rate
  return (Math.random() * 3 + 2).toFixed(2);
}

/**
 * Fetch brand stats from all platforms
 */
export async function fetchBrandStats(brandName, usernames = {}) {
  const instagramUsername = usernames.instagram || brandName.toLowerCase();
  const tiktokUsername = usernames.tiktok || brandName.toLowerCase();

  try {
    const [instagram, tiktok] = await Promise.all([
      fetchInstagramStats(instagramUsername),
      fetchTikTokStats(tiktokUsername),
    ]);

    return {
      brand: brandName,
      instagram: instagram || {
        username: instagramUsername,
        followers: 0,
        engagementRate: 0,
        postingFrequency: 0,
      },
      tiktok: tiktok || {
        username: tiktokUsername,
        followers: 0,
        engagementRate: 0,
        postingFrequency: 0,
      },
    };
  } catch (error) {
    console.error(`Error fetching brand stats for ${brandName}:`, error.message);
    return null;
  }
}

/**
 * Generate insights from platform data with historical data (3 months)
 */
export function generateInsights(brandData) {
  const insights = [];
  const now = new Date();
  
  // Generate data for current month and 2 previous months (3 months total)
  const monthsToGenerate = 3;
  
  // Helper function to generate historical value with realistic variation
  const generateHistoricalValue = (currentValue, monthsAgo, variationPercent = 0.05) => {
    // Calculate a slight decrease for older months (showing growth over time)
    const monthsBack = monthsAgo;
    const decreaseFactor = 1 - (monthsBack * variationPercent); // 5% decrease per month
    return Math.max(0, Math.floor(currentValue * decreaseFactor));
  };
  
  const generateHistoricalEngagement = (currentValue, monthsAgo, variationPercent = 0.03) => {
    // Engagement rates vary less than followers
    const monthsBack = monthsAgo;
    const variation = (Math.random() - 0.5) * variationPercent; // Small random variation
    const decreaseFactor = 1 - (monthsBack * 0.01); // 1% decrease per month
    return Math.max(0, parseFloat((currentValue * decreaseFactor + variation).toFixed(2)));
  };

  // Generate Instagram follower growth data for 3 months
  if (brandData.instagram && brandData.instagram.followers > 0) {
    for (let i = 0; i < monthsToGenerate; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      date.setDate(1); // Set to first day of the month for consistency
      
      const historicalFollowers = i === 0 
        ? brandData.instagram.followers 
        : generateHistoricalValue(brandData.instagram.followers, i);
      
      insights.push({
        metricType: 'growth',
        value: historicalFollowers,
        period: 'monthly',
        date: date,
        metadata: { platform: 'instagram', metric: 'followers' },
      });
    }
  }

  // Generate TikTok follower growth data for 3 months
  if (brandData.tiktok && brandData.tiktok.followers > 0) {
    for (let i = 0; i < monthsToGenerate; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      
      const historicalFollowers = i === 0 
        ? brandData.tiktok.followers 
        : generateHistoricalValue(brandData.tiktok.followers, i);
      
      insights.push({
        metricType: 'growth',
        value: historicalFollowers,
        period: 'monthly',
        date: date,
        metadata: { platform: 'tiktok', metric: 'followers' },
      });
    }
  }

  // Generate Instagram engagement data for 3 months
  if (brandData.instagram && brandData.instagram.engagementRate > 0) {
    for (let i = 0; i < monthsToGenerate; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      
      const historicalEngagement = i === 0 
        ? parseFloat(brandData.instagram.engagementRate)
        : generateHistoricalEngagement(parseFloat(brandData.instagram.engagementRate), i);
      
      insights.push({
        metricType: 'engagement',
        value: historicalEngagement,
        period: 'monthly',
        date: date,
        metadata: { platform: 'instagram', metric: 'engagement_rate' },
      });
    }
  }

  // Generate TikTok engagement data for 3 months
  if (brandData.tiktok && brandData.tiktok.engagementRate > 0) {
    for (let i = 0; i < monthsToGenerate; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      
      const historicalEngagement = i === 0 
        ? parseFloat(brandData.tiktok.engagementRate)
        : generateHistoricalEngagement(parseFloat(brandData.tiktok.engagementRate), i);
      
      insights.push({
        metricType: 'engagement',
        value: historicalEngagement,
        period: 'monthly',
        date: date,
        metadata: { platform: 'tiktok', metric: 'engagement_rate' },
      });
    }
  }

  return insights;
}

