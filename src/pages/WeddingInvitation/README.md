# 모바일 청첩장 페이지

## 개요

모바일 환경에 최적화된 디지털 청첩장 페이지입니다. React와 Material-UI를 사용하여 제작되었습니다.

## 주요 기능

### 1. 카운트다운 타이머

- 예식까지 남은 시간을 실시간으로 표시
- 일, 시간, 분, 초 단위로 카운트다운

### 2. 예식 정보

- 날짜 및 시간
- 장소 정보
- 지도 보기 기능 (카카오맵, 네이버맵)

### 3. 신랑신부 정보

- 신랑신부 이름
- 양가 부모님 정보

### 4. 연락처

- 신랑신부 연락처
- 이메일 정보
- 직접 전화 연결 기능

### 5. 공유 기능

- 네이티브 공유 API 지원
- 링크 복사 기능

## 사용법

### 1. 날짜 수정

```typescript
// WeddingInvitation.tsx 파일에서
const weddingDate = new Date("2024-12-31T14:00:00");
```

### 2. 신랑신부 정보 수정

```typescript
// 이름, 연락처, 부모님 정보 등
<Typography variant="body1" className="names">
  홍길동 & 김영희
</Typography>
```

### 3. 장소 정보 수정

```typescript
// 주소 및 좌표 정보
<Typography variant="body2" className="info-value">
  우리교회 (서울시 강남구 테헤란로 123)
</Typography>
```

### 4. 지도 링크 수정

```typescript
const openKakaoMap = () => {
  // 실제 주소의 좌표로 수정
  window.open("https://map.kakao.com/link/map/우리교회,37.5665,126.9780");
};
```

## 스타일 커스터마이징

### 색상 테마

- 주요 색상: `#667eea` (파란색 계열)
- 그라데이션: 파란색에서 보라색으로
- 배경: 연한 회색 그라데이션

### 반응형 디자인

- 모바일 우선 설계
- 태블릿 및 데스크톱 지원
- 터치 친화적 UI

## 기술 스택

- React 18
- TypeScript
- Material-UI (MUI)
- CSS3 (애니메이션, 그라데이션)

## 브라우저 지원

- 모바일 브라우저 (iOS Safari, Chrome Mobile)
- 데스크톱 브라우저 (Chrome, Firefox, Safari, Edge)
- 공유 API 지원 브라우저

## 라우팅

- 경로: `/wedding`
- 사이드바 메뉴에 "청첩장" 항목으로 추가됨

## 주의사항

1. 실제 사용 시 모든 샘플 데이터를 실제 정보로 교체해야 합니다.
2. 지도 링크의 좌표는 실제 장소의 좌표로 수정해야 합니다.
3. 연락처 정보는 실제 연락처로 변경해야 합니다.
4. 이미지나 로고가 필요한 경우 적절한 에셋을 추가해야 합니다.
