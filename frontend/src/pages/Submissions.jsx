import { useState, useEffect, useRef } from "react";
import { getSubmissionsService } from "../services/submission.service";
import { useLanguage } from "../context/LanguageContext";
import { useAlertHelper } from "../helpers/alertHelper";
import { responseHelper } from "../helpers/responseHelper";
import SubmissionsList from "../components/submission/SubmissionsList";
import VideoDetails from "../components/submission/VideoDetails";
import { AnimatePresence } from "motion/react";

const Submissions = () => {
   const [activeIndex, setActiveIndex] = useState(null);
   const submissionsRef = useRef(null);
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

   useEffect(() => {
      if (!loading && pagination.offset !== 0) {
         submissionsRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
         });
      }
   }, [pagination.offset, loading]);   

   return (
      <section ref={submissionsRef} className="submissions-section relative">
         
         <div className="submissions-header flex flex-col justify-between mx-auto py-5">
            <h1>{language === 'fr' ? 'La Galerie des Films' : 'The Movie Gallery'}</h1>
            <div className="submissions-filters flex justify-between">
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

         <div className="relative">
            {loading && (
               <div
                  style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.2)',
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 10,
                  }}
               >
                  <div className="loading"></div>
               </div>
            )}   
         </div>        
         <SubmissionsList
            submissions={submissionsList}
            paginationFilters={pagination}
            total={total}
            loading={loading}
            onPageChange={(newOffset) => {
            setPagination(prev => ({ ...prev, offset: newOffset }))}}
            onVideoClick={(index) => setActiveIndex(index)}
         />
         <AnimatePresence>
            {activeIndex !== null && (
               <VideoDetails
                  video={submissionsList[activeIndex]}
                  onClose={() => setActiveIndex(null)}
                  onPrev={() => setActiveIndex((i) => i - 1)}
                  onNext={() => setActiveIndex((i) => i + 1)}
                  hasPrev={activeIndex > 0}
                  hasNext={activeIndex < submissionsList.length - 1}
               />
            )}
         </AnimatePresence>
      </section>
   )
};

export default Submissions;