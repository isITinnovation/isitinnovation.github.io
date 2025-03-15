import { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

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

  // 인증 토큰 확인
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(401).json({
      success: false,
      message: "인증이 필요합니다.",
    });
  }

  const token = authHeader.split(" ")[1];
  let userId: string;

  try {
    // 토큰 검증
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key_for_development"
    ) as { userId: string };
    userId = decoded.userId;
  } catch (error) {
    return response.status(401).json({
      success: false,
      message: "유효하지 않은 인증 토큰입니다.",
    });
  }

  // 요청 데이터 확인
  const { name, timestamp } = request.body;

  if (!name) {
    return response.status(400).json({
      success: false,
      message: "이름은 필수 입력 항목입니다.",
    });
  }

  // 타임스탬프 검증 (5분 이내)
  if (!timestamp || Date.now() - timestamp > 5 * 60 * 1000) {
    return response.status(400).json({
      success: false,
      message: "요청이 만료되었습니다. 다시 시도해주세요.",
    });
  }

  // 데이터베이스 연결
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "3306"),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  try {
    const connection = await pool.getConnection();

    try {
      // 사용자 정보 업데이트
      const [result] = await connection.execute(
        "UPDATE users SET name = ? WHERE id = ?",
        [name, userId]
      );

      // 업데이트된 사용자 정보 조회
      const [rows] = await connection.execute(
        "SELECT id, name, email FROM users WHERE id = ?",
        [userId]
      );

      connection.release();

      if (Array.isArray(rows) && rows.length > 0) {
        const user = rows[0] as { id: string; name: string; email: string };

        return response.status(200).json({
          success: true,
          message: "프로필이 성공적으로 업데이트되었습니다.",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      } else {
        return response.status(404).json({
          success: false,
          message: "사용자를 찾을 수 없습니다.",
        });
      }
    } catch (error) {
      console.error("프로필 업데이트 중 데이터베이스 오류:", error);
      return response.status(500).json({
        success: false,
        message: "프로필 업데이트 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      });
    }
  } catch (error) {
    console.error("데이터베이스 연결 오류:", error);
    return response.status(500).json({
      success: false,
      message: "데이터베이스 연결에 실패했습니다.",
      details: error instanceof Error ? error.message : "알 수 없는 오류",
    });
  }
}
