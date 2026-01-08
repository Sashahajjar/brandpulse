'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DownloadReportProps {
  reportElementId?: string;
}

// Helper function to convert lab() and other unsupported color functions to rgb
function convertUnsupportedColor(colorValue: string): string {
  if (!colorValue || colorValue === 'none' || colorValue === 'transparent') {
    return colorValue;
  }
  
  // Handle lab() color function
  if (colorValue.includes('lab(')) {
    // Create a temporary element to get computed RGB value
    const tempEl = document.createElement('div');
    tempEl.style.color = colorValue;
    tempEl.style.position = 'absolute';
    tempEl.style.visibility = 'hidden';
    document.body.appendChild(tempEl);
    const computed = window.getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);
    return computed || '#000000';
  }
  
  // Handle other unsupported functions (oklch, lch, etc.)
  if (colorValue.match(/\((oklch|lch|color)\(/)) {
    const tempEl = document.createElement('div');
    tempEl.style.color = colorValue;
    tempEl.style.position = 'absolute';
    tempEl.style.visibility = 'hidden';
    document.body.appendChild(tempEl);
    const computed = window.getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);
    return computed || '#000000';
  }
  
  return colorValue;
}

export default function DownloadReport({ reportElementId = 'dashboard-report' }: DownloadReportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById(reportElementId);
      if (!element) {
        console.error('Report element not found with id:', reportElementId);
        alert('Report element not found. Please refresh the page and try again.');
        setIsGenerating(false);
        return;
      }

      // Scroll to top to ensure we capture everything
      window.scrollTo(0, 0);
      
      // Add a delay to ensure all animations and images are loaded
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Hide any elements that shouldn't be in the PDF (like buttons, controls)
      const buttonsToHide = document.querySelectorAll('button, .sticky, nav');
      const originalDisplay: string[] = [];
      buttonsToHide.forEach((btn) => {
        const htmlBtn = btn as HTMLElement;
        originalDisplay.push(htmlBtn.style.display);
        htmlBtn.style.display = 'none';
      });

      // Declare disabledSheets outside try block so it's accessible in catch
      const disabledSheets: { node: HTMLElement; originalDisplay: string }[] = [];
      
      try {
        // Temporarily disable all stylesheets that might contain lab() colors
        // We'll apply computed styles as inline styles instead
        const styleSheets = Array.from(document.styleSheets);
        
        styleSheets.forEach((sheet) => {
          try {
            // Check if stylesheet has lab() colors by trying to access rules
            const rules = Array.from(sheet.cssRules || []);
            let hasLabColors = false;
            
            rules.forEach((rule) => {
              if (rule instanceof CSSStyleRule) {
                const cssText = rule.cssText;
                if (cssText.includes('lab(') || cssText.includes('oklch(') || cssText.includes('lch(')) {
                  hasLabColors = true;
                }
              }
            });
            
            // Temporarily disable stylesheets with lab() colors
            if (hasLabColors && sheet.ownerNode) {
              const node = sheet.ownerNode as HTMLElement;
              disabledSheets.push({
                node,
                originalDisplay: node.style.display || '',
              });
              node.style.display = 'none';
            }
          } catch (e) {
            // Cross-origin stylesheet or other error - disable it to be safe
            if (sheet.ownerNode) {
              const node = sheet.ownerNode as HTMLElement;
              disabledSheets.push({
                node,
                originalDisplay: node.style.display || '',
              });
              node.style.display = 'none';
            }
          }
        });
        
        // Wait for stylesheet changes to take effect
        await new Promise(resolve => setTimeout(resolve, 300));

        // Apply all computed styles as inline styles to avoid stylesheet parsing issues
        // This ensures html2canvas doesn't need to parse stylesheets with lab() colors
        const originalStyles: Map<HTMLElement, Map<string, string>> = new Map();
        const allElements = element.querySelectorAll('*');
        
        allElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          const computedStyle = window.getComputedStyle(htmlEl);
          const elementStyles = new Map<string, string>();
          
          // Store original inline styles
          const originalInlineStyle = htmlEl.getAttribute('style') || '';
          
          // Apply all important computed styles as inline styles
          const importantProperties = [
            'color', 
            'backgroundColor', 
            'borderColor', 
            'borderTopColor', 
            'borderRightColor', 
            'borderBottomColor', 
            'borderLeftColor',
            'borderWidth',
            'borderStyle',
            'borderRadius',
            'padding',
            'paddingTop',
            'paddingRight',
            'paddingBottom',
            'paddingLeft',
            'margin',
            'fontSize',
            'fontWeight',
            'fontFamily',
            'textAlign',
            'display',
            'flexDirection',
            'gap',
            'width',
            'height',
            'minHeight',
            'background',
            'backgroundImage',
            'boxShadow',
            'opacity',
          ];
          
          importantProperties.forEach((prop) => {
            const value = computedStyle.getPropertyValue(prop);
            if (value && value !== 'none' && value !== 'normal' && value !== 'auto') {
              // Convert lab() colors to rgb
              if (value.includes('lab(') || value.includes('oklch(') || value.includes('lch(') || value.match(/color\(/)) {
                const rgbValue = convertUnsupportedColor(value);
                if (rgbValue) {
                  htmlEl.style.setProperty(prop, rgbValue, 'important');
                  elementStyles.set(prop, '');
                }
              } else {
                // Apply as inline style to avoid stylesheet parsing
                htmlEl.style.setProperty(prop, value, 'important');
                elementStyles.set(prop, '');
              }
            }
          });
          
          if (elementStyles.size > 0) {
            originalStyles.set(htmlEl, elementStyles);
            // Store original inline style to restore later
            (htmlEl as any).__originalStyle = originalInlineStyle;
          }
        });
        
        // Wait a bit for inline styles to apply
        await new Promise(resolve => setTimeout(resolve, 200));

        // Try with CORS first, fallback to allowTaint if needed
        let canvas;
        try {
          canvas = await html2canvas(element, {
            scale: 1.5,
            useCORS: true,
            allowTaint: false,
            logging: false,
            backgroundColor: '#fafafa',
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
            scrollX: 0,
            scrollY: 0,
            onclone: (clonedDoc) => {
              // Remove any style/link elements that might contain lab() colors
              const styleElements = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
              styleElements.forEach((style) => {
                if (style.textContent?.includes('lab(') || style.getAttribute('href')?.includes('lab')) {
                  style.remove();
                }
              });
              
              // Ensure all images are loaded in the cloned document
              const images = clonedDoc.querySelectorAll('img');
              images.forEach((img) => {
                if (!img.complete) {
                  img.style.display = 'none';
                }
              });
              
              // Fix unsupported color functions in cloned document by converting all computed styles
              const clonedElements = clonedDoc.querySelectorAll('*');
              clonedElements.forEach((el) => {
                const htmlEl = el as HTMLElement;
                // Get all computed styles and convert lab() colors
                const computedStyle = window.getComputedStyle(htmlEl);
                const properties = [
                  'color', 
                  'backgroundColor', 
                  'borderColor',
                  'borderTopColor',
                  'borderRightColor',
                  'borderBottomColor',
                  'borderLeftColor'
                ];
                properties.forEach((prop) => {
                  const value = computedStyle.getPropertyValue(prop);
                  if (value && (value.includes('lab(') || value.includes('oklch(') || value.includes('lch(') || value.match(/color\(/))) {
                    const rgbValue = convertUnsupportedColor(value);
                    htmlEl.style.setProperty(prop, rgbValue, 'important');
                  }
                });
              });
            },
          });
        } catch (corsError) {
          console.warn('CORS error, trying with allowTaint:', corsError);
          // Fallback: allow tainted canvas (may have some image issues but will work)
          canvas = await html2canvas(element, {
            scale: 1.5,
            useCORS: false,
            allowTaint: true,
            logging: false,
            backgroundColor: '#fafafa',
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
            scrollX: 0,
            scrollY: 0,
          });
        }
        
        // Re-enable disabled stylesheets
        disabledSheets.forEach(({ node, originalDisplay }) => {
          node.style.display = originalDisplay;
        });
        
        // Restore original styles
        originalStyles.forEach((elementStyles, el) => {
          // Restore original inline style if it existed
          const originalInlineStyle = (el as any).__originalStyle;
          if (originalInlineStyle !== undefined) {
            if (originalInlineStyle) {
              el.setAttribute('style', originalInlineStyle);
            } else {
              el.removeAttribute('style');
            }
            delete (el as any).__originalStyle;
          } else {
            // Remove all properties we added
            elementStyles.forEach((_, prop) => {
              el.style.removeProperty(prop);
            });
          }
        });

        // Restore hidden elements
        buttonsToHide.forEach((btn, index) => {
          const htmlBtn = btn as HTMLElement;
          htmlBtn.style.display = originalDisplay[index] || '';
        });

        if (!canvas) {
          throw new Error('Failed to create canvas');
        }

        const imgData = canvas.toDataURL('image/png', 0.95);
        if (!imgData || imgData === 'data:,') {
          throw new Error('Failed to convert canvas to image');
        }

        const pdf = new jsPDF('p', 'mm', 'a4');
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;

        // If content is taller than one page, split into multiple pages
        const pageHeight = pdf.internal.pageSize.getHeight();
        let heightLeft = height;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, width, height);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - height;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, width, height);
          heightLeft -= pageHeight;
        }

        const fileName = `BrandPulse_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
      } catch (canvasError) {
        // Re-enable disabled stylesheets even on error
        disabledSheets.forEach(({ node, originalDisplay }) => {
          node.style.display = originalDisplay;
        });
        
        // Restore hidden elements even if there's an error
        buttonsToHide.forEach((btn, index) => {
          const htmlBtn = btn as HTMLElement;
          htmlBtn.style.display = originalDisplay[index] || '';
        });
        throw canvasError;
      }
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      const errorMessage = error?.message || 'Unknown error occurred';
      alert(`Failed to generate PDF: ${errorMessage}. Please ensure all content is loaded and try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.button
      onClick={handleDownload}
      disabled={isGenerating}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-4 py-2 rounded-full border border-[#8b7355] text-[#8b7355] hover:bg-[#8b7355]/10 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#8b7355]"></div>
          <span>Generating...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download Report</span>
        </>
      )}
    </motion.button>
  );
}

