import { styled } from "@mui/material/styles";
import { Box, Paper, Container, Typography, Alert } from "@mui/material";

// 컨테이너
export const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));

// 헤더 섹션
export const HeaderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  backgroundColor: "#FFFFFF",
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  border: "1px solid #EEEEEE",
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: "#000000",
  marginBottom: theme.spacing(1),
}));

export const Subtitle = styled(Typography)(() => ({
  color: "#333333",
  opacity: 0.8,
}));

// 콘텐츠 섹션
export const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(0, 0, 3, 0),
  backgroundColor: "#FFFFFF",
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  border: "1px solid #EEEEEE",
}));

// 로딩 및 오류 상태
export const LoadingBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(8),
}));

export const StyledAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

// 테이블 스타일
export const TableContainer = styled(Box)(({ theme }) => ({
  overflowX: "auto",
  marginTop: theme.spacing(2),
}));

// 버튼 컨테이너
export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  justifyContent: "flex-end",
  marginTop: theme.spacing(2),
}));

// 검색 및 필터 영역
export const FilterContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  alignItems: "center",
}));

// 사용자 정보 카드
export const UserCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: "1px solid #EEEEEE",
  transition: "all 0.2s",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
}));

// 사용자 정보 헤더
export const UserCardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

// 사용자 정보 콘텐츠
export const UserCardContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

// 사용자 정보 행
export const UserInfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
}));

// 사용자 정보 라벨
export const UserInfoLabel = styled(Typography)(() => ({
  fontWeight: 600,
  color: "#555555",
  width: "120px",
}));

// 사용자 정보 값
export const UserInfoValue = styled(Typography)(() => ({
  color: "#000000",
}));

// 탭 스타일
export const StyledTabs = styled(Box)(({ theme }) => ({
  borderBottom: "1px solid #EEEEEE",
  marginBottom: theme.spacing(3),
}));

// 유틸리티 함수로 스타일 객체 생성
export const useStyles = () => ({
  container: {
    paddingTop: "2rem",
    paddingBottom: "4rem",
  },
  headerPaper: {
    padding: "2rem",
    marginBottom: "2rem",
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    border: "1px solid #EEEEEE",
  },
  title: {
    fontWeight: 800,
    color: "#000000",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#333333",
    opacity: 0.8,
  },
  contentPaper: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    border: "1px solid #EEEEEE",
    overflow: "hidden",
  },
  loadingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem",
  },
  alert: {
    marginBottom: "2rem",
  },
  tabs: {
    "& .MuiTab-root": {
      fontWeight: 600,
      color: "#555555",
      "&.Mui-selected": {
        color: "#000000",
      },
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "#000000",
    },
  },
});
