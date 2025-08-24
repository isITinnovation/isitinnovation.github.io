import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import "./FileUpload.css";

const FileUpload = ({ onFileUpload }) => {
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");

  const processFileInChunks = async (file) => {
    setIsProcessing(true);
    setProgress(0);
    setProgressMessage("파일을 읽는 중...");

    try {
      const fileData = await readFileAsArrayBuffer(file);
      const workbook = XLSX.read(fileData, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // 시트 범위 가져오기
      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      const totalRows = range.e.r + 1;
      const totalCols = range.e.c + 1;

      setProgressMessage(`총 ${totalRows.toLocaleString()}행 분석 시작...`);

      // 헤더 정보 가져오기
      const headers = [];
      for (let col = 0; col < totalCols; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        const cell = worksheet[cellAddress];
        headers.push(cell ? cell.v : `Column${col + 1}`);
      }

      // 첫 번째 데이터 행 확인 (헤더 다음 행)
      if (totalRows > 1) {
        const firstDataRow = {};
        for (let col = 0; col < totalCols; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: 1, c: col });
          const cell = worksheet[cellAddress];
          firstDataRow[headers[col]] = cell ? cell.v : "";
        }
      }

      // 통계 객체 초기화
      const stats = {
        teacherStats: {},
        totalStats: { totalCounselings: 0, totalTime: 0 },
        totalTimeCategories: {},
        totalCounselorIds: {},
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
        setProgress(progress);
        setProgressMessage(
          `${processedRows.toLocaleString()} / ${totalRows.toLocaleString()} 행 처리 중...`
        );

        // 메모리 해제를 위한 지연
        if (row % (CHUNK_SIZE * 5) === 0) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // 최종 통계 계산
      calculateFinalStats(stats);

      setProgress(1);
      setProgressMessage("분석 완료!");

      // 결과 전송
      onFileUpload(stats);
      setIsProcessing(false);
    } catch (error) {
      console.error("파일 처리 중 오류 발생:", error);
      alert(`파일 처리 중 오류가 발생했습니다: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const processChunk = async (worksheet, headers, startRow, endRow, stats) => {
    for (let row = startRow; row <= endRow; row++) {
      const rowData = {};
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

  const updateStats = (rowData, stats) => {
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

  const calculateFinalStats = (stats) => {
    // 교사구분별 상세 통계 계산
    Object.keys(stats.teacherStats).forEach((teacherType) => {
      const teacherData = stats.teacherStats[teacherType];
      const durations = teacherData.durations;

      if (durations.length > 0) {
        // 메모리 효율적인 통계 계산
        let sum = 0;
        let min = Infinity;
        let max = -Infinity;

        durations.forEach((duration) => {
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
                  teacherData.sttLengths.reduce((a, b) => a + b, 0) /
                    teacherData.sttLengths.length
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
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

  const handleDrop = (event) => {
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

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      processFileInChunks(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const cancelProcessing = () => {
    setIsProcessing(false);
    setProgress(0);
    setProgressMessage("");
  };

  return (
    <div className="file-upload-container">
      {!isProcessing ? (
        <div
          className="file-upload-area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="upload-icon">📊</div>
          <h3>엑셀 파일을 업로드하세요</h3>
          <p>드래그 앤 드롭으로 파일을 올리거나 클릭하여 선택하세요</p>
          <p className="file-types">지원 형식: .xlsx, .xls</p>
          <p className="file-size-limit">최대 파일 크기: 150MB</p>
          <p className="file-info">대용량 파일도 안전하게 처리됩니다</p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="file-input"
            id="file-input"
          />

          <label htmlFor="file-input" className="upload-button">
            파일 선택
          </label>
        </div>
      ) : (
        <div className="processing-area">
          <div className="processing-icon">⏳</div>
          <h3>파일을 분석하고 있습니다...</h3>
          <p className="progress-message">{progressMessage}</p>

          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress * 100}%` }}
              ></div>
            </div>
            <p className="progress-text">{Math.round(progress * 100)}%</p>
          </div>

          <button className="cancel-button" onClick={cancelProcessing}>
            취소
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
