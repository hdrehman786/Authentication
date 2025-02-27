import React, { useContext, useEffect } from 'react'
import assetsobj from '../assets/assets.jsx'
import { AppContent } from '../Context/AppContext.jsx';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { userData} = useContext(AppContent)
  return (
    <div className=" items-center flex flex-col mt-20 px-4 text-center text-gray-800">
      <img src={assetsobj.headerimg} alt='Header' className=' w-36 h-36 rounded-full mb-6 ' />
      <h1 className='text-1xl font-bold flex items-center sm:text-3xl'>Hey { userData ? userData.name : 'Developer' }  <img className='w-8 aspect-square' src={assetsobj.handvave} alt='Heandvave' /></h1>
      <h2 className=' text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our,s app</h2>
      <p className=' mb-8 max-w-md '>This is a simple app to demonstrate authentication using React and Tailwind CSS</p>
      <button  className=' cursor-pointer border border-gray-500 rounded-full px-8 py-2 hover:bg-gray-100 transition-all' >
        Get Started
      </button>
    </div>
  )
}


export default Header;