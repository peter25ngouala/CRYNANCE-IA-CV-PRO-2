import React from 'react';
import { 
  Type, 
  Plus, 
  Minus, 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignJustify, 
  Minimize2, 
  Maximize2 
} from 'lucide-react';
import { TextStyleSettings } from '../types';

interface TextStyleToolbarProps {
  settings: TextStyleSettings;
  onChange: (newSettings: Partial<TextStyleSettings>) => void;
}

const FONTS = ['Lato', 'Roboto', 'Montserrat', 'Inter'];

export const TextStyleToolbar: React.FC<TextStyleToolbarProps> = ({ settings, onChange }) => {
  const adjustFontSize = (delta: number) => {
    const newSize = Math.min(14, Math.max(8, settings.fontSize + delta));
    onChange({ fontSize: newSize });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-white border border-slate-200 rounded-xl shadow-sm mb-4 no-print sticky top-20 z-30">
      {/* Font Family */}
      <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
        <Type size={16} className="text-slate-400" />
        <select 
          value={settings.fontFamily}
          onChange={(e) => onChange({ fontFamily: e.target.value as any })}
          className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
        >
          {FONTS.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>

      <div className="w-px h-6 bg-slate-200 mx-1" />

      {/* Font Size */}
      <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
        <button 
          onClick={() => adjustFontSize(-0.5)}
          className="p-1 hover:bg-white rounded transition-colors text-slate-600"
          title="Diminuer la taille"
        >
          <Minus size={14} />
        </button>
        <span className="text-xs font-bold text-slate-700 min-w-[40px] text-center">
          {settings.fontSize}pt
        </span>
        <button 
          onClick={() => adjustFontSize(0.5)}
          className="p-1 hover:bg-white rounded transition-colors text-slate-600"
          title="Augmenter la taille"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="w-px h-6 bg-slate-200 mx-1" />

      {/* Line Height */}
      <div className="flex items-center gap-3 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 flex-1 min-w-[150px]">
        <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">Interligne</span>
        <input 
          type="range"
          min="1"
          max="2"
          step="0.1"
          value={settings.lineHeight}
          onChange={(e) => onChange({ lineHeight: parseFloat(e.target.value) })}
          className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <span className="text-xs font-bold text-slate-700 w-8">{settings.lineHeight}</span>
      </div>

      <div className="w-px h-6 bg-slate-200 mx-1" />

      {/* Formatting */}
      <div className="flex items-center gap-1">
        <button 
          onClick={() => onChange({ isBold: !settings.isBold })}
          className={`p-2 rounded-lg transition-all ${settings.isBold ? 'bg-primary text-white shadow-sm' : 'hover:bg-slate-100 text-slate-600'}`}
          title="Gras"
        >
          <Bold size={18} />
        </button>
        <button 
          onClick={() => onChange({ isItalic: !settings.isItalic })}
          className={`p-2 rounded-lg transition-all ${settings.isItalic ? 'bg-primary text-white shadow-sm' : 'hover:bg-slate-100 text-slate-600'}`}
          title="Italique"
        >
          <Italic size={18} />
        </button>
      </div>

      <div className="w-px h-6 bg-slate-200 mx-1" />

      {/* Alignment */}
      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
        <button 
          onClick={() => onChange({ textAlign: 'left' })}
          className={`p-1.5 rounded transition-all ${settings.textAlign === 'left' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <AlignLeft size={18} />
        </button>
        <button 
          onClick={() => onChange({ textAlign: 'center' })}
          className={`p-1.5 rounded transition-all ${settings.textAlign === 'center' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <AlignCenter size={18} />
        </button>
        <button 
          onClick={() => onChange({ textAlign: 'justify' })}
          className={`p-1.5 rounded transition-all ${settings.textAlign === 'justify' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <AlignJustify size={18} />
        </button>
      </div>

      <div className="w-px h-6 bg-slate-200 mx-1" />

      {/* Compact Mode */}
      <button 
        onClick={() => onChange({ isCompact: !settings.isCompact })}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
          settings.isCompact 
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        {settings.isCompact ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        {settings.isCompact ? 'MODE COMPACT ACTIF' : 'MODE COMPACT'}
      </button>
    </div>
  );
};
