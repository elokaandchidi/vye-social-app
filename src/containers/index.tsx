import {AiFillCloseCircle} from 'react-icons/ai';
import {useEffect, useState}  from 'react';
import { Routes, Route, useLocation, NavLink } from 'react-router-dom';
import { BiMenu, BiSolidSearch } from "react-icons/bi";
import { FaCircleMinus, FaCirclePlus } from 'react-icons/fa6';
import {isMobile} from 'react-device-detect';
import BlockContent from '@sanity/block-content-to-react';

import Footer from '../components/reuseables/footer';
import Sidebar from '../components/reuseables/sidebar';
import Onboarding from '../components/onboarding/index'
import {Home, About, Faq, Term, Team, NotFound} from '../components/pages/_route';

import { client } from '../utils/client';
import {getGreeting, sidebarFaqList} from '../utils/common';
import { newsQuery } from '../utils/data';

import faqIcon from '../assets/images/faq-icon.svg';
import newsIcon from '../assets/images/news-icon.svg';
import maximizeIcon from '../assets/images/maximize.svg';
import minimizeIcon from '../assets/images/minimize.svg';



interface newInfo{
  _id: string;
  title: string;
  body: Object;
}

const IndexRoutes = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true)
  const [isMinimize, setIsMinimize] = useState(false)
  const [selectedFaqToView, setSelectedFaqToView] = useState(1)
  const [selectedNewToView, setSelectedNewToView] = useState('')
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [newsList, setNewsList] = useState<newInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  

  
  const { pathname } = location;  
  
  const handleMenuSidebar = (newValue : boolean) => {
    setToggleSidebar(newValue);
  }; 
  
  const fetchNews = () => {    
    let query = newsQuery();

    if(query) {
      client.fetch(query)
      .then((data) => {
        setNewsList(data);
      })
    }
  }

  const serializers = {
    types: {
      code: (props: any) => (
        <pre data-language={props?.node.language}>
          <code>{props?.node.code}</code>
        </pre>
      ),
    },
  }
  
  useEffect(() => {
    if (newsList.length === 0) {
      fetchNews()
    }
  }, [newsList])

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false)
      }, 5000);
    }
  }, [loading])

  if (loading) {
    return <Onboarding/>
  }
  
  return (
    <div className={`flex-col fixed flex w-full overflow-auto h-screen bg-white`}>
      <div className={`${pathname === '/' ? 'bg-navbar bg-cover bg-no-repeat' : 'bg-[#2985e0]'} ${isMobile ? 'bg-white' : ''} flex flex-col w-full`}>
        <div className={`${isMobile ? '' : 'hidden'} flex flex-row items-center p-5 justify-between border-b`}>
          <NavLink className={`${pathname === '/' ? 'text-white' : 'text-[#2985E0]'} text-[1.6rem] font-semibold`} to='/'>
            vYe
          </NavLink>
          <div className={`${pathname === '/' ? '' : 'bg-[#2985E0]'} rounded-sm`}>
            <BiMenu onClick={() => setToggleSidebar(true)} className='text-white' />
          </div>
        </div>
        <div className={`${isMobile ? 'hidden' : ''} flex flex-row p-5 lg:px-20 border-b-2 w-full items-center justify-between`}>
          <NavLink className='text-white text-[1.6rem] font-semibold' to='/'>
            vYe
          </NavLink>
          <div className='flex flex-row w-full text-lg justify-end gap-3 text-white'>
            <NavLink to='/' className={`${(pathname === '/') ? '' : ''} p-5  font-semibold`}>
              Survey
            </NavLink>
            <NavLink to='/about' className={`${(pathname === '/about') ? '' : ''} p-5  font-semibold`}>
              About
            </NavLink>
            <NavLink to='/team' className={`${(pathname === '/team') ? '' : ''} p-5  font-semibold`}>
              Team
            </NavLink>
          </div>
        </div>
        <div className={`${pathname === '/' ? '' : 'hidden'} flex flex-col items-center text-white gap-2 w-full lg:p-16 p-5`} >
          <div className='font-semibold text-3xl'>
            {getGreeting()}
          </div>
          <div className='text-lg'>Welcome to today's voice</div>
          <div className='flex flex-col items-center lg:mt-10 mt-5 lg:w-1/2 w-4/5'>
            <div className='lg:p-5 p-3 rounded-lg bg-white lg:w-4/5 w-full flex flex-row items-center justify-between'>
              <input  value={searchTerm} onChange={({ target}) => {setSearchTerm( target.value )}}
              type='text' placeholder='Search Vye social for data on anything and everything' className='lg:text-lg text-sm text-black placeholder:text-black w-11/12 focus:outline-none' />
              <BiSolidSearch className='text-[#2985e0] text-2xl'/>
            </div>
          </div>
        </div>
        {isMobile && toggleSidebar && (
          <div className='fixed w-full flex flex-col items-end bg-black bg-opacity-20 h-screen overflow-auto shadow-md z-10 animate-slide-in'>
            <div className=' w-2/3 bg-white h-screen overflow-auto shadow-md z-10 animate-slide-in'>
              <div className='w-full flex flex-row items-center justify-between p-4 mt-3 lg:px-20'>
                <NavLink onClick={() => setToggleSidebar(false)} className='text-[#2985e0] text-[1.6rem] font-semibold' to='/'>
                  vYe
                </NavLink>           
                <AiFillCloseCircle fontSize={25} className='cursor-pointer text-[#2985E0]' onClick={() => setToggleSidebar(false)}/>
              </div>

              <Sidebar handleMenuSidebar={handleMenuSidebar}/>
            </div>
          </div>
        )}
      </div>
      <div className={`${isMobile ? 'flex-col' : 'flex-row'} flex w-full`}>
        <div className={`${isMobile ? 'w-full' : ''} ${isMinimize && !isMobile ? 'w-full' : 'w-3/4'} flex flex-col items-center border-r`}>
          <Routes>
            <Route path="/" element={<Home isMinimize={isMinimize} searchTerm={searchTerm}/>} />
            <Route path="/about" element={<About/>} />
            <Route path="/faqs" element={<Faq/>} />
            <Route path="/terms" element={<Term/>} />
            <Route path="/team" element={<Team/>} />
            <Route path="/*" element={<NotFound/>} />
          </Routes>
        </div>
        <div className={`${isMobile ? 'w-full flex flex-col items-center mb-5' : ''} ${pathname !== '/' && isMobile ? 'hidden' : ''} ${isMinimize && !isMobile ? '' : 'w-1/4'} h-full`}>
          <div className={`${isMinimize && !isMobile ? 'p-7 w-full' : ''} ${!isMinimize && !isMobile ? 'p-10 w-full' : ''} flex flex-col w-11/12 gap-10 overflow-auto h-full`}>
            <div className={`${isMobile ? 'hidden' : ''}`}>
              <img onClick={() => setIsMinimize(!isMinimize)} src={isMinimize ? maximizeIcon :minimizeIcon} alt='icon' className='h-6 cursor-pointer'/>
            </div>
            <div className={`${isMinimize && !isMobile ? 'hidden' : ''}`}>
              <div className={`${isMobile ? 'hidden' : ''} w-1/2 text-black font-semibold`}>
                <span className='text-[1.5rem] pr-2'>Voice Your Experience</span>
                is all <br/> about unblocking insights, shaping policies and empowering Nigeria’s future!
              </div>

              <div className='flex flex-row items-center text-lg mt-10 gap-3'>
                <img src={newsIcon} alt='icon' className='h-6'/>
                <div className='font-semibold'>
                   News & Updates
                </div>
              </div>
              <div className='flex flex-col gap-5 w-full'>
                {newsList?.map((news, index) =>
                  <div key={index} className='flex flex-col rounded-xl gap-4 p-3'>
                    <div className='flex flex-row items-center justify-between w-full'>
                      <div className='w-full font-semibold'>{news.title}</div>
                    </div>
                    <div className={`${selectedNewToView === news._id ? '' : 'line-clamp-3'} text-sm w-5/6 text-gray-700`}>
                      <BlockContent blocks={news?.body} serializers={serializers} />
                    </div>
                    <div onClick={() => setSelectedNewToView(news._id)} className={`${selectedNewToView === news._id ? 'hidden' : ''} cursor-pointer text-gray-700 font-semibold`}>READ MORE HERE</div>
                    <div onClick={() => setSelectedNewToView('')} className={`${selectedNewToView !== news._id ? 'hidden' : ''} cursor-pointer text-gray-700 font-semibold`}>READ LESS HERE</div>
                  </div>
                )}
              </div>
              <div className='flex flex-row items-center text-lg mt-10 gap-3'>
                <img src={faqIcon} alt='icon' className='h-5'/>
                <div className='font-semibold'>
                  FAQs
                </div>
              </div>
              <div className='flex flex-col gap-2 mt-5 w-full'>
                {sidebarFaqList?.map((faq, index) =>
                  <div key={index} className='bg-white flex flex-col gap-4 p-3'>
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
              
            </div>

          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default IndexRoutes;
