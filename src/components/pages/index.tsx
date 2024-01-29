import { useState } from "react";
import { FaCaretDown } from "react-icons/fa6";
import { BsCloudUploadFill } from "react-icons/bs";
import { AgeGroupList, ProductList, StateList } from "../../utils/common";
import Footer from "../reuseables/footer";
import { isMobile } from "react-device-detect";

const Home = () => { 
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showAgeGroupDropdown, setShowAgeGroupDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [formInfo, setFormInfo] = useState({title: '', product: '', agegroup: '', location:'', file: null,});

  const handleFileChange = (event: any) => {
    console.log(event.target.files[0]);
    const selectedFile = event.target.files[0];
    setFormInfo({...formInfo, file: selectedFile});
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files[0];    
    setFormInfo({...formInfo, file: selectedFile});
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  return (
    <div className='flex flex-col w-full lg:items-center h-full overflow-auto lg:text-[1.5rem] text-[1rem] transaction-height duration-75 ease-out'>
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
              <input type='text' placeholder="Select the product or service you purchased" readOnly className='w-full text-[.9rem] focus:outline-none'/>
              <FaCaretDown onClick={()=> setShowProductDropdown(!showProductDropdown)} className='cursor-pointer'/>
            </div>
            <div className={`${showProductDropdown ? '' : 'hidden' } flex mt-[2.3rem] text-[.9rem] z-30 h-[10rem] overflow-auto bg-white rounded-b-lg absolute shadow-lg w-full text-blue flex-col`}>
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
              value={formInfo.title}
              onChange={({ target}) => {setFormInfo({ ...formInfo, title: target.value })}}
              className='w-full mt-3 text-[.9rem] border rounded-lg bg-transparent border-gray-500 p-3 focus:outline-none'
            />
          </div>
          <div className="flex flex-col relative w-full">
            <label className="text-[0.875rem] pb-2">Location</label>
            <div className='flex flex-row items-center p-3 border border-gray-500 rounded-lg justify-between w-full text-center'>
              <input type='text' placeholder="Select location" readOnly value={formInfo.location} className='w-full text-[.9rem] focus:outline-none'/>
              <FaCaretDown onClick={()=> setShowLocationDropdown(!showLocationDropdown)} className='cursor-pointer'/>
            </div>
            <div className={`${showLocationDropdown ? '' : 'hidden' } flex mt-[2.3rem] text-[.9rem] z-30 h-[10rem] overflow-auto bg-white rounded-b-lg absolute shadow-lg w-full text-blue flex-col`}>
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
                <input type='radio' className=''/>
                Female
              </div>
              <div className='flex flex-row items-center gap-3 justify-start'>
                <input type='radio' className=''/>
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
            <div className={`${showAgeGroupDropdown ? '' : 'hidden' } flex mt-[2.3rem] text-[.9rem] z-30 bg-white rounded-b-lg absolute shadow-lg w-full text-blue flex-col`}>
              {AgeGroupList?.map((age, index) => 
                <div key={index} onClick={() =>[setFormInfo({ ...formInfo, agegroup: age }), setShowAgeGroupDropdown(!showAgeGroupDropdown)]} className='flex flex-row hover:bg-[#045BB0] hover:text-white capitalize py-2 px-3 cursor-pointer'>
                  {age}
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-col w-full'>
            <div className='text-[.9rem] gap-3'>
              Email
            </div>
            <input
              type="email"
              placeholder="Enter your email address"
              value={formInfo.title}
              onChange={({ target}) => {setFormInfo({ ...formInfo, title: target.value })}}
              className='w-full mt-3 text-[.9rem] border rounded-lg bg-transparent border-gray-500 p-3 focus:outline-none'
            />
          </div>

          <div className='flex flex-col w-full'>
            <div className='text-[.9rem] gap-3'>
              Phone Number
            </div>
            <input
              type="email"
              placeholder="Enter your phone number"
              value={formInfo.title}
              onChange={({ target}) => {setFormInfo({ ...formInfo, title: target.value })}}
              className='w-full mt-3 text-[.9rem] border rounded-lg bg-transparent border-gray-500 p-3 focus:outline-none'
            />
          </div>

          <div className='flex flex-col w-full'>
            <div className='text-[.9rem] gap-3'>
              Receipt (optional)
            </div>
            <div
                className="border-dashed border flex flex-col gap-2 items-center border-gray-400 p-4 rounded-lg cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <BsCloudUploadFill className="text-[#045BB0] text-[1.5rem]"/>

                <label htmlFor="fileInput" className="cursor-pointer text-[.9rem]">
                  Drop your file here or <span className="text-[#045BB0]">click here</span> to upload
                </label>
                <span className='text-[.6rem]'>File should be PDF, DOC (max 2MB)</span>
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
            </div>
          </div>

          <div className='flex flex-col w-full'>
            <div className='text-[.9rem] gap-3'>
              Addtional Info
            </div>
            <textarea
              value={formInfo.title}
              onChange={({ target}) => {setFormInfo({ ...formInfo, title: target.value })}}
              className='w-full mt-3 text-[.9rem] border rounded-lg bg-transparent border-gray-500 p-3 focus:outline-none'
            />
          </div>

          <div className="flex flex-row items-center gap-3 w-full">
              <input
                type="checkbox"
                className=""
              />
              <div className="text-[0.875rem] text-dark-gray items-center">
                You consent to us using the data you have provided according to our <span className="text-[#045BB0]">Terms and Conditions</span>
              </div>
            </div>

          <div className='flex flex-col w-full items-center'>
            <div className='bg-[#045BB0] py-3 px-10 text-white font-semibold rounded-lg'>SUBMIT</div>
          </div>
        </div>

      </div>
      <Footer/>
    </div>
  )
}

export default Home;
