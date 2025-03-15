import React, { useContext, useEffect, useState } from 'react';
import assetsobj from '../assets/assets.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from '../Context/AppContext.jsx';

const EmailVerify = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const { loadUserData, isLoggedIn, userData,backendUrl } = useContext(AppContent);

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      axios.defaults.withCredentials =true;
      const response = await axios.post(`${backendUrl}/auth/verifyOtp`, {
        otp,
      });
      if(response.status === 200){
        navigate('/');
        toast.success('Email verified successfully');
        loadUserData();
      }else{
        toast('Invalid OTP');
      }
    }catch(e) {
      console.log(e);
    }  
  };

  useEffect(()=>{
      isLoggedIn && userData && userData.isActive && navigate('/')
  }, [isLoggedIn, userData])
  
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 to-purple-400 px-6 sm:px-0'>
      <img
        onClick={() => navigate('/')}
        src={assetsobj.logo}
        alt='Company Logo'
        className='absolute left-5 top-5 w-28 cursor-pointer sm:left-20 sm:w-32'
      />
      
      <div className='w-full rounded-l-lg bg-slate-900 p-10 text-indigo-300 shadow-lg sm:w-96'>
        <h2 className='mb-3 text-center text-3xl font-semibold text-white'>
          OTP Verification
        </h2>
        <p className='mb-6 text-center text-sm'>
          Enter the OTP sent to your email
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className='mb-4'>
            <div className='flex w-full items-center gap-3 rounded-full bg-[#333A5C] px-5 py-2.5'>
              <input
                type='text'
                name='otp'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder='Enter OTP'
                className='w-full bg-transparent outline-none text-white'
                aria-label='OTP'
              />
            </div>
          </div>
          
          <button
            type='submit'
            className='w-full rounded-full cursor-pointer bg-gradient-to-r from-indigo-500 to-indigo-900 py-2.5 font-medium text-white transition-opacity'
          >
            Verify OTP
          </button>
        </form>
        <p
            className={`mb-4 mt-2 cursor-pointer text-indigo-500 `}
          >
            RESET OTP?
          </p>
      </div>
    </div>
  );
};

export default EmailVerify;
