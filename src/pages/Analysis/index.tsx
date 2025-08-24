import React, { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import FileUpload from "./components/FileUpload";
import AnalysisResults from "./components/AnalysisResults";
import "./styles.css";

interface AnalysisData {
  teacherStats: Record<string, any>;
  totalStats: {
    totalCounselings: number;
    totalTime: number;
    avgTime: number;
  };
  totalTimeCategories: Record<string, number>;
  totalCounselorIds: Record<string, number>;
}

const Analysis: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleFileUpload = (data: AnalysisData) => {
    setAnalysisData(data);
  };

  // 테스트용 샘플 데이터
  const testData: AnalysisData = {
    teacherStats: {
      // 0학년
      "0학년 상위자": {
        count: 20,
        avgDuration: 160.5,
        totalDuration: 3210.0,
        minDuration: 50,
        maxDuration: 280,
        timeCategories: { 오전: 12, 오후: 8 },
        counselorIds: { 상담사A: 12, 상담사B: 8 },
        avgSttLength: 140,
      },
      "0학년 하위자": {
        count: 25,
        avgDuration: 180.3,
        totalDuration: 4507.5,
        minDuration: 40,
        maxDuration: 320,
        timeCategories: { 오전: 15, 오후: 10 },
        counselorIds: { 상담사A: 16, 상담사B: 9 },
        avgSttLength: 160,
      },
      "0학년 평균": {
        count: 22,
        avgDuration: 145.8,
        totalDuration: 3207.6,
        minDuration: 45,
        maxDuration: 250,
        timeCategories: { 오전: 13, 오후: 9 },
        counselorIds: { 상담사B: 15, 상담사C: 7 },
        avgSttLength: 125,
      },
      // 1학년
      "1학년 상위자": {
        count: 25,
        avgDuration: 180.5,
        totalDuration: 4512.5,
        minDuration: 60,
        maxDuration: 300,
        timeCategories: { 오전: 15, 오후: 10 },
        counselorIds: { 상담사A: 15, 상담사B: 10 },
        avgSttLength: 150,
      },
      "1학년 하위자": {
        count: 30,
        avgDuration: 200.3,
        totalDuration: 6009.0,
        minDuration: 45,
        maxDuration: 350,
        timeCategories: { 오전: 18, 오후: 12 },
        counselorIds: { 상담사A: 20, 상담사B: 10 },
        avgSttLength: 180,
      },
      "1학년 평균": {
        count: 28,
        avgDuration: 165.8,
        totalDuration: 4642.4,
        minDuration: 50,
        maxDuration: 280,
        timeCategories: { 오전: 16, 오후: 12 },
        counselorIds: { 상담사B: 18, 상담사C: 10 },
        avgSttLength: 135,
      },
      // 2학년
      "2학년 상위자": {
        count: 22,
        avgDuration: 175.2,
        totalDuration: 3854.4,
        minDuration: 55,
        maxDuration: 320,
        timeCategories: { 오전: 12, 오후: 10 },
        counselorIds: { 상담사B: 15, 상담사C: 7 },
        avgSttLength: 160,
      },
      "2학년 하위자": {
        count: 35,
        avgDuration: 195.6,
        totalDuration: 6846.0,
        minDuration: 40,
        maxDuration: 380,
        timeCategories: { 오전: 20, 오후: 15 },
        counselorIds: { 상담사A: 22, 상담사B: 13 },
        avgSttLength: 190,
      },
      "2학년 평균": {
        count: 26,
        avgDuration: 170.1,
        totalDuration: 4422.6,
        minDuration: 48,
        maxDuration: 290,
        timeCategories: { 오전: 14, 오후: 12 },
        counselorIds: { 상담사B: 16, 상담사C: 10 },
        avgSttLength: 140,
      },
      // 3학년
      "3학년 상위자": {
        count: 20,
        avgDuration: 185.3,
        totalDuration: 3706.0,
        minDuration: 65,
        maxDuration: 310,
        timeCategories: { 오전: 11, 오후: 9 },
        counselorIds: { 상담사A: 12, 상담사C: 8 },
        avgSttLength: 170,
      },
      "3학년 하위자": {
        count: 32,
        avgDuration: 210.7,
        totalDuration: 6742.4,
        minDuration: 42,
        maxDuration: 400,
        timeCategories: { 오전: 19, 오후: 13 },
        counselorIds: { 상담사A: 20, 상담사B: 12 },
        avgSttLength: 200,
      },
      "3학년 평균": {
        count: 24,
        avgDuration: 175.9,
        totalDuration: 4221.6,
        minDuration: 52,
        maxDuration: 285,
        timeCategories: { 오전: 13, 오후: 11 },
        counselorIds: { 상담사B: 14, 상담사C: 10 },
        avgSttLength: 155,
      },
      // 4학년
      "4학년 상위자": {
        count: 18,
        avgDuration: 190.2,
        totalDuration: 3423.6,
        minDuration: 70,
        maxDuration: 330,
        timeCategories: { 오전: 10, 오후: 8 },
        counselorIds: { 상담사A: 11, 상담사C: 7 },
        avgSttLength: 180,
      },
      "4학년 하위자": {
        count: 29,
        avgDuration: 205.4,
        totalDuration: 5956.6,
        minDuration: 45,
        maxDuration: 390,
        timeCategories: { 오전: 17, 오후: 12 },
        counselorIds: { 상담사A: 18, 상담사B: 11 },
        avgSttLength: 210,
      },
      "4학년 평균": {
        count: 23,
        avgDuration: 180.6,
        totalDuration: 4153.8,
        minDuration: 55,
        maxDuration: 295,
        timeCategories: { 오전: 12, 오후: 11 },
        counselorIds: { 상담사B: 13, 상담사C: 10 },
        avgSttLength: 165,
      },
      // 5학년
      "5학년 상위자": {
        count: 16,
        avgDuration: 195.8,
        totalDuration: 3132.8,
        minDuration: 75,
        maxDuration: 340,
        timeCategories: { 오전: 9, 오후: 7 },
        counselorIds: { 상담사A: 10, 상담사C: 6 },
        avgSttLength: 190,
      },
      "5학년 하위자": {
        count: 27,
        avgDuration: 215.6,
        totalDuration: 5821.2,
        minDuration: 48,
        maxDuration: 410,
        timeCategories: { 오전: 16, 오후: 11 },
        counselorIds: { 상담사A: 17, 상담사B: 10 },
        avgSttLength: 220,
      },
      "5학년 평균": {
        count: 21,
        avgDuration: 185.4,
        totalDuration: 3893.4,
        minDuration: 58,
        maxDuration: 300,
        timeCategories: { 오전: 11, 오후: 10 },
        counselorIds: { 상담사B: 12, 상담사C: 9 },
        avgSttLength: 175,
      },
      // 6학년
      "6학년 상위자": {
        count: 14,
        avgDuration: 200.1,
        totalDuration: 2801.4,
        minDuration: 80,
        maxDuration: 350,
        timeCategories: { 오전: 8, 오후: 6 },
        counselorIds: { 상담사A: 9, 상담사C: 5 },
        avgSttLength: 200,
      },
      "6학년 하위자": {
        count: 25,
        avgDuration: 220.3,
        totalDuration: 5507.5,
        minDuration: 50,
        maxDuration: 420,
        timeCategories: { 오전: 15, 오후: 10 },
        counselorIds: { 상담사A: 16, 상담사B: 9 },
        avgSttLength: 230,
      },
      "6학년 평균": {
        count: 19,
        avgDuration: 190.7,
        totalDuration: 3623.3,
        minDuration: 60,
        maxDuration: 305,
        timeCategories: { 오전: 10, 오후: 9 },
        counselorIds: { 상담사B: 11, 상담사C: 8 },
        avgSttLength: 185,
      },
    },
    totalStats: {
      totalCounselings: 545,
      totalTime: 104000.0,
      avgTime: 190.8,
    },
    totalTimeCategories: {
      오전: 300,
      오후: 223,
    },
    totalCounselorIds: {
      상담사A: 250,
      상담사B: 200,
      상담사C: 73,
    },
  };

  const loadTestData = () => {
    setAnalysisData(testData);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          📊 교사구분별 상담기록 분석 시스템
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          gutterBottom
        >
          엑셀 파일을 업로드하여 교사구분별 상담기록을 분석해보세요
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary">
          대용량 파일도 안전하게 처리됩니다
        </Typography>
      </Paper>

      <Box sx={{ marginBottom: 3 }}>
        <FileUpload onFileUpload={handleFileUpload} />
      </Box>

      {/* 테스트용 버튼 */}
      <Box sx={{ textAlign: "center", marginBottom: 3 }}>
        <button
          onClick={loadTestData}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          테스트 데이터 로드
        </button>
      </Box>

      {analysisData && <AnalysisResults data={analysisData} />}
    </Box>
  );
};

export default Analysis;
