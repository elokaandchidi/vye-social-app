import { isMobile } from "react-device-detect";
import { FaCircleArrowLeft, FaSquareEnvelope, FaSquarePhone } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import Footer from "../reuseables/footer";

const About = () => {  
  return (
    <div className='flex flex-col h-full overflow-auto text-[1rem] transaction-height duration-75 ease-out'>
      <div className='flex flex-col md:p-10 p-5 w-full '>
        <NavLink to={'/'} className='flex flex-row gap-3 pb-5 items-center'>
          <FaCircleArrowLeft className="text-[#045BB0] text-[1.3rem]" />
          Homepage
        </NavLink>
        <div className={`${isMobile ? 'flex-col' : 'flex-row'} flex gap-10 items-start w-full`}>
          <div className={`${isMobile ? 'w-full' : 'w-3/5'} flex flex-col gap-3`}>
            <div className='font-semibold lg:text-2xl text-sm'>
              Welcome to VYE.socials
            </div>
            <div className='text-gray-500 md:text-[1.1rem] text-[.8rem]'>
              At Vye.social, we're passionate about decoding the intricate web of consumer behaviors and market trends in Nigeria. Our mission is clear: to harness data-driven insights that shape policies and fuel strategic investments, propelling Nigeria's growth.
            </div>
            <div className='h-48 bg-gray-200'></div>
            <div className='font-semibold lg:text-2xl text-sm'>
              Our Purpose
            </div>
            <div className='text-gray-500 md:text-[1.1rem] text-[.8rem]'>
              Driven by a commitment to excellence and innovation, we specialize in comprehensive data collection and analysis. Our team delves deep into understanding consumer preferences, trends, and behaviors across diverse sectors. We transform raw data into actionable intelligence, empowering both public and private sectors to make informed decisions.
            </div>
            <div className='font-semibold lg:text-2xl text-sm'>
              What sets us apart
            </div>
            <div className='w-full pl-5'>
              <ul className='text-gray-500 md:text-[1.1rem] text-[.8rem] relative list-disc'>
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
            <div className='font-semibold lg:text-2xl text-sm'>
              Our Commitment
            </div>
            <div className='text-gray-500 md:text-[1.1rem] text-[.8rem]'>
              At Vye.social, integrity, and transparency are the cornerstones of our operations. We are committed to delivering unbiased, reliable, and actionable insights, ensuring our partners and stakeholders can trust the information that drives their decisions.
            </div>
          </div>
          <div className={`${isMobile ? 'w-full' : 'w-2/5'}`}>
            <div className='rounded-lg flex flex-col gap-3 p-5 bg-[#2985E0] bg-opacity-10'>
              <div className='font-semibold lg:text-2xl text-sm'>
                Get in touch
              </div>
              <div className='text-gray-700 md:text-[1.1rem] text-[.8rem]'>
                We invite you to join us on this transformative journey. Whether you're a government entity seeking informed policy advice or an investor scouting for strategic opportunities, let's collaborate and drive positive change together.
              </div>
              <div className='flex flex-row items-center text-gray-700 md:gap-2 gap-1 w-full'>
                <FaSquareEnvelope className='lg:text-2xl text-sm text-black' />
                <div className='lg:text-sm text-[.8rem]'>support@vye.socials.com</div>
              </div>
              <div className='flex flex-row items-center text-gray-700 md:gap-2 gap-1 w-full'>
                <FaSquarePhone className='lg:text-2xl text-sm text-black' />
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

export default About;
