import { BiMenuAltLeft } from 'react-icons/bi';
import { BsPersonFill } from 'react-icons/bs';
import { NavLink, useLocation } from 'react-router-dom';


const isNotActiveClass = 'flex flex-row items-center px-7 py-3 gap-3 hover:text-default text-black font-medium transition-all duration-200 ease-in-out capitalize'
const isActiveClass = 'flex flex-row items-center px-7 py-3 gap-3 text-[#2985E0] font-semibold border-l-4 border-[#2985E0] transition-all duration-200 ease-in-out capitalize'


interface MenuProps {
  handleMenuSidebar: (newValue: boolean) => void;
}

const Sidebar = ({handleMenuSidebar } : MenuProps) => {
  const location = useLocation();

  const { pathname } = location; 
  const handleCloseSidebar = () => { 
    if(handleMenuSidebar) handleMenuSidebar(false);
  };


  return (
    <div className='flex flex-col text-[0.9rem] lg:text-[1.3rem] justify-between hide-scrollbar'>
      <div className='flex flex-col pt-3'>
        <NavLink 
          to='/about'
          className={pathname === '/about' ? isActiveClass : isNotActiveClass}
          onClick={handleCloseSidebar}
        >
          <div className={`${pathname === '/about' ? 'bg-[#2985E0]' : 'bg-black'}  rounded-sm`}>
            <BiMenuAltLeft className='text-white' />
          </div>
          About
        </NavLink>
        <NavLink 
          to='/team'
          className={pathname === '/team' ? isActiveClass : isNotActiveClass}
          onClick={handleCloseSidebar}
        >
          <div className={`${pathname === '/team' ? 'bg-[#2985E0]' : 'bg-black'}  rounded-sm`}>
            <BsPersonFill className='text-white' />
          </div>
          Team
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar