import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Mail, MessageCircle, Shield, Lock, Music } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <FileText size={24} />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">CRYNANCE <span className="text-primary">IA CV PRO 2</span></span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              La solution numéro 1 pour créer des CV et lettres de motivation professionnels avec l'intelligence artificielle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6">Navigation</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-slate-500 hover:text-primary transition-colors text-sm">Accueil</Link></li>
              <li><Link to="/create-cv" className="text-slate-500 hover:text-primary transition-colors text-sm">Créer mon CV</Link></li>
              <li><Link to="/premium" className="text-slate-500 hover:text-primary transition-colors text-sm">Tarifs</Link></li>
              <li><Link to="/help" className="text-slate-500 hover:text-primary transition-colors text-sm">Aide & FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6">Légal</h4>
            <ul className="space-y-4">
              <li><Link to="/help" className="text-slate-500 hover:text-primary transition-colors text-sm">Conditions d'utilisation</Link></li>
              <li><Link to="/help" className="text-slate-500 hover:text-primary transition-colors text-sm">Politique de confidentialité</Link></li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6">Suivez-nous</h4>
            <div className="flex space-x-4 mb-6">
              <a 
                href="https://www.tiktok.com/@cvpro13?_r=1&_t=ZN-94aHrZ18k4s" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all"
                title="TikTok"
              >
                <Music size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} CRYNANCE IA CV PRO 2. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1 text-slate-400">
              <Shield size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Sécurisé par SSL</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400">
              <Lock size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Données Protégées</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
