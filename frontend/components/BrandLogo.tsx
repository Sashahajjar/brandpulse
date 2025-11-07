'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  brandName: string;
  size?: number;
  className?: string;
  logoUrl?: string | null;
}

// Logo API service - using Clearbit Logo API (free, no API key needed)
const getLogoUrl = (brandName: string): string => {
  const cleanName = brandName.toLowerCase().trim();
  // Clearbit Logo API - free, no authentication needed
  return `https://logo.clearbit.com/${cleanName}.com`;
};

// Fallback: Direct logo URLs for major brands (using Clearbit and reliable CDN sources)
const brandLogoUrls: { [key: string]: string } = {
  dior: 'https://logo.clearbit.com/dior.com',
  jacquemus: 'https://logo.clearbit.com/jacquemus.com',
  chanel: 'https://logo.clearbit.com/chanel.com',
  gucci: 'https://logo.clearbit.com/gucci.com',
  prada: 'https://logo.clearbit.com/prada.com',
  versace: 'https://logo.clearbit.com/versace.com',
  balenciaga: 'https://logo.clearbit.com/balenciaga.com',
  louisvuitton: 'https://logo.clearbit.com/louisvuitton.com',
  hermes: 'https://logo.clearbit.com/hermes.com',
};

export default function BrandLogo({ 
  brandName, 
  size = 64, 
  className = '',
  logoUrl 
}: BrandLogoProps) {
  const [imgError, setImgError] = useState(false);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);

  useEffect(() => {
    // Reset states when brand changes
    setImgError(false);
    setFallbackAttempted(false);
    
    // Priority: Use provided logoUrl, then try brand-specific URL, then Clearbit
    if (logoUrl) {
      setCurrentLogoUrl(logoUrl);
    } else {
      const brandKey = brandName.toLowerCase().trim();
      if (brandLogoUrls[brandKey]) {
        setCurrentLogoUrl(brandLogoUrls[brandKey]);
      } else {
        setCurrentLogoUrl(getLogoUrl(brandName));
      }
    }
  }, [brandName, logoUrl]);

  const handleImageError = () => {
    // If first attempt failed and we haven't tried fallback, try Clearbit directly
    if (!fallbackAttempted && !logoUrl) {
      setFallbackAttempted(true);
      setCurrentLogoUrl(getLogoUrl(brandName));
    } else {
      setImgError(true);
    }
  };

  // Brand color mappings for fallback (luxury aesthetic)
  const brandColors: { [key: string]: { bg: string; text: string } } = {
    dior: { bg: 'bg-gray-100', text: 'text-gray-800' },
    jacquemus: { bg: 'bg-amber-50', text: 'text-amber-800' },
    chanel: { bg: 'bg-black', text: 'text-white' },
    gucci: { bg: 'bg-red-50', text: 'text-red-800' },
    prada: { bg: 'bg-gray-900', text: 'text-white' },
    versace: { bg: 'bg-yellow-50', text: 'text-yellow-900' },
    balenciaga: { bg: 'bg-gray-800', text: 'text-white' },
  };

  const colors = brandColors[brandName.toLowerCase()] || { 
    bg: 'bg-gradient-pastel', 
    text: 'text-gray-700' 
  };
  const initial = brandName.charAt(0).toUpperCase();

  // If we have a logo URL and no error, show the image
  if (currentLogoUrl && !imgError) {
    return (
      <div 
        className={`relative overflow-hidden rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={currentLogoUrl}
          alt={`${brandName} logo`}
          fill
          className="object-contain p-2"
          onError={handleImageError}
          unoptimized // Allow external images
        />
      </div>
    );
  }

  // Fallback: Show styled initial
  return (
    <div
      className={`flex items-center justify-center rounded-lg ${colors.bg} ${colors.text} font-light ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="text-2xl" style={{ fontSize: `${size * 0.4}px` }}>
        {initial}
      </span>
    </div>
  );
}
