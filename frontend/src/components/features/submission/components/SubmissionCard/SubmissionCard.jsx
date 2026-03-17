import React from 'react';
import { Star } from 'lucide-react';
import '../../../../../styles/main.css';
import { useLanguage } from '../../../../../context/LanguageContext';

const SubmissionCard = ({submission, onVideoClick,showReportCount = false}) => {
   const {language} = useLanguage();

   const API_URL = import.meta.env.VITE_API_URL;

   function formatDuration(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
   }

   const rating = submission.memo_rating;
   const reportCount = submission.report_count || 0;
   const getReportLabel = (count, language) => {
      if (language === "fr") {
         return count > 1 ? "Signalements" : "Signalement";
      }
      return count > 1 ? "Reports" : "Report";
   };

   return (
      <article className="submission-container-card" key={submission.id}>
         <div className="submission-image-container" onClick={onVideoClick}>
            <img
               className="submission-image"
               src={
                  submission.cover?.startsWith('http')
                     ? submission.cover
                     : `${API_URL}${submission.cover}`
               }
               alt={submission.english_title}
            />
            <p className="submission-duration">{formatDuration(submission.duration_seconds)}</p>
            {showReportCount && submission.report_count > 0 && (
               <div className="submission-reports">
                  {reportCount} {getReportLabel(reportCount, language)}
               </div>
            )}
            {rating != null && (
               <div className="submission-rating">
                  <Star size={12} fill="currentColor" />
                  <span>{rating}</span>
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
                  <h5>{submission.creator_firstname} {submission.creator_lastname}</h5>
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
