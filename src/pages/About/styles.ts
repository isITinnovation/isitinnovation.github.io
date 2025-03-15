import { styled } from "@mui/material/styles";
import { Box, Paper, Container, Typography, Divider } from "@mui/material";

// 컨테이너
export const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));

// 헤더 섹션
export const HeaderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  marginBottom: theme.spacing(4),
  backgroundColor: "#FFFFFF",
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  border: "1px solid #EEEEEE",
  position: "relative",
  overflow: "hidden",
}));

export const HeaderContent = styled(Box)(() => ({
  position: "relative",
  zIndex: 2,
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: "#000000",
  marginBottom: theme.spacing(1),
}));

export const Subtitle = styled(Typography)(() => ({
  color: "#333333",
  opacity: 0.8,
  maxWidth: 600,
}));

// 섹션 공통
export const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  backgroundColor: "#FFFFFF",
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  border: "1px solid #EEEEEE",
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

export const SectionIcon = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(1.5),
  color: "#333333",
  display: "flex",
  alignItems: "center",
}));

export const SectionTitle = styled(Typography)(() => ({
  fontWeight: 700,
  color: "#000000",
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: "#EEEEEE",
}));

export const Paragraph = styled(Typography)(({ theme }) => ({
  color: "#333333",
  marginBottom: theme.spacing(2),
  lineHeight: 1.7,
  "&:last-child": {
    marginBottom: 0,
  },
}));

// 콘텐츠 아이템
export const ContentGrid = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const ContentItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

export const ContentIconBox = styled(Box)(() => ({
  width: 48,
  height: 48,
  borderRadius: "50%",
  backgroundColor: "#F5F5F5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
}));

export const ContentTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: "#000000",
  marginBottom: theme.spacing(1),
}));

export const ContentDesc = styled(Typography)(() => ({
  color: "#555555",
  lineHeight: 1.6,
}));

// 푸터
export const Footer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  textAlign: "center",
  padding: theme.spacing(2),
}));

export const FooterText = styled(Typography)(() => ({
  color: "#777777",
}));
