import React, { useState } from 'react';
import { Check, Zap, ShieldCheck, Star, ArrowRight, X, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PLANS = [
  {
    id: 'flash_ats',
    name: 'FLASH ATS',
    price: '500',
    validity: '24h',
    description: '2 Optimisations ATS + 3 Lettres de Motivation + 1 Téléchargement CV (Validité 24h).',
    features: [
      '2 Optimisations ATS',
      '3 Lettres de Motivation',
      '1 Téléchargement CV inclus',
      'Styles Élégant, Pro Bleu, Épuré',
      'Validité 24h'
    ],
    color: 'bg-rose-50 text-rose-600',
    buttonColor: 'bg-rose-500 hover:bg-rose-600',
    popular: false
  },
  {
    id: 'decouverte',
    name: 'Plan DÉCOUVERTE',
    price: '1 500',
    validity: '48h',
    description: '1 CV optimisé par l\'IA + 1 Lettre de motivation + Optimisation ATS Incluse (Validité 48h).',
    features: [
      '1 CV optimisé par l\'IA',
      '1 Lettre de motivation',
      'Optimisation ATS Incluse',
      'Validité 48h'
    ],
    color: 'bg-blue-50 text-blue-600',
    buttonColor: 'bg-[#1dcad3] hover:bg-[#19b1b9]', // Wave-inspired color
    popular: false
  },
  {
    id: 'pro',
    name: 'Plan PRO',
    price: '3 500',
    validity: '10 JOURS',
    description: '5 CV + Lettres illimitées + Optimisation ATS Incluse (Validité 10 JOURS).',
    features: [
      '5 CV optimisés',
      'Lettres illimitées',
      'Optimisation ATS Incluse',
      'Validité 10 JOURS'
    ],
    color: 'bg-primary/10 text-primary',
    buttonColor: 'bg-primary hover:bg-primary-dark',
    popular: true
  },
  {
    id: 'elite',
    name: 'Plan ÉLITE',
    price: '5 500',
    validity: '1 mois',
    description: 'Créations illimitées + Optimisation ATS Incluse + Accès prioritaire + Support VIP (Validité 1 mois).',
    features: [
      'Créations illimitées',
      'Optimisation ATS Incluse',
      'Accès prioritaire aux modèles',
      'Support VIP dédié',
      'Validité 1 mois'
    ],
    color: 'bg-amber-50 text-amber-600',
    buttonColor: 'bg-slate-900 hover:bg-slate-800',
    popular: false
  }
];

interface PricingSectionProps {
  showTitle?: boolean;
}

export default function PricingSection({ showTitle = true }: PricingSectionProps) {
  const { user, firebaseUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [discount, setDiscount] = useState(0);

  const handlePayment = async (plan: typeof PLANS[0]) => {
    if (!user || !firebaseUser) {
      alert('Veuillez vous connecter pour souscrire à un plan.');
      return;
    }

    setLoading(true);
    try {
      // 1. Open Wave payment link in new tab
      window.open('https://pay.wave.com/m/M_sn_wXlszdyVZOIV/c/sn/', '_blank');

      // 2. Show Modal
      setShowModal(true);

      // 3. Send request to API
      const response = await fetch('/api/payment/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await firebaseUser.getIdToken()}`
        },
        body: JSON.stringify({
          type: plan.id,
          amount: Math.floor(parseInt(plan.price.replace(/\s/g, '')) * (1 - discount / 100)),
          userId: user.uid,
          userEmail: user.email,
          promoCode: promoCode || undefined
        })
      });

      if (!response.ok) {
        console.error('Failed to register payment request');
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setLoading(true);
    try {
      const response = await api.promoCodes.validate(promoCode);
      const data = await response.json();
      
      if (data.valid) {
        setPromoStatus({ type: 'success', message: `Code promo appliqué ! Remise de ${data.discount}%` });
        setDiscount(data.discount);
      } else {
        setPromoStatus({ type: 'error', message: 'Code promo invalide ou expiré.' });
        setDiscount(0);
      }
    } catch (error) {
      setPromoStatus({ type: 'error', message: 'Erreur lors de la validation du code.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6"
            >
              <Zap size={14} fill="currentColor" />
              <span>Tarifs Transparents</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
            >
              Choisissez le plan qui vous <span className="text-primary">propulse</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600"
            >
              Des solutions adaptées à chaque étape de votre recherche d'emploi.
            </motion.p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-[2.5rem] p-10 border-2 transition-all relative flex flex-col ${
                plan.popular ? 'border-primary shadow-2xl shadow-primary/10 scale-105 z-10' : 'border-slate-100 shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                  Le plus populaire
                </div>
              )}

              <div className="mb-8">
                <div className={`w-14 h-14 ${plan.color} rounded-2xl flex items-center justify-center mb-6`}>
                  {plan.id === 'decouverte' && <Zap size={28} />}
                  {plan.id === 'pro' && <ShieldCheck size={28} />}
                  {plan.id === 'elite' && <Star size={28} />}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-black text-slate-900">
                    {discount > 0 
                      ? Math.floor(parseInt(plan.price.replace(/\s/g, '')) * (1 - discount / 100)).toLocaleString()
                      : plan.price
                    }
                  </span>
                  <span className="text-slate-500 font-bold ml-2 uppercase tracking-widest text-sm">FCFA</span>
                  {discount > 0 && (
                    <span className="ml-3 text-slate-400 line-through text-lg font-bold">{plan.price}</span>
                  )}
                </div>
                <p className="text-primary font-bold text-xs uppercase tracking-widest">Validité: {plan.validity}</p>
              </div>

              <p className="text-slate-600 mb-8 text-sm leading-relaxed">
                {plan.description}
              </p>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center space-x-3 text-slate-600 font-medium text-sm">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={12} />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePayment(plan)}
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-black text-center transition-all flex items-center justify-center space-x-2 text-white shadow-xl ${plan.buttonColor} disabled:opacity-50`}
              >
                <span>{loading ? 'Traitement...' : 'S\'abonner avec Wave'}</span>
                {!loading && <ArrowRight size={20} />}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Promo Code Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Ticket size={20} />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Code Promo</h3>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="ENTREZ VOTRE CODE"
              className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-primary focus:ring-0 transition-all uppercase"
            />
            <button
              onClick={handleApplyPromo}
              disabled={loading || !promoCode}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              Appliquer
            </button>
          </div>
          
          {promoStatus.type && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mt-4 text-sm font-bold ${promoStatus.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}
            >
              {promoStatus.message}
            </motion.p>
          )}
        </motion.div>

        {/* FAQ Preview or Trust Badges */}
        <div className="mt-24 text-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">Paiement 100% Sécurisé via Wave Business</p>
          <div className="flex justify-center items-center space-x-8 opacity-50 grayscale">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Wave_Logo.svg/1200px-Wave_Logo.svg.png" alt="Wave" className="h-8" />
          </div>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full relative z-10 shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={24} />
              </button>

              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-100">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Paiement Initié</h3>
                <p className="text-slate-600 leading-relaxed mb-8 font-medium">
                  Une fois votre paiement effectué sur Wave, notre équipe activera votre compte sous 5 minutes. Vous recevrez une notification par email.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                >
                  J'ai compris
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
