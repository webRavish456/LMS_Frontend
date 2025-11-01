'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Menuitems from "./MenuItems";

const Sidebar = () => {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  useEffect(() => {
    const activeParent = Menuitems.find(
      (item) =>
        item.href === pathname ||
        (item.items && item.items.some((sub) => sub.href === pathname))
    );
    if (activeParent && activeParent.items) {
      setOpenSubmenu(activeParent.label);
    }
  }, [pathname]);

  const handleToggleSubmenu = (label) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  // ✅ FIXED: Safe icon rendering
  const renderIcon = (icon) => {
    if (!icon || typeof icon !== "string") return null;

    // Ensure the path starts with "/" if not absolute URL
    const validSrc =
      icon.startsWith("/") || icon.startsWith("http")
        ? icon
        : `/${icon}`;

    return (
      <Image
        src={validSrc}
        alt="icon"
        width={20}
        height={20}
        className="menu-icon"
      />
    );
  };

  return (
    <aside
      className="sidebar transition-transform duration-300 ease-in-out"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "250px",
        overflowY: "auto",
        backgroundColor: "#001f3f",
        color: "white",
        zIndex: 1000,
        padding: "10px 0",
      }}
    >
      {/* Sidebar Header */}
      <div
        className="sidebar-header"
        style={{ padding: "0 20px", marginBottom: "20px" }}
      >
        <div className="logo">
          <Image
            src="/logo.png" // ✅ make sure this exists in /public/logo.png
            alt="VED VENTURING DIGITALLY"
            width={180}
            height={40}
            style={{ width: "120px", height: "auto" }}
          />
        </div>
      </div>

      {/* Sidebar Menu */}
      <nav
        className="menu-container"
        style={{ paddingLeft: "10px", paddingRight: "10px" }}
      >
        {Menuitems.map((item) => {
          const hasSubmenu = !!item.items;
          const isActive =
            pathname === item.href ||
            (hasSubmenu && openSubmenu === item.label);
          const isLinkActive = pathname === item.href;

          return (
            <div key={item.label} className="menu-item" style={{ marginBottom: "8px" }}>
              {hasSubmenu ? (
                <button
                  className={`menu-link w-full text-left ${isActive ? "active" : ""}`}
                  onClick={() => handleToggleSubmenu(item.label)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    backgroundColor: isActive ? "#003366" : "transparent",
                    borderRadius: "4px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {renderIcon(item.icon)}
                    <span className="menu-label">{item.label}</span>
                  </div>
                  <ChevronDown
                    className={`menu-arrow transition-transform duration-200 ${
                      openSubmenu === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`menu-link ${isLinkActive ? "active" : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    backgroundColor: isLinkActive ? "#003366" : "transparent",
                    borderRadius: "4px",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  {renderIcon(item.icon)}
                  <span className="menu-label" style={{ marginLeft: "8px" }}>
                    {item.label}
                  </span>
                </Link>
              )}

              {/* Submenu */}
              {hasSubmenu && openSubmenu === item.label && (
                <div
                  className="submenu"
                  style={{
                    marginTop: "4px",
                    paddingLeft: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {item.items.map((subItem) => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className={`submenu-link ${isSubActive ? "active" : ""}`}
                        style={{
                          textDecoration: "none",
                          color: isSubActive ? "#00bcd4" : "white",
                          padding: "6px 8px",
                          borderRadius: "3px",
                        }}
                      >
                        <span>{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
