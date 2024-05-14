import {AiFillCloseCircle} from 'react-icons/ai';
import {Key,useEffect, useState}  from 'react';
import { Routes, Route, useLocation, NavLink } from 'react-router-dom';
import { BiCheckSquare, BiMenu, BiSquare } from "react-icons/bi";
import { FaWindowClose } from "react-icons/fa";
import { FaCaretDown, FaSquareEnvelope, FaSquareFacebook, FaSquareInstagram, FaSquareXTwitter } from 'react-icons/fa6';
import {isMobile} from 'react-device-detect';
import BlockContent from '@sanity/block-content-to-react';
import { v4 as uuidv4 } from 'uuid';

import {formatDate, getFirstCharacters} from '../utils/common';
import logoColored from '../assets/images/logo-color.png';

import Onboarding from '../components/onboarding/index'
import {Home, About, Faq, Term, NotFound} from '../components/pages/_route';
import Sidebar from '../components/reuseables/sidebar';
import { client } from '../utils/client';
import { fetchUser } from '../utils/fetchUser';
import { useAlert } from '../utils/notification/alertcontext';
import { feedDetailQuery, marketCommentQuery, newsQuery } from '../utils/data';
import { config } from '../utils/config';

interface pinInfo{
  _id: string;
  title: string;
  category: string;
  description: string;
  _createdAt: string;
  commentCount: number;
  comments: any;
}

interface commentInfo{
  _id: string;
  comment: string;
  postedBy: any;
  _createdAt: string;
}

interface newInfo{
  _id: string;
  title: string;
  body: Object;
}

