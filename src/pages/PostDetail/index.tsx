import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Chip,
  IconButton,
  Paper,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { PostDetail } from "../../types/post";
import { postService } from "../../services/postService";
import "./PostDetail.css";
import LoadingSkeleton from "../../components/LoadingSkeleton";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingTitle, setLoadingTitle] = useState<string | undefined>();

  useEffect(() => {
    // URL에서 title 파라미터 확인
    const params = new URLSearchParams(window.location.search);
    const titleFromUrl = params.get("title");
    if (titleFromUrl) {
      setLoadingTitle(decodeURIComponent(titleFromUrl));
    }

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await postService.getPostById(Number(id));
        setPost(response || null);
      } catch (err) {
        setError("포스트를 불러오는데 실패했습니다.");
        console.error("Error fetching post:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (isLoading) {
    return <LoadingSkeleton title={loadingTitle} />;
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container>
        <Alert severity="warning">포스트를 찾을 수 없습니다.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box className="post-detail-header">
            <IconButton
              onClick={() => navigate(-1)}
              className="post-detail-back-button"
            >
              <ArrowBackIcon />
            </IconButton>

            <Box
              className="post-detail-categories"
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              {post.category.split(",").map((cat, index) => (
                <Chip
                  key={index}
                  label={cat.trim()}
                  size="small"
                  className="post-detail-category"
                  sx={{ margin: "0 0.5rem 0.5rem 0", display: "inline-flex" }}
                />
              ))}
            </Box>
            <Typography variant="h4" className="post-detail-title">
              {post.title}
            </Typography>

            <Box className="post-detail-meta">
              <p className="post-detail-author">작성자 : {post.author}</p>
              <p className="post-detail-createdAt">작성일 : {post.createdAt}</p>
            </Box>
          </Box>

          <Box
            className="post-detail-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default PostDetailPage;
