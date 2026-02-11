import { useState } from "react";
import { getSubmissionsService } from "../services/submission.service";
import { useLanguage } from "../context/LanguageContext";
import { alertHelper as useAlertHelper } from "../helpers/alertHelper";

const Submissions = () => {

   const {language} = useLanguage();
   const [submissions, setSubmissions] = useState([]);
   const [loading, setLoading] = useState(true);
   const [pagination, setPagination] =useState({
      limit: 15,
      offset: 0,
      total: 0,
      orderBy: 'DESC'
   });

   const getSubmissions = async () => {
      setLoading(true);
      try {
         const response = await getSubmissionsService({pagination});
         setSubmissions(response.submissions);
         setPagination(prev => ({
            ...prev,
            total: response.total,
         }));
      } catch (error) {
         useAlertHelper().showMessage(error?.message);
      } finally {
         setLoading(false);
      }
   }

   return (
      <div>
         <h1>Soumissions</h1>
         <div>
            <button onClick={() => getSubmissions('ASC')}>Trier par date croissante</button>
            <button onClick={() => getSubmissions('DESC')}>Trier par date décroissante</button>
         </div>
         <div>
            {submissions.map(submission => (
               <div key={submission.id}>{submission.title}</div>
            ))}
         </div>
      </div>
   )
};

export default Submissions;