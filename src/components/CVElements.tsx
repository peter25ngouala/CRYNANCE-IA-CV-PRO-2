import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { CVData } from '../types';

export const Editable = ({ text, onSave, className, multiline = false, style }: { text: string, onSave: (val: string) => void, className?: string, multiline?: boolean, style?: React.CSSProperties }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);

  useEffect(() => {
    setValue(text);
  }, [text]);

  if (isEditing) {
    return multiline ? (
      <textarea 
        autoFocus
        className={`w-full p-1 border-2 border-blue-500 rounded outline-none bg-white text-slate-900 ${className}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => { setIsEditing(false); onSave(value); }}
        rows={4}
        style={style}
      />
    ) : (
      <input 
        autoFocus
        className={`w-full p-1 border-2 border-blue-500 rounded outline-none bg-white text-slate-900 ${className}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => { setIsEditing(false); onSave(value); }}
        style={style}
      />
    );
  }

  return (
    <span 
      onClick={() => setIsEditing(true)} 
      className={`cursor-text hover:bg-slate-100/50 transition-colors rounded px-1 -mx-1 ${className}`}
      style={style}
    >
      {text || <span className="text-slate-300 italic">Cliquez pour éditer</span>}
    </span>
  );
};

export const SkillBarSVG = ({ name, level, color }: { name: string, level: number, color: string }) => (
  <div className="mb-3">
    <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-tighter">
      <span>{name}</span>
      <span>{level}%</span>
    </div>
    <svg width="100%" height="6" className="rounded-full bg-slate-100">
      <rect width={`${level}%`} height="6" fill={color} rx="3" />
    </svg>
  </div>
);

export const SectionHeader = ({ title, icon: Icon, color, variant, onAIEdit }: { title: string, icon?: any, color: string, variant: string, onAIEdit?: () => void }) => {
  const AIButton = () => onAIEdit ? (
    <button 
      onClick={(e) => { e.stopPropagation(); onAIEdit(); }}
      className="ml-auto p-1 rounded-full hover:bg-black/5 transition-colors group/ai no-print"
      title="Améliorer cette section avec l'IA"
    >
      <Sparkles size={10} className="text-current opacity-30 group-hover/ai:opacity-100 transition-opacity" />
    </button>
  ) : null;

  // Standardized style for all variants to ensure strict consistency
  const titleStyle = "text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-2";
  const containerMargin = "mb-3 mt-1";

  if (variant === 'boxed') {
    return (
      <div className={`flex items-center gap-2 p-1.5 border-l-2 ${containerMargin}`} style={{ borderColor: color, backgroundColor: `${color}08` }}>
        {Icon && <Icon size={12} style={{ color }} />}
        <h3 className={titleStyle} style={{ color }}>{title}</h3>
        <AIButton />
      </div>
    );
  }
  if (variant === 'underlined') {
    return (
      <div className={`flex items-center justify-between border-b pb-1 ${containerMargin}`} style={{ borderColor: `${color}30` }}>
        <div className="flex items-center gap-2">
          {Icon && <Icon size={12} style={{ color }} />}
          <h3 className={titleStyle} style={{ color }}>{title}</h3>
        </div>
        <AIButton />
      </div>
    );
  }
  if (variant === 'pill') {
    return (
      <div className={`flex items-center justify-between px-3 py-1 rounded-sm ${containerMargin}`} style={{ backgroundColor: color, color: '#fff' }}>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.15em]">{title}</h3>
        <AIButton />
      </div>
    );
  }
  return (
    <div className={`flex items-center gap-2 ${containerMargin}`}>
      {Icon && <Icon size={12} style={{ color }} />}
      <h3 className={titleStyle} style={{ color }}>{title}</h3>
      <AIButton />
    </div>
  );
};

export const FillerContent = ({ color, title = "Compétences Additionnelles" }: { color: string, title?: string }) => (
  <section className="cv-section opacity-40 grayscale no-print">
    <SectionHeader title={title} color={color} variant="standard" />
    <div className="space-y-2 text-[10px] italic">
      <p>• Expertise en gestion de projet agile et outils collaboratifs</p>
      <p>• Maîtrise avancée de la suite Adobe Creative Cloud</p>
      <p>• Certification en cybersécurité et protection des données</p>
    </div>
  </section>
);
