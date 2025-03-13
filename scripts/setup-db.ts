import mysql from "mysql2/promise";
import dotenv from "dotenv";

// 환경 변수 로드
dotenv.config();

async function setupDatabase() {
  // MySQL 연결 설정
  const dbConfig = {
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "isit_blog",
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
  };

  console.log("데이터베이스 설정을 시작합니다...");
  console.log(`데이터베이스: ${dbConfig.database}`);

  // 연결 생성
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
  });

  try {
    // 데이터베이스 생성 (없는 경우)
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`
    );
    console.log(
      `데이터베이스 '${dbConfig.database}' 생성 완료 또는 이미 존재함`
    );

    // 데이터베이스 선택
    await connection.query(`USE ${dbConfig.database}`);
    console.log(`데이터베이스 '${dbConfig.database}' 선택됨`);

    // 블로그 포스트 테이블 생성
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
    console.log("blog_posts 테이블 생성 완료 또는 이미 존재함");

    console.log("데이터베이스 설정이 완료되었습니다.");
  } catch (error) {
    console.error("데이터베이스 설정 중 오류 발생:", error);
  } finally {
    await connection.end();
    console.log("데이터베이스 연결 종료");
  }
}

// 스크립트 실행
setupDatabase().catch(console.error);
