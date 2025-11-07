import express from 'express';
import prisma from '../prisma/client.js';
import { validate } from '../middleware/validation.js';
import { createInsightSchema, getInsightsSchema } from '../validators/insightValidators.js';
import logger from '../config/logger.js';

const router = express.Router();

// GET /api/insights - Get all insights (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { brandId, metricType, period } = req.query;

    const where = {};
    if (brandId) where.brandId = brandId;
    if (metricType) where.metricType = metricType;
    if (period) where.period = period;

    const insights = await prisma.insight.findMany({
      where,
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
      orderBy: { date: 'desc' },
      take: 100, // Limit to latest 100 insights
    });

    res.json({ data: insights });
  } catch (error) {
    logger.error('Error fetching insights:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/insights/:id - Get single insight by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const insight = await prisma.insight.findUnique({
      where: { id },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    if (!insight) {
      return res.status(404).json({ error: 'Insight not found' });
    }

    res.json(insight);
  } catch (error) {
    logger.error('Error fetching insight:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/insights - Create new insight
router.post('/', validate({ body: createInsightSchema }), async (req, res, next) => {
  try {
    const { brandId, metricType, value, period, date, metadata } = req.body;

    // Verify brand exists
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    const insight = await prisma.insight.create({
      data: {
        brandId,
        metricType,
        value: parseFloat(value),
        period: period || 'monthly',
        date: date ? new Date(date) : new Date(),
        metadata: metadata || {},
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    res.status(201).json(insight);
  } catch (error) {
    logger.error('Error creating insight:', error);
    next(error);
  }
});

// GET /api/insights/brand/:brandId - Get insights for a specific brand
router.get('/brand/:brandId', async (req, res) => {
  try {
    const { brandId } = req.params;
    const { metricType, period } = req.query;

    const where = { brandId };
    if (metricType) where.metricType = metricType;
    if (period) where.period = period;

    const insights = await prisma.insight.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 50, // Latest 50 insights for the brand
    });

    res.json({ data: insights });
  } catch (error) {
    logger.error('Error fetching brand insights:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
