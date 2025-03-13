# isitBlog

IT 트렌드 블로그 프로젝트입니다.

## 기술 스택

- React
- TypeScript
- Vite
- Material UI
- Vercel 서버리스 함수
- MySQL 데이터베이스

## 개발 환경 설정

1. 저장소 클론

```bash
git clone https://github.com/your-username/isitBlog.git
cd isitBlog
```

2. 의존성 설치

```bash
pnpm install
```

3. 환경 변수 설정
   `.env.example` 파일을 복사하여 `.env` 파일을 생성하고 MySQL 데이터베이스 연결 정보를 설정합니다.

```bash
cp .env.example .env
```

4. 데이터베이스 설정

```bash
pnpm run setup-db
```

5. 개발 서버 실행

```bash
pnpm run dev
```

## Vercel 배포

### 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정해야 합니다:

- `MYSQL_HOST`: MySQL 데이터베이스 호스트
- `MYSQL_USER`: MySQL 데이터베이스 사용자
- `MYSQL_PASSWORD`: MySQL 데이터베이스 비밀번호
- `MYSQL_DATABASE`: MySQL 데이터베이스 이름

### 배포 방법

1. GitHub 저장소를 Vercel에 연결합니다.
2. 환경 변수를 설정합니다.
3. 배포 설정에서 프레임워크 프리셋으로 "Vite"를 선택합니다.
4. 배포 버튼을 클릭하여 배포를 시작합니다.

## 서버리스 함수 API

### 블로그 포스트 저장

- **URL**: `/api/saveBlogPost`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "title": "포스트 제목",
    "content": "포스트 내용",
    "tags": ["태그1", "태그2"],
    "category": "카테고리"
  }
  ```

### 블로그 포스트 목록 조회

- **URL**: `/api/getBlogPosts`
- **Method**: `GET`
- **Query Parameters**:
  - `category` (선택): 특정 카테고리의 포스트만 조회

### 단일 블로그 포스트 조회

- **URL**: `/api/getBlogPost`
- **Method**: `GET`
- **Query Parameters**:
  - `id` (필수): 조회할 포스트 ID
