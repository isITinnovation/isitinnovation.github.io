import { VercelRequest, VercelResponse } from "@vercel/node";
import pool from "./utils/mysql";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

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
    const { name, email, password, timestamp } = request.body;

    // 필수 필드 검증
    if (!name || !email || !password) {
      return response.status(400).json({
        success: false,
        message: "이름, 이메일, 비밀번호는 필수 항목입니다.",
      });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response.status(400).json({
        success: false,
        message: "유효한 이메일 주소를 입력해주세요.",
      });
    }

    // 비밀번호 복잡성 검증
    if (
      password.length < 8 ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
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
      // 테이블이 존재하는지 확인
      try {
        // 테이블 존재 여부 확인
        const [tables] = await connection.query("SHOW TABLES LIKE 'users'");

        // 테이블이 없으면 생성
        if ((tables as any[]).length === 0) {
          console.log(
            "users 테이블이 존재하지 않습니다. 테이블을 생성합니다..."
          );

          await connection.query(`
            CREATE TABLE users (
              id VARCHAR(36) PRIMARY KEY,
              name VARCHAR(100) NOT NULL,
              email VARCHAR(100) NOT NULL UNIQUE,
              password VARCHAR(255) NOT NULL,
              created_at DATETIME NOT NULL,
              updated_at DATETIME NOT NULL,
              INDEX idx_email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
          `);

          console.log("users 테이블이 성공적으로 생성되었습니다.");
        }
      } catch (tableError) {
        console.error("테이블 확인/생성 중 오류 발생:", tableError);
        // 테이블 생성 오류는 무시하고 계속 진행 (이미 존재할 수 있음)
      }

      // 이메일 중복 확인
      const [existingUsers] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if ((existingUsers as any[]).length > 0) {
        return response.status(409).json({
          success: false,
          message: "이미 사용 중인 이메일입니다.",
        });
      }

      // 비밀번호 해싱
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 사용자 ID 생성
      const userId = uuidv4();

      // 사용자 생성
      await connection.query(
        "INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
        [userId, name, email, hashedPassword]
      );

      // 성공 응답
      return response.status(201).json({
        success: true,
        message: "회원가입이 완료되었습니다.",
        userId,
      });
    } finally {
      connection.release(); // 연결 반환
    }
  } catch (error) {
    console.error("회원가입 처리 중 오류 발생:", error);
    return response.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : "알 수 없는 오류",
    });
  }
}
