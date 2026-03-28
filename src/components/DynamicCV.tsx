import React, { useState, useEffect, useRef } from 'react';
import { CVData } from '../types';
import * as Sidebar from '../templates/SidebarTemplates';
import * as Split from '../templates/SplitTemplates';
import * as Timeline from '../templates/TimelineTemplates';
import * as Card from '../templates/CardTemplates';
import * as Fluid from '../templates/FluidTemplates';
import { Settings, ChevronDown, ChevronUp, Type, Layout, FileText, Maximize2, RefreshCw } from 'lucide-react';
import { useAutoHeight } from '../hooks/useAutoHeight';

interface DynamicCVProps {
  data: CVData;
  styleId: string;
  onUpdate?: (data: Partial<CVData>) => void;
  onRemoveSection?: (id: string) => void;
  onAIModify?: (instruction: string) => void;
}

const TEMPLATE_MAP: Record<string, any> = {
  'template-1': Sidebar.Template1,
  'template-2': Sidebar.Template2,
  'template-3': Sidebar.Template3,
  'template-4': Sidebar.Template4,
  'template-5': Sidebar.Template5,
  'template-6': Sidebar.Template6,
  'template-7': Sidebar.Template7,
  'template-8': Sidebar.Template8,
  'template-9': Sidebar.Template9,
  'template-10': Sidebar.Template10,
  'template-11': Split.Template11,
  'template-12': Split.Template12,
  'template-13': Split.Template13,
  'template-14': Split.Template14,
  'template-15': Split.Template15,
  'template-16': Split.Template16,
  'template-17': Split.Template17,
  'template-18': Split.Template18,
  'template-19': Split.Template19,
  'template-20': Split.Template20,
  'template-21': Timeline.Template21,
  'template-22': Timeline.Template22,
  'template-23': Timeline.Template23,
  'template-24': Timeline.Template24,
  'template-25': Timeline.Template25,
  'template-26': Timeline.Template26,
  'template-27': Timeline.Template27,
  'template-28': Timeline.Template28,
  'template-29': Timeline.Template29,
  'template-30': Timeline.Template30,
  'template-31': Card.Template31,
  'template-32': Card.Template32,
  'template-33': Card.Template33,
  'template-34': Card.Template34,
  'template-35': Card.Template35,
  'template-36': Card.Template36,
  'template-37': Card.Template37,
  'template-38': Card.Template38,
  'template-39': Card.Template39,
  'template-40': Card.Template40,
  'template-56': Fluid.Template56,
};

