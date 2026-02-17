import React from "react";
import { motion } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const VideoDetails = ({ video, onClose, onNext, onPrev, hasNext, hasPrev }) => {
   const { language } = useLanguage();
   const API_URL = import.meta.env.VITE_API_URL;

   const videoSrc = video?.video_url?.startsWith("http")
      ? video.video_url
      : `${API_URL}${video?.video_url}`;

   function formatDuration(seconds) {
      if (!seconds) return "";
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
   }

   return (
      <motion.div
         className="absolute inset-0 z-40 bg-black/95 overflow-y-auto"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
      >
         {/* Top bar with close button */}
         <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-sm">
            <h2 className="text-white text-lg font-semibold truncate">
               {video?.english_title}
            </h2>
            <button
               onClick={onClose}
               className="text-white hover:text-gray-300 flex items-center gap-2 transition-colors"
            >
               {language === "fr" ? "Fermer" : "Close"}
               <X size={20} />
            </button>
         </div>

         {/* Video player area with prev/next nav */}
         <div className="relative w-full flex items-center justify-center bg-black">
            {/* Previous button */}
            {hasPrev && (
               <button
                  onClick={onPrev}
                  className="absolute left-2 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                  title={language === "fr" ? "Précédent" : "Previous"}
               >
                  <ChevronLeft size={28} />
               </button>
            )}

            <div className="w-full max-w-5xl mx-auto aspect-video">
               <video
                  key={video?.id}
                  src={videoSrc}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
               />
            </div>

            {/* Next button */}
            {hasNext && (
               <button
                  onClick={onNext}
                  className="absolute right-2 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                  title={language === "fr" ? "Suivant" : "Next"}
               >
                  <ChevronRight size={28} />
               </button>
            )}
         </div>

         {/* Video details section */}
         <div className="max-w-5xl mx-auto px-6 py-8 text-white space-y-6">
            <div>
               <h1 className="text-3xl font-bold">{video?.english_title?.toUpperCase()}</h1>
               {video?.original_title && (
                  <p className="text-gray-400 text-lg mt-1">{video.original_title}</p>
               )}
            </div>

            <div className="flex flex-wrap gap-8 text-sm">
               {(video?.creator_firstname || video?.creator_lastname) && (
                  <div>
                     <p className="text-gray-500 uppercase text-xs font-bold tracking-wide">
                        {language === "fr" ? "Réalisateur" : "Director"}
                     </p>
                     <p className="mt-1">
                        {video.creator_firstname} {video.creator_lastname}
                     </p>
                  </div>
               )}
               {video?.creator_country && (
                  <div>
                     <p className="text-gray-500 uppercase text-xs font-bold tracking-wide">
                        {language === "fr" ? "Pays" : "Country"}
                     </p>
                     <p className="mt-1">{video.creator_country.toUpperCase()}</p>
                  </div>
               )}
               {video?.duration_seconds > 0 && (
                  <div>
                     <p className="text-gray-500 uppercase text-xs font-bold tracking-wide">
                        {language === "fr" ? "Durée" : "Duration"}
                     </p>
                     <p className="mt-1">{formatDuration(video.duration_seconds)}</p>
                  </div>
               )}
            </div>

            {video?.english_synopsis && (
               <div>
                  <p className="text-gray-500 uppercase text-xs font-bold tracking-wide mb-2">
                     Synopsis
                  </p>
                  <p className="text-gray-300 leading-relaxed">{video.english_synopsis}</p>
               </div>
            )}
         </div>
      </motion.div>
   );
};

export default VideoDetails;
