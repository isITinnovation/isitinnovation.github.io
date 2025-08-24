import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Box, Typography, Button, LinearProgress, Paper } from "@mui/material";
import "./FileUpload.css";

interface FileUploadProps {
  onFileUpload: (data: any) => void;
}

interface ProgressState {
  isProcessing: boolean;
  progress: number;
  progressMessage: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progressState, setProgressState] = useState<ProgressState>({
    isProcessing: false,
    progress: 0,
    progressMessage: "",
  });

  const processFileInChunks = async (file: File) => {
    setProgressState({
      isProcessing: true,
      progress: 0,
      progressMessage: "파일을 읽는 중...",
    });

    try {
      const fileData = await readFileAsArrayBuffer(file);
      const workbook = XLSX.read(fileData, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // 시트 범위 가져오기
      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
      const totalRows = range.e.r + 1;
      const totalCols = range.e.c + 1;

      setProgressState((prev) => ({
        ...prev,
        progressMessage: `총 ${totalRows.toLocaleString()}행 분석 시작...`,
      }));

      // 헤더 정보 가져오기
      const headers: string[] = [];
      for (let col = 0; col < totalCols; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        const cell = worksheet[cellAddress];
        headers.push(cell ? cell.v : `Column${col + 1}`);
      }

      // 통계 객체 초기화
      const stats = {
        teacherStats: {} as Record<string, any>,
        totalStats: { totalCounselings: 0, totalTime: 0, avgTime: 0 },
        totalTimeCategories: {} as Record<string, number>,
        totalCounselorIds: {} as Record<string, number>,
      };

      // 더 작은 청크로 처리 (메모리 효율성)
      const CHUNK_SIZE = 1000;
      let processedRows = 0;

      for (let row = 1; row <= totalRows; row += CHUNK_SIZE) {
        const endRow = Math.min(row + CHUNK_SIZE - 1, totalRows);

        // 현재 청크 처리
        await processChunk(worksheet, headers, row, endRow, stats);

        processedRows = endRow;
        const progress = processedRows / totalRows;
        setProgressState((prev) => ({
          ...prev,
          progress,
          progressMessage: `${processedRows.toLocaleString()} / ${totalRows.toLocaleString()} 행 처리 중...`,
        }));

        // 메모리 해제를 위한 지연
        if (row % (CHUNK_SIZE * 5) === 0) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // 최종 통계 계산
      calculateFinalStats(stats);

      setProgressState((prev) => ({
        ...prev,
        progress: 1,
        progressMessage: "분석 완료!",
      }));

      // 결과 전송
      onFileUpload(stats);
      setProgressState({
        isProcessing: false,
        progress: 0,
        progressMessage: "",
      });
    } catch (error) {
      console.error("파일 처리 중 오류 발생:", error);
      alert(
        `파일 처리 중 오류가 발생했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
      setProgressState({
        isProcessing: false,
        progress: 0,
        progressMessage: "",
      });
    }
  };

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const processChunk = async (
    worksheet: XLSX.WorkSheet,
    headers: string[],
    startRow: number,
    endRow: number,
    stats: any
  ) => {
    for (let row = startRow; row <= endRow; row++) {
      const rowData: Record<string, any> = {};
      let hasData = false;

      // 행 데이터 읽기
      for (let col = 0; col < headers.length; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = worksheet[cellAddress];
        const value = cell ? cell.v : "";

        if (value !== "" && value !== null && value !== undefined) {
          hasData = true;
        }

        rowData[headers[col]] = value;
      }

      if (hasData) {
        // 통계 계산
        updateStats(rowData, stats);
        stats.totalStats.totalCounselings++;
      }
    }
  };

  const updateStats = (rowData: Record<string, any>, stats: any) => {
    const teacherType = rowData["교사 구분"] || rowData["교사구분"] || "미분류";
    const counselorId = rowData["상담사ID"] || rowData["상담사 ID"] || "미분류";
    const callDuration =
      parseFloat(rowData["통화길이(초)"]) ||
      parseFloat(rowData["통화길이"]) ||
      0;
    const timeCategory =
      rowData["상담시간구분"] || rowData["상담시간 구분"] || "미분류";
    const sttText =
      rowData["STT 텍스트"] || rowData["STT텍스트"] || rowData["STT"] || "";

    // 교사구분별 통계
    if (!stats.teacherStats[teacherType]) {
      stats.teacherStats[teacherType] = {
        count: 0,
        totalDuration: 0,
        durations: [],
        timeCategories: {},
        counselorIds: {},
        sttLengths: [],
      };
    }

    stats.teacherStats[teacherType].count++;
    if (callDuration > 0) {
      stats.teacherStats[teacherType].totalDuration += callDuration;
      // 메모리 효율성을 위해 배열 크기 제한
      if (stats.teacherStats[teacherType].durations.length < 5000) {
        stats.teacherStats[teacherType].durations.push(callDuration);
      }
    }

    // 상담시간구분별 통계
    if (!stats.teacherStats[teacherType].timeCategories[timeCategory]) {
      stats.teacherStats[teacherType].timeCategories[timeCategory] = 0;
    }
    stats.teacherStats[teacherType].timeCategories[timeCategory]++;

    // 상담사ID별 통계
    if (!stats.teacherStats[teacherType].counselorIds[counselorId]) {
      stats.teacherStats[teacherType].counselorIds[counselorId] = 0;
    }
    stats.teacherStats[teacherType].counselorIds[counselorId]++;

    // STT 텍스트 길이 통계
    if (sttText && sttText.length > 0) {
      if (stats.teacherStats[teacherType].sttLengths.length < 5000) {
        stats.teacherStats[teacherType].sttLengths.push(sttText.length);
      }
    }

    // 전체 통계
    stats.totalStats.totalTime += callDuration;

    if (!stats.totalTimeCategories[timeCategory]) {
      stats.totalTimeCategories[timeCategory] = 0;
    }
    stats.totalTimeCategories[timeCategory]++;

    if (!stats.totalCounselorIds[counselorId]) {
      stats.totalCounselorIds[counselorId] = 0;
    }
    stats.totalCounselorIds[counselorId]++;
  };

  const calculateFinalStats = (stats: any) => {
    // 교사구분별 상세 통계 계산
    Object.keys(stats.teacherStats).forEach((teacherType) => {
      const teacherData = stats.teacherStats[teacherType];
      const durations = teacherData.durations;

      if (durations.length > 0) {
        // 메모리 효율적인 통계 계산
        let sum = 0;
        let min = Infinity;
        let max = -Infinity;

        durations.forEach((duration: number) => {
          sum += duration;
          if (duration < min) min = duration;
          if (duration > max) max = duration;
        });

        const avgDuration = sum / durations.length;

        stats.teacherStats[teacherType] = {
          count: teacherData.count,
          avgDuration: Math.round(avgDuration * 100) / 100,
          totalDuration: Math.round(teacherData.totalDuration * 100) / 100,
          minDuration: Math.round(min * 100) / 100,
          maxDuration: Math.round(max * 100) / 100,
          timeCategories: teacherData.timeCategories,
          counselorIds: teacherData.counselorIds,
          avgSttLength:
            teacherData.sttLengths.length > 0
              ? Math.round(
                  teacherData.sttLengths.reduce(
                    (a: number, b: number) => a + b,
                    0
                  ) / teacherData.sttLengths.length
                )
              : 0,
        };

        // 메모리 해제
        durations.length = 0;
        teacherData.sttLengths.length = 0;
      } else {
        stats.teacherStats[teacherType] = {
          count: teacherData.count,
          avgDuration: 0,
          totalDuration: 0,
          minDuration: 0,
          maxDuration: 0,
          timeCategories: teacherData.timeCategories,
          counselorIds: teacherData.counselorIds,
          avgSttLength: 0,
        };
      }
    });

    // 전체 통계 계산
    stats.totalStats.avgTime =
      stats.totalStats.totalCounselings > 0
        ? Math.round(
            (stats.totalStats.totalTime / stats.totalStats.totalCounselings) *
              100
          ) / 100
        : 0;
    stats.totalStats.totalTime =
      Math.round(stats.totalStats.totalTime * 100) / 100;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (150MB 제한)
    const maxSize = 150 * 1024 * 1024; // 150MB
    if (file.size > maxSize) {
      alert(
        `파일이 너무 큽니다. 최대 ${Math.round(
          maxSize / (1024 * 1024)
        )}MB까지 지원됩니다.`
      );
      return;
    }

    // 파일 형식 체크
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      alert("엑셀 파일만 업로드 가능합니다 (.xlsx, .xls)");
      return;
    }

    processFileInChunks(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];

      // 파일 크기 체크 (150MB 제한)
      const maxSize = 150 * 1024 * 1024; // 150MB
      if (file.size > maxSize) {
        alert(
          `파일이 너무 큽니다. 최대 ${Math.round(
            maxSize / (1024 * 1024)
          )}MB까지 지원됩니다.`
        );
        return;
      }

      // 파일 형식 체크
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        alert("엑셀 파일만 업로드 가능합니다 (.xlsx, .xls)");
        return;
      }

      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
      processFileInChunks(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const cancelProcessing = () => {
    setProgressState({
      isProcessing: false,
      progress: 0,
      progressMessage: "",
    });
  };

  return (
    <Paper elevation={2} sx={{ padding: 3 }}>
      {!progressState.isProcessing ? (
        <Box
          className="file-upload-area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{
            border: "2px dashed #ccc",
            borderRadius: 2,
            padding: 4,
            textAlign: "center",
            cursor: "pointer",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "action.hover",
            },
          }}
        >
          <Typography variant="h2" sx={{ fontSize: "3rem", marginBottom: 2 }}>
            📊
          </Typography>
          <Typography variant="h5" gutterBottom>
            엑셀 파일을 업로드하세요
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            드래그 앤 드롭으로 파일을 올리거나 클릭하여 선택하세요
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            지원 형식: .xlsx, .xls
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            최대 파일 크기: 150MB
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            대용량 파일도 안전하게 처리됩니다
          </Typography>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-input"
          />

          <Button
            variant="contained"
            component="label"
            htmlFor="file-input"
            sx={{ marginTop: 2 }}
          >
            파일 선택
          </Button>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h2" sx={{ fontSize: "3rem", marginBottom: 2 }}>
            ⏳
          </Typography>
          <Typography variant="h5" gutterBottom>
            파일을 분석하고 있습니다...
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {progressState.progressMessage}
          </Typography>

          <Box sx={{ width: "100%", marginY: 3 }}>
            <LinearProgress
              variant="determinate"
              value={progressState.progress * 100}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" sx={{ marginTop: 1 }}>
              {Math.round(progressState.progress * 100)}%
            </Typography>
          </Box>

          <Button variant="outlined" color="error" onClick={cancelProcessing}>
            취소
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default FileUpload;
