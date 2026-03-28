import React from 'react';
import { CVData } from '../types';
import { motion } from 'motion/react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DraggableSection } from './DraggableSection';

import { Phone, Mail, MapPin, Globe, Star, AlertCircle, CheckCircle2, FileText, Sparkles, Cpu } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  onUpdate: (d: Partial<CVData>) => void;
  onRemoveSection?: (id: string) => void;
}

const getDefaultLayout = (template: string) => {
  switch (template) {
    case 'modern':
    case 'blue':
    case 'dark-minimal':
    case 'minimalist':
    case 'tech':
    case 'compact':
    case 'timeline':
    case 'modern-sidebar':
    case 'clean-accent':
    case 'tech-grid':
      return { left: ['contact', 'skills', 'languages'], right: ['profile', 'experiences', 'education'] };
    case 'classic':
    case 'orange':
    case 'dark':
    case 'professional':
    case 'academic':
    case 'elegant':
    case 'soft-minimal':
    case 'elegant-serif':
      return { left: ['contact', 'skills', 'qualities', 'languages', 'interests'], right: ['profile', 'experiences', 'education'] };
    case 'creative':
    case 'pink':
    case 'creative-gradient':
    case 'design':
    case 'bold':
    case 'creative-vibrant':
    case 'dark-premium':
    case 'minimalist-typo':
      return { left: ['contact', 'skills', 'itSkills', 'qualities', 'flaws', 'interests', 'languages'], right: ['experiences', 'education'] };
    case 'sidebar-right':
      return { left: ['profile', 'experiences', 'education'], right: ['contact', 'skills', 'languages'] };
    default:
      return { left: ['contact', 'skills'], right: ['profile', 'experiences', 'education'] };
  }
};

const Editable = ({ text, onSave, className, multiline = false, style }: { text: string, onSave: (val: string) => void, className?: string, multiline?: boolean, style?: React.CSSProperties }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState(text);

  React.useEffect(() => {
    setValue(text);
  }, [text]);

  if (isEditing) {
    return multiline ? (
      <textarea 
        autoFocus
        className={`w-full p-1 border-2 border-primary rounded outline-none bg-white text-slate-900 ${className}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => { setIsEditing(false); onSave(value); }}
        rows={4}
        style={style}
      />
    ) : (
      <input 
        autoFocus
        className={`w-full p-1 border-2 border-primary rounded outline-none bg-white text-slate-900 ${className}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => { setIsEditing(false); onSave(value); }}
        style={style}
      />
    );
  }

  return (
    <span 
      onClick={() => setIsEditing(true)} 
      className={`cursor-text hover:bg-slate-100/50 transition-colors rounded px-1 -mx-1 ${className}`}
      style={style}
    >
      {text || <span className="text-slate-300 italic">Cliquez pour éditer</span>}
    </span>
  );
};

