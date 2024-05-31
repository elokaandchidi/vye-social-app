import { NavLink } from 'react-router-dom';
import { FaSquareFacebook, FaSquareInstagram, FaSquareXTwitter } from 'react-icons/fa6';
import { isMobile } from 'react-device-detect';
	

const Footer = () => {
  
  return (
    <div className={`${isMobile ? 'flex-col' : 'flex-row'} bg-[#05010F] p-5 lg:px-20 w-full items-center flex justify-between gap-3`}>
      <NavLink className='text-[#2985E0] font-semibold text-[2rem]' to='/'>
        vYe
      </NavLink>
      <a target='_blank' rel="noreferrer" href='https://www.ectc.ltd/'  className='text-[#045BB0] underline'>Designed and Developed by ECTC LTD</a>
    </div>
  )
}

export default Footer