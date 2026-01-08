import { z } from 'zod';

export const createInsightSchema = z.object({
  brandId: z.string().uuid('Invalid brand ID'),
  metricType: z.enum(['engagement', 'sentiment', 'growth', 'reach', 'impressions'], {
    errorMap: () => ({ message: 'Invalid metric type' }),
  }),
  value: z.number().min(0),
  period: z.enum(['daily', 'weekly', 'monthly']),
  date: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional().nullable(),
});

export const getInsightsSchema = z.object({
  brandId: z.string().uuid().optional(),
  metricType: z.string().optional(),
  period: z.string().optional(),
});




