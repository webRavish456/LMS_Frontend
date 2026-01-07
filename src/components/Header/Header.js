"use client"

import { useState, useEffect } from "react";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { usePathname, useRouter } from "next/navigation";

const Header = () => {

  const pathname = usePathname();
  const router = useRouter();
  const settings = ['My Profile', 'Logout'];

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  useEffect(() => {
    // Safely access localStorage only on client side
    if (typeof window !== 'undefined') {
      try {
        const photo = localStorage.getItem("profilePhoto");
        if (photo) {
          setProfilePhoto(JSON.parse(photo));
        }
      } catch (error) {
        console.error('Error reading profile photo from localStorage:', error);
      }
    }
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (setting) => {
    setAnchorElUser(null);
    if (setting === "My Profile") {
      router.push("/profile");
    } else if (setting === "Logout") {
      
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/login");
    }
  };


  const getHeadingFromPath = () => {
    const path = pathname;

    if (path.includes("/branch")) return "Branch";
    if (path.includes("/course/all-courses")) return "Course";
    if (path.includes("/course/document-sharing")) return "Document Sharing";
    if (path.includes("/teacher")) return "Teacher";
    if (path.includes("/student/all-students")) return "Student";
    if (path.includes("/student/certificates")) return "Certificate";
    if (path.includes("/scheduling")) return "Scheduling";
    if (path.includes("/assignment/all-assignments")) return "Assignment";
    if (path.includes("/assignment/students-assignment")) return "Student Assignment";
    if (path.includes("/exam")) return "Exam";
    if (path.includes("/result")) return "Result";
    if (path.includes("/student-result")) return "Student Result";
    if (path.includes("/viewfaculty")) return "View Teacher Details";
    if (path.includes("/editfaculty")) return "Edit Teacher Details";
    if (path.includes("/createfaculty")) return "Create Teacher";


    if (path === "/dashboard") return "Dashboard";

    return ""; // Fallback in case no match is found

  };

  return (
    <>
      <AppBar position="static" sx={{ 
        backgroundColor: "var(--primary_color)", 
        height: "60px",
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: "space-between", 
          alignItems: "center",
          height: '100%',
          px: 3
        }}>
          <Typography variant="h5" sx={{ 
            color: "#ffffff", 
            fontWeight: "600",
            fontSize: '1.5rem'
          }}>
            {getHeadingFromPath()}
          </Typography>
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: "center" }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                <Avatar 
                  alt="profilePhoto" 
                  src={profilePhoto} 
                  sx={{ 
                    width: 40, 
                    height: 40,
                    border: '2px solid rgba(255,255,255,0.3)'
                  }} 
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={() => handleCloseUserMenu()}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;