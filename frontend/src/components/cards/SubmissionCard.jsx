import React from 'react';
import './submissionCard.css';

const SubmissionCard = ({submission}) => {

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
         <div className="submission-content">
            <h2>{submission.english_title}</h2>
            {submission.original_title && <h3>{submission.original_title}</h3>}
            <p>{submission.language}</p>
            <p>{submission.english_synopsis}</p>
            <p>{submission.original_synopsis}</p>
            <p>{submission.classification}</p>
            <p>{submission.tech_stack}</p>
            <p>{submission.creative_method}</p>
            <p>{submission.subtitles}</p>
         </div>
      </article>
   )
};

export default SubmissionCard;