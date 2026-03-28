import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Download, FileText, FileDown, CheckCircle2, AlertCircle, Sparkles, Loader2, ChevronLeft, Save, Zap, Edit3, RefreshCw, Mail, Phone, MapPin, Globe, Star, Maximize2, Plus, Languages, Cpu, CheckCircle, Heart, X, Search, Filter } from 'lucide-react';
import { api } from '../services/api';
import { TextStyleToolbar } from '../components/TextStyleToolbar';
import { CVData, CVScore, TextStyleSettings } from '../types';
import { scoreCV, generateProfessionalCV, modifyCVWithAI } from '../services/geminiService';
import { storage } from '../utils/storage';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { getDefaultLayout } from '../utils/cvLayout';
import { DraggableSection } from '../components/DraggableSection';
import { DynamicCV } from '../components/DynamicCV';
import { AdvancedCVCanvasEditor } from '../components/AdvancedCVCanvasEditor';
import { ALL_TEMPLATES, TemplateCategory } from '../constants/templates';
import { CanvaStyleEditor } from '../components/CanvaStyleEditor';

// @ts-ignore
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

const CircularScore = ({ score, isScoring }: { score: number, isScoring: boolean }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const currentScore = score || 0;
  const offset = circumference - (currentScore / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-slate-100"
        />
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: isScoring ? circumference : offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={score >= 70 ? "text-emerald-500" : score >= 40 ? "text-amber-500" : "text-rose-500"}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        {isScoring ? (
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        ) : (
          <>
            <span className="text-2xl font-black text-slate-800">{score}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Score ATS</span>
          </>
        )}
      </div>
    </div>
  );
};

const testData: CVData = {
  firstName: "Jean",
  lastName: "Dupont",
  jobTitle: "Responsable Marketing Digital",
  email: "jean.dupont@email.com",
  phone: "+33 6 12 34 56 78",
  address: "Paris, France",
  profile: "Expert en marketing digital avec plus de 8 ans d'expérience dans la gestion de campagnes multi-canaux. Passionné par l'analyse de données et l'optimisation du ROI, j'ai accompagné de nombreuses entreprises dans leur croissance numérique.",
  experiences: [
    {
      company: "Tech Solutions SAS",
      position: "Senior Marketing Manager",
      startDate: "2020",
      endDate: "Présent",
      description: "• Direction de l'équipe marketing (5 personnes)\n• Augmentation du trafic organique de 150% en 2 ans\n• Gestion d'un budget annuel de 200k€"
    },
    {
      company: "Digital Agency",
      position: "Social Media Specialist",
      startDate: "2017",
      endDate: "2020",
      description: "• Gestion des réseaux sociaux pour 10 clients grands comptes\n• Création de contenus viraux et gestion de l'e-réputation\n• Analyse des performances et reporting mensuel"
    }
  ],
  education: [
    {
      school: "HEC Paris",
      degree: "Master en Marketing & Stratégie",
      year: "2017"
    },
    {
      school: "Université Paris-Dauphine",
      degree: "Licence en Gestion",
      year: "2015"
    }
  ],
  skills: ["SEO/SEA", "Google Analytics", "Stratégie de contenu", "Gestion d'équipe", "Copywriting"],
  languagesList: [
    { name: "Français", level: "Maternel" },
    { name: "Anglais", level: "C1 - Avancé" },
    { name: "Espagnol", level: "B2 - Intermédiaire" }
  ],
  qualities: ["Analytique", "Créatif", "Leadership", "Adaptabilité"],
  flaws: ["Perfectionniste", "Parfois trop direct"],
  language: 'fr',
  itSkills: ["Suite Adobe", "Salesforce", "HubSpot", "WordPress"],
  interests: ["Voyages", "Photographie", "Intelligence Artificielle", "Tennis"],
  template: 'modern'
};

