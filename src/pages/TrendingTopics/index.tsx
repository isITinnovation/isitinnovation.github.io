import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Avatar,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommentIcon from "@mui/icons-material/Comment";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

const TrendingTopics = () => {
  const trendingCategories = [
    "전체",
    "인공지능",
    "웹개발",
    "모바일",
    "클라우드",
    "보안",
    "블록체인",
  ];

  const trendingPosts = [
    {
      id: 1,
      title: "ChatGPT 4.0 업데이트: 새로운 기능과 개선사항 총정리",
      excerpt:
        "OpenAI가 발표한 ChatGPT 4.0의 주요 업데이트 내용과 실제 사용 사례를 분석해봅니다.",
      author: "테크리더",
      authorAvatar: "T",
      category: "인공지능",
      views: 2840,
      comments: 45,
      timeAgo: "3시간 전",
      trending: true,
    },
    {
      id: 2,
      title: "2024년 웹 개발 트렌드: 풀스택 개발자가 주목해야 할 기술",
      excerpt:
        "올해 주목받는 웹 개발 기술과 프레임워크, 그리고 개발자가 준비해야 할 역량을 알아봅니다.",
      author: "웹마스터",
      authorAvatar: "W",
      category: "웹개발",
      views: 1920,
      comments: 32,
      timeAgo: "5시간 전",
      trending: true,
    },
    {
      id: 3,
      title: "클라우드 네이티브 애플리케이션 개발 가이드",
      excerpt:
        "마이크로서비스 아키텍처와 컨테이너화된 애플리케이션 개발에 대한 실전 가이드.",
      author: "클라우드엔지니어",
      authorAvatar: "C",
      category: "클라우드",
      views: 1540,
      comments: 28,
      timeAgo: "8시간 전",
      trending: false,
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* 메인 배너 */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(45deg, #FF5B59 30%, #FF8E53 90%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          실시간 트렌딩
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          IT 업계의 최신 트렌드와 인사이트를 확인하세요
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="관심있는 기술이나 트렌드를 검색해보세요"
          sx={{
            mt: 2,
            maxWidth: 500,
            "& .MuiOutlinedInput-root": {
              bgcolor: "white",
              borderRadius: 2,
              "& fieldset": {
                border: "none",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* 카테고리 필터 */}
      <Box sx={{ mb: 4, display: "flex", gap: 1, flexWrap: "wrap" }}>
        {trendingCategories.map((category) => (
          <Button
            key={category}
            variant={category === "전체" ? "contained" : "outlined"}
            sx={{
              borderRadius: "20px",
              px: 2,
              py: 0.5,
              color: category === "전체" ? "white" : "primary.main",
              "&:hover": {
                bgcolor:
                  category === "전체" ? "primary.dark" : "background.paper",
              },
            }}
          >
            {category}
          </Button>
        ))}
      </Box>

      {/* 트렌딩 포스트 목록 */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 3,
          }}
        >
          <LocalFireDepartmentIcon color="primary" />
          <Typography variant="h5" fontWeight={700}>
            실시간 인기 포스트
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {trendingPosts.map((post) => (
            <Grid item xs={12} key={post.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateX(4px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Chip
                          label={post.category}
                          size="small"
                          sx={{
                            bgcolor: "primary.main",
                            color: "white",
                            fontWeight: 600,
                          }}
                        />
                        {post.trending && (
                          <Chip
                            icon={
                              <TrendingUpIcon
                                sx={{ fontSize: 16, color: "error.main" }}
                              />
                            }
                            label="트렌딩"
                            size="small"
                            variant="outlined"
                            sx={{
                              color: "error.main",
                              borderColor: "error.main",
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="grey.600"
                        sx={{ mb: 2 }}
                      >
                        {post.excerpt}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              bgcolor: "primary.main",
                              fontSize: "0.875rem",
                            }}
                          >
                            {post.authorAvatar}
                          </Avatar>
                          <Typography variant="body2" color="grey.700">
                            {post.author}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <AccessTimeIcon
                              sx={{ fontSize: 16, color: "grey.500" }}
                            />
                            <Typography variant="body2" color="grey.500">
                              {post.timeAgo}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <VisibilityIcon
                              sx={{ fontSize: 16, color: "grey.500" }}
                            />
                            <Typography variant="body2" color="grey.500">
                              {post.views.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <CommentIcon
                              sx={{ fontSize: 16, color: "grey.500" }}
                            />
                            <Typography variant="body2" color="grey.500">
                              {post.comments}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default TrendingTopics;
