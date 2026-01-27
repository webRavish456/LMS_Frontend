'use client';

import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-content">
        <Header />
        <main className="content-area">
          {children}
        </main>
      </div>

      {/* ✅ SINGLE GLOBAL TOAST */}
      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
      /> */}
    </div>
  );
};

export default Layout;
