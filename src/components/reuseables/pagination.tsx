import React, { useState } from 'react';
import { BsChevronDown, BsChevronLeft, BsChevronRight } from "react-icons/bs";


type PaginationData={
    currentPage: number,
    pageSize: number,
    dataLength: number,
    totalPages: number,
    onPageChange: (newValue: number) => void,
    onPageSizeChange: (newValue: number) => void,
}

const Pagination = ({ currentPage, totalPages, dataLength, pageSize, onPageChange, onPageSizeChange }: PaginationData) => {
  const [isDropdown, setIsDropdown] = useState(false);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);  

  return (
    <div className='flex flex-col gap-5 mt-10 text-sm justify-center w-full'>
      <div className='flex flex-row items-center justify-center text-black gap-3'>
        <div className=''>
          Showing {dataLength} out of {pageSize}
        </div>
        <div className='border-black text-black relative w-[4rem] gap-3 h-8 flex flex-row items-center justify-center border'>
          {pageSize}
          <BsChevronDown onClick={() => setIsDropdown(!isDropdown)}/>

          <div className={`${isDropdown ? '' : 'hidden' } absolute mt-[8rem] border-black border w-full items-center flex flex-col`}>
            <span className='cursor-pointer' onClick={()=> [onPageSizeChange(10), setIsDropdown(!isDropdown)]} >10</span>
            <span className='cursor-pointer' onClick={()=> [onPageSizeChange(20), setIsDropdown(!isDropdown)]} >20</span>
            <span className='cursor-pointer' onClick={()=> [onPageSizeChange(30), setIsDropdown(!isDropdown)]} >30</span>
            <span className='cursor-pointer' onClick={()=> [onPageSizeChange(40), setIsDropdown(!isDropdown)]} >40</span>
          </div>
        </div>
      </div>

      <div className='flex flex-row justify-center gap-4 w-full'>
        <div onClick={() => onPageChange(currentPage-1)} className={`${currentPage === 1 ? 'hidden' : '' } text-black text-xl flex flex-col items-center justify-center`}>
          <BsChevronLeft />
        </div>
        {pages.map((page) => (
          <button className='border-black text-black w-8 h-8 border' key={page} onClick={() => onPageChange(page)} disabled={page === currentPage}>
            {page}
          </button>
        ))}
        <div onClick={() => onPageChange(currentPage+1)} className={`${currentPage === totalPages ? 'hidden' : '' } text-black text-xl flex flex-col items-center justify-center`}>
          <BsChevronRight />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
