import { FaCircleArrowLeft } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { useAlert } from "../../utils/notification/alertcontext";
import { useState } from "react";
import { EMAIL_REGEX } from "../../utils/regex";
import { client } from "../../utils/client";

import ImageEamon from '../../assets/images/eamon.jpg';
import ImageChidi from '../../assets/images/chidi.jpg';
import ImageEddy from '../../assets/images/eddy.jpg';


interface ContactDocument {
  _type: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

const About = () => {
  const { addAlert } = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formInfo, setFormInfo] = useState({name: '', email: '', phone: '', message:''});
  
  const handleSubmit = async () => {  
    setIsSubmitting(true);
    const { name, email, phone, message} = formInfo;
  
    const requiredFields = [
      { field: email, message: 'Please add email' },
      { field: phone, message: 'Please add mobile' },
      { field: name, message: 'Please add price' },
      { field: message, message: 'Please select message' },
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
    
    
    let doc: ContactDocument = {
      _type: 'contact',
      name,
      email,
      phone,
      message
    };  
    
    try {
      await client.create(doc)
      setFormInfo({name: '', email: '', phone: '', message:''})
      setIsSubmitting(false);
      addAlert({ message: 'Contact form submitted successfully', type: 'success' });
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      addAlert({ message:'error occurred while submitting form', type: 'error' });
    }
  };

  return (
    <div className='flex flex-col h-full lg:w-2/3 w-11/12 overflow-auto text-[1rem] transaction-height py-10 duration-75 ease-out'>
      <div className='flex flex-col w-full '>
        <NavLink to={'/'} className='flex flex-row gap-3 pb-5 items-center'>
          <FaCircleArrowLeft className="text-[#045BB0] text-[1.3rem]" />
          Homepage
        </NavLink>
        <div className={`w-full flex flex-col gap-3`}>
          <div className='font-semibold lg:text-2xl text-lg'>
            Welcome to VYE.socials
          </div>
          <div className='text-gray-500 md:text-[1.1rem] text-[.975rem]'>
            At Vye.social, we're passionate about decoding the intricate web of consumer behaviors and market trends in Nigeria. Our mission is clear: to harness data-driven insights that shape policies and fuel strategic investments, propelling Nigeria's growth.
          </div>
          <div className='h-60 bg-navbar bg-cover mt-3'></div>
          <div className='font-semibold lg:text-2xl text-lg mt-5'>
            Our Purpose
          </div>
          <div className='text-gray-500 md:text-[1.1rem] text-[.975rem]'>
            Driven by a commitment to excellence and innovation, we specialize in comprehensive data collection and analysis. Our team delves deep into understanding consumer preferences, trends, and behaviors across diverse sectors. We transform raw data into actionable intelligence, empowering both public and private sectors to make informed decisions.
          </div>
          <div className='font-semibold lg:text-2xl text-lg mt-5'>
            How we make a difference
          </div>
          <div className='text-gray-500 md:text-[1.1rem] text-[.975rem]'>
            Through meticulous analysis, we unearth trends that drive industries, shedding light on potential investment areas. Our insights inform governmental bodies, aiding in crafting policies that resonate with the needs and aspirations of Nigerian citizens.
          </div>
          <div className='font-semibold lg:text-2xl text-lg mt-5'>
            What sets us apart
          </div>
          <div className='w-full pl-5'>
            <ul className='text-gray-500 md:text-[1.1rem] text-[.975rem] relative list-disc'>
              <li className=''>
                Expertise: Our team comprises seasoned analysts and data scientists dedicated to uncovering meaningful patterns.
              </li>
              <li className=''>
                Impact: We measure success by the tangible impact our insights have on shaping Nigeria's future.
              </li>
              <li className=''>
                Collaboration: We foster partnerships, pooling resources and knowledge for collective progress.
              </li>
            </ul>
          </div>
          <div className='font-semibold lg:text-2xl text-lg mt-5'>
            Our Commitment
          </div>
          <div className='text-gray-500 md:text-[1.1rem] text-[.975rem]'>
            At Vye.social, integrity, and transparency are the cornerstones of our operations. We are committed to delivering unbiased, reliable, and actionable insights, ensuring our partners and stakeholders can trust the information that drives their decisions.
          </div>

          <div className='font-semibold lg:text-2xl text-lg'>
            Meet the team
          </div>
          <div className='text-gray-500 md:text-[1.1rem] text-[.975rem] w-full'>
            Lorem ipsum dolor sit amet consectetur. Cursus tortor vitae posuere eget potenti elementum elit urna nulla. Amet neque placerat sociis nisl. Ultrices sollicitudin facilisis tellus nibh gravida duis. 
          </div>
          <div className='grid lg:grid-cols-3 w-full gap-5 mt-5'>
            <div className='flex flex-col gap-5'>
              <div className='font-semibold text-lg'>Chidi</div>
              <img src={ImageChidi} alt='logo' className='object-cover h-[20rem] grayscale' />
              <div className='text-black md:text-[1.1rem] text-[.975rem] w-full'>
                Lorem ipsum dolor sit amet consectetur. Cursus tortor vitae posuere eget potenti elementum elit urna nulla. Amet neque placerat sociis nisl. Ultrices sollicitudin facilisis tellus nibh gravida duis. 
              </div>
            </div>
            <div className='flex flex-col gap-5'>
              <div className='font-semibold text-lg'>Eloka</div>
              <img src={ImageEamon} alt='logo' className='object-cover h-[20rem] grayscale' />
              <div className='text-black md:text-[1.1rem] text-[.975rem] w-full'>
                Lorem ipsum dolor sit amet consectetur. Cursus tortor vitae posuere eget potenti elementum elit urna nulla. Amet neque placerat sociis nisl. Ultrices sollicitudin facilisis tellus nibh gravida duis. 
              </div>
            </div>
            <div className='flex flex-col gap-5'>
              <div className='font-semibold text-lg'>Eddy</div>
              <img src={ImageEddy} alt='logo' className='object-cover h-[20rem] grayscale' />
              <div className='text-black md:text-[1.1rem] text-[.975rem] w-full'>
                Lorem ipsum dolor sit amet consectetur. Cursus tortor vitae posuere eget potenti elementum elit urna nulla. Amet neque placerat sociis nisl. Ultrices sollicitudin facilisis tellus nibh gravida duis. 
              </div>
            </div>

          </div>
          <div className='font-semibold lg:text-2xl text-lg mt-5'>
            Contact us form
          </div>
          <div className='flex flex-col w-full gap-7'>
            <div className='flex flex-col gap-2'>
              <div className='text-sm'>Email</div>
              <input
                type="email"
                value={formInfo.email} onChange={({ target}) => {setFormInfo({ ...formInfo, email: target.value })}}
                placeholder="Enter your email address"
                className='w-full text-[.9rem] border rounded-lg bg-transparent border-gray-400 p-4 focus:outline-none'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <div className='text-sm'>Name</div>
              <input
                type="text"
                value={formInfo.name} onChange={({ target}) => {setFormInfo({ ...formInfo, name: target.value })}} 
                placeholder="Enter your first and last name"
                className='w-full text-[.9rem] border rounded-lg bg-transparent border-gray-400 p-4 focus:outline-none'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <div className='text-sm'>Phone Number</div>
              <input
                type="number"
                value={formInfo.phone} onChange={({ target}) => {setFormInfo({ ...formInfo, phone: target.value })}}
                placeholder="Enter your phone number"
                className='w-full text-[.9rem] border rounded-lg bg-transparent border-gray-400 p-4 focus:outline-none'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <div className='text-sm'>Message</div>
              <textarea
                value={formInfo.message} onChange={({ target}) => {setFormInfo({ ...formInfo, message: target.value })}}
                className='w-full mt-3 text-[.9rem] border rounded-lg bg-transparent border-gray-400 p-3 focus:outline-none'
              />
            </div>
            <div className='flex flex-col items-center mt-7 w-full'>
              <div onClick={handleSubmit} className='lg:w-1/3 w-1/2 bg-[#2985e0] p-3 cursor-pointer text-center text-white uppercase font-semibold text-sm lg:text-xl'>{!isSubmitting ? 'SUBMIT' : 'Submitting ....'}</div>
            </div>
          </div>
        </div>
          
      </div>
    </div>
  )
}

export default About;
