import React from 'react';
import { Mail, Phone, MapPin, User, Briefcase, BookOpen, Code, Languages, Heart } from 'lucide-react';
import { CVData } from '../types';
import { Editable, SkillBarSVG, SectionHeader, FillerContent } from '../components/CVElements';
import { DraggableSection } from '../components/DraggableSection';

interface TemplateProps {
  data: CVData;
  handleUpdate: (update: Partial<CVData>) => void;
  onAIModify?: (instruction: string) => void;
  headingFont: string;
  bodyFont: string;
  layoutSettings: {
    fontSize: number;
    spacing: number;
    sectionSpacing: number;
    isTwoColumn: boolean;
  };
}

// Template 21: Charcoal & Lime - Timeline
export const Template21: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#65a30d';
  const hiddenSections = data.hiddenSections || [];

  const toggleVisibility = (sectionId: string) => {
    const newHidden = hiddenSections.includes(sectionId)
      ? hiddenSections.filter(id => id !== sectionId)
      : [...hiddenSections, sectionId];
    handleUpdate({ hiddenSections: newHidden });
  };

  return (
    <div id="cv-canvas" className={`flex flex-col ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#1e293b', height: '100%' }}>
      <header className="p-12 flex items-center justify-between bg-slate-900 text-white shrink-0">
        <div className="flex-1">
          <h1 className={`text-5xl font-black uppercase tracking-tighter mb-2 ${headingFont}`}>
            <Editable text={data.firstName} onSave={(val) => handleUpdate({ firstName: val })} />
            <span className="ml-3 text-lime-500"><Editable text={data.lastName} onSave={(val) => handleUpdate({ lastName: val })} /></span>
          </h1>
          <h2 className="text-xl font-bold opacity-40 uppercase tracking-widest">
            <Editable text={data.jobTitle || ''} onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
        </div>
        {data.photo && <img src={data.photo} className="w-32 h-32 rounded-full object-cover border-4 border-lime-500 shadow-2xl" alt="Profile" />}
      </header>
      
      <div className="cv-grid-50-50 flex-grow">
        <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] bg-slate-50/50 border-r border-slate-100 cv-auto-spacing flex flex-col flex-grow">
          <DraggableSection id="contact" isHidden={hiddenSections.includes('contact')} onToggleVisibility={() => toggleVisibility('contact')}>
            <section>
              <SectionHeader title="Contact" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
              <div className="space-y-4 text-[10px] font-bold opacity-60">
                <div className="flex items-center gap-3"><Mail size={14} /> <Editable text={data.email} onSave={(val) => handleUpdate({ email: val })} /></div>
                <div className="flex items-center gap-3"><Phone size={14} /> <Editable text={data.phone} onSave={(val) => handleUpdate({ phone: val })} /></div>
                <div className="flex items-center gap-3"><MapPin size={14} /> <Editable text={data.address || ''} onSave={(val) => handleUpdate({ address: val })} /></div>
              </div>
            </section>
          </DraggableSection>

          <DraggableSection id="profile" isHidden={hiddenSections.includes('profile')} onToggleVisibility={() => toggleVisibility('profile')}>
            <section>
              <SectionHeader title="Profil" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
              <Editable text={data.profile} multiline className="text-sm leading-relaxed opacity-70 max-w-3xl profile-text" onSave={(val) => handleUpdate({ profile: val })} />
            </section>
          </DraggableSection>

          <DraggableSection id="skills" isHidden={hiddenSections.includes('skills')} onToggleVisibility={() => toggleVisibility('skills')}>
            <section>
              <SectionHeader title="Compétences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
              <div className="space-y-4">
                {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color={color} />)}
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="itSkills" isHidden={hiddenSections.includes('itSkills')} onToggleVisibility={() => toggleVisibility('itSkills')}>
            <section>
              <SectionHeader title="Informatique" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
              <div className="flex flex-wrap gap-2">
                {data.itSkills?.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-white text-[10px] font-bold rounded shadow-sm">{s}</span>
                ))}
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="languages" isHidden={hiddenSections.includes('languages')} onToggleVisibility={() => toggleVisibility('languages')}>
            <section>
              <SectionHeader title="Langues" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
              <div className="space-y-2">
                {data.languagesList?.map((lang, i) => (
                  <div key={i} className="flex justify-between text-[10px] font-bold">
                    <span>{lang.name}</span>
                    <span style={{ color }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
          <DraggableSection id="interests" isHidden={hiddenSections.includes('interests')} onToggleVisibility={() => toggleVisibility('interests')}>
            <section>
              <SectionHeader title="Qualités & Intérêts" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {data.qualities?.map((q, i) => (
                    <span key={i} className="px-2 py-1 bg-white text-[10px] font-bold rounded shadow-sm">{q}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.interests?.map((item, i) => (
                    <span key={i} className="px-2 py-1 bg-white text-slate-500 text-[10px] font-bold rounded italic shadow-sm">{item}</span>
                  ))}
                </div>
              </div>
            </section>
          </DraggableSection>
        </div>

        <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] cv-content-wrapper cv-fluid-layout cv-auto-spacing flex flex-col flex-grow cv-auto-fill">
        <DraggableSection id="experiences" isHidden={hiddenSections.includes('experiences')} onToggleVisibility={() => toggleVisibility('experiences')}>
          <section>
            <SectionHeader title="Expériences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
            <div className="relative mt-6 ml-4">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100" />
              <div className="space-y-[calc(var(--section-spacing)*0.8)]">
                {data.experiences?.map((exp, i) => (
                  <div key={i} className="relative pl-10 experience-item">
                    <div className="absolute left-[-6px] top-2 w-4 h-4 rounded-full border-4 border-white shadow-sm" style={{ backgroundColor: color }} />
                    <div className="flex justify-between items-center mb-2">
                      <Editable text={exp.position} className="font-black text-xl" onSave={(val) => {
                        const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                      }} />
                      <span className="text-xs font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <Editable text={exp.company} className="text-sm font-bold mb-4 block" style={{ color }} onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                    }} />
                    <Editable text={exp.description} multiline className="text-sm opacity-70 leading-relaxed max-w-2xl experience-description" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                    }} />
                  </div>
                ))}
                {data.experiences.length < 2 && <FillerContent color={color} />}
              </div>
            </div>
          </section>
        </DraggableSection>

        <DraggableSection id="education" isHidden={hiddenSections.includes('education')} onToggleVisibility={() => toggleVisibility('education')}>
          <section>
            <SectionHeader title="Formation" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
            <div className="space-y-4">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <div className="font-black text-sm">{edu.degree}</div>
                  <div className="text-xs opacity-50">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        </DraggableSection>
      </div>
    </div>
    </div>
  );
};

// Template 22: Navy & Cyan - Timeline
export const Template22: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#0891b2';
  return (
    <div id="cv-canvas" className={`flex flex-col ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#1e293b', height: '100%' }}>
      <header className="p-12 text-center border-b-2 border-slate-100 shrink-0">
        <h1 className={`text-4xl font-black uppercase tracking-widest mb-2 ${headingFont}`} style={{ color: '#1e3a8a' }}>
          <Editable text={data.firstName} onSave={(val) => handleUpdate({ firstName: val })} />
          <span className="ml-3 opacity-20"><Editable text={data.lastName} onSave={(val) => handleUpdate({ lastName: val })} /></span>
        </h1>
        <h2 className="text-sm font-bold opacity-40 uppercase tracking-[0.5em]">
          <Editable text={data.jobTitle || ''} onSave={(val) => handleUpdate({ jobTitle: val })} />
        </h2>
      </header>
      
      <div className="cv-grid-50-50 flex-grow">
        <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] bg-slate-50/50 border-r border-slate-100 cv-auto-spacing flex flex-col flex-grow">
          <section>
            <SectionHeader title="Contact" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
            <div className="space-y-4 text-[10px] font-bold opacity-60">
              <div className="flex items-center gap-3"><Mail size={14} /> <Editable text={data.email} onSave={(val) => handleUpdate({ email: val })} /></div>
              <div className="flex items-center gap-3"><Phone size={14} /> <Editable text={data.phone} onSave={(val) => handleUpdate({ phone: val })} /></div>
              <div className="flex items-center gap-3"><MapPin size={14} /> <Editable text={data.address || ''} onSave={(val) => handleUpdate({ address: val })} /></div>
            </div>
          </section>

          <section>
            <SectionHeader title="Profil" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
            <Editable text={data.profile} multiline className="text-sm leading-relaxed opacity-70" onSave={(val) => handleUpdate({ profile: val })} />
          </section>

          <section>
            <SectionHeader title="Compétences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
            <div className="space-y-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={80} color={color} />)}
            </div>
          </section>
          <section>
            <SectionHeader title="Informatique" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
            <div className="flex flex-wrap gap-2">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-white text-[10px] font-bold rounded shadow-sm">{s}</span>
              ))}
            </div>
          </section>
          <section>
            <SectionHeader title="Langues" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
            <div className="space-y-2">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between text-[10px] font-bold border-b border-slate-100 pb-1">
                  <span>{lang.name}</span>
                  <span style={{ color }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
          <section>
            <SectionHeader title="Qualités & Intérêts" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="px-2 py-1 bg-white text-[10px] font-bold rounded shadow-sm">{q}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.interests?.map((item, i) => (
                  <span key={i} className="px-2 py-1 bg-white text-slate-500 text-[10px] font-bold rounded italic shadow-sm">{item}</span>
                ))}
              </div>
            </div>
          </section>
          
        </div>

        <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] cv-content-wrapper cv-fluid-layout cv-auto-spacing flex flex-col flex-grow cv-auto-fill">
        <section>
          <SectionHeader title="Expériences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
          <div className="relative mt-6">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-100" />
            <div className="space-y-8">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-cyan-600" />
                  <div className="flex justify-between items-center mb-2">
                    <Editable text={exp.position} className="font-black text-base" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[10px] font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-xs font-bold mb-3 block text-cyan-700" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-xs opacity-70 leading-relaxed experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </div>
        </section>
        <section>
          <SectionHeader title="Formation" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
          <div className="space-y-4">
            {data.education?.map((edu, i) => (
              <div key={i}>
                <div className="font-black text-sm">{edu.degree}</div>
                <div className="text-xs opacity-50">{edu.school} | {edu.year}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

// Template 23: Slate & Rose - Timeline
export const Template23: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#e11d48';
  return (
    <div id="cv-canvas" className={`flex flex-col ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#334155', height: '100%' }}>
      <header className="p-16 flex flex-col items-center text-center bg-slate-50 border-b border-slate-100 shrink-0">
        {data.photo && <img src={data.photo} className="w-32 h-32 rounded-full object-cover mb-8 shadow-xl border-4 border-white" alt="Profile" />}
        <h1 className={`text-5xl font-black tracking-tighter mb-2 ${headingFont}`}>
          <Editable text={data.firstName} onSave={(val) => handleUpdate({ firstName: val })} />
          <span className="ml-3 text-rose-600"><Editable text={data.lastName} onSave={(val) => handleUpdate({ lastName: val })} /></span>
        </h1>
        <h2 className="text-lg font-bold opacity-60 uppercase tracking-[0.3em] mt-4">
          <Editable text={data.jobTitle || ''} onSave={(val) => handleUpdate({ jobTitle: val })} />
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-8 text-[11px] font-bold opacity-70">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm"><Mail size={14} className="text-rose-500" /> <Editable text={data.email} onSave={(val) => handleUpdate({ email: val })} /></div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm"><Phone size={14} className="text-rose-500" /> <Editable text={data.phone} onSave={(val) => handleUpdate({ phone: val })} /></div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm"><MapPin size={14} className="text-rose-500" /> <Editable text={data.address || ''} onSave={(val) => handleUpdate({ address: val })} /></div>
        </div>
      </header>
      <div className="cv-grid-50-50 flex-grow">
        <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] bg-slate-50/50 border-r border-slate-100 cv-auto-spacing flex flex-col flex-grow">
          <section className="break-words">
            <SectionHeader title="Profil" color={color} variant="pill" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
            <div className="border-l-4 border-rose-500 pl-8 py-2">
              <Editable text={data.profile} multiline className="text-base leading-relaxed opacity-80" onSave={(val) => handleUpdate({ profile: val })} />
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Compétences" color={color} variant="pill" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
            <div className="space-y-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={80} color={color} />)}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Informatique" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
            <div className="flex flex-wrap gap-2">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-rose-50 text-rose-700 text-[10px] font-bold rounded shadow-sm">{s}</span>
              ))}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Langues" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
            <div className="space-y-2">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between text-[10px] font-bold border-b border-slate-100 pb-1">
                  <span>{lang.name}</span>
                  <span style={{ color }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Qualités & Intérêts" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="px-2 py-1 bg-rose-50 text-rose-700 text-[10px] font-bold rounded shadow-sm">{q}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.interests?.map((item, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded italic shadow-sm">{item}</span>
                ))}
              </div>
            </div>
          </section>
          
          {data.experiences.length < 2 && <FillerContent color={color} />}
        </div>

        <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] cv-content-wrapper cv-fluid-layout cv-auto-spacing flex flex-col flex-grow cv-auto-fill">
        <section className="break-words">
          <SectionHeader title="Parcours" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
          <div className="relative mt-8">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-rose-100" />
            <div className="space-y-8">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-rose-500" />
                  <div className="flex justify-between items-center mb-2">
                    <Editable text={exp.position} className="font-black text-lg" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[10px] font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-sm font-bold mb-2 block text-rose-600" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-xs opacity-60 leading-relaxed experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </div>
        </section>
        <section className="break-words">
          <SectionHeader title="Formation" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
          <div className="space-y-4">
            {data.education?.map((edu, i) => (
              <div key={i}>
                <div className="font-black text-sm">{edu.degree}</div>
                <div className="text-xs opacity-50">{edu.school} | {edu.year}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

// Template 24: Emerald & Gold - Timeline
export const Template24: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#065f46';
  const accent = '#d97706';
  return (
    <div id="cv-canvas" className={`flex flex-col ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#0f172a', height: '100%' }}>
      <header className="p-12 flex items-center justify-between border-b-4 border-slate-900 shrink-0">
        <div className="flex items-center gap-8">
          {data.photo && <img src={data.photo} className="w-24 h-24 rounded-full object-cover border-2 border-slate-900" alt="Profile" />}
          <div className="flex-1">
            <h1 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${headingFont}`} style={{ color }}>
              <Editable text={data.firstName} onSave={(val) => handleUpdate({ firstName: val })} />
              <span className="ml-3 opacity-20"><Editable text={data.lastName} onSave={(val) => handleUpdate({ lastName: val })} /></span>
            </h1>
            <h2 className="text-lg font-bold opacity-40 uppercase tracking-widest">
              <Editable text={data.jobTitle || ''} onSave={(val) => handleUpdate({ jobTitle: val })} />
            </h2>
          </div>
        </div>
        <div className="text-right space-y-1 text-[10px] font-bold opacity-60">
          <div className="flex items-center justify-end gap-2"><Editable text={data.email} onSave={(val) => handleUpdate({ email: val })} /> <Mail size={12} /></div>
          <div className="flex items-center justify-end gap-2"><Editable text={data.phone} onSave={(val) => handleUpdate({ phone: val })} /> <Phone size={12} /></div>
          <div className="flex items-center justify-end gap-2"><Editable text={data.address || ''} onSave={(val) => handleUpdate({ address: val })} /> <MapPin size={12} /></div>
        </div>
      </header>
      <div className="cv-grid-50-50 flex-1">
        <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] bg-slate-50/50 border-r border-slate-100 cv-auto-spacing flex flex-col flex-grow">
          <section>
            <SectionHeader title="Profil" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
            <Editable text={data.profile} multiline className="text-sm leading-relaxed opacity-70" onSave={(val) => handleUpdate({ profile: val })} />
          </section>
          <section>
            <SectionHeader title="Formation" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
            <div className="space-y-4">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <div className="font-black text-sm">{edu.degree}</div>
                  <div className="text-xs opacity-50">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <SectionHeader title="Compétences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
            <div className="space-y-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={80} color={color} />)}
            </div>
          </section>
          <section>
            <SectionHeader title="Informatique" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
            <div className="flex flex-wrap gap-2">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-slate-50 text-[10px] font-bold rounded">{s}</span>
              ))}
            </div>
          </section>
          
          {data.experiences.length < 2 && <FillerContent color={color} />}
        </div>

        <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] cv-content-wrapper cv-fluid-layout cv-auto-spacing flex flex-col flex-grow cv-auto-fill">
        <section>
          <SectionHeader title="Expériences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
          <div className="relative mt-6">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100" />
            <div className="space-y-8">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-12">
                  <div className="absolute left-[-8px] top-2 w-5 h-5 rounded-full bg-white border-4" style={{ borderColor: accent }} />
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <div className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg">{exp.startDate} - {exp.endDate}</div>
                    <Editable text={exp.position} className="font-black text-xl" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                  </div>
                  <Editable text={exp.company} className="text-sm font-bold mb-4 block" style={{ color: accent }} onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-sm opacity-70 leading-relaxed experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

// Template 25: Violet & Amber - Timeline
export const Template25: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#6d28d9';
  const accent = '#f59e0b';
  return (
    <div id="cv-canvas" className={`flex flex-col ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#1e293b', height: '100%' }}>
      <header className="p-16 text-center bg-slate-50 border-b-8 shrink-0" style={{ borderColor: color }}>
        {data.photo && <img src={data.photo} className="w-32 h-32 rounded-full object-cover mx-auto mb-8 shadow-2xl border-4 border-white" alt="Profile" />}
        <h1 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${headingFont}`} style={{ color }}>
          <Editable text={data.firstName} onSave={(val) => handleUpdate({ firstName: val })} />
          <span className="ml-3 opacity-20"><Editable text={data.lastName} onSave={(val) => handleUpdate({ lastName: val })} /></span>
        </h1>
        <h2 className="text-lg font-bold opacity-40 uppercase tracking-widest">
          <Editable text={data.jobTitle || ''} onSave={(val) => handleUpdate({ jobTitle: val })} />
        </h2>
        <div className="mt-6 flex justify-center gap-8 text-[10px] font-bold opacity-50">
          <div className="flex items-center gap-2"><Mail size={12} /> <Editable text={data.email} onSave={(val) => handleUpdate({ email: val })} /></div>
          <div className="flex items-center gap-2"><Phone size={12} /> <Editable text={data.phone} onSave={(val) => handleUpdate({ phone: val })} /></div>
          <div className="flex items-center gap-2"><MapPin size={12} /> <Editable text={data.address || ''} onSave={(val) => handleUpdate({ address: val })} /></div>
        </div>
      </header>
      <div className="cv-grid-50-50 flex-1">
        <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] bg-slate-50/50 border-r border-slate-100 cv-auto-spacing flex flex-col flex-grow">
          <section>
            <SectionHeader title="Profil" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
            <Editable text={data.profile} multiline className="text-sm leading-relaxed opacity-70" onSave={(val) => handleUpdate({ profile: val })} />
          </section>
          <section>
            <SectionHeader title="Formation" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
            <div className="space-y-4">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <div className="font-black text-sm">{edu.degree}</div>
                  <div className="text-xs opacity-50">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <SectionHeader title="Compétences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
            <div className="space-y-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={80} color={color} />)}
            </div>
          </section>
          <section>
            <SectionHeader title="Informatique" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
            <div className="flex flex-wrap gap-2">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-slate-50 text-[10px] font-bold rounded">{s}</span>
              ))}
            </div>
          </section>
          <section>
            <SectionHeader title="Langues" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
            <div className="space-y-2">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between text-[10px] font-bold">
                  <span>{lang.name}</span>
                  <span style={{ color: accent }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
          <section>
            <SectionHeader title="Qualités & Intérêts" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-50 text-[10px] font-bold rounded">{q}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.interests?.map((item, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded italic">{item}</span>
                ))}
              </div>
            </div>
          </section>
          
        </div>

        <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] cv-content-wrapper cv-fluid-layout cv-auto-spacing flex flex-col flex-grow cv-auto-fill">
        <section>
          <SectionHeader title="Expériences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
          <div className="relative mt-6">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-200" />
            <div className="space-y-8">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }} />
                  <div className="flex justify-between items-center mb-2">
                    <Editable text={exp.position} className="font-black text-lg" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[10px] font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-xs font-bold mb-4 block" style={{ color: accent }} onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-xs opacity-70 leading-relaxed experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

// Template 26: Midnight & Silver - Timeline
export const Template26: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#38bdf8';
  return (
    <div id="cv-canvas" className={`cv-grid-50-50 ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#0f172a', color: '#f8fafc', height: '100%' }}>
      <header className="col-span-2 p-12 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {data.photo && <img src={data.photo} className="w-24 h-24 rounded-2xl object-cover border border-white/20" alt="Profile" />}
          <div>
            <h1 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${headingFont}`}>
              <Editable text={data.firstName} onSave={(val) => handleUpdate({ firstName: val })} />
              <span className="ml-3 text-sky-400"><Editable text={data.lastName} onSave={(val) => handleUpdate({ lastName: val })} /></span>
            </h1>
            <h2 className="text-sm font-bold opacity-40 uppercase tracking-widest">
              <Editable text={data.jobTitle || ''} onSave={(val) => handleUpdate({ jobTitle: val })} />
            </h2>
          </div>
        </div>
        <div className="flex gap-6 text-[10px] font-bold opacity-50">
          <div className="flex items-center gap-2"><Mail size={14} /> <Editable text={data.email} onSave={(val) => handleUpdate({ email: val })} /></div>
          <div className="flex items-center gap-2"><Phone size={14} /> <Editable text={data.phone} onSave={(val) => handleUpdate({ phone: val })} /></div>
          <div className="flex items-center gap-2"><MapPin size={14} /> <Editable text={data.address || ''} onSave={(val) => handleUpdate({ address: val })} /></div>
        </div>
      </header>
      <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] bg-slate-800/50 border-r border-white/5 flex flex-col flex-grow">
        <section>
          <SectionHeader title="Profil" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
          <Editable text={data.profile} multiline className="text-sm leading-relaxed opacity-60 font-light" onSave={(val) => handleUpdate({ profile: val })} />
        </section>
        <section>
          <SectionHeader title="Formation" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
          <div className="space-y-4">
            {data.education?.map((edu, i) => (
              <div key={i}>
                <div className="font-black text-sm text-sky-400">{edu.degree}</div>
                <div className="text-xs opacity-40">{edu.school} | {edu.year}</div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Compétences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
          <div className="space-y-4">
            {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={80} color={color} />)}
          </div>
        </section>
        <section>
          <SectionHeader title="Informatique" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
          <div className="flex flex-wrap gap-2">
            {data.itSkills?.map((s, i) => (
              <span key={i} className="px-2 py-1 bg-white/5 text-[10px] font-bold rounded">{s}</span>
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Langues" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
          <div className="space-y-2">
            {data.languagesList?.map((lang, i) => (
              <div key={i} className="flex justify-between text-[10px] font-bold">
                <span>{lang.name}</span>
                <span className="text-sky-400">{lang.level}</span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Qualités & Intérêts" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {data.qualities?.map((q, i) => (
                <span key={i} className="px-2 py-1 bg-white/5 text-[10px] font-bold rounded">{q}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {data.interests?.map((item, i) => (
                <span key={i} className="px-2 py-1 bg-white/10 text-sky-400/70 text-[10px] font-bold rounded italic">{item}</span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] cv-content-wrapper cv-fluid-layout flex flex-col flex-grow cv-auto-fill">
        <section>
          <SectionHeader title="Chronologie" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
          <div className="relative mt-6 ml-4">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />
            <div className="space-y-10">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-12">
                  <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
                  <div className="flex justify-between items-center mb-4">
                    <Editable text={exp.position} className="font-black text-xl text-white" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[10px] font-bold text-sky-400/50">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-xs font-bold mb-6 block text-sky-400" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-xs opacity-50 leading-relaxed experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Template 27: Forest & Cream - Timeline
export const Template27: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#14532d';
  return (
    <div id="cv-canvas" className={`cv-grid-50-50 ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fffaf5', color: '#1e293b', height: '100%' }}>
      <header className="col-span-2 p-16 text-center flex flex-col items-center shrink-0">
        {data.photo && <img src={data.photo} className="w-32 h-32 rounded-full object-cover mb-8 shadow-xl border-4 border-white" alt="Profile" />}
        <h1 className={`text-6xl font-black uppercase tracking-tighter mb-2 ${headingFont}`} style={{ color }}>
          <Editable text={data.firstName} onSave={(val) => handleUpdate({ firstName: val })} />
          <div className="block opacity-10"><Editable text={data.lastName} onSave={(val) => handleUpdate({ lastName: val })} /></div>
        </h1>
        <h2 className="text-lg font-bold opacity-40 uppercase tracking-[0.4em] mt-6">
          <Editable text={data.jobTitle || ''} onSave={(val) => handleUpdate({ jobTitle: val })} />
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-8 text-[10px] font-bold opacity-50">
          <div className="flex items-center gap-2"><Mail size={14} /> <Editable text={data.email} onSave={(val) => handleUpdate({ email: val })} /></div>
          <div className="flex items-center gap-2"><Phone size={14} /> <Editable text={data.phone} onSave={(val) => handleUpdate({ phone: val })} /></div>
          <div className="flex items-center gap-2"><MapPin size={14} /> <Editable text={data.address || ''} onSave={(val) => handleUpdate({ address: val })} /></div>
        </div>
      </header>
      <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] bg-slate-50/50 border-r border-slate-100 flex flex-col flex-grow">
        <section>
          <SectionHeader title="Profil" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
          <Editable text={data.profile} multiline className="text-sm leading-relaxed opacity-70" onSave={(val) => handleUpdate({ profile: val })} />
        </section>
        <section>
          <SectionHeader title="Formation" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
          <div className="space-y-4">
            {data.education?.map((edu, i) => (
              <div key={i}>
                <div className="font-black text-sm">{edu.degree}</div>
                <div className="text-xs opacity-50">{edu.school} | {edu.year}</div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Compétences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
          <div className="space-y-4">
            {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={80} color={color} />)}
          </div>
        </section>
        <section>
          <SectionHeader title="Informatique" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
          <div className="flex flex-wrap gap-2">
            {data.itSkills?.map((s, i) => (
              <span key={i} className="px-2 py-1 bg-slate-50 text-[10px] font-bold rounded shadow-sm">{s}</span>
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Langues" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
          <div className="space-y-2">
            {data.languagesList?.map((lang, i) => (
              <div key={i} className="flex justify-between text-[10px] font-bold border-b border-slate-100 pb-1">
                <span>{lang.name}</span>
                <span style={{ color }}>{lang.level}</span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Qualités & Intérêts" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {data.qualities?.map((q, i) => (
                <span key={i} className="px-2 py-1 bg-slate-50 text-[10px] font-bold rounded shadow-sm">{q}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {data.interests?.map((item, i) => (
                <span key={i} className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded italic shadow-sm">{item}</span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] cv-content-wrapper cv-fluid-layout flex flex-col flex-grow cv-auto-fill">
        <section>
          <SectionHeader title="Expériences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
          <div className="relative mt-6">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100" />
            <div className="space-y-8">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-12">
                  <div className="absolute left-[-8px] top-2 w-4 h-4 rounded-full bg-white border-4" style={{ borderColor: color }} />
                  <div className="flex justify-between items-center mb-2">
                    <Editable text={exp.position} className="font-black text-lg" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[10px] font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-xs font-bold mb-4 block" style={{ color }} onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-xs opacity-70 leading-relaxed experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Template 28: Bordeaux & Gray - Timeline
export const Template28: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#7f1d1d';
  return (
    <div id="cv-canvas" className={`cv-grid-50-50 ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#1e293b', height: '100%' }}>
      <header className="col-span-2 p-12 flex items-center gap-12 border-b-8" style={{ borderColor: color }}>
        {data.photo && <img src={data.photo} className="w-40 h-40 rounded-full object-cover shadow-xl border-4 border-white" alt="Profile" />}
        <div className="flex-1">
          <h1 className={`text-5xl font-black tracking-tight mb-2 ${headingFont}`} style={{ color }}>
            <Editable text={data.firstName} onSave={(val) => handleUpdate({ firstName: val })} />
            <div className="block opacity-20"><Editable text={data.lastName} onSave={(val) => handleUpdate({ lastName: val })} /></div>
          </h1>
          <h2 className="text-xl font-bold opacity-40 uppercase tracking-widest">
            <Editable text={data.jobTitle || ''} onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
          <div className="mt-6 flex gap-6 text-[10px] font-bold opacity-50">
            <div className="flex items-center gap-2"><Mail size={12} /> <Editable text={data.email} onSave={(val) => handleUpdate({ email: val })} /></div>
            <div className="flex items-center gap-2"><Phone size={12} /> <Editable text={data.phone} onSave={(val) => handleUpdate({ phone: val })} /></div>
            <div className="flex items-center gap-2"><MapPin size={12} /> <Editable text={data.address || ''} onSave={(val) => handleUpdate({ address: val })} /></div>
          </div>
        </div>
      </header>
      <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] bg-slate-50/50 border-r border-slate-100 flex flex-col flex-grow">
        <section>
          <SectionHeader title="Profil" color={color} variant="pill" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
          <Editable text={data.profile} multiline className="text-sm leading-relaxed opacity-70" onSave={(val) => handleUpdate({ profile: val })} />
        </section>
        <section>
          <SectionHeader title="Formation" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
          <div className="space-y-4">
            {data.education?.map((edu, i) => (
              <div key={i}>
                <div className="font-black text-sm">{edu.degree}</div>
                <div className="text-xs opacity-50">{edu.school} | {edu.year}</div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Compétences" color={color} variant="pill" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
          <div className="space-y-4">
            {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={80} color={color} />)}
          </div>
        </section>
        <section>
          <SectionHeader title="Informatique" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
          <div className="flex flex-wrap gap-2">
            {data.itSkills?.map((s, i) => (
              <span key={i} className="px-2 py-1 bg-slate-50 text-[10px] font-bold rounded">{s}</span>
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Langues" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
          <div className="space-y-2">
            {data.languagesList?.map((lang, i) => (
              <div key={i} className="flex justify-between text-[10px] font-bold">
                <span>{lang.name}</span>
                <span style={{ color }}>{lang.level}</span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Qualités & Intérêts" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {data.qualities?.map((q, i) => (
                <span key={i} className="px-2 py-1 bg-slate-50 text-[10px] font-bold rounded">{q}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {data.interests?.map((item, i) => (
                <span key={i} className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded italic">{item}</span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] cv-content-wrapper cv-fluid-layout flex flex-col flex-grow cv-auto-fill">
        <section>
          <SectionHeader title="Historique" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
          <div className="relative mt-6 ml-4">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-200" />
            <div className="space-y-8">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <div className="flex justify-between items-center mb-2">
                    <Editable text={exp.position} className="font-black text-lg" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[10px] font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-xs font-bold mb-4 block opacity-50" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-xs opacity-70 leading-relaxed experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Template 29: Ocean & White - Timeline
export const Template29: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#0d9488';
  return (
    <div id="cv-canvas" className={`cv-grid-50-50 ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#1e293b', height: '100%' }}>
      <header className="col-span-2 p-12 text-center bg-teal-900 text-white">
        <div className="flex justify-center mb-6">
          {data.photo && <img src={data.photo} className="w-24 h-24 rounded-full object-cover border-2 border-teal-400" alt="Profile" />}
        </div>
        <h1 className={`text-4xl font-black uppercase tracking-widest mb-2 ${headingFont}`}>
          <Editable text={data.firstName} onSave={(val) => handleUpdate({ firstName: val })} />
          <span className="ml-3 text-teal-400"><Editable text={data.lastName} onSave={(val) => handleUpdate({ lastName: val })} /></span>
        </h1>
        <h2 className="text-sm font-bold opacity-40 uppercase tracking-[0.4em] mt-4">
          <Editable text={data.jobTitle || ''} onSave={(val) => handleUpdate({ jobTitle: val })} />
        </h2>
        <div className="mt-6 flex justify-center gap-6 text-[10px] font-bold opacity-50">
          <div className="flex items-center gap-2"><Mail size={12} /> <Editable text={data.email} onSave={(val) => handleUpdate({ email: val })} /></div>
          <div className="flex items-center gap-2"><Phone size={12} /> <Editable text={data.phone} onSave={(val) => handleUpdate({ phone: val })} /></div>
          <div className="flex items-center gap-2"><MapPin size={12} /> <Editable text={data.address || ''} onSave={(val) => handleUpdate({ address: val })} /></div>
        </div>
      </header>
      <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] bg-teal-50/50 border-r border-teal-100 flex flex-col flex-grow">
        <section>
          <SectionHeader title="Profil" color={color} variant="standard" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
          <Editable text={data.profile} multiline className="text-sm leading-relaxed opacity-70" onSave={(val) => handleUpdate({ profile: val })} />
        </section>
        <section>
          <SectionHeader title="Formation" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
          <div className="space-y-4">
            {data.education?.map((edu, i) => (
              <div key={i}>
                <div className="font-black text-sm">{edu.degree}</div>
                <div className="text-xs opacity-50">{edu.school} | {edu.year}</div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Compétences" color={color} variant="standard" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
          <div className="space-y-4">
            {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={80} color={color} />)}
          </div>
        </section>
        <section>
          <SectionHeader title="Informatique" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
          <div className="flex flex-wrap gap-2">
            {data.itSkills?.map((s, i) => (
              <span key={i} className="px-2 py-1 bg-teal-50 text-teal-700 text-[10px] font-bold rounded">{s}</span>
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Langues" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
          <div className="space-y-2">
            {data.languagesList?.map((lang, i) => (
              <div key={i} className="flex justify-between text-[10px] font-bold">
                <span>{lang.name}</span>
                <span style={{ color }}>{lang.level}</span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Qualités & Intérêts" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {data.qualities?.map((q, i) => (
                <span key={i} className="px-2 py-1 bg-teal-50 text-teal-700 text-[10px] font-bold rounded">{q}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {data.interests?.map((item, i) => (
                <span key={i} className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded italic">{item}</span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] cv-content-wrapper cv-fluid-layout flex flex-col flex-grow cv-auto-fill">
        <section>
          <SectionHeader title="Expériences" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
          <div className="relative mt-6">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-50" />
            <div className="space-y-8">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-12">
                  <div className="absolute left-[-8px] top-2 w-4 h-4 rounded-full bg-teal-600 shadow-lg" />
                  <div className="flex justify-between items-center mb-2">
                    <Editable text={exp.position} className="font-black text-lg" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[10px] font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-xs font-bold mb-4 block text-teal-700" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-xs opacity-70 leading-relaxed experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Template 30: Amethyst & Black - Timeline
export const Template30: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#581c87';
  return (
    <div id="cv-canvas" className={`cv-grid-50-50 ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#1e293b', height: '100%' }}>
      <header className="col-span-2 p-12 flex items-center justify-between border-b-2 border-slate-100">
        <div className="flex-1">
          <h1 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${headingFont}`} style={{ color }}>
            <Editable text={data.firstName} onSave={(val) => handleUpdate({ firstName: val })} />
            <span className="ml-3 opacity-20"><Editable text={data.lastName} onSave={(val) => handleUpdate({ lastName: val })} /></span>
          </h1>
          <h2 className="text-lg font-bold opacity-40 uppercase tracking-widest">
            <Editable text={data.jobTitle || ''} onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
          <div className="mt-4 flex gap-6 text-[10px] font-bold opacity-50">
            <div className="flex items-center gap-2"><Mail size={12} /> <Editable text={data.email} onSave={(val) => handleUpdate({ email: val })} /></div>
            <div className="flex items-center gap-2"><Phone size={12} /> <Editable text={data.phone} onSave={(val) => handleUpdate({ phone: val })} /></div>
            <div className="flex items-center gap-2"><MapPin size={12} /> <Editable text={data.address || ''} onSave={(val) => handleUpdate({ address: val })} /></div>
          </div>
        </div>
        {data.photo && <img src={data.photo} className="w-32 h-32 rounded-full object-cover border-4 border-purple-100 shadow-xl" alt="Profile" />}
      </header>
      <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] bg-purple-50/50 border-r border-purple-100 flex flex-col flex-grow">
        <section>
          <SectionHeader title="Profil" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
          <Editable text={data.profile} multiline className="text-sm leading-relaxed opacity-70" onSave={(val) => handleUpdate({ profile: val })} />
        </section>
        <section>
          <SectionHeader title="Formation" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
          <div className="space-y-4">
            {data.education?.map((edu, i) => (
              <div key={i}>
                <div className="font-black text-sm">{edu.degree}</div>
                <div className="text-xs opacity-50">{edu.school} | {edu.year}</div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Compétences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
          <div className="space-y-4">
            {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={80} color={color} />)}
          </div>
        </section>
        <section>
          <SectionHeader title="Informatique" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
          <div className="flex flex-wrap gap-2">
            {data.itSkills?.map((s, i) => (
              <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded">{s}</span>
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Langues" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
          <div className="space-y-2">
            {data.languagesList?.map((lang, i) => (
              <div key={i} className="flex justify-between text-[10px] font-bold">
                <span>{lang.name}</span>
                <span style={{ color }}>{lang.level}</span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Qualités & Intérêts" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {data.qualities?.map((q, i) => (
                <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded">{q}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {data.interests?.map((item, i) => (
                <span key={i} className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded italic">{item}</span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="cv-col-50 p-12 space-y-[var(--cv-section-spacing)] cv-content-wrapper cv-fluid-layout flex flex-col flex-grow cv-auto-fill">
        <section>
          <SectionHeader title="Expériences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
          <div className="relative mt-6 ml-4">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-purple-50" />
            <div className="space-y-8">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-purple-600" />
                  <div className="flex justify-between items-center mb-2">
                    <Editable text={exp.position} className="font-black text-lg" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[10px] font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-xs font-bold mb-4 block text-purple-700" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-xs opacity-70 leading-relaxed experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
