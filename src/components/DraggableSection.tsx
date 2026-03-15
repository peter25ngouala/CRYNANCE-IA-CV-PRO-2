import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Move } from 'lucide-react';

interface DraggableSectionProps {
  id: string;
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

export const DraggableSection = ({ id, children, onRemove, className = "" }: DraggableSectionProps) => {
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
    <div ref={setNodeRef} style={style} className={`group relative ${className}`}>
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute -left-8 top-2 p-1 bg-white border border-slate-200 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing no-print z-20"
        title="Déplacer la section"
      >
        <GripVertical size={16} className="text-slate-400" />
      </div>
      
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute -right-8 top-2 p-1 bg-white border border-slate-200 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50 no-print z-20"
          title="Supprimer la section"
        >
          <Trash2 size={16} />
        </button>
      )}

      {children}
    </div>
  );
};
