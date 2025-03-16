import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated, isAdmin } from "../utils/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
}) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // authService를 사용하여 인증 상태 확인
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);

      if (authenticated && adminOnly) {
        // 관리자 권한 확인 (로컬 스토리지에 저장된 정보 사용)
        setIsAdminUser(isAdmin());
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [adminOnly]);

  if (isLoading) {
    // 로딩 중에는 아무것도 렌더링하지 않음
    return null;
  }

  if (!isAuth) {
    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdminUser) {
    // 관리자 권한이 필요하지만 관리자가 아닌 경우 홈으로 리다이렉트
    return <Navigate to="/" replace />;
  }

  // 인증된 사용자는 자식 컴포넌트를 렌더링
  return <>{children}</>;
};

export default ProtectedRoute;