export const EpureTemplate = ({ data, onUpdate }: TemplateProps) => {
  return (
    <div className={`cv-container cv-content-auto p-16 bg-white shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-sans text-slate-800 ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Inter' }}>
      <header className="mb-12 border-b border-slate-100 pb-8">
        <h1 className="text-4xl font-light tracking-tight text-slate-900 mb-2">
          <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} className="inline-block mr-2" />
          <Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} className="inline-block font-bold" />
        </h1>
        <p className="text-lg text-slate-500 font-medium tracking-wide">
          <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1"><Mail size={12} /> <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} /></div>
          <div className="flex items-center gap-1"><Phone size={12} /> <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} /></div>
          {data.address && <div className="flex items-center gap-1"><MapPin size={12} /> <Editable text={data.address} onSave={(val) => onUpdate({ address: val })} /></div>}
        </div>
      </header>

      <div className="space-y-10">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4 border-l-4 border-primary pl-3" style={{ borderColor: data.primaryColor || '#0f172a' }}>Profil</h2>
          <Editable text={data.profile} className="text-sm leading-relaxed text-slate-600" onSave={(val) => onUpdate({ profile: val })} multiline />
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6 border-l-4 border-primary pl-3" style={{ borderColor: data.primaryColor || '#0f172a' }}>Expériences</h2>
          <div className="space-y-8">
            {data.experiences?.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <Editable text={exp.position} className="font-bold text-slate-900" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].position = val;
                    onUpdate({ experiences: newExp });
                  }} />
                  <span className="text-xs text-slate-400">{exp.startDate} — {exp.endDate}</span>
                </div>
                <Editable text={exp.company} className="text-xs font-medium text-primary mb-2 block" style={{ color: data.primaryColor || '#0f172a' }} onSave={(val) => {
                  const newExp = [...data.experiences];
                  newExp[i].company = val;
                  onUpdate({ experiences: newExp });
                }} />
                <Editable text={exp.description} className="text-sm text-slate-600 leading-relaxed" onSave={(val) => {
                  const newExp = [...data.experiences];
                  newExp[i].description = val;
                  onUpdate({ experiences: newExp });
                }} multiline />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4 border-l-4 border-primary pl-3" style={{ borderColor: data.primaryColor || '#0f172a' }}>Formation</h2>
          <div className="space-y-4">
            {data.education?.map((edu, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <Editable text={edu.degree} className="font-bold text-sm" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].degree = val;
                    onUpdate({ education: newEdu });
                  }} />
                  <Editable text={edu.school} className="text-xs text-slate-500" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].school = val;
                    onUpdate({ education: newEdu });
                  }} />
                </div>
                <span className="text-xs text-slate-400">{edu.year}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export const ProBleuTemplate = ({ data, onUpdate }: TemplateProps) => {
  const primary = data.primaryColor || '#2563eb';
  return (
    <div className={`cv-container cv-content-auto flex min-h-[297mm] w-[210mm] font-sans text-slate-800 bg-white shadow-2xl mx-auto overflow-hidden ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Inter' }}>
      <div className="w-1/3 text-white p-10" style={{ backgroundColor: primary }}>
        <div className="mb-10 text-center">
          {data.photo && (
            <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white/20 mx-auto shadow-lg">
              <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-2xl font-bold mb-1">
            <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} />
            <Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} />
          </h1>
          <p className="text-blue-100 text-xs font-medium uppercase tracking-widest">
            <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-white/20 pb-2">Contact</h3>
            <div className="space-y-3 text-xs opacity-90">
              <div className="flex items-center gap-2"><Mail size={12} /> <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} /></div>
              <div className="flex items-center gap-2"><Phone size={12} /> <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} /></div>
              {data.address && <div className="flex items-center gap-2"><MapPin size={12} /> <Editable text={data.address} onSave={(val) => onUpdate({ address: val })} /></div>}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-white/20 pb-2">Compétences</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((s, i) => (
                <Editable key={i} text={s} className="bg-white/10 px-2 py-1 rounded text-[10px]" onSave={(val) => {
                  const newSkills = [...data.skills];
                  newSkills[i] = val;
                  onUpdate({ skills: newSkills });
                }} />
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="flex-1 p-12 bg-slate-50/30">
        <section className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: primary }}>
            <Sparkles size={16} /> Profil
          </h2>
          <Editable text={data.profile} className="text-sm leading-relaxed text-slate-600 bg-white p-4 rounded-xl shadow-sm border border-slate-100" onSave={(val) => onUpdate({ profile: val })} multiline />
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: primary }}>
            <FileText size={16} /> Expériences
          </h2>
          <div className="space-y-6">
            {data.experiences?.map((exp, i) => (
              <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 relative">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Editable text={exp.position} className="font-bold text-slate-900" onSave={(val) => {
                      const newExp = [...data.experiences];
                      newExp[i].position = val;
                      onUpdate({ experiences: newExp });
                    }} />
                    <Editable text={exp.company} className="text-xs font-bold opacity-60" onSave={(val) => {
                      const newExp = [...data.experiences];
                      newExp[i].company = val;
                      onUpdate({ experiences: newExp });
                    }} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: `${primary}10`, color: primary }}>
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <Editable text={exp.description} className="text-xs text-slate-500 leading-relaxed" onSave={(val) => {
                  const newExp = [...data.experiences];
                  newExp[i].description = val;
                  onUpdate({ experiences: newExp });
                }} multiline />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export const ATSTemplate = ({ data, onUpdate }: TemplateProps) => {
  return (
    <div className={`cv-container cv-content-auto p-12 bg-white shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-serif text-black ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: 'Times New Roman, serif' }}>
      <header className="text-center mb-8 border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold uppercase mb-1">
          <Editable text={`${data.firstName} ${data.lastName}`} onSave={(val) => {
            const [first, ...rest] = val.split(' ');
            onUpdate({ firstName: first, lastName: rest.join(' ') });
          }} />
        </h1>
        <div className="text-sm space-x-2">
          <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} className="inline" />
          <span>|</span>
          <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} className="inline" />
          {data.address && (
            <>
              <span>|</span>
              <Editable text={data.address} onSave={(val) => onUpdate({ address: val })} className="inline" />
            </>
          )}
        </div>
      </header>

      <div className="space-y-6">
        <section>
          <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Summary</h2>
          <Editable text={data.profile} className="text-sm leading-tight" onSave={(val) => onUpdate({ profile: val })} multiline />
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase border-b border-black mb-3">Experience</h2>
          <div className="space-y-4">
            {data.experiences?.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-sm">
                  <Editable text={exp.position} onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].position = val;
                    onUpdate({ experiences: newExp });
                  }} />
                  <span>{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="flex justify-between italic text-sm mb-1">
                  <Editable text={exp.company} onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].company = val;
                    onUpdate({ experiences: newExp });
                  }} />
                </div>
                <Editable text={exp.description} className="text-sm whitespace-pre-line" onSave={(val) => {
                  const newExp = [...data.experiences];
                  newExp[i].description = val;
                  onUpdate({ experiences: newExp });
                }} multiline />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Education</h2>
          {data.education?.map((edu, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div>
                <span className="font-bold"><Editable text={edu.degree} onSave={(val) => {
                  const newEdu = [...data.education];
                  newEdu[i].degree = val;
                  onUpdate({ education: newEdu });
                }} /></span>, 
                <Editable text={edu.school} onSave={(val) => {
                  const newEdu = [...data.education];
                  newEdu[i].school = val;
                  onUpdate({ education: newEdu });
                }} />
              </div>
              <span className="font-bold">{edu.year}</span>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Skills</h2>
          <p className="text-sm">{data.skills?.join(', ')}</p>
        </section>
      </div>
    </div>
  );
};

export const CreatifTemplate = ({ data, onUpdate }: TemplateProps) => {
  const primary = data.primaryColor || '#ec4899';
  return (
    <div className={`cv-container cv-content-auto p-0 bg-white shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-sans text-slate-800 overflow-hidden ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Montserrat' }}>
      <div className="flex h-full min-h-[297mm]">
        <div className="w-16 flex flex-col items-center py-10 gap-8" style={{ backgroundColor: primary }}>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white"><Mail size={18} /></div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white"><Phone size={18} /></div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white"><MapPin size={18} /></div>
        </div>
        
        <div className="flex-1">
          <header className="p-12 bg-slate-50 flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">
                <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} />
                <br />
                <span style={{ color: primary }}><Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} /></span>
              </h1>
              <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">
                <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
              </p>
            </div>
            {data.photo && (
              <div className="w-40 h-40 rounded-3xl overflow-hidden rotate-3 shadow-2xl border-8 border-white">
                <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
          </header>

          <div className="p-12 grid grid-cols-2 gap-12">
            <section className="col-span-2">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                <span className="w-8 h-1" style={{ backgroundColor: primary }}></span> Profil
              </h2>
              <Editable text={data.profile} className="text-sm leading-relaxed text-slate-600" onSave={(val) => onUpdate({ profile: val })} multiline />
            </section>

            <section className="col-span-2">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <span className="w-8 h-1" style={{ backgroundColor: primary }}></span> Expériences
              </h2>
              <div className="grid grid-cols-2 gap-8">
                {data.experiences?.map((exp, i) => (
                  <div key={i} className="group">
                    <div className="mb-2">
                      <span className="text-[10px] font-black px-2 py-1 rounded text-white mb-2 inline-block" style={{ backgroundColor: primary }}>{exp.startDate} - {exp.endDate}</span>
                      <Editable text={exp.position} className="text-lg font-black leading-tight" onSave={(val) => {
                        const newExp = [...data.experiences];
                        newExp[i].position = val;
                        onUpdate({ experiences: newExp });
                      }} />
                      <Editable text={exp.company} className="text-xs font-bold text-slate-400" onSave={(val) => {
                        const newExp = [...data.experiences];
                        newExp[i].company = val;
                        onUpdate({ experiences: newExp });
                      }} />
                    </div>
                    <Editable text={exp.description} className="text-xs text-slate-500 leading-relaxed" onSave={(val) => {
                      const newExp = [...data.experiences];
                      newExp[i].description = val;
                      onUpdate({ experiences: newExp });
                    }} multiline />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExecutifTemplate = ({ data, onUpdate }: TemplateProps) => {
  const primary = data.primaryColor || '#1e293b';
  return (
    <div className={`cv-container cv-content-auto p-16 bg-white shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-serif text-slate-900 ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Playfair Display, serif' }}>
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-4" style={{ color: primary }}>
          <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} className="inline mr-3" />
          <Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} className="inline" />
        </h1>
        <div className="w-24 h-1 bg-slate-200 mx-auto mb-6"></div>
        <p className="text-xl uppercase tracking-[0.4em] text-slate-500 font-light mb-8">
          <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
        </p>
        <div className="flex justify-center gap-8 text-xs font-medium text-slate-400 border-y border-slate-100 py-4">
          <div className="flex items-center gap-2"><Mail size={14} /> <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} /></div>
          <div className="flex items-center gap-2"><Phone size={14} /> <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} /></div>
          {data.address && <div className="flex items-center gap-2"><MapPin size={14} /> <Editable text={data.address} onSave={(val) => onUpdate({ address: val })} /></div>}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-16">
        <div className="col-span-8 space-y-12">
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b pb-2" style={{ color: primary, borderColor: `${primary}20` }}>Executive Summary</h2>
            <Editable text={data.profile} className="text-sm leading-relaxed text-slate-700 first-letter:text-4xl first-letter:font-bold first-letter:mr-2 first-letter:float-left" onSave={(val) => onUpdate({ profile: val })} multiline />
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest mb-8 border-b pb-2" style={{ color: primary, borderColor: `${primary}20` }}>Professional Experience</h2>
            <div className="space-y-10">
              {data.experiences?.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-2">
                    <Editable text={exp.position} className="text-lg font-bold" onSave={(val) => {
                      const newExp = [...data.experiences];
                      newExp[i].position = val;
                      onUpdate({ experiences: newExp });
                    }} />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-sm font-bold italic text-slate-500 mb-4 block" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].company = val;
                    onUpdate({ experiences: newExp });
                  }} />
                  <Editable text={exp.description} className="text-sm text-slate-600 leading-relaxed list-disc pl-5" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].description = val;
                    onUpdate({ experiences: newExp });
                  }} multiline />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-4 space-y-12">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b pb-2" style={{ color: primary, borderColor: `${primary}20` }}>Expertise</h2>
            <div className="space-y-3">
              {data.skills?.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: primary }}></div>
                  <Editable text={s} className="text-xs font-bold uppercase tracking-wider" onSave={(val) => {
                    const newSkills = [...data.skills];
                    newSkills[i] = val;
                    onUpdate({ skills: newSkills });
                  }} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b pb-2" style={{ color: primary, borderColor: `${primary}20` }}>Education</h2>
            <div className="space-y-6">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <Editable text={edu.degree} className="text-xs font-bold mb-1 block" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].degree = val;
                    onUpdate({ education: newEdu });
                  }} />
                  <Editable text={edu.school} className="text-[10px] text-slate-500 uppercase tracking-wider block" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].school = val;
                    onUpdate({ education: newEdu });
                  }} />
                  <span className="text-[10px] font-bold text-slate-300">{edu.year}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const MinimalistTemplate = ({ data, onUpdate }: TemplateProps) => {
  return (
    <div className={`cv-container cv-content-auto p-20 bg-white shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-sans text-slate-700 ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Inter' }}>
      <header className="mb-16 text-center">
        <h1 className="text-3xl font-light tracking-[0.2em] text-slate-900 uppercase mb-4">
          <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} className="mr-2" />
          <Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} className="font-medium" />
        </h1>
        <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest text-slate-400">
          <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} />
          <span>•</span>
          <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} />
          {data.address && (
            <>
              <span>•</span>
              <Editable text={data.address} onSave={(val) => onUpdate({ address: val })} />
            </>
          )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto space-y-12">
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 mb-6">Profil</h2>
          <Editable text={data.profile} className="text-sm leading-relaxed" onSave={(val) => onUpdate({ profile: val })} multiline />
        </section>

        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 mb-8">Expériences</h2>
          <div className="space-y-10">
            {data.experiences?.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-2">
                  <Editable text={exp.position} className="text-sm font-bold text-slate-900" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].position = val;
                    onUpdate({ experiences: newExp });
                  }} />
                  <span className="text-[10px] text-slate-400">{exp.startDate} — {exp.endDate}</span>
                </div>
                <Editable text={exp.company} className="text-xs text-slate-400 mb-3 block" onSave={(val) => {
                  const newExp = [...data.experiences];
                  newExp[i].company = val;
                  onUpdate({ experiences: newExp });
                }} />
                <Editable text={exp.description} className="text-sm leading-relaxed" onSave={(val) => {
                  const newExp = [...data.experiences];
                  newExp[i].description = val;
                  onUpdate({ experiences: newExp });
                }} multiline />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 mb-6">Compétences</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            {data.skills?.map((s, i) => (
              <Editable key={i} text={s} onSave={(val) => {
                const newSkills = [...data.skills];
                newSkills[i] = val;
                onUpdate({ skills: newSkills });
              }} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export const ProfessionalTemplate = ({ data, onUpdate }: TemplateProps) => {
  const primary = data.primaryColor || '#1e40af';
  return (
    <div className={`cv-container cv-content-auto p-12 bg-white shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-sans text-slate-800 ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Inter' }}>
      <header className="flex justify-between items-start mb-12 border-b-4 border-slate-900 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
            <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} className="mr-2" />
            <Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} />
          </h1>
          <p className="text-xl font-bold uppercase tracking-widest" style={{ color: primary }}>
            <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
          </p>
        </div>
        <div className="text-right text-sm space-y-1">
          <div className="flex items-center justify-end gap-2"><Editable text={data.email} onSave={(val) => onUpdate({ email: val })} /> <Mail size={14} /></div>
          <div className="flex items-center justify-end gap-2"><Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} /> <Phone size={14} /></div>
          {data.address && <div className="flex items-center justify-end gap-2"><Editable text={data.address} onSave={(val) => onUpdate({ address: val })} /> <MapPin size={14} /></div>}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-12">
        <div className="col-span-2 space-y-10">
          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 border-slate-200 mb-4 pb-1">Profil Professionnel</h2>
            <Editable text={data.profile} className="text-sm leading-relaxed" onSave={(val) => onUpdate({ profile: val })} multiline />
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 border-slate-200 mb-6 pb-1">Expériences</h2>
            <div className="space-y-8">
              {data.experiences?.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <Editable text={exp.position} className="font-bold text-slate-900" onSave={(val) => {
                      const newExp = [...data.experiences];
                      newExp[i].position = val;
                      onUpdate({ experiences: newExp });
                    }} />
                    <span className="text-xs font-bold text-slate-500">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-sm font-bold mb-2 block" style={{ color: primary }} onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].company = val;
                    onUpdate({ experiences: newExp });
                  }} />
                  <Editable text={exp.description} className="text-sm text-slate-600 leading-relaxed" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].description = val;
                    onUpdate({ experiences: newExp });
                  }} multiline />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="text-sm font-bold uppercase border-b-2 border-slate-200 mb-4 pb-1">Expertise</h2>
            <div className="space-y-2">
              {data.skills?.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primary }}></div>
                  <Editable text={s} className="text-xs font-medium" onSave={(val) => {
                    const newSkills = [...data.skills];
                    newSkills[i] = val;
                    onUpdate({ skills: newSkills });
                  }} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase border-b-2 border-slate-200 mb-4 pb-1">Formation</h2>
            <div className="space-y-4">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <Editable text={edu.degree} className="text-xs font-bold block" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].degree = val;
                    onUpdate({ education: newEdu });
                  }} />
                  <Editable text={edu.school} className="text-[10px] text-slate-500 block" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].school = val;
                    onUpdate({ education: newEdu });
                  }} />
                  <span className="text-[10px] font-bold text-slate-400">{edu.year}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const AcademicTemplate = ({ data, onUpdate }: TemplateProps) => {
  return (
    <div className={`cv-container cv-content-auto p-16 bg-white shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-serif text-slate-900 ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: 'Georgia, serif' }}>
      <header className="text-center mb-12 border-b border-slate-900 pb-8">
        <h1 className="text-4xl font-bold mb-4">
          <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} className="mr-3" />
          <Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} />
        </h1>
        <div className="text-sm italic space-x-4">
          <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} />
          <span>|</span>
          <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} />
          {data.address && (
            <>
              <span>|</span>
              <Editable text={data.address} onSave={(val) => onUpdate({ address: val })} />
            </>
          )}
        </div>
      </header>

      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-bold italic border-b mb-4">Research Interests</h2>
          <Editable text={data.profile} className="text-sm leading-relaxed" onSave={(val) => onUpdate({ profile: val })} multiline />
        </section>

        <section>
          <h2 className="text-lg font-bold italic border-b mb-4">Education</h2>
          <div className="space-y-6">
            {data.education?.map((edu, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <Editable text={edu.degree} className="font-bold block" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].degree = val;
                    onUpdate({ education: newEdu });
                  }} />
                  <Editable text={edu.school} className="italic block" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].school = val;
                    onUpdate({ education: newEdu });
                  }} />
                </div>
                <span className="font-bold">{edu.year}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold italic border-b mb-4">Professional Appointments</h2>
          <div className="space-y-8">
            {data.experiences?.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <Editable text={exp.position} className="font-bold" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].position = val;
                    onUpdate({ experiences: newExp });
                  }} />
                  <span className="text-sm italic">{exp.startDate} — {exp.endDate}</span>
                </div>
                <Editable text={exp.company} className="italic mb-2 block" onSave={(val) => {
                  const newExp = [...data.experiences];
                  newExp[i].company = val;
                  onUpdate({ experiences: newExp });
                }} />
                <Editable text={exp.description} className="text-sm leading-relaxed" onSave={(val) => {
                  const newExp = [...data.experiences];
                  newExp[i].description = val;
                  onUpdate({ experiences: newExp });
                }} multiline />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export const TechTemplate = ({ data, onUpdate }: TemplateProps) => {
  return (
    <div className={`cv-container cv-content-auto p-12 bg-[#0d1117] shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-mono text-[#c9d1d9] ${data.isCompact ? 'cv-compact' : ''}`}>
      <header className="mb-12 border-b border-[#30363d] pb-8">
        <h1 className="text-3xl font-bold text-[#58a6ff] mb-2">
          &gt; <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} />
          <Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} />
        </h1>
        <p className="text-xl text-[#8b949e] mb-4">
          // <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
        </p>
        <div className="flex gap-6 text-xs text-[#8b949e]">
          <div className="flex items-center gap-1"><Mail size={12} /> <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} /></div>
          <div className="flex items-center gap-1"><Phone size={12} /> <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} /></div>
          {data.address && <div className="flex items-center gap-1"><MapPin size={12} /> <Editable text={data.address} onSave={(val) => onUpdate({ address: val })} /></div>}
        </div>
      </header>

      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-bold text-[#58a6ff] mb-4 flex items-center gap-2">
            <Cpu size={18} /> .profile()
          </h2>
          <Editable text={data.profile} className="text-sm leading-relaxed opacity-80" onSave={(val) => onUpdate({ profile: val })} multiline />
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#58a6ff] mb-6 flex items-center gap-2">
            <FileText size={18} /> .experience[]
          </h2>
          <div className="space-y-8">
            {data.experiences?.map((exp, i) => (
              <div key={i} className="border-l-2 border-[#30363d] pl-6">
                <div className="flex justify-between items-baseline mb-1">
                  <Editable text={exp.position} className="font-bold text-[#f0f6fc]" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].position = val;
                    onUpdate({ experiences: newExp });
                  }} />
                  <span className="text-xs text-[#8b949e]">{exp.startDate} - {exp.endDate}</span>
                </div>
                <Editable text={exp.company} className="text-xs text-[#58a6ff] mb-2 block" onSave={(val) => {
                  const newExp = [...data.experiences];
                  newExp[i].company = val;
                  onUpdate({ experiences: newExp });
                }} />
                <Editable text={exp.description} className="text-sm opacity-70" onSave={(val) => {
                  const newExp = [...data.experiences];
                  newExp[i].description = val;
                  onUpdate({ experiences: newExp });
                }} multiline />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#58a6ff] mb-4 flex items-center gap-2">
            <Star size={18} /> .skills.get()
          </h2>
          <div className="flex flex-wrap gap-3">
            {data.skills?.map((s, i) => (
              <Editable key={i} text={s} className="bg-[#161b22] border border-[#30363d] px-2 py-1 rounded text-xs" onSave={(val) => {
                const newSkills = [...data.skills];
                newSkills[i] = val;
                onUpdate({ skills: newSkills });
              }} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export const DesignTemplate = ({ data, onUpdate }: TemplateProps) => {
  const primary = data.primaryColor || '#ff3e00';
  return (
    <div className={`cv-container cv-content-auto p-0 bg-white shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-sans text-slate-900 overflow-hidden ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Outfit' }}>
      <div className="flex h-full min-h-[297mm]">
        <div className="w-2/5 bg-slate-900 text-white p-12 flex flex-col">
          {data.photo && (
            <div className="w-full aspect-square rounded-full overflow-hidden mb-12 border-8 border-white/10 grayscale hover:grayscale-0 transition-all duration-500">
              <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="space-y-12">
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-slate-500">Contact</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3"><Mail size={14} className="text-primary" style={{ color: primary }} /> <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} /></div>
                <div className="flex items-center gap-3"><Phone size={14} className="text-primary" style={{ color: primary }} /> <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} /></div>
                {data.address && <div className="flex items-center gap-3"><MapPin size={14} className="text-primary" style={{ color: primary }} /> <Editable text={data.address} onSave={(val) => onUpdate({ address: val })} /></div>}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-slate-500">Skills</h3>
              <div className="space-y-4">
                {data.skills?.map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <Editable text={s} onSave={(val) => {
                        const newSkills = [...data.skills];
                        newSkills[i] = val;
                        onUpdate({ skills: newSkills });
                      }} />
                      <span>80%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full" style={{ width: '80%', backgroundColor: primary }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="flex-1 p-16">
          <header className="mb-16">
            <h1 className="text-6xl font-black tracking-tighter mb-4 leading-none">
              <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} />
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">
                <Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} />
              </span>
            </h1>
            <div className="h-2 w-20 bg-primary mb-6" style={{ backgroundColor: primary }}></div>
            <p className="text-2xl font-bold text-slate-400">
              <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
            </p>
          </header>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-black mb-6">About Me</h2>
              <Editable text={data.profile} className="text-lg leading-relaxed text-slate-600" onSave={(val) => onUpdate({ profile: val })} multiline />
            </section>

            <section>
              <h2 className="text-2xl font-black mb-8">Work Experience</h2>
              <div className="space-y-10">
                {data.experiences?.map((exp, i) => (
                  <div key={i} className="relative pl-8 border-l-2 border-slate-100">
                    <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-white border-4 border-primary" style={{ borderColor: primary }}></div>
                    <div className="mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{exp.startDate} - {exp.endDate}</span>
                      <Editable text={exp.position} className="text-xl font-black block" onSave={(val) => {
                        const newExp = [...data.experiences];
                        newExp[i].position = val;
                        onUpdate({ experiences: newExp });
                      }} />
                      <Editable text={exp.company} className="text-sm font-bold" style={{ color: primary }} onSave={(val) => {
                        const newExp = [...data.experiences];
                        newExp[i].company = val;
                        onUpdate({ experiences: newExp });
                      }} />
                    </div>
                    <Editable text={exp.description} className="text-sm text-slate-500 leading-relaxed" onSave={(val) => {
                      const newExp = [...data.experiences];
                      newExp[i].description = val;
                      onUpdate({ experiences: newExp });
                    }} multiline />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ElegantTemplate = ({ data, onUpdate }: TemplateProps) => {
  return (
    <div className={`cv-container cv-content-auto p-20 bg-[#fdfdfb] shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-serif text-slate-900 ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: 'Cormorant Garamond, serif' }}>
      <header className="text-center mb-20 border-b border-slate-200 pb-12">
        <h1 className="text-5xl font-light tracking-widest uppercase mb-4">
          <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} className="mr-4" />
          <Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} className="font-medium" />
        </h1>
        <p className="text-lg italic text-slate-500 tracking-widest">
          <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
        </p>
      </header>

      <div className="grid grid-cols-12 gap-16">
        <div className="col-span-4 space-y-12">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-6">Contact</h2>
            <div className="space-y-4 text-sm italic">
              <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} className="block" />
              <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} className="block" />
              <Editable text={data.address} onSave={(val) => onUpdate({ address: val })} className="block" />
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-6">Expertise</h2>
            <div className="space-y-4 text-sm italic">
              {data.skills?.map((s, i) => (
                <Editable key={i} text={s} onSave={(val) => {
                  const newSkills = [...data.skills];
                  newSkills[i] = val;
                  onUpdate({ skills: newSkills });
                }} className="block" />
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-8 space-y-16">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-6">Profil</h2>
            <Editable text={data.profile} className="text-lg leading-relaxed italic" onSave={(val) => onUpdate({ profile: val })} multiline />
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-8">Expériences</h2>
            <div className="space-y-12">
              {data.experiences?.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-2">
                    <Editable text={exp.position} className="text-xl font-bold" onSave={(val) => {
                      const newExp = [...data.experiences];
                      newExp[i].position = val;
                      onUpdate({ experiences: newExp });
                    }} />
                    <span className="text-xs italic text-slate-400">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-sm italic text-slate-500 mb-4 block" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].company = val;
                    onUpdate({ experiences: newExp });
                  }} />
                  <Editable text={exp.description} className="text-base leading-relaxed opacity-80" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].description = val;
                    onUpdate({ experiences: newExp });
                  }} multiline />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const BoldTemplate = ({ data, onUpdate }: TemplateProps) => {
  const primary = data.primaryColor || '#000000';
  return (
    <div className={`cv-container cv-content-auto p-0 bg-white shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-sans text-slate-900 ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Inter' }}>
      <header className="p-16 bg-slate-900 text-white">
        <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.8]">
          <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} />
          <br />
          <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>
            <Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} />
          </span>
        </h1>
        <div className="mt-12 flex justify-between items-end">
          <p className="text-2xl font-bold uppercase tracking-widest text-primary" style={{ color: primary }}>
            <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
          </p>
          <div className="text-right text-xs font-bold space-y-1 opacity-60">
            <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} className="block" />
            <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} className="block" />
          </div>
        </div>
      </header>

      <div className="p-16 grid grid-cols-12 gap-16">
        <div className="col-span-4 space-y-12">
          <section>
            <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-slate-900 pb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((s, i) => (
                <Editable key={i} text={s} className="px-3 py-1 bg-slate-100 font-bold text-xs uppercase" onSave={(val) => {
                  const newSkills = [...data.skills];
                  newSkills[i] = val;
                  onUpdate({ skills: newSkills });
                }} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-slate-900 pb-2">Education</h2>
            <div className="space-y-6">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <Editable text={edu.degree} className="font-black text-sm block" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].degree = val;
                    onUpdate({ education: newEdu });
                  }} />
                  <Editable text={edu.school} className="text-xs font-bold text-slate-400 block" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].school = val;
                    onUpdate({ education: newEdu });
                  }} />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-8 space-y-12">
          <section>
            <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-slate-900 pb-2">Experience</h2>
            <div className="space-y-10">
              {data.experiences?.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-2">
                    <Editable text={exp.position} className="text-2xl font-black uppercase" onSave={(val) => {
                      const newExp = [...data.experiences];
                      newExp[i].position = val;
                      onUpdate({ experiences: newExp });
                    }} />
                    <span className="font-bold text-slate-400">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-sm font-black text-primary mb-4 block" style={{ color: primary }} onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].company = val;
                    onUpdate({ experiences: newExp });
                  }} />
                  <Editable text={exp.description} className="text-sm font-medium leading-relaxed" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].description = val;
                    onUpdate({ experiences: newExp });
                  }} multiline />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const CompactTemplate = ({ data, onUpdate }: TemplateProps) => {
  return (
    <div className={`cv-container cv-content-auto p-10 bg-white shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-sans text-slate-800 ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Inter' }}>
      <header className="flex justify-between items-end mb-8 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} className="mr-1" />
            <Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} />
          </h1>
          <p className="text-sm font-medium text-slate-500">
            <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
          </p>
        </div>
        <div className="text-right text-[10px] space-y-0.5 text-slate-400">
          <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} className="block" />
          <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} className="block" />
          <Editable text={data.address} onSave={(val) => onUpdate({ address: val })} className="block" />
        </div>
      </header>

      <div className="space-y-6">
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-2 border-b border-slate-100 pb-1">Expériences</h2>
          <div className="space-y-4">
            {data.experiences?.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <Editable text={exp.position} className="text-xs font-bold" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].position = val;
                    onUpdate({ experiences: newExp });
                  }} />
                  <span className="text-[10px] text-slate-400">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline mb-1">
                  <Editable text={exp.company} className="text-[10px] font-bold text-slate-500" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].company = val;
                    onUpdate({ experiences: newExp });
                  }} />
                </div>
                <Editable text={exp.description} className="text-[10px] leading-relaxed text-slate-600" onSave={(val) => {
                  const newExp = [...data.experiences];
                  newExp[i].description = val;
                  onUpdate({ experiences: newExp });
                }} multiline />
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-8">
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-2 border-b border-slate-100 pb-1">Formation</h2>
            <div className="space-y-2">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <Editable text={edu.degree} className="text-xs font-bold block" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].degree = val;
                    onUpdate({ education: newEdu });
                  }} />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <Editable text={edu.school} onSave={(val) => {
                      const newEdu = [...data.education];
                      newEdu[i].school = val;
                      onUpdate({ education: newEdu });
                    }} />
                    <span>{edu.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-2 border-b border-slate-100 pb-1">Compétences</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
              {data.skills?.map((s, i) => (
                <Editable key={i} text={s} onSave={(val) => {
                  const newSkills = [...data.skills];
                  newSkills[i] = val;
                  onUpdate({ skills: newSkills });
                }} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const SidebarRightTemplate = ({ data, onUpdate }: TemplateProps) => {
  const primary = data.primaryColor || '#0f172a';
  return (
    <div className={`cv-container cv-content-auto flex min-h-[297mm] w-[210mm] font-sans text-slate-800 bg-white shadow-2xl mx-auto overflow-hidden ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Inter' }}>
      <div className="flex-1 p-12">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">
            <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} className="mr-2" />
            <Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} />
          </h1>
          <p className="text-xl font-bold text-primary" style={{ color: primary }}>
            <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
          </p>
        </header>

        <div className="space-y-10">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b-2 border-slate-100 pb-2">Profil</h2>
            <Editable text={data.profile} className="text-sm leading-relaxed text-slate-600" onSave={(val) => onUpdate({ profile: val })} multiline />
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b-2 border-slate-100 pb-2">Expériences</h2>
            <div className="space-y-8">
              {data.experiences?.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <Editable text={exp.position} className="font-bold text-slate-900" onSave={(val) => {
                      const newExp = [...data.experiences];
                      newExp[i].position = val;
                      onUpdate({ experiences: newExp });
                    }} />
                    <span className="text-xs font-bold text-slate-400">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-xs font-bold text-slate-500 mb-3 block" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].company = val;
                    onUpdate({ experiences: newExp });
                  }} />
                  <Editable text={exp.description} className="text-sm text-slate-600 leading-relaxed" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].description = val;
                    onUpdate({ experiences: newExp });
                  }} multiline />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="w-1/3 bg-slate-50 p-10 border-l border-slate-100">
        <div className="space-y-10">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-slate-400">Contact</h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 text-slate-600"><Mail size={14} /> <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} /></div>
              <div className="flex items-center gap-3 text-slate-600"><Phone size={14} /> <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} /></div>
              {data.address && <div className="flex items-center gap-3 text-slate-600"><MapPin size={14} /> <Editable text={data.address} onSave={(val) => onUpdate({ address: val })} /></div>}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-slate-400">Compétences</h3>
            <div className="space-y-3">
              {data.skills?.map((s, i) => (
                <div key={i}>
                  <Editable text={s} className="text-xs font-bold text-slate-700 block mb-1" onSave={(val) => {
                    const newSkills = [...data.skills];
                    newSkills[i] = val;
                    onUpdate({ skills: newSkills });
                  }} />
                  <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900" style={{ width: '85%', backgroundColor: primary }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-slate-400">Formation</h3>
            <div className="space-y-6">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <Editable text={edu.degree} className="text-xs font-bold block" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].degree = val;
                    onUpdate({ education: newEdu });
                  }} />
                  <Editable text={edu.school} className="text-[10px] text-slate-500 block" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].school = val;
                    onUpdate({ education: newEdu });
                  }} />
                  <span className="text-[10px] font-bold text-slate-300">{edu.year}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const TimelineTemplate = ({ data, onUpdate }: TemplateProps) => {
  const primary = data.primaryColor || '#6366f1';
  return (
    <div className={`cv-container cv-content-auto p-16 bg-white shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-sans text-slate-800 ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Inter' }}>
      <header className="mb-16">
        <div className="flex items-center gap-8">
          {data.photo && (
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl">
              <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">
              <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} className="mr-2" />
              <Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} />
            </h1>
            <p className="text-xl font-bold text-primary" style={{ color: primary }}>
              <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-16">
        <div className="col-span-8">
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-300 mb-10">Expériences</h2>
            <div className="space-y-12 relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-white border-2 border-primary" style={{ borderColor: primary }}></div>
                  <div className="mb-2">
                    <span className="text-xs font-bold text-primary mb-1 block" style={{ color: primary }}>{exp.startDate} - {exp.endDate}</span>
                    <Editable text={exp.position} className="text-xl font-bold text-slate-900 block" onSave={(val) => {
                      const newExp = [...data.experiences];
                      newExp[i].position = val;
                      onUpdate({ experiences: newExp });
                    }} />
                    <Editable text={exp.company} className="text-sm font-bold text-slate-400" onSave={(val) => {
                      const newExp = [...data.experiences];
                      newExp[i].company = val;
                      onUpdate({ experiences: newExp });
                    }} />
                  </div>
                  <Editable text={exp.description} className="text-sm leading-relaxed text-slate-600" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].description = val;
                    onUpdate({ experiences: newExp });
                  }} multiline />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-4 space-y-12">
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-300 mb-6">Contact</h2>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex items-center gap-3"><Mail size={16} className="text-slate-300" /> <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} /></div>
              <div className="flex items-center gap-3"><Phone size={16} className="text-slate-300" /> <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} /></div>
              {data.address && <div className="flex items-center gap-3"><MapPin size={16} className="text-slate-300" /> <Editable text={data.address} onSave={(val) => onUpdate({ address: val })} /></div>}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-300 mb-6">Compétences</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((s, i) => (
                <Editable key={i} text={s} className="px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-600" onSave={(val) => {
                  const newSkills = [...data.skills];
                  newSkills[i] = val;
                  onUpdate({ skills: newSkills });
                }} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const ModernSidebarTemplate = ({ data, onUpdate }: TemplateProps) => {
  const primary = data.primaryColor || '#0f172a';
  return (
    <div className={`cv-container cv-content-auto flex min-h-[297mm] w-[210mm] font-sans text-slate-800 bg-white shadow-2xl mx-auto overflow-hidden ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Inter' }}>
      <div className="w-[80mm] text-white p-10 flex flex-col" style={{ backgroundColor: primary }}>
        <div className="mb-10 text-center">
          {data.photo && (
            <div className="w-40 h-40 rounded-2xl overflow-hidden mb-6 border-4 border-white/10 mx-auto shadow-2xl rotate-3">
              <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-3xl font-black mb-2 tracking-tighter uppercase">
            <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} />
            <br />
            <Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} />
          </h1>
          <div className="h-1 w-12 bg-white/30 mx-auto mb-4"></div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-80">
            <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
          </p>
        </div>

        <div className="space-y-10 flex-1">
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 opacity-40">Contact</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3"><Mail size={16} className="opacity-50" /> <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} /></div>
              <div className="flex items-center gap-3"><Phone size={16} className="opacity-50" /> <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} /></div>
              {data.address && <div className="flex items-center gap-3"><MapPin size={16} className="opacity-50" /> <Editable text={data.address} onSave={(val) => onUpdate({ address: val })} /></div>}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 opacity-40">Compétences</h3>
            <div className="space-y-3">
              {data.skills?.map((s, i) => (
                <div key={i} className="space-y-1">
                  <Editable text={s} className="text-xs font-bold block" onSave={(val) => {
                    const newSkills = [...data.skills];
                    newSkills[i] = val;
                    onUpdate({ skills: newSkills });
                  }} />
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white/40 w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="flex-1 p-16 bg-slate-50/30">
        <section className="mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-6">Profil</h2>
          <Editable text={data.profile} className="text-sm leading-relaxed text-slate-600 italic" onSave={(val) => onUpdate({ profile: val })} multiline />
        </section>

        <section className="mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-8">Expériences</h2>
          <div className="space-y-10">
            {data.experiences?.map((exp, i) => (
              <div key={i} className="relative pl-8 border-l border-slate-200">
                <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] rounded-full bg-slate-300"></div>
                <div className="mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exp.startDate} — {exp.endDate}</span>
                  <Editable text={exp.position} className="text-xl font-black text-slate-900 block mt-1" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].position = val;
                    onUpdate({ experiences: newExp });
                  }} />
                  <Editable text={exp.company} className="text-sm font-bold" style={{ color: primary }} onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].company = val;
                    onUpdate({ experiences: newExp });
                  }} />
                </div>
                <Editable text={exp.description} className="text-sm text-slate-500 leading-relaxed" onSave={(val) => {
                  const newExp = [...data.experiences];
                  newExp[i].description = val;
                  onUpdate({ experiences: newExp });
                }} multiline />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-6">Formation</h2>
          <div className="grid grid-cols-2 gap-8">
            {data.education?.map((edu, i) => (
              <div key={i}>
                <Editable text={edu.degree} className="font-black text-sm block mb-1" onSave={(val) => {
                  const newEdu = [...data.education];
                  newEdu[i].degree = val;
                  onUpdate({ education: newEdu });
                }} />
                <Editable text={edu.school} className="text-xs text-slate-400 block" onSave={(val) => {
                  const newEdu = [...data.education];
                  newEdu[i].school = val;
                  onUpdate({ education: newEdu });
                }} />
                <span className="text-[10px] font-bold text-slate-300">{edu.year}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export const CleanAccentTemplate = ({ data, onUpdate }: TemplateProps) => {
  const primary = data.primaryColor || '#2563eb';
  return (
    <div className={`cv-container cv-content-auto p-16 bg-white shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-sans text-slate-800 ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Inter' }}>
      <header className="mb-16 flex justify-between items-end border-b-8 border-slate-100 pb-12">
        <div>
          <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-4">
            <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} />
            <br />
            <span style={{ color: primary }}><Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} /></span>
          </h1>
          <p className="text-xl font-bold uppercase tracking-[0.3em] text-slate-400">
            <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
          </p>
        </div>
        <div className="text-right space-y-2 text-sm font-medium text-slate-500">
          <div className="flex items-center justify-end gap-3"><Editable text={data.email} onSave={(val) => onUpdate({ email: val })} /> <Mail size={18} style={{ color: primary }} /></div>
          <div className="flex items-center justify-end gap-3"><Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} /> <Phone size={18} style={{ color: primary }} /></div>
          {data.address && <div className="flex items-center justify-end gap-3"><Editable text={data.address} onSave={(val) => onUpdate({ address: val })} /> <MapPin size={18} style={{ color: primary }} /></div>}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-16">
        <div className="col-span-8 space-y-12">
          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-4">
              <span className="w-12 h-2 rounded-full" style={{ backgroundColor: primary }}></span> Expériences
            </h2>
            <div className="space-y-12">
              {data.experiences?.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-3">
                    <Editable text={exp.position} className="text-xl font-black text-slate-900" onSave={(val) => {
                      const newExp = [...data.experiences];
                      newExp[i].position = val;
                      onUpdate({ experiences: newExp });
                    }} />
                    <span className="text-xs font-black px-3 py-1 bg-slate-100 rounded-full text-slate-500">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-sm font-bold mb-4 block" style={{ color: primary }} onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].company = val;
                    onUpdate({ experiences: newExp });
                  }} />
                  <Editable text={exp.description} className="text-sm text-slate-600 leading-relaxed" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].description = val;
                    onUpdate({ experiences: newExp });
                  }} multiline />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-4 space-y-12">
          <section>
            <h2 className="text-lg font-black uppercase tracking-widest mb-6 border-b-2 border-slate-100 pb-2">Profil</h2>
            <Editable text={data.profile} className="text-sm leading-relaxed text-slate-500" onSave={(val) => onUpdate({ profile: val })} multiline />
          </section>

          <section>
            <h2 className="text-lg font-black uppercase tracking-widest mb-6 border-b-2 border-slate-100 pb-2">Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((s, i) => (
                <Editable key={i} text={s} className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 border border-slate-100" onSave={(val) => {
                  const newSkills = [...data.skills];
                  newSkills[i] = val;
                  onUpdate({ skills: newSkills });
                }} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase tracking-widest mb-6 border-b-2 border-slate-100 pb-2">Formation</h2>
            <div className="space-y-6">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <Editable text={edu.degree} className="font-bold text-sm block mb-1" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].degree = val;
                    onUpdate({ education: newEdu });
                  }} />
                  <Editable text={edu.school} className="text-xs text-slate-400 block" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].school = val;
                    onUpdate({ education: newEdu });
                  }} />
                  <span className="text-[10px] font-black text-slate-300">{edu.year}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const CreativeVibrantTemplate = ({ data, onUpdate }: TemplateProps) => {
  const primary = data.primaryColor || '#ec4899';
  return (
    <div className={`cv-container cv-content-auto p-0 bg-white shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-sans text-slate-800 overflow-hidden ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Montserrat' }}>
      <div className="bg-slate-900 p-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 blur-3xl opacity-20" style={{ backgroundColor: primary }}></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-6xl font-black tracking-tighter mb-4">
              <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} />
              <br />
              <span style={{ color: primary }}><Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} /></span>
            </h1>
            <p className="text-2xl font-bold opacity-50 uppercase tracking-[0.2em]">
              <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
            </p>
          </div>
          {data.photo && (
            <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-white/10 shadow-2xl">
              <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="p-16 grid grid-cols-12 gap-16">
        <div className="col-span-4 space-y-12">
          <section className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-6">Contact</h2>
            <div className="space-y-6 text-sm font-bold">
              <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center" style={{ color: primary }}><Mail size={20} /></div> <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} /></div>
              <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center" style={{ color: primary }}><Phone size={20} /></div> <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} /></div>
              {data.address && <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center" style={{ color: primary }}><MapPin size={20} /></div> <Editable text={data.address} onSave={(val) => onUpdate({ address: val })} /></div>}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-6">Expertise</h2>
            <div className="space-y-4">
              {data.skills?.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></div>
                  <Editable text={s} className="text-sm font-bold" onSave={(val) => {
                    const newSkills = [...data.skills];
                    newSkills[i] = val;
                    onUpdate({ skills: newSkills });
                  }} />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-8 space-y-12">
          <section>
            <h2 className="text-3xl font-black mb-6" style={{ color: primary }}>Profil</h2>
            <Editable text={data.profile} className="text-lg leading-relaxed text-slate-600 font-medium" onSave={(val) => onUpdate({ profile: val })} multiline />
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8" style={{ color: primary }}>Expériences</h2>
            <div className="space-y-12">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Editable text={exp.position} className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors" onSave={(val) => {
                        const newExp = [...data.experiences];
                        newExp[i].position = val;
                        onUpdate({ experiences: newExp });
                      }} />
                      <Editable text={exp.company} className="text-lg font-bold text-slate-400" onSave={(val) => {
                        const newExp = [...data.experiences];
                        newExp[i].company = val;
                        onUpdate({ experiences: newExp });
                      }} />
                    </div>
                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <Editable text={exp.description} className="text-sm text-slate-500 leading-relaxed" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].description = val;
                    onUpdate({ experiences: newExp });
                  }} multiline />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const SoftMinimalTemplate = ({ data, onUpdate }: TemplateProps) => {
  const primary = data.primaryColor || '#64748b';
  return (
    <div className={`cv-container cv-content-auto p-20 bg-stone-50 shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-serif text-stone-800 ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Lora' }}>
      <header className="text-center mb-20">
        <h1 className="text-5xl font-light tracking-widest text-stone-900 mb-6 uppercase">
          <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} /> <Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} />
        </h1>
        <div className="h-px w-24 bg-stone-300 mx-auto mb-6"></div>
        <p className="text-sm font-bold uppercase tracking-[0.4em] text-stone-400">
          <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
        </p>
      </header>

      <div className="grid grid-cols-12 gap-20">
        <div className="col-span-4 space-y-12">
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-stone-300 mb-6">Contact</h2>
            <div className="space-y-4 text-xs font-medium text-stone-500">
              <p><Editable text={data.email} onSave={(val) => onUpdate({ email: val })} /></p>
              <p><Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} /></p>
              {data.address && <p><Editable text={data.address} onSave={(val) => onUpdate({ address: val })} /></p>}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-stone-300 mb-6">Compétences</h2>
            <div className="space-y-4">
              {data.skills?.map((s, i) => (
                <div key={i}>
                  <Editable text={s} className="text-xs font-bold block mb-2" onSave={(val) => {
                    const newSkills = [...data.skills];
                    newSkills[i] = val;
                    onUpdate({ skills: newSkills });
                  }} />
                  <div className="h-[2px] bg-stone-200 w-full">
                    <div className="h-full bg-stone-400 w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-8 space-y-16">
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-stone-300 mb-8">Profil</h2>
            <Editable text={data.profile} className="text-base leading-relaxed text-stone-600 italic" onSave={(val) => onUpdate({ profile: val })} multiline />
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-stone-300 mb-8">Expériences</h2>
            <div className="space-y-12">
              {data.experiences?.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-4">
                    <Editable text={exp.position} className="text-xl font-medium text-stone-900" onSave={(val) => {
                      const newExp = [...data.experiences];
                      newExp[i].position = val;
                      onUpdate({ experiences: newExp });
                    }} />
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-sm font-bold text-stone-400 mb-4 block uppercase tracking-widest" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].company = val;
                    onUpdate({ experiences: newExp });
                  }} />
                  <Editable text={exp.description} className="text-sm text-stone-500 leading-relaxed" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].description = val;
                    onUpdate({ experiences: newExp });
                  }} multiline />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const DarkPremiumTemplate = ({ data, onUpdate }: TemplateProps) => {
  const primary = data.primaryColor || '#fbbf24';
  return (
    <div className={`cv-container cv-content-auto bg-[#1a1a1a] shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-sans text-white/70 overflow-hidden ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Inter' }}>
      <div className="p-20 border-b border-white/5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-7xl font-black tracking-tighter text-white mb-4">
              <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} />
              <br />
              <span style={{ color: primary }}><Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} /></span>
            </h1>
            <p className="text-xl font-bold uppercase tracking-[0.4em] opacity-40">
              <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
            </p>
          </div>
          {data.photo && (
            <div className="w-48 h-48 rounded-3xl overflow-hidden border-8 border-white/5 grayscale hover:grayscale-0 transition-all duration-500">
              <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-4 p-16 border-r border-white/5 space-y-16">
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-8">Contact</h2>
            <div className="space-y-6 text-sm font-medium">
              <div className="flex items-center gap-4"><Mail size={18} style={{ color: primary }} /> <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} /></div>
              <div className="flex items-center gap-4"><Phone size={18} style={{ color: primary }} /> <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} /></div>
              {data.address && <div className="flex items-center gap-4"><MapPin size={18} style={{ color: primary }} /> <Editable text={data.address} onSave={(val) => onUpdate({ address: val })} /></div>}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-8">Compétences</h2>
            <div className="space-y-6">
              {data.skills?.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <Editable text={s} onSave={(val) => {
                      const newSkills = [...data.skills];
                      newSkills[i] = val;
                      onUpdate({ skills: newSkills });
                    }} />
                    <span style={{ color: primary }}>90%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ backgroundColor: primary, width: '90%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-8 p-16 space-y-16">
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-8">Expériences</h2>
            <div className="space-y-12">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-10 border-l border-white/5">
                  <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] rounded-full" style={{ backgroundColor: primary }}></div>
                  <div className="mb-4">
                    <div className="flex justify-between items-baseline">
                      <Editable text={exp.position} className="text-2xl font-black text-white" onSave={(val) => {
                        const newExp = [...data.experiences];
                        newExp[i].position = val;
                        onUpdate({ experiences: newExp });
                      }} />
                      <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <Editable text={exp.company} className="text-sm font-bold uppercase tracking-widest" style={{ color: primary }} onSave={(val) => {
                      const newExp = [...data.experiences];
                      newExp[i].company = val;
                      onUpdate({ experiences: newExp });
                    }} />
                  </div>
                  <Editable text={exp.description} className="text-sm leading-relaxed opacity-60" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].description = val;
                    onUpdate({ experiences: newExp });
                  }} multiline />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const MinimalistTypoTemplate = ({ data, onUpdate }: TemplateProps) => {
  return (
    <div className={`cv-container cv-content-auto p-24 bg-white shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-sans text-slate-900 ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Inter' }}>
      <header className="mb-24">
        <h1 className="text-8xl font-black tracking-tighter leading-[0.8] mb-8">
          <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} />
          <br />
          <Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} />
        </h1>
        <div className="flex justify-between items-end">
          <p className="text-2xl font-bold text-slate-300 uppercase tracking-widest">
            <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
          </p>
          <div className="text-right text-xs font-black uppercase tracking-widest space-y-1">
            <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} />
            <br />
            <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} />
          </div>
        </div>
      </header>

      <div className="space-y-24">
        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-200 mb-12">Expériences</h2>
          <div className="space-y-16">
            {data.experiences?.map((exp, i) => (
              <div key={i} className="grid grid-cols-12 gap-8">
                <div className="col-span-3 text-xs font-black text-slate-300 uppercase tracking-widest">
                  {exp.startDate} — {exp.endDate}
                </div>
                <div className="col-span-9">
                  <Editable text={exp.position} className="text-3xl font-black mb-2 block" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].position = val;
                    onUpdate({ experiences: newExp });
                  }} />
                  <Editable text={exp.company} className="text-sm font-bold text-slate-400 mb-6 block uppercase tracking-widest" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].company = val;
                    onUpdate({ experiences: newExp });
                  }} />
                  <Editable text={exp.description} className="text-base leading-relaxed text-slate-600" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].description = val;
                    onUpdate({ experiences: newExp });
                  }} multiline />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-24">
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-200 mb-8">Expertise</h2>
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {data.skills?.map((s, i) => (
                <Editable key={i} text={s} className="text-sm font-black uppercase tracking-widest text-slate-900" onSave={(val) => {
                  const newSkills = [...data.skills];
                  newSkills[i] = val;
                  onUpdate({ skills: newSkills });
                }} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-200 mb-8">Formation</h2>
            <div className="space-y-8">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <Editable text={edu.degree} className="text-lg font-black block" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].degree = val;
                    onUpdate({ education: newEdu });
                  }} />
                  <Editable text={edu.school} className="text-sm font-bold text-slate-400 uppercase tracking-widest" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].school = val;
                    onUpdate({ education: newEdu });
                  }} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const ElegantSerifTemplate = ({ data, onUpdate }: TemplateProps) => {
  const primary = data.primaryColor || '#1e293b';
  return (
    <div className={`cv-container cv-content-auto p-20 bg-[#fffdfa] shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-serif text-slate-900 ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'Playfair Display' }}>
      <header className="text-center mb-20 border-b border-slate-200 pb-16">
        <h1 className="text-6xl font-black mb-6 italic tracking-tight">
          <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} /> <Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} />
        </h1>
        <p className="text-sm font-bold uppercase tracking-[0.5em] text-slate-400 mb-8">
          <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
        </p>
        <div className="flex justify-center gap-8 text-xs font-medium text-slate-500 italic">
          <span><Editable text={data.email} onSave={(val) => onUpdate({ email: val })} /></span>
          <span>•</span>
          <span><Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} /></span>
          {data.address && (
            <>
              <span>•</span>
              <span><Editable text={data.address} onSave={(val) => onUpdate({ address: val })} /></span>
            </>
          )}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-16">
        <div className="col-span-8 space-y-16">
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-10 text-center">Parcours Professionnel</h2>
            <div className="space-y-16">
              {data.experiences?.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-4">
                    <Editable text={exp.position} className="text-2xl font-black italic" onSave={(val) => {
                      const newExp = [...data.experiences];
                      newExp[i].position = val;
                      onUpdate({ experiences: newExp });
                    }} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <Editable text={exp.company} className="text-sm font-bold text-slate-400 mb-6 block uppercase tracking-widest" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].company = val;
                    onUpdate({ experiences: newExp });
                  }} />
                  <Editable text={exp.description} className="text-base leading-relaxed text-slate-600 font-serif" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].description = val;
                    onUpdate({ experiences: newExp });
                  }} multiline />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-4 space-y-16">
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-8">Profil</h2>
            <Editable text={data.profile} className="text-sm leading-relaxed text-slate-600 italic font-serif" onSave={(val) => onUpdate({ profile: val })} multiline />
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-8">Expertise</h2>
            <div className="space-y-4">
              {data.skills?.map((s, i) => (
                <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <Editable text={s} className="text-sm font-bold italic" onSave={(val) => {
                    const newSkills = [...data.skills];
                    newSkills[i] = val;
                    onUpdate({ skills: newSkills });
                  }} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-8">Formation</h2>
            <div className="space-y-8">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <Editable text={edu.degree} className="text-base font-black italic block" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].degree = val;
                    onUpdate({ education: newEdu });
                  }} />
                  <Editable text={edu.school} className="text-xs text-slate-400 block uppercase tracking-widest" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].school = val;
                    onUpdate({ education: newEdu });
                  }} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const TechGridTemplate = ({ data, onUpdate }: TemplateProps) => {
  const primary = data.primaryColor || '#0ea5e9';
  return (
    <div className={`cv-container cv-content-auto p-12 bg-slate-950 shadow-2xl mx-auto w-[210mm] min-h-[297mm] font-mono text-slate-400 ${data.isCompact ? 'cv-compact' : ''}`} style={{ fontFamily: data.fontFamily || 'JetBrains Mono' }}>
      <div className="grid grid-cols-12 gap-4 h-full">
        <header className="col-span-12 p-10 border border-slate-800 bg-slate-900/50 rounded-2xl flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">
              <Editable text={data.firstName} onSave={(val) => onUpdate({ firstName: val })} />_<Editable text={data.lastName} onSave={(val) => onUpdate({ lastName: val })} />
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: primary }}>
              &gt; <Editable text={data.jobTitle} onSave={(val) => onUpdate({ jobTitle: val })} />
            </p>
          </div>
          <div className="text-right text-[10px] space-y-1">
            <div className="flex items-center justify-end gap-2">EMAIL: <Editable text={data.email} onSave={(val) => onUpdate({ email: val })} /></div>
            <div className="flex items-center justify-end gap-2">PHONE: <Editable text={data.phone} onSave={(val) => onUpdate({ phone: val })} /></div>
          </div>
        </header>

        <div className="col-span-8 space-y-4">
          <section className="p-8 border border-slate-800 rounded-2xl bg-slate-900/30">
            <h2 className="text-xs font-black text-slate-600 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></div> Expériences
            </h2>
            <div className="space-y-10">
              {data.experiences?.map((exp, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-slate-800">
                  <div className="mb-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <Editable text={exp.position} className="text-lg font-black text-white" onSave={(val) => {
                        const newExp = [...data.experiences];
                        newExp[i].position = val;
                        onUpdate({ experiences: newExp });
                      }} />
                      <span className="text-[10px] text-slate-500">[{exp.startDate} - {exp.endDate}]</span>
                    </div>
                    <Editable text={exp.company} className="text-xs font-bold" style={{ color: primary }} onSave={(val) => {
                      const newExp = [...data.experiences];
                      newExp[i].company = val;
                      onUpdate({ experiences: newExp });
                    }} />
                  </div>
                  <Editable text={exp.description} className="text-xs leading-relaxed" onSave={(val) => {
                    const newExp = [...data.experiences];
                    newExp[i].description = val;
                    onUpdate({ experiences: newExp });
                  }} multiline />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-4 space-y-4">
          <section className="p-8 border border-slate-800 rounded-2xl bg-slate-900/30">
            <h2 className="text-xs font-black text-slate-600 uppercase tracking-[0.4em] mb-6">Profil</h2>
            <Editable text={data.profile} className="text-xs leading-relaxed italic" onSave={(val) => onUpdate({ profile: val })} multiline />
          </section>

          <section className="p-8 border border-slate-800 rounded-2xl bg-slate-900/30">
            <h2 className="text-xs font-black text-slate-600 uppercase tracking-[0.4em] mb-6">Stack</h2>
            <div className="grid grid-cols-1 gap-4">
              {data.skills?.map((s, i) => (
                <div key={i} className="space-y-2">
                  <Editable text={s} className="text-[10px] font-bold text-white" onSave={(val) => {
                    const newSkills = [...data.skills];
                    newSkills[i] = val;
                    onUpdate({ skills: newSkills });
                  }} />
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full" style={{ backgroundColor: primary, width: '85%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="p-8 border border-slate-800 rounded-2xl bg-slate-900/30">
            <h2 className="text-xs font-black text-slate-600 uppercase tracking-[0.4em] mb-6">Formation</h2>
            <div className="space-y-6">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <Editable text={edu.degree} className="text-xs font-black text-white block mb-1" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].degree = val;
                    onUpdate({ education: newEdu });
                  }} />
                  <Editable text={edu.school} className="text-[10px] text-slate-500 block" onSave={(val) => {
                    const newEdu = [...data.education];
                    newEdu[i].school = val;
                    onUpdate({ education: newEdu });
                  }} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

