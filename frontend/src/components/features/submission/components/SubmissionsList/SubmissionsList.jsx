import React from 'react';
import SubmissionCard from '../SubmissionCard';
import { useLanguage } from '../../../../../context/LanguageContext';
import { Pagination } from '../../../../shared/ui';

const SubmissionsList = ({
   submissions,
   paginationFilters,
   total,
   loading,
   onPageChange,
   onVideoClick,
   showReportCount = false
}) => {
   const {language} = useLanguage();

   if (!loading && (!submissions || submissions.length === 0)) {
      return <div>{language === 'fr' ? 'Aucune soumission trouvée' : 'No submissions found'}</div>;
   }
   return (
      <>
         <div className="submissions-list grid gap-10 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
            {submissions.map((submission, index) => (
               <SubmissionCard
                  submission={submission}
                  key={submission.id}
                  onVideoClick={() => onVideoClick(index)}
                  showReportCount={showReportCount}
               />
            ))}
         </div>
         <Pagination total={total} {...paginationFilters} loading={loading} onPageChange={onPageChange} />
      </>
   )
};

export default SubmissionsList;
