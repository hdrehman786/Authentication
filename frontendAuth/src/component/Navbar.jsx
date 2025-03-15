
import assetsobj from '../assets/assets.jsx';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../Context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
const Navbar = () => {
  
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, userData, setUserData, loadUserData, backendUrl } = useContext(AppContent);

  const logout = async (req, res) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${backendUrl}/auth/logout`);
      if (response.status === 200) {
        setIsLoggedIn(false);
        setUserData(null);
        loadUserData();
        navigate('/', { replace: true });
      }
    }catch (e) {
      console.error(e);
    }
  }

 const verifyEmail = async (req, res) => {
  try {
    axios.defaults.withCredentials = true;
    const response = await axios.post(`${backendUrl}/auth/sentotp`);
    if (response.status === 200) {
     toast.success("Otp has been sent to your email successfully");
     navigate('/EmailVerify') 
    }
  }catch (e) {
    toast.error(e);
  }
 }

 
  return (
    <div className='flex justify-between w-full p-4 items-center sm:p-6 sm:px-24 absolute top-0'>
      <img src={assetsobj.logo} alt='logo' className='w-28 sm:w-28' />
      {
        userData ? (
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 flex items-center cursor-pointer justify-center border border-black
           rounded-full bg-black text-blue-100 relative group'>
              {userData.name[0].toUpperCase()}
              <div className=' absolute hidden group-hover:block top-0 
              right-0 z-10 text-black rounded pt-10'>
                <ul className=' list-none m-0 p-2 bg-gray-100 text-sm '>
                  {
                    !userData.isActive && <li onClick={()=>{
                      verifyEmail();
                    }} className=' p-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify email</li>
                  }
                  <li onClick={()=>{
                    logout();
                  }} className=' p-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Logout</li>
                </ul>
              </div>
            </div>

          </div>
        ) : (
          <button onClick={() => navigate('/login')}
            className='cursor-pointer flex items-center border gap-2 border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>
            Login
            <img src={assetsobj.arrowicon} alt='arrow' className='w-4 h-4' />
          </button>
        )
      }
    </div>
  );
};

export default Navbar;