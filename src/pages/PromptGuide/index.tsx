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
          background: "linear-gradient(135deg, #6C63FF 0%, #E553FF 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxShadow: "0 8px 20px rgba(108, 99, 255, 0.3)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)",
            zIndex: 1,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(229, 83, 255, 0.3) 0%, transparent 70%)",
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            프롬프트 가이드
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: 0.9, textShadow: "0 1px 5px rgba(0, 0, 0, 0.2)" }}
          >
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
                bgcolor: "rgba(255, 255, 255, 0.9)",
                borderRadius: 2,
                "& fieldset": {
                  border: "none",
                },
                "&:hover": {
                  bgcolor: "white",
                  boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#6C63FF" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
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
              color: category === "전체" ? "white" : "#6C63FF",
              borderColor: category !== "전체" ? "#6C63FF" : "transparent",
              backgroundColor: category === "전체" ? "#6C63FF" : "transparent",
              "&:hover": {
                bgcolor:
                  category === "전체" ? "#5952E5" : "rgba(108, 99, 255, 0.1)",
                boxShadow: "0 0 10px rgba(108, 99, 255, 0.2)",
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
          <StarIcon sx={{ color: "#E553FF" }} />
          <Typography variant="h5" fontWeight={700} sx={{ color: "#ffffff" }}>
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
                  transition: "all 0.3s",
                  backgroundColor: "rgba(26, 27, 70, 0.7)",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(108, 99, 255, 0.2)",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 25px rgba(108, 99, 255, 0.3)",
                    borderColor: "rgba(229, 83, 255, 0.4)",
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
                        bgcolor: "#6C63FF",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <ThumbUpIcon sx={{ fontSize: 16, color: "#E553FF" }} />
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                      >
                        {item.likes}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#ffffff" }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 2, color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    {item.description}
                  </Typography>

                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "rgba(10, 15, 41, 0.7)",
                      border: "1px solid rgba(108, 99, 255, 0.3)",
                      position: "relative",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                    >
                      {item.prompt}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<ContentCopyIcon sx={{ color: "#E553FF" }} />}
                      onClick={() => handleCopyPrompt(item.prompt)}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: "#E553FF",
                        "&:hover": {
                          bgcolor: "rgba(229, 83, 255, 0.1)",
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
