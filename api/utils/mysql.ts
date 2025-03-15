import mysql from "mysql2/promise";
import dotenv from "dotenv";

// 환경 변수 로드
dotenv.config();

// 호스트와 포트 분리 함수
function parseHostAndPort(hostString: string): { host: string; port?: number } {
  if (hostString.includes(":")) {
    const [host, portStr] = hostString.split(":");
    return { host, port: parseInt(portStr, 10) };
  }
  return { host: hostString };
}

// 호스트 문자열 파싱
const hostConfig = parseHostAndPort(process.env.MYSQL_HOST || "localhost");

// MySQL 연결 설정
const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",,
  port: process.env.MYSQL_PORT
    ? parseInt(process.env.MYSQL_PORT, 10)
    : hostConfig.port,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "isitinnovation",
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
