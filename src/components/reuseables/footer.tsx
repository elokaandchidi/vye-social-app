import { NavLink } from 'react-router-dom';
import { FaSquareFacebook, FaSquareInstagram, FaSquareXTwitter } from 'react-icons/fa6';
import { isMobile } from 'react-device-detect';
	

const Footer = () => {
  
  return (
    <div className={`${isMobile ? 'flex-col' : 'flex-row'} bg-[#05010F] p-5 lg:px-20 w-full items-center flex justify-between gap-3`}>
      <NavLink className='text-[#2985E0] font-semibold text-[2rem]' to='/'>
        vYe
      </NavLink>
      <div className='flex flex-row items-center text-[#045BB0] gap-5'>
        <FaSquareFacebook className='text-2xl' />
        <FaSquareInstagram className='text-2xl' />
        <FaSquareXTwitter className='text-2xl' />
      </div>
      <div className='text-[#045BB0]'>Designed and Developed by ECTC LTD</div>
    </div>
  )
}

export default Footer