import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Move, EyeOff, Eye } from 'lucide-react';

interface DraggableSectionProps {
  id: string;
  children: React.ReactNode;
  onRemove?: () => void;
  onToggleVisibility?: () => void;
  isHidden?: boolean;
  className?: string;
}

export const DraggableSection = ({ id, children, onRemove, onToggleVisibility, isHidden, className = "" }: DraggableSectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`group relative ${className} ${isHidden ? 'opacity-30 grayscale' : ''}`}>
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute -left-8 top-2 p-1 bg-white border border-slate-200 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing no-print z-20"
        title="Déplacer la section"
      >
        <GripVertical size={16} className="text-slate-400" />
      </div>
      
      <div className="absolute -right-8 top-2 flex flex-col gap-1 no-print z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        {onToggleVisibility && (
          <button
            onClick={onToggleVisibility}
            className={`p-1 bg-white border border-slate-200 rounded shadow-sm transition-colors ${isHidden ? 'text-blue-500 hover:bg-blue-50' : 'text-slate-400 hover:bg-slate-50'}`}
            title={isHidden ? "Afficher la section" : "Masquer la section"}
          >
            {isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}

        {onRemove && (
          <button
            onClick={onRemove}
            className="p-1 bg-white border border-slate-200 rounded shadow-sm text-red-500 hover:bg-red-50"
            title="Supprimer la section"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className={isHidden ? 'no-print hidden' : ''}>
        {children}
      </div>
    </div>
  );
};
