'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brand } from '@/stores/brandStore';
import BrandLogo from '@/components/BrandLogo';

interface BrandSelectorProps {
  brands: Brand[];
  selectedBrands: string[];
  onSelectionChange: (brandIds: string[]) => void;
  maxSelection?: number;
}

export default function BrandSelector({ 
  brands, 
  selectedBrands, 
  onSelectionChange,
  maxSelection = 3 
}: BrandSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleBrand = (brandId: string) => {
    if (selectedBrands.includes(brandId)) {
      onSelectionChange(selectedBrands.filter(id => id !== brandId));
    } else if (selectedBrands.length < maxSelection) {
      onSelectionChange([...selectedBrands, brandId]);
    }
  };

  const selectedBrandsData = brands.filter(b => selectedBrands.includes(b.id));

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between hover:border-[#8b7355] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Compare Brands</span>
          {selectedBrandsData.length > 0 && (
            <span className="text-xs text-gray-500">
              ({selectedBrandsData.length}/{maxSelection} selected)
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              {brands.map((brand) => {
                const isSelected = selectedBrands.includes(brand.id);
                const isDisabled = !isSelected && selectedBrands.length >= maxSelection;

                return (
                  <motion.button
                    key={brand.id}
                    onClick={() => !isDisabled && toggleBrand(brand.id)}
                    disabled={isDisabled}
                    whileHover={!isDisabled ? { scale: 1.02 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all mb-1 ${
                      isSelected
                        ? 'bg-[#8b7355]/10 border-2 border-[#8b7355]'
                        : isDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <BrandLogo brandName={brand.name} size={40} logoUrl={brand.logo || undefined} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 capitalize">{brand.name}</div>
                      <div className="text-xs text-gray-500">
                        {(brand.platforms || []).reduce((sum, p) => sum + (p.followers || 0), 0) / 1000000}M followers
                      </div>
                    </div>
                    {isSelected && (
                      <svg className="w-5 h-5 text-[#8b7355]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </motion.button>
                );
              })}
            </div>
            {selectedBrands.length > 0 && (
              <div className="p-3 border-t border-gray-200">
                <button
                  onClick={() => onSelectionChange([])}
                  className="w-full text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear selection
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected brands chips */}
      {selectedBrandsData.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedBrandsData.map((brand) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 px-3 py-1 bg-[#8b7355]/10 rounded-full"
            >
              <BrandLogo brandName={brand.name} size={20} logoUrl={brand.logo || undefined} />
              <span className="text-sm font-medium text-gray-700 capitalize">{brand.name}</span>
              <button
                onClick={() => toggleBrand(brand.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}




