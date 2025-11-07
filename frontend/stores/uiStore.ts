import { create } from 'zustand';

interface UIStore {
  presentationMode: boolean;
  comparisonMode: boolean;
  selectedBrands: string[]; // Array of brand IDs for comparison
  currentSlide: number; // For presentation mode auto-cycling
  isPaused: boolean;
  togglePresentation: () => void;
  toggleComparison: () => void;
  setSelectedBrands: (brandIds: string[]) => void;
  setCurrentSlide: (slide: number) => void;
  togglePause: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  presentationMode: false,
  comparisonMode: false,
  selectedBrands: [],
  currentSlide: 0,
  isPaused: false,
  
  togglePresentation: () => set((state) => ({ 
    presentationMode: !state.presentationMode,
    currentSlide: 0, // Reset slide when toggling
  })),
  
  toggleComparison: () => set((state) => ({ 
    comparisonMode: !state.comparisonMode,
    selectedBrands: state.comparisonMode ? [] : state.selectedBrands,
  })),
  
  setSelectedBrands: (brandIds: string[]) => set({ selectedBrands: brandIds }),
  
  setCurrentSlide: (slide: number) => set({ currentSlide: slide }),
  
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
}));

