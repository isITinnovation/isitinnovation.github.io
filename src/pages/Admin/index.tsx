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
} from "@mui/material";
import { isAuthenticated, getCurrentUser } from "../../utils/authService";
import UserApprovalPanel from "./UserApprovalPanel";
import UserManagementPanel from "./UserManagementPanel";

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
  const user = getCurrentUser() as User | null;

  useEffect(() => {
    // 인증 및 권한 확인
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    // 승인된 사용자인지 확인
    if (!user?.approved) {
      setError("관리자 권한이 없습니다.");
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [navigate, user]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  if (error) {
    return (
      <Container
        maxWidth="lg"
        sx={{ paddingTop: "2rem", paddingBottom: "4rem" }}
      >
        <Alert severity="error" sx={{ marginBottom: "2rem" }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <Paper
        sx={{
          padding: "2rem",
          marginBottom: "2rem",
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid #EEEEEE",
        }}
      >
        <Typography
          variant="h4"
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
            sx={{
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
            }}
          >
            <Tab label="회원가입 승인" {...a11yProps(0)} />
            <Tab label="사용자 관리" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <UserApprovalPanel />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <UserManagementPanel />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AdminPage;
