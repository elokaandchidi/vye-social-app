import { useEffect, useState } from "react";
import { FaCaretDown} from "react-icons/fa6";
import { NavLink } from 'react-router-dom';
import { FaCircle, FaWindowClose } from "react-icons/fa";
import { BsCloudUploadFill } from "react-icons/bs";
import { BiCheckSquare, BiSquare } from "react-icons/bi";

import Pagination from "../reuseables/pagination";

import {client} from "../../utils/client";
import {feedDetailQuery, feedQuery, feedSearchQuery, formQuery, mainFeedQuery, marketCommentCountQuery, marketCommentQuery, marketQuery} from "../../utils/data";
import { useAlert } from "../../utils/notification/alertcontext";
import { EMAIL_REGEX } from "../../utils/regex";
import { getFirstCharacters, getRandomLightColor, getTimeAgo} from "../../utils/common";

import icon from '../../assets/images/success-icon.png';
import { isMobile } from "react-device-detect";
import { AiFillDislike, AiFillLike, AiFillMessage } from "react-icons/ai";

interface pinInfo{
  _id: string;
  title: string;
  source: string;
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
  source: string;
  market: any;
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
  const [selectedPin, setSelectedPin] = useState('');
  const [selectedComment, setSelectedComment] = useState('');
  const [mainPin, setMainPin] = useState<pinInfo>({} as pinInfo);
  const [pins, setPins] = useState<pinInfo[]>([]);
  const [surveyForm, setSurveyForm] = useState({} as any);
  const [fileNames, setFileNames] = useState({} as any);
  const [fileData, setFileData] = useState({} as any);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [markets, setMarkets] = useState<marketInfo>({} as marketInfo);
  const [marketCommentCount, setMarketCommentCount] = useState(0);
  const [pinDetail, setPinDetail] = useState<pinInfo>({} as pinInfo);
  
