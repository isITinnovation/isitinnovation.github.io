import { VercelRequest, VercelResponse } from "@vercel/node";
import pool from "./utils/mysql";

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
    const connection = await pool.getConnection();

    try {
      // 카테고리 필터링
      const { category } = request.query;
      let query = "SELECT * FROM blog_posts";
      const params: any[] = [];

      if (category && typeof category === "string") {
        query += " WHERE category = ?";
        params.push(category);
      }

      // 최신 글이 먼저 오도록 정렬
      query += " ORDER BY created_at DESC";

      // 블로그 포스트 조회
      const [rows] = await connection.query(query, params);

      // 응답 객체 생성
      const posts: BlogPost[] = (rows as any[]).map((row) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        tags: JSON.parse(row.tags || "[]"),
        category: row.category,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      // 성공 응답
      return response.status(200).json({
        success: true,
        count: posts.length,
        posts,
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
