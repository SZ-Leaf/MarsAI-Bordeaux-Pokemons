import React from 'react';
import SubmissionCard from '../cards/SubmissionCard';
import { useLanguage } from '../../context/LanguageContext';

const SubmissionsList = ({submissions}) => {
   const {language} = useLanguage();
   if (!submissions || submissions.length === 0) {
      return <div>{language === 'fr' ? 'Aucune soumission trouvée' : 'No submissions found'}</div>;
   }
   return (
      <div className="submissions-list grid gap-10 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
         {submissions.map((submission) => (
            <SubmissionCard
               submission={submission}
               key={submission.id}
            />
         ))}
      </div>
   )
};

export default SubmissionsList;