"use client";

import React, { useEffect, useState } from "react";
import { User, Bell } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const router = useRouter();
  const pathname = usePathname();   // 🔥 Important

  const token =
    typeof window !== "undefined"
      ? Cookies.get("token") || localStorage.getItem("token")
      : null;

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  /* ================= DYNAMIC PAGE TITLE ================= */
  const getPageTitle = () => {
    if (pathname.includes("/dashboard")) return "Dashboard";
    if (pathname.includes("/course")) return "Course";
    if (pathname.includes("/student")) return "Student";
    if (pathname.includes("/faculty")) return "Faculty";
    if (pathname.includes("/attendance")) return "Attendance";
    if (pathname.includes("/notification")) return "Notifications";
    return "Dashboard";
  };

  /* ================= LOAD PROFILE PHOTO ================= */
  useEffect(() => {
    const loadPhoto = () => {
      const photo =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("profilePhoto"))
          : null;

      setProfilePhoto(photo);
    };

    loadPhoto();
    window.addEventListener("profile-updated", loadPhoto);

    return () => {
      window.removeEventListener("profile-updated", loadPhoto);
    };
  }, []);

  /* ================= FETCH NOTIFICATIONS ================= */
  useEffect(() => {
    if (!token || !BASE_URL) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${BASE_URL}/notification`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();

        if (data?.status === "success" && Array.isArray(data.data)) {
          const unread = data.data.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch {
        console.warn("Notification fetch failed");
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token, BASE_URL]);

  /* ================= LOGOUT ================= */
  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();

    Cookies.remove("token");
    localStorage.clear();
    sessionStorage.clear();

    toast.success("Logged out successfully");

    setTimeout(() => {
      router.replace("/login");
    }, 800);
  };

  return (
    <header className="header" style={{ position: "relative", zIndex: 1000 }}>
      <div className="header-left">
        {/* 🔥 Dynamic Title */}
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>

      <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
        <div
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => router.push("/notification")}
        >
          <Bell size={22} color="#1e3a8a" />
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                backgroundColor: "red",
                color: "white",
                borderRadius: "50%",
                fontSize: "11px",
                minWidth: "18px",
                height: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        <div
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => setIsProfileOpen((prev) => !prev)}
        >
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <User size={24} color="#1e3a8a" />
          )}

          {isProfileOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "110%",
                background: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                borderRadius: "8px",
                padding: "10px",
                minWidth: "150px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Link href="/profile" style={{ display: "block", padding: "6px 4px" }}>
                My Profile
              </Link>

              <hr style={{ margin: "6px 0" }} />

              <div
                style={{ cursor: "pointer", padding: "6px 4px" }}
                onClick={handleLogout}
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