import React from 'react';
import './submissionCard.css';
import { useLanguage } from '../../context/LanguageContext';

const SubmissionCard = ({submission}) => {
   const {language} = useLanguage();

   function formatDuration(seconds) {
      const mins = Math.floor(seconds / 60);           // get whole minutes
      const secs = seconds % 60;                       // get remaining seconds
      return `${mins}:${secs.toString().padStart(2, '0')}`; // pad seconds to 2 digits
   }
    

   return (
      <article className="submission-container-card" key={submission.id}>
         <div className="submission-image-container">
            <img className="submission-image" src={`${import.meta.env.VITE_API_URL}${submission.cover}`} alt={submission.english_title} />
            <p className="submission-duration">{formatDuration(submission.duration_seconds)}</p>
         </div>
         <div className="submission-title">
            <h2>{submission.english_title}</h2>
            {submission.original_title && <h3>{submission.original_title}</h3>}
         </div>
         <div className="submission-details flex justify-between">
            <div className='submission-creator'>
               <p>{language === 'fr' ? 'REALISATEUR' : 'DIRECTOR'}</p>
               <p>{submission.creator_firstname}{submission.creator_lastname}</p>
            </div>
            <div className='submission-country'>
               <p>{language === 'fr' ? 'PAYS' : 'COUNTRY'}</p>
               <p>{submission.creator_country}</p>
            </div>
         </div>
      </article>
   )
};

export default SubmissionCard;