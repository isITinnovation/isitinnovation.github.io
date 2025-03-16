import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import {
  isAuthenticated,
  getCurrentUser,
  isAdmin,
} from "../../utils/authService";
import UserApprovalPanel from "./UserApprovalPanel";
import UserManagementPanel from "./UserManagementPanel";

// 목업 데이터
const MOCK_USERS = [
  {
    id: "mock-1",
    name: "홍길동",
    email: "hong@example.com",
    approvedYN: "Y",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-2",
    name: "김철수",
    email: "kim@example.com",
    approvedYN: "N",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-3",
    name: "이영희",
    email: "lee@example.com",
    approvedYN: "Y",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-4",
    name: "박지민",
    email: "park@example.com",
    approvedYN: "N",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-5",
    name: "최민수",
    email: "choi@example.com",
    approvedYN: "N",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// User 인터페이스 정의 (getCurrentUser 함수의 반환 타입에 맞게)
interface User {
  id: string;
  name: string;
  email: string;
  approvedYN?: string;
  approved?: boolean; // 추가된 속성
  role?: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    "aria-controls": `admin-tabpanel-${index}`,
  };
}

const AdminPage = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const [showMockBanner, setShowMockBanner] = useState(false);
  const user = getCurrentUser() as User | null;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // 인증 및 권한 확인
    if (!isAuthenticated()) {
      // 개발 환경에서는 목업 데이터 사용
      if (process.env.NODE_ENV === "development") {
        console.log("개발 환경에서 목업 데이터를 사용합니다.");
        setUseMockData(true);
        setShowMockBanner(true);
        setLoading(false);
      } else {
        navigate("/login");
        return;
      }
    } else {
      // 관리자 권한 확인
      if (!isAdmin()) {
        // 개발 환경에서는 목업 데이터 사용
        if (process.env.NODE_ENV === "development") {
          console.log("개발 환경에서 목업 데이터를 사용합니다.");
          setUseMockData(true);
          setShowMockBanner(true);
          setLoading(false);
        } else {
          setError("관리자 권한이 없습니다.");
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, [navigate, user]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 목업 데이터 사용 토글
  const toggleMockData = () => {
    setUseMockData(!useMockData);
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ paddingTop: "2rem", paddingBottom: "4rem" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem",
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            로딩 중...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error && !useMockData) {
    return (
      <Container
        maxWidth="lg"
        sx={{ paddingTop: "2rem", paddingBottom: "4rem" }}
      >
        <Alert severity="error" sx={{ marginBottom: "2rem" }}>
          {error}
        </Alert>
        {process.env.NODE_ENV === "development" && (
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={toggleMockData}
            >
              목업 데이터로 보기
            </Button>
          </Box>
        )}
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        paddingTop: isMobile ? "1rem" : "2rem",
        paddingBottom: isMobile ? "2rem" : "4rem",
        px: isMobile ? 1 : 2,
      }}
    >
      {showMockBanner && (
        <Alert
          severity="info"
          sx={{ marginBottom: "1rem" }}
          action={
            <Button color="inherit" size="small" onClick={toggleMockData}>
              {useMockData ? "목업 데이터 숨기기" : "목업 데이터 보기"}
            </Button>
          }
        >
          현재 목업 데이터를 사용하고 있습니다. 실제 API 연결이 되지 않았습니다.
        </Alert>
      )}

      <Paper
        sx={{
          padding: isMobile ? "1rem" : "2rem",
          marginBottom: isMobile ? "1rem" : "2rem",
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid #EEEEEE",
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{ fontWeight: 800, color: "#000000", marginBottom: "0.5rem" }}
        >
          관리자 페이지
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#333333", opacity: 0.8 }}>
          사용자 승인 및 관리
        </Typography>
      </Paper>

      <Paper
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          border: "1px solid #EEEEEE",
          overflow: "hidden",
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="관리자 탭"
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{
              "& .MuiTab-root": {
                fontWeight: 600,
                color: "#555555",
                fontSize: isMobile ? "0.875rem" : "1rem",
                padding: isMobile ? "0.5rem" : "1rem",
                "&.Mui-selected": {
                  color: "#000000",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#000000",
              },
            }}
          >
            <Tab label="회원가입 승인" {...a11yProps(0)} />
            <Tab label="사용자 관리" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {useMockData ? (
            <UserApprovalPanel mockUsers={MOCK_USERS} useMockData={true} />
          ) : (
            <UserApprovalPanel />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {useMockData ? (
            <UserManagementPanel mockUsers={MOCK_USERS} useMockData={true} />
          ) : (
            <UserManagementPanel />
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AdminPage;
