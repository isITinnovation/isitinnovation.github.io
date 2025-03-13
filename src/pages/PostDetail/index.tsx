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
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { PostDetail } from "../../types/post";
import { postService } from "../../services/postService";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "./PostDetail.css";

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

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!id) return;

        // 먼저 서버리스 API에서 포스트 가져오기 시도
        try {
          const response = await axios.get<{
            success: boolean;
            post: BlogPost;
          }>(`/api/getBlogPost?id=${id}`);
          if (response.data.success && response.data.post) {
            setBlogPost(response.data.post);
            return;
          }
        } catch (apiError) {
          console.log(
            "서버리스 API에서 포스트를 가져오지 못했습니다. 기존 서비스 사용:",
            apiError
          );
        }

        // 서버리스 API에서 가져오지 못한 경우 기존 서비스 사용
        const postData = await postService.getPostById(Number(id));
        if (postData) {
          setPost(postData);
        } else {
          navigate("/not-found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("포스트를 불러오는 중 오류가 발생했습니다.");
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

  if (error) {
    return (
      <Container maxWidth="md" className="post-detail-container">
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
      </Container>
    );
  }

  // 서버리스 API에서 가져온 블로그 포스트 렌더링
  if (blogPost) {
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
                <Chip
                  label={blogPost.category}
                  size="small"
                  className="post-detail-category"
                  sx={{ margin: "0 0.5rem 0.5rem 0", display: "inline-flex" }}
                />
              </Box>
              <Typography variant="h4" className="post-detail-title">
                {blogPost.title}
              </Typography>

              <Box className="post-detail-meta">
                <p className="post-detail-createdAt">
                  작성일:{" "}
                  {new Date(blogPost.createdAt).toLocaleDateString("ko-KR")}
                </p>
                <p className="post-detail-updatedAt">
                  수정일:{" "}
                  {new Date(blogPost.updatedAt).toLocaleDateString("ko-KR")}
                </p>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                {blogPost.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            <Box className="post-detail-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {blogPost.content}
              </ReactMarkdown>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  // 기존 포스트 렌더링
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
