import { z } from 'zod';

export const createBrandSchema = z.object({
  name: z.string().min(2, 'Brand name must be at least 2 characters').max(100),
  logo: z.string().url('Invalid logo URL').optional().nullable(),
  description: z.string().max(500).optional().nullable(),
});

export const updateBrandSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  logo: z.string().url().optional().nullable(),
  description: z.string().max(500).optional().nullable(),
});

export const syncBrandSchema = z.object({
  brandName: z.string().min(1, 'Brand name is required'),
});

