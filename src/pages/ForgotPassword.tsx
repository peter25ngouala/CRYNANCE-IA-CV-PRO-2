import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [devToken, setDevToken] = useState(''); // Only for dev testing

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await api.auth.forgotPassword(email);
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        if (data._devToken) {
          setDevToken(data._devToken);
          console.log("DEV TOKEN:", data._devToken);
        }
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-black text-slate-900">
          Mot de passe oublié
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Entrez votre adresse email pour recevoir un lien de réinitialisation.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Email envoyé</h3>
              <p className="text-sm text-slate-500 mb-6">
                Si un compte existe avec cette adresse, vous recevrez un email contenant un lien pour réinitialiser votre mot de passe.
              </p>
              
              {/* DEV ONLY: Show link to reset password directly */}
              {devToken && (
                <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200 text-left">
                  <p className="text-xs font-bold text-amber-800 mb-2 uppercase tracking-wider">Mode Développement Uniquement</p>
                  <p className="text-sm text-amber-900 mb-2">Lien généré (l'email n'est pas réellement envoyé) :</p>
                  <Link to={`/reset-password?token=${devToken}`} className="text-primary font-bold hover:underline break-all text-xs">
                    Cliquez ici pour réinitialiser
                  </Link>
                </div>
              )}

              <Link 
                to="/login"
                className="text-primary font-bold hover:text-primary-dark transition-colors"
              >
                Retour à la connexion
              </Link>
            </motion.div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center">
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                  Adresse email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="vous@exemple.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Envoyer le lien
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
              
              <div className="text-center">
                <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">
                  Annuler et retourner à la connexion
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
