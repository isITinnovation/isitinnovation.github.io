import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import "../styles/Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();

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

  //   // 라우트 변경시 모바일에서 사이드바 자동으로 닫기
  //   useEffect(() => {
  //     setIsOpen(false);
  //   }, [location, setIsOpen]);

  return (
    <>
      <nav className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h1>isIT Blog</h1>
          </div>
          <ul className="sidebar-menu">
            {ROUTES.map((route) => (
              <li key={route.path}>
                <Link
                  to={route.path}
                  className={`sidebar-link ${
                    location.pathname === route.path ? "active" : ""
                  }`}
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
