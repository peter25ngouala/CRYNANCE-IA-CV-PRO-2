import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, EyeOff, GripVertical, Trash2, Sparkles, 
  Palette, Type, Maximize2, Minimize2, RefreshCw,
  Layout, CheckCircle2, Info
} from 'lucide-react';
import { CVData, Experience } from '../types';
import { DynamicCV } from './DynamicCV';

interface AdvancedCVCanvasEditorProps {
  data: CVData;
  onChange: (newData: Partial<CVData>) => void;
  onAIModify: (prompt: string, section?: string) => void;
  onRemoveSection?: (sectionId: string) => void;
}

export const AdvancedCVCanvasEditor = ({ data, onChange, onAIModify, onRemoveSection }: AdvancedCVCanvasEditorProps) => {
  const [selection, setSelection] = useState<{ text: string, x: number, y: number } | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Selection Popover Logic
  useEffect(() => {
    const handleMouseUp = () => {
      const sel = window.getSelection();
      if (sel && sel.toString().trim().length > 0) {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelection({
          text: sel.toString(),
          x: rect.left + rect.width / 2,
          y: rect.top - 40
        });
      } else {
        setSelection(null);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const applyColorToSelection = (color: string) => {
    // Note: In a real WYSIWYG, we'd use document.execCommand('foreColor', false, color)
    // but since we render from state, we'd need a more complex solution for partial coloring.
    // For now, we'll simulate it or provide a hint.
    document.execCommand('foreColor', false, color);
    setSelection(null);
  };

  const colors = ['#2563eb', '#10b981', '#ef4444', '#f59e0b', '#7c3aed', '#000000'];

  return (
    <div className="relative" ref={containerRef}>
      {/* Selection Popover */}
      <AnimatePresence>
        {selection && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ position: 'fixed', left: selection.x, top: selection.y, transform: 'translateX(-50%)' }}
            className="z-[100] bg-white shadow-2xl rounded-full p-1.5 border border-slate-100 flex items-center gap-1 no-print"
          >
            {colors.map(color => (
              <button
                key={color}
                onClick={() => applyColorToSelection(color)}
                className="w-6 h-6 rounded-full border border-slate-100 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* The CV Canvas */}
      <div className="relative overflow-hidden">
        <DynamicCV 
          data={data}
          styleId={data.template}
          onUpdate={onChange}
          onRemoveSection={onRemoveSection}
          onAIModify={onAIModify}
        />
      </div>
    </div>
  );
};

export default AdvancedCVCanvasEditor;
