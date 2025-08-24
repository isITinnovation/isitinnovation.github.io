import React, { useMemo } from "react";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import "./AnalysisResults.css";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

interface TeacherStats {
  count: number;
  avgDuration: number;
  totalDuration: number;
  minDuration: number;
  maxDuration: number;
  timeCategories: Record<string, number>;
  counselorIds: Record<string, number>;
  avgSttLength: number;
}

interface AnalysisData {
  teacherStats: Record<string, TeacherStats>;
  totalStats: {
    totalCounselings: number;
    totalTime: number;
    avgTime: number;
  };
  totalTimeCategories: Record<string, number>;
  totalCounselorIds: Record<string, number>;
}

interface AnalysisResultsProps {
  data: AnalysisData;
}

interface ChartDataItem {
  name: string;
  평균통화길이: number;
  grade: string;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  const { teacherStats, totalStats, totalTimeCategories } = data;

  // 차트 데이터 준비 - useMemo로 최적화
  const teacherChartData = useMemo((): ChartDataItem[] => {
    if (!data || !teacherStats || Object.keys(teacherStats).length === 0) {
      return [];
    }

    const result = Object.keys(teacherStats)
      .sort((a, b) => {
        // 학년별로 정렬 (0학년, 1학년, 2학년...)
        const gradeA = parseInt(a.split(" ")[0]);
        const gradeB = parseInt(b.split(" ")[0]);

        if (gradeA !== gradeB) return gradeA - gradeB;

        // 같은 학년 내에서는 상위자, 하위자, 평균 순으로 정렬
        const typeA = a.split(" ")[1];
        const typeB = b.split(" ")[1];
        const typeOrder: Record<string, number> = {
          상위자: 1,
          하위자: 2,
          평균: 3,
        };
        return typeOrder[typeA] - typeOrder[typeB];
      })
      .map((teacherType) => {
        const grade = teacherType.split(" ")[0];
        const avgDuration =
          Math.round(
            ((teacherStats[teacherType].avgDuration || 0) / 60) * 100
          ) / 100;

        return {
          name: teacherType,
          평균통화길이: avgDuration,
          grade: grade,
        };
      });

    return result;
  }, [teacherStats, data]);

  // 학년별로 그룹화
  const gradeGroups: Record<string, string[]> = {};
  Object.keys(teacherStats).forEach((teacherType) => {
    const grade = teacherType.split(" ")[0]; // "1학년", "2학년" 등
    if (!gradeGroups[grade]) {
      gradeGroups[grade] = [];
    }
    gradeGroups[grade].push(teacherType);
  });

  // 학년별 요약 통계
  const gradeSummary: Record<string, any> = {};
  Object.keys(gradeGroups).forEach((grade) => {
    const types = gradeGroups[grade];
    let totalCount = 0;
    let totalDuration = 0;
    let totalSttLength = 0;
    let typeCount = 0;

    types.forEach((type) => {
      const stats = teacherStats[type];
      totalCount += stats.count;
      totalDuration += stats.totalDuration;
      totalSttLength += stats.avgSttLength * stats.count;
      typeCount += stats.count;
    });

    gradeSummary[grade] = {
      totalCount,
      avgDuration:
        typeCount > 0 ? Math.round((totalDuration / typeCount) * 100) / 100 : 0,
      avgSttLength: typeCount > 0 ? Math.round(totalSttLength / typeCount) : 0,
      types: types,
    };
  });

  const timeCategoryChartData = Object.keys(totalTimeCategories || {}).map(
    (category) => ({
      name: category,
      value: totalTimeCategories[category],
    })
  );

