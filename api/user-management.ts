import { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";
import pool from "./utils/mysql.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  // OPTIONS 요청 처리 (preflight 요청)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // GET 요청 처리 (사용자 목록 조회)
  if (req.method === "GET") {
    return handleGetUsers(req, res);
  }

  // POST 요청 처리 (사용자 승인/삭제/비밀번호 변경/프로필 업데이트/로그인/로그아웃)
  if (req.method === "POST") {
    return handlePostRequest(req, res);
  }

  // PUT 요청 처리 (사용자 정보 업데이트)
  if (req.method === "PUT") {
    return handlePutRequest(req, res);
  }

  // 지원하지 않는 메서드
  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}

// GET 요청 처리 함수 (사용자 목록 조회)
async function handleGetUsers(req: VercelRequest, res: VercelResponse) {
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

  // 타임스탬프 확인 (선택 사항)
  const timestamp = req.query.timestamp as string;
  if (!timestamp) {
    return res
      .status(400)
      .json({ success: false, message: "타임스탬프가 필요합니다." });
  }

  const currentTime = new Date().getTime();
  const requestTime = parseInt(timestamp);

  // 5분 이내의 요청만 허용
  if (currentTime - requestTime > 5 * 60 * 1000) {
    return res
      .status(400)
      .json({ success: false, message: "요청이 만료되었습니다." });
  }

  let connection;
  try {
    // 데이터베이스 연결
    connection = await pool.getConnection();

    // 관리자 권한 확인 (선택 사항)
    const [adminRows] = await connection.execute(
      "SELECT role FROM users WHERE id = ?",
      [decodedToken.userId]
    );

    const adminUser = (adminRows as any[])[0];
    if (!adminUser || adminUser.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "관리자 권한이 필요합니다." });
    }

    // 사용자 목록 조회
    const [rows] = await connection.execute(
      "SELECT id, name, email, approvedYN, created_at, updated_at FROM users ORDER BY created_at DESC"
    );

    return res.status(200).json({ success: true, users: rows });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// POST 요청 처리 함수
async function handlePostRequest(req: VercelRequest, res: VercelResponse) {
  const { action, timestamp } = req.body;

  // 로그인 요청 처리
  if (action === "login") {
    return handleLogin(req, res);
  }

  // 로그아웃 요청 처리
  if (action === "logout") {
    return handleLogout(req, res);
  }

  // 회원가입 요청 처리
  if (action === "register") {
    return handleRegister(req, res);
  }

  // 인증이 필요한 다른 액션들
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

  // 필수 필드 확인
  if (!action || !timestamp) {
    return res
      .status(400)
      .json({ success: false, message: "필수 필드가 누락되었습니다." });
  }

  const currentTime = new Date().getTime();
  const requestTime = parseInt(timestamp);

  // 5분 이내의 요청만 허용
  if (currentTime - requestTime > 5 * 60 * 1000) {
    return res
      .status(400)
      .json({ success: false, message: "요청이 만료되었습니다." });
  }

  // 액션에 따른 처리
  switch (action) {
    case "approve":
      return handleApproveUser(req, res, decodedToken);
    case "delete":
      return handleDeleteUser(req, res, decodedToken);
    case "change-password":
      return handleChangePassword(req, res, decodedToken);
    case "update-profile":
      return handleUpdateProfile(req, res, decodedToken);
    default:
      return res.status(400).json({
        success: false,
        message: "유효하지 않은 action 값입니다.",
      });
  }
}

// PUT 요청 처리 함수 (사용자 정보 업데이트)
async function handlePutRequest(req: VercelRequest, res: VercelResponse) {
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

  return handleUpdateUser(req, res, decodedToken);
}

