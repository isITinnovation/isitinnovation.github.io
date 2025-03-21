import React, { useState, useEffect } from "react";
import {
  Typography,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { isTokenExpired, logout } from "../../utils/authService";

interface User {
  id: string;
  name: string;
  email: string;
  approvedYN: string;
  created_at: string;
  updated_at?: string;
}

export interface UserManagementPanelProps {
  mockUsers?: User[];
  useMockData?: boolean;
}

const UserManagementPanel: React.FC<UserManagementPanelProps> = ({
  mockUsers,
  useMockData = false,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    approvedYN: "",
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 사용자 목록 가져오기
  const fetchUsers = async () => {
    if (useMockData && mockUsers) {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
      return;
    }

    // 토큰 만료 체크
    if (isTokenExpired()) {
      setError("로그인 시간이 만료되었습니다. 다시 로그인해주세요.");
      setTimeout(() => {
        logout();
      }, 3000);
      return;
    }

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
      if (
        err.response?.status === 401 ||
        err.response?.data?.message?.includes("유효하지 않은 토큰")
      ) {
        // 알림 메시지 표시
        setError("인증이 만료되어 로그아웃됩니다.");

        // 3초 후 로그아웃 처리
        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.href = "/login"; // 또는 로그인 페이지로 리다이렉트
        }, 3000);
      } else {
        setError(err.response?.data?.message || "서버 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 사용자 정보 수정
  const handleEditUser = async () => {
    if (!selectedUser) return;

    if (useMockData) {
      // 목업 데이터 사용 시 로컬에서 상태 변경
      const updatedUser = {
        ...selectedUser,
        name: editedUser.name,
        email: editedUser.email,
        approvedYN: editedUser.approvedYN,
        updated_at: new Date().toISOString(),
      };

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? updatedUser : user
        )
      );

      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? updatedUser : user
        )
      );

      setSuccessMessage("사용자 정보가 성공적으로 수정되었습니다.");
      setEditDialogOpen(false);

      // 3초 후 성공 메시지 제거
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      return;
    }

    try {
      const timestamp = new Date().getTime();
      const response = await axios.put(
        "/api/user-management",
        {
          userId: selectedUser.id,
          name: editedUser.name,
          email: editedUser.email,
          approvedYN: editedUser.approvedYN,
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
        const updatedUser = response.data.user;
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? updatedUser : user
          )
        );

        // 필터링된 목록도 업데이트
        setFilteredUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? updatedUser : user
          )
        );

        setSuccessMessage("사용자 정보가 성공적으로 수정되었습니다.");
        setEditDialogOpen(false);

        // 3초 후 성공 메시지 제거
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(response.data.message || "사용자 정보 수정에 실패했습니다.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "서버 오류가 발생했습니다.");
    }
  };

  // 사용자 삭제
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    if (useMockData) {
      // 목업 데이터 사용 시 로컬에서 상태 변경
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUser.id)
      );

      setFilteredUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUser.id)
      );

      setSuccessMessage("사용자가 성공적으로 삭제되었습니다.");
      setDeleteDialogOpen(false);

      // 3초 후 성공 메시지 제거
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      return;
    }

    try {
      const timestamp = new Date().getTime();
      const response = await axios.post(
        "/api/user-management",
        {
          userId: selectedUser.id,
          action: "delete",
          timestamp,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        // 사용자 목록에서 삭제
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== selectedUser.id)
        );

        // 필터링된 목록에서도 삭제
        setFilteredUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== selectedUser.id)
        );

        setSuccessMessage("사용자가 성공적으로 삭제되었습니다.");
        setDeleteDialogOpen(false);

        // 3초 후 성공 메시지 제거
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(response.data.message || "사용자 삭제에 실패했습니다.");
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

  // 수정 다이얼로그 열기
  const handleOpenEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditedUser({
      name: user.name,
      email: user.email,
      approvedYN: user.approvedYN,
    });
    setEditDialogOpen(true);
  };

  // 삭제 다이얼로그 열기
  const handleOpenDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // 컴포넌트 마운트 시 사용자 목록 가져오기
  useEffect(() => {
    fetchUsers();
  }, [useMockData, mockUsers]);

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
            maxWidth: isMobile ? "100%" : 400,
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
        sx={{
          boxShadow: "none",
          border: "1px solid #EEEEEE",
          overflowX: "auto",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#F5F5F5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>이름</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>이메일</TableCell>
              {!isMobile && (
                <TableCell sx={{ fontWeight: 700 }}>가입일</TableCell>
              )}
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
                  {!isMobile && (
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                  )}
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
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: isMobile ? "wrap" : "nowrap",
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={!isMobile && <EditIcon />}
                        onClick={() => handleOpenEditDialog(user)}
                        sx={{ borderRadius: "8px" }}
                      >
                        {isMobile ? "수정" : "수정"}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={!isMobile && <DeleteIcon />}
                        onClick={() => handleOpenDeleteDialog(user)}
                        sx={{ borderRadius: "8px" }}
                      >
                        {isMobile ? "삭제" : "삭제"}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={isMobile ? 4 : 5}
                  align="center"
                  sx={{ py: 3 }}
                >
                  {searchTerm
                    ? "검색 결과가 없습니다."
                    : "등록된 사용자가 없습니다."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 사용자 정보 수정 다이얼로그 */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>사용자 정보 수정</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="이름"
                value={editedUser.name}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, name: e.target.value })
                }
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="이메일"
                value={editedUser.email}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, email: e.target.value })
                }
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>승인 상태</InputLabel>
                <Select
                  value={editedUser.approvedYN}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser,
                      approvedYN: e.target.value as string,
                    })
                  }
                  label="승인 상태"
                >
                  <MenuItem value="Y">승인</MenuItem>
                  <MenuItem value="N">미승인</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">
            취소
          </Button>
          <Button onClick={handleEditUser} color="primary" variant="contained">
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* 사용자 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>사용자 삭제</DialogTitle>
        <DialogContent>
          <Typography>
            정말로 {selectedUser?.name} 사용자를 삭제하시겠습니까? 이 작업은
            되돌릴 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            취소
          </Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagementPanel;
