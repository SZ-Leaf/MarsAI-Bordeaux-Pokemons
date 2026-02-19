import React from 'react';
import { Star, Heart, Clock, Flag } from 'lucide-react';
import './submissionCard.css';
import { useLanguage } from '../../context/LanguageContext';

const PLAYLIST_BADGE = {
   FAVORITES:   { icon: Heart, cls: "submission-playlist-favorites" },
   WATCH_LATER: { icon: Clock, cls: "submission-playlist-watch-later" },
   REPORT:      { icon: Flag,  cls: "submission-playlist-report" },
};

const SubmissionCard = ({submission, onVideoClick}) => {
   const {language} = useLanguage();

   function formatDuration(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
   }

   const rating = submission.memo_rating;
   const badge = PLAYLIST_BADGE[submission.memo_selection_list];

   return (
      <article className="submission-container-card" key={submission.id}>
         <div className="submission-image-container" onClick={onVideoClick}>
            <img className="submission-image" src={`${import.meta.env.VITE_API_URL}${submission.cover}`} alt={submission.english_title} />
            <p className="submission-duration">{formatDuration(submission.duration_seconds)}</p>
            {rating != null && (
               <div className="submission-rating">
                  <Star size={12} fill="currentColor" />
                  <span>{rating}</span>
               </div>
            )}
            {badge && (
               <div className={`submission-playlist ${badge.cls}`}>
                  <badge.icon size={12} fill="currentColor" />
               </div>
            )}
         </div>
         <div className="submission-content">
            <div className="submission-title mt-2">
               <h2>{(submission.english_title).toUpperCase()}</h2>
               {submission.original_title && <h3>{submission.original_title}</h3>}
            </div>
            <div className="submission-details flex justify-between mt-2">
               <div className='submission-creator'>
                  <p>{language === 'fr' ? 'REALISATEUR' : 'DIRECTOR'}</p>
                  <h5>{submission.creator_firstname}{submission.creator_lastname}</h5>
               </div>
               <div className='submission-country'>
                  <p>{language === 'fr' ? 'PAYS' : 'COUNTRY'}</p>
                  <h5>{(submission.creator_country).toUpperCase()}</h5>
               </div>
            </div>
         </div>
      </article>
   )
};

export default SubmissionCard;