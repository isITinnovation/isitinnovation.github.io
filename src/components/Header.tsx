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
import CreateIcon from "@mui/icons-material/Create";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "./Logo";

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Header = ({ isOpen, setIsOpen }: HeaderProps) => {
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
          {/* 사이드바 토글 버튼 */}
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            sx={{
              mr: 2,
              color: "secondary.main",
              width: "48px",
              height: "48px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "&:hover": {
                backgroundColor: "grey.50",
              },
            }}
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

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
              startIcon={
                <CreateIcon
                  sx={{ display: { xs: "none", sm: "inline-flex" } }}
                />
              }
              variant="contained"
              onClick={() => navigate("/write")}
              sx={{
                minWidth: { xs: "48px", sm: "auto" },
                width: { xs: "48px", sm: "auto" },
                height: "48px",
                p: { xs: 0, sm: 2 },
                fontWeight: 600,
                borderRadius: "8px",
                boxShadow: "none",
                background: "linear-gradient(45deg, #FF5B59 30%, #FF8E53 90%)",
                "&:hover": {
                  boxShadow: "0 2px 8px rgba(255,91,89,0.3)",
                },
              }}
            >
              <CreateIcon sx={{ display: { xs: "inline-flex", sm: "none" } }} />
              <Box
                component="span"
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  width: "48px",
                  justifyContent: "center",
                }}
              >
                글쓰기
              </Box>
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
