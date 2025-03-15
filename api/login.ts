import { VercelRequest, VercelResponse } from "@vercel/node";
import pool from "./utils/mysql";
import bcrypt from "bcryptjs";
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
    const { email, password, timestamp } = request.body;

    // 필수 필드 검증
    if (!email || !password) {
      return response.status(400).json({
        success: false,
        message: "이메일과 비밀번호는 필수 항목입니다.",
      });
    }

    // 타임스탬프 검증 (5분 이내)
    const currentTime = new Date().getTime();
    const requestTime = timestamp ? parseInt(timestamp.toString()) : 0;

    if (!requestTime || currentTime - requestTime > 5 * 60 * 1000) {
      return response.status(400).json({
        success: false,
        message: "요청이 만료되었습니다. 다시 시도해주세요.",
      });
    }

    const connection = await pool.getConnection();

    try {
      // 사용자 조회
      const [users] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      const userArray = users as any[];

      if (userArray.length === 0) {
        return response.status(401).json({
          success: false,
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        });
      }

      const user = userArray[0];

      // 비밀번호 검증
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return response.status(401).json({
          success: false,
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        });
      }

      // JWT 토큰 생성
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
        },
        process.env.JWT_SECRET || "fallback_secret_key_for_development",
        { expiresIn: "24h" }
      );

      // 성공 응답
      return response.status(200).json({
        success: true,
        message: "로그인이 성공적으로 완료되었습니다.",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } finally {
      connection.release(); // 연결 반환
    }
  } catch (error) {
    console.error("로그인 처리 중 오류 발생:", error);
    return response.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : "알 수 없는 오류",
    });
  }
}
