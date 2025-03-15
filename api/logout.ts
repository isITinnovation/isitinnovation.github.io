import { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // POST 요청만 처리
  if (request.method !== "POST") {
    return response.status(405).json({
      success: false,
      message: "허용되지 않는 메소드입니다.",
    });
  }

  try {
    // 인증 토큰 확인 //
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response.status(200).json({
        success: true,
        message: "로그아웃 되었습니다.",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      // 토큰 검증 (실제로는 블랙리스트에 추가하는 로직이 필요)
      jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret_key_for_development"
      );

      // 여기서는 클라이언트 측에서 토큰을 삭제하는 방식으로 구현
      // 실제 프로덕션 환경에서는 Redis 등을 사용하여 토큰 블랙리스트 관리 필요
    } catch (error) {
      // 토큰이 유효하지 않아도 로그아웃 성공으로 처리
    }

    // 성공 응답
    return response.status(200).json({
      success: true,
      message: "로그아웃 되었습니다.",
    });
  } catch (error) {
    console.error("로그아웃 처리 중 오류 발생:", error);
    return response.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : "알 수 없는 오류",
    });
  }
}
