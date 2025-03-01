import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  InputBase,
  IconButton,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CreateIcon from "@mui/icons-material/Create";
import Logo from "./Logo";

const Header = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "grey.100",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 1.5 }}>
          {/* 로고 영역 */}
          <Box
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              mr: 4,
              "&:hover": {
                transform: "translateY(-1px)",
                transition: "transform 0.2s",
              },
            }}
          >
            <Logo />
          </Box>

          {/* 검색 영역 */}
          <Paper
            elevation={0}
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              maxWidth: 500,
              border: "2px solid",
              borderColor: "grey.100",
              borderRadius: "8px",
              mr: 4,
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "primary.main",
              },
            }}
          >
            <InputBase
              sx={{ ml: 2, flex: 1 }}
              placeholder="검색어를 입력해주세요"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <IconButton sx={{ p: "10px", color: "primary.main" }}>
              <SearchIcon />
            </IconButton>
          </Paper>

          {/* 메뉴 영역 */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              startIcon={<TrendingUpIcon />}
              onClick={() => navigate("/trending")}
              sx={{
                color: "secondary.main",
                fontWeight: 600,
                borderRadius: "8px",
                px: 2,
                "&:hover": {
                  backgroundColor: "grey.50",
                },
              }}
            >
              트렌드
            </Button>
            <Button
              startIcon={<AutoAwesomeIcon />}
              onClick={() => navigate("/prompt-guide")}
              sx={{
                color: "secondary.main",
                fontWeight: 600,
                borderRadius: "8px",
                px: 2,
                "&:hover": {
                  backgroundColor: "grey.50",
                },
              }}
            >
              프롬프트
            </Button>
            <Button
              startIcon={<CreateIcon />}
              variant="contained"
              onClick={() => navigate("/write")}
              sx={{
                fontWeight: 600,
                borderRadius: "8px",
                px: 3,
                boxShadow: "none",
                background: "linear-gradient(45deg, #FF5B59 30%, #FF8E53 90%)",
                "&:hover": {
                  boxShadow: "0 2px 8px rgba(255,91,89,0.3)",
                },
              }}
            >
              글쓰기
            </Button>
          </Box>
        </Toolbar>

        {/* 카테고리 메뉴 */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            py: 1,
          }}
        >
          <Button
            startIcon={<MenuIcon />}
            sx={{
              color: "secondary.main",
              fontWeight: 700,
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "grey.50",
              },
            }}
          >
            카테고리
          </Button>
          <Button
            sx={{
              color: "secondary.main",
              fontWeight: 500,
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "grey.50",
              },
            }}
          >
            최신글
          </Button>
          <Button
            sx={{
              color: "secondary.main",
              fontWeight: 500,
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "grey.50",
              },
            }}
          >
            인기글
          </Button>
        </Box>
      </Container>
    </AppBar>
  );
};

export default Header;
