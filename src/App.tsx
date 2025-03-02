import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home/index";
import TrendingTopics from "./pages/TrendingTopics/index";
import PromptGuide from "./pages/PromptGuide/index";
import BlogEditor from "./pages/BlogEditor/index";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF5B59",
      light: "#FF7A78",
      dark: "#E63E3C",
    },
    secondary: {
      main: "#222222",
      light: "#666666",
      dark: "#000000",
    },
    background: {
      default: "#F8F8F8",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", sans-serif',
  },
});

const App = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename="/">
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
            display: "flex",
          }}
        >
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          <Box
            sx={{
              flex: 1,
              marginLeft: { xs: 0, md: "250px" }, // 모바일에서는 마진 제거
              position: "relative",
              zIndex: 100, // 사이드바(1000)보다 낮은 z-index 설정
            }}
          >
            <Box
              sx={{
                position: "relative",
                zIndex: 1200, // 사이드바와 토글 버튼보다 높은 z-index
              }}
            >
              <Header isOpen={isOpen} setIsOpen={setIsOpen} />
            </Box>
            <Box
              component="main"
              sx={{
                paddingTop: "140px",
                paddingX: "2rem",
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
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
