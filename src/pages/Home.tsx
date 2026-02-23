import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FileText, Sparkles, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 bg-primary-light px-3 py-1 rounded-full text-primary text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles size={14} />
                <span>Propulsé par l'Intelligence Artificielle</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight mb-6">
                CRYNANCE <br />
                <span className="text-primary">IA CV PRO 2</span>
              </h1>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Créez un CV percutant et une lettre de motivation en quelques minutes. Notre IA optimise votre contenu pour les recruteurs et les systèmes ATS.
              </p>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/create-cv" className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/25 flex items-center justify-center group">
                  Créer mon CV Pro
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link to="/premium" className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-slate-50 transition-all flex items-center justify-center space-x-2">
                  <Zap size={20} className="text-primary" />
                  <span>Devenir Premium Pro</span>
                </Link>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Version Premium Pro</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Export PDF & Word</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
            >
              <div className="relative mx-auto w-full rounded-3xl shadow-2xl overflow-hidden bg-white border border-slate-100">
                <img
                  src="https://picsum.photos/seed/cv/800/1000"
                  alt="CV Preview"
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
              
              {/* Floating elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 hidden md:block"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Score ATS</p>
                    <p className="text-xl font-bold text-slate-900">98/100</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Mode Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-8 md:p-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <Zap size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Mode CV Rapide</h2>
                <p className="text-slate-500 text-sm">Générez un CV simple en 30 secondes.</p>
              </div>
            </div>

            <form className="grid md:grid-cols-3 gap-6" onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const name = (form.elements.namedItem('name') as HTMLInputElement).value;
              const job = (form.elements.namedItem('job') as HTMLInputElement).value;
              const level = (form.elements.namedItem('level') as HTMLSelectElement).value;
              
              const quickData = {
                firstName: name.split(' ')[0] || '',
                lastName: name.split(' ').slice(1).join(' ') || '',
                jobTitle: job,
                level: level,
                email: '',
                phone: '',
                profile: '',
                skills: [],
                itSkills: [],
                experiences: [],
                education: [],
                qualities: [],
                flaws: [],
                interests: [],
                language: 'fr',
                template: 'modern'
              };
              
              localStorage.setItem('currentCV', JSON.stringify(quickData));
              navigate('/create-cv'); 
            }}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Nom Complet</label>
                <input name="name" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" placeholder="Jean Dupont" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Métier</label>
                <input name="job" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" placeholder="Comptable" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Niveau</label>
                <select name="level" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary">
                  <option>Débutant</option>
                  <option>Intermédiaire</option>
                  <option>Expert</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
                  Générer CV Simple
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Pourquoi choisir notre générateur ?</h2>
            <p className="text-slate-600">Nous combinons design moderne et intelligence artificielle pour vous donner un avantage compétitif sur le marché du travail.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Optimisation ATS",
                desc: "Nos templates sont conçus pour être lus facilement par les logiciels de recrutement automatisés.",
                icon: ShieldCheck,
                color: "bg-blue-50 text-blue-600"
              },
              {
                title: "IA Intelligente",
                desc: "L'IA complète vos sections manquantes et suggère des compétences pertinentes pour votre métier.",
                icon: Sparkles,
                color: "bg-purple-50 text-purple-600"
              },
              {
                title: "Export Multi-format",
                desc: "Téléchargez votre CV en PDF haute qualité ou en format Word éditable instantanément.",
                icon: FileText,
                color: "bg-emerald-50 text-emerald-600"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Boostez votre carrière</h2>
              <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                Accédez à nos templates exclusifs et téléchargez votre CV en format PDF et Word haute qualité.
              </p>
              <Link to="/premium" className="inline-flex items-center bg-primary text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20">
                Voir les Plans Premium
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
