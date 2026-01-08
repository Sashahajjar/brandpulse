'use client';

import { useUIStore } from '@/stores/uiStore';
import { motion } from 'framer-motion';

export default function PresentationToggle() {
  const { presentationMode, togglePresentation } = useUIStore();

  return (
    <motion.button
      onClick={togglePresentation}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${
        presentationMode
          ? 'border-[#8b7355] bg-[#8b7355] text-white'
          : 'border-[#8b7355] text-[#8b7355] hover:bg-[#8b7355]/10'
      }`}
    >
      {presentationMode ? 'Exit Presentation' : 'Presentation Mode'}
    </motion.button>
  );
}




