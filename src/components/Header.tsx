import { useState, useEffect } from "react";
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
  useMediaQuery,
  Theme,
  Dialog,
  DialogContent,
  Slide,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CreateIcon from "@mui/icons-material/Create";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Logo from "./Logo";
import React from "react";
import {
  logoutUser,
  getCurrentUser,
  isAuthenticated,
} from "../utils/authService";
// @ts-ignore
import headerBgImage from "../assets/images/header-bg.jpg";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
}

const Header = ({
  isOpen,
  setIsOpen,
  searchValue,
  setSearchValue,
}: HeaderProps) => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  // 인증 상태 확인
  useEffect(() => {
    setIsAuth(isAuthenticated());
    setUser(getCurrentUser());
  }, []);

  const handleSearchOpen = () => {
    setSearchDialogOpen(true);
  };

  const handleSearchClose = () => {
    setSearchDialogOpen(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // authService의 logoutUser 함수 사용
    logoutUser();
    setUser(null);
    setIsAuth(false);
    handleMenuClose();
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleWriteClick = () => {
    if (isAuth) {
      navigate("/write");
    } else {
      navigate("/login");
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "transparent",
        borderBottom: "1px solid",
        borderColor: "rgba(93, 93, 255, 0.3)",
        boxShadow: "0 0 20px rgba(93, 93, 255, 0.2)",
        backgroundImage: `url(${headerBgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        height: "80px",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(10, 15, 41, 0.3)",
          backdropFilter: "blur(2px)",
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" disableGutters={isMobile}>
        <Toolbar
          sx={{
            py: 1.5,
            px: isMobile ? 1 : 2,
            flexWrap: "nowrap",
            minHeight: "64px",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <IconButton
              onClick={() => setIsOpen(!isOpen)}
              sx={{
                color: "#5D5DFF",
                width: { xs: "36px", sm: "48px" },
                height: { xs: "36px", sm: "48px" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": {
                  backgroundColor: "rgba(93, 93, 255, 0.1)",
                },
              }}
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>

            <Box
              onClick={() => navigate("/")}
              sx={{
                cursor: "pointer",
                ml: 0.5,
                "&:hover": {
                  transform: "translateY(-1px)",
                  transition: "transform 0.2s",
                },
              }}
            >
              <Logo />
            </Box>
          </Box>

          {isMobile ? (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton sx={{ color: "#5D5DFF" }} onClick={handleSearchOpen}>
                <SearchIcon />
              </IconButton>
            </Box>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
                maxWidth: { sm: 200, md: 300, lg: 500 },
                mx: 2,
                border: "2px solid",
                borderColor: "rgba(93, 93, 255, 0.3)",
                borderRadius: "8px",
                transition: "all 0.2s",
                backgroundColor: "rgba(10, 15, 41, 0.7)",
                backdropFilter: "blur(5px)",
                boxShadow: "0 0 10px rgba(93, 93, 255, 0.2)",
                "&:hover": {
                  borderColor: "#5D5DFF",
                  boxShadow: "0 0 15px rgba(93, 93, 255, 0.3)",
                },
              }}
            >
              <InputBase
                sx={{
                  ml: 2,
                  flex: 1,
                  color: "#ffffff",
                  "& ::placeholder": {
                    color: "rgba(255, 255, 255, 0.7)",
                    opacity: 1,
                  },
                }}
                placeholder="검색어를 입력해주세요"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <IconButton
                sx={{ p: "10px", color: "#5D5DFF" }}
                onClick={handleSearchOpen}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          )}

          <Box sx={{ display: "flex", flexShrink: 0, gap: 1 }}>
            {isAuth ? (
              <>
                <Button
                  startIcon={
                    <CreateIcon
                      sx={{ display: { xs: "none", sm: "inline-flex" } }}
                    />
                  }
                  variant="contained"
                  onClick={handleWriteClick}
                  sx={{
                    minWidth: { xs: "36px", sm: "auto" },
                    width: { xs: "36px", sm: "auto" },
                    height: { xs: "36px", sm: "40px" },
                    p: { xs: 0, sm: 2 },
                    fontWeight: 600,
                    borderRadius: "8px",
                    boxShadow: "none",
                    background:
                      "linear-gradient(45deg, #5D5DFF 30%, #33BBCF 90%)",
                    "&:hover": {
                      boxShadow: "0 0 15px rgba(93, 93, 255, 0.5)",
                    },
                  }}
                >
                  <CreateIcon
                    sx={{ display: { xs: "inline-flex", sm: "none" } }}
                  />
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

                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    ml: 1,
                    border: "2px solid",
                    borderColor: "rgba(93, 93, 255, 0.5)",
                    p: 0.5,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "primary.main",
                      fontSize: "1rem",
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 180,
                      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                      border: "1px solid",
                      borderColor: "rgba(93, 93, 255, 0.2)",
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      안녕하세요,
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {user?.name || "사용자"}님
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate("/profile");
                    }}
                  >
                    <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
                    프로필
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    로그아웃
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={handleLogin}
                  startIcon={
                    <LoginIcon
                      sx={{ display: { xs: "none", sm: "inline-flex" } }}
                    />
                  }
                  sx={{
                    minWidth: { xs: "36px", sm: "auto" },
                    width: { xs: "36px", sm: "auto" },
                    height: { xs: "36px", sm: "40px" },
                    p: { xs: 0, sm: "0.5rem 1rem" },
                    fontWeight: 600,
                    borderRadius: "8px",
                    borderColor: "rgba(93, 93, 255, 0.5)",
                    color: "#ffffff",
                    "&:hover": {
                      borderColor: "#5D5DFF",
                      backgroundColor: "rgba(93, 93, 255, 0.1)",
                    },
                  }}
                >
                  <LoginIcon
                    sx={{ display: { xs: "inline-flex", sm: "none" } }}
                  />
                  <Box
                    component="span"
                    sx={{
                      display: { xs: "none", sm: "inline-flex" },
                    }}
                  >
                    로그인
                  </Box>
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      <Dialog
        fullWidth
        open={searchDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleSearchClose}
        PaperProps={{
          sx: {
            position: "absolute",
            top: 0,
            m: 0,
            width: "100%",
            borderRadius: "0 0 16px 16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogContent sx={{ p: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              border: "2px solid",
              borderColor: "primary.main",
              borderRadius: "8px",
            }}
          >
            <InputBase
              autoFocus
              sx={{ ml: 2, flex: 1 }}
              placeholder="검색어를 입력해주세요"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchClose();
                }
              }}
            />
            <IconButton
              sx={{ p: "10px", color: "primary.main" }}
              onClick={handleSearchClose}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};

export default Header;
