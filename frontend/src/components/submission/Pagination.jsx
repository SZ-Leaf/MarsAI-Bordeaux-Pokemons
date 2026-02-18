import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './pagination.css';

const Pagination = ({total, limit, offset, loading, onPageChange}) => {
   const {language} = useLanguage();
   const totalPages = Math.ceil(total / limit);
   const currentPage = Math.floor(offset / limit) + 1;
   const maxVisible = 5;
   const sidePages = 2;

   if(totalPages <= 1) return null;

   let startPage = Math.max(1, currentPage - sidePages);
   let endPage = Math.min(totalPages, currentPage + sidePages);
   
   // Adjust if near beginning
   if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(totalPages, maxVisible);
   }
   
   // Adjust if near end
   if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - maxVisible + 1);
   } 

   const handlePageChange = (page) => {
      if(!loading) {
         const newOffset = (page - 1) * limit;
         onPageChange(newOffset);
      }
   };

   const pages = [];
   
   if(startPage > 1) {
      pages.push(1);

      if(startPage > 2) {
         pages.push('start-ellipsis');
      }
   }

   // Middle pages
   for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
   }

   // Always show last page
   if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
         pages.push('end-ellipsis');
      }

      pages.push(totalPages);
   }

   return (
      <div className="pagination-container flex justify-center gap-2 mt-10">
         {/* previous page */}
         <button className="pagination-button" onClick={() => handlePageChange(currentPage - 1)} disabled={loading ||currentPage === 1}>
            {language === 'fr' ? 'Précédent' : 'Previous'}
         </button>

         {/* page numbers */}
         {pages.map((page, index) => {
            if (page === 'start-ellipsis' || page === 'end-ellipsis') {
               return (
                  <span key={index} className="pagination-ellipsis">
                     ...
                  </span>
               );
            }

            return (
               <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`pagination-button ${
                     currentPage === page ? 'bg-blue text-white' : ''
                  }`}
                  disabled={loading}
               >
                  {page}
               </button>
            );
         })}


         {/* next page */}
         <button className="pagination-button" onClick={() => handlePageChange(currentPage + 1)} disabled={loading || currentPage === totalPages}>
            {language === 'fr' ? 'Suivant' : 'Next'}
         </button>
      </div>
   );
};

export default Pagination;