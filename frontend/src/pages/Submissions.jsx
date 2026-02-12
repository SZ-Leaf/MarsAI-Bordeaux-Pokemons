import { useState, useEffect } from "react";
import { getSubmissionsService } from "../services/submission.service";
import { useLanguage } from "../context/LanguageContext";
import { useAlertHelper } from "../helpers/alertHelper";
import { responseHelper } from "../helpers/responseHelper";
import SubmissionCard from "../components/cards/SubmissionCard";
import SubmissionsList from "../components/submission/SubmissionsList";

const Submissions = () => {
   const alertHelper = useAlertHelper();
   const { getMessageFromResponse } = responseHelper();
   const {language} = useLanguage();
   const [submissionsList, setSubmissionsList] = useState([]);
   const [loading, setLoading] = useState(true);
   const [statusFilter, setStatusFilter] = useState(null);
   const [pagination, setPagination] =useState({
      limit: 15,
      offset: 0,
      orderBy: 'DESC'
   });

   const [total, setTotal] = useState(0);

   const getSubmissions = async () => {
      setLoading(true);
      try {
         const response = await getSubmissionsService({
            filters : {
               ...pagination,
               status: statusFilter
            }
         });
         setSubmissionsList(response.data.submissions);
         setTotal(response.data.count);
      } catch (error) {
         alertHelper.showMessage(getMessageFromResponse(error));
      } finally {
         setLoading(false);
      }
   }
   
   useEffect(() => {
      getSubmissions();
   }, [pagination.limit, pagination.offset, pagination.orderBy, statusFilter]);

   // test log after submissionsList is set
   useEffect(() => {
      console.log("Updated submissionsList:", submissionsList);
   }, [submissionsList]);

   return (
      <section className="submissions-section">
         <div className="submissions-header flex justify-between p-6">
            <h1>{language === 'fr' ? 'Soumissions' : 'Submissions'}</h1>
            <div className="submissions-filters">Test</div>
         </div>
         <SubmissionsList submissions={submissionsList} />
      </section>
   )
};

export default Submissions;