// 로그인 처리 함수
async function handleLogin(req: VercelRequest, res: VercelResponse) {
  try {
    const { email, password, timestamp } = req.body;

    // 필수 필드 검증
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "이메일과 비밀번호는 필수 항목입니다.",
      });
    }

    // 타임스탬프 검증 (5분 이내)
    const currentTime = new Date().getTime();
    const requestTime = timestamp ? parseInt(timestamp.toString()) : 0;

    if (!requestTime || currentTime - requestTime > 5 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: "요청이 만료되었습니다. 다시 시도해주세요.",
      });
    }

    const connection = await pool.getConnection();

    try {
      // 테이블이 존재하는지 확인
      try {
        // 테이블 존재 여부 확인
        const [tables] = await connection.query("SHOW TABLES LIKE 'users'");

        // 테이블이 없으면 생성
        if ((tables as any[]).length === 0) {
          console.log(
            "users 테이블이 존재하지 않습니다. 테이블을 생성합니다..."
          );

          await connection.query(`
            CREATE TABLE users (
              id VARCHAR(36) PRIMARY KEY,
              name VARCHAR(100) NOT NULL,
              email VARCHAR(100) NOT NULL UNIQUE,
              password VARCHAR(255) NOT NULL,
              approvedYN CHAR(1) DEFAULT 'N',
              role VARCHAR(20) DEFAULT 'user',
              created_at DATETIME NOT NULL,
              updated_at DATETIME NOT NULL,
              INDEX idx_email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
          `);

          console.log("users 테이블이 성공적으로 생성되었습니다.");
        } else {
          // 테이블이 존재하지만 role 컬럼이 없는 경우 추가
          try {
            const [columns] = await connection.query(
              "SHOW COLUMNS FROM users LIKE 'role'"
            );
            if ((columns as any[]).length === 0) {
              await connection.query(
                "ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user' AFTER approvedYN"
              );
              console.log("role 컬럼이 성공적으로 추가되었습니다.");
            }
          } catch (columnError) {
            console.error("컬럼 확인/추가 중 오류 발생:", columnError);
          }

          // 테이블이 존재하지만 approvedYN 컬럼이 없는 경우 추가
          try {
            const [columns] = await connection.query(
              "SHOW COLUMNS FROM users LIKE 'approvedYN'"
            );
            if ((columns as any[]).length === 0) {
              await connection.query(
                "ALTER TABLE users ADD COLUMN approvedYN CHAR(1) DEFAULT 'N' AFTER password"
              );
              console.log("approvedYN 컬럼이 성공적으로 추가되었습니다.");
            }
          } catch (columnError) {
            console.error("컬럼 확인/추가 중 오류 발생:", columnError);
          }
        }
      } catch (tableError) {
        console.error("테이블 확인/생성 중 오류 발생:", tableError);
        // 테이블 생성 오류는 무시하고 계속 진행 (이미 존재할 수 있음)
      }

      // 사용자 조회
      const [users] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      const userArray = users as any[];

      if (userArray.length === 0) {
        return res.status(401).json({
          success: false,
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        });
      }

      const user = userArray[0];

      // 비밀번호 검증
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        });
      }

      // 승인 여부 확인
      if (user.approvedYN !== "Y") {
        return res.status(403).json({
          success: false,
          message:
            "아직 승인되지 않은 계정입니다. 관리자 승인 후 로그인이 가능합니다.",
        });
      }

      // JWT 토큰 생성
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role || "user",
        },
        process.env.JWT_SECRET || "fallback_secret_key_for_development",
        { expiresIn: "24h" }
      );

      // 성공 응답
      return res.status(200).json({
        success: true,
        message: "로그인이 성공적으로 완료되었습니다.",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          approved: user.approvedYN === "Y",
          role: user.role || "user",
        },
      });
    } finally {
      connection.release(); // 연결 반환
    }
  } catch (error) {
    console.error("로그인 처리 중 오류 발생:", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : "알 수 없는 오류",
    });
  }
}

// 로그아웃 처리 함수
async function handleLogout(req: VercelRequest, res: VercelResponse) {
  try {
    // 인증 토큰 확인 //
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(200).json({
        success: true,
        message: "로그아웃 되었습니다.",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      // 토큰 검증 (실제로는 블랙리스트에 추가하는 로직이 필요)
      jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret_key_for_development"
      );

      // 여기서는 클라이언트 측에서 토큰을 삭제하는 방식으로 구현
      // 실제 프로덕션 환경에서는 Redis 등을 사용하여 토큰 블랙리스트 관리 필요
    } catch (error) {
      // 토큰이 유효하지 않아도 로그아웃 성공으로 처리
    }

    // 성공 응답
    return res.status(200).json({
      success: true,
      message: "로그아웃 되었습니다.",
    });
  } catch (error) {
    console.error("로그아웃 처리 중 오류 발생:", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : "알 수 없는 오류",
    });
  }
}

