import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CategoryIcon from "@mui/icons-material/Category";
import { useState, useEffect } from "react";
import { Post } from "../../types/post";
import { postService } from "../../services/postService";
import { useNavigate } from "react-router-dom";

interface HomeProps {
  searchValue: string;
}

const Home = ({ searchValue }: HomeProps) => {
  const [trendingTopics, setTrendingTopics] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const posts = await postService.getTrendingPosts();
        setTrendingTopics(posts);
      } catch (error) {
        console.error("Failed to fetch trending posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  // 검색어에 따른 필터링된 포스트 목록
  const filteredPosts = trendingTopics.filter(
    (post) =>
      post.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchValue.toLowerCase())
  );

  const categories = [
    { name: "인공지능/머신러닝", count: 128 },
    { name: "웹 개발", count: 95 },
    { name: "모바일 개발", count: 76 },
    { name: "클라우드/DevOps", count: 64 },
    { name: "보안", count: 52 },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 8 }}>
      {/* 메인 배너 */}

      <Grid container spacing={4}>
        {/* 인기 게시글 섹션 */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
            }}
          >
            <TrendingUpIcon color="primary" />
            <Typography variant="h5" fontWeight={700}>
              {searchValue ? "검색 결과" : "실시간 인기 게시글"}
            </Typography>
            {searchValue && (
              <Typography variant="body2" color="grey.600">
                ({filteredPosts.length}개의 게시글)
              </Typography>
            )}
          </Box>

          {filteredPosts.length === 0 && searchValue && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="grey.600">
                검색 결과가 없습니다.
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredPosts.map((topic) => (
              <Card
                key={topic.id}
                onClick={() => navigate(`/post/${topic.id}`)}
                sx={{
                  borderRadius: 2,
                  transition: "transform 0.2s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={topic.category}
                      size="small"
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <VisibilityIcon
                        sx={{ fontSize: 16, color: "grey.500" }}
                      />
                      <Typography variant="body2" color="grey.500">
                        {topic.views.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {topic.title}
                  </Typography>
                  <Typography variant="body2" color="grey.600">
                    {topic.excerpt}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* 카테고리 섹션 */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
            }}
          >
            <CategoryIcon color="primary" />
            <Typography variant="h5" fontWeight={700}>
              카테고리
            </Typography>
          </Box>

          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {categories.map((category, index) => (
                  <Button
                    key={index}
                    sx={{
                      justifyContent: "space-between",
                      color: "secondary.main",
                      p: 1.5,
                      borderRadius: 2,
                      "&:hover": {
                        bgcolor: "grey.50",
                      },
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {category.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "grey.500", fontWeight: 600 }}
                      >
                        {category.count}
                      </Typography>
                      <ArrowForwardIcon
                        sx={{ fontSize: 16, color: "grey.400" }}
                      />
                    </Box>
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
