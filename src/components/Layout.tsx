import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

const LayoutContainer = styled.div`
  min-height: 100vh;
`;

const MainContent = styled.main`
  padding-top: 136px; // 헤더 높이(72px) + 카테고리 메뉴(64px)
  margin-left: 280px; // Sidebar 너비만큼 여백

  @media (max-width: ${({ theme }) => theme.breakpoints.values.md}px) {
    padding-top: 120px; // 모바일 헤더 높이(64px) + 카테고리 메뉴(56px)
    margin-left: 0; // 모바일에서는 사이드바가 없으므로 여백 제거
  }
`;

const Layout = () => {
  return (
    <LayoutContainer>
      <Header />
      <Sidebar />
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
