import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ZoomIn, ZoomOut, Maximize2, Minimize2, 
  ChevronLeft, ChevronRight, Download, 
  FileText, Sparkles, Palette, Type, 
  Layout, Settings, Save, Share2,
  Printer, Trash2, GripVertical,
  Plus, RefreshCw, Loader2, CheckCircle2
} from 'lucide-react';
import { CVData, TextStyleSettings } from '../types';
import { AdvancedCVCanvasEditor } from './AdvancedCVCanvasEditor';
import { ALL_TEMPLATES } from '../constants/templates';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CanvaStyleEditorProps {
  data: CVData;
  onChange: (newData: Partial<CVData>) => void;
  onAIModify: (prompt: string) => void;
  onSave: () => void;
  onExportPDF: () => void;
  onExportWord: () => void;
  isSaving: boolean;
  isExporting: boolean;
  score: any;
  isScoring: boolean;
}

export const CanvaStyleEditor = ({
  data,
  onChange,
  onAIModify,
  onSave,
  onExportPDF,
  onExportWord,
  isSaving,
  isExporting,
  score,
  isScoring
}: CanvaStyleEditorProps) => {
  const [zoom, setZoom] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'templates' | 'style' | 'ai' | 'sections'>('templates');
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [aiInstruction, setAiInstruction] = useState('');

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoom(1);

  const ensureThreeExperiences = () => {
    const currentExps = data.experiences || [];
    if (currentExps.length >= 3) return;

    const mockExps = [
      {
        company: "Tech Solutions Global",
        position: "Chef de Projet Digital",
        startDate: "2021",
        endDate: "Présent",
        description: "Gestion de projets transverses, coordination d'équipes agiles et optimisation des processus métiers."
      },
      {
        company: "Innov'Action",
        position: "Consultant Stratégie",
        startDate: "2018",
        endDate: "2021",
        description: "Accompagnement des entreprises dans leur transformation numérique et analyse de performance."
      },
      {
        company: "StartUp Lab",
        position: "Analyste Business",
        startDate: "2016",
        endDate: "2018",
        description: "Développement de modèles prédictifs et support à la prise de décision stratégique."
      }
    ];

    const needed = 3 - currentExps.length;
    const newExps = [...currentExps, ...mockExps.slice(0, needed)];
    onChange({ experiences: newExps });
  };

  const toggleSection = (sectionId: string) => {
    const currentHidden = data.hiddenSections || [];
    if (currentHidden.includes(sectionId)) {
      onChange({ hiddenSections: currentHidden.filter(id => id !== sectionId) });
    } else {
      onChange({ hiddenSections: [...currentHidden, sectionId] });
    }
  };

  const sections = [
    { id: 'profile', label: 'Profil / Résumé' },
    { id: 'experiences', label: 'Expériences' },
    { id: 'education', label: 'Formation' },
    { id: 'skills', label: 'Compétences' },
    { id: 'itSkills', label: 'Outils Informatiques' },
    { id: 'languages', label: 'Langues' },
    { id: 'interests', label: 'Centres d\'intérêt' },
    { id: 'qualities', label: 'Qualités' },
  ];

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // PDF Export Logic with Hidden Container
  const stabilizedExportPDF = async () => {
    const cvElement = document.getElementById('cv-canvas');
    if (!cvElement) return;

    // Create hidden capture container
    const captureContainer = document.createElement('div');
    captureContainer.style.position = 'absolute';
    captureContainer.style.left = '-9999px';
    captureContainer.style.top = '-9999px';
    captureContainer.style.width = '210mm'; // Fixed A4 Width
    captureContainer.style.backgroundColor = 'white';
    captureContainer.id = 'pdf-capture-container';
    
    // Clone the CV
    const clone = cvElement.cloneNode(true) as HTMLElement;
    clone.style.transform = 'none';
    clone.style.width = '100%';
    clone.style.height = 'auto';
    clone.style.margin = '0';
    clone.style.padding = '0';
    clone.style.boxShadow = 'none';
    
    // Apply PDF-specific CSS to the clone
    const style = document.createElement('style');
    style.innerHTML = `
      #pdf-capture-container * {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      #pdf-capture-container .cv-section {
        margin-bottom: 20px !important;
        break-inside: avoid !important;
      }
      #pdf-capture-container p, #pdf-capture-container li {
        line-height: 1.5 !important;
      }
    `;
    
    captureContainer.appendChild(style);
    captureContainer.appendChild(clone);
    document.body.appendChild(captureContainer);

    try {
      // Wait for fonts/images
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(captureContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: captureContainer.offsetWidth,
        height: captureContainer.offsetHeight,
        windowWidth: captureContainer.offsetWidth,
        windowHeight: captureContainer.offsetHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(`${data.firstName}_${data.lastName}_CV.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
    } finally {
      document.body.removeChild(captureContainer);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-200 overflow-hidden font-sans">
      {/* Top Header Bar */}
      <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="text-white" size={18} />
            </div>
            <span className="font-black tracking-tighter text-lg">CRYNANCE <span className="text-primary">STUDIO</span></span>
          </div>
          <div className="h-6 w-[1px] bg-slate-700 mx-2" />
          <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-xs font-medium text-slate-400">{data.firstName} {data.lastName} - CV</span>
            <Settings size={14} className="text-slate-500" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-700 mr-4">
            <button 
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button 
              onClick={handleResetZoom}
              className="px-2 text-[10px] font-bold text-slate-400 hover:text-white transition-colors"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button 
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          <button 
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Sauvegarder
          </button>

          <div className="flex items-center gap-2">
            <button 
              onClick={onExportWord}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              <FileText size={14} />
              Word
            </button>
            <button 
              onClick={stabilizedExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              Télécharger PDF
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <aside className="w-16 bg-slate-800 border-r border-slate-700 flex flex-col items-center py-4 gap-4">
          {[
            { id: 'templates', icon: Layout, label: 'Modèles' },
            { id: 'style', icon: Palette, label: 'Style' },
            { id: 'sections', icon: Type, label: 'Contenu' },
            { id: 'ai', icon: Sparkles, label: 'IA Magic' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setIsSidebarOpen(true);
              }}
              className={`w-12 h-12 flex flex-col items-center justify-center rounded-xl transition-all gap-1 ${activeTab === item.id ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
            >
              <item.icon size={20} />
              <span className="text-[8px] font-bold uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Retractable Sidebar Content */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-slate-800 border-r border-slate-700 flex flex-col overflow-hidden relative"
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-700">
                <h2 className="font-bold text-sm uppercase tracking-widest text-slate-300">
                  {activeTab === 'templates' && 'Modèles de CV'}
                  {activeTab === 'style' && 'Personnalisation'}
                  {activeTab === 'sections' && 'Structure du CV'}
                  {activeTab === 'ai' && 'Assistant IA'}
                </h2>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-500"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {activeTab === 'templates' && (
                  <div className="grid grid-cols-2 gap-3">
                    {ALL_TEMPLATES.map(template => (
                      <button
                        key={template.id}
                        onClick={() => onChange({ template: template.id })}
                        className={`group relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${data.template === template.id ? 'border-primary' : 'border-slate-700 hover:border-slate-500'}`}
                      >
                        <img 
                          src={template.thumbnail} 
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <span className="text-[10px] font-bold text-white truncate">{template.name}</span>
                        </div>
                        {data.template === template.id && (
                          <div className="absolute top-1 right-1 bg-primary text-white p-1 rounded-full shadow-lg">
                            <CheckCircle2 size={10} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === 'style' && (
                  <div className="space-y-6">
                    <section>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Format de Page</label>
                      <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-700">
                        <button 
                          onClick={() => onChange({ isLongFormat: false })}
                          className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${!data.isLongFormat ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          1 Page (A4)
                        </button>
                        <button 
                          onClick={() => onChange({ isLongFormat: true })}
                          className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${data.isLongFormat ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          2 Pages
                        </button>
                      </div>
                    </section>

                    <section>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Typographie</label>
                      <div className="grid grid-cols-1 gap-2">
                        {['Inter', 'Roboto', 'Playfair Display', 'Montserrat', 'Open Sans'].map(font => (
                          <button
                            key={font}
                            onClick={() => onChange({ textStyle: { ...(data.textStyle || {} as TextStyleSettings), fontFamily: font } as TextStyleSettings })}
                            className={`px-4 py-2.5 rounded-xl text-left text-xs font-medium transition-all border ${data.textStyle?.fontFamily === font ? 'bg-primary/10 border-primary text-primary' : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                            style={{ fontFamily: font }}
                          >
                            {font}
                          </button>
                        ))}
                      </div>
                    </section>

                    <section>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Taille du Texte</label>
                      <div className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                        <input 
                          type="range" 
                          min="8" 
                          max="16" 
                          step="0.5"
                          value={data.textStyle?.fontSize || 11}
                          onChange={(e) => onChange({ textStyle: { ...(data.textStyle || {} as TextStyleSettings), fontSize: parseFloat(e.target.value) } as TextStyleSettings })}
                          className="flex-1 accent-primary"
                        />
                        <span className="text-xs font-bold text-slate-300 w-8">{data.textStyle?.fontSize || 11}px</span>
                      </div>
                    </section>

                    <section>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Espacement Lignes</label>
                      <div className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                        <input 
                          type="range" 
                          min="1" 
                          max="2" 
                          step="0.1"
                          value={data.textStyle?.lineHeight || 1.5}
                          onChange={(e) => onChange({ textStyle: { ...(data.textStyle || {} as TextStyleSettings), lineHeight: parseFloat(e.target.value) } as TextStyleSettings })}
                          className="flex-1 accent-primary"
                        />
                        <span className="text-xs font-bold text-slate-300 w-8">{data.textStyle?.lineHeight || 1.5}</span>
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === 'sections' && (
                  <div className="space-y-4">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-4">Visibilité des Sections</p>
                    {sections.map(section => (
                      <div 
                        key={section.id}
                        className="flex items-center justify-between p-3 bg-slate-900/30 border border-slate-700 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical size={14} className="text-slate-600" />
                          <span className="text-xs font-medium text-slate-300">{section.label}</span>
                        </div>
                        <button 
                          onClick={() => toggleSection(section.id)}
                          className={`w-8 h-4 rounded-full relative transition-colors ${!(data.hiddenSections || []).includes(section.id) ? 'bg-primary' : 'bg-slate-700'}`}
                        >
                          <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${!(data.hiddenSections || []).includes(section.id) ? 'right-0.5' : 'left-0.5'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div className="space-y-4">
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-primary" size={16} />
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Optimisation Magique</h3>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                        L'IA va reformuler vos expériences, corriger les fautes et optimiser votre score ATS en un clic.
                      </p>
                      <button 
                        onClick={() => onAIModify('Optimise mon CV pour un score ATS maximal')}
                        className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCw size={14} />
                        Lancer l'Optimisation
                      </button>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Plus className="text-emerald-500" size={16} />
                        <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Remplissage Auto</h3>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                        Ajoutez automatiquement des expériences pertinentes si votre CV est trop vide.
                      </p>
                      <button 
                        onClick={ensureThreeExperiences}
                        className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles size={14} />
                        Compléter à 3 Expériences
                      </button>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Instruction Personnalisée</label>
                      <textarea 
                        value={aiInstruction}
                        onChange={(e) => setAiInstruction(e.target.value)}
                        placeholder="Ex: Rends mon profil plus créatif..."
                        className="w-full h-24 bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none mb-3"
                      />
                      <button 
                        onClick={() => {
                          if (aiInstruction.trim()) {
                            onAIModify(aiInstruction);
                            setAiInstruction('');
                          }
                        }}
                        className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all"
                      >
                        Appliquer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Workspace */}
        <main 
          ref={workspaceRef}
          className="flex-1 bg-slate-200 relative overflow-auto flex justify-center items-start p-12 custom-scrollbar"
        >
          {/* Floating Toggle Button when sidebar is closed */}
          {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="absolute left-4 top-4 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-600 hover:text-primary transition-colors z-40"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Floating Fullscreen Button */}
          <button 
            onClick={toggleFullScreen}
            className="absolute right-4 top-4 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-600 hover:text-primary transition-colors z-40"
          >
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          {/* The CV Sheet */}
          <div 
            className="transition-transform duration-300 ease-out origin-top"
            style={{ 
              transform: `scale(${zoom})`,
              marginBottom: '100px'
            }}
          >
            <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm overflow-hidden">
              <AdvancedCVCanvasEditor 
                data={data}
                onChange={onChange}
                onAIModify={(prompt) => onAIModify(prompt)}
              />
            </div>
          </div>

          {/* Floating Score Badge */}
          <div className="fixed bottom-8 right-8 z-50">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-4"
            >
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
                  <circle 
                    cx="24" cy="24" r="20" stroke={score?.score >= 70 ? "#10b981" : "#f59e0b"} 
                    strokeWidth="4" fill="transparent" 
                    strokeDasharray={125.6} 
                    strokeDashoffset={125.6 - ((score?.score || 0) / 100) * 125.6}
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute text-xs font-black text-slate-800">{score?.score || 0}</span>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Score ATS</div>
                <div className="text-xs font-bold text-slate-800">
                  {score?.score >= 70 ? 'Excellent Profil' : 'À Améliorer'}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};