export const DynamicCV: React.FC<DynamicCVProps> = ({ data, styleId, onUpdate, onAIModify }) => {
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  const handleUpdate = (update: Partial<CVData>) => {
    if (onUpdate) onUpdate(update);
  };

  const { layoutSettings, setLayoutSettings, forceFit } = useAutoHeight({
    cvRef,
    data,
    onUpdate: handleUpdate
  });

  // Mock data if empty
  const displayData = (!data.firstName && !data.lastName) ? {
    ...data,
    firstName: "Jean",
    lastName: "Dupont",
    jobTitle: "Directeur Marketing & Stratégie",
    email: "jean.dupont@example.com",
    phone: "+33 6 12 34 56 78",
    address: "Paris, France",
    profile: "Expert en marketing stratégique avec plus de 12 ans d'expérience dans la direction de départements créatifs. Spécialiste de la transformation digitale et de l'optimisation de la performance de marque. Orienté résultats avec une forte capacité à fédérer des équipes pluridisciplinaires autour de projets innovants.",
    skills: ["Stratégie de Marque", "Marketing Digital", "Management d'Équipe", "Analyse de Données", "SEO/SEA", "Growth Hacking", "Communication de Crise"],
    itSkills: ["Adobe Creative Suite", "Google Analytics", "Salesforce", "HubSpot", "Tableau", "Python (Data Science)"],
    experiences: [
      { company: "Global Tech Corp", position: "Directeur Marketing", startDate: "2018", endDate: "Présent", description: "Direction d'une équipe de 25 personnes. Augmentation du CA de 40% sur 3 ans par la mise en place d'une stratégie omnicanale. Gestion d'un budget annuel de 5M€." },
      { company: "Creative Agency", position: "Chef de Groupe", startDate: "2014", endDate: "2018", description: "Gestion de comptes clés internationaux (Budget > 5M€). Supervision de campagnes publicitaires primées." }
    ],
    education: [
      { school: "HEC Paris", degree: "Master en Management", year: "2013" },
      { school: "Sorbonne Université", degree: "Licence en Économie", year: "2011" }
    ],
    languagesList: [
      { name: "Français", level: "Maternel" }, 
      { name: "Anglais", level: "Bilingue (C2)" },
      { name: "Espagnol", level: "Courant (B2)" }
    ],
    qualities: ["Leadership", "Créativité", "Rigueur", "Adaptabilité", "Esprit d'analyse"],
    interests: ["Échecs", "Voile", "Intelligence Artificielle", "Photographie argentique"]
  } : data;

  const parts = (styleId || 'template-1-sans-sans').split('-');
  const templateId = `${parts[0]}-${parts[1]}`;
  
  const getFonts = (id: string) => {
    // If manual textStyle is provided, use it
    if (data.textStyle?.fontFamily) {
      const fontMap: Record<string, string> = {
        'Lato': 'font-lato',
        'Roboto': 'font-roboto',
        'Montserrat': 'font-montserrat',
        'Inter': 'font-sans'
      };
      return { heading: fontMap[data.textStyle.fontFamily] || 'font-sans', body: fontMap[data.textStyle.fontFamily] || 'font-sans' };
    }

    switch(id) {
      case 'sans-sans': return { heading: 'font-sans', body: 'font-sans' };
      case 'serif-serif': return { heading: 'font-display', body: 'font-lora' };
      case 'serif-sans': return { heading: 'font-display', body: 'font-sans' };
      case 'sans-serif': return { heading: 'font-sans', body: 'font-lora' };
      case 'mono-sans': return { heading: 'font-mono', body: 'font-sans' };
      case 'display-sans': return { heading: 'font-display', body: 'font-sans' };
      case 'display-serif': return { heading: 'font-display', body: 'font-lora' };
      case 'condensed-sans': return { heading: 'font-montserrat font-bold uppercase tracking-wider', body: 'font-sans' };
      case 'slab-sans': return { heading: 'font-slab', body: 'font-sans' };
      case 'light-serif': return { heading: 'font-sans font-light', body: 'font-lora' };
      default: return { heading: 'font-sans', body: 'font-sans' };
    }
  };

  const { heading: headingFont, body: bodyFont } = getFonts(parts[2] || 'sans-sans');

  // Apply manual textStyle settings if they exist
  const fontSize = data.textStyle?.fontSize || layoutSettings.fontSize;
  const lineHeight = data.textStyle?.lineHeight || layoutSettings.spacing;
  const textAlign = data.textStyle?.textAlign || 'left';
  const fontWeight = data.textStyle?.isBold ? 'font-bold' : '';
  const fontStyle = data.textStyle?.isItalic ? 'italic' : '';
  const isCompact = data.textStyle?.isCompact || false;

  const isShortVersion = data.isShortVersion || false;
  const hiddenSections = data.hiddenSections || [];
  const sectionOrder = data.sectionOrder || ['profile', 'experiences', 'education', 'skills', 'itSkills', 'languages', 'interests', 'qualities', 'flaws'];

  const Template = TEMPLATE_MAP[templateId] || Sidebar.Template1;

  return (
    <div className="relative group">
      {layoutSettings.hasOverflow && !data.isLongFormat && (
        <div className="absolute -top-16 left-0 right-0 flex justify-center z-50 animate-bounce">
          <button 
            onClick={() => handleUpdate({ isLongFormat: true })}
            className="bg-red-600 text-white px-6 py-2 rounded-full shadow-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all"
          >
            <Maximize2 size={18} />
            Passer en Format Long (2 pages)
          </button>
        </div>
      )}

      {showLayoutMenu && (
        <div className="absolute top-0 right-[-320px] w-72 bg-white shadow-2xl rounded-2xl p-6 z-50 border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Mise en page</h3>
            <button onClick={() => setShowLayoutMenu(false)} className="text-slate-400 hover:text-slate-600">×</button>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Maximize2 size={18} className="text-slate-600" />
                <span className="text-xs font-bold text-slate-700">Version Courte</span>
              </div>
              <button 
                onClick={() => handleUpdate({ isShortVersion: !isShortVersion })}
                className={`w-10 h-5 rounded-full transition-colors relative ${isShortVersion ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isShortVersion ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Taille de police ({fontSize}pt)</label>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleUpdate({ textStyle: { ...(data.textStyle || {} as any), fontSize: Math.max(8, fontSize - 0.5) } })}
                  className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <ChevronDown size={16} />
                </button>
                <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${((fontSize - 8) / 6) * 100}%` }} />
                </div>
                <button 
                  onClick={() => handleUpdate({ textStyle: { ...(data.textStyle || {} as any), fontSize: Math.min(14, fontSize + 0.5) } })}
                  className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <ChevronUp size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Espacement ({lineHeight.toFixed(1)}x)</label>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleUpdate({ textStyle: { ...(data.textStyle || {} as any), lineHeight: Math.max(1, lineHeight - 0.1) } })}
                  className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <ChevronDown size={16} />
                </button>
                <button 
                  onClick={() => handleUpdate({ textStyle: { ...(data.textStyle || {} as any), lineHeight: Math.min(2, lineHeight + 0.1) } })}
                  className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <ChevronUp size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-slate-600" />
                <span className="text-xs font-bold text-slate-700">Format Long (2 pages)</span>
              </div>
              <button 
                onClick={() => handleUpdate({ isLongFormat: !data.isLongFormat })}
                className={`w-10 h-5 rounded-full transition-colors relative ${data.isLongFormat ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${data.isLongFormat ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            <button 
              onClick={() => {
                forceFit();
                setShowLayoutMenu(false);
              }}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} />
              Mise en Page Automatique
            </button>
          </div>

          <button 
            onClick={() => {
              setLayoutSettings({ fontSize: 11, spacing: 1.2, sectionSpacing: 24, isTwoColumn: false, hasOverflow: false });
              handleUpdate({ isLongFormat: false, textStyle: undefined, isShortVersion: false, hiddenSections: [] });
              setShowLayoutMenu(false);
            }}
            className="w-full mt-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      )}

      <div 
        ref={cvRef}
        id="cv-canvas"
        className={`cv-a4-container ${bodyFont} ${fontWeight} ${fontStyle} cv-compact`} 
        style={{ 
          '--cv-font-size': `${fontSize}pt`,
          '--cv-line-height': lineHeight || 1.2,
          textAlign: textAlign as any,
          '--cv-padding': '1.5rem',
          '--cv-section-spacing': `${layoutSettings.sectionSpacing}px`,
          '--cv-item-spacing': '0.5rem'
        } as React.CSSProperties}
      >
        <Template 
          data={{
            ...displayData,
            hiddenSections,
            sectionOrder
          }} 
          handleUpdate={handleUpdate} 
          headingFont={headingFont} 
          bodyFont={bodyFont}
          layoutSettings={{ ...layoutSettings, fontSize, spacing: lineHeight, sectionSpacing: layoutSettings.sectionSpacing }}
          onAIModify={onAIModify}
        />
      </div>

      
      <button 
        onClick={() => setShowLayoutMenu(!showLayoutMenu)}
        className="absolute bottom-4 right-4 p-3 bg-white shadow-lg rounded-full text-slate-600 hover:text-primary transition-all no-print"
      >
        <Settings size={24} />
      </button>
    </div>
  );
};


