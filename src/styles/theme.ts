import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#4169E1",
      light: "#6495ED",
      dark: "#1E3A8A",
    },
    secondary: {
      main: "#5F9EA0",
      light: "#87CEEB",
      dark: "#4682B4",
    },
    background: {
      default: "#F0F8FF",
      paper: "#E6F0FF",
    },
    text: {
      primary: "#1A237E",
      secondary: "#3F51B5",
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
          backgroundColor: "rgba(65, 105, 225, 0.85)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#F8FBFF",
        },
      },
    },
  },
});
