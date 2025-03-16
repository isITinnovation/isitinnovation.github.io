import { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";
import pool from "./utils/mysql.js";

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET 요청만 허용
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  // 인증 토큰 확인
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "인증 토큰이 필요합니다." });
  }

  const token = authHeader.split(" ")[1];
  let decodedToken: DecodedToken;

  try {
    // 토큰 검증
    decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "유효하지 않은 토큰입니다." });
  }

  // 타임스탬프 확인 (선택 사항)
  const timestamp = req.query.timestamp as string;
  if (!timestamp) {
    return res
      .status(400)
      .json({ success: false, message: "타임스탬프가 필요합니다." });
  }

  const currentTime = new Date().getTime();
  const requestTime = parseInt(timestamp);

  // 5분 이내의 요청만 허용
  if (currentTime - requestTime > 5 * 60 * 1000) {
    return res
      .status(400)
      .json({ success: false, message: "요청이 만료되었습니다." });
  }

  let connection;
  try {
    // 데이터베이스 연결
    connection = await pool.getConnection();

    // 관리자 권한 확인 (선택 사항)
    const [adminRows] = await connection.execute(
      "SELECT role FROM users WHERE id = ?",
      [decodedToken.userId]
    );

    const adminUser = (adminRows as any[])[0];
    if (!adminUser || adminUser.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "관리자 권한이 필요합니다." });
    }

    // 사용자 목록 조회
    const [rows] = await connection.execute(
      "SELECT id, name, email, approvedYN, created_at, updated_at FROM users ORDER BY created_at DESC"
    );

    return res.status(200).json({ success: true, users: rows });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
