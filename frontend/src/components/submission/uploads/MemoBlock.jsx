import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Star, MessageSquare, Pencil, Trash2, Loader2, Heart, Clock, Flag } from 'lucide-react';
import { saveMemo, deleteMemo } from '../../../services/memo.service';

const PLAYLIST_OPTIONS = [
   {
      key: "FAVORITES",
      icon: Heart,
      labelFr: "Favoris",
      labelEn: "Favorites",
      activeClass: "border-green-500 bg-green-500/20 text-green-300",
      hoverClass: "hover:border-green-500/50 hover:bg-green-500/10",
   },
   {
      key: "WATCH_LATER",
      icon: Clock,
      labelFr: "À voir plus tard",
      labelEn: "Watch later",
      activeClass: "border-blue-500 bg-blue-500/20 text-blue-300",
      hoverClass: "hover:border-blue-500/50 hover:bg-blue-500/10",
   },
   {
      key: "REPORT",
      icon: Flag,
      labelFr: "Signaler",
      labelEn: "Report",
      activeClass: "border-red-500 bg-red-500/20 text-red-300",
      hoverClass: "hover:border-red-500/50 hover:bg-red-500/10",
   },
];

const MemoBlock = ({ video, onMemoUpdate }) => {
   const { language } = useLanguage();
   const hasMemo = video?.memo_rating != null || video?.memo_comment || video?.memo_selection_list;

   const [isEditing, setIsEditing] = useState(false);
   const [ratingValue, setRatingValue] = useState(video?.memo_rating ?? 0);
   const [hoverRating, setHoverRating] = useState(0);
   const [comment, setComment] = useState(video?.memo_comment ?? "");
   const [playlist, setPlaylist] = useState(video?.memo_selection_list ?? null);
   const [saving, setSaving] = useState(false);
   const [deleting, setDeleting] = useState(false);
   const [error, setError] = useState(null);

   const enterEditMode = () => {
      setRatingValue(video?.memo_rating ?? 0);
      setComment(video?.memo_comment ?? "");
      setPlaylist(video?.memo_selection_list ?? null);
      setIsEditing(true);
      setError(null);
   };

   const cancelEdit = () => {
      setIsEditing(false);
      setError(null);
   };

   const handleSave = async () => {
      setSaving(true);
      setError(null);
      try {
         const body = {};

         if (ratingValue > 0) body.rating = ratingValue;
         else if (hasMemo && ratingValue === 0) body.rating = null;

         const trimmed = comment.trim();
         if (trimmed) body.comment = trimmed;
         else if (hasMemo) body.comment = null;

         if (playlist) body.playlist = playlist;
         else if (hasMemo && video?.memo_selection_list) body.playlist = null;

         await saveMemo(video.id, body);
         setIsEditing(false);
         onMemoUpdate?.();
      } catch (err) {
         setError(language === "fr" ? "Erreur lors de l'enregistrement" : "Failed to save");
      } finally {
         setSaving(false);
      }
   };

   const handleDelete = async () => {
      setDeleting(true);
      setError(null);
      try {
         await deleteMemo(video.id);
         setRatingValue(0);
         setComment("");
         setPlaylist(null);
         setIsEditing(false);
         onMemoUpdate?.();
      } catch (err) {
         setError(language === "fr" ? "Erreur lors de la suppression" : "Failed to delete");
      } finally {
         setDeleting(false);
      }
   };

   const canSave = ratingValue > 0 || comment.trim() !== "" || playlist !== null;

   const getPlaylistLabel = (key) => {
      const opt = PLAYLIST_OPTIONS.find((p) => p.key === key);
      if (!opt) return key;
      return language === "fr" ? opt.labelFr : opt.labelEn;
   };

   const StarRow = ({ count = 10, size = 22, interactive = false, value = 0 }) => (
      <div className="flex items-center gap-0.5">
         {Array.from({ length: count }, (_, i) => i + 1).map((star) => {
            const filled = star <= (interactive ? (hoverRating || ratingValue) : value);
            const starEl = (
               <Star
                  key={star}
                  size={size}
                  className={filled ? "text-yellow-400" : "text-gray-700"}
                  fill={filled ? "currentColor" : "none"}
               />
            );

            if (!interactive) return starEl;

            return (
               <button
                  key={star}
                  type="button"
                  onClick={() => setRatingValue(star === ratingValue ? 0 : star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="bg-transparent border-none cursor-pointer p-0.5 transition-transform hover:scale-110"
               >
                  {starEl}
               </button>
            );
         })}
      </div>
   );

   const PlaylistButtons = () => (
      <div className="space-y-2">
         <label className="text-gray-500 uppercase text-[10px] font-bold tracking-wide">
            Playlist
         </label>
         <div className="flex flex-wrap gap-2">
            {PLAYLIST_OPTIONS.map((opt) => {
               const Icon = opt.icon;
               const isActive = playlist === opt.key;
               return (
                  <button
                     key={opt.key}
                     type="button"
                     onClick={() => setPlaylist(isActive ? null : opt.key)}
                     className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all cursor-pointer bg-transparent ${
                        isActive
                           ? opt.activeClass
                           : `border-gray-700 text-gray-400 ${opt.hoverClass}`
                     }`}
                  >
                     <Icon size={14} fill={isActive ? "currentColor" : "none"} />
                     {language === "fr" ? opt.labelFr : opt.labelEn}
                  </button>
               );
            })}
         </div>
      </div>
   );

   const showForm = isEditing || !hasMemo;

   return (
      <div className="space-y-4">
         <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wide border-b border-gray-800 pb-2">
            {language === "fr" ? "Évaluation" : "Rating"}
         </h3>

         {error && (
            <div className="rounded-xl border border-red-800 bg-red-950/40 p-3 text-red-200 text-sm">
               {error}
            </div>
         )}

         {!showForm ? (
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 space-y-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     {video?.memo_rating != null && (
                        <>
                           <StarRow value={video.memo_rating} />
                           <span className="text-2xl font-bold text-yellow-400">{video.memo_rating}/10</span>
                        </>
                     )}
                  </div>
                  <div className="flex items-center gap-2">
                     <button
                        type="button"
                        onClick={enterEditMode}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                     >
                        <Pencil size={16} />
                     </button>
                     <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none disabled:opacity-40"
                     >
                        {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                     </button>
                  </div>
               </div>

               {video?.memo_comment && (
                  <div className="flex items-start gap-3">
                     <MessageSquare size={16} className="text-gray-500 mt-0.5 shrink-0" />
                     <div>
                        <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wide">
                           {language === "fr" ? "Commentaire" : "Comment"}
                        </p>
                        <p className="text-gray-300 mt-1 leading-relaxed">{video.memo_comment}</p>
                     </div>
                  </div>
               )}

               {video?.memo_selection_list && (
                  <div className="flex items-center gap-2">
                     {(() => {
                        const opt = PLAYLIST_OPTIONS.find((p) => p.key === video.memo_selection_list);
                        if (!opt) return null;
                        const Icon = opt.icon;
                        return (
                           <span className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium ${opt.activeClass}`}>
                              <Icon size={12} fill="currentColor" />
                              {getPlaylistLabel(video.memo_selection_list)}
                           </span>
                        );
                     })()}
                  </div>
               )}
            </div>
         ) : (
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 space-y-5">
               {!hasMemo && (
                  <p className="text-gray-400 text-sm">
                     {language === "fr"
                        ? "Ce film n'a pas encore été évalué."
                        : "This film has not been rated yet."}
                  </p>
               )}

               <div className="space-y-2">
                  <label className="text-gray-500 uppercase text-[10px] font-bold tracking-wide">
                     {language === "fr" ? "Note" : "Rating"}
                  </label>
                  <div className="flex items-center gap-1">
                     <StarRow size={28} interactive />
                     {ratingValue > 0 && (
                        <span className="text-yellow-400 font-bold ml-2">{ratingValue}/10</span>
                     )}
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-gray-500 uppercase text-[10px] font-bold tracking-wide">
                     {language === "fr" ? "Commentaire" : "Comment"}
                  </label>
                  <textarea
                     value={comment}
                     onChange={(e) => setComment(e.target.value)}
                     rows={3}
                     placeholder={
                        language === "fr"
                           ? "Ajouter un commentaire..."
                           : "Add a comment..."
                     }
                     className="w-full p-3 rounded-xl border border-gray-800 bg-[#0a0a0a] text-white placeholder-gray-600 focus:border-yellow-500/50 outline-none transition-colors resize-none"
                  />
               </div>

               <PlaylistButtons />

               <div className="flex items-center gap-3">
                  <button
                     type="button"
                     onClick={handleSave}
                     disabled={!canSave || saving}
                     className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition-colors cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                     {saving && <Loader2 size={14} className="animate-spin" />}
                     {language === "fr"
                        ? (hasMemo ? "Mettre à jour" : "Enregistrer")
                        : (hasMemo ? "Update" : "Save")}
                  </button>
                  {isEditing && (
                     <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-5 py-2.5 rounded-xl bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 font-bold text-sm transition-colors cursor-pointer"
                     >
                        {language === "fr" ? "Annuler" : "Cancel"}
                     </button>
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

export default MemoBlock;
