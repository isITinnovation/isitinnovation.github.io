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
import "./BlogEditor.css";

const BlogEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [category, setCategory] = useState("기술");
  const [showSeoAnalyzer, setShowSeoAnalyzer] = useState(false);

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

  const handleSave = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    console.log({ title, content, tags, category });
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
          >
            저장하기
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BlogEditor;
