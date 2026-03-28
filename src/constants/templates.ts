export type TemplateCategory = 'Professionnel' | 'Moderne' | 'Créatif' | 'Exécutif' | 'Minimaliste' | 'Technique';

export interface TemplateInfo {
  id: string;
  name: string;
  category: string;
  isPremium: boolean;
  baseTemplate: string;
  color: string;
  plan: 'Flash' | 'Pro';
  thumbnail?: string;
}

const LAYOUTS = ['sidebarLeft', 'classic', 'modernTiled', 'timelineCentral'];
const THEMES = [
  { key: 'navy-gold', name: 'Marine & Or', color: '#1e3a8a' },
  { key: 'anthracite-white', name: 'Anthracite', color: '#334155' },
  { key: 'bordeaux-gray', name: 'Bordeaux', color: '#7f1d1d' },
  { key: 'emerald-slate', name: 'Émeraude', color: '#065f46' },
  { key: 'royal-silver', name: 'Royal', color: '#1e40af' },
  { key: 'forest-cream', name: 'Forêt', color: '#14532d' },
  { key: 'midnight-neon', name: 'Midnight', color: '#0f172a' },
  { key: 'minimal-black', name: 'Minimal Black', color: '#000000' },
  { key: 'modern-purple', name: 'Améthyste', color: '#581c87' },
  { key: 'ocean-teal', name: 'Océan', color: '#164e63' },
  { key: 'slate-blue', name: 'Ardoise', color: '#475569' },
  { key: 'rose-gold', name: 'Rose Gold', color: '#be185d' },
  { key: 'amber-dark', name: 'Ambre', color: '#92400e' },
  { key: 'cyan-deep', name: 'Cyan', color: '#0e7490' },
  { key: 'violet-soft', name: 'Violet', color: '#6d28d9' },
  { key: 'gray-cool', name: 'Gris Froid', color: '#374151' },
  { key: 'teal-dark', name: 'Teal', color: '#0f766e' },
  { key: 'indigo-rich', name: 'Indigo', color: '#4338ca' },
  { key: 'orange-burnt', name: 'Orange Brûlé', color: '#c2410c' },
  { key: 'lime-fresh', name: 'Lime', color: '#4d7c0f' },
];
const FONTS = [
  'sans-sans', 
  'serif-serif', 
  'serif-sans', 
  'sans-serif', 
  'mono-sans', 
  'display-sans', 
  'display-serif', 
  'condensed-sans', 
  'slab-sans', 
  'light-serif'
];

const CATEGORIES = ['Professionnel', 'Moderne', 'Créatif', 'Exécutif', 'Minimaliste', 'Technique'];

const generateTemplates = (): TemplateInfo[] => {
  const templates: TemplateInfo[] = [];
  
  // 1-10: Sidebar
  // 11-20: Modern split
  // 21-30: Timeline
  // 31-40: Tiled cards
  // 56: Executive
  
  const layouts = ['sidebar', 'split', 'timeline', 'cards', 'minimal', 'fluid'];
  const categories: TemplateCategory[] = ['Professionnel', 'Moderne', 'Créatif', 'Exécutif', 'Minimaliste', 'Technique'];

  for (let i = 1; i <= 56; i++) {
    if (i >= 41 && i <= 55) continue; // Skip removed templates (41-50 and 51-55)

    const layoutIndex = i <= 40 ? Math.floor((i - 1) / 10) : 5;
    const layout = layouts[layoutIndex];
    const isPremium = i > 5;
    
    templates.push({
      id: `template-${i}`,
      name: i === 56 ? "The Executive" : `Design Unique #${i}`,
      category: i === 56 ? 'Exécutif' : categories[i % categories.length],
      isPremium,
      baseTemplate: layout,
      color: '#000000', // Placeholder, colors are defined in the component
      plan: isPremium ? 'Pro' : 'Flash'
    });
  }

  return templates;
};

export const ALL_TEMPLATES: TemplateInfo[] = generateTemplates();
