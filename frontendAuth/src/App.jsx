import React from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './Maincomponents/Home.jsx';

import Login from './Maincomponents/Login.jsx';
import EmailVerify from './Maincomponents/EmailVerify.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from './Maincomponents/Signup.jsx';
import ResetPassword from './Maincomponents/Resetpassword.jsx';

 const App = () => {

  return (
    <div>
      <ToastContainer />
          <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/login" element={<Login/>} />
        <Route path='/signup' element={<Signup />} />
        <Route path="/emailverify" element={<EmailVerify />} />
      </Routes>
    </div>

  )
}



export default App;