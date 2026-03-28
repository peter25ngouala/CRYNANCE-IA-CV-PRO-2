import React, { useEffect, useRef, useState } from 'react';
import { CVData } from '../types';
import { DynamicCV } from './DynamicCV';

interface TemplateThumbnailProps {
  templateId: string;
  baseTemplate: string;
  primaryColor?: string;
  name?: string;
}

const dummyData: CVData = {
  firstName: "Jean",
  lastName: "Dupont",
  jobTitle: "Responsable Marketing Digital",
  email: "jean.dupont@email.com",
  phone: "+33 6 12 34 56 78",
  address: "Paris, France",
  profile: "Expert en marketing digital avec plus de 8 ans d'expérience dans la gestion de campagnes multi-canaux. Passionné par l'analyse de données et l'optimisation du ROI.",
  experiences: [
    {
      company: "Tech Solutions SAS",
      position: "Senior Marketing Manager",
      startDate: "2020",
      endDate: "Présent",
      description: "Direction de l'équipe marketing (5 personnes). Augmentation du trafic organique de 150% en 2 ans."
    }
  ],
  education: [
    {
      school: "HEC Paris",
      degree: "Master en Marketing & Stratégie",
      year: "2017"
    }
  ],
  skills: ["SEO/SEA", "Google Analytics", "Stratégie de contenu"],
  languagesList: [
    { name: "Français", level: "Maternel" },
    { name: "Anglais", level: "Avancé" }
  ],
  qualities: ["Analytique", "Créatif"],
  flaws: [],
  interests: ["Voyages", "Photographie"],
  language: 'fr',
  itSkills: ["Suite Adobe", "Salesforce"],
  template: 'modern'
};

export const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({ templateId, name }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

  const [firstName, ...lastNameParts] = (name || "Jean Dupont").split(' ');
  const lastName = lastNameParts.join(' ');

  const data = {
    ...dummyData,
    firstName: firstName || "Jean",
    lastName: lastName || "Dupont",
    template: templateId,
  };

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setScale(width / 794);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[1/1.414] bg-white shadow-inner overflow-hidden rounded-lg border border-slate-100 group-hover:border-primary/30 transition-colors"
    >
      <div 
        className="absolute top-0 left-0 w-[794px] origin-top-left pointer-events-none select-none"
        style={{ 
          transform: `scale(${scale})`,
        }}
      >
        <DynamicCV 
          data={data} 
          styleId={templateId}
        />
      </div>
      
      {/* Overlay to prevent interaction and add a slight fade */}
      <div className="absolute inset-0 bg-transparent group-hover:bg-primary/5 transition-colors" />
    </div>
  );
};
