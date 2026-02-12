import { useState, useEffect } from "react";
import { getSubmissionsService } from "../services/submission.service";
import { useLanguage } from "../context/LanguageContext";
import { useAlertHelper } from "../helpers/alertHelper";

const Submissions = () => {
   const alertHelper = useAlertHelper();
   const {language} = useLanguage();
   const [submissions, setSubmissions] = useState([]);
   const [loading, setLoading] = useState(true);
   const [statusFilter, setStatusFilter] = useState(null);
   const [pagination, setPagination] =useState({
      limit: 15,
      offset: 0,
      orderBy: 'DESC'
   });

   const [total, setTotal] = useState(0);

   const getSubmissions = async () => {
      console.log('getSubmissions triggered');
      setLoading(true);
      try {
         const response = await getSubmissionsService({
            ...pagination,
            status: statusFilter
         });
         setSubmissions(response.submissions);
         setTotal(response.total);
      } catch (error) {
         alertHelper.showMessage(getMessageFromResponse(error));
      } finally {
         setLoading(false);
      }
   }
   
   useEffect(() => {
      getSubmissions();
   }, [pagination.limit, pagination.offset, pagination.orderBy, statusFilter]);

   return (
      <div>
         <h1>{language === 'fr' ? 'Soumissions' : 'Submissions'}</h1>
         <div>
            {submissions.map(submission => (
               <div key={submission.id}>{submission.original_title}</div>
            ))}
         </div>
      </div>
   )
};

export default Submissions;