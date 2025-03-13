import mysql from "mysql2/promise";
import dotenv from "dotenv";

// 환경 변수 로드
dotenv.config();

// MySQL 연결 설정
const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "isit_blog",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// 연결 풀 생성
const pool = mysql.createPool(dbConfig);

// 데이터베이스 연결 테스트
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL 데이터베이스에 성공적으로 연결되었습니다.");
    connection.release();
    return true;
  } catch (error) {
    console.error("MySQL 데이터베이스 연결 실패:", error);
    return false;
  }
};

// 연결 풀 내보내기
export default pool;
