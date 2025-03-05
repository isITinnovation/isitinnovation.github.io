import { Box, Typography } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";

const Logo = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "primary.main",
          borderRadius: "12px",
          width: 40,
          height: 40,
          color: "white",
          transform: "rotate(-10deg)",
          boxShadow: "2px 2px 0px rgba(0,0,0,0.1)",
        }}
      >
        <CodeIcon sx={{ fontSize: 24 }} />
      </Box>
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: "22px",
            background: "linear-gradient(45deg, #FFD700 30%, #FFA500 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
          }}
        >
          ISIT
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "2px",
            marginTop: "-4px",
          }}
        >
          TREND BLOG
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo;
