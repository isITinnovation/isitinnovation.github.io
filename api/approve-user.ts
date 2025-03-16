import { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";
import pool from "./utils/mysql.js";

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // POST 요청만 허용
  if (req.method !== "POST") {
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

  // 요청 본문에서 필요한 데이터 추출
  const { userId, approved, timestamp } = req.body;

  // 필수 필드 확인
  if (!userId || approved === undefined || !timestamp) {
    return res
      .status(400)
      .json({ success: false, message: "필수 필드가 누락되었습니다." });
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

    // 관리자 권한 확인
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

    // 사용자 존재 여부 확인
    const [userRows] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    if ((userRows as any[]).length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    // 승인 상태 업데이트
    const approvedYN = approved ? "Y" : "N";
    await connection.execute(
      "UPDATE users SET approvedYN = ?, updated_at = NOW() WHERE id = ?",
      [approvedYN, userId]
    );

    // 업데이트된 사용자 정보 조회
    const [updatedRows] = await connection.execute(
      "SELECT id, name, email, approvedYN, created_at, updated_at FROM users WHERE id = ?",
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: `사용자가 성공적으로 ${approved ? "승인" : "미승인"}되었습니다.`,
      user: (updatedRows as any[])[0],
    });
  } catch (error: any) {
    console.error("Error approving user:", error);
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
