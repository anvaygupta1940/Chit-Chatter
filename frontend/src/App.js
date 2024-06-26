import React from 'react'
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const App = () => {
  return (
    <div>
      <ToastContainer
        position='top-center'
      />
      <Outlet></Outlet>
    </div>
  )
}

export default App
