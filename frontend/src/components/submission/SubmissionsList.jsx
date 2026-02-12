import React from 'react';
import SubmissionCard from '../cards/SubmissionCard';

const SubmissionsList = ({submissions}) => {
   if (!submissions || submissions.length === 0) {
      return <div>No submissions found</div>;
   }
   return (
      <div className="submissions-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
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