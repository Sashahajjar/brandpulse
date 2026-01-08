import cron from 'node-cron';
import prisma from '../prisma/client.js';
import { syncBrandData } from '../services/syncService.js';
import logger from '../config/logger.js';

/**
 * Daily sync job - runs at midnight UTC
 */
export function startDailySyncJob() {
  // Run daily at 00:00 UTC
  cron.schedule('0 0 * * *', async () => {
    logger.info('Starting daily brand sync job');
    
    try {
      const brands = await prisma.brand.findMany({
        select: { id: true, name: true },
      });

      logger.info(`Found ${brands.length} brands to sync`);

      for (const brand of brands) {
        try {
          await syncBrandData(brand.id, brand.name);
          logger.info(`Successfully synced brand: ${brand.name}`);
        } catch (error) {
          logger.error(`Failed to sync brand ${brand.name}:`, error);
          // Continue with other brands even if one fails
        }
      }

      logger.info('Daily sync job completed');
    } catch (error) {
      logger.error('Daily sync job failed:', error);
    }
  }, {
    timezone: 'UTC',
  });

  logger.info('Daily sync job scheduled (runs at 00:00 UTC)');
}

/**
 * Manual sync for a specific brand
 */
export async function syncBrand(brandId, brandName) {
  return syncBrandData(brandId, brandName);
}




