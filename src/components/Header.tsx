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
  useMediaQuery,
  Theme,
  Dialog,
  DialogContent,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CreateIcon from "@mui/icons-material/Create";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "./Logo";
import React from "react";

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
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  const handleSearchOpen = () => {
    setSearchDialogOpen(true);
  };

  const handleSearchClose = () => {
    setSearchDialogOpen(false);
  };

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
                color: "secondary.main",
                width: { xs: "36px", sm: "48px" },
                height: { xs: "36px", sm: "48px" },
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
              <IconButton
                sx={{ color: "primary.main" }}
                onClick={handleSearchOpen}
              >
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
                borderColor: "grey.100",
                borderRadius: "8px",
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
          )}

          <Box sx={{ display: "flex", flexShrink: 0 }}>
            <Button
              startIcon={
                <CreateIcon
                  sx={{ display: { xs: "none", sm: "inline-flex" } }}
                />
              }
              variant="contained"
              onClick={() => navigate("/write")}
              sx={{
                minWidth: { xs: "36px", sm: "auto" },
                width: { xs: "36px", sm: "auto" },
                height: { xs: "36px", sm: "40px" },
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
