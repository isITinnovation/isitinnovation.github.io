import mysql from "mysql2/promise";
import dotenv from "dotenv";

// 환경 변수 로드
dotenv.config();

async function setupUsersTable() {
  console.log("사용자 테이블 설정을 시작합니다...");

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

  console.log("MySQL 연결 설정:", {
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
  });

  try {
    // 데이터베이스 연결
    const connection = await mysql.createConnection(dbConfig);
    console.log("MySQL 데이터베이스에 연결되었습니다.");

    // users 테이블 생성
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log("users 테이블이 생성되었습니다.");

    // 연결 종료
    await connection.end();
    console.log("MySQL 연결이 종료되었습니다.");
    console.log("사용자 테이블 설정이 완료되었습니다.");
  } catch (error) {
    console.error("오류 발생:", error);
    process.exit(1);
  }
}

// 스크립트 실행
setupUsersTable();
