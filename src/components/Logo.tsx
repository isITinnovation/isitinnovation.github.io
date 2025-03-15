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
            color: "#000000",
            letterSpacing: "-0.5px",
            textShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
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
            color: "#555555",
          }}
        >
          TREND BLOG
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo;
