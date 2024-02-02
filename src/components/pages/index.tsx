import { useState } from "react";
import { FaCaretDown } from "react-icons/fa6";
import { BsCloudUploadFill } from "react-icons/bs";
import Footer from "../reuseables/footer";
import { isMobile } from "react-device-detect";
import { BiCheckSquare, BiRadioCircle, BiRadioCircleMarked, BiSquare } from "react-icons/bi";

import {client} from "../../utils/client";
import { useAlert } from "../../utils/notification/alertcontext";
import { EMAIL_REGEX } from "../../utils/regex";
import { AgeGroupList, ProductList, StateList } from "../../utils/common";

import icon from '../../assets/images/success-icon.png';

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

const Home = () => {
  const { addAlert } = useAlert();
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showAgeGroupDropdown, setShowAgeGroupDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [fileName, setFileName] = useState('');
  const [term, setTerm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  

  return (
    <div className='flex flex-col w-full lg:items-center h-full overflow-auto lg:text-[1.5rem] text-[1rem] transaction-height duration-75 ease-out'>
      {!isSuccess ? (
        <div className='flex flex-col md:p-10 p-5 lg:w-1/3 lg:mb-0 mb-20'>

          <div className={`${isMobile ? '' : 'hidden'} text-[1rem] text-center font-semibold`}>
            Voice Your Experience is all about unblocking insights, shaping policies and empowering Nigeria’s future!
          </div>
          <div className="w-full text-center lg:text-lg text-[.8rem] lg:font-semibold">
            Please complete the form below
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
                  <div key={index} onClick={() =>[setFormInfo({ ...formInfo, product: product }), setShowProductDropdown(!showProductDropdown)]} className='flex flex-row hover:bg-[#045BB0] hover:text-white capitalize py-2 px-3 cursor-pointer'>
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
                  <div key={index} onClick={() =>[setFormInfo({ ...formInfo, location: state }), setShowLocationDropdown(!showLocationDropdown)]} className='flex flex-row hover:bg-[#045BB0] hover:text-white capitalize py-2 px-3 cursor-pointer'>
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
                  <div key={index} onClick={() =>[setFormInfo({ ...formInfo, agegroup: age }), setShowAgeGroupDropdown(!showAgeGroupDropdown)]} className='flex flex-row hover:bg-[#045BB0] hover:text-white capitalize py-2 px-3 cursor-pointer'>
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
                    <BsCloudUploadFill className="text-[#045BB0] text-[1.5rem]"/>
                  )}

                  <label htmlFor="fileInput" className="cursor-pointer text-[.9rem]">
                    Drop your file here or <span className="text-[#045BB0]">click here</span> to upload
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
              <BiCheckSquare className={`${term === true ? '' : 'hidden'} text-[#045BB0] text-2xl`} onClick={() => setTerm(false)}/>
              <div className="text-[0.875rem] text-dark-gray items-center">
                You consent to us using the data you have provided according to our <span className="text-[#045BB0]">Terms and Conditions</span>
              </div>
            </div>

            <div className='flex flex-col w-full items-center'>
              <div onClick={handleSubmit} className='bg-[#045BB0] py-3 px-10 text-white font-semibold rounded-lg cursor-pointer'>
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

          <div className='flex flex-col w-full items-center'>
            <div onClick={() => setIsSuccess(false)} className='bg-[#045BB0] cursor-pointer py-3 px-10 flex flex-row gap-3 items-center text-white font-semibold rounded-lg'>
              Close
            </div>
          </div>

        </div>
      ) }
      
      <Footer/>
    </div>
  )
}

export default Home;
