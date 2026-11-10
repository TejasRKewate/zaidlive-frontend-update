


// import React, { useEffect, useState } from "react";
// import { Outlet, useLocation } from "react-router-dom";

// import {
//   FaBars,
//   FaBell,
//   FaSearch,
//   FaChevronDown,
// } from "react-icons/fa";

// import Sidebar from "../components/Admin/Sidebar/Sidebar";

// import "./AdminLayout.css";

// const DESKTOP_MIN = 1025;

// const AdminLayout = () => {
//   const location = useLocation();

//   const [sidebarOpen, setSidebarOpen] = useState(
//     () => window.innerWidth >= DESKTOP_MIN
//   );

//   // Handle browser resizing
//   useEffect(() => {
//     const handleResize = () => {
//       setSidebarOpen(window.innerWidth >= DESKTOP_MIN);
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   // Close drawer after navigation on tablet/mobile
//   useEffect(() => {
//     if (window.innerWidth < DESKTOP_MIN) {
//       setSidebarOpen(false);
//     }
//   }, [location.pathname]);

//   // Get user information
//   let user = {};

//   try {
//     user = JSON.parse(localStorage.getItem("user")) || {};
//   } catch {
//     user = {};
//   }

//   const fullName =
//     [user.firstName, user.lastName].filter(Boolean).join(" ") ||
//     user.fullName ||
//     user.name ||
//     "Admin User";

//   const roleName = user.role || "Admin";

//   const profileImage =
//     user.profileImage ||
//     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80";

//   const unreadCount = 3;

//   return (
//     <div
//       className={`admin-layout ${
//         sidebarOpen ? "sidebar-open" : "sidebar-closed"
//       }`}
//     >
//       {/* SIDEBAR */}
//       <Sidebar
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//       />

//       {/* BACKDROP */}
//       <div
//         className="admin-overlay"
//         onClick={() => setSidebarOpen(false)}
//       />

//       {/* MAIN */}
//       <div className="admin-main">

//         {/* TOPBAR */}
//         <header className="admin-topbar">

//           <div className="admin-topbar-left">

//             <button
//               type="button"
//               className="admin-menu-btn"
//               onClick={() => setSidebarOpen((prev) => !prev)}
//               aria-label="Toggle sidebar"
//               aria-expanded={sidebarOpen}
//             >
//               <FaBars />
//             </button>

//             <div className="admin-search">
//               <FaSearch />

//               <input
//                 type="search"
//                 placeholder="Search employees, departments..."
//               />
//             </div>

//           </div>

//           <div className="admin-topbar-right">

//             <button
//               type="button"
//               className="admin-bell"
//               aria-label="Notifications"
//             >
//               <FaBell />

//               {unreadCount > 0 && (
//                 <span className="admin-bell-count">
//                   {unreadCount}
//                 </span>
//               )}
//             </button>

//             <div className="admin-profile">

//               <img
//                 src={profileImage}
//                 alt={fullName}
//                 className="admin-avatar"
//               />

//               <div className="admin-profile-info">
//                 <span className="admin-profile-name">
//                   {fullName}
//                 </span>

//                 <span className="admin-profile-role">
//                   {roleName}
//                 </span>
//               </div>

//               <FaChevronDown className="admin-profile-chevron" />

//             </div>

//           </div>

//         </header>

//         {/* PAGE CONTENT */}
//         <main className="admin-content">
//           <Outlet />
//         </main>

//       </div>
//     </div>
//   );
// };

// export default AdminLayout;



import React, { useEffect, useState, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";

import Sidebar from "../components/Admin/Sidebar/Sidebar";
import "./AdminLayout.css";

const DESKTOP_MIN = 1025;
const DEFAULT_PROFILE_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80";

const AdminLayout = () => {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= DESKTOP_MIN
  );

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= DESKTOP_MIN);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < DESKTOP_MIN) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.fullName ||
    user.name ||
    "Admin User";

  const roleName = user.role || "Admin";
  const profileImage = user.profileImage || DEFAULT_PROFILE_IMAGE;
  const unreadCount = 3;

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const closeSidebar = () => {
    if (window.innerWidth < DESKTOP_MIN) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="admin-overlay"
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-menu-btn"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              aria-expanded={sidebarOpen}
            >
              <FaBars />
            </button>

            <div className="admin-search">
              <FaSearch className="admin-search-icon" />
              <input
                type="search"
                placeholder="Search employees, departments..."
                aria-label="Search"
              />
            </div>
          </div>

          <div className="admin-topbar-right">
            <button
              type="button"
              className="admin-bell"
              aria-label={`${unreadCount} notifications`}
            >
              <FaBell />
              {unreadCount > 0 && (
                <span className="admin-bell-count">{unreadCount}</span>
              )}
            </button>

            <button
              type="button"
              className="admin-profile"
              aria-label="Admin profile"
            >
              <img
                src={profileImage}
                alt={fullName}
                className="admin-avatar"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                }}
              />
              <div className="admin-profile-info">
                <span className="admin-profile-name">{fullName}</span>
                <span className="admin-profile-role">{roleName}</span>
              </div>
              <FaChevronDown className="admin-profile-chevron" />
            </button>
          </div>
        </header>

        <main className="admin-content">
          <div className="admin-content-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;