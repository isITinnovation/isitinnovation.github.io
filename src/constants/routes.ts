import { isAuthenticated } from "../utils/authService";
import axios from "axios";

interface Route {
  name: string;
  path: string;
  icon?: React.ReactNode;
  adminOnly?: boolean;
}

// 관리자 여부 확인 함수
export const checkIsAdmin = async (): Promise<boolean> => {
  if (!isAuthenticated()) return false;

  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("/api/check-admin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.isAdmin;
  } catch (error) {
    console.error("관리자 권한 확인 중 오류 발생:", error);
    return false;
  }
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
