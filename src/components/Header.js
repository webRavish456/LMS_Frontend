'use client';

import React, { useState } from 'react';
import { User } from 'lucide-react';
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Link from "next/link"; // Navigation ke liye Link zaroori hai

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Saare tokens aur storage clear karein
    Cookies.remove("token", { path: '/' });
    document.cookie = "token=; expires=Thu, 1 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.clear();
    sessionStorage.clear();

    toast.success("Logging out...");

    setTimeout(() => {
      window.location.replace("/login"); 
    }, 800);
  };

  return (
    <header className="header" style={{ position: 'relative', zIndex: 1000 }}>
      <div className="header-left">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="header-right">
        <div 
          className="avatar" 
          style={{ position: 'relative', cursor: 'pointer' }} 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <User size={24} />
          
          {isProfileOpen && (
            <div className="avatar-dropdown" style={{
              position: 'absolute',
              right: 0,
              top: '110%',
              backgroundColor: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              padding: '10px',
              minWidth: '150px',
              zIndex: 9999
            }}>
              
              {/* --- My Profile Button Starts --- */}
              <Link href="/profile" style={{ textDecoration: 'none' }}>
                <div 
                  className="dropdown-item" 
                  style={{ 
                    padding: '8px', 
                    color: '#333', 
                    cursor: 'pointer',
                    transition: '0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  My Profile
                </div>
              </Link>
              {/* --- My Profile Button Ends --- */}
              
              <div className="dropdown-divider" style={{ height: '1px', backgroundColor: '#eee', margin: '5px 0' }}></div>
              
              <div 
                className="dropdown-item danger" 
                onClick={handleLogout} 
                style={{ 
                  padding: '8px', 
                  color: 'red', 
                  fontWeight: 'bold',
                  cursor: 'pointer' 
                }}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;