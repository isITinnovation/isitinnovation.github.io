import { VercelRequest, VercelResponse } from "@vercel/node";
import { v4 as uuidv4 } from "uuid";
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
  // POST 요청만 처리
  if (request.method !== "POST") {
    return response.status(405).json({ error: "허용되지 않는 메소드입니다." });
  }

  try {
    const { title, content, tags, category } = request.body;

    // 필수 필드 검증
    if (!title || !content || !category) {
      return response
        .status(400)
        .json({ error: "필수 필드가 누락되었습니다." });
    }

    // 새 블로그 포스트 객체 생성
    const postId = uuidv4();
    // MySQL이 이해할 수 있는 날짜 형식으로 변환
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
    const tagsString = JSON.stringify(tags || []);

    // MySQL에 저장
    const connection = await pool.getConnection();

    try {
      // 테이블이 없으면 생성
      await connection.query(`
        CREATE TABLE IF NOT EXISTS blog_posts (
          id VARCHAR(36) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          tags JSON,
          category VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      // 블로그 포스트 저장
      const [result] = await connection.query(
        `INSERT INTO blog_posts (id, title, content, tags, category, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          postId,
          title,
          content,
          tagsString,
          category,
          formattedDate,
          formattedDate,
        ]
      );

      // 저장된 포스트 조회
      const [rows] = await connection.query(
        "SELECT * FROM blog_posts WHERE id = ?",
        [postId]
      );

      const savedPost = rows[0];

      // 응답 객체 생성
      const blogPost: BlogPost = {
        id: savedPost.id,
        title: savedPost.title,
        content: savedPost.content,
        tags: parseTags(savedPost.tags),
        category: savedPost.category,
        createdAt: savedPost.created_at,
        updatedAt: savedPost.updated_at,
      };

      // 성공 응답
      return response.status(201).json({
        success: true,
        message: "블로그 포스트가 성공적으로 저장되었습니다.",
        post: blogPost,
      });
    } finally {
      connection.release(); // 연결 반환
    }
  } catch (error) {
    console.error("블로그 포스트 저장 중 오류 발생:", error);
    return response.status(500).json({
      error: "서버 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : "알 수 없는 오류",
    });
  }
}

// 태그 파싱 함수
function parseTags(tagsJson: any): string[] {
  if (!tagsJson) return [];

  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("태그 파싱 중 오류 발생:", error);
    return [];
  }
}
