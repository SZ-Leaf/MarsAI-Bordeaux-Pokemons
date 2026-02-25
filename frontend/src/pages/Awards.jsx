import React, { useEffect, useMemo, useState } from 'react';
import { Award, Loader2, Info } from 'lucide-react';
import { getAwardsService } from '../services/award.service';
import '../styles/main.css';

const coverUrl = (cover) =>
  cover ? `/${String(cover).replace(/^\/+/, '')}` : null;

const AwardPublicCard = ({ award }) => {
   const src = coverUrl(award?.cover);

   return (
      <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden hover:border-white/20 transition-colors">
         <div className="relative aspect-video bg-zinc-900">
         {src ? (
            <img
               src={src}
               alt={award?.title || 'award'}
               className="absolute inset-0 h-full w-full object-cover"
               loading="lazy"
            />
         ) : (
            <div className="absolute inset-0 flex items-center justify-center">
               <Award size={40} className="text-zinc-700" />
            </div>
         )}
         <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            #{award?.award_rank ?? '—'}
         </div>
         </div>

         <div className="p-5">
         <h3 className="text-base font-bold text-white truncate">
            {award?.title || '—'}
         </h3>
         {award?.description && (
            <p className="mt-2 text-sm text-gray-400 line-clamp-3">
               {award.description}
            </p>
         )}
         {award?.submission_title && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
               <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Film primé</p>
               <p className="text-sm font-medium text-white">{award.submission_title}</p>
            </div>
         )}
         </div>
      </div>
   );
};

const Awards = () => {
   const [awards, setAwards] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchAwards = async () => {
         try {
         const res = await getAwardsService();
         const data = res?.data ?? res;
         const list = Array.isArray(data) ? data : (data?.awards ?? []);
         setAwards(list);
         } catch (err) {
         setError('Impossible de charger le palmarès.');
         } finally {
         setLoading(false);
         }
      };
      fetchAwards();
   }, []);

   const sorted = useMemo(
      () => [...awards].sort((a, b) => (a?.award_rank ?? 9999) - (b?.award_rank ?? 9999)),
      [awards]
   );

   return (
      <div className="home-container min-h-screen pt-24 pb-20 px-4 md:px-8">
         {/* Header */}
         <div className="max-w-7xl mx-auto mb-16 text-center animate-fade-in">
         <div className="hero-badge mb-6 inline-flex mx-auto">
            <Award size={14} className="mr-2" />
            PALMARÈS OFFICIEL 2026
         </div>
         <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tighter">
            LES PRIX MARS<span className="gradient-text">AI</span>
         </h1>
         <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Découvrez les films récompensés lors du festival MarsAI Bordeaux.
         </p>
         </div>

         {/* Content */}
         <div className="max-w-7xl mx-auto">
         {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
               <Loader2 className="animate-spin text-gray-400" size={40} />
               <p className="text-gray-500 text-sm">Chargement du palmarès...</p>
            </div>
         ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
               <Info size={32} className="text-red-400" />
               <p className="text-red-300 text-sm">{error}</p>
            </div>
         ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
               <Award size={40} className="text-zinc-700" />
               <p className="text-gray-500 text-sm">Le palmarès n'a pas encore été dévoilé.</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {sorted.map((award) => (
               <AwardPublicCard key={award.id} award={award} />
               ))}
            </div>
         )}
         </div>
      </div>
   );
};

export default Awards;
