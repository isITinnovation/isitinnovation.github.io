import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Box, ThemeProvider } from "@mui/material";
import Header from "./components/Header";
import Home from "./pages/Home/index";
import TrendingTopics from "./pages/TrendingTopics/index";
import PromptGuide from "./pages/PromptGuide/index";
import BlogEditor from "./pages/BlogEditor/index";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { theme } from "./styles/theme"; // MUI theme
import Layout from "./components/Layout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/trending" element={<TrendingTopics />} />
      <Route path="/prompt-guide" element={<PromptGuide />} />
      <Route path="/write" element={<BlogEditor />} />
    </Route>
  ),
  {
    basename: "/isITinnovation",
  }
);

const App = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </StyledThemeProvider>
    </MuiThemeProvider>
  );
};

export default App;
