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
          background: "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxShadow: "0 8px 20px rgba(76, 175, 80, 0.2)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 40%)",
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            실시간 트렌딩
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: 0.9, textShadow: "0 1px 5px rgba(0, 0, 0, 0.2)" }}
          >
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
                bgcolor: "rgba(255, 255, 255, 0.9)",
                borderRadius: 2,
                "& fieldset": {
                  border: "none",
                },
                "&:hover": {
                  bgcolor: "white",
                  boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#4CAF50" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
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
              color: category === "전체" ? "white" : "#4CAF50",
              borderColor: category !== "전체" ? "#4CAF50" : "transparent",
              backgroundColor: category === "전체" ? "#4CAF50" : "transparent",
              "&:hover": {
                bgcolor:
                  category === "전체" ? "#43A047" : "rgba(76, 175, 80, 0.1)",
                boxShadow: "0 0 10px rgba(76, 175, 80, 0.2)",
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
          <LocalFireDepartmentIcon sx={{ color: "#FF5722" }} />
          <Typography variant="h5" fontWeight={700} sx={{ color: "#333333" }}>
            실시간 인기 포스트
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {trendingPosts.map((post) => (
            <Grid item xs={12} key={post.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  transition: "all 0.3s",
                  backgroundColor: "#ffffff",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    transform: "translateX(4px)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    borderColor: "rgba(0, 0, 0, 0.2)",
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
                            bgcolor: post.category === "인공지능" ? "#FDD835" :
                                   post.category === "웹개발" ? "#4CAF50" :
                                   post.category === "모바일" ? "#FF5722" :
                                   post.category === "클라우드" ? "#2196F3" :
                                   post.category === "보안" ? "#F44336" :
                                   post.category === "블록체인" ? "#9C27B0" :
                                   "#333333",
                            color: "white",
                            fontWeight: 600,
                          }}
                        />
                        {post.trending && (
                          <Chip
                            icon={
                              <TrendingUpIcon
                                sx={{ fontSize: 16, color: "#FF5722" }}
                              />
                            }
                            label="트렌딩"
                            size="small"
                            variant="outlined"
                            sx={{
                              color: "#FF5722",
                              borderColor: "#FF5722",
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 1, color: "#333333" }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 2, color: "rgba(0, 0, 0, 0.7)" }}
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
                              bgcolor: post.category === "인공지능" ? "#FDD835" :
                                      post.category === "웹개발" ? "#4CAF50" :
                                      post.category === "모바일" ? "#FF5722" :
                                      post.category === "클라우드" ? "#2196F3" :
                                      post.category === "보안" ? "#F44336" :
                                      post.category === "블록체인" ? "#9C27B0" :
                                      "#333333",
                              fontSize: "0.875rem",
                              color: "white",
                            }}
                          >
                            {post.authorAvatar}
                          </Avatar>
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(0, 0, 0, 0.9)" }}
                          >
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
                              sx={{
                                fontSize: 16,
                                color: "rgba(0, 0, 0, 0.6)",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                            >
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
                              sx={{
                                fontSize: 16,
                                color: "rgba(0, 0, 0, 0.6)",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                            >
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
                              sx={{
                                fontSize: 16,
                                color: "rgba(0, 0, 0, 0.6)",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                            >
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
