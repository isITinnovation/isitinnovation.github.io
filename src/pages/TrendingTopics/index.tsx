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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useState } from "react";

const StockInfo = () => {
  const [searchValue, setSearchValue] = useState("");

  // 주식 카테고리
  const stockCategories = [
    "전체",
    "국내주식",
    "해외주식",
    "테크",
    "금융",
    "에너지",
    "헬스케어",
  ];

  // 주식 색상 (Home/index.tsx의 색상 스타일 적용)
  const stockColors = [
    "#7D7D7D", // 문빔 그레이
    "#9370DB", // 디지털 라벤더
    "#3EB489", // 네오 민트
    "#A47551", // 모카무스
  ];

  // 주식 정보 데이터
  const stockData = [
    {
      id: 1,
      name: "삼성전자",
      ticker: "005930.KS",
      price: 72800,
      change: 1.2,
      volume: 12543210,
      marketCap: "434조 원",
      category: "국내주식",
      sector: "테크",
    },
    {
      id: 2,
      name: "현대차",
      ticker: "005380.KS",
      price: 186500,
      change: -0.8,
      volume: 1254300,
      marketCap: "39조 원",
      category: "국내주식",
      sector: "자동차",
    },
    {
      id: 3,
      name: "애플",
      ticker: "AAPL",
      price: 187.32,
      change: 0.5,
      volume: 45678900,
      marketCap: "$2.94T",
      category: "해외주식",
      sector: "테크",
    },
    {
      id: 4,
      name: "테슬라",
      ticker: "TSLA",
      price: 237.49,
      change: 2.3,
      volume: 98765400,
      marketCap: "$755B",
      category: "해외주식",
      sector: "자동차",
    },
    {
      id: 5,
      name: "KB금융",
      ticker: "105560.KS",
      price: 62400,
      change: -1.1,
      volume: 987650,
      marketCap: "25조 원",
      category: "국내주식",
      sector: "금융",
    },
    {
      id: 6,
      name: "메타",
      ticker: "META",
      price: 474.99,
      change: 1.8,
      volume: 15678900,
      marketCap: "$1.22T",
      category: "해외주식",
      sector: "테크",
    },
  ];

  // 주식 뉴스 데이터
  const stockNews = [
    {
      id: 1,
      title: "삼성전자, 신형 메모리 반도체 양산 시작... 시장 점유율 확대 전망",
      excerpt:
        "삼성전자가 업계 최초로 차세대 HBM 메모리 반도체 양산을 시작했습니다. 이에 따라 AI 시장에서의 경쟁력이 강화될 전망입니다.",
      source: "경제신문",
      timeAgo: "2시간 전",
      relatedStocks: ["삼성전자"],
    },
    {
      id: 2,
      title: "테슬라, 전기차 판매량 예상치 상회... 주가 급등",
      excerpt:
        "테슬라가 2분기 전기차 판매량이 시장 예상치를 크게 상회하면서 주가가 급등했습니다. 중국 시장에서의 판매 호조가 주요 원인으로 분석됩니다.",
      source: "글로벌 마켓",
      timeAgo: "5시간 전",
      relatedStocks: ["테슬라"],
    },
    {
      id: 3,
      title: "금융위, 증권사 자본규제 완화 검토... 금융주 강세",
      excerpt:
        "금융위원회가 증권사에 대한 자본규제 완화를 검토 중인 것으로 알려지면서 KB금융, 신한지주 등 금융주가 강세를 보였습니다.",
      source: "금융경제",
      timeAgo: "8시간 전",
      relatedStocks: ["KB금융", "신한지주"],
    },
  ];

  // 카테고리별 색상 가져오기
  const getColorForCategory = (category: string) => {
    const index = stockCategories.indexOf(category) % stockColors.length;
    return stockColors[index];
  };

  // 검색 필터링
  const filteredStocks = stockData.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      stock.ticker.toLowerCase().includes(searchValue.toLowerCase()) ||
      stock.sector.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      {/* 메인 배너 */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: "#FFFFFF",
          color: "#000000",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          position: "relative",
          overflow: "hidden",
          border: "1px solid #EEEEEE",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#000000",
            }}
          >
            주식 정보 센터
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.7, color: "#333333" }}>
            국내외 주요 주식 정보와 최신 시장 동향을 확인하세요
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="관심있는 주식이나 티커를 검색해보세요"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              mt: 2,
              maxWidth: 500,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#FFFFFF",
                borderRadius: 2,
                "& fieldset": {
                  borderColor: "#DDDDDD",
                },
                "&:hover fieldset": {
                  borderColor: "#999999",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#555555" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Paper>

      {/* 카테고리 필터 */}
      <Box sx={{ mb: 4, display: "flex", gap: 1, flexWrap: "wrap" }}>
        {stockCategories.map((category) => (
          <Button
            key={category}
            variant={category === "전체" ? "contained" : "outlined"}
            sx={{
              borderRadius: "20px",
              px: 2,
              py: 0.5,
              color:
                category === "전체" ? "white" : getColorForCategory(category),
              borderColor:
                category !== "전체"
                  ? getColorForCategory(category)
                  : "transparent",
              backgroundColor:
                category === "전체"
                  ? getColorForCategory(category)
                  : "transparent",
              "&:hover": {
                bgcolor:
                  category === "전체"
                    ? getColorForCategory(category)
                    : `${getColorForCategory(category)}20`,
                boxShadow: `0 0 10px ${getColorForCategory(category)}40`,
              },
            }}
          >
            {category}
          </Button>
        ))}
      </Box>

      {/* 주식 정보 테이블 */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 3,
          }}
        >
          <ShowChartIcon sx={{ color: "#000000" }} />
          <Typography variant="h5" fontWeight={700} sx={{ color: "#000000" }}>
            주요 종목 정보
          </Typography>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 700 }}>종목명</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>티커</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>현재가</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>등락률</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>거래량</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>시가총액</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>섹터</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStocks.map((stock) => (
                <TableRow key={stock.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{stock.name}</TableCell>
                  <TableCell>{stock.ticker}</TableCell>
                  <TableCell>
                    {typeof stock.price === "number"
                      ? stock.price.toLocaleString()
                      : stock.price}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color:
                          stock.change > 0
                            ? "#FF0000"
                            : stock.change < 0
                            ? "#0000FF"
                            : "inherit",
                      }}
                    >
                      {stock.change > 0 ? (
                        <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                      ) : stock.change < 0 ? (
                        <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
                      ) : null}
                      {stock.change > 0 ? "+" : ""}
                      {stock.change}%
                    </Box>
                  </TableCell>
                  <TableCell>{stock.volume.toLocaleString()}</TableCell>
                  <TableCell>{stock.marketCap}</TableCell>
                  <TableCell>
                    <Chip
                      label={stock.sector}
                      size="small"
                      sx={{
                        borderRadius: "4px",
                        bgcolor: getColorForCategory(stock.category),
                        color: "#FFFFFF",
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* 주식 뉴스 */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 3,
          }}
        >
          <AttachMoneyIcon sx={{ color: "#000000" }} />
          <Typography variant="h5" fontWeight={700} sx={{ color: "#000000" }}>
            최신 주식 뉴스
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {stockNews.map((news) => (
            <Grid item xs={12} key={news.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  transition: "all 0.3s",
                  backgroundColor: "#ffffff",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    transform: "translateX(4px)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    borderColor: "rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                        >
                          {news.source} • {news.timeAgo}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 1, color: "#333333" }}
                      >
                        {news.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 2, color: "rgba(0, 0, 0, 0.7)" }}
                      >
                        {news.excerpt}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {news.relatedStocks.map((stock, index) => (
                          <Chip
                            key={index}
                            label={stock}
                            size="small"
                            sx={{
                              borderRadius: "4px",
                              bgcolor: stockColors[index % stockColors.length],
                              color: "#FFFFFF",
                              fontWeight: 500,
                              "&:hover": {
                                filter: "brightness(0.9)",
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default StockInfo;