  // 엑셀 다운로드 함수
  const downloadExcel = () => {
    try {
      // 워크북 생성
      const workbook = XLSX.utils.book_new();

      // 1. 전체 요약 시트
      const summaryData = [
        ["항목", "값"],
        ["총 상담 건수", `${totalStats.totalCounselings.toLocaleString()}건`],
        [
          "총 상담시간",
          `${Math.round(totalStats.totalTime / 60).toLocaleString()}분`,
        ],
        [
          "평균 통화길이",
          `${Math.round((totalStats.avgTime / 60) * 100) / 100}분`,
        ],
      ];
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, "전체요약");

      // 2. 교사구분별 상세 통계 시트
      const teacherDetailData = [
        [
          "교사구분",
          "상담건수",
          "평균통화길이(분)",
          "총통화길이(분)",
          "최소길이(초)",
          "최대길이(초)",
          "평균STT길이(자)",
        ],
      ];

      Object.keys(teacherStats)
        .sort((a, b) => {
          const gradeA = parseInt(a.split(" ")[0]);
          const gradeB = parseInt(b.split(" ")[0]);
          if (gradeA !== gradeB) return gradeA - gradeB;
          const typeA = a.split(" ")[1];
          const typeB = b.split(" ")[1];
          const typeOrder: Record<string, number> = {
            상위자: 1,
            하위자: 2,
            평균: 3,
          };
          return typeOrder[typeA] - typeOrder[typeB];
        })
        .forEach((teacherType) => {
          const stats = teacherStats[teacherType];
          teacherDetailData.push([
            teacherType,
            stats.count.toString(),
            (Math.round((stats.avgDuration / 60) * 100) / 100).toString(),
            Math.round(stats.totalDuration / 60).toString(),
            stats.minDuration.toString(),
            stats.maxDuration.toString(),
            stats.avgSttLength.toString(),
          ]);
        });

      const teacherDetailSheet = XLSX.utils.aoa_to_sheet(teacherDetailData);
      XLSX.utils.book_append_sheet(
        workbook,
        teacherDetailSheet,
        "교사구분별상세"
      );

      // 3. 학년별 요약 시트
      const gradeSummaryData = [
        ["학년", "총상담건수", "평균통화길이(분)", "평균STT길이(자)"],
      ];

      Object.keys(gradeSummary)
        .sort()
        .forEach((grade) => {
          const summary = gradeSummary[grade];
          gradeSummaryData.push([
            grade,
            summary.totalCount.toString(),
            (Math.round((summary.avgDuration / 60) * 100) / 100).toString(),
            summary.avgSttLength.toString(),
          ]);
        });

      const gradeSummarySheet = XLSX.utils.aoa_to_sheet(gradeSummaryData);
      XLSX.utils.book_append_sheet(workbook, gradeSummarySheet, "학년별요약");

      // 4. 상담시간구분별 분포 시트
      const timeCategoryData = [["상담시간구분", "건수"]];
      Object.entries(totalTimeCategories).forEach(([category, count]) => {
        timeCategoryData.push([category, count.toString()]);
      });

      const timeCategorySheet = XLSX.utils.aoa_to_sheet(timeCategoryData);
      XLSX.utils.book_append_sheet(
        workbook,
        timeCategorySheet,
        "상담시간구분별분포"
      );

      // 5. 교사구분별 상담시간구분 분포 시트
      const teacherTimeCategoryData = [["교사구분", "상담시간구분", "건수"]];
      Object.keys(teacherStats)
        .sort((a, b) => {
          const gradeA = parseInt(a.split(" ")[0]);
          const gradeB = parseInt(b.split(" ")[0]);
          if (gradeA !== gradeB) return gradeA - gradeB;
          const typeA = a.split(" ")[1];
          const typeB = b.split(" ")[1];
          const typeOrder: Record<string, number> = {
            상위자: 1,
            하위자: 2,
            평균: 3,
          };
          return typeOrder[typeA] - typeOrder[typeB];
        })
        .forEach((teacherType) => {
          Object.entries(teacherStats[teacherType].timeCategories).forEach(
            ([category, count]) => {
              teacherTimeCategoryData.push([
                teacherType,
                category,
                count.toString(),
              ]);
            }
          );
        });

      const teacherTimeCategorySheet = XLSX.utils.aoa_to_sheet(
        teacherTimeCategoryData
      );
      XLSX.utils.book_append_sheet(
        workbook,
        teacherTimeCategorySheet,
        "교사별상담시간분포"
      );

      // 6. 교사구분별 상담사 분포 시트
      const teacherCounselorData = [["교사구분", "상담사ID", "건수"]];
      Object.keys(teacherStats)
        .sort((a, b) => {
          const gradeA = parseInt(a.split(" ")[0]);
          const gradeB = parseInt(b.split(" ")[0]);
          if (gradeA !== gradeB) return gradeA - gradeB;
          const typeA = a.split(" ")[1];
          const typeB = b.split(" ")[1];
          const typeOrder: Record<string, number> = {
            상위자: 1,
            하위자: 2,
            평균: 3,
          };
          return typeOrder[typeA] - typeOrder[typeB];
        })
        .forEach((teacherType) => {
          Object.entries(teacherStats[teacherType].counselorIds).forEach(
            ([counselorId, count]) => {
              teacherCounselorData.push([
                teacherType,
                counselorId,
                count.toString(),
              ]);
            }
          );
        });

      const teacherCounselorSheet =
        XLSX.utils.aoa_to_sheet(teacherCounselorData);
      XLSX.utils.book_append_sheet(
        workbook,
        teacherCounselorSheet,
        "교사별상담사분포"
      );

      // 파일 다운로드
      const currentDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const fileName = `교사구분별_상담기록_분석결과_${currentDate}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      alert("엑셀 파일이 성공적으로 다운로드되었습니다!");
    } catch (error) {
      console.error("엑셀 다운로드 중 오류 발생:", error);
      alert("엑셀 다운로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* 결과 헤더 */}
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            align="center"
            sx={{ flex: 1 }}
          >
            📊 교사구분별 상담기록 분석 결과
          </Typography>
          <Button
            variant="contained"
            color="success"
            startIcon={<DownloadIcon />}
            onClick={downloadExcel}
            sx={{
              minWidth: "140px",
              height: "40px",
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(46, 125, 50, 0.4)",
                transform: "translateY(-1px)",
              },
            }}
          >
            엑셀 다운로드
          </Button>
        </Box>

        {/* 총 요약 통계 */}
        <Grid container spacing={3} sx={{ marginTop: 2 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="primary">
                  총 상담 건수
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {totalStats.totalCounselings.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="secondary">
                  총 상담시간
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "secondary.main" }}
                >
                  {Math.round(totalStats.totalTime / 60).toLocaleString()}분
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="success.main">
                  평균 통화길이
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "success.main" }}
                >
                  {Math.round((totalStats.avgTime / 60) * 100) / 100}분
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* 차트 섹션 */}
      <Paper elevation={2} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" gutterBottom>
          교사구분별 평균 통화길이
        </Typography>
        <Box sx={{ width: "100%", height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teacherChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                style={{ fontSize: "12px" }}
              />
              <YAxis
                label={{ value: "분", angle: -90, position: "insideLeft" }}
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                formatter={(value) => [`${value}분`, "평균 통화길이"]}
                labelStyle={{ fontSize: "12px" }}
              />
              <Bar dataKey="평균통화길이">
                {teacherChartData.map((_, index) => {
                  const grade = parseInt(teacherChartData[index].grade);
                  const colors = [
                    "#FF6B6B", // 0학년 - 빨간색
                    "#4ECDC4", // 1학년 - 청록색
                    "#45B7D1", // 2학년 - 파란색
                    "#96CEB4", // 3학년 - 초록색
                    "#FFEAA7", // 4학년 - 노란색
                    "#DDA0DD", // 5학년 - 보라색
                    "#FF9F43", // 6학년 - 주황색
                  ];
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[grade % colors.length]}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* 파이 차트 섹션 */}
      <Paper elevation={2} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom align="center">
          상담시간구분별 분포
        </Typography>
        <Box sx={{ height: 300, display: "flex", justifyContent: "center" }}>
          <ResponsiveContainer width="50%" height="100%">
            <PieChart>
              <Pie
                data={timeCategoryChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {timeCategoryChartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* 학년별 요약 섹션 */}
      <Paper elevation={2} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" gutterBottom>
          📚 학년별 요약 통계
        </Typography>
        <Grid container spacing={2}>
          {Object.keys(gradeSummary)
            .sort()
            .map((grade) => (
              <Grid item xs={12} sm={6} md={4} key={grade}>
                <Card elevation={1} sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {grade}
                    </Typography>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        총 상담 건수:{" "}
                        <strong>{gradeSummary[grade].totalCount}건</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        평균 통화길이:{" "}
                        <strong>
                          {Math.round(
                            (gradeSummary[grade].avgDuration / 60) * 100
                          ) / 100}
                          분
                        </strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        평균 STT 길이:{" "}
                        <strong>{gradeSummary[grade].avgSttLength}자</strong>
                      </Typography>
                    </Box>
                    <Typography variant="body2" gutterBottom>
                      구분별 상담 건수:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {gradeSummary[grade].types.map((type: string) => (
                        <Chip
                          key={type}
                          label={`${type.split(" ")[1]}: ${
                            teacherStats[type].count
                          }건`}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Paper>

      {/* 교사구분별 상세 통계 */}
      <Paper elevation={2} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          교사구분별 상세 통계
        </Typography>
        <Box sx={{ marginTop: 2 }}>
          {Object.keys(teacherStats)
            .sort((a, b) => {
              // 학년별로 정렬 (0학년, 1학년, 2학년...)
              const gradeA = parseInt(a.split(" ")[0]);
              const gradeB = parseInt(b.split(" ")[0]);

              if (gradeA !== gradeB) return gradeA - gradeB;

              // 같은 학년 내에서는 상위자, 하위자, 평균 순으로 정렬
              const typeA = a.split(" ")[1];
              const typeB = b.split(" ")[1];
              const typeOrder: Record<string, number> = {
                상위자: 1,
                하위자: 2,
                평균: 3,
              };
              return typeOrder[typeA] - typeOrder[typeB];
            })
            .map((teacherType) => (
              <Accordion key={teacherType} sx={{ marginBottom: 1 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`${teacherType}-content`}
                  id={`${teacherType}-header`}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Typography variant="h6">{teacherType}</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginRight: 2 }}
                    >
                      {teacherStats[teacherType].count}건 |{" "}
                      {Math.round(
                        (teacherStats[teacherType].avgDuration / 60) * 100
                      ) / 100}
                      분
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        기본 통계
                      </Typography>
                      <Box sx={{ marginLeft: 2 }}>
                        <Typography variant="body2">
                          상담 건수:{" "}
                          <strong>{teacherStats[teacherType].count}건</strong>
                        </Typography>
                        <Typography variant="body2">
                          평균 통화길이:{" "}
                          <strong>
                            {Math.round(
                              (teacherStats[teacherType].avgDuration / 60) * 100
                            ) / 100}
                            분
                          </strong>
                        </Typography>
                        <Typography variant="body2">
                          총 통화길이:{" "}
                          <strong>
                            {Math.round(
                              teacherStats[teacherType].totalDuration / 60
                            )}
                            분
                          </strong>
                        </Typography>
                        <Typography variant="body2">
                          최소/최대 길이:{" "}
                          <strong>
                            {teacherStats[teacherType].minDuration}/
                            {teacherStats[teacherType].maxDuration}초
                          </strong>
                        </Typography>
                        <Typography variant="body2">
                          평균 STT 길이:{" "}
                          <strong>
                            {teacherStats[teacherType].avgSttLength}자
                          </strong>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        상담시간구분별 분포
                      </Typography>
                      <Box sx={{ marginLeft: 2 }}>
                        {Object.entries(
                          teacherStats[teacherType].timeCategories
                        ).map(([category, count]) => (
                          <Typography key={category} variant="body2">
                            {category}: <strong>{count}건</strong>
                          </Typography>
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        상담사ID별 분포
                      </Typography>
                      <Box sx={{ marginLeft: 2 }}>
                        {Object.entries(
                          teacherStats[teacherType].counselorIds
                        ).map(([counselorId, count]) => (
                          <Typography key={counselorId} variant="body2">
                            {counselorId}: <strong>{count}건</strong>
                          </Typography>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default AnalysisResults;
