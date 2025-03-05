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
import { PostDetail } from "../../types/post";
import { postService } from "../../services/postService";
import "./PostDetail.css";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        if (!id) return;
        const postData = await postService.getPostById(Number(id));
        if (postData) {
          setPost(postData);
        } else {
          navigate("/not-found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        navigate("/not-found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <Container maxWidth="md" className="post-detail-container">
        <Skeleton variant="rectangular" height={400} />
      </Container>
    );
  }

  if (!post) return null;

  return (
    <Container
      maxWidth="md"
      className="post-detail-container"
      sx={{ py: { xs: 2, md: 4 }, mt: { xs: -2, md: -4 } }}
    >
      <Box className="post-detail-box">
        <Paper className="post-detail-paper">
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
              {/* <Box className="post-detail-views">
                <VisibilityIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">
                  {post.views.toLocaleString()}
                </Typography>
              </Box> */}
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
