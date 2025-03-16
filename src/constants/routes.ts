import { isAuthenticated, isAdmin } from "../utils/authService";

interface Route {
  name: string;
  path: string;
  icon?: React.ReactNode;
  adminOnly?: boolean;
}

// 관리자 여부 확인 함수
export const checkIsAdmin = (): boolean => {
  if (!isAuthenticated()) return false;
  return isAdmin();
};

export const ROUTES: Route[] = [
  {
    name: "실시간 인기 게시글",
    path: "/isITinnovation",
  },
  {
    name: "주식트렌드 ",
    path: "/stock-trend",
  },
  // {
  //   name: "프롬프트",
  //   path: "/prompt-guide",
  // },
  {
    name: "소개",
    path: "/about",
  },
  {
    name: "관리자",
    path: "/admin",
    adminOnly: true,
  },
];
