import axios from "axios";

// 개발 환경에서 API 요청을 위한 기본 설정
// 개발 환경에서는 Vite의 프록시 기능을 사용하기 위해 baseURL 설정
if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "http://localhost:3000";
  console.log(
    "개발 환경에서 API 요청을 위한 baseURL이 설정되었습니다:",
    axios.defaults.baseURL
  );
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  userId?: string;
}

export interface UpdateProfileData {
  name: string;
}

/**
 * 회원가입 API 호출
 * @param data 회원가입 데이터
 * @returns API 응답
 */
export const registerUser = async (
  data: RegisterData
): Promise<AuthResponse> => {
  try {
    const timestamp = new Date().getTime();
    const response = await axios.post("/api/register", {
      ...data,
      timestamp,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as AuthResponse;
    }
    return {
      success: false,
      message: "서버 연결에 실패했습니다. 네트워크 연결을 확인해주세요.",
    };
  }
};

/**
 * 로그인 API 호출
 * @param data 로그인 데이터
 * @returns API 응답
 */
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const timestamp = new Date().getTime();
    const response = await axios.post("/api/login", {
      ...data,
      timestamp,
    });

    const { token, user } = response.data;

    // 로컬 스토리지에 인증 정보 저장
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as AuthResponse;
    }
    return {
      success: false,
      message: "서버 연결에 실패했습니다. 네트워크 연결을 확인해주세요.",
    };
  }
};

/**
 * 비밀번호 변경 API 호출
 * @param data 비밀번호 변경 데이터
 * @returns API 응답
 */
export const changePassword = async (
  data: ChangePasswordData
): Promise<AuthResponse> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        success: false,
        message: "인증이 필요합니다. 다시 로그인해주세요.",
      };
    }

    const timestamp = new Date().getTime();
    const response = await axios.post(
      "/api/change-password",
      {
        ...data,
        timestamp,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as AuthResponse;
    }
    return {
      success: false,
      message: "서버 연결에 실패했습니다. 네트워크 연결을 확인해주세요.",
    };
  }
};

/**
 * 로그아웃 처리
 * @returns API 응답 프로미스
 */
export const logoutUser = async (): Promise<AuthResponse> => {
  try {
    const token = getToken();

    // 서버에 로그아웃 요청
    const response = await axios.post(
      "/api/logout",
      { timestamp: new Date().getTime() },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );

    // 로컬 스토리지에서 인증 정보 삭제
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return response.data;
  } catch (error) {
    // 서버 오류가 발생해도 로컬에서는 로그아웃 처리
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as AuthResponse;
    }
    return {
      success: true,
      message: "로컬에서 로그아웃되었습니다.",
    };
  }
};

/**
 * 현재 로그인된 사용자 정보 가져오기
 * @returns 사용자 정보 또는 null
 */
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    return null;
  }
};

/**
 * 인증 토큰 가져오기
 * @returns 인증 토큰 또는 null
 */
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * 사용자 인증 상태 확인
 * @returns 인증 여부
 */
export const isAuthenticated = (): boolean => {
  return !!getToken() && !!getCurrentUser();
};

/**
 * 프로필 업데이트 API 호출
 * @param data 프로필 업데이트 데이터
 * @returns API 응답
 */
export const updateProfile = async (
  data: UpdateProfileData
): Promise<AuthResponse> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        success: false,
        message: "인증이 필요합니다. 다시 로그인해주세요.",
      };
    }

    const timestamp = new Date().getTime();
    const response = await axios.post(
      "/api/update-profile",
      {
        ...data,
        timestamp,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 로컬 스토리지의 사용자 정보 업데이트
    if (response.data.success && response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as AuthResponse;
    }
    return {
      success: false,
      message: "서버 연결에 실패했습니다. 네트워크 연결을 확인해주세요.",
    };
  }
};
