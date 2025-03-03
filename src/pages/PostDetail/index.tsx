import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Chip,
  IconButton,
  Paper,
  Skeleton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { PostDetail } from "../../types/post";
import { postService } from "../../services/postService";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;
        const postData = await postService.getPostById(Number(id));
        if (postData) {
          setPost(postData);
        } else {
          // 포스트를 찾을 수 없는 경우
          navigate("/404");
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={200} />
      </Container>
    );
  }

  if (!post) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>

        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Chip
              label={post.category}
              size="small"
              sx={{
                bgcolor: "primary.main",
                color: "white",
                fontWeight: 600,
                mb: 2,
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              {post.title}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, color: "grey.600" }}>
              <Typography variant="body2">{post.author}</Typography>
              <Typography variant="body2">{post.createdAt}</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <VisibilityIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">
                  {post.views.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {post.content}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default PostDetailPage;
