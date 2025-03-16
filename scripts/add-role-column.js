require("dotenv").config();
const mysql = require("mysql2/promise");

async function main() {
  console.log("사용자 테이블에 role 컬럼 추가 시작...");

  // 데이터베이스 연결 생성
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // 테이블 존재 여부 확인
    const [tables] = await connection.execute("SHOW TABLES LIKE 'users'");

    if (tables.length === 0) {
      console.log(
        "users 테이블이 존재하지 않습니다. 먼저 테이블을 생성해주세요."
      );
      return;
    }

    // role 컬럼 존재 여부 확인
    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM users LIKE 'role'"
    );

    if (columns.length > 0) {
      console.log("role 컬럼이 이미 존재합니다.");
    } else {
      // role 컬럼 추가
      await connection.execute(
        "ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user' AFTER approvedYN"
      );
      console.log("role 컬럼이 성공적으로 추가되었습니다.");
    }

    // 첫 번째 사용자를 관리자로 설정 (선택 사항)
    const [firstUser] = await connection.execute(
      "SELECT id FROM users ORDER BY created_at ASC LIMIT 1"
    );

    if (firstUser.length > 0) {
      await connection.execute("UPDATE users SET role = 'admin' WHERE id = ?", [
        firstUser[0].id,
      ]);
      console.log(`사용자 ID ${firstUser[0].id}가 관리자로 설정되었습니다.`);
    } else {
      console.log("사용자가 없습니다. 관리자를 설정할 수 없습니다.");
    }

    console.log("마이그레이션이 성공적으로 완료되었습니다.");
  } catch (error) {
    console.error("마이그레이션 중 오류가 발생했습니다:", error);
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
