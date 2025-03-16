import { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  approvedYN: string;
  created_at: string;
}

const UserApprovalPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 사용자 목록 가져오기
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const timestamp = new Date().getTime();
      const response = await axios.get("/api/user-management", {
        params: { timestamp },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      } else {
        setError(
          response.data.message || "사용자 목록을 가져오는데 실패했습니다."
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 사용자 승인 상태 변경
  const handleApprovalChange = async (userId: string, approve: boolean) => {
    try {
      const timestamp = new Date().getTime();
      const response = await axios.post(
        "/api/user-management",
        {
          userId,
          action: "approve",
          approved: approve,
          timestamp,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        // 사용자 목록 업데이트
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? { ...user, approvedYN: approve ? "Y" : "N" }
              : user
          )
        );

        // 필터링된 목록도 업데이트
        setFilteredUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? { ...user, approvedYN: approve ? "Y" : "N" }
              : user
          )
        );

        setSuccessMessage(
          `사용자 ${approve ? "승인" : "승인 취소"}이 완료되었습니다.`
        );

        // 3초 후 성공 메시지 제거
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(response.data.message || "승인 상태 변경에 실패했습니다.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "서버 오류가 발생했습니다.");
    }
  };

  // 검색어 변경 시 필터링
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(value.toLowerCase()) ||
          user.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  // 컴포넌트 마운트 시 사용자 목록 가져오기
  useEffect(() => {
    fetchUsers();
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="이름 또는 이메일로 검색"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#555555" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 400,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": {
                borderColor: "#DDDDDD",
              },
              "&:hover fieldset": {
                borderColor: "#999999",
              },
            },
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{ boxShadow: "none", border: "1px solid #EEEEEE" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#F5F5F5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>이름</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>이메일</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>가입일</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>승인 상태</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.approvedYN === "Y" ? "승인됨" : "미승인"}
                      color={user.approvedYN === "Y" ? "success" : "default"}
                      size="small"
                      sx={{
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {user.approvedYN === "Y" ? (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<CancelIcon />}
                        onClick={() => handleApprovalChange(user.id, false)}
                        sx={{ borderRadius: "8px" }}
                      >
                        승인 취소
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleApprovalChange(user.id, true)}
                        sx={{ borderRadius: "8px" }}
                      >
                        승인
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  {searchTerm
                    ? "검색 결과가 없습니다."
                    : "등록된 사용자가 없습니다."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserApprovalPanel;
