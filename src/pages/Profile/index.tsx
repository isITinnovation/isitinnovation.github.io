import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Divider,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {
  getCurrentUser,
  logoutUser,
  changePassword,
  updateProfile,
} from "../../utils/authService";
import styles from "./Profile.module.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    setNewName(currentUser.name);
  }, [navigate]);

  // 로그아웃 처리
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await logoutUser();
      if (response.success) {
        navigate("/login");
      } else {
        setMessage({
          type: "error",
          text: response.message || "로그아웃 중 오류가 발생했습니다.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "로그아웃 중 오류가 발생했습니다.",
      });
      // 오류가 발생해도 로그인 페이지로 이동
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 변경 폼 상태
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 비밀번호 변경 폼 입력 처리
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 비밀번호 변경 제출 처리
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // 비밀번호 유효성 검사
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({
        type: "error",
        text: "새 비밀번호와 비밀번호 확인이 일치하지 않습니다.",
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "비밀번호는 최소 8자 이상이어야 합니다.",
      });
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) {
      setMessage({
        type: "error",
        text: "비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 비밀번호 변경 API 호출
      const response = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (response.success) {
        setMessage({
          type: "success",
          text: "비밀번호가 성공적으로 변경되었습니다.",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage({
          type: "error",
          text: response.message || "비밀번호 변경 중 오류가 발생했습니다.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "비밀번호 변경 중 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 이름 수정 시작
  const handleEditNameClick = () => {
    setIsEditingName(true);
  };

  // 이름 변경 취소
  const handleCancelNameEdit = () => {
    setNewName(user.name);
    setIsEditingName(false);
  };

  // 이름 변경 저장
  const handleSaveNameEdit = async () => {
    if (!newName.trim()) {
      setMessage({
        type: "error",
        text: "이름은 비워둘 수 없습니다.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await updateProfile({ name: newName.trim() });
      if (response.success) {
        setUser(response.user);
        setMessage({
          type: "success",
          text: "이름이 성공적으로 변경되었습니다.",
        });
        setIsEditingName(false);
      } else {
        setMessage({
          type: "error",
          text: response.message || "이름 변경 중 오류가 발생했습니다.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "이름 변경 중 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Box className={styles.header}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "primary.main",
              fontSize: "2.5rem",
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box className={styles.userInfo}>
            {isEditingName ? (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TextField
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleSaveNameEdit}
                  disabled={isLoading}
                  sx={{ mr: 1 }}
                >
                  저장
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCancelNameEdit}
                >
                  취소
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h4" className={styles.userName}>
                  {user.name}
                </Typography>
                <IconButton
                  color="primary"
                  onClick={handleEditNameClick}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <EditIcon />
                </IconButton>
              </Box>
            )}
            <Typography variant="body1" className={styles.userEmail}>
              {user.email}
            </Typography>
          </Box>
        </Box>

        {message.text && (
          <Alert
            severity={message.type as "error" | "success" | "info" | "warning"}
            sx={{ mt: 2 }}
            onClose={() => setMessage({ type: "", text: "" })}
          >
            {message.text}
          </Alert>
        )}

        <Divider sx={{ my: 3 }} />

        <Box className={styles.section}>
          <Typography variant="h5" className={styles.sectionTitle}>
            비밀번호 변경
          </Typography>

          <Box
            component="form"
            onSubmit={handlePasswordSubmit}
            className={styles.form}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="currentPassword"
              label="현재 비밀번호"
              type="password"
              id="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="새 비밀번호"
              type="password"
              id="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              helperText="비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자를 포함해야 합니다."
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="새 비밀번호 확인"
              type="password"
              id="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : "비밀번호 변경"}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/")}
            >
              홈으로
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              로그아웃
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
