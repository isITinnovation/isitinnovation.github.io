import { VercelRequest, VercelResponse } from "@vercel/node";
import pool from "./utils/mysql.js";
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
    // 인증 토큰 확인
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response.status(401).json({
        success: false,
        message: "인증이 필요합니다.",
      });
    }

    const token = authHeader.split(" ")[1];
    let decodedToken: any;

    try {
      // 토큰 검증
      decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret_key_for_development"
      );
    } catch (error) {
      return response.status(401).json({
        success: false,
        message: "유효하지 않은 토큰입니다.",
      });
    }

    const { currentPassword, newPassword, timestamp } = request.body;

    // 필수 필드 검증
    if (!currentPassword || !newPassword) {
      return response.status(400).json({
        success: false,
        message: "현재 비밀번호와 새 비밀번호는 필수 항목입니다.",
      });
    }

    // 비밀번호 복잡성 검증
    if (
      newPassword.length < 8 ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)
    ) {
      return response.status(400).json({
        success: false,
        message:
          "비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자를 포함해야 합니다.",
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
        "SELECT * FROM users WHERE id = ?",
        [decodedToken.userId]
      );

      const userArray = users as any[];

      if (userArray.length === 0) {
        return response.status(404).json({
          success: false,
          message: "사용자를 찾을 수 없습니다.",
        });
      }

      const user = userArray[0];

      // 현재 비밀번호 검증
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        return response.status(401).json({
          success: false,
          message: "현재 비밀번호가 올바르지 않습니다.",
        });
      }

      // 새 비밀번호 해싱
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // 비밀번호 업데이트
      await connection.query(
        "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
        [hashedPassword, decodedToken.userId]
      );

      // 성공 응답
      return response.status(200).json({
        success: true,
        message: "비밀번호가 성공적으로 변경되었습니다.",
      });
    } finally {
      connection.release(); // 연결 반환
    }
  } catch (error) {
    console.error("비밀번호 변경 처리 중 오류 발생:", error);
    return response.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : "알 수 없는 오류",
    });
  }
}
