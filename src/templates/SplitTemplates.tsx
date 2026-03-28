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

// Template 11: Navy & White - Modern Split
export const Template11: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#1e3a8a';
  const hiddenSections = data.hiddenSections || [];

  const toggleVisibility = (sectionId: string) => {
    const newHidden = hiddenSections.includes(sectionId)
      ? hiddenSections.filter(id => id !== sectionId)
      : [...hiddenSections, sectionId];
    handleUpdate({ hiddenSections: newHidden });
  };

  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#1e293b', width: '210mm', height: '297mm', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <header className="p-[var(--cv-padding)] text-center border-b-8 shrink-0" style={{ borderColor: color }}>
        {data.photo && <img src={data.photo} className="w-24 h-24 rounded-full object-cover mx-auto mb-6 border-4 border-slate-100" alt="Profile" />}
        <h1 className={`text-3xl font-black uppercase tracking-tighter mb-2 ${headingFont}`} style={{ color }}>
          <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
          <span className="ml-3 opacity-30"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></span>
        </h1>
        <h2 className="text-sm font-bold opacity-50 uppercase tracking-[0.3em]">
          <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
        </h2>
      </header>
      
      <div className="cv-grid-50-50 flex-1">
        {/* Left Column: Contact, Profile, Skills, Languages */}
        <div className="cv-col-50 flex flex-col flex-grow bg-slate-50/50 border-r border-slate-100 cv-auto-spacing">
          <section className="cv-section">
            <SectionHeader title="Contact" icon={Mail} color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
            <div className="space-y-3 text-[10px] font-bold opacity-60">
              <div className="flex items-center gap-3"><Mail size={14} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
              <div className="flex items-center gap-3"><Phone size={14} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
              <div className="flex items-center gap-3"><MapPin size={14} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
            </div>
          </section>

          <section className="cv-section">
            <SectionHeader title="Profil" icon={User} color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mon profil professionnel")} />
            <Editable text={data.profile} multiline className="text-xs leading-relaxed opacity-70 cv-text-inherit" onSave={(val) => handleUpdate({ profile: val })} />
          </section>

          <section className="cv-section">
            <SectionHeader title="Compétences" icon={Code} color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes compétences")} />
            <div className="grid grid-cols-1 gap-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color={color} />)}
            </div>
          </section>

          <section className="cv-section">
            <SectionHeader title="Langues" icon={Languages} color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes compétences linguistiques")} />
            <div className="space-y-2">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between items-center cv-text-inherit">
                  <span className="text-xs font-bold">{lang.name}</span>
                  <span className="text-[10px] opacity-50">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Experiences, Education */}
        <div className="cv-col-50 flex flex-col flex-grow cv-auto-fill">
          <section className="cv-section">
            <SectionHeader title="Expériences" icon={Briefcase} color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles")} />
            <div className="space-y-6">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="experience-item">
                  <div className="flex justify-between items-start mb-1">
                    <Editable text={exp.position} className="font-bold text-sm cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[10px] opacity-40 whitespace-nowrap ml-2">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-xs font-bold mb-2 block cv-text-inherit" style={{ color }} onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-[10px] opacity-60 leading-relaxed experience-description cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>

          <section className="cv-section">
            <SectionHeader title="Formation" icon={BookOpen} color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore ma formation académique")} />
            <div className="space-y-4">
              {data.education?.map((edu, i) => (
                <div key={i} className="education-item">
                  <div className="font-bold text-sm mb-1">{edu.degree}</div>
                  <div className="text-xs opacity-60 font-medium">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Template 12: Slate & Gold - Modern Split
export const Template12: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#334155';
  const accent = '#b45309';
  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#f8fafc', color: '#0f172a', width: '210mm', height: '297mm', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <header className="p-[var(--cv-padding)] flex items-center justify-between bg-white border-b shrink-0">
        <div className="flex-1">
          <h1 className={`text-3xl font-black tracking-tight mb-2 ${headingFont}`} style={{ color }}>
            <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
            <div className="block" style={{ color: accent }}><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></div>
          </h1>
          <h2 className="text-sm font-bold opacity-40 uppercase tracking-[0.2em]">
            <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
        </div>
        {data.photo && <img src={data.photo} className="w-28 h-28 rounded-2xl object-cover border-4 border-white" alt="Profile" />}
      </header>
      
      <div className="cv-grid-50-50 flex-1">
        {/* Left Column: Contact, Profile, Skills, Languages */}
        <div className="cv-col-50 flex flex-col flex-grow bg-white border-r cv-auto-spacing">
          <section className="cv-section">
            <SectionHeader title="Contact" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
            <div className="grid grid-cols-1 gap-4 text-[9px] font-bold">
              <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl"><Mail size={12} style={{ color: accent }} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
              <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl"><Phone size={12} style={{ color: accent }} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
              <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl"><MapPin size={12} style={{ color: accent }} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
            </div>
          </section>

          <section className="cv-section">
            <SectionHeader title="Profil" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mon profil professionnel")} />
            <Editable text={data.profile} multiline className="text-xs leading-relaxed opacity-70 border-l-2 pl-6 cv-text-inherit" style={{ borderColor: accent }} onSave={(val) => handleUpdate({ profile: val })} />
          </section>

          <section className="cv-section">
            <SectionHeader title="Compétences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes compétences")} />
            <div className="space-y-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={90} color={accent} />)}
            </div>
          </section>

          <section className="cv-section">
            <SectionHeader title="Langues" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes compétences linguistiques")} />
            <div className="space-y-3">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between items-center border-b border-slate-200 pb-2 cv-text-inherit">
                  <span className="text-[10px] font-bold">{lang.name}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Experiences, Education */}
        <div className="cv-col-50 flex flex-col flex-grow cv-auto-fill">
          <section className="cv-section">
            <SectionHeader title="Expériences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles")} />
            <div className="space-y-[calc(var(--section-spacing)*0.8)]">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="page-break-inside-avoid">
                  <div className="flex justify-between items-center mb-2">
                    <Editable text={exp.position} className="font-black text-sm uppercase cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[9px] font-black opacity-30">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-[10px] font-bold mb-4 block cv-text-inherit" style={{ color: accent }} onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-[10px] opacity-60 leading-relaxed experience-description cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={accent} />}
            </div>
          </section>

          <section className="cv-section">
            <SectionHeader title="Formation" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore ma formation académique")} />
            <div className="space-y-6">
              {data.education?.map((edu, i) => (
                <div key={i} className="page-break-inside-avoid cv-text-inherit">
                  <div className="font-black text-xs uppercase mb-1">{edu.degree}</div>
                  <div className="text-[10px] opacity-50 font-bold">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Template 13: Rose & Charcoal - Modern Split
export const Template13: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#be123c';
  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#334155', width: '210mm', height: '297mm', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <header className="p-[var(--cv-padding)] text-center bg-slate-900 text-white shrink-0">
        {data.photo && <img src={data.photo} className="w-24 h-24 rounded-full object-cover mx-auto mb-8 border-4 border-rose-500" alt="Profile" />}
        <h1 className={`text-3xl font-black uppercase tracking-widest mb-2 ${headingFont}`}>
          <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
          <span className="ml-3 text-rose-500"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></span>
        </h1>
        <h2 className="text-[10px] font-bold opacity-50 uppercase tracking-[0.5em] mt-4">
          <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
        </h2>
      </header>
      
      <div className="cv-grid-50-50 flex-1">
        {/* Left Column: Contact, Profile, Skills, Languages */}
        <div className="cv-col-50 flex flex-col flex-grow border-r cv-auto-spacing">
          <section className="cv-section">
            <SectionHeader title="Contact" color={color} variant="pill" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
            <div className="space-y-4 text-[9px] font-medium">
              <div className="flex items-center gap-3"><Mail size={12} className="text-rose-500" /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
              <div className="flex items-center gap-3"><Phone size={12} className="text-rose-500" /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
              <div className="flex items-center gap-3"><MapPin size={12} className="text-rose-500" /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
            </div>
          </section>

          <section className="cv-section">
            <SectionHeader title="Profil" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mon profil professionnel")} />
            <Editable text={data.profile} multiline className="text-xs leading-relaxed opacity-70 cv-text-inherit" onSave={(val) => handleUpdate({ profile: val })} />
          </section>

          <section className="cv-section">
            <SectionHeader title="Compétences" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes compétences")} />
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full">{s}</span>
              ))}
            </div>
          </section>

          <section className="cv-section">
            <SectionHeader title="Langues" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes compétences linguistiques")} />
            <div className="space-y-3">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between items-center cv-text-inherit">
                  <span className="text-[10px] font-bold">{lang.name}</span>
                  <span className="text-[9px] text-rose-500 font-black">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Experiences, Education */}
        <div className="cv-col-50 flex flex-col flex-grow cv-auto-fill">
          <section className="cv-section">
            <SectionHeader title="Expériences" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles")} />
            <div className="space-y-6">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="border-l-2 border-rose-100 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <Editable text={exp.position} className="font-bold text-sm cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[9px] opacity-40">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-xs font-bold mb-2 block text-rose-600 cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-[10px] opacity-60 leading-relaxed experience-description cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>

          <section className="cv-section">
            <SectionHeader title="Formation" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore ma formation académique")} />
            <div className="space-y-4">
              {data.education?.map((edu, i) => (
                <div key={i} className="cv-text-inherit">
                  <div className="font-bold text-sm mb-1">{edu.degree}</div>
                  <div className="text-xs opacity-60">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Template 14: Teal & Cream - Modern Split
export const Template14: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#0f766e';
  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fffaf5', color: '#1e293b', width: '210mm', height: '297mm', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <header className="p-[var(--cv-padding)] text-center border-b border-teal-100 shrink-0">
        {data.photo && <img src={data.photo} className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 border-2 border-teal-600/20" alt="Profile" />}
        <h1 className={`text-3xl font-black tracking-tighter mb-1 ${headingFont}`} style={{ color }}>
          <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
          <div className="block opacity-20"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></div>
        </h1>
        <div className="h-1 w-16 bg-teal-600 mx-auto my-4" />
        <h2 className="text-sm font-bold opacity-40 uppercase tracking-widest">
          <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
        </h2>
      </header>
      
      <div className="cv-grid-50-50 flex-1">
        {/* Left Column: Contact, Profile, Skills, Languages */}
        <div className="cv-col-50 flex flex-col flex-grow bg-white rounded-t-[40px] border-r cv-auto-spacing">
          <section className="cv-section">
            <SectionHeader title="Contact" color={color} variant="standard" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
            <div className="space-y-3 text-[9px] font-bold opacity-60">
              <div className="flex items-center gap-3"><Mail size={12} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
              <div className="flex items-center gap-3"><Phone size={12} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
              <div className="flex items-center gap-3"><MapPin size={12} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
            </div>
          </section>

          <section className="cv-section">
            <SectionHeader title="Profil" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore mon profil professionnel")} />
            <Editable text={data.profile} multiline className="text-xs leading-relaxed opacity-70 cv-text-inherit" onSave={(val) => handleUpdate({ profile: val })} />
          </section>

          <section className="cv-section">
            <SectionHeader title="Compétences" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore mes compétences")} />
            <div className="space-y-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color={color} />)}
            </div>
          </section>

          <section className="cv-section">
            <SectionHeader title="Langues" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore mes compétences linguistiques")} />
            <div className="grid grid-cols-1 gap-3">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex flex-col cv-text-inherit">
                  <span className="text-[10px] font-bold">{lang.name}</span>
                  <span className="text-[9px] opacity-40">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Experiences, Education */}
        <div className="cv-col-50 flex flex-col flex-grow cv-auto-fill">
          <section className="cv-section">
            <SectionHeader title="Expériences" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles")} />
            <div className="space-y-6">
              {data.experiences?.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <Editable text={exp.position} className="font-black text-sm cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[9px] font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-[10px] font-bold mb-2 block text-teal-600 cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-[10px] opacity-70 leading-relaxed experience-description cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>

          <section className="cv-section">
            <SectionHeader title="Formation" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore ma formation académique")} />
            <div className="space-y-4">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <div className="font-black text-xs mb-1">{edu.degree}</div>
                  <div className="text-[10px] opacity-50">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Template 15: Violet & Silver - Modern Split
export const Template15: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#6d28d9';
  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#1e293b', width: '210mm', height: '297mm', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <header className="p-[var(--cv-padding)] flex flex-col items-center text-center border-b border-slate-100 shrink-0">
        {data.photo && <img src={data.photo} className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-violet-100" alt="Profile" />}
        <h1 className={`text-3xl font-black uppercase tracking-tight mb-1 ${headingFont}`} style={{ color }}>
          <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
          <span className="ml-3 opacity-20"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></span>
        </h1>
        <h2 className="text-xs font-bold opacity-40 uppercase tracking-[0.4em]">
          <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
        </h2>
      </header>
      
      <div className="cv-grid-50-50 flex-1">
        {/* Left Column: Contact, Profile, Skills, Languages */}
        <div className="cv-col-50 flex flex-col flex-grow border-r cv-auto-spacing">
          <section className="cv-section">
            <SectionHeader title="Contact" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
            <div className="space-y-3 text-[9px] font-bold opacity-60">
              <div className="flex items-center gap-3"><Mail size={12} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
              <div className="flex items-center gap-3"><Phone size={12} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
              <div className="flex items-center gap-3"><MapPin size={12} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
            </div>
          </section>

          <section className="cv-section">
            <SectionHeader title="Profil" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mon profil professionnel")} />
            <Editable text={data.profile} multiline className="text-xs leading-relaxed opacity-70 cv-text-inherit" onSave={(val) => handleUpdate({ profile: val })} />
          </section>

          <section className="cv-section">
            <SectionHeader title="Compétences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes compétences")} />
            <div className="grid grid-cols-1 gap-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={80} color={color} />)}
            </div>
          </section>

          <section className="cv-section">
            <SectionHeader title="Langues" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes compétences linguistiques")} />
            <div className="space-y-2">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between text-[9px] font-bold border-b border-slate-50 pb-2 cv-text-inherit">
                  <span>{lang.name}</span>
                  <span style={{ color }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Experiences, Education */}
        <div className="cv-col-50 flex flex-col flex-grow cv-auto-fill">
          <section className="cv-section">
            <SectionHeader title="Expériences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles")} />
            <div className="space-y-6">
              {data.experiences?.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <Editable text={exp.position} className="font-black text-sm cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[9px] font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-[10px] font-bold mb-2 block cv-text-inherit" style={{ color }} onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-[10px] opacity-70 leading-relaxed experience-description cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>

          <section className="cv-section">
            <SectionHeader title="Formation" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore ma formation académique")} />
            <div className="space-y-4">
              {data.education?.map((edu, i) => (
                <div key={i} className="cv-text-inherit">
                  <div className="font-black text-xs uppercase mb-1">{edu.degree}</div>
                  <div className="text-[10px] opacity-50">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Template 16: Amber & Black - Modern Split
export const Template16: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#f59e0b';
  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#000', color: '#fff', width: '210mm', height: '297mm', overflow: 'hidden' }}>
      <header className="p-[var(--cv-padding)] text-center border-b border-white/10">
        {data.photo && <img src={data.photo} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-amber-500" alt="Profile" />}
        <h1 className={`text-3xl font-black uppercase tracking-tighter mb-1 ${headingFont}`}>
          <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
          <span className="ml-3 text-amber-500"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></span>
        </h1>
        <h2 className="text-sm font-bold opacity-40 uppercase tracking-[0.3em]">
          <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
        </h2>
      </header>
      <div className="cv-grid-50-50 flex-1">
        <div className="cv-col-50 flex flex-col flex-grow p-[var(--cv-padding)] space-y-8 border-r border-white/10 cv-auto-spacing">
          <section className="break-words">
            <SectionHeader title="Contact" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
            <div className="space-y-4 text-[9px] font-bold opacity-60">
              <div className="flex items-center gap-4"><Mail size={14} className="text-amber-500" /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
              <div className="flex items-center gap-4"><Phone size={14} className="text-amber-500" /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
              <div className="flex items-center gap-4"><MapPin size={14} className="text-amber-500" /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Compétences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes compétences")} />
            <div className="grid grid-cols-1 gap-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color={color} />)}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Langues" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes compétences linguistiques")} />
            <div className="space-y-3">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between text-[9px] font-black uppercase tracking-widest cv-text-inherit">
                  <span className="opacity-50">{lang.name}</span>
                  <span className="text-amber-500">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Informatique" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes compétences informatiques")} />
            <div className="flex flex-wrap gap-2">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-2 py-1 border border-amber-500/30 text-amber-500 text-[9px] font-bold rounded shadow-sm">{s}</span>
              ))}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Qualités & Intérêts" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="px-3 py-1 border border-amber-500/30 text-amber-500 text-[9px] font-bold rounded-lg uppercase tracking-widest">{q}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.interests?.map((item, i) => (
                  <span key={i} className="px-3 py-1 border border-amber-500/30 text-slate-400 text-[9px] font-bold rounded-lg italic">{item}</span>
                ))}
              </div>
            </div>
          </section>
          
          {data.experiences.length < 2 && <FillerContent color={color} />}
        </div>
        <div className="cv-col-50 flex flex-col flex-grow p-[var(--cv-padding)] space-y-[var(--cv-section-spacing)] cv-auto-fill cv-auto-spacing">
          <section className="break-words">
            <SectionHeader title="Profil" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mon profil professionnel")} />
            <Editable text={data.profile} multiline className="text-xs leading-relaxed opacity-60 font-light cv-text-inherit" onSave={(val) => handleUpdate({ profile: val })} />
          </section>
          <section className="break-words">
            <SectionHeader title="Expériences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles")} />
            <div className="space-y-6">
              {data.experiences?.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <Editable text={exp.position} className="font-black text-sm text-white cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[9px] font-bold text-amber-500/50">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-[10px] font-bold mb-2 block text-amber-500 cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-[10px] opacity-50 leading-relaxed experience-description cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Formation" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore ma formation académique")} />
            <div className="space-y-4">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <div className="font-black text-xs text-white mb-1">{edu.degree}</div>
                  <div className="text-[10px] opacity-40 font-bold">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Template 17: Cyan & Dark Blue - Modern Split
