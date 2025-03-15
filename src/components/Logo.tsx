import { Box, Typography } from "@mui/material";

const Logo = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
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
            color: "#4CAF50",
          }}
        >
          TREND BLOG
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo;
