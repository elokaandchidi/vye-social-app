import { FaCircleArrowLeft } from "react-icons/fa6";
import { NavLink } from "react-router-dom";


import ImageEamon from '../../assets/images/eamon.jpg';
import ImageChidi from '../../assets/images/chidi.jpg';

const Team = () => {
  

  return (
    <div className='flex flex-col h-full lg:w-2/3 w-11/12 overflow-auto text-[1rem] transaction-height py-10 duration-75 ease-out'>
      <div className='flex flex-col w-full '>
        <NavLink to={'/'} className='flex flex-row gap-3 pb-5 items-center'>
          <FaCircleArrowLeft className="text-[#045BB0] text-[1.3rem]" />
          Homepage
        </NavLink>
        <div className={`w-full flex flex-col gap-3`}>
          <div className='font-semibold lg:text-2xl text-lg'>
            Meet the team
          </div>
          <div className='grid lg:grid-cols-3 w-full gap-5 mt-5'>
            <div className='flex flex-col gap-5'>
              <div className='font-semibold text-lg'>Eloka</div>
              <img src={ImageEamon} alt='logo' className='object-cover h-[20rem] grayscale' />
              <div className='text-black text-center md:text-[1.1rem] text-[.975rem] w-full'>
                Interim CEO/Chief Product Officier
              </div>
            </div>
            <div className='flex flex-col gap-5'>
              <div className='font-semibold text-lg'>Chidi</div>
              <img src={ImageChidi} alt='logo' className='object-cover h-[20rem] grayscale' />
              <div className='text-black text-center md:text-[1.1rem] text-[.975rem] w-full'>
                Chief Data Officier
              </div>
            </div>
            
          </div>
        </div>
          
      </div>
    </div>
  )
}

export default Team;