const mergeWithTestData = (data: CVData | null): CVData => {
  if (!data) return testData;
  
  const hasContent = (val: any) => {
    if (!val) return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'string') return val.trim().length > 0;
    return true;
  };

  return {
    ...testData,
    ...data,
    firstName: hasContent(data.firstName) ? data.firstName : testData.firstName,
    lastName: hasContent(data.lastName) ? data.lastName : testData.lastName,
    jobTitle: hasContent(data.jobTitle) ? data.jobTitle : testData.jobTitle,
    email: hasContent(data.email) ? data.email : testData.email,
    phone: hasContent(data.phone) ? data.phone : testData.phone,
    address: hasContent(data.address) ? data.address : testData.address,
    profile: hasContent(data.profile) ? data.profile : testData.profile,
    experiences: hasContent(data.experiences) ? data.experiences : testData.experiences,
    education: hasContent(data.education) ? data.education : testData.education,
    skills: hasContent(data.skills) ? data.skills : testData.skills,
    languagesList: hasContent(data.languagesList) ? data.languagesList : testData.languagesList,
    qualities: hasContent(data.qualities) ? data.qualities : testData.qualities,
    itSkills: hasContent(data.itSkills) ? data.itSkills : testData.itSkills,
    interests: hasContent(data.interests) ? data.interests : testData.interests,
    customSections: data.customSections || []
  };
};

const DEFAULT_TEXT_STYLE: TextStyleSettings = {
  fontFamily: 'Inter',
  fontSize: 11,
  lineHeight: 1.5,
  isBold: false,
  isItalic: false,
  textAlign: 'left',
  isCompact: false,
};

