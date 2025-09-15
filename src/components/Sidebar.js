"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Menuitems from "./MenuItems";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);

  useEffect(() => {
    const firstPath = "/" + pathname.split("/")[1];

    let activeModuleIndex = null;
    let activeSubModule = null;

    Menuitems.forEach((item, index) => {
      if (item.href.startsWith(firstPath)) {
        activeModuleIndex = index;
        if (item.items) {
          const matchedSub = item.items.find((sub) => sub.href === pathname);
          if (matchedSub) {
            activeSubModule = matchedSub.href;
          }
        }
      }
    });

    setActiveIndex(activeModuleIndex);
    setActiveSubItem(activeSubModule);
  }, [pathname]);

  const toggleMenu = (index, item) => {
    if (item.items) {
      setActiveIndex(activeIndex === index ? null : index);
      if (activeIndex !== index) {
        router.push(item.href);
        const firstSub = item.items[0].href;
        setActiveSubItem(firstSub);
      }
    } else {
      setActiveIndex(index);
      setActiveSubItem(null);
    }
  };

  return (
    <aside
      className="sidebar"
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
      <div className="sidebar-header" style={{ padding: "0 20px", marginBottom: "20px" }}>
        <div className="logo">
          <Image
            src="/logo.png"
            alt="VED VENTURING DIGITALLY"
            width={180}
            height={40}
            style={{ width: "120px", height: "auto" }}
          />
        </div>
      </div>

      <nav className="menu-container" style={{ paddingLeft: "10px", paddingRight: "10px" }}>
        {Menuitems.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <div key={index} className="menu-item" style={{ marginBottom: "8px" }}>
              {item.items ? (
                <div
                  className={`menu-link ${isActive ? "active" : ""}`}
                  onClick={() => toggleMenu(index, item)}
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
                    {item.icon && (
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={20}
                        height={20}
                        className="menu-icon"
                      />
                    )}
                    <span className="menu-label">{item.label}</span>
                  </div>
                  <ChevronDown className={`menu-arrow ${isActive ? "active" : ""}`} />
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`menu-link ${isActive ? "active" : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    backgroundColor: isActive ? "#003366" : "transparent",
                    borderRadius: "4px",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  {item.icon && (
                    <Image src={item.icon} alt={item.label} width={20} height={20} className="menu-icon" />
                  )}
                  <span className="menu-label" style={{ marginLeft: "8px" }}>
                    {item.label}
                  </span>
                </Link>
              )}

              {item.items && isActive && (
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
                  {item.items.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      className={`submenu-link ${activeSubItem === subItem.href ? "active" : ""}`}
                      onClick={() => setActiveSubItem(subItem.href)}
                      style={{
                        textDecoration: "none",
                        color: activeSubItem === subItem.href ? "#00bcd4" : "white",
                        padding: "6px 8px",
                        borderRadius: "3px",
                      }}
                    >
                      <span>{subItem.label}</span>
                    </Link>
                  ))}
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
