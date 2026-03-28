import React from 'react';
import { Mail, Phone, MapPin, User, Briefcase, BookOpen, Code, Languages, Heart } from 'lucide-react';
import { CVData } from '../types';
import { Editable, SkillBarSVG, SectionHeader, FillerContent } from '../components/CVElements';

import { DraggableSection } from '../components/DraggableSection';

interface TemplateProps {
  data: CVData;
  handleUpdate: (update: Partial<CVData>) => void;
  headingFont: string;
  bodyFont: string;
  layoutSettings: {
    fontSize: number;
    spacing: number;
    sectionSpacing: number;
    isTwoColumn: boolean;
  };
  onAIModify?: (instruction: string) => void;
}

// Template 1: Marine & Or - Classic Sidebar
export const Template1: React.FC<TemplateProps> = ({ data, handleUpdate, headingFont, bodyFont, layoutSettings, onAIModify }) => {
  const color = '#1e3a8a';
  const hiddenSections = data.hiddenSections || [];

  const toggleVisibility = (sectionId: string) => {
    const newHidden = hiddenSections.includes(sectionId)
      ? hiddenSections.filter(id => id !== sectionId)
      : [...hiddenSections, sectionId];
    handleUpdate({ hiddenSections: newHidden });
  };

  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#1e293b' }}>
      <header className="p-[var(--cv-padding)] text-center bg-slate-900 text-white shrink-0">
        {data.photo && <img src={data.photo} className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-white/20" alt="Profile" />}
        <h1 className={`text-4xl font-black uppercase tracking-tight mb-1 ${headingFont}`}>
          <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
          <span className="ml-3 opacity-50"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></span>
        </h1>
        <h2 className="text-sm font-bold opacity-60 uppercase tracking-widest">
          <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
        </h2>
      </header>

      <div className="cv-grid-50-50">
        <div className="cv-col-50 bg-slate-50/50">
          <DraggableSection id="contact" isHidden={hiddenSections.includes('contact')} onToggleVisibility={() => toggleVisibility('contact')}>
            <section className="cv-section">
              <SectionHeader title="Contact" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
              <div className="space-y-3 cv-text-inherit">
                <div className="flex items-center gap-2"><Mail size={12} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
                <div className="flex items-center gap-2"><Phone size={12} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
                <div className="flex items-center gap-2"><MapPin size={12} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
              </div>
            </section>
          </DraggableSection>

          <DraggableSection id="profile" isHidden={hiddenSections.includes('profile')} onToggleVisibility={() => toggleVisibility('profile')}>
            <section className="cv-section">
              <SectionHeader title="Profil" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
              <Editable text={data.profile} multiline className="cv-text-inherit leading-relaxed opacity-80 profile-text text-sm" onSave={(val) => handleUpdate({ profile: val })} />
            </section>
          </DraggableSection>

          <DraggableSection id="skills" isHidden={hiddenSections.includes('skills')} onToggleVisibility={() => toggleVisibility('skills')}>
            <section className="cv-section">
              <SectionHeader title="Compétences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes compétences pour mon métier")} />
              <div className="space-y-2 cv-text-inherit">
                {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color={color} />)}
              </div>
            </section>
          </DraggableSection>

          <DraggableSection id="languages" isHidden={hiddenSections.includes('languages')} onToggleVisibility={() => toggleVisibility('languages')}>
            <section className="cv-section">
              <SectionHeader title="Langues" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
              <div className="space-y-2 cv-text-inherit">
                {data.languagesList?.map((lang, i) => (
                  <div key={i} className="flex justify-between border-b border-slate-200 pb-1 text-xs">
                    <span>{lang.name}</span>
                    <span className="opacity-70 italic">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
        </div>

        <div className="cv-col-50">
          <DraggableSection id="experiences" isHidden={hiddenSections.includes('experiences')} onToggleVisibility={() => toggleVisibility('experiences')}>
            <section className="cv-section">
              <SectionHeader title="Expériences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
              <div className="space-y-[var(--cv-item-spacing)]">
                {data.experiences?.map((exp, i) => (
                  <div key={i} className="experience-item">
                    <div className="flex justify-between items-start mb-1">
                      <Editable text={exp.position} className="font-black text-sm uppercase tracking-tight cv-text-inherit" onSave={(val) => {
                        const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                      }} />
                      <span className="text-[10px] font-bold opacity-40">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <Editable text={exp.company} className="text-xs font-bold mb-2 block cv-text-inherit" style={{ color }} onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                    }} />
                    <Editable text={exp.description} multiline className="cv-text-inherit opacity-70 leading-relaxed experience-description text-xs" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                    }} />
                  </div>
                ))}
                {data.experiences.length < 2 && <FillerContent color={color} />}
              </div>
            </section>
          </DraggableSection>

          <DraggableSection id="education" isHidden={hiddenSections.includes('education')} onToggleVisibility={() => toggleVisibility('education')}>
            <section className="cv-section">
              <SectionHeader title="Formation" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
              <div className="space-y-4 cv-text-inherit">
                {data.education?.map((edu, i) => (
                  <div key={i} className="education-item">
                    <div className="font-bold uppercase tracking-tighter text-sm">{edu.degree}</div>
                    <div className="opacity-70 text-xs">{edu.school} | {edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>

          <DraggableSection id="itSkills" isHidden={hiddenSections.includes('itSkills')} onToggleVisibility={() => toggleVisibility('itSkills')}>
            <section className="cv-section">
              <SectionHeader title="Informatique" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes compétences informatiques")} />
              <div className="flex flex-wrap gap-1 cv-text-inherit">
                {data.itSkills?.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-100 text-[9px] font-bold rounded">{s}</span>
                ))}
              </div>
            </section>
          </DraggableSection>

          <DraggableSection id="interests" isHidden={hiddenSections.includes('interests')} onToggleVisibility={() => toggleVisibility('interests')}>
            <section className="cv-section">
              <SectionHeader title="Centres d'intérêt" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes centres d'intérêt")} />
              <div className="flex flex-wrap gap-2 cv-text-inherit">
                {data.interests?.map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-full border border-slate-100 italic">{item}</span>
                ))}
              </div>
            </section>
          </DraggableSection>
        </div>
      </div>
    </div>
  );
};

