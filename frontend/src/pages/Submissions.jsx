import { useState, useEffect, useRef, useMemo } from "react";
import { getSubmissionsService } from "../services/submission.service";
import { useLanguage } from "../context/LanguageContext";
import { useAlertHelper } from "../helpers/alertHelper";
import { responseHelper } from "../helpers/responseHelper";
import SubmissionsList from "../components/submission/SubmissionsList";
import VideoDetails from "../components/submission/VideoDetails";
import { AnimatePresence, motion } from "motion/react";
import { usePlaylists } from "../helpers/playlistHelper";
import { usePlaylistCounts } from "../hooks/usePlaylistCounts";
import PlaylistCard from "../components/playlists/PlaylistCard";

const Submissions = ({ onDetailToggle }) => {
   const [activeIndex, setActiveIndex] = useState(null);
   const submissionsRef = useRef(null);
   const alertHelper = useAlertHelper();
   const { getMessageFromResponse } = responseHelper();
   const {language} = useLanguage();
   const [submissionsList, setSubmissionsList] = useState([]);
   const [loading, setLoading] = useState(true);
   const [typeFilter, setTypeFilter] = useState(null);
   const [ratedFilter, setRatedFilter] = useState(null);
   const [sortBy, setSortBy] = useState("DESC");
   const [playlistFilter, setPlaylistFilter] = useState(null);
   const playlists = usePlaylists();

   const { counts, loading: playlistLoading, error: playlistError } = usePlaylistCounts();

   const playlistTotal = useMemo(() => {
      if (!counts) return 0;
      return Object.values(counts).reduce((acc, n) => acc + (Number(n) || 0), 0);
   }, [counts]);


   const [pagination, setPagination] =useState({
      limit: 15,
      offset: 0,
   });

   const [total, setTotal] = useState(0);

   const getSubmissions = async () => {
      setLoading(true);
      try {
         const response = await getSubmissionsService({
            filters : {
               ...pagination,
               type: typeFilter,
               rated: ratedFilter,
               sortBy: sortBy,
               playlist: playlistFilter
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
   }, [pagination.limit, pagination.offset, sortBy, typeFilter, ratedFilter, playlistFilter]);

   useEffect(() => {
      if (!loading && pagination.offset !== 0) {
         submissionsRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
         });
      }
   }, [pagination.offset, loading]);

   useEffect(() => {
      onDetailToggle?.(activeIndex !== null);
   }, [activeIndex]);

   useEffect(() => {
      if (activeIndex !== null) {
         const timeout = setTimeout(() => {
            submissionsRef.current?.scrollIntoView({
               behavior: "smooth",
               block: "start"
            });
         }, 100); // small delay for animation
   
         return () => clearTimeout(timeout);
      }
   }, [activeIndex]);    


   return (
      <section ref={submissionsRef} className="submissions-section pt-20">
         
         <AnimatePresence mode="wait">
            {activeIndex !== null ? (
               <VideoDetails
                  key="video-details"
                  video={submissionsList[activeIndex]}
                  onClose={() => setActiveIndex(null)}
                  onPrev={() => setActiveIndex((i) => i - 1)}
                  onNext={() => setActiveIndex((i) => i + 1)}
                  hasPrev={activeIndex > 0}
                  hasNext={activeIndex < submissionsList.length - 1}
               />
            ) : (
               <motion.div
                  key="submissions-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
               >
                  {/* Playlist filter cards */}
                  <div className="rounded-xl border border-gray-800/50 bg-[#111] p-4 mb-6">
                     <div className="flex items-center justify-between mb-3 gap-6">
                        <div>
                           <h2 className="text-white text-2xl font-semibold">
                              {language === "fr" ? "Playlists" : "Playlists"}
                           </h2>
                           <p className="mt-1 text-sm text-gray-400">
                              {language === "fr"
                                 ? "Filtrer les soumissions par playlist"
                                 : "Filter submissions by playlist"}
                           </p>
                        </div>
                        <div className="rounded-lg border border-gray-800 bg-[#1a1a1a] px-3 py-2 text-sm text-gray-300 shrink-0">
                           {playlistLoading ? "…" : `${playlistTotal} ${language === "fr" ? "vidéo(s) au total" : "total video(s)"}`}
                        </div>
                     </div>

                     {playlistError && (
                        <div className="rounded-xl border border-red-800 bg-red-950/40 p-3 text-red-200 text-sm mb-3">
                           {playlistError}
                        </div>
                     )}

                     <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
                        {playlists.map((p) => (
                           <PlaylistCard
                              key={p.key}
                              playlist={p}
                              loading={p.key === "all" ? loading : playlistLoading}
                              count={p.key === "all" ? total : (counts?.[p.key] ?? 0)}
                              isActive={playlistFilter === p.key}
                              onClick={() => {
                                 setPlaylistFilter((prev) => prev === p.key ? null : p.key);
                                 setPagination(prev => ({ ...prev, offset: 0 }));
                              }}
                           />
                        ))}
                     </div>
                  </div>

                  <div className="submissions-header flex flex-col justify-between mx-auto py-5">
                     <div className="submissions-filters flex gap-10 justify-between">
                        <select
                           name="ai-type-filter"
                           className="select-dark"
                           value={typeFilter || ''}
                           onChange={(e) => {
                              setTypeFilter(e.target.value || null);
                              setPagination(prev => ({ ...prev, offset: 0 }));
                           }}
                        >
                           <option defaultValue value="">{language === 'fr' ? 'Tous' : 'All'}</option>
                           <option value="Full AI">
                              {language === 'fr' ? 'Full IA' : 'Full AI'}
                           </option>
                           <option value="Semi-AI">
                              {language === 'fr' ? 'Semi-IA' : 'Semi-AI'}
                           </option>
                        </select>

                        <select
                           name="sort-by"
                           id="sort-by"
                           className="select-dark"
                           value={sortBy}
                           onChange={(e) => {
                              setSortBy(e.target.value);
                              setPagination(prev => ({ ...prev, offset: 0 }));
                           }}
                        >
                           <option value="DESC">
                              {language === 'fr' ? 'Plus récents' : 'Newest'}
                           </option>
                           <option value="ASC">
                              {language === 'fr' ? 'Plus anciens' : 'Oldest'}
                           </option>
                        </select>
                        
                        <select
                           name="rating-status"
                           id="rating-status"
                           className="select-dark"
                           value={ratedFilter || ''}
                           onChange={(e) => {
                              setRatedFilter(e.target.value || null);
                              setPagination(prev => ({ ...prev, offset: 0 }));
                           }}
                        >
                           <option defaultValue value="">
                              {language === 'fr' ? 'Tous' : 'All'}
                           </option>
                           <option value="rated">
                              {language === 'fr' ? 'Noté' : 'Rated'}
                           </option>
                           <option value="unrated">
                              {language === 'fr' ? 'Non noté' : 'Unrated'}
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
               </motion.div>
            )}
         </AnimatePresence>
      </section>
   )
};

export default Submissions;