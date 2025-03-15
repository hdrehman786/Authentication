import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
export  const AppContent = createContext();
import { toast } from 'react-toastify';
 const AppContextProvider = (props) => {

   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [userData, setUserData] = useState(null);
   const backendUrl ="https://authentication-seven-snowy.vercel.app";


   const isAuthenticated = async (user) =>{
      try {
         const isAuth = await api.get(`${backendUrl}/auth/isauthenticated`);
         if(isAuth.data.success){
            setIsLoggedIn(true);
            loadUserData();
         }
      }catch(e) {
         console.log(e.message)
      }
   }

   useEffect(()=>{
      isAuthenticated();
   },[])

const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

const getUserData = async () => {
  try {
    const response = await api.get('/user/data');
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user data:', error.response?.data?.msg || error.message);
    throw error.response?.data?.msg || 'Failed to fetch user data';
  }
};


const loadUserData = async () => {
  try {
    const user = await getUserData();
    setIsLoggedIn(true);
    setUserData(user);
  } catch (error) {
    setIsLoggedIn(false);
    setUserData(null); // Clear user data on error
  }
};



   const value = {
      isLoggedIn,
      setIsLoggedIn,
      userData,
      setUserData,
      loadUserData ,
      backendUrl
   };

return (
   <AppContent.Provider value={value}>
      {props.children}
   </AppContent.Provider>
)
}


export default AppContextProvider;
