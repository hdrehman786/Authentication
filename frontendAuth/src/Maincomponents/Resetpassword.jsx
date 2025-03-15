import React, { useContext, useEffect, useState } from 'react';
import assetsobj from '../assets/assets.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContent } from '../Context/AppContext.jsx';

const ResetPassword = () => {
  const { isLoggedIn} = useContext(AppContent);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setPassword] = useState('');
   const authUrl =import.meta.env.VITE_BACKEND_URL
  axios.defaults.withCredentials = true;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${authUrl}/auth/sentpassresetotp`,
        { email }
      );
      if (response.status === 200) {
        toast.success('Reset code sent to your email');
        setStep(2);
      } else {
        toast.error('Failed to send reset code');
      }
    }catch (e) {
      toast.error('Failed to reset password');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${authUrl}/auth/verifyresetpassotp`,
        { email, newPassword, otp}
      );
      if (response.status === 200) {
        toast.success('your password has been reset');
        navigate('/login');
      } else {
        toast.error('Failed updating your password');
      }
    }catch (e) {
      toast.error('Failed to reset password');
    }
  };
 
  useEffect(()=>{
    isLoggedIn && navigate('/');
  },[isLoggedIn])

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 to-purple-400 px-6 sm:px-0'>
      <img
        onClick={() => navigate('/')}
        src={assetsobj.logo}
        alt='Company Logo'
        className='absolute left-5 top-5 w-28 cursor-pointer sm:left-20 sm:w-32'
      />
      
      <div className='w-full rounded-l-lg bg-slate-900 p-10 text-indigo-300 shadow-lg sm:w-96'>
        {step === 1 ? (
          <>
            <h2 className='mb-3 text-center text-3xl font-semibold text-white'>
              Reset Password
            </h2>
            <p className='mb-6 text-center text-sm'>
              Enter your email to receive a reset code
            </p>
            <form onSubmit={handleEmailSubmit} noValidate>
              <div className='mb-4'>
                <div className='flex w-full items-center gap-3 rounded-full bg-[#333A5C] px-5 py-2.5'>
                  <input
                    type='email'
                    name='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter Email'
                    className='w-full bg-transparent outline-none text-white'
                    aria-label='Email'
                  />
                </div>
              </div>
              <button
                type='submit'
                className='w-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 py-2.5 font-medium text-white transition-opacity'
              >
                Send OTP
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className='mb-3 text-center text-3xl font-semibold text-white'>
              Enter New Password
            </h2>
            <form onSubmit={handleResetSubmit} noValidate>
              <div className='mb-4'>
                <input
                  type='email'
                  name='email'
                  value={email}
                  readOnly
                  className='w-full bg-[#333A5C] px-5 py-2.5 rounded-full text-white outline-none'
                  aria-label='Email'
                />
              </div>
              <div className='mb-4'>
                <input
                  type='text'
                  name='otp'
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder='Enter OTP'
                  className='w-full bg-[#333A5C] px-5 py-2.5 rounded-full text-white outline-none'
                  aria-label='OTP'
                />
              </div>
              <div className='mb-4'>
                <input
                  type='password'
                  name='password'
                  value={newPassword}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter New Password'
                  className='w-full bg-[#333A5C] px-5 py-2.5 rounded-full text-white outline-none'
                  aria-label='New Password'
                />
              </div>
              <button
                type='submit'
                className='w-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 py-2.5 font-medium text-white transition-opacity'
              >
                Reset Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;