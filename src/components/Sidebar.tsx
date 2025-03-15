import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import "../styles/Sidebar.css";
import { useMediaQuery, useTheme } from "@mui/material";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 모바일에서 사이드바 열린 상태로 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 메뉴 항목 클릭 핸들러
  const handleMenuClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <nav className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h1>
              <span className="sidebar-logo-blog">TREND BLOG</span>
            </h1>
          </div>
          <ul className="sidebar-menu">
            {ROUTES.map((route) => (
              <li key={route.path}>
                <Link
                  to={route.path}
                  className={`sidebar-link ${
                    location.pathname === route.path ? "active" : ""
                  }`}
                  onClick={handleMenuClick}
                >
                  {route.icon && (
                    <span className="sidebar-icon">{route.icon}</span>
                  )}
                  <span className="sidebar-text">{route.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {isOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;
