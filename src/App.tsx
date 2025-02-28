import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import Header from "./components/Header";
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
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
          }}
        >
          <Header />
          <Box
            component="main"
            sx={{
              paddingTop: "140px", // 헤더 높이(약 120px) + 여유 공간
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
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
