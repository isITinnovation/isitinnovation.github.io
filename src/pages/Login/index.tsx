import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginUser } from "../../utils/authService";
import styles from "./Login.module.css";

interface LocationState {
  message?: string;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 회원가입 후 리다이렉트 시 메시지 표시
    const state = location.state as LocationState;
    if (state?.message) {
      setSuccess(state.message);
      // 상태 초기화
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // 간단한 유효성 검사
      if (!email || !password) {
        setError("이메일과 비밀번호를 모두 입력해주세요.");
        return;
      }

      setIsLoading(true);

      // authService의 loginUser 함수 사용
      const response = await loginUser({
        email,
        password,
      });

      if (response.success) {
        // 홈 페이지로 이동
        navigate("/");
      } else {
        setError(response.message || "로그인에 실패했습니다.");
      }
    } catch (err: any) {
      console.error("로그인 오류:", err);
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Box className={styles.formContainer}>
          <Typography component="h1" variant="h5" className={styles.title}>
            로그인
          </Typography>

          {error && (
            <Alert severity="error" className={styles.alert}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" className={styles.alert}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} className={styles.form}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="이메일 주소"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.textField}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.textField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? <CircularProgress size={24} /> : "로그인"}
            </Button>
            <Box className={styles.linkContainer}>
              <Link href="#" variant="body2" className={styles.link}>
                비밀번호를 잊으셨나요?
              </Link>
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
                className={styles.link}
              >
                계정이 없으신가요? 회원가입
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
