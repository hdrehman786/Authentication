import React, { useContext, useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContent } from '../Context/AppContext.jsx';
import assets from '../assets/assets.jsx';


const MIN_PASSWORD_LENGTH = 8;

const Login = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, isLoggedIn, backendUrl,  loadUserData} = useContext(AppContent);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoggedIn) {
      toast.error('You are already logged in');
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/auth/login`,
        formData,
        { withCredentials: true }
      );
      
      if (response.status === 200 || response.status === 201) {
        toast.success('Successfully logged in');
        setIsLoggedIn(true);
        loadUserData();
         navigate('/', { replace: true });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Login failed';
      toast.error(errorMessage);
      console.error('Login error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(()=>{
    isLoggedIn && navigate('/')
  }, [isLoggedIn])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 to-purple-400 px-6 sm:px-0">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Company Logo"
        className="absolute left-5 top-5 w-28 cursor-pointer sm:left-20 sm:w-32"
      />
      
      <div className="w-full rounded-l-lg bg-slate-900 p-10 text-indigo-300 shadow-lg sm:w-96">
        <h2 className="mb-3 text-center text-3xl font-semibold text-white">
          Welcome Back
        </h2>
        <p className="mb-6 text-center text-sm">
          Enter your credentials to login
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <div className="flex w-full items-center gap-3 rounded-full bg-[#333A5C] px-5 py-2.5">
              <img src={assets.mailicon} alt="Email icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full bg-transparent outline-none"
                disabled={isLoading}
                aria-label="Email"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <div className="flex w-full items-center gap-3 rounded-full bg-[#333A5C] px-5 py-2.5">
              <img src={assets.lockicon} alt="Password icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full bg-transparent outline-none"
                disabled={isLoading}
                aria-label="Password"
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
          </div>

          <p
            onClick={() => !isLoading && navigate('/resetpassword')}
            className={`mb-4 cursor-pointer text-indigo-500 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
          >
            Forgot Password?
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 py-2.5 font-medium text-white transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <Link to="/signup">
          <p className="mt-4 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <span className="cursor-pointer text-blue-400 underline">Sign up here</span>
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Login;