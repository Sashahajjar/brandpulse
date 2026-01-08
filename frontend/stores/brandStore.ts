import { create } from 'zustand';
import { getBrands, getBrandById } from '@/lib/api';

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  platforms?: Platform[];
  insights?: any[];
}

export interface Platform {
  id: string;
  platformType: string;
  username: string;
  followers: number;
  engagementRate: number;
  postingFrequency: number;
}

interface BrandStore {
  brands: Brand[];
  selectedBrand: Brand | null;
  loading: boolean;
  error: string | null;
  fetchBrands: () => Promise<void>;
  selectBrand: (id: string) => Promise<void>;
}

export const useBrandStore = create<BrandStore>((set, get) => ({
  brands: [],
  selectedBrand: null,
  loading: false,
  error: null,
  
  fetchBrands: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getBrands();
      set({ brands: data.data || [], loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch brands',
        loading: false 
      });
    }
  },
  
  selectBrand: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const data = await getBrandById(id);
      set({ selectedBrand: data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch brand',
        loading: false 
      });
    }
  },
}));




