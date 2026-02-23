import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ExternalLink } from 'lucide-react';

export default function Contact() {
  const whatsappNumber = "+221789619088";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace('+', '')}`;

  return (
    <div className="pt-32 pb-20 px-4 bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 text-center"
        >
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-100">
            <MessageCircle size={48} />
          </div>
          
          <h1 className="text-4xl font-black text-slate-900 mb-4">
            Besoin d'aide ?
          </h1>
          <p className="text-slate-500 text-lg mb-12">
            Contactez notre support directement sur WhatsApp pour une réponse rapide.
          </p>

          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200 group"
          >
            <MessageCircle size={28} />
            <span>WhatsApp: +221 789619088</span>
            <ExternalLink size={20} className="opacity-50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>

          <div className="mt-12 pt-12 border-t border-slate-50">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">
              Support Client Crynance
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