// Template 2: Anthracite - Square Photo & Boxed Titles
export const Template2: React.FC<TemplateProps> = ({ data, handleUpdate, headingFont, bodyFont, layoutSettings, onAIModify }) => {
  const color = '#334155';
  const hiddenSections = data.hiddenSections || [];

  const toggleVisibility = (sectionId: string) => {
    const newHidden = hiddenSections.includes(sectionId)
      ? hiddenSections.filter(id => id !== sectionId)
      : [...hiddenSections, sectionId];
    handleUpdate({ hiddenSections: newHidden });
  };

  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#f8fafc', color: '#0f172a' }}>
      <header className="p-[var(--cv-padding)] flex items-center gap-8 bg-white border-b-8 shrink-0" style={{ borderColor: color }}>
        {data.photo && <img src={data.photo} className="w-32 h-32 object-cover grayscale" alt="Profile" />}
        <div className="flex-1">
          <h1 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${headingFont}`} style={{ color }}>
            <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
            <span className="ml-3 opacity-20"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></span>
          </h1>
          <h2 className="text-sm font-black opacity-50 uppercase tracking-[0.2em]">
            <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
        </div>
      </header>

      <div className="cv-grid-50-50">
        <div className="cv-col-50 bg-white">
          <DraggableSection id="contact" isHidden={hiddenSections.includes('contact')} onToggleVisibility={() => toggleVisibility('contact')}>
            <section className="cv-section">
              <SectionHeader title="Contact" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
              <div className="space-y-4 cv-text-inherit font-bold text-xs">
                <div className="flex items-center gap-3"><Mail size={14} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
                <div className="flex items-center gap-3"><Phone size={14} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
                <div className="flex items-center gap-3"><MapPin size={14} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
              </div>
            </section>
          </DraggableSection>

          <DraggableSection id="profile" isHidden={hiddenSections.includes('profile')} onToggleVisibility={() => toggleVisibility('profile')}>
            <section className="cv-section">
              <SectionHeader title="Profil" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
              <Editable text={data.profile} multiline className="cv-text-inherit leading-relaxed border-l-4 pl-6 italic profile-text text-sm" style={{ borderColor: color }} onSave={(val) => handleUpdate({ profile: val })} />
            </section>
          </DraggableSection>

          <DraggableSection id="skills" isHidden={hiddenSections.includes('skills')} onToggleVisibility={() => toggleVisibility('skills')}>
            <section className="cv-section">
              <SectionHeader title="Compétences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise mes compétences pour mon métier")} />
              <div className="space-y-4 cv-text-inherit">
                {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={90} color={color} />)}
              </div>
            </section>
          </DraggableSection>

          <DraggableSection id="languages" isHidden={hiddenSections.includes('languages')} onToggleVisibility={() => toggleVisibility('languages')}>
            <section className="cv-section">
              <SectionHeader title="Langues" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
              <div className="space-y-3 cv-text-inherit">
                {data.languagesList?.map((lang, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span>{lang.name}</span>
                    <span className="p-1 bg-slate-900 text-white rounded text-[8px]">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
        </div>

        <div className="cv-col-50">
          <DraggableSection id="experiences" isHidden={hiddenSections.includes('experiences')} onToggleVisibility={() => toggleVisibility('experiences')}>
            <section className="cv-section">
              <SectionHeader title="Expériences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
              <div className="space-y-[var(--cv-item-spacing)]">
                {data.experiences?.map((exp, i) => (
                  <div key={i} className="relative pl-8 border-l experience-item" style={{ borderColor: `${color}30` }}>
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <div className="flex justify-between items-center mb-2">
                      <Editable text={exp.position} className="font-black text-base uppercase tracking-tight cv-text-inherit" onSave={(val) => {
                        const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                      }} />
                      <span className="text-[10px] font-black opacity-30">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <Editable text={exp.company} className="text-xs font-bold mb-3 block opacity-60 cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                    }} />
                    <Editable text={exp.description} multiline className="cv-text-inherit leading-relaxed opacity-70 experience-description text-xs" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                    }} />
                  </div>
                ))}
                {data.experiences.length < 2 && <FillerContent color={color} />}
              </div>
            </section>
          </DraggableSection>

          <DraggableSection id="education" isHidden={hiddenSections.includes('education')} onToggleVisibility={() => toggleVisibility('education')}>
            <section className="cv-section">
              <SectionHeader title="Formation" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
              <div className="space-y-6 cv-text-inherit">
                {data.education?.map((edu, i) => (
                  <div key={i} className="education-item">
                    <div className="font-black text-xs uppercase tracking-widest mb-1">{edu.degree}</div>
                    <div className="text-[10px] opacity-50 font-bold">{edu.school} | {edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>

          <DraggableSection id="itSkills" isHidden={hiddenSections.includes('itSkills')} onToggleVisibility={() => toggleVisibility('itSkills')}>
            <section className="cv-section">
              <SectionHeader title="Informatique" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise mes compétences informatiques")} />
              <div className="flex flex-wrap gap-2 cv-text-inherit">
                {data.itSkills?.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-100 text-[9px] font-bold rounded border border-slate-200">{s}</span>
                ))}
              </div>
            </section>
          </DraggableSection>

          <DraggableSection id="interests" isHidden={hiddenSections.includes('interests')} onToggleVisibility={() => toggleVisibility('interests')}>
            <section className="cv-section">
              <SectionHeader title="Qualités & Intérêts" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
              <div className="flex flex-wrap gap-3 cv-text-inherit">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{q}</span>
                ))}
                {data.interests?.map((interest, i) => (
                  <span key={i} className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 italic">{interest}</span>
                ))}
              </div>
            </section>
          </DraggableSection>
        </div>
      </div>
    </div>
  );
};

// Template 3: Bordeaux - Pill Titles & Rounded Photo
export const Template3: React.FC<TemplateProps> = ({ data, handleUpdate, headingFont, bodyFont, layoutSettings, onAIModify }) => {
  const color = '#7f1d1d';
  const hiddenSections = data.hiddenSections || [];

  const toggleVisibility = (sectionId: string) => {
    const newHidden = hiddenSections.includes(sectionId)
      ? hiddenSections.filter(id => id !== sectionId)
      : [...hiddenSections, sectionId];
    handleUpdate({ hiddenSections: newHidden });
  };

  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#1e293b' }}>
      <div className="cv-grid-50-50">
        <div className="cv-col-50 bg-slate-50/50">
          <header className="flex flex-col items-center mb-10 shrink-0">
            {data.photo && <img src={data.photo} className="w-32 h-32 rounded-3xl object-cover mb-4 border-4 border-white shadow-lg" alt="Profile" />}
            <h1 className={`text-2xl font-black text-center mb-1 ${headingFont}`} style={{ color }}>
              <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
              <div className="opacity-20"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></div>
            </h1>
            <h2 className="text-[10px] font-bold text-center opacity-50 uppercase tracking-[0.3em]">
              <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
            </h2>
          </header>
          <DraggableSection id="contact" isHidden={hiddenSections.includes('contact')} onToggleVisibility={() => toggleVisibility('contact')}>
            <section className="cv-section">
              <SectionHeader title="Contact" color={color} variant="pill" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
              <div className="space-y-3 cv-text-inherit text-xs">
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm"><Mail size={14} style={{ color }} /> <Editable text={data.email} onSave={(val) => handleUpdate({ email: val })} /></div>
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm"><Phone size={14} style={{ color }} /> <Editable text={data.phone} onSave={(val) => handleUpdate({ phone: val })} /></div>
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm"><MapPin size={14} style={{ color }} /> <Editable text={data.address || ''} onSave={(val) => handleUpdate({ address: val })} /></div>
              </div>
            </section>
          </DraggableSection>

          <DraggableSection id="profile" isHidden={hiddenSections.includes('profile')} onToggleVisibility={() => toggleVisibility('profile')}>
            <section className="cv-section">
              <SectionHeader title="Profil" color={color} variant="pill" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
              <Editable text={data.profile} multiline className="cv-text-inherit leading-relaxed bg-white p-5 rounded-2xl profile-text text-sm shadow-sm !block !text-slate-900 !opacity-100 relative z-10" onSave={(val) => handleUpdate({ profile: val })} />
            </section>
          </DraggableSection>

          <DraggableSection id="skills" isHidden={hiddenSections.includes('skills')} onToggleVisibility={() => toggleVisibility('skills')}>
            <section className="cv-section">
              <SectionHeader title="Compétences" color={color} variant="pill" onAIEdit={() => onAIModify?.("Optimise mes compétences pour mon métier")} />
              <div className="space-y-4 cv-text-inherit">
                {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color={color} />)}
              </div>
            </section>
          </DraggableSection>

          <DraggableSection id="languages" isHidden={hiddenSections.includes('languages')} onToggleVisibility={() => toggleVisibility('languages')}>
            <section className="cv-section">
              <SectionHeader title="Langues" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
              <div className="space-y-2 cv-text-inherit">
                {data.languagesList?.map((lang, i) => (
                  <div key={i} className="flex flex-col gap-0.5 p-2 bg-white rounded-lg shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>{lang.name}</span>
                    <span className="text-[9px] font-bold opacity-40">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
        </div>

        <div className="cv-col-50">
          <DraggableSection id="experiences" isHidden={hiddenSections.includes('experiences')} onToggleVisibility={() => toggleVisibility('experiences')}>
            <section className="cv-section">
              <SectionHeader title="Expérience" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
              <div className="space-y-[var(--cv-item-spacing)]">
                {data.experiences?.map((exp, i) => (
                  <div key={i} className="group experience-item">
                    <div className="flex justify-between items-center mb-1">
                      <Editable text={exp.position} className="font-black text-lg cv-text-inherit" onSave={(val) => {
                        const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                      }} />
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <Editable text={exp.company} className="text-sm font-bold mb-2 block cv-text-inherit" style={{ color }} onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                    }} />
                    <Editable text={exp.description} multiline className="cv-text-inherit opacity-70 leading-relaxed experience-description text-xs" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                    }} />
                  </div>
                ))}
                {data.experiences.length < 2 && <FillerContent color={color} />}
              </div>
            </section>
          </DraggableSection>

          <DraggableSection id="education" isHidden={hiddenSections.includes('education')} onToggleVisibility={() => toggleVisibility('education')}>
            <section className="cv-section">
              <SectionHeader title="Formation" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
              <div className="space-y-4 cv-text-inherit">
                {data.education?.map((edu, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 education-item">
                    <div className="font-black text-xs uppercase tracking-tight mb-1">{edu.degree}</div>
                    <div className="text-[10px] opacity-50 font-bold">{edu.school} | {edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>

          <DraggableSection id="itSkills" isHidden={hiddenSections.includes('itSkills')} onToggleVisibility={() => toggleVisibility('itSkills')}>
            <section className="cv-section">
              <SectionHeader title="Informatique" color={color} variant="pill" onAIEdit={() => onAIModify?.("Optimise mes compétences informatiques")} />
              <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-lg shadow-sm cv-text-inherit">
                {data.itSkills?.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-100 text-[9px] font-bold rounded">{s}</span>
                ))}
              </div>
            </section>
          </DraggableSection>

          <DraggableSection id="interests" isHidden={hiddenSections.includes('interests')} onToggleVisibility={() => toggleVisibility('interests')}>
            <section className="cv-section">
              <SectionHeader title="Qualités & Intérêts" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
              <div className="flex flex-wrap gap-2 cv-text-inherit">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg uppercase tracking-widest">{q}</span>
                ))}
                {data.interests?.map((interest, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-slate-200 text-slate-400 text-[10px] italic rounded-lg">{interest}</span>
                ))}
              </div>
            </section>
          </DraggableSection>
        </div>
      </div>
    </div>
  );
};

// Template 4: Emerald - No Photo & Icon Titles
export const Template4: React.FC<TemplateProps> = ({ data, handleUpdate, headingFont, bodyFont, layoutSettings, onAIModify }) => {
  const color = '#065f46';
  const hiddenSections = data.hiddenSections || [];

  const toggleVisibility = (sectionId: string) => {
    const newHidden = hiddenSections.includes(sectionId)
      ? hiddenSections.filter(id => id !== sectionId)
      : [...hiddenSections, sectionId];
    handleUpdate({ hiddenSections: newHidden });
  };

  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#0f172a' }}>
      <div className="cv-grid-50-50 flex-grow">
        <div className="cv-col-50 flex flex-col flex-grow" style={{ backgroundColor: color, color: '#fff' }}>
          <div className="mb-10 shrink-0">
            <h1 className={`text-2xl font-black uppercase leading-none mb-4 ${headingFont}`}>
              <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
              <div className="block opacity-50"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></div>
            </h1>
            <div className="h-1 w-12 bg-white/40 my-6" />
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">
              <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
            </h2>
          </div>

          <DraggableSection id="profile" isHidden={hiddenSections.includes('profile')} onToggleVisibility={() => toggleVisibility('profile')}>
            <section className="cv-section">
              <SectionHeader title="Profil" icon={User} color="#fff" variant="standard" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
              <Editable text={data.profile} multiline className="cv-text-inherit leading-relaxed opacity-80 profile-text" onSave={(val) => handleUpdate({ profile: val })} />
            </section>
          </DraggableSection>

          <div className="flex-1 space-y-8">
            <DraggableSection id="contact" isHidden={hiddenSections.includes('contact')} onToggleVisibility={() => toggleVisibility('contact')}>
              <section className="cv-section">
                <SectionHeader title="Contact" color="#fff" variant="standard" icon={Mail} onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
                <div className="space-y-4 cv-text-inherit opacity-80">
                  <div className="flex items-center gap-3"><Mail size={14} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
                  <div className="flex items-center gap-3"><Phone size={14} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
                  <div className="flex items-center gap-3"><MapPin size={14} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
                </div>
              </section>
            </DraggableSection>
            <DraggableSection id="skills" isHidden={hiddenSections.includes('skills')} onToggleVisibility={() => toggleVisibility('skills')}>
              <section className="cv-section">
                <SectionHeader title="Compétences" color="#fff" variant="standard" icon={Code} onAIEdit={() => onAIModify?.("Optimise mes compétences pour mon métier")} />
                <div className="space-y-4 cv-text-inherit">
                  {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={75} color="#fff" />)}
                </div>
              </section>
            </DraggableSection>
            <DraggableSection id="itSkills" isHidden={hiddenSections.includes('itSkills')} onToggleVisibility={() => toggleVisibility('itSkills')}>
              <section className="cv-section">
                <SectionHeader title="Informatique" color="#fff" variant="standard" icon={Code} onAIEdit={() => onAIModify?.("Optimise mes compétences informatiques")} />
                <div className="flex flex-wrap gap-1 cv-text-inherit">
                  {data.itSkills?.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white/10 text-[9px] font-bold rounded">{s}</span>
                  ))}
                </div>
              </section>
            </DraggableSection>
            <DraggableSection id="languages" isHidden={hiddenSections.includes('languages')} onToggleVisibility={() => toggleVisibility('languages')}>
              <section className="cv-section">
                <SectionHeader title="Langues" color="#fff" variant="standard" icon={Languages} onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
                <div className="space-y-2 cv-text-inherit opacity-80">
                  {data.languagesList?.map((lang, i) => (
                    <div key={i} className="flex justify-between border-b border-white/10 pb-1">
                      <span>{lang.name}</span>
                      <span>{lang.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            </DraggableSection>
          </div>
        </div>
        <div className="cv-col-50 flex flex-col flex-grow cv-auto-fill">
          <DraggableSection id="experiences" isHidden={hiddenSections.includes('experiences')} onToggleVisibility={() => toggleVisibility('experiences')}>
            <section className="cv-section">
              <SectionHeader title="Expériences" icon={Briefcase} color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
              <div className="space-y-[var(--cv-item-spacing)]">
                {data.experiences?.map((exp, i) => (
                  <div key={i} className="grid grid-cols-4 gap-8 experience-item">
                    <div className="text-xs font-black opacity-40 pt-1">{exp.startDate} - {exp.endDate}</div>
                    <div className="col-span-3">
                      <Editable text={exp.position} className="font-black text-xl mb-1 block" onSave={(val) => {
                        const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                      }} />
                      <Editable text={exp.company} className="text-sm font-bold mb-4 block" style={{ color }} onSave={(val) => {
                        const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                      }} />
                      <Editable text={exp.description} multiline className="cv-text-inherit opacity-70 leading-relaxed experience-description" onSave={(val) => {
                        const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                      }} />
                    </div>
                  </div>
                ))}
                {data.experiences.length < 2 && <FillerContent color={color} />}
              </div>
            </section>
          </DraggableSection>
          <div className="grid grid-cols-2 gap-12">
            <DraggableSection id="education" isHidden={hiddenSections.includes('education')} onToggleVisibility={() => toggleVisibility('education')}>
              <section className="cv-section">
                <SectionHeader title="Formation" icon={BookOpen} color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
                <div className="space-y-6 cv-text-inherit">
                  {data.education?.map((edu, i) => (
                    <div key={i} className="education-item">
                      <div className="font-black text-sm mb-1">{edu.degree}</div>
                      <div className="text-xs opacity-50">{edu.school} | {edu.year}</div>
                    </div>
                  ))}
                </div>
              </section>
            </DraggableSection>
            <DraggableSection id="interests" isHidden={hiddenSections.includes('interests')} onToggleVisibility={() => toggleVisibility('interests')}>
              <section className="cv-section">
                <SectionHeader title="Qualités & Intérêts" icon={Heart} color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
                <div className="flex flex-wrap gap-2 cv-text-inherit">
                  {data.qualities?.map((q, i) => (
                    <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-900 text-[10px] font-bold rounded-lg uppercase tracking-widest">{q}</span>
                  ))}
                  {data.interests?.map((interest, i) => (
                    <span key={i} className="px-3 py-1 border border-emerald-100 text-[10px] font-bold rounded-lg uppercase tracking-widest opacity-60 italic">{interest}</span>
                  ))}
                </div>
              </section>
            </DraggableSection>
          </div>
        </div>
      </div>
    </div>
  );
};

// Template 5: Royal - Floating Photo
export const Template5: React.FC<TemplateProps> = ({ data, handleUpdate, headingFont, bodyFont, layoutSettings, onAIModify }) => {
  const color = '#1e40af';
  const hiddenSections = data.hiddenSections || [];

  const toggleVisibility = (sectionId: string) => {
    const newHidden = hiddenSections.includes(sectionId)
      ? hiddenSections.filter(id => id !== sectionId)
      : [...hiddenSections, sectionId];
    handleUpdate({ hiddenSections: newHidden });
  };

  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#1e293b' }}>
      <div className="cv-grid-50-50">
        <div className="cv-col-50" style={{ backgroundColor: color, color: '#fff' }}>
          <div className="mt-48 space-y-10">
            <DraggableSection id="profile" isHidden={hiddenSections.includes('profile')} onToggleVisibility={() => toggleVisibility('profile')}>
              <section className="h-auto">
                <SectionHeader title="Profil" color="#fff" variant="standard" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
                <Editable text={data.profile} multiline className="cv-text-inherit leading-relaxed font-light italic opacity-70 profile-text" onSave={(val) => handleUpdate({ profile: val })} />
              </section>
            </DraggableSection>
          <DraggableSection id="contact" isHidden={hiddenSections.includes('contact')} onToggleVisibility={() => toggleVisibility('contact')}>
            <section className="h-auto">
              <SectionHeader title="Contact" color="#fff" variant="standard" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
              <div className="space-y-4 cv-text-inherit opacity-80">
                <div className="flex flex-col gap-1"><span className="opacity-50 text-[9px]">Email</span><Editable text={data.email} onSave={(val) => handleUpdate({ email: val })} /></div>
                <div className="flex flex-col gap-1"><span className="opacity-50 text-[9px]">Téléphone</span><Editable text={data.phone} onSave={(val) => handleUpdate({ phone: val })} /></div>
                <div className="flex flex-col gap-1"><span className="opacity-50 text-[9px]">Adresse</span><Editable text={data.address || ''} onSave={(val) => handleUpdate({ address: val })} /></div>
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="languages" isHidden={hiddenSections.includes('languages')} onToggleVisibility={() => toggleVisibility('languages')}>
            <section className="h-auto">
              <SectionHeader title="Langues" color="#fff" variant="standard" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
              <div className="space-y-3 cv-text-inherit opacity-80">
                {data.languagesList?.map((lang, i) => (
                  <div key={i} className="flex justify-between border-b border-white/10 pb-1">
                    <span>{lang.name}</span>
                    <span className="opacity-50">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="skills" isHidden={hiddenSections.includes('skills')} onToggleVisibility={() => toggleVisibility('skills')}>
            <section className="h-auto">
              <SectionHeader title="Compétences" color="#fff" variant="standard" onAIEdit={() => onAIModify?.("Optimise mes compétences pour mon métier")} />
              <div className="space-y-4 cv-text-inherit">
                {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color="#fff" />)}
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="itSkills" isHidden={hiddenSections.includes('itSkills')} onToggleVisibility={() => toggleVisibility('itSkills')}>
            <section className="h-auto">
              <SectionHeader title="Informatique" color="#fff" variant="standard" onAIEdit={() => onAIModify?.("Optimise mes compétences informatiques")} />
              <div className="flex flex-wrap gap-1 cv-text-inherit">
                {data.itSkills?.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white/10 text-[9px] font-bold rounded">{s}</span>
                ))}
              </div>
            </section>
          </DraggableSection>
        </div>
      </div>
      <div className="cv-col-50 relative">
        <div className="absolute top-12 left-[-60px] flex items-center gap-8">
          {data.photo && <img src={data.photo} className="w-32 h-32 rounded-full object-cover border-8 border-white" alt="Profile" />}
          <div className="pt-8">
            <h1 className={`text-3xl font-black uppercase tracking-tighter mb-2 ${headingFont}`} style={{ color }}>
              <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
              <span className="ml-3 opacity-20"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></span>
            </h1>
            <h2 className="text-sm font-bold opacity-40 uppercase tracking-widest">
              <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
            </h2>
          </div>
        </div>
        <div className="pt-64 flex flex-col justify-between h-full">
          <DraggableSection id="experiences" isHidden={hiddenSections.includes('experiences')} onToggleVisibility={() => toggleVisibility('experiences')}>
            <section className="h-auto">
              <SectionHeader title="Expériences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
              <div className="space-y-[var(--cv-item-spacing)]">
                {data.experiences?.map((exp, i) => (
                  <div key={i} className="experience-item">
                    <div className="flex justify-between items-center mb-2">
                      <Editable text={exp.position} className="font-black text-xl" onSave={(val) => {
                        const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                      }} />
                      <span className="text-xs font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <Editable text={exp.company} className="text-sm font-bold mb-4 block" style={{ color }} onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                    }} />
                    <Editable text={exp.description} multiline className="cv-text-inherit opacity-70 leading-relaxed experience-description" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                    }} />
                  </div>
                ))}
                {data.experiences.length < 2 && <FillerContent color={color} />}
              </div>
            </section>
          </DraggableSection>
          <div className="grid grid-cols-2 gap-12">
            <DraggableSection id="education" isHidden={hiddenSections.includes('education')} onToggleVisibility={() => toggleVisibility('education')}>
              <section className="h-auto">
                <SectionHeader title="Formation" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
                <div className="space-y-6 cv-text-inherit">
                  {data.education?.map((edu, i) => (
                    <div key={i} className="education-item">
                      <div className="font-black text-base mb-1">{edu.degree}</div>
                      <div className="text-xs opacity-50">{edu.school} | {edu.year}</div>
                    </div>
                  ))}
                </div>
              </section>
            </DraggableSection>
            <DraggableSection id="interests" isHidden={hiddenSections.includes('interests')} onToggleVisibility={() => toggleVisibility('interests')}>
              <section className="h-auto">
                <SectionHeader title="Qualités & Intérêts" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
                <div className="flex flex-wrap gap-2 cv-text-inherit">
                  {data.qualities?.map((q, i) => (
                    <span key={i} className="px-4 py-1 bg-blue-50 text-blue-800 text-[10px] font-black uppercase tracking-widest rounded-full">{q}</span>
                  ))}
                  {data.interests?.map((interest, i) => (
                    <span key={i} className="px-4 py-1 border border-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-widest rounded-full italic opacity-60">{interest}</span>
                  ))}
                </div>
              </section>
            </DraggableSection>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

// Template 6: Forest - Square Photo & Double Line Titles
export const Template6: React.FC<TemplateProps> = ({ data, handleUpdate, headingFont, bodyFont, layoutSettings, onAIModify }) => {
  const color = '#14532d';
  const hiddenSections = data.hiddenSections || [];

  const toggleVisibility = (sectionId: string) => {
    const newHidden = hiddenSections.includes(sectionId)
      ? hiddenSections.filter(id => id !== sectionId)
      : [...hiddenSections, sectionId];
    handleUpdate({ hiddenSections: newHidden });
  };

  return (
    <div id="cv-canvas" className={`cv-grid-50-50 cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#1e293b' }}>
      <div className="cv-col-50 p-0 flex flex-col cv-auto-spacing" style={{ gap: 'var(--cv-section-spacing)' }}>
        {data.photo && <img src={data.photo} className="w-full aspect-[4/5] object-cover" alt="Profile" />}
        <div className="p-[var(--cv-padding)] flex flex-col cv-auto-spacing" style={{ gap: 'var(--cv-section-spacing)' }}>
          <DraggableSection id="contact" isHidden={hiddenSections.includes('contact')} onToggleVisibility={() => toggleVisibility('contact')}>
            <section className="h-auto">
              <SectionHeader title="Contact" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
              <div className="space-y-4 cv-text-inherit font-bold opacity-80">
                <div className="flex items-center gap-3"><Mail size={14} style={{ color }} /> <Editable text={data.email} onSave={(val) => handleUpdate({ email: val })} /></div>
                <div className="flex items-center gap-3"><Phone size={14} style={{ color }} /> <Editable text={data.phone} onSave={(val) => handleUpdate({ phone: val })} /></div>
                <div className="flex items-center gap-3"><MapPin size={14} style={{ color }} /> <Editable text={data.address || ''} onSave={(val) => handleUpdate({ address: val })} /></div>
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="profile" isHidden={hiddenSections.includes('profile')} onToggleVisibility={() => toggleVisibility('profile')}>
            <section className="h-auto">
              <SectionHeader title="Profil" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
              <Editable text={data.profile} multiline className="cv-text-inherit leading-relaxed opacity-80 profile-text" onSave={(val) => handleUpdate({ profile: val })} />
            </section>
          </DraggableSection>
          <DraggableSection id="skills" isHidden={hiddenSections.includes('skills')} onToggleVisibility={() => toggleVisibility('skills')}>
            <section className="h-auto">
              <SectionHeader title="Compétences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes compétences pour mon métier")} />
              <div className="cv-text-inherit">
                {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={80} color={color} />)}
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="itSkills" isHidden={hiddenSections.includes('itSkills')} onToggleVisibility={() => toggleVisibility('itSkills')}>
            <section className="h-auto">
              <SectionHeader title="Informatique" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes compétences informatiques")} />
              <div className="flex flex-wrap gap-1 cv-text-inherit">
                {data.itSkills?.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 text-[9px] font-bold rounded">{s}</span>
                ))}
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="languages" isHidden={hiddenSections.includes('languages')} onToggleVisibility={() => toggleVisibility('languages')}>
            <section className="h-auto">
              <SectionHeader title="Langues" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
              <div className="space-y-2 cv-text-inherit">
                {data.languagesList?.map((lang, i) => (
                  <div key={i} className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-80">
                    <span>{lang.name}</span>
                    <span className="opacity-40">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
        </div>
      </div>
      <div className="cv-col-50 p-[var(--cv-padding)] flex flex-col cv-auto-spacing" style={{ gap: 'var(--cv-section-spacing)' }}>
        <header className="mb-12">
          <h1 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${headingFont}`} style={{ color }}>
            <Editable text={data.firstName} onSave={(val) => handleUpdate({ firstName: val })} />
            <div className="block"><Editable text={data.lastName} onSave={(val) => handleUpdate({ lastName: val })} /></div>
          </h1>
          <h2 className="text-sm font-light opacity-50 uppercase tracking-[0.4em]">
            <Editable text={data.jobTitle || ''} onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
        </header>
        <div className="flex flex-col cv-auto-spacing" style={{ gap: 'var(--cv-section-spacing)' }}>
          <DraggableSection id="experiences" isHidden={hiddenSections.includes('experiences')} onToggleVisibility={() => toggleVisibility('experiences')}>
            <section className="h-auto">
              <SectionHeader title="Expériences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
              <div className="space-y-[var(--cv-item-spacing)]">
                {data.experiences?.map((exp, i) => (
                  <div key={i} className="experience-item">
                    <div className="flex justify-between items-baseline mb-2">
                      <Editable text={exp.position} className="font-black text-lg" onSave={(val) => {
                        const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                      }} />
                      <span className="text-[10px] font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <Editable text={exp.company} className="text-xs font-bold mb-4 block opacity-60" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                    }} />
                    <Editable text={exp.description} multiline className="cv-text-inherit opacity-70 leading-relaxed experience-description" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                    }} />
                  </div>
                ))}
                {data.experiences.length < 2 && <FillerContent color={color} />}
              </div>
            </section>
          </DraggableSection>
          <div className="grid grid-cols-1 gap-12">
            <DraggableSection id="education" isHidden={hiddenSections.includes('education')} onToggleVisibility={() => toggleVisibility('education')}>
              <section className="h-auto">
                <SectionHeader title="Formation" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
                <div className="space-y-4 cv-text-inherit">
                  {data.education?.map((edu, i) => (
                    <div key={i} className="education-item">
                      <div className="font-black text-xs uppercase tracking-tight mb-1">{edu.degree}</div>
                      <div className="text-[10px] opacity-50 font-bold">{edu.school} | {edu.year}</div>
                    </div>
                  ))}
                </div>
              </section>
            </DraggableSection>
            <DraggableSection id="interests" isHidden={hiddenSections.includes('interests')} onToggleVisibility={() => toggleVisibility('interests')}>
              <section className="h-auto">
                <SectionHeader title="Qualités & Intérêts" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes qualités et centres d'intérêt")} />
                <div className="flex flex-wrap gap-2 cv-text-inherit">
                  {data.qualities?.map((q, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-[10px] font-bold rounded-lg uppercase tracking-widest">{q}</span>
                  ))}
                  {data.interests?.map((interest, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-50 text-[10px] italic rounded-lg border border-slate-200">{interest}</span>
                  ))}
                </div>
              </section>
            </DraggableSection>
          </div>
        </div>
      </div>
    </div>
  );
};

// Template 7: Midnight - Rounded Photo & Glow Titles
export const Template7: React.FC<TemplateProps> = ({ data, handleUpdate, headingFont, bodyFont, layoutSettings, onAIModify }) => {
  const color = '#38bdf8';
  const hiddenSections = data.hiddenSections || [];

  const toggleVisibility = (sectionId: string) => {
    const newHidden = hiddenSections.includes(sectionId)
      ? hiddenSections.filter(id => id !== sectionId)
      : [...hiddenSections, sectionId];
    handleUpdate({ hiddenSections: newHidden });
  };

  return (
    <div id="cv-canvas" className={`cv-grid-50-50 cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>
      <div className="cv-col-50 p-[var(--cv-padding)] flex flex-col cv-auto-spacing bg-slate-900/50 border-r border-white/10" style={{ gap: 'var(--cv-section-spacing)' }}>
        <div className="mb-12 text-center">
          {data.photo && <img src={data.photo} className="w-24 h-24 rounded-2xl object-cover mx-auto mb-8 border-2 border-white/10" alt="Profile" />}
          <h1 className={`text-2xl font-black uppercase tracking-tighter mb-1 ${headingFont}`}>
            <Editable text={data.firstName} onSave={(val) => handleUpdate({ firstName: val })} />
            <div className="block text-sky-400"><Editable text={data.lastName} onSave={(val) => handleUpdate({ lastName: val })} /></div>
          </h1>
          <h2 className="text-[10px] font-bold opacity-40 uppercase tracking-[0.3em] mt-4">
            <Editable text={data.jobTitle || ''} onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
        </div>
        <div className="space-y-[var(--cv-section-spacing)] cv-auto-spacing">
          <DraggableSection id="contact" isHidden={hiddenSections.includes('contact')} onToggleVisibility={() => toggleVisibility('contact')}>
            <section className="h-auto">
              <SectionHeader title="Contact" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
              <div className="space-y-4 cv-text-inherit opacity-80">
                <div className="flex items-center gap-3"><Mail size={14} /> <Editable text={data.email} onSave={(val) => handleUpdate({ email: val })} /></div>
                <div className="flex items-center gap-3"><Phone size={14} /> <Editable text={data.phone} onSave={(val) => handleUpdate({ phone: val })} /></div>
                <div className="flex items-center gap-3"><MapPin size={14} /> <Editable text={data.address || ''} onSave={(val) => handleUpdate({ address: val })} /></div>
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="profile" isHidden={hiddenSections.includes('profile')} onToggleVisibility={() => toggleVisibility('profile')}>
            <section className="h-auto">
              <SectionHeader title="Profil" icon={User} color={color} variant="underlined" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
              <Editable text={data.profile} multiline className="cv-text-inherit leading-relaxed opacity-70 font-light profile-text" onSave={(val) => handleUpdate({ profile: val })} />
            </section>
          </DraggableSection>
          <DraggableSection id="skills" isHidden={hiddenSections.includes('skills')} onToggleVisibility={() => toggleVisibility('skills')}>
            <section className="h-auto">
              <SectionHeader title="Compétences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes compétences pour mon métier")} />
              <div className="cv-text-inherit">
                {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color={color} />)}
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="itSkills" isHidden={hiddenSections.includes('itSkills')} onToggleVisibility={() => toggleVisibility('itSkills')}>
            <section className="h-auto">
              <SectionHeader title="Informatique" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes compétences informatiques")} />
              <div className="flex flex-wrap gap-1 cv-text-inherit">
                {data.itSkills?.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white/10 text-[9px] font-bold rounded">{s}</span>
                ))}
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="languages" isHidden={hiddenSections.includes('languages')} onToggleVisibility={() => toggleVisibility('languages')}>
            <section className="h-auto">
              <SectionHeader title="Langues" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
              <div className="space-y-2 cv-text-inherit opacity-80">
                {data.languagesList?.map((lang, i) => (
                  <div key={i} className="flex justify-between border-b border-white/5 pb-1">
                    <span>{lang.name}</span>
                    <span className="text-sky-400">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
        </div>
      </div>
      <div className="cv-col-50 p-[var(--cv-padding)] flex flex-col cv-auto-spacing" style={{ gap: 'var(--cv-section-spacing)' }}>
        <DraggableSection id="experiences" isHidden={hiddenSections.includes('experiences')} onToggleVisibility={() => toggleVisibility('experiences')}>
          <section className="h-auto">
            <SectionHeader title="Expériences" icon={Briefcase} color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
            <div className="space-y-[var(--cv-item-spacing)]">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative experience-item">
                  <div className="flex justify-between items-center mb-2">
                    <Editable text={exp.position} className="font-black text-lg text-white" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[10px] font-bold text-sky-400/50">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-xs font-bold mb-4 block opacity-50" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="cv-text-inherit opacity-60 leading-relaxed experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>
        </DraggableSection>
        <div className="grid grid-cols-1 gap-12">
          <DraggableSection id="education" isHidden={hiddenSections.includes('education')} onToggleVisibility={() => toggleVisibility('education')}>
            <section className="h-auto">
              <SectionHeader title="Formation" icon={BookOpen} color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
              <div className="space-y-6 cv-text-inherit">
                {data.education?.map((edu, i) => (
                  <div key={i} className="education-item">
                    <div className="font-black text-sm text-white mb-1">{edu.degree}</div>
                    <div className="text-xs opacity-40">{edu.school} | {edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="interests" isHidden={hiddenSections.includes('interests')} onToggleVisibility={() => toggleVisibility('interests')}>
            <section className="h-auto">
              <SectionHeader title="Qualités & Intérêts" icon={Heart} color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes qualités et centres d'intérêt")} />
              <div className="flex flex-wrap gap-2 cv-text-inherit">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="px-3 py-1 bg-sky-400/10 text-sky-400 text-[10px] font-bold rounded-lg uppercase tracking-widest">{q}</span>
                ))}
                {data.interests?.map((interest, i) => (
                  <span key={i} className="px-3 py-1 border border-sky-400/20 text-sky-400/70 text-[10px] italic rounded-lg">{interest}</span>
                ))}
              </div>
            </section>
          </DraggableSection>
        </div>
      </div>
    </div>
  );
};

// Template 8: Minimal Black - No Photo & Bold Titles
export const Template8: React.FC<TemplateProps> = ({ data, handleUpdate, headingFont, bodyFont, layoutSettings, onAIModify }) => {
  const color = '#000000';
  const hiddenSections = data.hiddenSections || [];

  const toggleVisibility = (sectionId: string) => {
    const newHidden = hiddenSections.includes(sectionId)
      ? hiddenSections.filter(id => id !== sectionId)
      : [...hiddenSections, sectionId];
    handleUpdate({ hiddenSections: newHidden });
  };

  return (
    <div id="cv-canvas" className={`cv-grid-50-50 cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#000' }}>
      <div className="cv-col-50 p-[var(--cv-padding)] flex flex-col cv-auto-spacing border-r-2 border-black" style={{ gap: 'var(--cv-section-spacing)' }}>
        <div className="mb-20">
          <h1 className={`text-3xl font-black uppercase leading-none mb-6 ${headingFont}`}>
            <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
            <div className="block"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></div>
          </h1>
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">
            <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
        </div>
        <div className="space-y-[var(--cv-section-spacing)] flex-1 cv-auto-spacing">
          <DraggableSection id="contact" isHidden={hiddenSections.includes('contact')} onToggleVisibility={() => toggleVisibility('contact')}>
            <section className="h-auto">
              <SectionHeader title="Contact" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
              <div className="space-y-6 cv-text-inherit font-black uppercase tracking-widest">
                <div className="flex flex-col gap-1"><span className="opacity-30">Email</span><Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
                <div className="flex flex-col gap-1"><span className="opacity-30">Téléphone</span><Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
                <div className="flex flex-col gap-1"><span className="opacity-30">Adresse</span><Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="profile" isHidden={hiddenSections.includes('profile')} onToggleVisibility={() => toggleVisibility('profile')}>
            <section className="h-auto">
              <SectionHeader title="Profil" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
              <Editable text={data.profile} multiline className="cv-text-inherit leading-relaxed font-medium profile-text" onSave={(val) => handleUpdate({ profile: val })} />
            </section>
          </DraggableSection>
          <DraggableSection id="skills" isHidden={hiddenSections.includes('skills')} onToggleVisibility={() => toggleVisibility('skills')}>
            <section className="h-auto">
              <SectionHeader title="Compétences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes compétences pour mon métier")} />
              <div className="space-y-6 cv-text-inherit">
                {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={90} color={color} />)}
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="itSkills" isHidden={hiddenSections.includes('itSkills')} onToggleVisibility={() => toggleVisibility('itSkills')}>
            <section className="h-auto">
              <SectionHeader title="Informatique" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes compétences informatiques")} />
              <div className="flex flex-wrap gap-1 cv-text-inherit">
                {data.itSkills?.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-black text-white text-[9px] font-bold rounded">{s}</span>
                ))}
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="languages" isHidden={hiddenSections.includes('languages')} onToggleVisibility={() => toggleVisibility('languages')}>
            <section className="h-auto">
              <SectionHeader title="Langues" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
              <div className="space-y-4 cv-text-inherit font-black uppercase tracking-widest">
                {data.languagesList?.map((lang, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{lang.name}</span>
                    <span className="opacity-30">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
        </div>
      </div>
      <div className="cv-col-50 p-[var(--cv-padding)] flex flex-col cv-auto-spacing" style={{ gap: 'var(--cv-section-spacing)' }}>
        <DraggableSection id="experiences" isHidden={hiddenSections.includes('experiences')} onToggleVisibility={() => toggleVisibility('experiences')}>
          <section className="h-auto">
            <SectionHeader title="Expériences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
            <div className="space-y-[var(--cv-item-spacing)]">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="experience-item">
                  <div className="flex justify-between items-baseline mb-4">
                    <Editable text={exp.position} className="font-black text-2xl uppercase tracking-tighter cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-xs font-black">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-sm font-black mb-6 block uppercase opacity-40 cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="cv-text-inherit leading-relaxed experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>
        </DraggableSection>
        <div className="grid grid-cols-1 gap-16">
          <DraggableSection id="education" isHidden={hiddenSections.includes('education')} onToggleVisibility={() => toggleVisibility('education')}>
            <section className="h-auto">
              <SectionHeader title="Formation" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
              <div className="space-y-6 cv-text-inherit">
                {data.education?.map((edu, i) => (
                  <div key={i} className="education-item">
                    <div className="font-black text-sm uppercase mb-1">{edu.degree}</div>
                    <div className="text-xs opacity-40 font-bold">{edu.school} | {edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="interests" isHidden={hiddenSections.includes('interests')} onToggleVisibility={() => toggleVisibility('interests')}>
            <section className="h-auto">
              <SectionHeader title="Qualités & Intérêts" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes qualités et centres d'intérêt")} />
              <div className="flex flex-col gap-3 cv-text-inherit">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="text-[10px] font-black uppercase tracking-[0.2em]">{q}</span>
                ))}
                {data.interests?.map((interest, i) => (
                  <span key={i} className="text-[10px] italic opacity-50">{interest}</span>
                ))}
              </div>
            </section>
          </DraggableSection>
        </div>
      </div>
    </div>
  );
};

// Template 9: Amethyst - Circular Photo & Soft Shadow Titles
export const Template9: React.FC<TemplateProps> = ({ data, handleUpdate, headingFont, bodyFont, layoutSettings, onAIModify }) => {
  const color = '#581c87';
  const hiddenSections = data.hiddenSections || [];

  const toggleVisibility = (sectionId: string) => {
    const newHidden = hiddenSections.includes(sectionId)
      ? hiddenSections.filter(id => id !== sectionId)
      : [...hiddenSections, sectionId];
    handleUpdate({ hiddenSections: newHidden });
  };

  return (
    <div id="cv-canvas" className={`cv-grid-50-50 cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#1e293b' }}>
      <div className="cv-col-50 p-[var(--cv-padding)] flex flex-col cv-auto-spacing bg-purple-50/30" style={{ gap: 'var(--cv-section-spacing)' }}>
        <div className="mb-12 text-center">
          {data.photo && <img src={data.photo} className="w-28 h-28 rounded-full object-cover mx-auto mb-8 border-4 border-white" alt="Profile" />}
          <h1 className={`text-xl font-black mb-1 ${headingFont}`} style={{ color }}>
            <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
            <div className="block opacity-40"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></div>
          </h1>
          <h2 className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-4">
            <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
        </div>
        <div className="space-y-[var(--cv-section-spacing)] cv-auto-spacing">
          <DraggableSection id="contact" isHidden={hiddenSections.includes('contact')} onToggleVisibility={() => toggleVisibility('contact')}>
            <section className="h-auto">
              <SectionHeader title="Contact" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
              <div className="space-y-4 cv-text-inherit">
                <div className="flex items-center gap-3"><Mail size={14} style={{ color }} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
                <div className="flex items-center gap-3"><Phone size={14} style={{ color }} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
                <div className="flex items-center gap-3"><MapPin size={14} style={{ color }} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="profile" isHidden={hiddenSections.includes('profile')} onToggleVisibility={() => toggleVisibility('profile')}>
            <section className="h-auto">
              <SectionHeader title="Profil" icon={User} color={color} variant="boxed" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
              <Editable text={data.profile} multiline className="cv-text-inherit leading-relaxed opacity-80 profile-text" onSave={(val) => handleUpdate({ profile: val })} />
            </section>
          </DraggableSection>
          <DraggableSection id="skills" isHidden={hiddenSections.includes('skills')} onToggleVisibility={() => toggleVisibility('skills')}>
            <section className="h-auto">
              <SectionHeader title="Compétences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise mes compétences pour mon métier")} />
              <div className="cv-text-inherit">
                {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={80} color={color} />)}
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="languages" isHidden={hiddenSections.includes('languages')} onToggleVisibility={() => toggleVisibility('languages')}>
            <section className="h-auto">
              <SectionHeader title="Langues" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
              <div className="space-y-2 cv-text-inherit">
                {data.languagesList?.map((lang, i) => (
                  <div key={i} className="flex justify-between border-b border-purple-100 pb-1">
                    <span>{lang.name}</span>
                    <span className="text-purple-600 font-bold">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
        </div>
      </div>
      <div className="cv-col-50 p-[var(--cv-padding)] flex flex-col cv-auto-spacing" style={{ gap: 'var(--cv-section-spacing)' }}>
        <DraggableSection id="experiences" isHidden={hiddenSections.includes('experiences')} onToggleVisibility={() => toggleVisibility('experiences')}>
          <section className="h-auto">
            <SectionHeader title="Expériences" icon={Briefcase} color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
            <div className="space-y-[var(--cv-item-spacing)]">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 experience-item">
                  <div className="flex justify-between items-center mb-4">
                    <Editable text={exp.position} className="font-black text-lg cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[10px] font-bold text-purple-600">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-xs font-bold mb-4 block opacity-60 cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="cv-text-inherit opacity-70 leading-relaxed experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>
        </DraggableSection>
        <div className="grid grid-cols-1 gap-12">
          <DraggableSection id="education" isHidden={hiddenSections.includes('education')} onToggleVisibility={() => toggleVisibility('education')}>
            <section className="h-auto">
              <SectionHeader title="Formation" icon={BookOpen} color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
              <div className="space-y-4 cv-text-inherit">
                {data.education?.map((edu, i) => (
                  <div key={i} className="education-item">
                    <div className="font-black text-xs uppercase mb-1">{edu.degree}</div>
                    <div className="text-[10px] opacity-50 font-bold">{edu.school} | {edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="itSkills" isHidden={hiddenSections.includes('itSkills')} onToggleVisibility={() => toggleVisibility('itSkills')}>
            <section className="h-auto">
              <SectionHeader title="Informatique" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise mes compétences informatiques")} />
              <div className="flex flex-wrap gap-1 cv-text-inherit">
                {data.itSkills?.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[9px] font-bold rounded">{s}</span>
                ))}
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="interests" isHidden={hiddenSections.includes('interests')} onToggleVisibility={() => toggleVisibility('interests')}>
            <section className="h-auto">
              <SectionHeader title="Qualités & Intérêts" icon={Heart} color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise mes qualités et centres d'intérêt")} />
              <div className="flex flex-wrap gap-2 cv-text-inherit">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-lg uppercase tracking-widest">{q}</span>
                ))}
                {data.interests?.map((interest, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-purple-100 text-purple-400 text-[10px] italic rounded-lg">{interest}</span>
                ))}
              </div>
            </section>
          </DraggableSection>
        </div>
      </div>
    </div>
  );
};

// Template 10: Ocean - Square Photo & Sidebar Gradient
export const Template10: React.FC<TemplateProps> = ({ data, handleUpdate, headingFont, bodyFont, layoutSettings, onAIModify }) => {
  const color = '#0d9488';
  const hiddenSections = data.hiddenSections || [];

  const toggleVisibility = (sectionId: string) => {
    const newHidden = hiddenSections.includes(sectionId)
      ? hiddenSections.filter(id => id !== sectionId)
      : [...hiddenSections, sectionId];
    handleUpdate({ hiddenSections: newHidden });
  };

  return (
    <div id="cv-canvas" className={`cv-grid-50-50 cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#1e293b' }}>
      <div className="cv-col-50 p-0 cv-full-height-sidebar bg-gradient-to-b from-teal-900 to-teal-700 text-white flex flex-col cv-auto-spacing" style={{ gap: 'var(--cv-section-spacing)' }}>
        {data.photo && <img src={data.photo} className="w-full aspect-square object-cover" alt="Profile" />}
        <div className="p-[var(--cv-padding)] space-y-[var(--cv-section-spacing)] cv-auto-spacing">
          <DraggableSection id="contact" isHidden={hiddenSections.includes('contact')} onToggleVisibility={() => toggleVisibility('contact')}>
            <section className="h-auto">
              <SectionHeader title="Contact" color="#2dd4bf" variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
              <div className="space-y-4 cv-text-inherit">
                <div className="flex flex-col gap-1 opacity-70"><span className="text-[8px] uppercase font-black">Email</span><Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
                <div className="flex flex-col gap-1 opacity-70"><span className="text-[8px] uppercase font-black">Téléphone</span><Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
                <div className="flex flex-col gap-1 opacity-70"><span className="text-[8px] uppercase font-black">Adresse</span><Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="profile" isHidden={hiddenSections.includes('profile')} onToggleVisibility={() => toggleVisibility('profile')}>
            <section className="h-auto">
              <SectionHeader title="Profil" icon={User} color="#2dd4bf" variant="underlined" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
              <Editable text={data.profile} multiline className="cv-text-inherit leading-relaxed opacity-80 profile-text" onSave={(val) => handleUpdate({ profile: val })} />
            </section>
          </DraggableSection>
          <DraggableSection id="skills" isHidden={hiddenSections.includes('skills')} onToggleVisibility={() => toggleVisibility('skills')}>
            <section className="h-auto">
              <SectionHeader title="Compétences" color="#2dd4bf" variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes compétences pour mon métier")} />
              <div className="cv-text-inherit">
                {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color="#2dd4bf" />)}
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="languages" isHidden={hiddenSections.includes('languages')} onToggleVisibility={() => toggleVisibility('languages')}>
            <section className="h-auto">
              <SectionHeader title="Langues" color="#2dd4bf" variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
              <div className="space-y-3 cv-text-inherit">
                {data.languagesList?.map((lang, i) => (
                  <div key={i} className="flex justify-between border-b border-teal-400/20 pb-1">
                    <span className="opacity-70">{lang.name}</span>
                    <span className="text-teal-400 font-bold">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
        </div>
      </div>
      <div className="cv-col-50 p-[var(--cv-padding)] flex flex-col cv-auto-spacing" style={{ gap: 'var(--cv-section-spacing)' }}>
        <header className="mb-12">
          <h1 className={`text-3xl font-black uppercase tracking-tighter mb-2 ${headingFont}`} style={{ color }}>
            <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
            <div className="block opacity-20"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></div>
          </h1>
          <h2 className="text-sm font-bold opacity-40 uppercase tracking-widest">
            <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
        </header>
        <div className="flex flex-col cv-auto-spacing" style={{ gap: 'var(--cv-section-spacing)' }}>
          <DraggableSection id="experiences" isHidden={hiddenSections.includes('experiences')} onToggleVisibility={() => toggleVisibility('experiences')}>
            <section className="h-auto">
              <SectionHeader title="Expériences" icon={Briefcase} color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
              <div className="space-y-[var(--cv-item-spacing)]">
                {data.experiences?.map((exp, i) => (
                  <div key={i} className="relative pl-10 experience-item">
                    <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-teal-100 border-2 border-teal-600" />
                    <div className="flex justify-between items-center mb-2">
                      <Editable text={exp.position} className="font-black text-lg cv-text-inherit" onSave={(val) => {
                        const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                      }} />
                      <span className="text-[10px] font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <Editable text={exp.company} className="text-xs font-bold mb-4 block opacity-60 cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                    }} />
                    <Editable text={exp.description} multiline className="cv-text-inherit opacity-70 leading-relaxed experience-description" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                    }} />
                  </div>
                ))}
                {data.experiences.length < 2 && <FillerContent color={color} />}
              </div>
            </section>
          </DraggableSection>
          <div className="grid grid-cols-1 gap-[var(--cv-section-spacing)]">
            <DraggableSection id="education" isHidden={hiddenSections.includes('education')} onToggleVisibility={() => toggleVisibility('education')}>
              <section className="h-auto">
                <SectionHeader title="Formation" icon={BookOpen} color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
                <div className="space-y-6 cv-text-inherit">
                  {data.education?.map((edu, i) => (
                    <div key={i}>
                      <div className="font-black text-base mb-1">{edu.degree}</div>
                      <div className="text-xs opacity-50">{edu.school} | {edu.year}</div>
                    </div>
                  ))}
                </div>
              </section>
            </DraggableSection>
            <DraggableSection id="itSkills" isHidden={hiddenSections.includes('itSkills')} onToggleVisibility={() => toggleVisibility('itSkills')}>
              <section className="h-auto">
                <SectionHeader title="Informatique" color="#2dd4bf" variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes compétences informatiques")} />
                <div className="flex flex-wrap gap-2 cv-text-inherit">
                  {data.itSkills?.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-teal-400/20 text-teal-100 text-[10px] font-bold rounded uppercase tracking-wider">{s}</span>
                  ))}
                </div>
              </section>
            </DraggableSection>
            <DraggableSection id="interests" isHidden={hiddenSections.includes('interests')} onToggleVisibility={() => toggleVisibility('interests')}>
              <section className="h-auto">
                <SectionHeader title="Qualités & Intérêts" icon={Heart} color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes qualités et centres d'intérêt")} />
                <div className="flex flex-wrap gap-2 cv-text-inherit">
                  {data.qualities?.map((q, i) => (
                    <span key={i} className="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-lg uppercase tracking-widest">{q}</span>
                  ))}
                  {data.interests?.map((interest, i) => (
                    <span key={i} className="px-3 py-1 bg-white/10 text-teal-100 text-[10px] italic rounded-lg">{interest}</span>
                  ))}
                </div>
              </section>
            </DraggableSection>
          </div>
        </div>
      </div>
    </div>
  );
};
