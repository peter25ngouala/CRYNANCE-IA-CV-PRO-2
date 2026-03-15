import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { FileText, Sparkles, Loader2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import { generateCoverLetter } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { storage } from '../utils/storage';
import { CoverLetterData } from '../types';
import { useAuth } from '../context/AuthContext';

export default function CoverLetterForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<CoverLetterData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      targetJob: '',
      company: '',
      companyAddress: '',
      recruiterName: '',
      jobCity: '',
      contractType: 'Emploi (CDI)',
      motivation: ''
    }
  });

  const formData = watch();

  useEffect(() => {
    const saved = storage.loadLetterData();
    const cvData = storage.loadCV();
    
    if (saved) {
      reset(saved);
    } else if (cvData) {
      // Pre-fill with CV data if no letter data exists
      reset({
        firstName: cvData.firstName || '',
        lastName: cvData.lastName || '',
        email: cvData.email || '',
        phone: cvData.phone || '',
        address: cvData.address || '',
        targetJob: cvData.jobTitle || '',
        company: '',
        companyAddress: '',
        recruiterName: '',
        jobCity: '',
        contractType: 'Emploi (CDI)',
        motivation: ''
      });
    }
  }, [reset]);

  // Removed auto-save logic for cover letters as requested.
  /*
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (Object.keys(formData).length > 0) {
        setIsAutoSaving(true);
        storage.saveLetterData(formData);
        
        // Permanent save if logged in
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user) {
          await api.letters.save({
            id: localStorage.getItem('currentLetterId') || Date.now().toString(),
            data: formData,
            content: storage.loadLetterContent() || ''
          });
        }
        
        setTimeout(() => setIsAutoSaving(false), 1000);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [formData]);
  */

  const onSubmit = async (data: CoverLetterData) => {
    if (!user) {
      alert("Veuillez vous connecter pour générer une lettre avec l'IA.");
      navigate('/login');
      return;
    }

    setIsGenerating(true);
    try {
      // Check and consume generation credit
      const consumeRes = await api.ia.consume('letter');
      if (!consumeRes.ok) {
        let errorMsg = "Vous n'avez plus de crédits de génération. Veuillez renouveler votre abonnement.";
        const text = await consumeRes.text();
        try {
          const errorData = JSON.parse(text);
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          console.error("Failed to parse error JSON from consume credit:", e);
          if (text.includes("<html>")) {
            errorMsg = "Erreur serveur (HTML reçu). Veuillez contacter le support.";
          }
        }
        alert(errorMsg);
        navigate('/premium');
        return;
      }

      // Refresh profile to update remaining credits in context
      refreshProfile();

      const cvData = storage.loadCV() || {};
      const content = await generateCoverLetter(cvData, data);
      storage.saveLetterContent({ data, content });
      navigate('/cover-letter-preview');
    } catch (error: any) {
      console.error("Cover Letter Error:", error);
      let msg = error.message || "";
      
      try {
        if (msg.startsWith('{')) {
          const errorObj = JSON.parse(msg);
          msg = errorObj.error?.message || msg;
        }
      } catch (e) {}

      if (msg.includes("API Key not found") || msg.includes("API_KEY_INVALID")) {
        alert("⚠️ Erreur de Clé API : Google ne reconnaît pas votre clé. \n\nConseils :\n1. Vérifiez que la clé commence par 'AIza'.\n2. Essayez de nommer la variable 'VITE_GEMINI_API_KEY' dans Netlify au lieu de 'GEMINI_API_KEY'.\n3. Redéployez le site après modification.");
      } else {
        alert(`❌ Erreur lors de la génération de la lettre : ${msg || "Veuillez réessayer."}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">Lettre de Motivation <span className="text-primary">IA</span></h1>
          <p className="text-slate-600 max-w-xl mx-auto">Générez une lettre professionnelle et percutante en quelques secondes, sans texte inutile.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 space-y-10">
          {/* Section 1: Informations Personnelles */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
              <span>Vos Informations Personnelles</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Prénom</label>
                <input {...register("firstName", { required: true })} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" placeholder="Jean" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nom</label>
                <input {...register("lastName", { required: true })} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" placeholder="Dupont" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Adresse complète</label>
                <input {...register("address", { required: true })} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" placeholder="123 Rue de l'Avenir, 75000 Paris" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input {...register("email", { required: true })} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" placeholder="jean.dupont@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Téléphone</label>
                <input {...register("phone", { required: true })} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" placeholder="06 00 00 00 00" />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Informations Entreprise */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
              <span>Informations sur l'Entreprise</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nom de l'entreprise</label>
                <input {...register("company", { required: true })} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" placeholder="Ex: Google" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nom du recruteur (Optionnel)</label>
                <input {...register("recruiterName")} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" placeholder="Ex: M. Martin" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Adresse de l'entreprise</label>
                <input {...register("companyAddress", { required: true })} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" placeholder="Ex: 8 Avenue des Champs-Élysées, 75008 Paris" />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Informations Poste */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
              <span>Informations sur le Poste</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Intitulé du poste</label>
                <input {...register("targetJob", { required: true })} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" placeholder="Ex: Développeur Fullstack" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Ville du poste</label>
                <input {...register("jobCity", { required: true })} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" placeholder="Ex: Paris" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Type de poste</label>
                <select {...register("contractType")} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all appearance-none">
                  <option value="Emploi (CDI)">Emploi (CDI)</option>
                  <option value="Emploi (CDD)">Emploi (CDD)</option>
                  <option value="Stage">Stage</option>
                  <option value="Alternance">Alternance</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
              <span>Vos motivations spécifiques (Optionnel)</span>
              <Sparkles size={14} className="text-primary" />
            </label>
            <textarea {...register("motivation")} rows={5} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" placeholder="Mentionnez des projets spécifiques ou pourquoi cette entreprise vous attire particulièrement..." />
          </div>

          <button type="submit" disabled={isGenerating} className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center space-x-3 hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 disabled:opacity-50 group">
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={28} />
                <span>Génération de la lettre...</span>
              </>
            ) : (
              <>
                <Sparkles size={28} className="group-hover:scale-110 transition-transform" />
                <span>Générer ma lettre de motivation</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