// 사용자 승인 처리 함수
async function handleApproveUser(
  req: VercelRequest,
  res: VercelResponse,
  decodedToken: DecodedToken
) {
  const { userId, approved } = req.body;

  // 필수 필드 확인
  if (!userId || approved === undefined) {
    return res
      .status(400)
      .json({ success: false, message: "필수 필드가 누락되었습니다." });
  }

  let connection;
  try {
    // 데이터베이스 연결
    connection = await pool.getConnection();

    // 관리자 권한 확인
    const [adminRows] = await connection.execute(
      "SELECT role FROM users WHERE id = ?",
      [decodedToken.userId]
    );

    const adminUser = (adminRows as any[])[0];
    if (!adminUser || adminUser.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "관리자 권한이 필요합니다." });
    }

    // 사용자 존재 여부 확인
    const [userRows] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    if ((userRows as any[]).length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    // 승인 상태 업데이트
    const approvedYN = approved ? "Y" : "N";
    await connection.execute(
      "UPDATE users SET approvedYN = ?, updated_at = NOW() WHERE id = ?",
      [approvedYN, userId]
    );

    // 업데이트된 사용자 정보 조회
    const [updatedRows] = await connection.execute(
      "SELECT id, name, email, approvedYN, created_at, updated_at FROM users WHERE id = ?",
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: `사용자가 성공적으로 ${approved ? "승인" : "미승인"}되었습니다.`,
      user: (updatedRows as any[])[0],
    });
  } catch (error: any) {
    console.error("Error approving user:", error);
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// 사용자 삭제 처리 함수
async function handleDeleteUser(
  req: VercelRequest,
  res: VercelResponse,
  decodedToken: DecodedToken
) {
  const { userId } = req.body;

  // 필수 필드 확인
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "필수 필드가 누락되었습니다." });
  }

  let connection;
  try {
    // 데이터베이스 연결
    connection = await pool.getConnection();

    // 관리자 권한 확인
    const [adminRows] = await connection.execute(
      "SELECT role FROM users WHERE id = ?",
      [decodedToken.userId]
    );

    const adminUser = (adminRows as any[])[0];
    if (!adminUser || adminUser.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "관리자 권한이 필요합니다." });
    }

    // 자기 자신을 삭제하려는 경우 방지
    if (userId === decodedToken.userId) {
      return res
        .status(400)
        .json({ success: false, message: "자기 자신을 삭제할 수 없습니다." });
    }

    // 사용자 존재 여부 확인
    const [userRows] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    if ((userRows as any[]).length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    // 사용자 삭제
    await connection.execute("DELETE FROM users WHERE id = ?", [userId]);

    return res.status(200).json({
      success: true,
      message: "사용자가 성공적으로 삭제되었습니다.",
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// 비밀번호 변경 처리 함수
async function handleChangePassword(
  req: VercelRequest,
  res: VercelResponse,
  decodedToken: DecodedToken
) {
  const { currentPassword, newPassword } = req.body;

  // 필수 필드 검증
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "현재 비밀번호와 새 비밀번호는 필수 항목입니다.",
    });
  }

  // 비밀번호 복잡성 검증
  if (
    newPassword.length < 8 ||
    !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자를 포함해야 합니다.",
    });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // 사용자 조회
    const [users] = await connection.query("SELECT * FROM users WHERE id = ?", [
      decodedToken.userId,
    ]);

    const userArray = users as any[];

    if (userArray.length === 0) {
      return res.status(404).json({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    const user = userArray[0];

    // 현재 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "현재 비밀번호가 올바르지 않습니다.",
      });
    }

    // 새 비밀번호 해싱
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 비밀번호 업데이트
    await connection.query(
      "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
      [hashedPassword, decodedToken.userId]
    );

    // 성공 응답
    return res.status(200).json({
      success: true,
      message: "비밀번호가 성공적으로 변경되었습니다.",
    });
  } catch (error) {
    console.error("비밀번호 변경 처리 중 오류 발생:", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : "알 수 없는 오류",
    });
  } finally {
    if (connection) {
      connection.release(); // 연결 반환
    }
  }
}

