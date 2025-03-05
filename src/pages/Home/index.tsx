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
// import VisibilityIcon from "@mui/icons-material/Visibility";
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

  // 필터링된 포스트에서 카테고리 추출 및 카운트 계산
  const categoryCount: Record<string, number> = {};

  filteredPosts.forEach((post) => {
    const postCategories = post.category.split(",").map((cat) => cat.trim());
    postCategories.forEach((category) => {
      if (categoryCount[category]) {
        categoryCount[category] += 1;
      } else {
        categoryCount[category] = 1;
      }
    });
  });

  // 카테고리 배열로 변환
  const categories = Object.entries(categoryCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count); // 카운트 기준 내림차순 정렬

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
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                color: "#1A237E",
                textShadow: "1px 1px 2px rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.8)",
                padding: "4px 8px",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
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
              <Typography variant="body1" color="text.secondary">
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
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {topic.category.split(",").map((cat, index) => (
                        <Chip
                          key={index}
                          label={cat.trim()}
                          size="small"
                          color="primary"
                          sx={{ borderRadius: "4px" }}
                          onClick={(e) => {
                            e.stopPropagation(); // 부모 요소의 클릭 이벤트 전파 방지
                            navigate(
                              `/category/${encodeURIComponent(cat.trim())}`
                            );
                          }}
                        />
                      ))}
                    </Box>
                    {/* <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <VisibilityIcon
                        sx={{ fontSize: 16, color: "primary.light" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {topic.views.toLocaleString()}
                      </Typography>
                    </Box> */}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1 }}
                    color="primary.dark"
                  >
                    {topic.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
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
            <Typography variant="h5" fontWeight={700} color="primary.dark">
              카테고리
            </Typography>
          </Box>

          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {categories.length === 0 ? (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 2 }}
                  >
                    카테고리가 없습니다
                  </Typography>
                ) : (
                  categories.map((category, index) => (
                    <Button
                      key={index}
                      onClick={() =>
                        navigate(
                          `/category/${encodeURIComponent(category.name)}`
                        )
                      }
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
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500 }}
                        color="text.primary"
                      >
                        {category.name}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600 }}
                          color="text.secondary"
                        >
                          {category.count}
                        </Typography>
                        <ArrowForwardIcon
                          sx={{ fontSize: 16, color: "grey.400" }}
                        />
                      </Box>
                    </Button>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
