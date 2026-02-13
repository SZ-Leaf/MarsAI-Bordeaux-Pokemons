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

   return (
      <section className="submissions-section w-19/20 m-auto">
         <div className="submissions-header flex flex-col justify-between mx-auto p-4">
            <h1>{language === 'fr' ? 'La Galerie des Films' : 'The Movie Gallery'}</h1>
            <div className="submissions-filters flex gap-4">
               <select className="select-dark">
                  <option value="Full AI">
                     {language === 'fr' ? 'Full IA' : 'Full AI'}
                  </option>
                  <option value="Semi-AI">
                     {language === 'fr' ? 'Semi-IA' : 'Semi-AI'}
                  </option>
               </select>
               <select name="sort-by" id="sort-by" className="select-dark">
                  <option value="newest">
                     {language === 'fr' ? 'Nouveaux' : 'Newest'}
                  </option>
                  <option value="oldest">
                     {language === 'fr' ? 'Anciens' : 'Oldest'}
                  </option>
               </select>
            </div>
         </div>
         <SubmissionsList submissions={submissionsList} />
      </section>
   )
};

export default Submissions;