// 프로필 업데이트 처리 함수
async function handleUpdateProfile(
  req: VercelRequest,
  res: VercelResponse,
  decodedToken: DecodedToken
) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "이름은 필수 입력 항목입니다.",
    });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // 사용자 정보 업데이트
    await connection.execute(
      "UPDATE users SET name = ?, updated_at = NOW() WHERE id = ?",
      [name, decodedToken.userId]
    );

    // 업데이트된 사용자 정보 조회
    const [rows] = await connection.execute(
      "SELECT id, name, email FROM users WHERE id = ?",
      [decodedToken.userId]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      const user = rows[0] as { id: string; name: string; email: string };

      return res.status(200).json({
        success: true,
        message: "프로필이 성공적으로 업데이트되었습니다.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }
  } catch (error) {
    console.error("프로필 업데이트 중 데이터베이스 오류:", error);
    return res.status(500).json({
      success: false,
      message: "프로필 업데이트 중 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : "알 수 없는 오류",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// 사용자 정보 업데이트 처리 함수 (관리자용)
async function handleUpdateUser(
  req: VercelRequest,
  res: VercelResponse,
  decodedToken: DecodedToken
) {
  // 요청 본문에서 필요한 데이터 추출
  const { userId, name, email, approvedYN } = req.body;

  // 필수 필드 확인
  if (!userId || !name || !email || !approvedYN) {
    return res
      .status(400)
      .json({ success: false, message: "필수 필드가 누락되었습니다." });
  }

  let connection;
  try {
    // 데이터베이스 연결
    connection = await pool.getConnection();

    // 관리자 권한 확인
    const [adminRows] = await connection.execute(
      "SELECT role FROM users WHERE id = ?",
      [decodedToken.userId]
    );

    const adminUser = (adminRows as any[])[0];
    if (!adminUser || adminUser.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "관리자 권한이 필요합니다." });
    }

    // 사용자 존재 여부 확인
    const [userRows] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    if ((userRows as any[]).length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    // 이메일 중복 확인 (현재 사용자 제외)
    const [emailRows] = await connection.execute(
      "SELECT * FROM users WHERE email = ? AND id != ?",
      [email, userId]
    );

    if ((emailRows as any[]).length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "이미 사용 중인 이메일입니다." });
    }

    // 사용자 정보 업데이트
    await connection.execute(
      "UPDATE users SET name = ?, email = ?, approvedYN = ?, updated_at = NOW() WHERE id = ?",
      [name, email, approvedYN, userId]
    );

    // 업데이트된 사용자 정보 조회
    const [updatedRows] = await connection.execute(
      "SELECT id, name, email, approvedYN, created_at, updated_at FROM users WHERE id = ?",
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "사용자 정보가 성공적으로 업데이트되었습니다.",
      user: (updatedRows as any[])[0],
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// 회원가입 처리 함수
async function handleRegister(req: VercelRequest, res: VercelResponse) {
  try {
    const { name, email, password, timestamp } = req.body;

    // 필수 필드 검증
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "이름, 이메일, 비밀번호는 필수 항목입니다.",
      });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "유효한 이메일 주소를 입력해주세요.",
      });
    }

    // 비밀번호 복잡성 검증
    if (
      password.length < 8 ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자를 포함해야 합니다.",
      });
    }

    // 타임스탬프 검증 (5분 이내)
    const currentTime = new Date().getTime();
    const requestTime = timestamp ? parseInt(timestamp.toString()) : 0;

    if (!requestTime || currentTime - requestTime > 5 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: "요청이 만료되었습니다. 다시 시도해주세요.",
      });
    }

    const connection = await pool.getConnection();

    try {
      // 테이블이 존재하는지 확인
      try {
        // 테이블 존재 여부 확인
        const [tables] = await connection.query("SHOW TABLES LIKE 'users'");

        // 테이블이 없으면 생성
        if ((tables as any[]).length === 0) {
          console.log(
            "users 테이블이 존재하지 않습니다. 테이블을 생성합니다..."
          );

          await connection.query(`
            CREATE TABLE users (
              id VARCHAR(36) PRIMARY KEY,
              name VARCHAR(100) NOT NULL,
              email VARCHAR(100) NOT NULL UNIQUE,
              password VARCHAR(255) NOT NULL,
              approvedYN CHAR(1) DEFAULT 'N',
              role VARCHAR(20) DEFAULT 'user',
              created_at DATETIME NOT NULL,
              updated_at DATETIME NOT NULL,
              INDEX idx_email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
          `);

          console.log("users 테이블이 성공적으로 생성되었습니다.");
        }
      } catch (tableError) {
        console.error("테이블 확인/생성 중 오류 발생:", tableError);
        // 테이블 생성 오류는 무시하고 계속 진행 (이미 존재할 수 있음)
      }

      // 이메일 중복 확인
      const [existingUsers] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if ((existingUsers as any[]).length > 0) {
        return res.status(409).json({
          success: false,
          message: "이미 사용 중인 이메일입니다.",
        });
      }

      // 비밀번호 해싱
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 사용자 ID 생성
      const userId = uuidv4();

      // 사용자 생성
      await connection.query(
        "INSERT INTO users (id, name, email, password, created_at, updated_at, approvedYN, role) VALUES (?, ?, ?, ?, NOW(), NOW(), 'N', 'user')",
        [userId, name, email, hashedPassword]
      );

      // 성공 응답
      return res.status(201).json({
        success: true,
        message: "회원가입이 완료되었습니다.",
        userId,
      });
    } finally {
      connection.release(); // 연결 반환
    }
  } catch (error) {
    console.error("회원가입 처리 중 오류 발생:", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : "알 수 없는 오류",
    });
  }
}
