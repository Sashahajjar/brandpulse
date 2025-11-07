import prisma from '../prisma/client.js';
import { fetchBrandStats } from './socialDataService.js';
import { invalidateBrandCache } from './cacheService.js';
import logger from '../config/logger.js';

/**
 * Sync brand data and create snapshots
 */
export async function syncBrandData(brandId, brandName) {
  const syncJob = await prisma.syncJob.create({
    data: {
      brandId,
      status: 'running',
      message: `Starting sync for ${brandName}`,
    },
  });

  try {
    // Fetch latest data from API
    const brandData = await fetchBrandStats(brandName);
    
    if (!brandData) {
      throw new Error('Failed to fetch brand data from API');
    }

    // Update or create brand
    const brand = await prisma.brand.upsert({
      where: { id: brandId },
      update: {
        logo: brandData.logo || undefined,
        updatedAt: new Date(),
      },
      create: {
        id: brandId,
        name: brandName,
        logo: brandData.logo || null,
      },
    });

    const now = new Date();
    const capturedAt = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of day

    // Sync Instagram platform
    if (brandData.instagram) {
      const platform = await prisma.platform.upsert({
        where: {
          brandId_platformType: {
            brandId: brand.id,
            platformType: 'instagram',
          },
        },
        update: {
          username: brandData.instagram.username,
          followers: parseInt(brandData.instagram.followers) || 0,
          engagementRate: parseFloat(brandData.instagram.engagementRate) || 0,
          postingFrequency: parseInt(brandData.instagram.postingFrequency) || 0,
          lastFetchedAt: now,
          updatedAt: now,
        },
        create: {
          brandId: brand.id,
          platformType: 'instagram',
          username: brandData.instagram.username,
          followers: parseInt(brandData.instagram.followers) || 0,
          engagementRate: parseFloat(brandData.instagram.engagementRate) || 0,
          postingFrequency: parseInt(brandData.instagram.postingFrequency) || 0,
          lastFetchedAt: now,
        },
      });

      // Create snapshots for Instagram
      await createSnapshots(brand.id, 'instagram', brandData.instagram, capturedAt);
    }

    // Sync TikTok platform
    if (brandData.tiktok) {
      const platform = await prisma.platform.upsert({
        where: {
          brandId_platformType: {
            brandId: brand.id,
            platformType: 'tiktok',
          },
        },
        update: {
          username: brandData.tiktok.username,
          followers: parseInt(brandData.tiktok.followers) || 0,
          engagementRate: parseFloat(brandData.tiktok.engagementRate) || 0,
          postingFrequency: parseInt(brandData.tiktok.postingFrequency) || 0,
          lastFetchedAt: now,
          updatedAt: now,
        },
        create: {
          brandId: brand.id,
          platformType: 'tiktok',
          username: brandData.tiktok.username,
          followers: parseInt(brandData.tiktok.followers) || 0,
          engagementRate: parseFloat(brandData.tiktok.engagementRate) || 0,
          postingFrequency: parseInt(brandData.tiktok.postingFrequency) || 0,
          lastFetchedAt: now,
        },
      });

      // Create snapshots for TikTok
      await createSnapshots(brand.id, 'tiktok', brandData.tiktok, capturedAt);
    }

    // Invalidate cache
    await invalidateBrandCache(brand.id);

    // Update sync job
    await prisma.syncJob.update({
      where: { id: syncJob.id },
      data: {
        status: 'completed',
        message: `Successfully synced ${brandName}`,
        finishedAt: new Date(),
      },
    });

    logger.info(`Sync completed for brand: ${brandName}`);
    return { success: true, brand };
  } catch (error) {
    logger.error(`Sync failed for brand ${brandName}:`, error);
    
    // Update sync job with error
    await prisma.syncJob.update({
      where: { id: syncJob.id },
      data: {
        status: 'failed',
        message: error.message || 'Sync failed',
        finishedAt: new Date(),
      },
    });

    throw error;
  }
}

/**
 * Create snapshots for platform metrics
 */
async function createSnapshots(brandId, platform, data, capturedAt) {
  const snapshots = [
    {
      brandId,
      platform,
      metric: 'followers',
      value: parseFloat(data.followers) || 0,
      capturedAt,
    },
    {
      brandId,
      platform,
      metric: 'engagement_rate',
      value: parseFloat(data.engagementRate) || 0,
      capturedAt,
    },
    {
      brandId,
      platform,
      metric: 'posting_frequency',
      value: parseFloat(data.postingFrequency) || 0,
      capturedAt,
    },
  ];

  // Use createMany with skipDuplicates to avoid duplicates (idempotent)
  // First, try to create all snapshots
  try {
    await prisma.socialSnapshot.createMany({
      data: snapshots,
      skipDuplicates: true,
    });
  } catch (error) {
    // If createMany fails, fall back to individual upserts
    // Note: Prisma doesn't support composite unique constraints in upsert where clause
    // So we'll use a different approach: delete and create
    for (const snapshot of snapshots) {
      // Delete existing snapshot for this combination
      await prisma.socialSnapshot.deleteMany({
        where: {
          brandId: snapshot.brandId,
          platform: snapshot.platform,
          metric: snapshot.metric,
          capturedAt: snapshot.capturedAt,
        },
      });
      // Create new snapshot
      await prisma.socialSnapshot.create({
        data: snapshot,
      });
    }
  }
}

