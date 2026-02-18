import React from "react";
import { motion } from "motion/react";
import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";
import { useLanguage } from "../../context/LanguageContext";
import './styles/videoDetails.css';

import {
   X, ChevronLeft, ChevronRight,
   User, Mail, Phone, MapPin, Globe,
   Film, Clock, Calendar, Clapperboard, Cpu, Captions, Link, Sparkles
} from "lucide-react";

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

   function formatDate(dateStr) {
      if (!dateStr) return "";
      return new Date(dateStr).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
         year: "numeric",
         month: "long",
         day: "numeric",
      });
   }

   const DetailItem = ({ icon: Icon, label, value }) => {
      if (!value) return null;
      return (
         <div className="flex items-start gap-3">
            <Icon size={16} className="text-gray-500 mt-0.5 shrink-0" />
            <div>
               <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wide">{label}</p>
               <p className="text-white mt-0.5">{value}</p>
            </div>
         </div>
      );
   };

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
      >

         {/* Video player */}
         <div className="w-9/10 mx-auto" key={video?.id}>
            <div className="video-container relative aspect-video rounded-lg overflow-hidden">
               <Plyr
                  source={{
                     type: "video",
                     sources: [{ src: videoSrc, type: "video/mp4" }],
                  }}
                  options={{
                     autoplay: true,
                     controls: [
                        "play-large",
                        "play",
                        "progress",
                        "current-time",
                        "duration",
                        "mute",
                        "volume",
                        "settings",
                        "pip",
                        "fullscreen",
                     ],
                     settings: ["speed"],
                  }}
               />
               <button
                  onClick={onClose}
                  className="video-close-btn absolute top-3 right-3 z-50 text-white hover:text-gray-300 flex items-center gap-2 bg-black/50 rounded-lg px-3 py-1.5 backdrop-blur-sm cursor-pointer"
               >
                  {language === "fr" ? "Fermer" : "Close"}
                  <X size={20} />
               </button>
            </div>

            {/* Prev / Next navigation */}
            <div className="flex items-center justify-between mt-4">
               <button
                  onClick={onPrev}
                  disabled={!hasPrev}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                     hasPrev
                        ? "text-white hover:bg-white/10 cursor-pointer"
                        : "text-gray-600 cursor-not-allowed"
                  }`}
               >
                  <ChevronLeft size={18} />
                  {language === "fr" ? "Précédent" : "Previous"}
               </button>
               <button
                  onClick={onNext}
                  disabled={!hasNext}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                     hasNext
                        ? "text-white hover:bg-white/10 cursor-pointer"
                        : "text-gray-600 cursor-not-allowed"
                  }`}
               >
                  {language === "fr" ? "Suivant" : "Next"}
                  <ChevronRight size={18} />
               </button>
            </div>
         </div>

         {/* Video details section */}
         <div className="w-9/10 mx-auto py-8 text-white space-y-8">

            {/* Title */}
            <div>
               <h1 className="text-3xl font-bold">{video?.english_title?.toUpperCase()}</h1>
               {video?.original_title && (
                  <p className="text-gray-400 text-lg mt-1">{video.original_title}</p>
               )}
            </div>

            {/* Synopsis */}
            {(video?.english_synopsis || video?.original_synopsis) && (
               <div className="space-y-3">
                  <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wide">Synopsis</h3>
                  {video?.english_synopsis && (
                     <p className="text-gray-300 leading-relaxed">{video.english_synopsis}</p>
                  )}
                  {video?.original_synopsis && video.original_synopsis !== video.english_synopsis && (
                     <p className="text-gray-400 leading-relaxed italic">{video.original_synopsis}</p>
                  )}
               </div>
            )}

            {/* Film details */}
            <div className="space-y-4">
               <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wide border-b border-gray-800 pb-2">
                  {language === "fr" ? "Détails du film" : "Film Details"}
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
                  <DetailItem
                     icon={Film}
                     label={language === "fr" ? "Classification" : "Classification"}
                     value={video?.classification}
                  />
                  <DetailItem
                     icon={Clock}
                     label={language === "fr" ? "Durée" : "Duration"}
                     value={video?.duration_seconds > 0 ? formatDuration(video.duration_seconds) : null}
                  />
                  <DetailItem
                     icon={Globe}
                     label={language === "fr" ? "Langue" : "Language"}
                     value={video?.language?.toUpperCase()}
                  />
                  <DetailItem
                     icon={Cpu}
                     label={language === "fr" ? "Outils" : "Tech Stack"}
                     value={video?.tech_stack}
                  />
                  <DetailItem
                     icon={Sparkles}
                     label={language === "fr" ? "Méthode créative" : "Creative Method"}
                     value={video?.creative_method}
                  />
                  <DetailItem
                     icon={Captions}
                     label={language === "fr" ? "Sous-titres" : "Subtitles"}
                     value={video?.subtitles}
                  />
                  <DetailItem
                     icon={Calendar}
                     label={language === "fr" ? "Soumis le" : "Submitted"}
                     value={formatDate(video?.created_at)}
                  />
                  <DetailItem
                     icon={Link}
                     label="YouTube"
                     value={video?.youtube_URL}
                  />
               </div>
            </div>

            {/* Creator info */}
            <div className="space-y-4">
               <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wide border-b border-gray-800 pb-2">
                  {language === "fr" ? "Réalisateur" : "Director"}
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
                  <DetailItem
                     icon={User}
                     label={language === "fr" ? "Nom" : "Name"}
                     value={
                        (video?.creator_firstname || video?.creator_lastname)
                           ? `${video.creator_firstname ?? ""} ${video.creator_lastname ?? ""}`.trim()
                           : null
                     }
                  />
                  <DetailItem
                     icon={User}
                     label={language === "fr" ? "Genre" : "Gender"}
                     value={video?.creator_gender ? video.creator_gender.charAt(0).toUpperCase() + video.creator_gender.slice(1) : null}
                  />
                  <DetailItem
                     icon={Mail}
                     label="Email"
                     value={video?.creator_email}
                  />
                  <DetailItem
                     icon={Phone}
                     label={language === "fr" ? "Mobile" : "Mobile"}
                     value={video?.creator_mobile}
                  />
                  <DetailItem
                     icon={Phone}
                     label={language === "fr" ? "Téléphone" : "Phone"}
                     value={video?.creator_phone}
                  />
                  <DetailItem
                     icon={MapPin}
                     label={language === "fr" ? "Adresse" : "Address"}
                     value={video?.creator_address}
                  />
                  <DetailItem
                     icon={Globe}
                     label={language === "fr" ? "Pays" : "Country"}
                     value={video?.creator_country?.toUpperCase()}
                  />
                  <DetailItem
                     icon={Clapperboard}
                     label={language === "fr" ? "Source" : "Referral"}
                     value={video?.referral_source}
                  />
               </div>
            </div>
         </div>
      </motion.div>
   );
};

export default VideoDetails;
