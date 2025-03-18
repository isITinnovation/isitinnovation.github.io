import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CategoryIcon from "@mui/icons-material/Category";
import { useState, useEffect } from "react";
import { Post } from "../../types/post";
import { postService } from "../../services/postService";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSkeleton from "../../components/LoadingSkeleton";

interface HomeProps {
  searchValue: string;
}

// 블로그 포스트 타입 정의
interface BlogPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
}

const Home = ({ searchValue }: HomeProps) => {
  const buttonColors = [
    "#7D7D7D", // 문빔 그레이
    "#9370DB", // 디지털 라벤더
    "#3EB489", // 네오 민트
    "#A47551", // 모카무스
  ];

  // 카테고리별 색상을 저장하는 state
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>(
    {}
  );

  const getColorForCategory = (category: string) => {
    if (categoryColors[category]) {
      return categoryColors[category];
    }
    const newColor =
      buttonColors[Math.floor(Math.random() * buttonColors.length)];
    setCategoryColors((prev) => ({
      ...prev,
      [category]: newColor,
    }));
    return newColor;
  };

  const [trendingTopics, setTrendingTopics] = useState<Post[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 서버리스 API에서 블로그 포스트 가져오기
        try {
          // API 요청 시도
          const response = await axios.get<{
            success: boolean;
            posts: BlogPost[];
          }>("/api/getBlogPosts", {
            headers: {
              "Cache-Control": "max-age=21600", // 60초 동안 캐시 허용
            },
          });

          if (response.data.success) {
            setBlogPosts(response.data.posts);
          } else {
            // API 응답이 성공이 아닌 경우 에러 처리
            console.log("API 응답이 성공이 아닙니다:", response.data);
            // 개발 환경에서는 임시 데이터 사용
            if (process.env.NODE_ENV === "development") {
              console.log("개발 환경에서 임시 데이터를 사용합니다.");
              setBlogPosts([
                {
                  id: "temp-1",
                  title: "임시 블로그 포스트",
                  content: "이것은 개발 환경에서 사용되는 임시 콘텐츠입니다.",
                  tags: ["개발", "임시"],
                  category: "개발",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ]);
            }
          }
        } catch (apiError) {
          console.log(
            "서버리스 API에서 포스트를 가져오지 못했습니다:",
            apiError
          );

          // 개발 환경에서는 임시 데이터 사용
          if (process.env.NODE_ENV === "development") {
            console.log("개발 환경에서 임시 데이터를 사용합니다.");
            setBlogPosts([
              {
                id: "temp-1",
                title: "임시 블로그 포스트",
                content: "이것은 개발 환경에서 사용되는 임시 콘텐츠입니다.",
                tags: ["개발", "임시"],
                category: "개발",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ]);
          }
        }

        // 기존 서비스에서 트렌딩 포스트 가져오기
        const posts = await postService.getTrendingPosts();
        setTrendingTopics(posts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setError("포스트를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 검색어에 따른 필터링된 포스트 목록
  const filteredPosts = trendingTopics.filter(
    (post) =>
      post.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchValue.toLowerCase())
  );

  // 검색어에 따른 필터링된 블로그 포스트 목록
  const filteredBlogPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      post.content.toLowerCase().includes(searchValue.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchValue.toLowerCase())
      )
  );

  // 필터링된 포스트에서 카테고리 추출 및 카운트 계산
  const categoryCount: Record<string, number> = {};

  // 기존 포스트의 카테고리 추가
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

  // 블로그 포스트의 카테고리 추가
  filteredBlogPosts.forEach((post) => {
    const category = post.category;
    if (categoryCount[category]) {
      categoryCount[category] += 1;
    } else {
      categoryCount[category] = 1;
    }
  });

  // 카테고리 배열로 변환
  const categories = Object.entries(categoryCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count); // 카운트 기준 내림차순 정렬

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  // 블로그 포스트의 내용 일부만 표시하는 함수
  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

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
            <TrendingUpIcon sx={{ color: "#000000" }} />
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                color: "#000000",
                textShadow: "none",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              {searchValue ? "검색 결과" : "실시간 인기 게시글"}
            </Typography>
            {searchValue && (
              <Typography variant="body2" color="grey.600">
                ({filteredPosts.length + filteredBlogPosts.length}개의 게시글)
              </Typography>
            )}
          </Box>

          {filteredPosts.length === 0 &&
            filteredBlogPosts.length === 0 &&
            searchValue && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  검색 결과가 없습니다.
                </Typography>
              </Box>
            )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* 서버리스 API에서 가져온 블로그 포스트 */}
            {filteredBlogPosts.map((post) => (
              <Card
                key={post.id}
                onClick={() =>
                  navigate(
                    `/post/${post.id}?title=${encodeURIComponent(post.title)}`
                  )
                }
                sx={{
                  borderRadius: 2,
                  transition: "transform 0.2s",
                  cursor: "pointer",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
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
                      <Chip
                        label={post.category}
                        size="small"
                        sx={{
                          borderRadius: "4px",
                          bgcolor: getColorForCategory(post.category),
                          color: "#FFFFFF",
                          fontWeight: 500,
                          "&:hover": {
                            filter: "brightness(0.9)",
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/category/${encodeURIComponent(post.category)}`
                          );
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#000000" }}
                  >
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getExcerpt(post.content)}
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 2 }}
                  >
                    {post.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: "4px",
                          borderColor: "rgba(0, 0, 0, 0.2)",
                          color: "rgba(0, 0, 0, 0.7)",
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}

            {/* 기존 서비스에서 가져온 포스트 */}
            {filteredPosts.map((topic) => (
              <Card
                key={topic.id}
                onClick={() =>
                  navigate(
                    `/post/${topic.id}?title=${encodeURIComponent(topic.title)}`
                  )
                }
                sx={{
                  borderRadius: 2,
                  transition: "transform 0.2s",
                  cursor: "pointer",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
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
                          sx={{
                            borderRadius: "4px",
                            bgcolor: getColorForCategory(cat.trim()),
                            color: "#FFFFFF",
                            fontWeight: 500,
                            "&:hover": {
                              filter: "brightness(0.9)",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/category/${encodeURIComponent(cat.trim())}`
                            );
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#000000" }}
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
            <CategoryIcon sx={{ color: "#000000" }} />
            <Typography variant="h5" fontWeight={700} sx={{ color: "#000000" }}>
              카테고리
            </Typography>
          </Box>

          <Card
            sx={{
              borderRadius: 2,
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
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
                        color: "#000000",
                        p: 1.5,
                        borderRadius: 2,
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.05)",
                        },
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, color: "#000000" }}
                      >
                        {category.name}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "rgba(0, 0, 0, 0.6)" }}
                        >
                          {category.count}
                        </Typography>
                        <ArrowForwardIcon
                          sx={{ fontSize: 16, color: "rgba(0, 0, 0, 0.4)" }}
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
