import { useState, useEffect, RefObject } from 'react';
import { CVData } from '../types';

interface AutoHeightProps {
  cvRef: RefObject<HTMLDivElement>;
  data: CVData;
  onUpdate?: (data: Partial<CVData>) => void;
}

export const useAutoHeight = ({ cvRef, data, onUpdate }: AutoHeightProps) => {
  const [layoutSettings, setLayoutSettings] = useState({
    fontSize: 11,
    spacing: 1.4,
    sectionSpacing: 32,
    isTwoColumn: false,
    hasOverflow: false,
  });

  const A4_HEIGHT_PX = 1123;

  useEffect(() => {
    const checkAndAdjust = () => {
      if (!cvRef.current || data.isLongFormat) {
        if (data.isLongFormat) {
          setLayoutSettings(prev => ({ ...prev, hasOverflow: false }));
        }
        return;
      }

      const element = cvRef.current;
      const currentHeight = element.scrollHeight;

      if (currentHeight > A4_HEIGHT_PX + 2) {
        // Step 1: Reduce line spacing
        if (layoutSettings.spacing > 1.1) {
          setLayoutSettings(prev => ({ ...prev, spacing: Math.max(1.1, prev.spacing - 0.1) }));
          return;
        }

        // Step 2: Reduce section spacing
        if (layoutSettings.sectionSpacing > 16) {
          setLayoutSettings(prev => ({ ...prev, sectionSpacing: Math.max(16, prev.sectionSpacing - 4) }));
          return;
        }

        // Step 3: Reduce font size
        if (layoutSettings.fontSize > 9) {
          setLayoutSettings(prev => ({ ...prev, fontSize: prev.fontSize - 0.5 }));
          return;
        }

        setLayoutSettings(prev => ({ ...prev, hasOverflow: true }));
      } else {
        // Optionally try to increase if there's lots of space? 
        // No, user only asked for auto-reduction to fit.
        setLayoutSettings(prev => ({ ...prev, hasOverflow: false }));
      }
    };

    const timer = setTimeout(checkAndAdjust, 150);
    return () => clearTimeout(timer);
  }, [data, layoutSettings.fontSize, layoutSettings.spacing, layoutSettings.sectionSpacing, layoutSettings.isTwoColumn]);

  const forceFit = () => {
    setLayoutSettings(prev => ({
      ...prev,
      fontSize: 9,
      spacing: 1.1,
      sectionSpacing: 16,
    }));
  };

  return {
    layoutSettings,
    setLayoutSettings,
    forceFit,
  };
};
