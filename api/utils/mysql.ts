import mysql from "mysql2/promise";
import dotenv from "dotenv";

// 환경 변수 로드
dotenv.config();

// 호스트 주소 처리
let host = process.env.MYSQL_HOST || "localhost";
let port: number | undefined;

// 호스트에 포트가 포함되어 있는 경우 분리
if (host.includes(":")) {
  const parts = host.split(":");
  host = parts[0];
  port = parseInt(parts[1], 10);
}

// 환경 변수에서 포트를 직접 설정한 경우 우선 사용
if (process.env.MYSQL_PORT) {
  port = parseInt(process.env.MYSQL_PORT, 10);
}

// 디버깅을 위한 로그
console.log("MySQL 연결 정보:");
console.log("원본 MYSQL_HOST:", process.env.MYSQL_HOST);
console.log("처리된 호스트:", host);
console.log("처리된 포트:", port);
console.log("MYSQL_PORT 환경변수:", process.env.MYSQL_PORT);

// MySQL 연결 설정
const dbConfig: any = {
  host: host,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "isitinovation",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// 포트가 있는 경우에만 설정에 추가
if (port) {
  dbConfig.port = port;
}

// 최종 연결 설정 로그
console.log("최종 MySQL 연결 설정:", {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
});

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
    if (error instanceof Error) {
      console.error("오류 메시지:", error.message);
      console.error("오류 스택:", error.stack);
      if ("code" in error) {
        console.error("오류 코드:", (error as any).code);
      }
      if ("errno" in error) {
        console.error("오류 번호:", (error as any).errno);
      }
      if ("sqlMessage" in error) {
        console.error("SQL 오류 메시지:", (error as any).sqlMessage);
      }
    }
    return false;
  }
};

// 연결 풀 내보내기
export default pool;
