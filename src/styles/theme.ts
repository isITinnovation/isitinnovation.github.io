import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#606c38",
      light: "#7c8850",
      dark: "#434d28",
    },
    secondary: {
      main: "#283618",
      light: "#3f4f2a",
      dark: "#1c2611",
    },
    background: {
      default: "#fefae0",
      paper: "#dda15e",
    },
    text: {
      primary: "#283618",
      secondary: "#606c38",
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
