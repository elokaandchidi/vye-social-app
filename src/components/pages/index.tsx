import { useEffect, useState } from "react";
import { FaCaretDown} from "react-icons/fa6";
import { FaCircle, FaWindowClose } from "react-icons/fa";
import { BsCloudUploadFill } from "react-icons/bs";
import { BiCheckSquare, BiRadioCircle, BiRadioCircleMarked, BiSquare } from "react-icons/bi";

import Pagination from "../reuseables/pagination";

import {client} from "../../utils/client";
import {feedDetailQuery, feedQuery, feedSearchQuery, mainFeedQuery, marketCommentCountQuery, marketCommentQuery, marketQuery} from "../../utils/data";
import { useAlert } from "../../utils/notification/alertcontext";
import { EMAIL_REGEX } from "../../utils/regex";
import { AgeGroupList, ProductList, StateList, formatDate, getFirstCharacters, getRandomLightColor, getTimeAgo} from "../../utils/common";

import icon from '../../assets/images/success-icon.png';
import { isMobile } from "react-device-detect";
import { AiFillDislike, AiFillLike, AiFillMessage } from "react-icons/ai";

interface InfoDocument {
  _type: string;
  price: string;
  product: string;
  agegroup: string;
  gender: string;
  email: string;
  mobile: string;
  location: string;
  addtionalInfo: string;
  receiptImage?: {
    _type: string;
    asset: {
      _type: string;
      _ref: string;
    };
  };
  receiptFile?: {
    _type: string;
    asset: {
      _type: string;
      _ref: string;
    };
  };
}

interface pinInfo{
  _id: string;
  title: string;
  count: string;
  postedAt: string;
  category: string;
  description: string;
  _createdAt: string;
  commentCount: number;
  comments: any;
}

interface marketInfo{
  _id: string;
  currencyName: string;
  currencySymbol: string;
  price: string;
  _createdAt: string;
}

interface commentInfo{
  _id: string;
  name: string;
  comment: string;
  likes: number;
  dislikes: number;
  replies: any;
  postedAt: string;
  _createdAt: string;
}

interface MenuProps {
  isMinimize: boolean;
  searchTerm: string;
}

