import React from 'react';
import { Mail, Phone, MapPin, User, Briefcase, BookOpen, Code, Languages, Heart } from 'lucide-react';
import { CVData } from '../types';
import { Editable, SkillBarSVG, SectionHeader, FillerContent } from '../components/CVElements';
import { DraggableSection } from '../components/DraggableSection';

interface TemplateProps {
  data: CVData;
  handleUpdate: (update: Partial<CVData>) => void;
  onAIModify?: (prompt: string) => void;
  headingFont: string;
  bodyFont: string;
  layoutSettings: {
    fontSize: number;
    spacing: number;
    sectionSpacing: number;
    isTwoColumn: boolean;
  };
}

// Template 31: Indigo & White - Cards
export const Template31: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#4338ca';
  const hiddenSections = data.hiddenSections || [];

  const toggleVisibility = (sectionId: string) => {
    const newHidden = hiddenSections.includes(sectionId)
      ? hiddenSections.filter(id => id !== sectionId)
      : [...hiddenSections, sectionId];
    handleUpdate({ hiddenSections: newHidden });
  };

  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#f1f5f9', color: '#1e293b', width: '210mm', height: '297mm', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <header className="bg-white p-[var(--cv-padding)] rounded-b-3xl shadow-xl flex items-center gap-12 border-b-8 shrink-0" style={{ borderColor: color }}>
        {data.photo && <img src={data.photo} className="w-24 h-24 rounded-full object-cover shadow-2xl border-4 border-slate-50" alt="Profile" />}
        <div className="flex-1">
          <h1 className={`text-3xl font-black uppercase tracking-tighter mb-1 ${headingFont}`} style={{ color }}>
            <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
            <span className="ml-3 opacity-20"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></span>
          </h1>
          <h2 className="text-sm font-bold opacity-40 uppercase tracking-widest">
            <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
        </div>
      </header>

      <div className="cv-grid-50-50 flex-1 p-8">
        {/* Left Column: Contact, Profile, Skills, Languages */}
        <div className="cv-col-50 space-y-6 cv-auto-spacing flex flex-col flex-grow">
          <section className="bg-white p-6 rounded-3xl shadow-lg break-words">
            <SectionHeader title="Contact" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise mes informations de contact")} />
            <div className="space-y-3 pt-4 text-[10px] font-bold opacity-60">
              <div className="flex items-center gap-3"><Mail size={14} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
              <div className="flex items-center gap-3"><Phone size={14} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
              <div className="flex items-center gap-3"><MapPin size={14} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-lg break-words">
            <SectionHeader title="Profil" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mon profil professionnel")} />
            <Editable text={data.profile} multiline className="text-xs leading-relaxed opacity-70 pt-4 cv-text-inherit" onSave={(val) => handleUpdate({ profile: val })} />
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-lg break-words">
            <SectionHeader title="Compétences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
            <div className="space-y-4 pt-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color={color} />)}
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-lg break-words">
            <SectionHeader title="Langues" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
            <div className="space-y-2 pt-4">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between text-[10px] font-bold cv-text-inherit">
                  <span>{lang.name}</span>
                  <span style={{ color }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Experiences, Education */}
        <div className="cv-col-50 space-y-6 cv-auto-spacing flex flex-col flex-grow cv-auto-fill">
          <section className="bg-white p-6 rounded-3xl shadow-lg break-words">
            <SectionHeader title="Expériences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles")} />
            <div className="space-y-6 pt-4">
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

          <section className="bg-white p-6 rounded-3xl shadow-lg break-words">
            <SectionHeader title="Formation" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore ma formation académique")} />
            <div className="space-y-4 pt-4">
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

