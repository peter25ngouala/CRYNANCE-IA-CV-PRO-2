import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Download, FileDown, FileText, ChevronLeft, Loader2, Sparkles, CheckCircle2, Save, Edit3, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

export default function CoverLetterPreview() {
  const [letter, setLetter] = useState<{ id?: string, data: any, content: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [showPayModal, setShowPayModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [currentUser, setCurrentUser] = useState<any>(user);
  const navigate = useNavigate();
  const letterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('/api/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setCurrentUser(data);
            localStorage.setItem('user', JSON.stringify(data));
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchProfile();
  }, []);

  const getSubscriptionStatus = () => {
    if (!currentUser) return { active: false, expired: false };
    if (currentUser.role === 'admin' || currentUser.isPremium) return { active: true, expired: false };
    
    const modern = currentUser.modernExpiresAt ? new Date(currentUser.modernExpiresAt) : null;
    const classic = currentUser.classicExpiresAt ? new Date(currentUser.classicExpiresAt) : null;
    const creative = currentUser.creativeExpiresAt ? new Date(currentUser.creativeExpiresAt) : null;
    
    const now = new Date();
    const active = (modern && modern > now) || (classic && classic > now) || (creative && creative > now);
    const hasAnyExpiry = modern || classic || creative;
    
    return { active, expired: !!(hasAnyExpiry && !active) };
  };

  const isSubscribed = () => getSubscriptionStatus().active;

  useEffect(() => {
    const data = localStorage.getItem('currentLetter');
    if (data) {
      const parsed = JSON.parse(data);
      setLetter(parsed);
      setEditedContent(parsed.content);
    } else {
      navigate('/cover-letter');
    }
  }, [navigate]);

  const handleSave = async () => {
    if (!letter) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Veuillez vous connecter pour sauvegarder votre lettre.");
      navigate('/login');
      return;
    }

    setIsSaving(true);
    try {
      const letterId = letter.id || Math.random().toString(36).substr(2, 9);
      const response = await fetch('/api/cover-letters', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: letterId,
          data: letter.data,
          content: editedContent
        })
      });
      if (response.ok) {
        setLetter({ ...letter, id: letterId, content: editedContent });
        localStorage.setItem('currentLetter', JSON.stringify({ ...letter, id: letterId, content: editedContent }));
        alert("Lettre sauvegardée avec succès !");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const exportPDF = async () => {
    if (!letter) return;
    if (!isSubscribed()) {
      setShowPayModal(true);
      return;
    }
    setIsExporting(true);
    try {
      const pdf = new jsPDF('p', 'pt', 'a4');
      const margin = 60;
      const width = pdf.internal.pageSize.getWidth() - margin * 2;
      
      pdf.setFontSize(11);
      const splitText = pdf.splitTextToSize(editedContent, width);
      pdf.text(splitText, margin, margin + 20);
      
      pdf.save(`Lettre_Motivation_${letter.data.lastName}.pdf`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportWord = async () => {
    if (!letter) return;
    if (!isSubscribed()) {
      setShowPayModal(true);
      return;
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: editedContent.split('\n').map(line => 
          new Paragraph({
            children: [new TextRun(line)],
            spacing: { after: 200 }
          })
        )
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Lettre_Motivation_${letter.data.lastName}.docx`);
  };

  if (!letter) return null;

  return (
    <div className="pt-24 pb-16 px-4 bg-slate-50 min-h-screen">
      {/* Subscription Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl text-center"
          >
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap size={40} fill="currentColor" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              {getSubscriptionStatus().expired ? "⌛ Abonnement Expiré" : "🔒 Accès Restreint"}
            </h2>
            <p className="text-slate-600 mb-8">
              {getSubscriptionStatus().expired 
                ? "Votre abonnement de 24 heures a expiré. Veuillez renouveler pour continuer à télécharger." 
                : "Vous devez payer pour télécharger votre lettre de motivation. L'abonnement débloque les exports PDF et Word pendant 24 heures."}
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/premium')}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20"
              >
                {getSubscriptionStatus().expired ? "Renouveler avec Wave" : "Payer avec Wave"}
              </button>
              <button 
                onClick={async () => {
                  const token = localStorage.getItem('token');
                  if (token) {
                    const res = await fetch('/api/profile', {
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                      const data = await res.json();
                      setCurrentUser(data);
                      localStorage.setItem('user', JSON.stringify(data));
                      if (isSubscribed()) {
                        setShowPayModal(false);
                      } else {
                        alert("Aucun abonnement actif trouvé.");
                      }
                    }
                  }
                }}
                className="w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                J'ai payé (Actualiser)
              </button>
              <button 
                onClick={() => setShowPayModal(false)}
                className="w-full py-2 text-slate-400 text-sm font-medium hover:text-slate-600"
              >
                Plus tard
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate('/cover-letter')} className="flex items-center space-x-2 text-slate-600 font-bold hover:text-primary transition-colors">
            <ChevronLeft size={20} /> <span>Modifier Formulaire</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all ${isEditing ? 'bg-primary text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
            >
              <Edit3 size={18} />
              <span>{isEditing ? "Voir Rendu" : "Éditer Texte"}</span>
            </button>

            <button onClick={handleSave} disabled={isSaving} className="flex items-center space-x-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition-all">
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>Sauvegarder</span>
            </button>

            <div className="relative group">
              <button className="bg-primary text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                <Download size={20} />
                <span>Télécharger</span>
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button onClick={exportPDF} disabled={isExporting} className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-left text-sm font-medium border-b border-slate-50">
                  <FileDown size={18} className="text-red-500" />
                  <span>Format PDF</span>
                </button>
                <button onClick={exportWord} className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-left text-sm font-medium">
                  <FileText size={18} className="text-blue-500" />
                  <span>Format Word</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-100 text-emerald-700 p-4 rounded-xl mb-8 flex items-center space-x-3 border border-emerald-200">
          <CheckCircle2 size={20} />
          <span className="font-bold">Votre lettre de motivation est prête !</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-2xl rounded-sm p-12 md:p-20 min-h-[1000px] font-serif text-slate-800"
          ref={letterRef}
        >
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-[800px] p-4 border-2 border-primary/20 rounded-xl outline-none focus:border-primary transition-all font-serif text-lg leading-relaxed"
            />
          ) : (
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown>{editedContent}</ReactMarkdown>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