const IndexRoutes = () => {
  const { addAlert } = useAlert();
  const location = useLocation();
  const [term, setTerm] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true)
  const [selectedNewToView, setSelectedNewToView] = useState('')
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMarketComment, setViewMarketComment] = useState(false);
  const [selectedPin, setSelectedPin] = useState('');
  const [pinDetail, setPinDetail] = useState<pinInfo>({} as pinInfo);
  const [newsList, setNewsList] = useState<newInfo[]>([]);
  const [marketComments, setMarketComments] = useState<commentInfo[]>([]);

  
  const { pathname } = location;
  const user = fetchUser();
  
  const handleMenuSidebar = (newValue : boolean) => {
    setToggleSidebar(newValue);
  }; 

  const handlePin = (newValue : string) => {
    setSelectedPin(newValue);
    fetchPinDetails(newValue)
  };

  const handleMarketComment = (newValue : boolean) => {
    setViewMarketComment(newValue);
    fetchMarketComments()
  };

  const fetchPinDetails = (id : string) => {    
    let query = feedDetailQuery(selectedPin ? selectedPin : id);

    if(query) {
      client.fetch(query)
      .then((data) => {
        setPinDetail(data[0]);
      })
    }
  }

  const fetchMarketComments = async () => {    
    await client.fetch(marketCommentQuery)
    .then((data) => {
      setMarketComments(data);
    })
  }
  
  const fetchNews = () => {    
    let query = newsQuery();

    if(query) {
      client.fetch(query)
      .then((data) => {
        setNewsList(data);
      })
    }
  }

  const addComment = () => {
    const requiredFields = [
      { field: comment, message: 'Please leave a comment' },
      { field: term, message: 'Please agree to term of condition' }
    ];
  
    for (const { field, message } of requiredFields) {
      if (!field) {
        setIsSubmitting(false);
        return addAlert({ message, type: 'error' });
      }
    }
    if (comment) {
      setIsSubmitting(true);
      client.patch(selectedPin)
        .setIfMissing({comments: []})
        .insert('after', 'comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user.id
          }
        }])
        .commit()
        .then(() => {
          fetchPinDetails(selectedPin);
          setComment('');
          setTerm(false);
          setIsSubmitting(false);
        })
    }
  }
  
  const addMarketComment = async () => {
    const requiredFields = [
      { field: comment, message: 'Please leave a comment' },
      { field: term, message: 'Please agree to term of condition' }
    ];
  
    for (const { field, message } of requiredFields) {
      if (!field) {
        setIsSubmitting(false);
        return addAlert({ message, type: 'error' });
      }
    }
    if (comment) {
      setIsSubmitting(true);
      let doc = {
        _type: 'marketComment',
        comment,
        postedBy: {
          _type: 'postedBy',
          _ref: user.id
        }
      }
      try {
        await client.create(doc)
        fetchMarketComments();
        setComment('');
        setTerm(false);
        setIsSubmitting(false);
      } catch (error) {
        console.log(error);
        setIsSubmitting(false);
        addAlert({ message:'error occurred while submitting comment', type: 'error' });
      }
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
  }, [])

  if (loading) {
    return <Onboarding/>
  }
  
  return (
    <div className={`${isMobile ? '' : 'fixed'} flex flex-row w-full h-screen bg-white`}>
      <div className={`${isMobile ? 'w-full' : 'w-3/4 items-center'} flex flex-col `}>
        <div className={`${isMobile ? '' : 'hidden'} flex flex-row items-center p-5 justify-between border-b`}>
          <NavLink to='/'>
            <img src={logoColored} alt='logo' className='w-32'/>
          </NavLink>
          <div className='bg-[#2985E0] rounded-sm'>
            <BiMenu onClick={() => setToggleSidebar(true)} className='text-white' />
          </div>
        </div>
        <div className={`${isMobile ? 'hidden' : ''} flex flex-row p-5 lg:px-16 w-full items-center justify-between`}>
          <NavLink to='/'>
            <img src={logoColored} alt='logo' className='w-40'/>
          </NavLink>
          <div className='flex flex-row w-full justify-end gap-3'>
            <NavLink to='/' className={`${(pathname === '/') ? 'text-blue-800' : ''} p-5  font-semibold`}>
              Survey
            </NavLink>
            <NavLink to='/about' className={`${(pathname === '/about') ? 'text-blue-800' : ''} p-5  font-semibold`}>
              About
            </NavLink>
            <NavLink to='/faqs' className={`${(pathname === '/faqs') ? 'text-blue-800' : ''} p-5  font-semibold`}>
              FAQs
            </NavLink>
          </div>
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
          <Route path="/" element={<Home handleMarketComment={handleMarketComment} handlePin= {handlePin}/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/faqs" element={<Faq/>} />
          <Route path="/terms" element={<Term/>} />
          <Route path="/*" element={<NotFound/>} />
        </Routes>
      </div>
      <div className={`${isMobile ? 'hidden' : ''} bg-[#d9d9d9] w-1/4 h-full`}>
        <div className={`${selectedPin || viewMarketComment ? 'hidden' : ''} flex flex-col w-full gap-20 overflow-auto p-10 h-full`}>
          <div className='w-1/2 text-black font-semibold mt-10'>
            <span className='text-[1.5rem] pr-2'>Voice Your Experience</span>
            is all <br/> about unblocking insights, shaping policies and empowering Nigeria’s future!
          </div>

          <div className='flex flex-col gap-10 w-full'>
            {newsList?.map((news, index) =>
              <div key={index} className='bg-white flex flex-col rounded-xl gap-4 p-5'>
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

          <div className='w-full flex flex-col gap-5'>
            <div className='flex flex-row items-center text-black font-semibold gap-5 w-full'>
              <FaSquareEnvelope className='text-2xl' />
              <div className=''>support@vye.socials.com</div>
            </div>
            <div className='flex flex-row items-center text-black font-semibold gap-5 w-full'>
              <FaSquareFacebook className='text-2xl' />
              <FaSquareInstagram className='text-2xl' />
              <FaSquareXTwitter className='text-2xl' />
            </div>
          </div>

        </div>
        <div className={`${!selectedPin ? 'hidden' : ''} flex flex-col w-full gap-10 overflow-auto h-full`}>
          <div className='w-full flex flex-col gap-10 items-end text-[1.5rem] text-black font-semibold mt-10 p-10'>
            <FaWindowClose onClick={() => setSelectedPin('')} className='cursor-pointer'/>
            <div className='w-full text-[1.5rem] text-black font-semibold'>
              {pinDetail?.title} {pinDetail?.description} as at <span className='font-semibold'>{formatDate(pinDetail?._createdAt)}</span>
            </div>
          </div>

          <div className='flex flex-col w-full gap-5 px-10'>
            <div className='flex flex-col w-full'>
              <div className='text-[.9rem] gap-3 pb-2'>
                Comment
              </div>
              <textarea
                placeholder="leave a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className='w-full text-[.9rem] border rounded-lg bg-white border-gray-500 p-3 focus:outline-none'
              />
            </div>

            <div className="flex flex-row items-center gap-3 w-full">
              <BiSquare className={`${term === false ? '' : 'hidden'} text-2xl`} onClick={() => setTerm(true)}/>
              <BiCheckSquare className={`${term === true ? '' : 'hidden'} font-semibold text-2xl`} onClick={() => setTerm(false)}/>
              <div className="text-[0.875rem] text-dark-gray items-center">
                You consent to us using the data you have provided according to our <span className="font-semibold">Terms and Conditions</span>
              </div>
            </div>

            <div className='flex flex-col mt-5 w-full items-center'>
              <div onClick={addComment} className='bg-black py-2 w-full text-center text-lg text-white font-semibold rounded-lg cursor-pointer'>
                {!isSubmitting ? 'SUBMIT' : 'Submitting ....'}
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-10 w-full border-t p-10'>
            <div className='flex flex-row gap-3 items-center font-medium'>
              Top comments
              <FaCaretDown/>
            </div>
            {pinDetail.comments && pinDetail?.comments.map((comment : any, index: Key | null | undefined) =>
              <div key={index} className='flex flex-row items-start text-black gap-4'>
                <div className='flex flex-col items-center justify-center h-10 w-12 text-white text-sm rounded-full uppercase bg-[#2985e0]'>
                  {getFirstCharacters(comment.postedBy.userName)}
                </div>
                <div className='flex flex-col w-full'>
                  <div className='flex flex-row items-center justify-between w-full'>
                    <div className='capitalize text-[#2985e0] font-semibold'>{comment.postedBy.userName}</div>
                  </div>
                  <div className='text-gray-700'>{comment?.comment}</div>
                </div>
              </div>
            )}
          </div>

          <div className='w-full flex flex-col gap-5 p-10'>
            <div className='flex flex-row items-center text-black font-semibold gap-5 w-full'>
              <FaSquareEnvelope className='text-2xl' />
              <div className=''>support@vye.socials.com</div>
            </div>
            <div className='flex flex-row items-center text-black font-semibold gap-5 w-full'>
              <FaSquareFacebook className='text-2xl' />
              <FaSquareInstagram className='text-2xl' />
              <FaSquareXTwitter className='text-2xl' />
            </div>
          </div>

        </div>
        <div className={`${!viewMarketComment ? 'hidden' : ''} flex flex-col w-full gap-10 overflow-auto h-full`}>
          <div className='w-full flex flex-col gap-10 items-end text-[1.5rem] text-black font-semibold cursor-pointer mt-10 p-10'>
            <FaWindowClose onClick={() => setViewMarketComment(false)}/>
          </div>

          <div className='flex flex-col w-full gap-5 px-10'>
            <div className='flex flex-col w-full'>
              <div className='text-[.9rem] gap-3 pb-2'>
                Comment
              </div>
              <textarea
                placeholder="leave a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className='w-full text-[.9rem] border rounded-lg bg-white border-gray-500 p-3 focus:outline-none'
              />
            </div>

            <div className="flex flex-row items-center gap-3 w-full">
              <BiSquare className={`${term === false ? '' : 'hidden'} text-2xl`} onClick={() => setTerm(true)}/>
              <BiCheckSquare className={`${term === true ? '' : 'hidden'} font-semibold text-2xl`} onClick={() => setTerm(false)}/>
              <div className="text-[0.875rem] text-dark-gray items-center">
                You consent to us using the data you have provided according to our <span className="font-semibold">Terms and Conditions</span>
              </div>
            </div>

            <div className='flex flex-col mt-5 w-full items-center'>
              <div onClick={addMarketComment} className='bg-black py-2 w-full text-center text-lg text-white font-semibold rounded-lg cursor-pointer'>
                {!isSubmitting ? 'SUBMIT' : 'Submitting ....'}
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-10 w-full border-t p-10'>
            <div className='flex flex-row gap-3 items-center font-medium'>
              Top comments
              <FaCaretDown/>
            </div>
            {marketComments && marketComments.map((comment : any, index: Key | null | undefined) =>
              <div key={index} className='flex flex-row items-start text-black gap-4'>
                <div className='flex flex-col items-center justify-center h-10 w-12 text-white text-sm rounded-full uppercase bg-[#2985e0]'>
                  {getFirstCharacters(comment.postedBy.userName)}
                </div>
                <div className='flex flex-col w-full'>
                  <div className='flex flex-row items-center justify-between w-full'>
                    <div className='capitalize text-[#2985e0] font-semibold'>{comment.postedBy.userName}</div>
                  </div>
                  <div className='text-gray-700'>{comment?.comment}</div>
                </div>
              </div>
            )}
          </div>

          <div className='w-full flex flex-col gap-5 p-10'>
            <div className='flex flex-row items-center text-black font-semibold gap-5 w-full'>
              <FaSquareEnvelope className='text-2xl' />
              <div className=''>support@vye.socials.com</div>
            </div>
            <div className='flex flex-row items-center text-black font-semibold gap-5 w-full'>
              <FaSquareFacebook className='text-2xl' />
              <FaSquareInstagram className='text-2xl' />
              <FaSquareXTwitter className='text-2xl' />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default IndexRoutes;
