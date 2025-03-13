import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import CodeIcon from "@mui/icons-material/Code";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import SeoAnalyzer from "../../components/SeoAnalyzer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./BlogEditor.css";

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

const BlogEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [category, setCategory] = useState("기술");
  const [showSeoAnalyzer, setShowSeoAnalyzer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (title.trim() && content.trim() && !showSeoAnalyzer) {
      setShowSeoAnalyzer(true);
    }
  }, [title, content, category, showSeoAnalyzer]);

  const handleToolbarClick = (type: string) => {
    const commands: { [key: string]: { prefix: string; suffix: string } } = {
      bold: { prefix: "**", suffix: "**" },
      italic: { prefix: "_", suffix: "_" },
      code: { prefix: "```\n", suffix: "\n```" },
      link: { prefix: "[링크 텍스트](", suffix: ")" },
      image: { prefix: "![이미지 설명](", suffix: ")" },
    };

    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const { prefix, suffix } = commands[type];

    const newContent =
      content.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      content.substring(end);

    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const categories = [
    "기술",
    "개발",
    "프로그래밍",
    "인공지능",
    "웹개발",
    "모바일",
    "데이터",
    "클라우드",
    "보안",
    "기타",
  ];

  const handleSave = async () => {
    if (!title.trim()) {
      setSnackbar({
        open: true,
        message: "제목을 입력해주세요.",
        severity: "error",
      });
      return;
    }
    if (!content.trim()) {
      setSnackbar({
        open: true,
        message: "내용을 입력해주세요.",
        severity: "error",
      });
      return;
    }

    try {
      setIsLoading(true);

      // 서버리스 함수 호출
      const response = await axios.post<{
        success: boolean;
        message: string;
        post: BlogPost;
      }>("/api/saveBlogPost", {
        title,
        content,
        tags,
        category,
      });

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "블로그 포스트가 성공적으로 저장되었습니다.",
          severity: "success",
        });

        // 저장 성공 후 포스트 상세 페이지로 이동
        setTimeout(() => {
          navigate(`/post/${response.data.post.id}`);
        }, 1500);
      } else {
        throw new Error("저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("블로그 저장 중 오류 발생:", error);
      setSnackbar({
        open: true,
        message: "블로그 저장 중 오류가 발생했습니다.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" className="blog-editor-container">
      <Typography variant="h4" gutterBottom>
        블로그 작성
      </Typography>

      <Paper className="blog-editor-paper">
        <TextField
          fullWidth
          label="제목"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>카테고리</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="카테고리"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => setShowSeoAnalyzer(!showSeoAnalyzer)}
            sx={{ minWidth: "180px" }}
          >
            {showSeoAnalyzer ? "SEO 분석 숨기기" : "SEO 분석 보기"}
          </Button>
        </Box>

        {showSeoAnalyzer && (
          <SeoAnalyzer title={title} content={content} category={category} />
        )}

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            p: 2,
            border: "1px solid #ddd",
            borderRadius: 1,
            mb: 3,
          }}
        >
          {tags.map((tag) => (
            <Box
              key={tag}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                px: 2,
                py: 0.5,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {tag}
              <IconButton
                size="small"
                onClick={() => handleRemoveTag(tag)}
                sx={{ color: "white", p: 0.2 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <TextField
            placeholder="태그 입력 후 Enter"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleAddTag}
            variant="standard"
            size="small"
            sx={{ minWidth: 150 }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            bgcolor: "background.paper",
            p: 1,
            borderRadius: 1,
            mb: 2,
          }}
        >
          <IconButton onClick={() => handleToolbarClick("bold")} title="굵게">
            <FormatBoldIcon />
          </IconButton>
          <IconButton
            onClick={() => handleToolbarClick("italic")}
            title="기울임"
          >
            <FormatItalicIcon />
          </IconButton>
          <IconButton onClick={() => handleToolbarClick("code")} title="코드">
            <CodeIcon />
          </IconButton>
          <IconButton onClick={() => handleToolbarClick("link")} title="링크">
            <LinkIcon />
          </IconButton>
          <IconButton
            onClick={() => handleToolbarClick("image")}
            title="이미지"
          >
            <ImageIcon />
          </IconButton>
        </Box>

        <Box className="editor-grid">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="마크다운으로 작성해주세요..."
            className="editor-textarea"
          />
          <Box className="preview-box">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSave}
            disabled={isLoading}
            startIcon={
              isLoading && <CircularProgress size={20} color="inherit" />
            }
          >
            {isLoading ? "저장 중..." : "저장하기"}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BlogEditor;
