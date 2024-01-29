import {useEffect, useState}  from 'react';
import { Routes, Route, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { BiMenu } from "react-icons/bi";
import {AiFillCloseCircle} from 'react-icons/ai';
import { FaCircleMinus, FaCirclePlus, FaSquareEnvelope, FaSquareFacebook, FaSquareInstagram, FaSquareXTwitter } from 'react-icons/fa6';
import {isMobile} from 'react-device-detect';

import {sidebarFaqList} from '../utils/common';
import logo from '../assets/images/logo-white.png';
import logoColored from '../assets/images/logo-color.png';

import Onboarding from '../components/onboarding/index'
import {Home, About, Faq, Term, NotFound} from '../components/pages/_route';
import Sidebar from '../components/reuseables/sidebar';

const IndexRoutes = () => {
  const location = useLocation();
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true)
  const [selectedFaqToView, setSelectedFaqToView] = useState(1)
  const [toggleSidebar, setToggleSidebar] = useState(false);
  
  const { pathname } = location;
  
  const handleMenuSidebar = (newValue : boolean) => {
    setToggleSidebar(newValue);
  };  

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 5000);
}, [])

  if (loading) {
    return <Onboarding/>
  }
  
  return (
    <div className={`${isMobile ? '' : 'fixed'} flex flex-row w-full h-screen bg-white`}>      
      <div className={`${isMobile ? 'hidden' : ''} w-1/4 bg-img h-full`}>
        <div className='flex flex-col w-full gap-20 bg-[#045BB0] opacity-90 p-10 h-full'>
          <NavLink to='/'>
            <img src={logo} alt='logo' className='w-40'/>
          </NavLink>
           
          <div className='w-1/2 text-white font-semibold'>
            <span className='text-[1.5rem] pr-2'>Voice Your Experience</span>
            is all <br/> about unblocking insights, shaping policies and empowering Nigeria’s future!
          </div>

          <div className='flex flex-col gap-10 w-full'>
            {sidebarFaqList?.map((faq, index) =>
              <div key={index} className='bg-white flex flex-col gap-4 p-5'>
                <div className='flex flex-row items-center justify-between w-full'>
                  <div className='font-semibold'>{faq.title}</div>
                  <FaCirclePlus className={`${selectedFaqToView !== faq.id ? '' : 'hidden'} cursor-pointer`} onClick={() => setSelectedFaqToView(faq.id)}/>
                  <FaCircleMinus className={`${selectedFaqToView === faq.id ? '' : 'hidden'} cursor-pointer`} onClick={() => setSelectedFaqToView(0)}/>
                </div>
                <div className={`${selectedFaqToView === faq.id ? '' : 'hidden'} text-sm w-5/6`}>
                  {faq.description}
                </div>
              </div>
            )}
          </div>

          <div className='w-full flex flex-col gap-5'>
            <div className='flex flex-row items-center text-white font-semibold gap-5 w-full'>
              <FaSquareEnvelope className='text-2xl' />
              <div className=''>support@vye.socials.com</div>
            </div>
            <div className='flex flex-row items-center text-white font-semibold gap-5 w-full'>
              <FaSquareFacebook className='text-2xl' />
              <FaSquareInstagram className='text-2xl' />
              <FaSquareXTwitter className='text-2xl' />
            </div>
          </div>

        </div>
      </div>
      <div className={`${isMobile ? 'w-full' : 'w-3/4 items-center'} flex flex-col`}>
        <div className={`${isMobile ? '' : 'hidden'} flex flex-row items-center p-5 justify-between border-b`}>
          <NavLink to='/'>
            <img src={logoColored} alt='logo' className='w-32'/>
          </NavLink>
          <div className='bg-[#2985E0] rounded-sm'>
            <BiMenu onClick={() => setToggleSidebar(true)} className='text-white' />
          </div>
        </div>
        <div className={`${isMobile ? 'hidden' : ''} flex flex-row w-full justify-end gap-3 p-2 border-b`}>
          <NavLink to='/about' className={`${(pathname === '/about') ? 'text-blue-800' : ''} p-5  font-semibold`}>
            About
          </NavLink>
          <NavLink to='/faqs' className={`${(pathname === '/faqs') ? 'text-blue-800' : ''} p-5  font-semibold`}>
            FAQs
          </NavLink>
          <NavLink to='/terms' className={`${(pathname === '/terms') ? 'text-blue-800' : ''} p-5  font-semibold`}>
            Terms
          </NavLink>
        </div>
        {isMobile && toggleSidebar && (
          <div className='fixed w-full flex flex-col items-end bg-black bg-opacity-20 h-screen overflow-auto shadow-md z-10 animate-slide-in'>
            <div className=' w-1/2 bg-white h-screen overflow-auto shadow-md z-10 animate-slide-in'>
              <div className='w-full flex flex-row items-center justify-between p-4 mt-3 lg:px-20'>              
                <img src={logoColored} alt='user-profile' className='w-24' />
                <AiFillCloseCircle fontSize={25} className='cursor-pointer text-[#2985E0]' onClick={() => setToggleSidebar(false)}/>
              </div>

              <Sidebar handleMenuSidebar={handleMenuSidebar}/>
            </div>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/faqs" element={<Faq/>} />
          <Route path="/terms" element={<Term/>} />
          <Route path="/*" element={<NotFound/>} />
        </Routes>
      </div>
    </div>
  )
}

export default IndexRoutes;
