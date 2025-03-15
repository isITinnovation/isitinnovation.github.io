import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated } from "../utils/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // authService를 사용하여 인증 상태 확인
    const checkAuth = () => {
      setIsAuth(isAuthenticated());
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // 로딩 중에는 아무것도 렌더링하지 않음
    return null;
  }

  if (!isAuth) {
    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    return <Navigate to="/login" replace />;
  }

  // 인증된 사용자는 자식 컴포넌트를 렌더링
  return <>{children}</>;
};

export default ProtectedRoute;
