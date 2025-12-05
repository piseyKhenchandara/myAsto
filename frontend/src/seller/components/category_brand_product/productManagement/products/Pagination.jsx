import React from 'react';
import { GrLinkPrevious, GrLinkNext } from 'react-icons/gr';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center gap-2 my-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        <GrLinkPrevious />
      </button>
      
      <span className="px-3 py-1">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        <GrLinkNext />
      </button>
    </nav>
  );
};

export default Pagination;