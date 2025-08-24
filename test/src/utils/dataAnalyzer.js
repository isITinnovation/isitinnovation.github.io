export const analyzeCounselingData = async (data, onProgress) => {
  if (!data || data.length === 0) {
    throw new Error("분석할 데이터가 없습니다.");
  }

  const totalRows = data.length;
  const CHUNK_SIZE = 1000; // 한 번에 처리할 행 수

  // 교사구분별 통계
  const teacherStats = {};
  const teacherCounselingCounts = {};
  const teacherCounselingTimes = {};
  const teacherRecordingTypes = {};
  const teacherCallerPredictions = {};

  // 청크 단위로 데이터 처리
  for (let i = 0; i < totalRows; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);

    chunk.forEach((row) => {
      const teacherType = row["교사 구분"] || "미분류";
      const counselingTime = parseFloat(row["상담시간"]) || 0;
      const recordingType = row["녹취구분"] || "미분류";
      const callerPrediction = row["통화자 예측"] || "미분류";

      // 교사구분별 상담 건수
      if (!teacherCounselingCounts[teacherType]) {
        teacherCounselingCounts[teacherType] = 0;
      }
      teacherCounselingCounts[teacherType]++;

      // 교사구분별 상담시간
      if (!teacherCounselingTimes[teacherType]) {
        teacherCounselingTimes[teacherType] = [];
      }
      if (counselingTime > 0) {
        teacherCounselingTimes[teacherType].push(counselingTime);
      }

      // 교사구분별 녹취구분
      if (!teacherRecordingTypes[teacherType]) {
        teacherRecordingTypes[teacherType] = {};
      }
      if (!teacherRecordingTypes[teacherType][recordingType]) {
        teacherRecordingTypes[teacherType][recordingType] = 0;
      }
      teacherRecordingTypes[teacherType][recordingType]++;

      // 교사구분별 통화자 예측
      if (!teacherCallerPredictions[teacherType]) {
        teacherCallerPredictions[teacherType] = {};
      }
      if (!teacherCallerPredictions[teacherType][callerPrediction]) {
        teacherCallerPredictions[teacherType][callerPrediction] = 0;
      }
      teacherCallerPredictions[teacherType][callerPrediction]++;
    });

    // 진행률 업데이트
    if (onProgress) {
      const progress = Math.min((i + CHUNK_SIZE) / totalRows, 1);
      onProgress(progress);
    }

    // 메모리 해제를 위한 짧은 지연
    if (i % (CHUNK_SIZE * 5) === 0) {
      // 가비지 컬렉션을 위한 짧은 지연
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
  }

  // 교사구분별 상세 통계 계산
  Object.keys(teacherCounselingCounts).forEach((teacherType) => {
    const count = teacherCounselingCounts[teacherType];
    const times = teacherCounselingTimes[teacherType] || [];

    // 메모리 효율적인 통계 계산
    let sum = 0;
    let min = Infinity;
    let max = -Infinity;

    times.forEach((time) => {
      sum += time;
      if (time < min) min = time;
      if (time > max) max = time;
    });

    const avgTime = times.length > 0 ? sum / times.length : 0;

    teacherStats[teacherType] = {
      count,
      avgTime: Math.round(avgTime * 100) / 100,
      totalTime: Math.round(sum * 100) / 100,
      minTime: min === Infinity ? 0 : Math.round(min * 100) / 100,
      maxTime: max === -Infinity ? 0 : Math.round(max * 100) / 100,
      recordingTypes: teacherRecordingTypes[teacherType] || {},
      callerPredictions: teacherCallerPredictions[teacherType] || {},
    };
  });

  // 전체 통계 (메모리 효율적으로 계산)
  const totalCounselings = totalRows;
  let totalTime = 0;

  for (let i = 0; i < totalRows; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    chunk.forEach((row) => {
      totalTime += parseFloat(row["상담시간"]) || 0;
    });
  }

  const avgTime = totalCounselings > 0 ? totalTime / totalCounselings : 0;

  // 녹취구분별 전체 통계
  const totalRecordingTypes = {};
  for (let i = 0; i < totalRows; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    chunk.forEach((row) => {
      const type = row["녹취구분"] || "미분류";
      totalRecordingTypes[type] = (totalRecordingTypes[type] || 0) + 1;
    });
  }

  // 통화자 예측별 전체 통계
  const totalCallerPredictions = {};
  for (let i = 0; i < totalRows; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    chunk.forEach((row) => {
      const prediction = row["통화자 예측"] || "미분류";
      totalCallerPredictions[prediction] =
        (totalCallerPredictions[prediction] || 0) + 1;
    });
  }

  return {
    teacherStats,
    totalStats: {
      totalCounselings,
      totalTime: Math.round(totalTime * 100) / 100,
      avgTime: Math.round(avgTime * 100) / 100,
    },
    totalRecordingTypes,
    totalCallerPredictions,
    rawData: null, // 메모리 절약을 위해 원본 데이터는 반환하지 않음
  };
};
