import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box, useMediaQuery, ThemeProvider } from "@mui/material";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home/index";
import TrendingTopics from "./pages/TrendingTopics/index";
import PromptGuide from "./pages/PromptGuide/index";
import BlogEditor from "./pages/BlogEditor/index";
import PostDetailPage from "./pages/PostDetail";
import { theme } from "./styles/theme";

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
      <BrowserRouter basename="/">
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
            paddingTop: "80px", // Header 높이만큼 여백 추가
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
                paddingTop: "60px",
                paddingX: "2rem",
                height: "100vh",
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
                <Route path="/trending" element={<TrendingTopics />} />
                <Route path="/prompt-guide" element={<PromptGuide />} />
                <Route path="/write" element={<BlogEditor />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
