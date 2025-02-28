import React from "react";
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
  TextField,
  InputAdornment,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const PromptGuide = () => {
  const promptCategories = [
    "전체",
    "개발",
    "디자인",
    "마케팅",
    "기획",
    "번역",
    "분석",
  ];

  const popularPrompts = [
    {
      id: 1,
      title: "코드 리뷰 프롬프트",
      description: "깔끔하고 효율적인 코드 리뷰를 위한 프롬프트 가이드",
      category: "개발",
      likes: 234,
      prompt:
        "다음 코드를 리뷰해주세요. 코드의 문제점과 개선방안을 제시해주세요: [코드]",
    },
    {
      id: 2,
      title: "기술 문서 작성",
      description: "전문적이고 이해하기 쉬운 기술 문서 작성 프롬프트",
      category: "개발",
      likes: 189,
      prompt:
        "다음 기술에 대한 문서를 작성해주세요. 초보자도 이해할 수 있게 설명해주세요: [기술명]",
    },
    {
      id: 3,
      title: "버그 분석 프롬프트",
      description: "효과적인 버그 분석과 해결을 위한 프롬프트",
      category: "개발",
      likes: 156,
      prompt:
        "다음 에러 로그를 분석하고 가능한 해결 방안을 제시해주세요: [에러 로그]",
    },
  ];

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    // TODO: Add toast notification
  };

  return (
    <Container maxWidth="lg">
      {/* 메인 배너 */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(45deg, #FF5B59 30%, #FF8E53 90%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          프롬프트 가이드
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          AI와 더 효과적으로 대화하기 위한 최적의 프롬프트 모음
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="원하는 프롬프트를 검색해보세요"
          sx={{
            mt: 2,
            maxWidth: 500,
            "& .MuiOutlinedInput-root": {
              bgcolor: "white",
              borderRadius: 2,
              "& fieldset": {
                border: "none",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* 카테고리 필터 */}
      <Box sx={{ mb: 4, display: "flex", gap: 1, flexWrap: "wrap" }}>
        {promptCategories.map((category) => (
          <Button
            key={category}
            variant={category === "전체" ? "contained" : "outlined"}
            sx={{
              borderRadius: "20px",
              px: 2,
              py: 0.5,
              color: category === "전체" ? "white" : "primary.main",
              "&:hover": {
                bgcolor:
                  category === "전체" ? "primary.dark" : "background.paper",
              },
            }}
          >
            {category}
          </Button>
        ))}
      </Box>

      {/* 인기 프롬프트 목록 */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 3,
          }}
        >
          <StarIcon color="primary" />
          <Typography variant="h5" fontWeight={700}>
            인기 프롬프트
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {popularPrompts.map((item) => (
            <Grid item xs={12} md={4} key={item.id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ height: "100%", p: 3 }}>
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Chip
                      label={item.category}
                      size="small"
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <ThumbUpIcon sx={{ fontSize: 16, color: "grey.500" }} />
                      <Typography variant="body2" color="grey.500">
                        {item.likes}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="grey.600" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>

                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "grey.50",
                      position: "relative",
                    }}
                  >
                    <Typography variant="body2" color="grey.800">
                      {item.prompt}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => handleCopyPrompt(item.prompt)}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: "grey.600",
                        "&:hover": {
                          bgcolor: "background.paper",
                        },
                      }}
                    >
                      복사
                    </Button>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default PromptGuide;
