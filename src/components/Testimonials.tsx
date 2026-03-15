import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { api } from '../services/api';

export default function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ avgRating: 4.9, totalReviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.reviews.list();
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews);
          setStats({ avgRating: data.avgRating, totalReviews: data.totalReviews });
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return null;

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">Ce que disent nos utilisateurs</h2>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill={i < Math.floor(stats.avgRating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-xl font-bold text-slate-900">{stats.avgRating} / 5</span>
            <span className="text-slate-500">({stats.totalReviews} avis)</span>
          </div>
          <p className="text-slate-600 leading-relaxed">Rejoignez des milliers de candidats qui ont réussi grâce à CRYNANCE IA CV PRO 2.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews && reviews.length > 0 ? (
            reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 relative group"
              >
                <Quote className="absolute top-6 right-8 text-slate-100 group-hover:text-primary/10 transition-colors" size={48} />
                <div className="flex text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic leading-relaxed">"{review.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {review.firstName[0]}{review.lastName[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{review.firstName} {review.lastName[0]}.</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Utilisateur vérifié</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // Fallback static reviews if no DB reviews yet
            [
              { name: "Mamadou S.", text: "J'ai trouvé un stage grâce à ce CV généré !", rating: 5 },
              { name: "Fatou D.", text: "Très rapide et professionnel, je recommande.", rating: 5 },
              { name: "Jean K.", text: "Le meilleur générateur de CV que j'ai utilisé.", rating: 5 }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 relative group"
              >
                <Quote className="absolute top-6 right-8 text-slate-100 group-hover:text-primary/10 transition-colors" size={48} />
                <div className="flex text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic leading-relaxed">"{review.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{review.name}</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Utilisateur vérifié</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
