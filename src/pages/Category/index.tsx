import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useState, useEffect } from "react";
import { Post } from "../../types/post";
import { postService } from "../../services/postService";
import { useNavigate, useParams } from "react-router-dom";

const CategoryPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { categoryName } = useParams<{ categoryName: string }>();
  const decodedCategoryName = categoryName
    ? decodeURIComponent(categoryName)
    : "";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const allPosts = await postService.getTrendingPosts();
        // 해당 카테고리를 포함하는 게시물만 필터링
        const filteredPosts = allPosts.filter((post) =>
          post.category
            .split(",")
            .map((cat) => cat.trim())
            .includes(decodedCategoryName)
        );
        setPosts(filteredPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [decodedCategoryName]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 8 }}>
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
          {decodedCategoryName} 카테고리
        </Typography>
        <Typography variant="body2" color="grey.600">
          ({posts.length}개의 게시글)
        </Typography>
      </Box>

      {posts.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            이 카테고리에 게시글이 없습니다.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid item xs={12} key={post.id}>
              <Card
                onClick={() => navigate(`/post/${post.id}`)}
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
                      {post.category.split(",").map((cat, index) => (
                        <Chip
                          key={index}
                          label={cat.trim()}
                          size="small"
                          color={
                            cat.trim() === decodedCategoryName
                              ? "secondary"
                              : "primary"
                          }
                          sx={{ borderRadius: "4px" }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1 }}
                    color="primary.dark"
                  >
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.excerpt}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default CategoryPage;
