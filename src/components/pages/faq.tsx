import { useState } from "react";
import { NavLink } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { FaCircleArrowLeft, FaCircleMinus, FaCirclePlus, FaSquareEnvelope, FaSquarePhone } from "react-icons/fa6";
import Footer from "../reuseables/footer";
import { dataFaqList, generalFaqList, policyFaqList } from "../../utils/common";

const Faq = () => { 
  const [selectedGeneralFaqToView, setSelectedGeneralFaqToView] = useState(1)
  const [selectedDataFaqToView, setSelectedDataFaqToView] = useState(1)
  const [selectedPolicyFaqToView, setSelectedPolicyFaqToView] = useState(1)
  return (
    <div className='flex flex-col h-full overflow-auto text-[1rem] transaction-height duration-75 ease-out'>
      <div className='flex flex-col gap-5 md:p-10 p-5 w-full '>
        <NavLink to={'/'} className='flex flex-row gap-3 pb-5 items-center'>
          <FaCircleArrowLeft className="text-[#045BB0] text-[1.3rem]" />
          Homepage
        </NavLink>
        <div className='w-full'>
          <div className='font-semibold lg:text-2xl text-lg'>
          Frequently Asked Questions
          </div>
          <div className='text-gray-500 md:text-[1rem] text-[.8rem]'>
            Got questions? We've got answers! Here are some common queries about our platform.
          </div>
        </div>
        <div className={`${isMobile ? 'flex-col' : 'flex-row'} flex gap-10 items-start w-full`}>
          <div className={`${isMobile ? 'w-full' : 'w-3/5'} flex flex-col gap-3`}>
            <div className='font-semibold lg:text-2xl text-lg text-[#045BB0]'>
              General
            </div>
            <div className='flex flex-col gap-5 w-full'>
              {generalFaqList?.map((faq, index) =>
                <div key={index} className='border rounded-lg flex flex-col gap-2 p-5'>
                  <div className='flex flex-row items-center justify-between w-full'>
                    <div className='font-semibold'>{faq.title}</div>
                    <FaCirclePlus className={`${selectedGeneralFaqToView !== faq.id ? '' : 'hidden'} text-[#045BB0] cursor-pointer`} onClick={() => setSelectedGeneralFaqToView(faq.id)}/>
                    <FaCircleMinus className={`${selectedGeneralFaqToView === faq.id ? '' : 'hidden'} text-[#045BB0] cursor-pointer`} onClick={() => setSelectedGeneralFaqToView(0)}/>
                  </div>
                  <div className={`${selectedGeneralFaqToView === faq.id ? '' : 'hidden'} text-gray-500 text-sm w-5/6`}>
                    {faq.description}
                  </div>
                </div>
              )}
            </div>
            <div className='font-semibold lg:text-2xl mt-4 text-sm text-[#045BB0]'>
              Data Usage
            </div>
            <div className='flex flex-col gap-5 w-full'>
              {dataFaqList?.map((faq, index) =>
                <div key={index} className='border rounded-lg flex flex-col gap-2 p-5'>
                  <div className='flex flex-row items-center justify-between w-full'>
                    <div className='font-semibold'>{faq.title}</div>
                    <FaCirclePlus className={`${selectedDataFaqToView !== faq.id ? '' : 'hidden'} text-[#045BB0] cursor-pointer`} onClick={() => setSelectedDataFaqToView(faq.id)}/>
                    <FaCircleMinus className={`${selectedDataFaqToView === faq.id ? '' : 'hidden'} text-[#045BB0] cursor-pointer`} onClick={() => setSelectedDataFaqToView(0)}/>
                  </div>
                  <div className={`${selectedDataFaqToView === faq.id ? '' : 'hidden'} text-gray-500 text-sm w-5/6`}>
                    {faq.description}
                  </div>
                </div>
              )}
            </div>
            <div className='font-semibold lg:text-2xl mt-4 text-sm text-[#045BB0]'>
              Privacy Policy
            </div>
            <div className='flex flex-col gap-5 w-full'>
              {policyFaqList?.map((faq, index) =>
                <div key={index} className='border rounded-lg flex flex-col gap-2 p-5'>
                  <div className='flex flex-row items-center justify-between w-full'>
                    <div className='font-semibold'>{faq.title}</div>
                    <FaCirclePlus className={`${selectedPolicyFaqToView !== faq.id ? '' : 'hidden'} text-[#045BB0] cursor-pointer`} onClick={() => setSelectedPolicyFaqToView(faq.id)}/>
                    <FaCircleMinus className={`${selectedPolicyFaqToView === faq.id ? '' : 'hidden'} text-[#045BB0] cursor-pointer`} onClick={() => setSelectedPolicyFaqToView(0)}/>
                  </div>
                  <div className={`${selectedPolicyFaqToView === faq.id ? '' : 'hidden'} text-gray-500 text-sm w-5/6`}>
                    {faq.description}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={`${isMobile ? 'w-full' : 'w-2/5'}`}>
            <div className='rounded-lg flex flex-col gap-3 p-5 bg-[#2985E0] bg-opacity-10'>
              <div className='font-semibold lg:text-2xl text-lg'>
                Get in touch
              </div>
              <div className='text-gray-700 md:text-[1.1rem] text-[.975rem]'>
                We invite you to join us on this transformative journey. Whether you're a government entity seeking informed policy advice or an investor scouting for strategic opportunities, let's collaborate and drive positive change together.
              </div>
              <div className='flex flex-row items-center text-gray-700 md:gap-2 gap-1 w-full'>
                <FaSquareEnvelope className='lg:text-2xl text-lg text-black' />
                <div className='lg:text-sm text-[.8rem]'>support@vye.socials.com</div>
              </div>
              <div className='flex flex-row items-center text-gray-700 md:gap-2 gap-1 w-full'>
                <FaSquarePhone className='lg:text-2xl text-lg text-black' />
                <div className='lg:text-sm text-[.8rem]'>+44 0123 4567 89</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Faq;
