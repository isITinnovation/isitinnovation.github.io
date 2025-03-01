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
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CategoryIcon from "@mui/icons-material/Category";
import CreateIcon from "@mui/icons-material/Create";
import { MainBanner, BannerButton } from "./styles";

const Home = () => {
  const trendingTopics = [
    {
      id: 1,
      title: "ChatGPT 최신 업데이트",
      views: 1200,
      excerpt: "ChatGPT의 최신 기능과 업데이트 소식을 알아보세요.",
      category: "인공지능",
    },
    {
      id: 2,
      title: "2024년 IT 트렌드",
      views: 980,
      excerpt: "2024년 주목해야 할 IT 업계의 주요 트렌드를 소개합니다.",
      category: "트렌드",
    },
    {
      id: 3,
      title: "인공지능 개발 현황",
      views: 850,
      excerpt: "최신 AI 개발 동향과 주요 기술 발전 현황을 알아봅니다.",
      category: "개발",
    },
  ];

  const categories = [
    { name: "인공지능/머신러닝", count: 128 },
    { name: "웹 개발", count: 95 },
    { name: "모바일 개발", count: 76 },
    { name: "클라우드/DevOps", count: 64 },
    { name: "보안", count: 52 },
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{
        mb: 8,
        px: { xs: 2, md: 3 },
      }}
    >
      <MainBanner>
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          IT 트렌드의 모든 것
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          최신 기술 동향부터 개발 팁까지, 당신이 필요한 모든 IT 정보
        </Typography>
        <Button
          startIcon={<CreateIcon />}
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: "linear-gradient(45deg, #2E7D32 30%, #66BB6A 90%)",
            color: "white",
            fontWeight: 600,
            width: "fit-content",
            "&:hover": {
              boxShadow: "0 2px 8px rgba(46,125,50,0.3)",
            },
          }}
        >
          글쓰기
        </Button>
      </MainBanner>

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
              실시간 인기 게시글
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {trendingTopics.map((topic) => (
              <Card
                key={topic.id}
                sx={{
                  borderRadius: 2,
                  transition: "transform 0.2s",
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