export default function CVPreview() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [score, setScore] = useState<CVScore | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [aiInstruction, setAiInstruction] = useState('');
  const [isOptimized, setIsOptimized] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'Tous'>('Tous');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [currentUser, setCurrentUser] = useState<any>(user);
  const navigate = useNavigate();
  const cvRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id: string) => {
    if (!cvData) return null;
    const layout = cvData.layout || getDefaultLayout(cvData.template);
    if (layout.left.includes(id)) return 'left' as const;
    if (layout.right.includes(id)) return 'right' as const;
    return null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !cvData) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      const layout = cvData.layout || getDefaultLayout(cvData.template);
      const activeContainer = findContainer(activeId);
      const overContainer = findContainer(overId);

      if (activeContainer && overContainer) {
        const activeIndex = layout[activeContainer].indexOf(activeId);
        const overIndex = layout[overContainer].indexOf(overId);

        let newLayout = { ...layout };
        if (activeContainer === overContainer) {
          newLayout[activeContainer] = arrayMove(layout[activeContainer], activeIndex, overIndex);
        } else {
          newLayout[activeContainer] = layout[activeContainer].filter(id => id !== activeId);
          newLayout[overContainer] = [
            ...layout[overContainer].slice(0, overIndex),
            activeId,
            ...layout[overContainer].slice(overIndex)
          ];
        }
        updateCV({ layout: newLayout });
      }
    }
  };

  const addCustomSection = (title: string = 'Nouvelle Section') => {
    if (!cvData) return;
    const sectionId = `custom_${Date.now()}`;
    const newCustom = [...(cvData.customSections || []), { id: sectionId, title, content: 'Contenu de la section...' }];
    const layout = cvData.layout || getDefaultLayout(cvData.template);
    const newLayout = {
      ...layout,
      right: [...layout.right, sectionId]
    };
    updateCV({ customSections: newCustom, layout: newLayout });
  };

  const removeSection = (id: string) => {
    if (!cvData) return;
    const layout = cvData.layout || getDefaultLayout(cvData.template);
    const newLayout = {
      left: layout.left.filter(s => s !== id),
      right: layout.right.filter(s => s !== id)
    };
    
    if (id.startsWith('custom_')) {
      const newCustom = cvData.customSections?.filter(s => s.id !== id);
      updateCV({ customSections: newCustom, layout: newLayout });
    } else {
      updateCV({ layout: newLayout });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (cvRef.current && cvRef.current.parentElement) {
        const containerWidth = cvRef.current.parentElement.offsetWidth;
        const scale = Math.min(1, (containerWidth - 40) / 794);
        cvRef.current.style.transform = `scale(${scale})`;
        // Adjust parent height to match scaled content
        cvRef.current.parentElement.style.height = `${1123 * scale + 40}px`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cvData]);

  const canDownload = () => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin' || currentUser.isPremium) return true;
    
    // Check for FLASH ATS specific limit
    if (currentUser.flashAtsExpiresAt && new Date(currentUser.flashAtsExpiresAt) > new Date()) {
      return (currentUser.cvDownloadsRemaining || 0) > 0;
    }
    
    return true; // Other plans have their own access control via isSubscribed
  };

  const consumeDownload = async () => {
    if (currentUser?.flashAtsExpiresAt && new Date(currentUser.flashAtsExpiresAt) > new Date()) {
      try {
        await api.auth.consumeCredit('download');
        await fetchProfile();
      } catch (err) {
        console.error("Error consuming download credit:", err);
      }
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.auth.getProfile();
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const getSubscriptionStatus = (templateId: string) => {
    if (!currentUser) return { active: false, expired: false };
    
    const templateInfo = ALL_TEMPLATES.find(t => t.id === templateId);
    if (templateInfo && !templateInfo.isPremium) return { active: true, expired: false };

    // Admin or Full Premium Access
    if (currentUser.role === 'admin' || currentUser.isPremium || currentUser.proExpiresAt || currentUser.eliteExpiresAt) {
      const expiry = currentUser.premiumExpiresAt || currentUser.proExpiresAt || currentUser.eliteExpiresAt;
      if (!expiry || new Date(expiry) > new Date()) return { active: true, expired: false };
    }
    
    const baseTemplate = templateInfo?.baseTemplate || templateId;

    // Plan Flash (500 FCFA) : Accès à 10 modèles classiques
    if (templateInfo?.plan === 'Flash') {
      if (currentUser.flashAtsExpiresAt && new Date(currentUser.flashAtsExpiresAt) > new Date()) {
        return { active: true, expired: false };
      }
    }

    // Individual/Legacy checks
    let expiry: string | null = null;
    
    if (baseTemplate === 'creative' || baseTemplate === 'creative-gradient' || baseTemplate === 'pink' || baseTemplate === 'creatif') {
      expiry = currentUser.creativeExpiresAt || currentUser.pinkExpiresAt;
    }
    else if (baseTemplate === 'classic' || baseTemplate === 'orange' || baseTemplate === 'dark' || baseTemplate === 'dark-gold' || baseTemplate === 'dark-minimal' || baseTemplate === 'executif' || baseTemplate === 'ats-friendly') {
      expiry = currentUser.classicExpiresAt || currentUser.orangeExpiresAt || currentUser.darkExpiresAt;
    }
    else if (baseTemplate === 'modern' || baseTemplate === 'blue' || baseTemplate === 'epure' || baseTemplate === 'pro-bleu') {
      expiry = currentUser.modernExpiresAt;
    }
    
    if (!expiry) return { active: false, expired: false };
    const active = new Date(expiry) > new Date();
    return { active, expired: !active };
  };

  const isSubscribed = (template: string) => getSubscriptionStatus(template).active;

  useEffect(() => {
    const parsed = storage.loadCV();
    if (parsed) {
      // Initialize sections if missing
      if (!parsed.sections) {
        parsed.sections = {
          contact: 'Contact',
          email: 'Email',
          phone: 'Téléphone',
          address: 'Adresse',
          skills: 'Compétences',
          itSkills: 'Informatique',
          experiences: 'Expériences',
          education: 'Formation',
          qualities: 'Qualités',
          flaws: 'Défauts',
          interests: 'Centres d\'intérêt',
          profile: 'Profil',
          divers: 'Divers',
          languages: 'Langues'
        };
      }
      
      if (!parsed.qualities) parsed.qualities = [];
      if (!parsed.flaws) parsed.flaws = [];
      if (!parsed.website) parsed.website = 'www.reallygreatsite.com';
      if (!parsed.textStyle) parsed.textStyle = DEFAULT_TEXT_STYLE;
      
      setCvData(parsed);
      handleScore(parsed);
    } else {
      navigate('/create-cv');
    }
  }, [navigate]);

  const handleScore = async (data: CVData) => {
    setIsScoring(true);
    try {
      const result = await scoreCV(data);
      setScore(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsScoring(false);
    }
  };

  const handleAIFill = async (currentData?: CVData) => {
    const dataToUse = currentData || cvData;
    if (!dataToUse) return;
    setIsGenerating(true);
    try {
      const improved = await generateProfessionalCV(dataToUse);
      // Preserve sections if they were already edited
      if (dataToUse.sections) {
        improved.sections = dataToUse.sections;
      }
      setCvData(improved);
      setIsOptimized(true);
      storage.saveCV(improved);
      handleScore(improved);
    } catch (error: any) {
      console.error("AI Optimization Error:", error);
      const msg = error.message || "";
      if (msg.includes("Clé API manquante")) {
        alert("La clé API Gemini n'est pas configurée dans Netlify.");
      } else {
        alert(`Erreur lors de l'optimisation par l'IA: ${msg || "Veuillez réessayer."}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleAIModify = async (instruction: string) => {
    if (!cvData || !instruction.trim()) return;
    setIsModifying(true);
    try {
      const updated = await modifyCVWithAI(cvData, instruction);
      setCvData(updated);
      storage.saveCV(updated);
      handleScore(updated);
      setAiInstruction('');
    } catch (error: any) {
      console.error("AI Modification Error:", error);
      alert(`Erreur lors de la modification par l'IA: ${error.message || "Veuillez réessayer."}`);
    } finally {
      setIsModifying(false);
    }
  };

  const updateCV = (newData: Partial<CVData>) => {
    if (!cvData) return;
    const updated = { ...cvData, ...newData };
    setCvData(updated);
    storage.saveCV(updated);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Veuillez vous connecter pour sauvegarder votre CV.");
      navigate('/login');
      return;
    }

    setIsSaving(true);
    try {
      const cvId = cvData?.id || Math.random().toString(36).substr(2, 9);
      const response = await api.cvs.save({
        id: cvId,
        data: { ...cvData, id: cvId },
        atsScore: score?.score,
        isOptimized: isOptimized
      });
      if (response.ok) {
        if (cvData) {
          const updated = { ...cvData, id: cvId };
          setCvData(updated);
          storage.saveCV(updated);
        }
        alert("CV sauvegardé avec succès !");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const printCV = async () => {
    if (!cvData) return;
    if (!isSubscribed(cvData.template)) {
      setShowPayModal(true);
      return;
    }
    if (!canDownload()) {
      alert("Vous avez déjà utilisé votre unique téléchargement inclus dans le pack FLASH ATS.");
      return;
    }
    await consumeDownload();
    window.print();
  };

  const exportPDF = async () => {
    if (!cvRef.current || !cvData) return;
    
    if (!isSubscribed(cvData.template)) {
      setShowPayModal(true);
      return;
    }

    if (!canDownload()) {
      alert("Vous avez déjà utilisé votre unique téléchargement inclus dans le pack FLASH ATS.");
      return;
    }

    setIsExporting(true);
    try {
      await consumeDownload();
      const element = cvRef.current;
      if (!element) return;
      
      // 1. Create a clone of the CV to avoid layout issues during capture
      const clone = element.cloneNode(true) as HTMLElement;
      
      // 2. Style the clone for full-height capture with EXACT A4 dimensions (96 DPI)
      // Width: 794px, Height: 1123px
      clone.style.position = 'absolute';
      clone.style.top = '-9999px';
      clone.style.left = '-9999px';
      clone.style.width = '794px'; 
      clone.style.height = '1123px';
      clone.style.minHeight = '1123px';
      clone.style.maxHeight = 'none';
      clone.style.overflow = 'visible'; 
      clone.style.display = 'block';
      clone.style.transform = 'none';
      clone.style.margin = '0';
      clone.style.padding = '0';
      clone.style.boxShadow = 'none';
      
      // Remove any scrollbars or overflow from the clone and its children
      const removeScroll = (el: HTMLElement) => {
        if (el.style) {
          el.style.overflow = 'visible';
          el.style.overflowX = 'visible';
          el.style.overflowY = 'visible';
          el.style.maxHeight = 'none';
          el.style.height = el.style.height || 'auto';
        }
        if (el.children) {
          Array.from(el.children).forEach(child => removeScroll(child as HTMLElement));
        }
      };
      removeScroll(clone);
      
      document.body.appendChild(clone);

      // Wait for images and fonts
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. Capture using html2canvas
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: clone.scrollHeight,
        windowWidth: 794,
        windowHeight: clone.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.body.querySelector('[style*="top: -9999px"]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.top = '0';
            clonedElement.style.left = '0';
            clonedElement.style.position = 'relative';
          }
          
          // Sanitize CSS for html2canvas
          const styles = clonedDoc.querySelectorAll('style');
          styles.forEach(style => {
            if (style.textContent) {
              style.textContent = style.textContent.replace(/oklch\([^)]+\)/g, '#000000');
              style.textContent = style.textContent.replace(/oklab\([^)]+\)/g, '#000000');
              style.textContent = style.textContent.replace(/color-mix\([^)]+\)/g, '#000000');
            }
          });
        }
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Force image to fit exactly on one A4 page
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      pdf.save(`${cvData?.firstName}_${cvData?.lastName}_CV.pdf`);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'export PDF. Veuillez réessayer.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      const res = await api.reviews.submit({ rating: reviewRating, content: reviewContent });
      if (res.ok) {
        alert("Merci pour votre avis ! Il sera visible après modération.");
        setShowReviewModal(false);
        setReviewContent('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const exportWord = async () => {
    if (!cvData) return;
    
    if (!isSubscribed(cvData.template)) {
      setShowPayModal(true);
      return;
    }

    if (!canDownload()) {
      alert("Vous avez déjà utilisé votre unique téléchargement inclus dans le pack FLASH ATS.");
      return;
    }

    await consumeDownload();

    const sections = cvData.sections!;
    const wordFont = cvData.textStyle?.fontFamily || "Arial";
    const baseSize = (cvData.textStyle?.fontSize || 11) * 2;
    const isBold = cvData.textStyle?.isBold || false;
    const isItalic = cvData.textStyle?.isItalic || false;
    const alignment = cvData.textStyle?.textAlign === 'center' ? AlignmentType.CENTER : 
                    cvData.textStyle?.textAlign === 'justify' ? AlignmentType.JUSTIFIED : 
                    AlignmentType.LEFT;
    const lineSpacing = (cvData.textStyle?.lineHeight || 1.5) * 240;

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: cvData.textStyle?.isCompact ? 360 : 720,
              right: cvData.textStyle?.isCompact ? 360 : 720,
              bottom: cvData.textStyle?.isCompact ? 360 : 720,
              left: cvData.textStyle?.isCompact ? 360 : 720,
            },
          },
        },
        children: [
          // Header
          new Paragraph({
            children: [
              new TextRun({ 
                text: `${cvData.firstName} ${cvData.lastName}`, 
                bold: true, 
                size: baseSize * 2, 
                color: "0F172A",
                font: wordFont
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ 
                text: `${cvData.email} | ${cvData.phone}`, 
                size: baseSize * 0.9, 
                color: "64748B",
                font: wordFont
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          
          // Profile
          new Paragraph({
            children: [new TextRun({ 
              text: sections.profile.toUpperCase(), 
              bold: true, 
              size: baseSize * 1.2, 
              color: "0F172A",
              font: wordFont
            })],
            border: { bottom: { color: "E2E8F0", space: 4, style: BorderStyle.SINGLE, size: 12 } },
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({ 
            children: [new TextRun({ 
              text: cvData.profile, 
              size: baseSize, 
              color: "334155",
              font: wordFont,
              bold: isBold,
              italics: isItalic
            })],
            alignment: alignment,
            spacing: { after: 400, line: lineSpacing } 
          }),

          // Experiences
          new Paragraph({
            children: [new TextRun({ 
              text: sections.experiences.toUpperCase(), 
              bold: true, 
              size: baseSize * 1.2, 
              color: "0F172A",
              font: wordFont
            })],
            border: { bottom: { color: "E2E8F0", space: 4, style: BorderStyle.SINGLE, size: 12 } },
            spacing: { before: 200, after: 200 },
          }),
          ...cvData.experiences.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ 
                  text: exp.position, 
                  bold: true, 
                  size: baseSize * 1.1, 
                  color: "0F172A",
                  font: wordFont
                }),
                new TextRun({ 
                  text: ` @ ${exp.company}`, 
                  bold: true, 
                  size: baseSize * 1.1, 
                  color: "10B981",
                  font: wordFont
                }),
              ],
              spacing: { before: 150 },
            }),
            new Paragraph({
              children: [new TextRun({ 
                text: `${exp.startDate} - ${exp.endDate}`, 
                italics: true, 
                size: baseSize * 0.8, 
                color: "94A3B8",
                font: wordFont
              })],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [new TextRun({ 
                text: exp.description, 
                size: baseSize, 
                color: "334155",
                font: wordFont,
                bold: isBold,
                italics: isItalic
              })],
              alignment: alignment,
              spacing: { after: 300, line: lineSpacing },
            }),
          ]),

          // Education
          new Paragraph({
            children: [new TextRun({ 
              text: sections.education.toUpperCase(), 
              bold: true, 
              size: baseSize * 1.2, 
              color: "0F172A",
              font: wordFont
            })],
            border: { bottom: { color: "E2E8F0", space: 4, style: BorderStyle.SINGLE, size: 12 } },
            spacing: { before: 200, after: 200 },
          }),
          ...cvData.education.flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({ 
                  text: edu.degree, 
                  bold: true, 
                  size: baseSize * 1.1, 
                  color: "0F172A",
                  font: wordFont
                }),
                new TextRun({ 
                  text: ` - ${edu.school}`, 
                  size: baseSize * 1.1, 
                  color: "334155",
                  font: wordFont
                }),
              ],
              spacing: { before: 150 },
            }),
            new Paragraph({
              children: [new TextRun({ 
                text: edu.year, 
                italics: true, 
                size: baseSize * 0.8, 
                color: "94A3B8",
                font: wordFont
              })],
              spacing: { after: 100 },
            }),
          ]),

          // Skills
          new Paragraph({
            children: [new TextRun({ 
              text: sections.skills.toUpperCase(), 
              bold: true, 
              size: baseSize * 1.2, 
              color: "0F172A",
              font: wordFont
            })],
            border: { bottom: { color: "E2E8F0", space: 4, style: BorderStyle.SINGLE, size: 12 } },
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ 
              text: cvData.skills.join(", "), 
              size: baseSize, 
              color: "334155",
              font: wordFont,
              bold: isBold,
              italics: isItalic
            })],
            alignment: alignment,
            spacing: { after: 300, line: lineSpacing },
          }),

          // IT Skills
          new Paragraph({
            children: [new TextRun({ 
              text: sections.itSkills.toUpperCase(), 
              bold: true, 
              size: baseSize * 1.2, 
              color: "0F172A",
              font: wordFont
            })],
            border: { bottom: { color: "E2E8F0", space: 4, style: BorderStyle.SINGLE, size: 12 } },
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ 
              text: cvData.itSkills.join(", "), 
              size: baseSize, 
              color: "334155",
              font: wordFont,
              bold: isBold,
              italics: isItalic
            })],
            alignment: alignment,
            spacing: { after: 300, line: lineSpacing },
          }),

          // Qualities & Interests
          new Paragraph({
            children: [new TextRun({ 
              text: `${sections.qualities.toUpperCase()} & ${sections.interests.toUpperCase()}`, 
              bold: true, 
              size: baseSize * 1.2, 
              color: "0F172A",
              font: wordFont
            })],
            border: { bottom: { color: "E2E8F0", space: 4, style: BorderStyle.SINGLE, size: 12 } },
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({ 
            children: [
              new TextRun({ text: `${sections.qualities}: `, bold: true, size: baseSize * 0.9, color: "0F172A", font: wordFont }),
              new TextRun({ text: cvData.qualities.join(', '), size: baseSize * 0.9, color: "475569", font: wordFont })
            ],
            spacing: { after: 100 }
          }),
          ...(cvData.flaws && cvData.flaws.length > 0 ? [
            new Paragraph({ 
              children: [
                new TextRun({ text: `${sections.flaws}: `, bold: true, size: baseSize * 0.9, color: "0F172A", font: wordFont }),
                new TextRun({ text: cvData.flaws.join(', '), size: baseSize * 0.9, color: "475569", font: wordFont })
              ],
              spacing: { after: 100 }
            })
          ] : []),
          new Paragraph({ 
            children: [
              new TextRun({ text: `${sections.interests}: `, bold: true, size: baseSize * 0.9, color: "0F172A", font: wordFont }),
              new TextRun({ text: cvData.interests.join(', '), size: baseSize * 0.9, color: "475569", font: wordFont })
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${cvData.firstName}_${cvData.lastName}_CV.docx`);
  };

  if (!cvData) return null;

  return (
    <CanvaStyleEditor 
      data={cvData || testData}
      onChange={updateCV}
      onAIModify={handleAIModify}
      onSave={handleSave}
      onExportPDF={exportPDF}
      onExportWord={exportWord}
      isSaving={isSaving}
      isExporting={isExporting}
      score={score}
      isScoring={isScoring}
    />
  );
}
