import { FaChevronLeft } from "react-icons/fa6";
import Footer from "../reuseables/footer";

import icon from '../../assets/images/sad-icon.png';
import { NavLink } from "react-router-dom";

const NotFound = () => { 
  return (
    <div className='flex flex-col w-full justify-center items-center h-full overflow-auto lg:text-[1.5rem] text-[1rem] transaction-height duration-75 ease-out'>
      <div className='flex flex-col gap-5 items-center md:p-10 p-5 lg:w-2/5 w-2/3 lg:mb-0 mb-32 lg:mt-0 mt-20'>
        <img src={icon} alt='logo' className=''/>
        <div className={`lg:text-[2rem] text-xl text-center font-semibold`}>
          Oops! Seems like you missed your way
        </div>
        <div className="w-full text-center lg:text-sm text-[.8rem]">
          This page might have been deleted or does not exist. Let’s get you back!
        </div>

        <div className='flex flex-col w-full items-center'>
          <NavLink to={'/'} className='bg-[#045BB0] py-3 px-10 flex flex-row gap-3 items-center text-white font-semibold rounded-lg'>
            <div className='bg-white rounded-sm p-1'>
              <FaChevronLeft className='text-[#045BB0] text-[.5rem]'/>
            </div>
            Go Back
          </NavLink>
        </div>

      </div>
      <Footer/>
    </div>
  )
}

export default NotFound;