// Template 32: Teal & Slate - Cards
export const Template32: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#0d9488';
  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#f8fafc', color: '#0f172a', width: '210mm', height: '297mm', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <header className="bg-white p-[var(--cv-padding)] rounded-b-[40px] shadow-xl flex flex-col md:flex-row gap-10 shrink-0 border-b-8" style={{ borderColor: color }}>
        <div className="md:w-1/4 bg-teal-900 rounded-3xl p-4 flex items-center justify-center shadow-2xl">
          {data.photo && <img src={data.photo} className="w-full aspect-square rounded-2xl object-cover grayscale brightness-110" alt="Profile" />}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h1 className={`text-5xl font-black uppercase tracking-tighter mb-2 ${headingFont}`} style={{ color }}>
            <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
            <div className="block opacity-10"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></div>
          </h1>
          <h2 className="text-xl font-bold opacity-40 uppercase tracking-widest mt-2">
            <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
          <div className="flex flex-wrap gap-6 mt-6 text-[11px] font-bold opacity-60">
            <div className="flex items-center gap-4"><Mail size={16} className="text-teal-600" /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
            <div className="flex items-center gap-4"><Phone size={16} className="text-teal-600" /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
            <div className="flex items-center gap-4"><MapPin size={16} className="text-teal-600" /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
          </div>
        </div>
      </header>

      <div className="cv-grid-50-50 flex-1 p-[var(--cv-padding)]">
        {/* Left Column: Profile, Skills, IT, Languages, Qualities */}
        <div className="cv-col-50 space-y-6 cv-auto-spacing flex flex-col flex-grow">
          <section className="bg-white p-6 rounded-3xl shadow-lg break-words">
            <SectionHeader title="Profil" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
            <Editable text={data.profile} multiline className="cv-text-inherit leading-relaxed opacity-70 pt-4 text-xs" onSave={(val) => handleUpdate({ profile: val })} />
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-lg break-words">
            <SectionHeader title="Compétences" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
            <div className="space-y-4 pt-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={80} color={color} />)}
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-lg break-words">
            <SectionHeader title="Informatique" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
            <div className="flex flex-wrap gap-2 pt-4">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-teal-50 text-teal-700 text-[10px] font-bold rounded shadow-sm">{s}</span>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-lg break-words">
            <SectionHeader title="Langues" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
            <div className="space-y-2 pt-4">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between text-[10px] font-bold border-b border-slate-50 pb-1">
                  <span>{lang.name}</span>
                  <span style={{ color }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-lg break-words">
            <SectionHeader title="Qualités & Intérêts" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
            <div className="space-y-4 pt-4">
              <div className="flex flex-wrap gap-2">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="px-2 py-1 bg-teal-50 text-teal-700 text-[10px] font-bold rounded shadow-sm">{q}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.interests?.map((item, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded italic shadow-sm">{item}</span>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Experiences, Education */}
        <div className="cv-col-50 space-y-6 cv-auto-spacing flex flex-col flex-grow cv-auto-fill">
          <section className="bg-white p-6 rounded-3xl shadow-lg break-words">
            <SectionHeader title="Expériences Professionnelles" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
            <div className="space-y-8 pt-6">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-teal-50 page-break-inside-avoid">
                  <div className="absolute left-[-2px] top-2 w-1 h-4 bg-teal-600 rounded-full" />
                  <div className="flex justify-between items-center mb-1">
                    <Editable text={exp.position} className="font-black text-sm cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[9px] font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="cv-text-inherit font-bold mb-2 block text-teal-700 text-[10px]" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="cv-text-inherit opacity-70 leading-relaxed text-[10px] experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-lg break-words">
            <SectionHeader title="Formation" color={color} variant="underlined" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
            <div className="space-y-4 pt-4">
              {data.education?.map((edu, i) => (
                <div key={i} className="page-break-inside-avoid">
                  <div className="font-black text-xs cv-text-inherit uppercase">{edu.degree}</div>
                  <div className="cv-text-inherit opacity-50 text-[10px]">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Template 33: Rose & Gray - Cards
export const Template33: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#e11d48';
  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fff', color: '#334155', width: '210mm', height: '297mm', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <header className="flex items-center justify-between p-[var(--cv-padding)] bg-rose-900 text-white rounded-b-[40px] shadow-2xl overflow-hidden relative shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-800 rounded-full -mr-32 -mt-32 opacity-50" />
        <div className="relative z-10">
          <h1 className={`text-5xl font-black uppercase tracking-tighter mb-2 ${headingFont}`}>
            <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
            <div className="block text-rose-400"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></div>
          </h1>
          <h2 className="text-lg font-bold opacity-40 uppercase tracking-widest mt-4">
            <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
          <div className="flex gap-6 mt-6 text-[10px] font-bold opacity-50">
            <div className="flex items-center gap-2"><Mail size={14} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
            <div className="flex items-center gap-2"><Phone size={14} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
            <div className="flex items-center gap-2"><MapPin size={14} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
          </div>
        </div>
        {data.photo && <img src={data.photo} className="w-40 h-40 rounded-full object-cover border-8 border-rose-800 shadow-2xl relative z-10" alt="Profile" />}
      </header>

      <div className="cv-grid-50-50 flex-1 p-[var(--cv-padding)]">
        {/* Left Column: Skills, IT, Languages, Qualities */}
        <div className="cv-col-50 space-y-6 cv-auto-spacing flex flex-col flex-grow">
          <section className="bg-slate-50 p-6 rounded-[40px] shadow-sm border border-slate-100">
            <SectionHeader title="Compétences" color={color} variant="pill" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
            <div className="space-y-4 pt-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={80} color={color} />)}
            </div>
          </section>

          <section className="bg-slate-50 p-6 rounded-[40px] shadow-sm border border-slate-100">
            <SectionHeader title="Informatique" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
            <div className="flex flex-wrap gap-2 pt-4">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-rose-50 text-rose-700 text-[10px] font-bold rounded">{s}</span>
              ))}
            </div>
          </section>

          <section className="bg-slate-50 p-6 rounded-[40px] shadow-sm border border-slate-100">
            <SectionHeader title="Langues" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
            <div className="space-y-2 pt-4">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between text-[10px] font-bold">
                  <span>{lang.name}</span>
                  <span style={{ color }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-50 p-6 rounded-[40px] shadow-sm border border-slate-100">
            <SectionHeader title="Qualités & Intérêts" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
            <div className="space-y-4 pt-4">
              <div className="flex flex-wrap gap-2">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="px-2 py-1 bg-rose-50 text-rose-700 text-[10px] font-bold rounded">{q}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.interests?.map((item, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold rounded italic">{item}</span>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Profile, Experiences, Education */}
        <div className="cv-col-50 space-y-6 cv-auto-spacing flex flex-col flex-grow cv-auto-fill">
          <section className="bg-slate-50 p-6 rounded-[40px] shadow-sm border border-slate-100">
            <SectionHeader title="Profil" color={color} variant="pill" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
            <Editable text={data.profile} multiline className="cv-text-inherit leading-relaxed opacity-70 pt-4 italic text-xs" onSave={(val) => handleUpdate({ profile: val })} />
          </section>

          <section className="bg-slate-50 p-6 rounded-[40px] shadow-sm border border-slate-100">
            <SectionHeader title="Expériences" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
            <div className="space-y-8 pt-6">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="page-break-inside-avoid">
                  <div className="flex justify-between items-center mb-1">
                    <Editable text={exp.position} className="font-black text-sm cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[9px] font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="cv-text-inherit font-bold mb-2 block text-rose-600 text-[10px]" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="cv-text-inherit opacity-70 leading-relaxed text-[10px] experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>

          <section className="bg-slate-50 p-6 rounded-[40px] shadow-sm border border-slate-100">
            <SectionHeader title="Formation" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
            <div className="space-y-4 pt-4">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <div className="font-black text-xs cv-text-inherit uppercase">{edu.degree}</div>
                  <div className="cv-text-inherit opacity-50 text-[10px]">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Template 34: Emerald & Ivory - Cards
export const Template34: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#065f46';
  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fffaf5', color: '#0f172a', width: '210mm', height: '297mm', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <header className="bg-emerald-900 p-[var(--cv-padding)] rounded-b-[60px] text-white flex items-center justify-between shadow-2xl shrink-0">
        <div>
          <h1 className={`text-6xl font-black tracking-tighter mb-2 ${headingFont}`}>
            <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
            <div className="block opacity-20"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></div>
          </h1>
          <h2 className="text-xl font-bold opacity-40 uppercase tracking-widest mt-6">
            <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
        </div>
        <div className="space-y-4 text-right text-xs font-bold opacity-60">
          <div className="flex items-center justify-end gap-3"><Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /> <Mail size={16} /></div>
          <div className="flex items-center justify-end gap-3"><Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /> <Phone size={16} /></div>
          <div className="flex items-center justify-end gap-3"><Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /> <MapPin size={16} /></div>
        </div>
      </header>

      <div className="cv-grid-50-50 flex-1 p-[var(--cv-padding)]">
        {/* Left Column: Profile, Skills, IT, Languages, Qualities */}
        <div className="cv-col-50 space-y-6 cv-auto-spacing flex flex-col flex-grow">
          <section className="bg-white p-8 rounded-[60px] shadow-xl break-words">
            <SectionHeader title="Profil" color={color} variant="standard" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
            <Editable text={data.profile} multiline className="cv-text-inherit leading-relaxed opacity-70 pt-6 text-xs" onSave={(val) => handleUpdate({ profile: val })} />
          </section>

          <section className="bg-white p-8 rounded-[60px] shadow-xl break-words">
            <SectionHeader title="Compétences" color={color} variant="standard" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
            <div className="space-y-6 pt-6">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color={color} />)}
            </div>
          </section>

          <section className="bg-white p-8 rounded-[60px] shadow-xl break-words">
            <SectionHeader title="Informatique" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
            <div className="flex flex-wrap gap-2 pt-6">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">{s}</span>
              ))}
            </div>
          </section>

          <section className="bg-white p-8 rounded-[60px] shadow-xl break-words">
            <SectionHeader title="Langues" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
            <div className="space-y-2 pt-6">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between text-[10px] font-bold">
                  <span>{lang.name}</span>
                  <span style={{ color }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-8 rounded-[60px] shadow-xl break-words">
            <SectionHeader title="Qualités & Intérêts" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
            <div className="space-y-4 pt-6">
              <div className="flex flex-wrap gap-2">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">{q}</span>
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

        {/* Right Column: Experiences, Education */}
        <div className="cv-col-50 space-y-6 cv-auto-spacing flex flex-col flex-grow cv-auto-fill">
          <section className="bg-white p-8 rounded-[60px] shadow-xl break-words">
            <SectionHeader title="Expériences" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
            <div className="space-y-10 pt-8">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-8 page-break-inside-avoid">
                  <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-emerald-100 border-2 border-emerald-600" />
                  <div className="flex justify-between items-center mb-1">
                    <Editable text={exp.position} className="font-black text-sm cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[9px] font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="cv-text-inherit font-bold mb-2 block text-emerald-700 text-[10px]" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="cv-text-inherit opacity-70 leading-relaxed text-[10px] experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>

          <section className="bg-white p-8 rounded-[60px] shadow-xl break-words">
            <SectionHeader title="Formation" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
            <div className="space-y-4 pt-6">
              {data.education?.map((edu, i) => (
                <div key={i} className="page-break-inside-avoid">
                  <div className="font-black text-xs cv-text-inherit uppercase">{edu.degree}</div>
                  <div className="cv-text-inherit opacity-50 text-[10px]">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Template 35: Amber & Charcoal - Cards
export const Template35: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#f59e0b';
  return (
    <div id="cv-canvas" className={`cv-flat ${bodyFont} ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#1e293b', color: '#fff', width: '210mm', height: '297mm', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <header className="bg-slate-800 p-[var(--cv-padding)] rounded-b-[40px] shadow-2xl flex items-center justify-between border-b-8 border-amber-500 shrink-0">
        <div>
          <h1 className={`text-5xl font-black uppercase tracking-tighter mb-2 ${headingFont}`}>
            <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
            <span className="ml-3 text-amber-500"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></span>
          </h1>
          <h2 className="text-lg font-bold opacity-40 uppercase tracking-widest mt-4">
            <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
          <div className="flex gap-6 mt-6 text-[10px] font-bold opacity-50">
            <div className="flex items-center gap-2"><Mail size={14} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
            <div className="flex items-center gap-2"><Phone size={14} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
            <div className="flex items-center gap-2"><MapPin size={14} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
          </div>
        </div>
        {data.photo && <img src={data.photo} className="w-32 h-32 rounded-3xl object-cover shadow-2xl border-4 border-slate-700" alt="Profile" />}
      </header>

      <div className="cv-grid-50-50 flex-1 p-[var(--cv-padding)]">
        {/* Left Column: Profile, Skills, IT, Languages, Qualities */}
        <div className="cv-col-50 space-y-6 cv-auto-spacing flex flex-col flex-grow">
          <section className="bg-slate-800 p-6 rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Profil" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
            <Editable text={data.profile} multiline className="cv-text-inherit leading-relaxed opacity-60 pt-4 font-light text-xs" onSave={(val) => handleUpdate({ profile: val })} />
          </section>

          <section className="bg-slate-800 p-6 rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Compétences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
            <div className="space-y-6 pt-4">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color={color} />)}
            </div>
          </section>

          <section className="bg-slate-800 p-6 rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Informatique" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
            <div className="flex flex-wrap gap-2 pt-4">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-slate-700 text-amber-500 text-[10px] font-bold rounded">{s}</span>
              ))}
            </div>
          </section>

          <section className="bg-slate-800 p-6 rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Langues" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
            <div className="space-y-2 pt-4">
              {data.languagesList?.map((lang, i) => (
                <div key={i} className="flex justify-between text-[10px] font-bold">
                  <span>{lang.name}</span>
                  <span style={{ color }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-800 p-6 rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Qualités & Intérêts" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
            <div className="space-y-4 pt-4">
              <div className="flex flex-wrap gap-2">
                {data.qualities?.map((q, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-700 text-amber-500 text-[10px] font-bold rounded">{q}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.interests?.map((item, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-900 text-slate-400 text-[10px] font-bold rounded italic">{item}</span>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Experiences, Education */}
        <div className="cv-col-50 space-y-6 cv-auto-spacing flex flex-col flex-grow cv-auto-fill">
          <section className="bg-slate-800 p-6 rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Expériences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
            <div className="space-y-8 pt-6">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-10 border-l border-white/10 page-break-inside-avoid">
                  <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                  <div className="flex justify-between items-center mb-1">
                    <Editable text={exp.position} className="font-black cv-text-inherit text-white text-sm" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[9px] font-bold text-amber-500/50">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="cv-text-inherit font-bold mb-2 block text-amber-500 text-[10px]" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="cv-text-inherit opacity-50 leading-relaxed text-[10px] experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>

          <section className="bg-slate-800 p-6 rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Formation" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
            <div className="space-y-4 pt-4">
              {data.education?.map((edu, i) => (
                <div key={i} className="page-break-inside-avoid">
                  <div className="font-black text-xs cv-text-inherit uppercase">{edu.degree}</div>
                  <div className="cv-text-inherit opacity-50 text-[10px]">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Template 36: Violet & Silver - Cards
export const Template36: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#6d28d9';
  return (
    <div id="cv-canvas" className={`cv-grid-layout ${bodyFont} p-[var(--cv-padding)] cv-container-auto ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#faf5ff', color: '#1e293b', height: '100%' }}>
      <header className="col-span-2 bg-white p-[var(--cv-padding)] rounded-[40px] shadow-2xl flex flex-col md:flex-row items-center gap-16 border-b-8 shrink-0" style={{ borderColor: color }}>
        {data.photo && <img src={data.photo} className="w-40 h-40 rounded-full object-cover shadow-2xl border-4 border-slate-50" alt="Profile" />}
        <div className="flex-1">
          <h1 className={`text-5xl font-black uppercase tracking-tighter mb-2 ${headingFont}`} style={{ color }}>
            <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
            <span className="ml-3 opacity-20"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></span>
          </h1>
          <h2 className="text-xl font-bold opacity-40 uppercase tracking-widest mt-4">
            <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
          <div className="flex flex-wrap gap-6 mt-6 text-[10px] font-bold opacity-50">
            <div className="flex items-center gap-2"><Mail size={14} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
            <div className="flex items-center gap-2"><Phone size={14} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
            <div className="flex items-center gap-2"><MapPin size={14} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
          </div>
        </div>
      </header>
      <div className="flex-1 flex flex-col md:flex-row cv-content-wrapper cv-fluid-layout" style={{ gap: (layoutSettings?.spacing || 1) * 3 + 'rem' }}>
        <div className="md:w-1/3 flex flex-col justify-between flex-grow" style={{ gap: (layoutSettings?.spacing || 1) * 3 + 'rem' }}>
          <section className="bg-white p-[var(--cv-padding)] rounded-[40px] shadow-xl">
            <SectionHeader title="Compétences" color={color} variant="pill" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
            <div className="space-y-6 pt-8">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color={color} />)}
            </div>
          </section>
          <section className="bg-white p-[var(--cv-padding)] rounded-[40px] shadow-xl">
            <SectionHeader title="Formation" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
            <div className="space-y-4 pt-8">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <div className="font-black cv-text-inherit">{edu.degree}</div>
                  <div className="cv-text-inherit opacity-50">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-white p-[var(--cv-padding)] rounded-[40px] shadow-xl">
            <SectionHeader title="Informatique" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
            <div className="flex flex-wrap gap-2 pt-8">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-violet-50 text-violet-700 text-[10px] font-bold rounded">{s}</span>
              ))}
            </div>
          </section>
        </div>
        <div className="flex-1 flex flex-col flex-grow cv-auto-fill" style={{ gap: (layoutSettings?.spacing || 1) * 3 + 'rem' }}>
          <section className="bg-white p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Profil" color={color} variant="pill" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
            <Editable text={data.profile} multiline className="cv-text-inherit leading-relaxed opacity-70 pt-8" onSave={(val) => handleUpdate({ profile: val })} />
          </section>
          <section className="bg-white p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Expériences" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
            <div className="space-y-12 pt-10">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-10 border-l-2 border-slate-50 page-break-inside-avoid">
                  <div className="absolute left-[-6px] top-2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <div className="flex justify-between items-center mb-2">
                    <Editable text={exp.position} className="font-black cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-xs font-bold opacity-30">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="cv-text-inherit font-bold mb-4 block text-violet-600" onSave={(val) => {
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
          <div className="grid grid-cols-1 gap-10">
            <section className="bg-white p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
              <SectionHeader title="Langues" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
              <div className="space-y-2 pt-8">
                {data.languagesList?.map((lang, i) => (
                  <div key={i} className="flex justify-between text-[10px] font-bold border-b border-slate-50 pb-1 cv-text-inherit">
                    <span>{lang.name}</span>
                    <span style={{ color }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="bg-white p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
              <SectionHeader title="Qualités & Intérêts" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
              <div className="space-y-4 pt-8">
                <div className="flex flex-wrap gap-2">
                  {data.qualities?.map((q, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-50 text-slate-700 text-[10px] font-bold rounded shadow-sm">{q}</span>
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
        </div>
      </div>
    </div>
  );
};

// Template 37: Cyan & Navy - Cards
export const Template37: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#0891b2';
  return (
    <div id="cv-render" className={`cv-grid-layout ${bodyFont} p-[var(--cv-padding)] cv-container-auto`} style={{ backgroundColor: '#0f172a', color: '#f8fafc', height: '100%' }}>
      <header className="col-span-2 bg-slate-900 p-[var(--cv-padding)] rounded-3xl shadow-2xl flex items-center justify-between border-b-4 border-cyan-500">
        <div>
          <h1 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${headingFont}`}>
            <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
            <span className="ml-3 text-cyan-400"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></span>
          </h1>
          <h2 className="text-sm font-bold opacity-40 uppercase tracking-widest mt-4">
            <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
          <div className="flex gap-6 mt-6 text-[10px] font-bold opacity-50">
            <div className="flex items-center gap-3"><Mail size={14} className="text-cyan-400" /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
            <div className="flex items-center gap-3"><Phone size={14} className="text-cyan-400" /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
            <div className="flex items-center gap-3"><MapPin size={14} className="text-cyan-400" /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
          </div>
        </div>
        {data.photo && <img src={data.photo} className="w-28 h-28 rounded-2xl object-cover shadow-2xl border-2 border-white/10" alt="Profile" />}
      </header>
      <div className="cv-grid-layout flex-grow">
        <div className="cv-sidebar-30 cv-auto-spacing flex flex-col flex-grow">
          <section className="bg-slate-900 p-[var(--cv-padding)] rounded-3xl shadow-xl">
            <SectionHeader title="Formation" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
            <div className="space-y-4 pt-6">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <div className="font-black cv-text-inherit text-white">{edu.degree}</div>
                  <div className="cv-text-inherit opacity-50">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-slate-900 p-[var(--cv-padding)] rounded-3xl shadow-xl">
            <SectionHeader title="Compétences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
            <div className="space-y-4 pt-6">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={80} color={color} />)}
            </div>
          </section>
          <section className="bg-slate-900 p-[var(--cv-padding)] rounded-3xl shadow-xl">
            <SectionHeader title="Informatique" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
            <div className="flex flex-wrap gap-2 pt-6">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-white/5 text-cyan-400 text-[10px] font-bold rounded border border-white/10">{s}</span>
              ))}
            </div>
          </section>
        </div>
        <div className="cv-main-70 cv-auto-spacing flex flex-col flex-grow cv-auto-fill">
          <section className="bg-slate-900 p-[var(--cv-padding)] rounded-3xl shadow-xl">
            <SectionHeader title="Profil" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
            <Editable text={data.profile} multiline className="cv-text-inherit leading-relaxed opacity-60 pt-6 font-light" onSave={(val) => handleUpdate({ profile: val })} />
          </section>
          <section className="bg-slate-900 p-[var(--cv-padding)] rounded-3xl shadow-xl">
            <SectionHeader title="Expériences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
            <div className="space-y-6 pt-8">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <Editable text={exp.position} className="font-black cv-text-inherit text-white" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-[9px] font-bold text-cyan-400/50">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="cv-text-inherit font-bold mb-4 block text-cyan-400" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="cv-text-inherit opacity-50 leading-relaxed experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>
          <div className="grid grid-cols-1 gap-8">
            <section className="bg-slate-900 p-[var(--cv-padding)] rounded-3xl shadow-xl">
              <SectionHeader title="Langues" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
              <div className="space-y-2 pt-6">
                {data.languagesList?.map((lang, i) => (
                  <div key={i} className="flex justify-between text-[10px] font-bold cv-text-inherit">
                    <span>{lang.name}</span>
                    <span style={{ color: '#22d3ee' }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="bg-slate-900 p-[var(--cv-padding)] rounded-3xl shadow-xl">
              <SectionHeader title="Qualités & Intérêts" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
              <div className="space-y-4 pt-6">
                <div className="flex flex-wrap gap-2">
                  {data.qualities?.map((q, i) => (
                    <span key={i} className="px-2 py-1 bg-white/5 text-cyan-400 text-[10px] font-bold rounded border border-white/10">{q}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.interests?.map((item, i) => (
                    <span key={i} className="px-2 py-1 bg-white/5 text-slate-400 text-[10px] font-bold rounded border border-white/10 italic">{item}</span>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// Template 38: Lime & Black - Cards
export const Template38: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#84cc16';
  return (
    <div id="cv-canvas" className={`cv-grid-layout ${bodyFont} p-[var(--cv-padding)] cv-container-auto ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#000', color: '#fff', height: '100%' }}>
      <header className="col-span-2 bg-zinc-900 p-[var(--cv-padding)] rounded-[40px] flex flex-col md:flex-row items-center justify-between border-l-8 border-lime-500 shadow-2xl shrink-0">
        <div className="flex-1">
          <h1 className={`text-6xl font-black uppercase tracking-tighter mb-2 ${headingFont}`}>
            <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
            <div className="block text-lime-500"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></div>
          </h1>
          <h2 className="text-xl font-bold opacity-40 uppercase tracking-widest mt-6">
            <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
          <div className="flex flex-wrap gap-6 mt-6 text-[10px] font-bold opacity-50">
            <div className="flex items-center gap-2"><Mail size={14} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
            <div className="flex items-center gap-2"><Phone size={14} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
            <div className="flex items-center gap-2"><MapPin size={14} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
          </div>
        </div>
        {data.photo && <img src={data.photo} className="w-36 h-36 rounded-full object-cover shadow-2xl border-4 border-zinc-800 mt-6 md:mt-0" alt="Profile" />}
      </header>
      <div className="cv-grid-50-50 flex-grow">
        <div className="cv-col-50 cv-auto-spacing flex flex-col flex-grow">
          <section className="bg-zinc-900 p-[var(--cv-padding)] rounded-[40px] shadow-xl">
            <SectionHeader title="Compétences" color={color} variant="standard" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
            <div className="space-y-6 pt-8">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={90} color={color} />)}
            </div>
          </section>
          <section className="bg-zinc-900 p-[var(--cv-padding)] rounded-[40px] shadow-xl">
            <SectionHeader title="Formation" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
            <div className="space-y-4 pt-8">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <div className="font-black text-sm text-white cv-text-inherit">{edu.degree}</div>
                  <div className="text-xs opacity-50 cv-text-inherit">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-zinc-900 p-[var(--cv-padding)] rounded-[40px] shadow-xl">
            <SectionHeader title="Informatique" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
            <div className="flex flex-wrap gap-2 pt-8">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-zinc-800 text-lime-500 text-[10px] font-bold rounded border border-white/5">{s}</span>
              ))}
            </div>
          </section>
        </div>
        <div className="cv-col-50 cv-auto-spacing flex flex-col flex-grow cv-auto-fill">
          <section className="bg-zinc-900 p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Profil" color={color} variant="standard" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
            <Editable text={data.profile} multiline className="text-sm leading-relaxed opacity-50 pt-8 font-light cv-text-inherit" onSave={(val) => handleUpdate({ profile: val })} />
          </section>
          <section className="bg-zinc-900 p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Expériences" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
            <div className="space-y-12 pt-10">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-12 border-l border-white/10 page-break-inside-avoid">
                  <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-lime-500 shadow-[0_0_20px_rgba(132,204,22,0.6)]" />
                  <div className="flex justify-between items-center mb-4">
                    <Editable text={exp.position} className="font-black text-2xl text-white cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-xs font-bold text-lime-500/50 uppercase tracking-widest cv-text-inherit">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-sm font-bold mb-6 block text-lime-500 cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-sm opacity-50 leading-relaxed font-light cv-text-inherit experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>
          <div className="grid grid-cols-1 gap-10">
            <section className="bg-zinc-900 p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
              <SectionHeader title="Langues" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
              <div className="space-y-2 pt-8">
                {data.languagesList?.map((lang, i) => (
                  <div key={i} className="flex justify-between text-[10px] font-bold border-b border-white/5 pb-1 cv-text-inherit">
                    <span>{lang.name}</span>
                    <span style={{ color }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="bg-zinc-900 p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
              <SectionHeader title="Qualités & Intérêts" color={color} variant="standard" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
              <div className="space-y-4 pt-8">
                <div className="flex flex-wrap gap-2">
                  {data.qualities?.map((q, i) => (
                    <span key={i} className="px-2 py-1 bg-zinc-800 text-lime-500 text-[10px] font-bold rounded border border-white/5 shadow-sm">{q}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.interests?.map((item, i) => (
                    <span key={i} className="px-2 py-1 bg-zinc-800 text-slate-400 text-[10px] font-bold rounded border border-white/5 italic shadow-sm">{item}</span>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// Template 39: Bordeaux & Cream - Cards
export const Template39: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#7f1d1d';
  return (
    <div id="cv-canvas" className={`cv-grid-layout ${bodyFont} p-[var(--cv-padding)] cv-container-auto ${data.isShortVersion ? 'cv-compact' : ''}`} style={{ backgroundColor: '#fffaf5', color: '#1e293b', height: '100%' }}>
      <header className="col-span-2 bg-white p-[var(--cv-padding)] rounded-[40px] shadow-2xl flex flex-col md:flex-row items-center gap-16 border-t-8 shrink-0" style={{ borderColor: color }}>
        {data.photo && <img src={data.photo} className="w-40 h-40 rounded-3xl object-cover shadow-2xl border-4 border-slate-50" alt="Profile" />}
        <div className="flex-1">
          <h1 className={`text-5xl font-black uppercase tracking-tighter mb-2 ${headingFont}`} style={{ color }}>
            <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
            <div className="block opacity-20"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></div>
          </h1>
          <h2 className="text-xl font-bold opacity-40 uppercase tracking-widest mt-4">
            <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
          <div className="flex flex-wrap gap-6 mt-6 text-[11px] font-bold opacity-60">
            <div className="flex items-center gap-4"><Mail size={16} style={{ color }} /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
            <div className="flex items-center gap-4"><Phone size={16} style={{ color }} /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
            <div className="flex items-center gap-4"><MapPin size={16} style={{ color }} /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
          </div>
        </div>
      </header>
      <div className="cv-grid-50-50 flex-grow">
        <div className="cv-col-50 cv-auto-spacing flex flex-col flex-grow">
          <section className="bg-white p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Formation" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
            <div className="space-y-4 pt-8">
              {data.education?.map((edu, i) => (
                <div key={i} className="page-break-inside-avoid">
                  <div className="font-black text-sm cv-text-inherit">{edu.degree}</div>
                  <div className="text-xs opacity-50 cv-text-inherit">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-white p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Compétences" color={color} variant="pill" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
            <div className="space-y-6 pt-8">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={85} color={color} />)}
            </div>
          </section>
          <section className="bg-white p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Informatique" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
            <div className="flex flex-wrap gap-2 pt-8">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-red-50 text-red-900 text-[10px] font-bold rounded shadow-sm">{s}</span>
              ))}
            </div>
          </section>
        </div>
        <div className="cv-col-50 cv-auto-spacing flex flex-col flex-grow cv-auto-fill">
          <section className="bg-white p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Profil" color={color} variant="pill" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
            <Editable text={data.profile} multiline className="text-sm leading-relaxed opacity-70 pt-8 cv-text-inherit" onSave={(val) => handleUpdate({ profile: val })} />
          </section>
          <section className="bg-white p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Parcours" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
            <div className="space-y-12 pt-10">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-12 border-l-2 border-slate-100 page-break-inside-avoid">
                  <div className="absolute left-[-2px] top-2 w-1 h-6 rounded-full" style={{ backgroundColor: color }} />
                  <div className="flex justify-between items-center mb-4">
                    <Editable text={exp.position} className="font-black text-xl cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-xs font-bold opacity-30 cv-text-inherit">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-sm font-bold mb-6 block cv-text-inherit" style={{ color }} onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-sm opacity-70 leading-relaxed cv-text-inherit experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>
          <div className="grid grid-cols-1 gap-10">
            <section className="bg-white p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
              <SectionHeader title="Langues" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
              <div className="space-y-2 pt-8">
                {data.languagesList?.map((lang, i) => (
                  <div key={i} className="flex justify-between text-[10px] font-bold border-b border-slate-50 pb-1 cv-text-inherit">
                    <span>{lang.name}</span>
                    <span style={{ color }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="bg-white p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
              <SectionHeader title="Qualités & Intérêts" color={color} variant="pill" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
              <div className="space-y-4 pt-8">
                <div className="flex flex-wrap gap-2">
                  {data.qualities?.map((q, i) => (
                    <span key={i} className="px-2 py-1 bg-red-50 text-red-900 text-[10px] font-bold rounded shadow-sm">{q}</span>
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
        </div>
      </div>
    </div>
  );
};

// Template 40: Midnight & Gold - Cards
export const Template40: React.FC<TemplateProps> = ({ data, handleUpdate, onAIModify, headingFont, bodyFont, layoutSettings }) => {
  const color = '#fbbf24';
  return (
    <div id="cv-render" className={`cv-grid-layout ${bodyFont} p-[var(--cv-padding)] cv-container-auto`} style={{ backgroundColor: '#0f172a', color: '#f8fafc', height: '100%' }}>
      <header className="col-span-2 bg-slate-900 p-[var(--cv-padding)] rounded-[40px] shadow-2xl flex flex-col md:flex-row items-center justify-between border-b-8 border-amber-400 shrink-0">
        <div className="flex-1">
          <h1 className={`text-5xl font-black uppercase tracking-tighter mb-2 ${headingFont}`}>
            <Editable text={data.firstName} className="cv-text-inherit" onSave={(val) => handleUpdate({ firstName: val })} />
            <span className="ml-3 text-amber-400"><Editable text={data.lastName} className="cv-text-inherit" onSave={(val) => handleUpdate({ lastName: val })} /></span>
          </h1>
          <h2 className="text-xl font-bold opacity-40 uppercase tracking-widest mt-6">
            <Editable text={data.jobTitle || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ jobTitle: val })} />
          </h2>
          <div className="flex flex-wrap gap-6 mt-6 text-[11px] font-bold opacity-60">
            <div className="flex items-center gap-4"><Mail size={16} className="text-amber-400" /> <Editable text={data.email} className="cv-text-inherit" onSave={(val) => handleUpdate({ email: val })} /></div>
            <div className="flex items-center gap-4"><Phone size={16} className="text-amber-400" /> <Editable text={data.phone} className="cv-text-inherit" onSave={(val) => handleUpdate({ phone: val })} /></div>
            <div className="flex items-center gap-4"><MapPin size={16} className="text-amber-400" /> <Editable text={data.address || ''} className="cv-text-inherit" onSave={(val) => handleUpdate({ address: val })} /></div>
          </div>
        </div>
        {data.photo && <img src={data.photo} className="w-32 h-32 rounded-full object-cover shadow-2xl border-4 border-slate-800 mt-6 md:mt-0" alt="Profile" />}
      </header>
      <div className="cv-grid-layout flex-grow">
        <div className="cv-sidebar-30 cv-auto-spacing flex flex-col flex-grow">
          <section className="bg-slate-900 p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Formation" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de ma formation")} />
            <div className="space-y-4 pt-8">
              {data.education?.map((edu, i) => (
                <div key={i} className="page-break-inside-avoid">
                  <div className="font-black text-sm text-white cv-text-inherit">{edu.degree}</div>
                  <div className="text-xs opacity-50 cv-text-inherit">{edu.school} | {edu.year}</div>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-slate-900 p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Compétences" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Optimise ma liste de compétences")} />
            <div className="space-y-6 pt-8">
              {data.skills?.map((s, i) => <SkillBarSVG key={i} name={s} level={90} color={color} />)}
            </div>
          </section>
          <section className="bg-slate-900 p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Informatique" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore ma section informatique")} />
            <div className="flex flex-wrap gap-2 pt-8">
              {data.itSkills?.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-white/5 text-amber-400 text-[10px] font-bold rounded border border-white/10 shadow-sm">{s}</span>
              ))}
            </div>
          </section>
        </div>
        <div className="cv-main-70 cv-auto-spacing flex flex-col flex-grow cv-auto-fill">
          <section className="bg-slate-900 p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Profil" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Rédige un profil professionnel plus percutant")} />
            <Editable text={data.profile} multiline className="text-sm leading-relaxed opacity-60 pt-8 font-light cv-text-inherit" onSave={(val) => handleUpdate({ profile: val })} />
          </section>
          <section className="bg-slate-900 p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
            <SectionHeader title="Parcours" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes expériences professionnelles avec des résultats concrets")} />
            <div className="space-y-6 pt-10">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="p-[var(--cv-padding)] rounded-3xl bg-white/5 border border-white/10 page-break-inside-avoid">
                  <div className="flex justify-between items-center mb-4">
                    <Editable text={exp.position} className="font-black text-2xl text-white cv-text-inherit" onSave={(val) => {
                      const newList = [...data.experiences]; newList[i] = { ...newList[i], position: val }; handleUpdate({ experiences: newList });
                    }} />
                    <span className="text-xs font-bold text-amber-400/50 cv-text-inherit">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-sm font-bold mb-6 block text-amber-400 cv-text-inherit" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], company: val }; handleUpdate({ experiences: newList });
                  }} />
                  <Editable text={exp.description} multiline className="text-sm opacity-50 leading-relaxed font-light cv-text-inherit experience-description" onSave={(val) => {
                    const newList = [...data.experiences]; newList[i] = { ...newList[i], description: val }; handleUpdate({ experiences: newList });
                  }} />
                </div>
              ))}
              {data.experiences.length < 2 && <FillerContent color={color} />}
            </div>
          </section>
          <div className="grid grid-cols-1 gap-10">
            <section className="bg-slate-900 p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
              <SectionHeader title="Langues" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore la présentation de mes langues")} />
              <div className="space-y-2 pt-8">
                {data.languagesList?.map((lang, i) => (
                  <div key={i} className="flex justify-between text-[10px] font-bold border-b border-white/5 pb-1 cv-text-inherit">
                    <span>{lang.name}</span>
                    <span style={{ color }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="bg-slate-900 p-[var(--cv-padding)] rounded-[40px] shadow-xl break-words">
              <SectionHeader title="Qualités & Intérêts" color={color} variant="boxed" onAIEdit={() => onAIModify?.("Améliore mes qualités et centres d'intérêt")} />
              <div className="space-y-4 pt-8">
                <div className="flex flex-wrap gap-2">
                  {data.qualities?.map((q, i) => (
                    <span key={i} className="px-2 py-1 bg-white/5 text-amber-400 text-[10px] font-bold rounded border border-white/10 shadow-sm">{q}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.interests?.map((item, i) => (
                    <span key={i} className="px-2 py-1 bg-white/5 text-slate-400 text-[10px] font-bold rounded border border-white/10 italic shadow-sm">{item}</span>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
