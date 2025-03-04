import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#5D5DFF",
      light: "#8080FF",
      dark: "#4040CC",
    },
    secondary: {
      main: "#33BBCF",
      light: "#5ECFDF",
      dark: "#2699A9",
    },
    background: {
      default: "#0a0f29",
      paper: "#1a1b46",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3c7d6",
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
  },
});
