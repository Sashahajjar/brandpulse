import express from 'express';
import prisma from '../prisma/client.js';
import { syncBrandData } from '../services/syncService.js';
import { validate } from '../middleware/validation.js';
import { createBrandSchema, updateBrandSchema } from '../validators/brandValidators.js';
import logger from '../config/logger.js';

const router = express.Router();

// GET /api/brands - Get all brands with platforms and insights
router.get('/', async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        platforms: true,
        insights: {
          orderBy: { date: 'desc' },
          take: 10, // Latest 10 insights per brand
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: brands });
  } catch (error) {
    logger.error('Error fetching brands:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/brands/:id - Get single brand by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        platforms: true,
        insights: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.json(brand);
  } catch (error) {
    logger.error('Error fetching brand:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/brands - Create new brand
router.post('/', validate({ body: createBrandSchema }), async (req, res) => {
  try {
    const { name, logo } = req.body;

    const brand = await prisma.brand.create({
      data: {
        name,
        logo: logo || null,
      },
      include: {
        platforms: true,
        insights: true,
      },
    });

    res.status(201).json(brand);
  } catch (error) {
    logger.error('Error creating brand:', error);
    throw error; // Let error handler deal with it
  }
});

// PUT /api/brands/:id - Update brand
router.put('/:id', validate({ body: updateBrandSchema }), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo } = req.body;

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(logo !== undefined && { logo }),
      },
      include: {
        platforms: true,
        insights: true,
      },
    });

    res.json(brand);
  } catch (error) {
    logger.error('Error updating brand:', error);
    throw error;
  }
});

// DELETE /api/brands/:id - Delete brand
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.brand.delete({
      where: { id },
    });

    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    logger.error('Error deleting brand:', error);
    throw error;
  }
});

// POST /api/brands/sync/:brandName - Sync brand data from RapidAPI
router.post('/sync/:brandName', async (req, res, next) => {
  try {
    const { brandName } = req.params;

    // Find or create brand
    let brand = await prisma.brand.findUnique({
      where: { name: brandName },
    });

    if (!brand) {
      brand = await prisma.brand.create({
        data: { name: brandName },
      });
    }

    // Use the new sync service
    const result = await syncBrandData(brand.id, brandName);

    // Fetch updated brand with all relations
    const updatedBrand = await prisma.brand.findUnique({
      where: { id: brand.id },
      include: {
        platforms: true,
        insights: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        snapshots: {
          orderBy: { capturedAt: 'desc' },
          take: 30, // Latest 30 snapshots
        },
      },
    });

    res.json({
      success: true,
      message: `Brand ${brandName} synced successfully`,
      brand: updatedBrand,
    });
  } catch (error) {
    logger.error('Error syncing brand:', error);
    next(error);
  }
});

export default router;
