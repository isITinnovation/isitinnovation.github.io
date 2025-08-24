import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./AnalysisResults.css";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const AnalysisResults = ({ data }) => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const { teacherStats, totalStats, totalTimeCategories, totalCounselorIds } =
    data;

  // 차트 데이터 준비 - useMemo로 최적화
  const teacherChartData = useMemo(() => {
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
        const typeOrder = { 상위자: 1, 하위자: 2, 평균: 3 };
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

  // 학년별 색깔 배열
  const gradeColors = [
    "#FF6B6B", // 0학년 - 빨간색
    "#4ECDC4", // 1학년 - 청록색
    "#45B7D1", // 2학년 - 파란색
    "#96CEB4", // 3학년 - 초록색
    "#FFEAA7", // 4학년 - 노란색
    "#DDA0DD", // 5학년 - 보라색
    "#FF9F43", // 6학년 - 주황색
  ];

  // 학년별로 그룹화
  const gradeGroups = {};
  Object.keys(teacherStats).forEach((teacherType) => {
    const grade = teacherType.split(" ")[0]; // "1학년", "2학년" 등
    if (!gradeGroups[grade]) {
      gradeGroups[grade] = [];
    }
    gradeGroups[grade].push(teacherType);
  });

  // 학년별 요약 통계
  const gradeSummary = {};
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

  const counselorChartData = Object.keys(totalCounselorIds || {}).map(
    (counselorId) => ({
      name: counselorId,
      value: totalCounselorIds[counselorId],
    })
  );

  const handleTeacherSelect = (teacherType) => {
    setSelectedTeacher(selectedTeacher === teacherType ? null : teacherType);
  };

  return (
    <div className="analysis-results">
      <div className="results-header">
        <h2>📊 교사구분별 상담기록 분석 결과</h2>
        <div className="total-summary">
          <div className="summary-card">
            <h3>총 상담 건수</h3>
            <p className="summary-number">
              {totalStats.totalCounselings.toLocaleString()}
            </p>
          </div>
          <div className="summary-card">
            <h3>총 상담시간</h3>
            <p className="summary-number">
              {Math.round(totalStats.totalTime / 60).toLocaleString()}분
            </p>
          </div>
          <div className="summary-card">
            <h3>평균 통화길이</h3>
            <p className="summary-number">
              {Math.round((totalStats.avgTime / 60) * 100) / 100}분
            </p>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>교사구분별 평균 통화길이</h3>
          <ResponsiveContainer width="100%" height={400}>
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
                {teacherChartData.map((entry, index) => {
                  const grade = parseInt(entry.grade);
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
        </div>

        <div className="charts-row">
          <div className="chart-container half">
            <h3>상담시간구분별 분포</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={timeCategoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {timeCategoryChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 학년별 요약 섹션 */}
      <div className="grade-summary-section">
        <h3>📚 학년별 요약 통계</h3>
        <div className="grade-cards">
          {Object.keys(gradeSummary)
            .sort()
            .map((grade) => (
              <div key={grade} className="grade-card">
                <h4>{grade}</h4>
                <div className="grade-stats">
                  <div className="stat-item">
                    <span className="stat-label">총 상담 건수:</span>
                    <span className="stat-value">
                      {gradeSummary[grade].totalCount}건
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">평균 통화길이:</span>
                    <span className="stat-value">
                      {Math.round(
                        (gradeSummary[grade].avgDuration / 60) * 100
                      ) / 100}
                      분
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">평균 STT 길이:</span>
                    <span className="stat-value">
                      {gradeSummary[grade].avgSttLength}자
                    </span>
                  </div>
                </div>
                <div className="grade-breakdown">
                  <h5>구분별 상담 건수:</h5>
                  <div className="breakdown-list">
                    {gradeSummary[grade].types.map((type) => (
                      <div key={type} className="breakdown-item">
                        <span>{type.split(" ")[1]}:</span>
                        <span>{teacherStats[type].count}건</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="teacher-details">
        <h3>교사구분별 상세 통계</h3>
        <div className="teacher-cards">
          {Object.keys(teacherStats).map((teacherType) => (
            <div
              key={teacherType}
              className={`teacher-card ${
                selectedTeacher === teacherType ? "selected" : ""
              }`}
              onClick={() => handleTeacherSelect(teacherType)}
            >
              <h4>{teacherType}</h4>
              <div className="teacher-stats">
                <div className="stat-item">
                  <span className="stat-label">상담 건수:</span>
                  <span className="stat-value">
                    {teacherStats[teacherType].count}건
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">평균 통화길이:</span>
                  <span className="stat-value">
                    {Math.round(
                      (teacherStats[teacherType].avgDuration / 60) * 100
                    ) / 100}
                    분
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">총 통화길이:</span>
                  <span className="stat-value">
                    {Math.round(teacherStats[teacherType].totalDuration / 60)}분
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">최소/최대 길이:</span>
                  <span className="stat-value">
                    {teacherStats[teacherType].minDuration}/
                    {teacherStats[teacherType].maxDuration}초
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">평균 STT 길이:</span>
                  <span className="stat-value">
                    {teacherStats[teacherType].avgSttLength}자
                  </span>
                </div>
              </div>

              {selectedTeacher === teacherType && (
                <div className="teacher-details-expanded">
                  <div className="detail-section">
                    <h5>상담시간구분별 분포</h5>
                    <div className="detail-list">
                      {Object.entries(
                        teacherStats[teacherType].timeCategories
                      ).map(([category, count]) => (
                        <div key={category} className="detail-item">
                          <span>{category}:</span>
                          <span>{count}건</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="detail-section">
                    <h5>상담사ID별 분포</h5>
                    <div className="detail-list">
                      {Object.entries(
                        teacherStats[teacherType].counselorIds
                      ).map(([counselorId, count]) => (
                        <div key={counselorId} className="detail-item">
                          <span>{counselorId}:</span>
                          <span>{count}건</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
