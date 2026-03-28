import React from 'react';
import { Mail, Phone, MapPin, User, Briefcase, BookOpen, Code, Languages, Heart, Sparkles } from 'lucide-react';
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

// Templates 51-55 have been removed as requested.

// Template 56: The Executive - Ultra-Complete & Fluid
export const Template56: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#1e293b';
  const accent = '#0ea5e9';
  const hiddenSections = data.hiddenSections || [];

  const toggleVisibility = (sectionId: string) => {
    const newHidden = hiddenSections.includes(sectionId)
      ? hiddenSections.filter(id => id !== sectionId)
      : [...hiddenSections, sectionId];
    handleUpdate({ hiddenSections: newHidden });
  };
  
  return (
    <div id="cv-canvas" className={`cv-grid-50-50 ${bodyFont} bg-white text-slate-900 ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ height: '100%' }}>
      {/* Header with full-width background */}
      <header className="col-span-2 bg-slate-900 text-white p-[var(--cv-padding)] shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex-1">
            <h1 className={`text-6xl font-black tracking-tighter mb-2 ${headingFont}`}>
              <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
              <span className="ml-4 text-sky-400"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></span>
            </h1>
            <h2 className="text-xl font-bold text-sky-200 uppercase tracking-widest">
              <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
            </h2>
          </div>
          <div className="flex flex-col gap-3 text-sm font-medium opacity-80">
            <div className="flex items-center gap-3"><Mail size={16} className="text-sky-400" /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
            <div className="flex items-center gap-3"><Phone size={16} className="text-sky-400" /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
            <div className="flex items-center gap-3"><MapPin size={16} className="text-sky-400" /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
          </div>
        </div>
      </header>

      {/* Main Content Split 50/50 */}
      <div className="cv-col-50 space-y-[var(--cv-section-spacing)] bg-slate-50/30 border-r border-slate-100">
        <DraggableSection id="profile" isHidden={hiddenSections.includes('profile')} onToggleVisibility={() => toggleVisibility('profile')}>
          <section>
            <SectionHeader title="Profil Professionnel" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
            <div className="mt-6">
              <Editable text={data.profile} multiline className="text-base leading-relaxed text-slate-600 profile-text cv-text-inherit" onSave={(val) => handleUpdate({ profile: val })} />
            </div>
          </section>
        </DraggableSection>

        <DraggableSection id="skills" isHidden={hiddenSections.includes('skills')} onToggleVisibility={() => toggleVisibility('skills')}>
          <section>
            <SectionHeader title="Expertise" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
            <div className="mt-6 space-y-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color={accent} />)}
            </div>
          </section>
        </DraggableSection>

        <DraggableSection id="itSkills" isHidden={hiddenSections.includes('itSkills')} onToggleVisibility={() => toggleVisibility('itSkills')}>
          <section>
            <SectionHeader title="Outils & IT" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
            <div className="mt-6 flex flex-wrap gap-2">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-sky-50 text-sky-700 text-[11px] font-bold rounded-lg border border-sky-100">{s}</span>
              ))}
            </div>
          </section>
        </DraggableSection>

        <DraggableSection id="languages" isHidden={hiddenSections.includes('languages')} onToggleVisibility={() => toggleVisibility('languages')}>
          <section>
            <SectionHeader title="Langues" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
            <div className="mt-6 space-y-3">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">{lang.name}</span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded uppercase">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        </DraggableSection>

        <DraggableSection id="interests" isHidden={hiddenSections.includes('interests')} onToggleVisibility={() => toggleVisibility('interests')}>
          <section>
            <SectionHeader title="Atouts & Intérêts" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
            <div className="mt-6 space-y-6">
              <div className="flex flex-wrap gap-2">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg">{q}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.interests?.map((item, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg italic">{item}</span>
                ))}
              </div>
            </div>
          </section>
        </DraggableSection>
      </div>

      <div className="cv-col-50 space-y-[var(--cv-section-spacing)]">
        {data.photo && (
          <div className="mb-4">
            <img src={data.photo} className="w-full aspect-square object-cover rounded-3xl shadow-2xl border-8 border-slate-50" alt="Profile" />
          </div>
        )}

        <DraggableSection id="experiences" isHidden={hiddenSections.includes('experiences')} onToggleVisibility={() => toggleVisibility('experiences')}>
          <section>
            <SectionHeader title="Expériences Professionnelles" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
            <div className="mt-8 space-y-12">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="group relative pl-8 border-l-2 border-slate-100 hover:border-sky-400 transition-colors experience-item">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-slate-200 group-hover:border-sky-400 transition-colors" />
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                    <Editable text={exp.position} className="font-black text-xl text-slate-800 cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-wider">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-sky-600 font-bold mb-4 block text-sm cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-sm text-slate-600 leading-relaxed experience-description cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>
        </DraggableSection>

        <DraggableSection id="education" isHidden={hiddenSections.includes('education')} onToggleVisibility={() => toggleVisibility('education')}>
          <section>
            <SectionHeader title="Formation & Diplômes" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.education?.map((edu, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 education-item">
                  <div className="font-black text-slate-800 mb-1">{edu.degree}</div>
                  <div className="text-sky-600 text-sm font-bold mb-2">{edu.school}</div>
                  <div className="text-xs text-slate-400 font-bold">{edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        </DraggableSection>
      </div>
    </div>
  );
};
