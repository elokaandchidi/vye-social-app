import { NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo-color.png';
import { FaSquareEnvelope, FaSquareFacebook, FaSquareInstagram, FaSquareXTwitter } from 'react-icons/fa6';
import { isMobile } from 'react-device-detect';
	

const Footer = () => {
  
  return (
    <div className={`${isMobile ? '' : 'hidden'} bg-[#05010F] p-10 w-full items-center flex flex-col gap-3`}>
      <NavLink to='/'>
        <img src={logo} alt='logo' className='w-32'/>
      </NavLink>
      <div className='flex flex-row items-center text-[#045BB0] gap-5'>
        <FaSquareFacebook className='text-2xl' />
        <FaSquareInstagram className='text-2xl' />
        <FaSquareXTwitter className='text-2xl' />
      </div>
      <div className='flex flex-row items-center text-[#045BB0] gap-5'>
        <FaSquareEnvelope className='text-2xl' />
        <div className=''>support@vye.socials.com</div>
      </div>
    </div>
  )
}

export default Footer