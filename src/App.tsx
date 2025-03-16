import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box, useMediaQuery, ThemeProvider } from "@mui/material";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home/index";
import StockInfo from "./pages/TrendingTopics/index";
import PromptGuide from "./pages/PromptGuide/index";
import BlogEditor from "./pages/BlogEditor/index";
import PostDetailPage from "./pages/PostDetail";
import CategoryPage from "./pages/Category/index";
import Login from "./pages/Login/index";
import Register from "./pages/Register/index";
import Profile from "./pages/Profile/index";
import About from "./pages/About/index";
import AdminPage from "./pages/Admin/index";
import ProtectedRoute from "./components/ProtectedRoute";
import { theme } from "./styles/theme";

// 배포 환경에 따라 basename 설정
const getBasename = () => {
  // Vercel 환경이거나 로컬 개발 환경인 경우
  if (
    window.location.hostname.includes("vercel.app") ||
    window.location.hostname === "localhost"
  ) {
    return "/";
  }
  // GitHub Pages인 경우
  return "/";
};

const App = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isOpen, setIsOpen] = useState(!isMobile); // 모바일이 아니면 true, 모바일이면 false
  const [searchValue, setSearchValue] = useState("");

  // 화면 크기가 변경될 때 사이드바 상태 업데이트
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename={getBasename()}>
        <Header
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
            display: "flex",
            paddingTop: "40px", // Header 높이만큼 여백 추가
          }}
        >
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          <Box
            sx={{
              flex: 1,
              marginLeft: { xs: 0, md: isOpen ? "250px" : "0" },
              transition: "margin-left 0.3s ease",
              position: "relative",
              zIndex: 100,
            }}
          >
            <Box
              component="main"
              sx={{
                paddingX: "0.5rem",
                height: "80vh",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Routes>
                <Route
                  path="/isITinnovation"
                  element={<Home searchValue={searchValue} />}
                />
                <Route path="/" element={<Home searchValue={searchValue} />} />
                <Route path="/post/:id" element={<PostDetailPage />} />
                <Route path="/stock-trend" element={<StockInfo />} />
                <Route path="/prompt-guide" element={<PromptGuide />} />
                <Route path="/about" element={<About />} />
                <Route
                  path="/write"
                  element={
                    <ProtectedRoute>
                      <BlogEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/category/:categoryName"
                  element={<CategoryPage />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
