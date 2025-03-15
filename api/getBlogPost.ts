import { VercelRequest, VercelResponse } from "@vercel/node";
import pool from "./utils/mysql.js";

// 블로그 포스트 타입 정의
interface BlogPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // GET 요청만 처리
  if (request.method !== "GET") {
    return response.status(405).json({ error: "허용되지 않는 메소드입니다." });
  }

  try {
    const { id } = request.query;

    // ID 검증
    if (!id || typeof id !== "string") {
      return response.status(400).json({ error: "유효한 ID가 필요합니다." });
    }

    const connection = await pool.getConnection();

    try {
      // 블로그 포스트 조회
      const [rows] = await connection.query(
        "SELECT * FROM blog_posts WHERE id = ?",
        [id]
      );

      // 포스트가 없는 경우
      if (!rows || (rows as any[]).length === 0) {
        return response.status(404).json({
          error: "블로그 포스트를 찾을 수 없습니다.",
        });
      }

      const row = (rows as any[])[0];

      // 응답 객체 생성
      const post: BlogPost = {
        id: row.id,
        title: row.title,
        content: row.content,
        tags: JSON.parse(row.tags || "[]"),
        category: row.category,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };

      // 성공 응답
      return response.status(200).json({
        success: true,
        post,
      });
    } finally {
      connection.release(); // 연결 반환
    }
  } catch (error) {
    console.error("블로그 포스트 조회 중 오류 발생:", error);
    return response.status(500).json({
      error: "서버 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : "알 수 없는 오류",
    });
  }
}