const Home = ({isMinimize, searchTerm} : MenuProps) => {
  const { addAlert } = useAlert();
  const [name, setName] = useState('');
  const [replyAs, setReplyAs] = useState('');
  const [term, setTerm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [comment, setComment] = useState('');
  const [totalPage, setTotalPage] = useState(0);
  const [replyComment, setReplyComment] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedPin, setSelectedPin] = useState('');
  const [selectedComment, setSelectedComment] = useState('');
  const [mainPin, setMainPin] = useState<pinInfo>({} as pinInfo);
  const [pins, setPins] = useState<pinInfo[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [markets, setMarkets] = useState<marketInfo[]>([]);
  const [marketCommentCount, setMarketCommentCount] = useState(0);
  const [pinDetail, setPinDetail] = useState<pinInfo>({} as pinInfo);
  
  const [marketComments, setMarketComments] = useState<commentInfo[]>([]);
  const [viewMarketComment, setViewMarketComment] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showAgeGroupDropdown, setShowAgeGroupDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [searchParams, setSearchParams] = useState({ page: 1, pageSize: 10, searchTerm: ''});
  const [formInfo, setFormInfo] = useState({price: '', product: '', agegroup: '', gender: '', email: '', mobile: '', location:'', file: null, addtionalInfo:''});
  
  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    setFileName(selectedFile.name)    
    setFormInfo({...formInfo, file: selectedFile});
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files[0];
    setFileName(selectedFile.name) 
    setFormInfo({...formInfo, file: selectedFile});
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };
  
  const handleSubmit = async () => {  
    setIsSubmitting(true);
    const { price, product, agegroup, gender, email, mobile, location, addtionalInfo, file } = formInfo;
  
    const requiredFields = [
      { field: product, message: 'Please select product' },
      { field: email, message: 'Please add email' },
      { field: mobile, message: 'Please add mobile' },
      { field: price, message: 'Please add price' },
      { field: location, message: 'Please select location' },
      { field: gender, message: 'Please select gender' },
      { field: agegroup, message: 'Please select age group' }
    ];
  
    for (const { field, message } of requiredFields) {
      if (!field) {
        setIsSubmitting(false);
        return addAlert({ message, type: 'error' });
      }
    }

    if(!EMAIL_REGEX.test(email)) {
      setIsSubmitting(false);
      return addAlert({ message:'Invalid email provided', type: 'error' });
    }
    
    if(!term) {
      setIsSubmitting(false);
      return addAlert({ message:'Please accept terms', type: 'error' });
    }
  
    let doc: InfoDocument = {
      _type: 'info',
      price,
      product,
      agegroup,
      gender,
      email,
      mobile,
      location,
      addtionalInfo
    };  
    
    if (file) {
      const {type, name} = file
      if (type === 'image/png' || type === 'image/jpg' || type === 'image/jpeg') {
        const uploadedFile = await client.assets.upload('image', file, {contentType: type, filename: name});
        doc = {
          ...doc,
          receiptImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: uploadedFile._id
            }
          }
        };
      } else {
        const uploadedFile = await client.assets.upload('file', file);
        doc = {
          ...doc,
          receiptFile: {
            _type: 'file',
            asset: {
              _type: 'reference',
              _ref: uploadedFile._id
            }
          }
        };
      }
    }

    try {
      await client.create(doc)
      setFormInfo({price: '', product: '', agegroup: '', gender: '', email: '', mobile: '', location:'', file: null, addtionalInfo:''})
      setTerm(false)
      setFileName('')
      setIsSuccess(true)
      setIsSubmitting(false);
      addAlert({ message: 'Form submitted successfully', type: 'success' });
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      addAlert({ message:'error occurred while submitting form', type: 'error' });
    }
  };

  const handleClosePinModal = () => {
    setSelectedPin('');
    setIsLoading(false);
    setPinDetail({} as pinInfo)
  };

  const handleCloseModal = () => {
    setViewMarketComment(false)
    setIsLoading(false);
  };

  const handlePin = (newValue : string) => {
    setSelectedPin(newValue);
  };

  const addPinComment = async () => {
    const requiredFields = [
      { field: name, message: 'Please enter your name' },
      { field: comment, message: 'Please leave a comment' },
      { field: term, message: 'Please agree to the terms and conditions' }
    ];

    for (const { field, message } of requiredFields) {
      if (!field) {
        setIsSubmitting(false); // Stop the submitting process
        return addAlert({ message, type: 'error' }); // Show error message
      }
    }

    const newComment = {
      _type: 'comment',
      name,
      comment,
      postedAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
      pin: {
        _type: 'reference',
        _ref: selectedPin,
      },
    };

    try {
      // Attempt to create the comment using the client's create method
      await client.create(newComment);
      setIsSubmitting(false); // Update submitting state
      addAlert({ message: 'Comment added successfully', type: 'success' }); // Show success message

      // Reset input fields and checkbox
      setName('');
      setComment('');
      setTerm(false);
      
      setTimeout(() => {
        fetchPinDetails();
      }, 60000);
      
    } catch (error) {
      console.error(error); // Log error to console
      setIsSubmitting(false); // Update submitting state on error
      addAlert({ message: 'Error occurred while submitting comment', type: 'error' }); // Show error alert
    }
  };

  const addMarketComment = async () => {
    const requiredFields = [
      { field: name, message: 'Please enter your name' },
      { field: comment, message: 'Please leave a comment' },
      { field: term, message: 'Please agree to the terms and conditions' }
    ];

    for (const { field, message } of requiredFields) {
      if (!field) {
        setIsSubmitting(false); // Stop the submitting process
        return addAlert({ message, type: 'error' }); // Show error message
      }
    }

    const newComment = {
      _type: 'marketComment',
      name,
      comment,
      postedAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      isReply: false,
      replies: [],
    };

    try {
      // Attempt to create the comment using the client's create method
      await client.create(newComment);
      setIsSubmitting(false); // Update submitting state
      addAlert({ message: 'Comment added successfully', type: 'success' }); // Show success message

      // Reset input fields and checkbox
      setName('');
      setComment('');
      setTerm(false);
      
      setTimeout(() => {
        fetchMarketComments();
      }, 60000);
      
    } catch (error) {
      console.error(error); // Log error to console
      setIsSubmitting(false); // Update submitting state on error
      addAlert({ message: 'Error occurred while submitting comment', type: 'error' }); // Show error alert
    }
  };

  const handleLike = async (id : string) => {
    await client.patch(id).inc({ likes: 1 }).commit();

    addAlert({ message: 'Comment Liked successfully', type: 'success' }); // Show success message

    setTimeout(() => {
      viewMarketComment ? fetchMarketComments() :fetchPinDetails();
    }, 70000);
  };

  const handleDislike = async (id: string) => {
    await client.patch(id).inc({ dislikes: 1 }).commit();
    addAlert({ message: 'Comment DisLiked successfully', type: 'success' }); // Show success message

    setTimeout(() => {
      viewMarketComment ? fetchMarketComments() :fetchPinDetails();
    }, 70000);
  };

  const createReplyAndAddToComment = async () =>{
    const requiredFields = [
      { field: replyAs, message: 'Please enter the name you want to reply as' },
      { field: replyComment, message: 'Please leave a comment' },
    ];

    for (const { field, message } of requiredFields) {
      if (!field) {
        setIsSubmitting(false); // Stop the submitting process
        return addAlert({ message, type: 'error' }); // Show error message
      }
    }

    const replyData = {
      name : replyAs,
      comment : replyComment,
      postedAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
    };    

    try {
      // Step 1: Create the reply document
      const createdReply = await client.create({
        _type: 'comment',
        ...replyData
      });
    
      // Step 2: Add the created reply to the parent comment's replies
      await client
        .patch(selectedComment)
        .setIfMissing({ replies: [] }) // Ensure the replies field exists
        .append('replies', [
          {
            _key: createdReply._id,
            _type: 'reference',
            _ref: createdReply._id
          }
        ])
        .commit();
      addAlert({ message: 'Comment updated with new reply', type: 'success' });

      setReplyAs('');
      setReplyComment('');
      setSelectedComment('');
      
      setTimeout(() => {
        fetchPinDetails();
      }, 60000);
    } catch (error) {
      console.error(error);
      addAlert({ message: 'Error creating reply and adding to comment', type: 'error' });
    }
  }
  
  const createReplyAndAddToCommentForMarket = async () =>{
    const requiredFields = [
      { field: replyAs, message: 'Please enter the name you want to reply as' },
      { field: replyComment, message: 'Please leave a comment' },
    ];

    for (const { field, message } of requiredFields) {
      if (!field) {
        setIsSubmitting(false); // Stop the submitting process
        return addAlert({ message, type: 'error' }); // Show error message
      }
    }

    const replyData = {
      name : replyAs,
      comment : replyComment,
      postedAt: new Date().toISOString(),
      isReply: true,
      likes: 0,
      dislikes: 0,
    };    

    try {
      // Step 1: Create the reply document
      const createdReply = await client.create({
        _type: 'marketComment',
        ...replyData
      });
    
      // Step 2: Add the created reply to the parent comment's replies
      await client
        .patch(selectedComment)
        .setIfMissing({ replies: [] }) // Ensure the replies field exists
        .append('replies', [
          {
            _key: createdReply._id,
            _type: 'reference',
            _ref: createdReply._id
          }
        ])
        .commit();
      addAlert({ message: 'Comment updated with new reply', type: 'success' });

      setReplyAs('');
      setReplyComment('');
      setSelectedComment('');
      
      setTimeout(() => {
        fetchMarketComments();
      }, 60000);
    } catch (error) {
      console.error(error);
      addAlert({ message: 'Error creating reply and adding to comment', type: 'error' });
    }
  }

  const fetchPinDetails = () => {
    setIsLoading(true);
    let query = feedDetailQuery(selectedPin);

    if(query) {
      client.fetch(query)
      .then((data) => {       
        setPinDetail(data[0]);        
        setIsLoading(false);
      })
    }
  }

  const fetchMarketComments = async () => {
    setIsLoading(true);
    await client.fetch(marketCommentQuery)
    .then((data) => {
      setMarketComments(data);
      setIsLoading(false);
    })
  }

  const fetchPinsBySearch = () =>{
    setIsLoading(true);
    setIsSearch(false);
    setSearchParams({...searchParams, searchTerm: searchTerm});
    const query = feedSearchQuery(searchParams);
    
    client.fetch(query)
    .then((data) => {
      setPins(data);
      setIsLoading(false);
    })
  }

  const onPageChange = (page: number) => {
    setSearchParams({...searchParams, page: page});
    fetchPinsBySearch();
  }

  const onPageSizeChange = (pageSize: number) => {
    setSearchParams({...searchParams, pageSize: pageSize});
    fetchPinsBySearch();
  }
  
  useEffect(() => {
    if (pins.length === 0) {
      client.fetch(feedQuery(searchParams))
      .then((data) => {
        setPins(data);
      })
      client.fetch(mainFeedQuery())
      .then((data) => {
        setMainPin(data[0]);
      })
    }
  }, [ isLoading]);

  useEffect(() => {
    setIsLoading(true);
    setIsSearch(true);    
    
    if(searchTerm !== '' && isSearch){
      fetchPinsBySearch();
    }else {
      client.fetch(feedQuery(searchParams))
      .then((data) => {
        setPins(data);
      })
    }

    const countQuery = `count(*[_type == "pin"])`

    client.fetch(countQuery)
    .then((data : number) => {
      setTotalPage(Math.ceil(data / searchParams.pageSize));
    })

    // eslint-disable-next-line
  }, [searchParams, searchTerm]);
  
  useEffect(() => {
    if (markets.length === 0) {
      let query = marketQuery();

      if(query) {
        client.fetch(query)
        .then((data) => {
          setMarkets(data);
        })
      }

      client.fetch(marketCommentCountQuery)
      .then((data) => {        
        setMarketCommentCount(data);
      })
    }
  })

  useEffect(() => {
    if (selectedPin) {
      fetchPinDetails();
    }
  }, [selectedPin]);

  useEffect(() => {
    if (viewMarketComment) {
      fetchMarketComments();
    }
  }, [viewMarketComment]);

  return (
    <div className={`${isMinimize ? 'w-3/4' : 'w-full'} flex flex-col gap-5 lg:items-center h-full overflow-auto lg:text-[1.5rem] text-[1rem] lg:px-20 p-5 transaction-height duration-75 ease-out`}>
      <div className={`${!selectedPin && pinDetail?.title === undefined ? 'hidden' : ''} flex flex-col items-end fixed w-full z-50 top-0 right-0 bg-gray-100 bg-opacity-40 gap-10 h-screen`}>
        {!isLoading ?
          <div className={`${isMobile ? 'w-5/6' : 'w-1/4'} flex flex-col p-10 bg-white overflow-auto h-full pb-[4rem]`}>
            <div className='w-full flex flex-row items-start justify-between text-[1.5rem] text-black font-semibold'>
              <div className='w-5/6 text-[1.4rem] leading-tight text-black font-semibold'>
                {pinDetail?.count} {pinDetail?.description} as at <span className='font-semibold'>{formatDate(pinDetail?._createdAt)}</span>
              </div>
              <FaWindowClose onClick={() => handleClosePinModal()} className='cursor-pointer text-[#2985e0]'/>
            </div>
            <div className='text-[.9rem] my-4 gap-3 pb-2'>
              {pinDetail?.comments?.length} Comments
            </div>
            <div className='flex flex-col w-full gap-5'>
              <div className='flex flex-col w-full'>
                <textarea
                  rows={4}
                  placeholder="Share your thoughts"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className='w-full text-[.9rem] border rounded-lg bg-white border-gray-500 p-3 focus:outline-none'
                />
              </div>
              <input
                type="text"
                className="w-full text-[.9rem] border rounded-lg bg-white border-gray-500 p-3 focus:outline-none"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="flex flex-row items-center gap-3 w-full">
                <input
                  type="checkbox"
                  checked={term}
                  className="accent-[#2985e0]"
                  onChange={() => setTerm(!term)}
                />
                <div className="text-[0.875rem] text-dark-gray items-center">
                  You consent to us using the data you have provided according to our <span className="font-semibold text-[#2985e0]">Terms and Conditions</span>
                </div>
              </div>

              <div className='flex flex-col mt-5 w-full items-center'>
                <div onClick={addPinComment} className='bg-[#2985e0] py-2 w-full text-center text-[1rem] text-white font-semibold uppercase rounded-lg cursor-pointer'>
                  {!isSubmitting ? 'Post Comment' : 'Posting comment ....'}
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-5 w-full mt-14 pt-8 border-t-2'>
              <div className='flex flex-row text-[1rem] gap-3 items-center'>
                Top comments
                <FaCaretDown className='text-[#2985e0]'/>
              </div>
              {pinDetail.comments && pinDetail?.comments.map((comment : any) =>
                <div key={comment._id} className='flex flex-row items-start text-black gap-4 border-b pb-3'>
                  <div style={{ backgroundColor: getRandomLightColor() }} className={`flex flex-col items-center justify-center w-12 h-10 text-black text-[.7rem] rounded-full uppercase`}>
                    {getFirstCharacters(comment.name)}
                  </div>
                  <div className='flex flex-col w-full text-sm'>
                    <div className='flex flex-row gap-3 items-center w-full'>
                      <div className='capitalize text-[#2985e0] font-semibold'>{comment.name}</div>
                      <div className="text-[.69rem] text-gray-500 flex flex-row items-center gap-1">
                          <FaCircle className="text-[.4rem]" /> {getTimeAgo(comment.postedAt)}
                      </div>
                    </div>
                    <div className='text-gray-700'>{comment?.comment}</div>
                    <div className='flex flex-row gap-2 py-3 items-center'>
                      <div className='flex flex-row gap-1 items-center'>
                        <AiFillLike onClick={() => handleLike(comment._id)}  className='text-[#2985e0] cursor-pointer'/>
                        <div className={`${comment.likes === 0 ? 'hidden' : ''}`}>{comment.likes}</div>
                      </div>
                      <div className='flex flex-row gap-1 items-center'>
                        <AiFillDislike className='cursor-pointer' onClick={() => handleDislike(comment._id)}/>
                        <div className={`${comment.dislikes === 0 ? 'hidden' : ''}`}>{comment.dislikes}</div>
                      </div>
                      <div onClick={() => setSelectedComment(comment._id === selectedComment ? '' : comment._id)} className='flex flex-row gap-1 items-center cursor-pointer'>
                        <AiFillMessage className=''/>
                        <div className='text-xs'>Reply</div>
                      </div>
                    </div>
                    <div className={`${comment._id !== selectedComment ? 'hidden' : ''} flex flex-col w-full gap-5`}>
                      <div className='flex flex-col w-full'>
                        <textarea
                          rows={3}
                          placeholder="Share your thoughts"
                          value={replyComment}
                          onChange={(e) => setReplyComment(e.target.value)}
                          className='w-full text-[.9rem] border rounded-lg bg-white border-gray-500 p-3 focus:outline-none'
                        />
                      </div>
                      <input
                        type="text"
                        className="w-full text-[.9rem] border rounded-lg bg-white border-gray-500 p-3 focus:outline-none"
                        placeholder="Reply As"
                        value={replyAs}
                        onChange={(e) => setReplyAs(e.target.value)}
                      />

                      <div className='flex flex-col mt-5 w-full items-center'>
                        <div onClick={createReplyAndAddToComment} className='bg-[#2985e0] py-2 w-full text-center text-[1rem] text-white font-semibold uppercase rounded-lg cursor-pointer'>
                          {!isSubmitting ? 'Reply comment' : 'Replying comment ....'}
                        </div>
                      </div>
                    </div>
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-4 mt-2">
                        {comment.replies.map((reply: any) => (
                          <div key={reply._id} className='flex flex-row items-start text-black gap-4 border-b py-3'>
                            <div style={{ backgroundColor: getRandomLightColor() }} className={`flex flex-col items-center justify-center w-12 h-10 text-black text-[.7rem] rounded-full uppercase`}>
                              {getFirstCharacters(reply.name)}
                            </div>
                            <div className='flex flex-col w-full text-sm'>
                              <div className='flex flex-row gap-3 items-center w-full'>
                                <div className='capitalize text-[#2985e0] font-semibold'>{reply.name}</div>
                                <div className="text-[.69rem] text-gray-500 flex flex-row items-center gap-1">
                                    <FaCircle className="text-[.4rem]" /> {getTimeAgo(reply.postedAt)}
                                </div>
                              </div>
                              <div className='text-gray-700'>{reply?.comment}</div>
                              <div className='flex flex-row gap-2 pt-3 items-center'>
                                <div className='flex flex-row gap-1 items-center'>
                                  <AiFillLike onClick={() => handleLike(reply._id)}  className='text-[#2985e0] cursor-pointer'/>
                                  <div className={`${reply.likes === 0 ? 'hidden' : ''}`}>{reply.likes}</div>
                                </div>
                                <div className='flex flex-row gap-1 items-center'>
                                  <AiFillDislike className='cursor-pointer' onClick={() => handleDislike(reply._id)}/>
                                  <div className={`${reply.dislikes === 0 ? 'hidden' : ''}`}>{reply.dislikes}</div>
                                </div>
                              
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          :
          <div className='h-full lg:w-1/4 w-5/6 flex flex-col bg-white items-center justify-center font-semibold'>
            <div className='ping'>
              Please wait ....
            </div>
          </div>
        }
      </div>

      <div className={`${!viewMarketComment ? 'hidden' : ''} flex flex-col items-end fixed w-full top-0 right-0 z-50 bg-gray-100 bg-opacity-40 gap-10 h-screen`}>
      {!isLoading ?
        <div className={`${isMobile ? 'w-5/6' : 'w-1/4'} flex flex-col p-10 bg-white overflow-auto pb-[4rem] h-full`}>
          <div className='w-full flex flex-row items-start justify-end text-[1.5rem] text-black font-semibold'>
            <FaWindowClose onClick={() => handleCloseModal()} className='cursor-pointer text-[#2985e0]'/>
          </div>
          <div className='text-[.9rem] my-4 gap-3 pb-2'>
            {marketComments?.length} Comments
          </div>
          <div className='flex flex-col w-full gap-5'>
            <div className='flex flex-col w-full'>
              <textarea
                rows={4}
                placeholder="Share your thoughts"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className='w-full text-[.9rem] border rounded-lg bg-white border-gray-500 p-3 focus:outline-none'
              />
            </div>
            <input
              type="text"
              className="w-full text-[.9rem] border rounded-lg bg-white border-gray-500 p-3 focus:outline-none"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="flex flex-row items-center gap-3 w-full">
              <input
                type="checkbox"
                checked={term}
                className="accent-[#2985e0]"
                onChange={() => setTerm(!term)}
              />
              <div className="text-[0.875rem] text-dark-gray items-center">
                You consent to us using the data you have provided according to our <span className="font-semibold text-[#2985e0]">Terms and Conditions</span>
              </div>
            </div>

            <div className='flex flex-col mt-5 w-full items-center'>
              <div onClick={addMarketComment} className='bg-[#2985e0] py-2 w-full text-center text-[1rem] text-white font-semibold uppercase rounded-lg cursor-pointer'>
                {!isSubmitting ? 'Post Comment' : 'Posting comment ....'}
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-5 w-full mt-14 pt-8 border-t-2'>
            <div className='flex flex-row text-[1rem] gap-3 items-center'>
              Top comments
              <FaCaretDown className='text-[#2985e0]'/>
            </div>
            {marketComments && marketComments.map((comment : any) =>
              <div key={comment._id} className='flex flex-row items-start text-black gap-4 border-b pb-3'>
                <div style={{ backgroundColor: getRandomLightColor() }} className={`flex flex-col items-center justify-center w-12 h-10 text-black text-[.7rem] rounded-full uppercase`}>
                  {getFirstCharacters(comment.name)}
                </div>
                <div className='flex flex-col w-full text-sm'>
                  <div className='flex flex-row gap-3 items-center w-full'>
                    <div className='capitalize text-[#2985e0] font-semibold'>{comment.name}</div>
                    <div className="text-[.69rem] text-gray-500 flex flex-row items-center gap-1">
                        <FaCircle className="text-[.4rem]" /> {getTimeAgo(comment.postedAt)}
                    </div>
                  </div>
                  <div className='text-gray-700'>{comment?.comment}</div>
                  <div className='flex flex-row gap-2 py-3 items-center'>
                    <div className='flex flex-row gap-1 items-center'>
                      <AiFillLike onClick={() => handleLike(comment._id)}  className='text-[#2985e0] cursor-pointer'/>
                      <div className={`${comment.likes === 0 ? 'hidden' : ''}`}>{comment.likes}</div>
                    </div>
                    <div className='flex flex-row gap-1 items-center'>
                      <AiFillDislike className='cursor-pointer' onClick={() => handleDislike(comment._id)}/>
                      <div className={`${comment.dislikes === 0 ? 'hidden' : ''}`}>{comment.dislikes}</div>
                    </div>
                    <div onClick={() => setSelectedComment(comment._id === selectedComment ? '' : comment._id)} className='flex flex-row gap-1 items-center cursor-pointer'>
                      <AiFillMessage className=''/>
                      <div className='text-xs'>Reply</div>
                    </div>
                  </div>
                  <div className={`${comment._id !== selectedComment ? 'hidden' : ''} flex flex-col w-full gap-5`}>
                    <div className='flex flex-col w-full'>
                      <textarea
                        rows={3}
                        placeholder="Share your thoughts"
                        value={replyComment}
                        onChange={(e) => setReplyComment(e.target.value)}
                        className='w-full text-[.9rem] border rounded-lg bg-white border-gray-500 p-3 focus:outline-none'
                      />
                    </div>
                    <input
                      type="text"
                      className="w-full text-[.9rem] border rounded-lg bg-white border-gray-500 p-3 focus:outline-none"
                      placeholder="Reply As"
                      value={replyAs}
                      onChange={(e) => setReplyAs(e.target.value)}
                    />

                    <div className='flex flex-col mt-5 w-full items-center'>
                      <div onClick={createReplyAndAddToCommentForMarket} className='bg-[#2985e0] py-2 w-full text-center text-[1rem] text-white font-semibold uppercase rounded-lg cursor-pointer'>
                        {!isSubmitting ? 'Reply comment' : 'Replying comment ....'}
                      </div>
                    </div>
                  </div>
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-4 mt-2">
                      {comment.replies.map((reply: any) => (
                        <div key={reply._id} className='flex flex-row items-start text-black gap-4 border-b pb-3'>
                          <div style={{ backgroundColor: getRandomLightColor() }} className={`flex flex-col items-center justify-center w-12 h-10 text-black text-[.7rem] rounded-full uppercase`}>
                            {getFirstCharacters(reply.name)}
                          </div>
                          <div className='flex flex-col w-full text-sm'>
                            <div className='flex flex-row gap-3 items-center w-full'>
                              <div className='capitalize text-[#2985e0] font-semibold'>{reply.name}</div>
                              <div className="text-[.69rem] text-gray-500 flex flex-row items-center gap-1">
                                  <FaCircle className="text-[.4rem]" /> {getTimeAgo(reply.postedAt)}
                              </div>
                            </div>
                            <div className='text-gray-700'>{reply?.comment}</div>
                            <div className='flex flex-row gap-2 py-3 items-center'>
                              <div className='flex flex-row gap-1 items-center'>
                                <AiFillLike onClick={() => handleLike(reply._id)}  className='text-[#2985e0] cursor-pointer'/>
                                <div className={`${reply.likes === 0 ? 'hidden' : ''}`}>{reply.likes}</div>
                              </div>
                              <div className='flex flex-row gap-1 items-center'>
                                <AiFillDislike className='cursor-pointer' onClick={() => handleDislike(reply._id)}/>
                                <div className={`${reply.dislikes === 0 ? 'hidden' : ''}`}>{reply.dislikes}</div>
                              </div>
                            
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        :
        <div className='h-full lg:w-1/4 w-5/6 flex flex-col bg-white items-center justify-center font-semibold'>
          <div className='ping'>
            Please wait ....
          </div>
        </div>
      }

      </div>
      
      <div className='flex flex-col w-full lg:mt-10 mt-5'>
        <div className='mt-5 text-[1.5rem] font-semibold'>{mainPin.title}</div>
        <div className='flex flex-col justify-between items-center w-full border mt-10 border-gray-200 gap-10 rounded-xl p-5 cursor-pointer'>
          <div className="flex flex-col gap-5 items-center w-full">
            <div className='text-[4rem] font-semibold'>{mainPin.count}</div>
            <div className='text-lg text-gray-700 w-full text-start '>
              {mainPin.description} as at <span className='font-semibold'>{formatDate(mainPin?.postedAt)}</span>
            </div>

          </div>
          <div className='flex flex-row items-center justify-between text-gray-700 text-lg w-full'>
            <div className='bg-[#f7f7f7] rounded-full px-4 py-1 text-sm text-black'>
              {mainPin.category}
            </div>
            <div onClick={()=> handlePin(mainPin._id)} className="flex flex-row bg-comment bg-no-repeat bg-cover items-center justify-center h-9 w-9 text-sm text-white font-semibold">
              <div className=''>{mainPin.comments?.length}</div>
            </div>
          </div>
        </div>
        <div className={`${isMobile ? 'grid-cols-1 gap-10' :'grid-cols-3 gap-5'} mt-10 grid w-full`}>
          <div className='flex flex-col justify-between w-full relative border border-gray-200 gap-5 rounded-xl p-5'>
            <div className="flex flex-col gap-3 w-full">
              <div className='mt-5 mb-2 text-lg text-center font-semibold'>Exchange rate</div>
              {markets?.map((market) =>
                <div key={market._id} className='flex flex-row items-center justify-between text-gray-700 lg:text-lg text-sm w-full'>
                  <div className='flex flex-row items-center gap-3 font-semibold text-black'>
                    <div className='bg-black h-8 w-8 flex flex-col justify-center items-center rounded-full text-sm text-white'>{market.currencySymbol}</div>
                    <div className='lg:text-[1.3rem] text-lg'>{market.currencyName}</div>
                  </div>
                  <div className=''>{market.price}</div>
                </div>
              )}
            </div>
            <div className='flex flex-row items-center justify-between mt-3 text-gray-700 text-lg w-full'>
              <div className='bg-[#f7f7f7] rounded-full px-4 py-1 text-sm text-black'>
                Exchange rate
              </div>
              <div onClick={()=> setViewMarketComment(true)} className="flex flex-row bg-comment bg-no-repeat bg-cover items-center justify-center cursor-pointer h-9 w-9 text-sm text-white font-semibold">
                <div className=''>{marketCommentCount}</div>
              </div>
            </div>
          </div>
          {pins?.map((pin) => 
            <div key={pin._id} className='flex flex-col justify-between items-center w-full border border-gray-200 gap-5 rounded-xl p-5 cursor-pointer'>
              <div className="flex flex-col gap-3 items-center w-full">
                <div className='mt-5 text-lg font-semibold'>{pin.title}</div>
                <div className='text-[3rem] font-semibold'>{pin.count}</div>
                <div className='text-lg text-gray-700'>
                  {pin.description} as at <span className='font-semibold'>{formatDate(pin?.postedAt)}</span>
                </div>

              </div>
              <div className='flex flex-row items-center justify-between text-gray-700 text-lg w-full'>
                <div className='bg-[#f7f7f7] rounded-full px-4 py-1 text-sm text-black'>
                  {pin.category}
                </div>
                <div onClick={()=> handlePin(pin._id)} className="flex flex-row bg-comment bg-no-repeat bg-cover items-center justify-center h-9 w-9 text-sm text-white font-semibold">
                  <div className=''>{pin.comments.length}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Pagination currentPage={searchParams.page} dataLength={pins.length} pageSize={searchParams.pageSize} totalPages={totalPage} onPageSizeChange={onPageSizeChange} onPageChange={onPageChange} />
      </div>
      {!isSuccess ? (
        <div className='flex flex-col lg:px-16 lg:p-12 lg:w-2/3'>
          <div className="w-full text-2xl lg:font-semibold">
            April’s survey: [Survey name]
          </div>
          <div className="w-full mt-2 text-gray-700 lg:text-lg text-[.8rem]">
            Your voice matters! Join the conversation by filling the form below.
          </div>

          <div className='flex flex-col mt-10 gap-5'>
            <div className="flex flex-col relative w-full">
              <label className="text-[0.875rem] pb-2">Product or Service</label>
              <div className='flex flex-row items-center p-3 border border-gray-500 rounded-lg justify-between w-full text-center'>
                <input type='text' value={formInfo.product} placeholder="Select the product or service you purchased" readOnly className='w-full text-[.9rem] focus:outline-none'/>
                <FaCaretDown onClick={()=> setShowProductDropdown(!showProductDropdown)} className='cursor-pointer'/>
              </div>
              <div className={`${showProductDropdown ? '' : 'hidden' } flex mt-[5rem] text-[.9rem] z-30 h-[10rem] overflow-auto bg-white rounded-b-lg absolute shadow-lg w-full text-blue flex-col`}>
                {ProductList?.map((product, index) => 
                  <div key={index} onClick={() =>[setFormInfo({ ...formInfo, product: product }), setShowProductDropdown(!showProductDropdown)]} className='flex flex-row hover:bg-black hover:text-white capitalize py-2 px-3 cursor-pointer'>
                    {product}
                  </div>
                )}
              </div>
            </div>
            <div className='flex flex-col w-full'>
              <div className='text-[.9rem] gap-3'>
                Price (in Naira ₦)
              </div>
              <input
                type="number"
                placeholder="Enter price of product or service here"
                value={formInfo.price}
                onChange={({ target}) => {setFormInfo({ ...formInfo, price: target.value })}}
                className='w-full mt-3 text-[.9rem] border rounded-lg bg-transparent border-gray-500 p-3 focus:outline-none'
              />
            </div>
            <div className="flex flex-col relative w-full">
              <label className="text-[0.875rem] pb-2">Location</label>
              <div className='flex flex-row items-center p-3 border border-gray-500 rounded-lg justify-between w-full text-center'>
                <input type='text' placeholder="Select location" readOnly value={formInfo.location} className='w-full text-[.9rem] focus:outline-none'/>
                <FaCaretDown onClick={()=> setShowLocationDropdown(!showLocationDropdown)} className='cursor-pointer'/>
              </div>
              <div className={`${showLocationDropdown ? '' : 'hidden' } flex mt-[5rem] text-[.9rem] z-30 h-[10rem] overflow-auto bg-white rounded-b-lg absolute shadow-lg w-full text-blue flex-col`}>
                {StateList?.map((state, index) => 
                  <div key={index} onClick={() =>[setFormInfo({ ...formInfo, location: state }), setShowLocationDropdown(!showLocationDropdown)]} className='flex flex-row hover:bg-black hover:text-white capitalize py-2 px-3 cursor-pointer'>
                    {state}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col w-full items-start">
              <label className="text-[0.875rem] pb-2">Gender</label>
              <div className='flex flex-row text-[.9rem] items-center gap-3 justify-start'>
                <div className='flex flex-row items-center gap-3 justify-start'>
                  <BiRadioCircle className={`${(formInfo.gender === 'female' ) ? 'hidden' : ''} text-xl`} onClick={() => setFormInfo({ ...formInfo, gender: 'female' })} />
                  <BiRadioCircleMarked className={`${formInfo.gender !== 'female' ? 'hidden' : ''} text-xl`}/>
                  Female
                </div>
                <div className='flex flex-row items-center gap-3 justify-start'>
                  <BiRadioCircle className={`${formInfo.gender === 'male' ? 'hidden' : ''} text-xl`} onClick={() => setFormInfo({ ...formInfo, gender: 'male' })} />
                  <BiRadioCircleMarked className={`${formInfo.gender !== 'male' ? 'hidden' : ''} text-xl`}/>
                  Male
                </div>
              </div>
            </div>
            <div className="flex flex-col relative w-full">
              <label className="text-[0.875rem] pb-2">Age</label>
              <div className='flex flex-row items-center p-3 border border-gray-500 rounded-lg justify-between w-full text-center'>
                <input type='text' placeholder="Select age group" value={formInfo.agegroup} readOnly className='w-full text-[.9rem] focus:outline-none'/>
                <FaCaretDown onClick={()=> setShowAgeGroupDropdown(!showAgeGroupDropdown)} className='cursor-pointer'/>
              </div>
              <div className={`${showAgeGroupDropdown ? '' : 'hidden' } flex mt-[5rem] text-[.9rem] z-30 bg-white rounded-b-lg absolute shadow-lg w-full text-blue flex-col`}>
                {AgeGroupList?.map((age, index) => 
                  <div key={index} onClick={() =>[setFormInfo({ ...formInfo, agegroup: age }), setShowAgeGroupDropdown(!showAgeGroupDropdown)]} className='flex flex-row hover:bg-black hover:text-white capitalize py-2 px-3 cursor-pointer'>
                    {age}
                  </div>
                )}
              </div>
            </div>
            <div className='flex flex-col w-full'>
              <div className='text-[.9rem] gap-3 pb-2'>
                Email
              </div>
              <input
                type="email"
                placeholder="Enter your email address"
                value={formInfo.email}
                onChange={({ target}) => {setFormInfo({ ...formInfo, email: target.value })}}
                className='w-full text-[.9rem] border rounded-lg bg-transparent border-gray-500 p-3 focus:outline-none'
              />
            </div>

            <div className='flex flex-col w-full'>
              <div className='text-[.9rem] gap-3 pb-2'>
                Phone Number
              </div>
              <input
                type="number"
                placeholder="Enter your phone number"
                value={formInfo.mobile}
                onChange={({ target}) => {setFormInfo({ ...formInfo, mobile: target.value })}}
                className='w-full text-[.9rem] border rounded-lg bg-transparent border-gray-500 p-3 focus:outline-none'
              />
            </div>

            <div className='flex flex-col w-full'>
              <div className='text-[.9rem] gap-3 pb-2'>
                Receipt (optional)
              </div>
              <div
                  className="border-dashed border flex flex-col gap-2 items-center border-gray-400 p-4 rounded-lg cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {fileName ? (
                    <div className='text-[1rem]'>{fileName}</div>
                  ) : (
                    <BsCloudUploadFill className="text-black text-[1.5rem]"/>
                  )}

                  <label htmlFor="fileInput" className="cursor-pointer text-[.9rem]">
                    Drop your file here or <span className="font-semibold">click here</span> to upload
                  </label>
                  <span className='text-[.6rem]'>File should be PNG, JPEG, JPG, PDF, DOC (max 2MB)</span>
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
              </div>
            </div>

            <div className='flex flex-col w-full'>
              <div className='text-[.9rem] gap-3'>
                Addtional Info
              </div>
              <textarea
                value={formInfo.addtionalInfo}
                onChange={({ target}) => {setFormInfo({ ...formInfo, addtionalInfo: target.value })}}
                className='w-full mt-3 text-[.9rem] border rounded-lg bg-transparent border-gray-500 p-3 focus:outline-none'
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
              <div onClick={handleSubmit} className='bg-[#2985E0] py-2 px-16 text-lg text-white font-semibold rounded-lg cursor-pointer'>
                {!isSubmitting ? 'SUBMIT' : 'Submitting ....'}
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className='flex flex-col gap-5 items-center md:p-10 p-5 lg:w-3/5 w-2/3 lg:mb-0 mb-32 lg:mt-0 mt-20'>
          <img src={icon} alt='logo' className=''/>
          <div className={`lg:text-[2rem] text-xl text-center font-semibold`}>
            We’ve got your data🎉
          </div>
          <div className="w-full text-gray-500 text-center lg:text-sm text-[.8rem]">
            The information you provide will be utilised solely for analytical purposes, helping us decode trends and consumer behaviours in Nigeria. We're committed to safeguarding your privacy and using this data responsibly to inform policies and drive strategic investments. Thank you for contributing to shaping a brighter future for Nigeria.
          </div>

          <div className='flex flex-col w-full mt-7 items-center'>
            <div onClick={() => setIsSuccess(false)} className='bg-[#2985E0] cursor-pointer py-3 px-10 flex flex-row gap-3 items-center text-white font-semibold rounded-lg'>
              Submit another response
            </div>
          </div>

        </div>
      ) }      
    </div>
  )
}

export default Home;