  const [marketComments, setMarketComments] = useState<commentInfo[]>([]);
  const [viewMarketComment, setViewMarketComment] = useState(false);
  const [searchParams, setSearchParams] = useState({ page: 1, pageSize: 10, searchTerm: ''});
  const [formInfo, setFormInfo] = useState({} as any);

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormInfo((prevState:any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e:any, fieldLabel: string) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFileData({
        ...fileData,
        [fieldLabel]: files[0],
      });
      setFileNames({
        ...fileNames,
        [fieldLabel]: files[0].name,
      });
    }
  };

  const handleDragOver = (e:any) => {
    e.preventDefault();
  };

  const handleDrop = (e:any, fieldLabel: string) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFileData({
        ...fileData,
        [fieldLabel]: files[0],
      });
      setFileNames({
        ...fileNames,
        [fieldLabel]: files[0].name,
      });
    }
  };

  const validateFile = (file: any) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      return 'File type should be PNG, JPEG, or JPG';
    }

    if (file.size > maxSize) {
      return 'File size should be less than 2MB';
    }

    return '';
  };

  const validate = () => {
    const newErrors = {} as any;
    surveyForm.fields.forEach((field: any) => {
      if (field.isRequired) {
        if (field.type === 'text' || field.type === 'textarea' || field.type === 'select' || field.type === 'date') {
          if (!formInfo[field.label]) {
            newErrors[field.label] = `${field.label} is required`;
          }
        } else if (field.type === 'image') {
          if (!fileData[field.label]) {
            newErrors[field.label] = `${field.label} is required`;
          } else {
            const file = fileData[field.label];
            const error = validateFile(file);
            if (error) {
              newErrors[field.label] = error;
            }
          }
        }else if (field.type === 'email') {
          if (!formInfo[field.label]) {
            newErrors[field.label] = `${field.label} is required`;
          } else {
            if(!EMAIL_REGEX.test(formInfo[field.label])) {
              newErrors[field.label] = `Invalid ${field.label} provided`;
            }
          }
        }
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    if(!term) {
      setIsSubmitting(false);
      return addAlert({ message:'Please accept terms', type: 'error' });
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      // setErrors(validationErrors);
      for (const key in validationErrors) {
        if (validationErrors.hasOwnProperty(key)) {
          addAlert({ message: `${validationErrors[key]}`, type: 'error' });
        }
      }
      setIsSubmitting(false);
      return;
    }
    

    const fieldValues = await Promise.all(
      Object.keys(formInfo).map(async (key) => {
        const uniqueKey = `${key}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        if (fileData[key]) {
          const file = fileData[key];
          const fileAsset = await client.assets.upload('image', file);
          return { _key: uniqueKey, key, value: fileAsset.url };
        } else {
          return { _key: uniqueKey, key, value: formInfo[key] };
        }
      })
    );

    const submissionData = {
      _type: 'formSubmission',
      formId: { _type: 'reference', _ref: surveyForm._id },
      submittedAt: new Date().toISOString(),
      data: {
        fieldValues,
      },
    };

    try {
      await client.create(submissionData);
      setIsSubmitting(false);
      addAlert({ message: 'Form submitted successfully', type: 'success' });
      // Reset form after submission
      const initialData = surveyForm?.fields.reduce((acc: any, field:any) => {
        acc[field.label] = '';
        return acc;
      }, {});
      setFormInfo(initialData);
      setFileData({} as any);
      setFileNames({} as any);
      setIsSuccess(true)
      setTerm(false)
    } catch (error) {
      console.error('Error submitting form:', error);
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
  }, [ isLoading, pins, searchParams]);
  
  useEffect(() => {
    if (!surveyForm?._id) {
      client.fetch(formQuery)
      .then((data) => {        
        setSurveyForm(data);
        const initialData = data.fields.reduce((acc: any, field:any) => {
          acc[field.label] = '';
          return acc;
        }, {});
        setFormInfo(initialData);
      })
    }
  }, [ surveyForm]);

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
    if (!markets?._id ) {
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

  const hash = window.location.hash.substring(1); // Get the hash part of the URL without the '#'

  if (hash) {
    const element = document.getElementById(hash);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`Element with id ${hash} not found`);
    }
  } else {
    console.warn('No hash found in URL');
  }
  

  useEffect(() => {
    if (selectedPin) {
      fetchPinDetails();
    }
  },[selectedPin]);

  useEffect(() => {
    if (viewMarketComment) {
      fetchMarketComments();
    }
  }, [viewMarketComment]);

  return (
    <div className={`${isMinimize ? 'w-3/4' : 'w-full'} flex flex-col gap-5 lg:items-center h-full overflow-auto lg:text-[1.5rem] text-[1rem] lg:px-20 px-5 transaction-height duration-75 ease-out`}>
      <div className={`${!selectedPin && pinDetail?.title === undefined ? 'hidden' : ''} flex flex-col items-end fixed w-full z-50 top-0 right-0 bg-gray-100 bg-opacity-40 gap-10 h-screen`}>
        {!isLoading ?
          <div className={`${isMobile ? 'w-5/6' : 'w-1/4'} flex flex-col p-10 bg-white overflow-auto h-full pb-[4rem]`}>
            <div className='w-full flex flex-row items-start justify-between text-[1.5rem] text-black font-semibold'>
              <div className='w-5/6 text-[1.4rem] leading-tight text-black font-semibold'>
                {pinDetail?.count} {pinDetail?.description}
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
      
      <div className='flex flex-col w-full lg:mt-10 mt-2'>
        <div className='lg:mt-5 mt-1 lg:text-[1.5rem] text-[1rem] font-semibold'>{mainPin.title}</div>
        <div className='flex flex-col justify-between items-center w-full border lg:mt-10 mt-5 border-gray-200 lg:gap-10 gap-5 rounded-xl p-5 cursor-pointer'>
          <div className="flex flex-col gap-5 items-center w-full">
            <div className='lg:text-[3rem] text-[1.5rem] font-semibold'>{mainPin.count}</div>
            <div className='lg:text-lg text-sm text-gray-700 w-full text-start '>
              {mainPin.description}
            </div>
          </div>
          <div className='flex flex-row items-center justify-between text-gray-700 text-lg w-full'>
            <div className='flex flex-col'>
              <div className='bg-[#f7f7f7] rounded-full px-4 py-1 text-sm text-black'>
                {mainPin.category}
              </div>
              <div className='text-xs text-gray-400 pt-2'>{mainPin.source}</div>
            </div>
            <NavLink to='/#Survey' className={`${isMobile? 'hidden' :''} p-5  underline font-medium`}>
              please participate in our next survey
            </NavLink>

            <div onClick={()=> handlePin(mainPin._id)} className="flex flex-row bg-comment bg-no-repeat bg-cover items-center justify-center h-9 w-9 text-sm text-white font-semibold">
              <div className=''>{mainPin.comments?.length}</div>
            </div>
          </div>
          <NavLink to='/#Survey' className={`${isMobile? '' :'hidden'} underline font-medium`}>
            please participate in our next survey
          </NavLink>
        </div>
        <div className={`${isMobile ? 'grid-cols-1 gap-10' :'grid-cols-3 gap-5'} mt-10 grid w-full`}>
          <div className='flex flex-col justify-between w-full relative border border-gray-200 gap-5 rounded-xl p-5'>
            <div className="flex flex-col gap-3 w-full">
              <div className='mt-5 mb-2 text-lg text-center font-semibold'>Nigeria Exchange Rate - Today</div>
              {markets.market?.fieldValues?.map((market: any) =>
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
              <div className='flex flex-col'>
                <div className='bg-[#f7f7f7] rounded-full px-4 py-1 text-sm text-black'>
                  Exchange rate
                </div>
                <div className='text-xs text-gray-400 pt-2'>{markets.source}</div>
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
                  {pin.description}
                </div>

              </div>
              <div className='flex flex-row items-center justify-between text-gray-700 text-lg w-full'>
                <div className='flex flex-col'>
                  <div className='bg-[#f7f7f7] rounded-full px-4 py-1 text-sm text-black'>
                    {pin.category}
                  </div>
                  <div className='text-xs text-gray-400 pt-2'>{pin.source}</div>
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
        <div id="Survey" className='flex flex-col lg:px-16 lg:p-12 mb-10 lg:w-2/3'>
          <div className="w-full text-2xl font-semibold">
            {surveyForm.title}
          </div>
          <div className="w-full mt-2 text-gray-700 lg:text-lg text-[.8rem]">
            {surveyForm.description}
          </div>

          
          <form  className='flex flex-col mt-10 gap-5' onSubmit={handleSubmit}>
            {surveyForm.fields?.map((field: any) => (
              <div key={field.label} className='flex flex-col w-full'>
                <label className='text-[.9rem] gap-3 pb-2'>{field.label}</label>
                {field.type === 'text' && (
                  <input
                    type="text"
                    name={field.label}
                    value={formInfo[field.label]}
                    className='w-full text-[.9rem] border rounded-lg bg-transparent border-gray-500 p-3 focus:outline-none'
                    onChange={handleChange}
                  />
                )}
                {field.type === 'email' && (
                  <input
                    type="email"
                    name={field.label}
                    value={formInfo[field.label]}
                    className='w-full text-[.9rem] border rounded-lg bg-transparent border-gray-500 p-3 focus:outline-none'
                    onChange={handleChange}
                  />
                )}
                {field.type === 'date' && (
                  <input
                    type="date"
                    name={field.label}
                    value={formInfo[field.label]}
                    className='w-full text-[.9rem] border rounded-lg bg-transparent border-gray-500 p-3 focus:outline-none'
                    onChange={handleChange}
                  />
                )}
                {field.type === 'textarea' && (
                  <textarea
                    name={field.label}
                    value={formInfo[field.label]}
                    className='w-full text-[.9rem] border rounded-lg bg-transparent border-gray-500 p-3 focus:outline-none'
                    onChange={handleChange}
                  />
                )}
                {field.type === 'select' && (
                  <select
                    name={field.label}
                    value={formInfo[field.label]}
                    className='w-full text-[.9rem] border rounded-lg bg-transparent border-gray-500 p-3 focus:outline-none'
                    onChange={handleChange}
                  >
                    <option disabled value="">Please Select</option>
                    {field.options.map((option: any) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {field.type === 'image' && (
                  <div
                    className="border-dashed border flex flex-col gap-2 items-center border-gray-400 p-4 rounded-lg cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, field.label)}
                  >
                    {fileNames[field.label] ? (
                      <div className='text-[1rem]'>{fileNames[field.label]}</div>
                    ) : (
                      <BsCloudUploadFill className="text-black text-[1.5rem]" />
                    )}

                    <label htmlFor="fileInput" className="cursor-pointer text-[.9rem]">
                      Drop your file here or <span className="font-semibold">click here</span> to upload
                    </label>
                    <span className='text-[.6rem]'>File should be PNG, JPEG, JPG (max 2MB)</span>
                    <input
                      type="file"
                      id="fileInput"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, field.label)}
                    />
                  </div>
                )}
                {/* {errors[field.label] && <div style={{ color: 'red' }}>{errors[field.label]}</div>} */}
              </div>
            ))}
            <div className="flex flex-row items-center gap-3 w-full">
              <BiSquare className={`${term === false ? '' : 'hidden'} text-2xl`} onClick={() => setTerm(true)}/>
              <BiCheckSquare className={`${term === true ? '' : 'hidden'} font-semibold text-2xl`} onClick={() => setTerm(false)}/>
              <div className="text-[0.875rem] text-dark-gray items-center">
                You consent to us using the data you have provided according to our <span className="font-semibold">Terms and Conditions</span>
              </div>
            </div>
            <div className='flex flex-col mt-5 w-full items-center'>
              <button type="submit" disabled={isSubmitting} className='bg-[#2985E0] py-2 px-16 text-lg text-white font-semibold rounded-lg cursor-pointer'>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className='flex flex-col gap-5 items-center md:p-10 p-5 w-full lg:mb-0 mb-32 lg:mt-0 mt-20'>
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