export const Template17: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#0891b2';
  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont}`} style={{ backgroundColor: '#fff', color: '#1e293b', width: '210mm', height: '297mm', overflow: 'hidden' }}>
      <header className="p-[var(--cv-padding)] flex items-center gap-12 bg-slate-50">
        {data.photo && <img src={data.photo} className="w-40 h-40 rounded-full object-cover shadow-xl border-4 border-white" alt="Profile" />}
        <div className="flex-1">
          <h1 className={`text-5xl font-black uppercase tracking-tighter mb-2 ${headingFont}`} style={{ color }}>
            <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
            <div className="block opacity-20"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></div>
          </h1>
          <h2 className="text-xl font-bold opacity-40 uppercase tracking-widest">
            <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
        </div>
      </header>
      <div className="cv-grid-50-50 flex-1">
        <div className="cv-col-50 p-[var(--cv-padding)] space-y-10 flex flex-col cv-auto-spacing flex-grow">
          <section className="break-words">
            <SectionHeader title="Contact" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
            <div className="space-y-4 text-[10px] font-bold opacity-60">
              <div className="flex items-center gap-3"><Mail size={14} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
              <div className="flex items-center gap-3"><Phone size={14} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
              <div className="flex items-center gap-3"><MapPin size={14} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Compétences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes compétences")} />
            <div className="space-y-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color={color} />)}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Langues" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes compétences linguistiques")} />
            <div className="space-y-2">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between text-[10px] font-bold border-b border-cyan-50 pb-2 cv-text-inherit">
                  <span>{lang.name}</span>
                  <span className="text-cyan-600">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Informatique" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes compétences informatiques")} />
            <div className="flex flex-wrap gap-2">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-cyan-50 text-cyan-700 text-[10px] font-bold rounded shadow-sm">{s}</span>
              ))}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Qualités & Intérêts" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="px-3 py-1 bg-cyan-50 text-cyan-700 text-[10px] font-bold rounded-lg uppercase tracking-widest">{q}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.interests?.map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg italic">{item}</span>
                ))}
              </div>
            </div>
          </section>
        </div>
        <div className="cv-col-50 p-[var(--cv-padding)] space-y-10 flex flex-col cv-auto-spacing flex-grow cv-auto-fill">
          <section className="break-words">
            <SectionHeader title="Profil" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mon profil professionnel")} />
            <Editable text={data.profile} multiline className="text-sm leading-relaxed opacity-70 cv-text-inherit" onSave={(val) => handleUpdate({ profile: val })} />
          </section>
          <section className="break-words">
            <SectionHeader title="Expériences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles")} />
            <div className="space-y-8">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="p-6 rounded-2xl bg-cyan-50/50 border border-cyan-100">
                  <div className="flex justify-between items-center mb-2">
                    <Editable text={exp.position} className="font-black text-lg cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[10px] font-bold text-cyan-600">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-xs font-bold mb-4 block opacity-60 cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-xs opacity-70 leading-relaxed experience-description cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Formation" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore ma formation académique")} />
            <div className="space-y-6">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <div className="font-black text-sm mb-1">{edu.degree}</div>
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

// Template 18: Lime & Gray - Modern Split
export const Template18: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#65a30d';
  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#1e293b', width: '210mm', height: '297mm', overflow: 'hidden' }}>
      <header className="p-[var(--cv-padding)] text-center">
        {data.photo && <img src={data.photo} className="w-32 h-32 rounded-full object-cover mx-auto mb-8 border-4 border-lime-500 shadow-xl" alt="Profile" />}
        <h1 className={`text-5xl font-black uppercase tracking-tighter mb-2 ${headingFont}`} style={{ color }}>
          <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
          <span className="ml-3 opacity-20"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></span>
        </h1>
        <h2 className="text-lg font-bold opacity-40 uppercase tracking-widest">
          <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
        </h2>
      </header>
      
      <div className="cv-grid-50-50 flex-1">
        <div className="cv-col-50 p-[var(--cv-padding)] space-y-[var(--cv-section-spacing)] bg-slate-50/50 border-t-8 cv-auto-spacing" style={{ borderColor: color }}>
          <section className="break-words">
            <SectionHeader title="Contact" color={color} variant="pill" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
            <div className="space-y-4 text-[10px] font-bold opacity-60">
              <div className="flex items-center gap-3"><Mail size={14} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
              <div className="flex items-center gap-3"><Phone size={14} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
              <div className="flex items-center gap-3"><MapPin size={14} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Compétences" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes compétences")} />
            <div className="space-y-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color={color} />)}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Langues" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes compétences linguistiques")} />
            <div className="space-y-2">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between text-[10px] font-bold">
                  <span>{lang.name}</span>
                  <span className="text-lime-600">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Qualités & Intérêts" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="px-3 py-1 bg-lime-50 text-lime-700 text-[10px] font-bold rounded-full uppercase tracking-widest">{q}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.interests?.map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg italic">{item}</span>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="cv-col-50 p-[var(--cv-padding)] space-y-[var(--cv-section-spacing)] flex flex-col cv-auto-spacing border-t-8 flex-grow cv-auto-fill" style={{ borderColor: color }}>
          <section className="break-words">
            <SectionHeader title="Profil" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mon profil professionnel")} />
            <Editable text={data.profile} multiline className="text-sm leading-relaxed opacity-70 cv-text-inherit" onSave={(val) => handleUpdate({ profile: val })} />
          </section>
          <section className="break-words">
            <SectionHeader title="Expériences" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles")} />
            <div className="space-y-8">
              {data.experiences?.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <Editable text={exp.position} className="font-black text-lg cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[10px] font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-xs font-bold mb-4 block text-lime-600 cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-xs opacity-70 leading-relaxed experience-description cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Formation" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore ma formation académique")} />
            <div className="space-y-6">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <div className="font-black text-sm mb-1">{edu.degree}</div>
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

// Template 19: Indigo & Light Blue - Modern Split
export const Template19: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#4338ca';
  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''} flex flex-col`} style={{ backgroundColor: '#f5f7ff', color: '#1e293b' }}>
      <header className="p-[var(--cv-padding)] text-center shrink-0">
        {data.photo && <img src={data.photo} className="w-32 h-32 rounded-full object-cover mx-auto mb-8 shadow-2xl border-4 border-white" alt="Profile" />}
        <h1 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${headingFont}`} style={{ color }}>
          <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
          <span className="ml-3 opacity-20"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></span>
        </h1>
        <h2 className="text-sm font-bold opacity-40 uppercase tracking-[0.4em]">
          <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
        </h2>
      </header>
      <div className="cv-grid-50-50 flex-grow bg-white m-8 rounded-[40px] shadow-xl overflow-hidden">
        <div className="cv-col-50 p-[var(--cv-padding)] space-y-10 flex flex-col cv-auto-spacing flex-grow">
          <section className="break-words">
            <SectionHeader title="Contact" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
            <div className="space-y-4 text-[10px] font-bold opacity-60">
              <div className="flex items-center gap-3"><Mail size={14} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
              <div className="flex items-center gap-3"><Phone size={14} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
              <div className="flex items-center gap-3"><MapPin size={14} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Compétences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes compétences")} />
            <div className="space-y-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color={color} />)}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Langues" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes compétences linguistiques")} />
            <div className="space-y-2">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between text-[10px] font-bold border-b border-indigo-50 pb-2">
                  <span>{lang.name}</span>
                  <span className="text-indigo-600">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Informatique" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes compétences informatiques")} />
            <div className="flex flex-wrap gap-2">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-slate-100 text-[10px] font-bold rounded">{s}</span>
              ))}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Qualités & Intérêts" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg uppercase tracking-widest">{q}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.interests?.map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg italic">{item}</span>
                ))}
              </div>
            </div>
          </section>
        </div>
        <div className="cv-col-50 p-[var(--cv-padding)] space-y-10 flex flex-col cv-auto-spacing flex-grow cv-auto-fill">
          <section className="break-words">
            <SectionHeader title="Profil" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mon profil professionnel")} />
            <Editable text={data.profile} multiline className="text-sm leading-relaxed opacity-70 cv-text-inherit" onSave={(val) => handleUpdate({ profile: val })} />
          </section>
          <section className="break-words">
            <SectionHeader title="Expériences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles")} />
            <div className="space-y-8">
              {data.experiences?.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <Editable text={exp.position} className="font-black text-lg cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[10px] font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-xs font-bold mb-4 block text-indigo-600 cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-xs opacity-70 leading-relaxed experience-description cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Formation" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore ma formation académique")} />
            <div className="space-y-6">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <div className="font-black text-sm mb-1">{edu.degree}</div>
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

// Template 20: Crimson & Ivory - Modern Split
export const Template20: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#991b1b';
  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''} flex flex-col`} style={{ backgroundColor: '#fff', color: '#1e293b' }}>
      <header className="p-[var(--cv-padding)] text-center border-b-4 border-double border-slate-200 shrink-0">
        {data.photo && <img src={data.photo} className="w-32 h-32 rounded-full object-cover mx-auto mb-8 border-4 border-red-800 shadow-xl" alt="Profile" />}
        <h1 className={`text-5xl font-black uppercase tracking-tighter mb-2 ${headingFont}`} style={{ color }}>
          <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
          <span className="ml-3 opacity-20"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></span>
        </h1>
        <h2 className="text-lg font-bold opacity-40 uppercase tracking-widest">
          <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
        </h2>
      </header>
      <div className="cv-grid-50-50 flex-1">
        <div className="cv-col-50 p-[var(--cv-padding)] space-y-10 flex flex-col cv-auto-spacing flex-grow">
          <section className="break-words">
            <SectionHeader title="Contact" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
            <div className="space-y-4 text-[10px] font-bold opacity-60">
              <div className="flex items-center gap-3"><Mail size={14} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
              <div className="flex items-center gap-3"><Phone size={14} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
              <div className="flex items-center gap-3"><MapPin size={14} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Profil" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mon profil professionnel")} />
            <Editable text={data.profile} multiline className="text-sm leading-relaxed opacity-70 cv-text-inherit" onSave={(val) => handleUpdate({ profile: val })} />
          </section>
          <section className="break-words">
            <SectionHeader title="Compétences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes compétences")} />
            <div className="space-y-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color={color} />)}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Langues" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes compétences linguistiques")} />
            <div className="space-y-2">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between text-[10px] font-bold border-b border-red-50 pb-2">
                  <span>{lang.name}</span>
                  <span className="text-red-800">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Informatique" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes compétences informatiques")} />
            <div className="flex flex-wrap gap-2">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-slate-100 text-[10px] font-bold rounded">{s}</span>
              ))}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Qualités & Intérêts" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="px-3 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded-lg uppercase tracking-widest">{q}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.interests?.map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg italic">{item}</span>
                ))}
              </div>
            </div>
          </section>
        </div>
        <div className="cv-col-50 p-[var(--cv-padding)] space-y-10 flex flex-col cv-auto-spacing flex-grow cv-auto-fill">
          <section className="break-words">
            <SectionHeader title="Expériences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles")} />
            <div className="space-y-8">
              {data.experiences?.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <Editable text={exp.position} className="font-black text-lg cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[10px] font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-xs font-bold mb-4 block text-red-800 cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-xs opacity-70 leading-relaxed experience-description cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>
          <section className="break-words">
            <SectionHeader title="Formation" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore ma formation académique")} />
            <div className="space-y-6">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <div className="font-black text-sm mb-1">{edu.degree}</div>
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
