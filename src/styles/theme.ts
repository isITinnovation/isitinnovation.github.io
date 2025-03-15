import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
      light: "#333333",
      dark: "#000000",
    },
    secondary: {
      main: "#666666",
      light: "#999999",
      dark: "#333333",
    },
    background: {
      default: "#ffffff",
      paper: "#fafafa",
    },
    text: {
      primary: "#000000",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.85)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
        },
      },
    },
  },
});
