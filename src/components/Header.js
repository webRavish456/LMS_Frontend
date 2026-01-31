"use client";

import React, { useEffect, useState } from "react";
import { User, Bell } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  // token safely get
  const token =
    typeof window !== "undefined"
      ? Cookies.get("token") || localStorage.getItem("token")
      : null;

  // BASE URL (backend running on 8000)
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  /* ================= FETCH NOTIFICATIONS ================= */
  useEffect(() => {
    if (!token || !BASE_URL) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${BASE_URL}/notification`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();

        if (data?.status === "success" && Array.isArray(data.data)) {
          const unread = data.data.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        // silent fail (no console error spam)
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
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div
        className="header-right"
        style={{ display: "flex", gap: "18px", alignItems: "center" }}
      >
        {/* 🔔 NOTIFICATION */}
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

        {/* 👤 PROFILE */}
        <div
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => setIsProfileOpen((prev) => !prev)}
        >
          <User size={24} color="#1e3a8a" />

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
              <Link href="/profile">My Profile</Link>
              <hr />
              <div
                style={{ color: "red", cursor: "pointer" }}
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
