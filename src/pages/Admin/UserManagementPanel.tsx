import { useState, useEffect } from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  approvedYN: string;
  created_at: string;
  updated_at: string;
}

const UserManagementPanel = () => {
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

  // 사용자 목록 가져오기
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const timestamp = new Date().getTime();
      const response = await axios.get("/api/users", {
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

  // 사용자 정보 수정
  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      const timestamp = new Date().getTime();
      const response = await axios.put(
        "/api/update-user",
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

    try {
      const timestamp = new Date().getTime();
      const response = await axios.delete("/api/delete-user", {
        data: {
          userId: selectedUser.id,
          timestamp,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenEditDialog(user)}
                        sx={{ borderRadius: "8px" }}
                      >
                        수정
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleOpenDeleteDialog(user)}
                        sx={{ borderRadius: "8px" }}
                      >
                        삭제
                      </Button>
                    </Box>
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
