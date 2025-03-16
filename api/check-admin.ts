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

  let connection;
  try {
    // 데이터베이스 연결
    connection = await pool.getConnection();

    // 사용자 정보 조회
    const [rows] = await connection.execute(
      "SELECT role FROM users WHERE id = ?",
      [decodedToken.userId]
    );

    const users = rows as any[];
    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    const user = users[0];
    const isAdmin = user.role === "admin";

    return res.status(200).json({
      success: true,
      isAdmin,
    });
  } catch (error: any) {
    console.error("Error checking admin status:", error);
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
