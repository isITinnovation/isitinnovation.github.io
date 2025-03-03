import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import "./SeoAnalyzer.css";

interface SeoAnalyzerProps {
  title: string;
  content: string;
  category: string;
}

interface SeoResult {
  score: number;
  suggestions: {
    text: string;
    type: "success" | "warning" | "error";
  }[];
}

const SeoAnalyzer: React.FC<SeoAnalyzerProps> = ({
  title,
  content,
  category,
}) => {
  const [seoResult, setSeoResult] = useState<SeoResult | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    analyzeSeo(title, content, category);
  }, [title, content, category]);

  const analyzeSeo = (title: string, content: string, category: string) => {
    // 단어 수 계산
    const wordCount = content
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    // 제목 길이 확인
    const titleLength = title.length;

    // 키워드 밀도 계산 (카테고리를 주요 키워드로 가정)
    const keywordRegex = new RegExp(category, "gi");
    const keywordMatches = content.match(keywordRegex) || [];
    const keywordDensity = (keywordMatches.length / wordCount) * 100;

    // 이미지 태그 확인 (간단한 예시)
    const hasImages = content.includes("<img") || content.includes("![");

    // 링크 확인
    const hasLinks =
      content.includes("<a") ||
      (content.includes("[") && content.includes("]("));

    // 단락 구분 확인
    const paragraphs = content
      .split(/\n\s*\n/)
      .filter((p) => p.trim().length > 0);

    // 결과 및 제안사항 생성
    const suggestions: {
      text: string;
      type: "success" | "warning" | "error";
    }[] = [];
    let score = 0;

    // 제목 길이 평가
    if (titleLength < 10) {
      suggestions.push({
        text: "제목이 너무 짧습니다. 10자 이상 작성하세요.",
        type: "error",
      });
    } else if (titleLength > 60) {
      suggestions.push({
        text: "제목이 너무 깁니다. 60자 이내로 작성하세요.",
        type: "warning",
      });
      score += 5;
    } else {
      suggestions.push({
        text: "제목 길이가 적절합니다.",
        type: "success",
      });
      score += 10;
    }

    // 내용 길이 평가
    if (wordCount < 300) {
      suggestions.push({
        text: `내용이 너무 짧습니다. 현재 ${wordCount}단어, 최소 300단어 이상 작성하세요.`,
        type: "warning",
      });
      score += 5;
    } else if (wordCount > 300 && wordCount < 600) {
      suggestions.push({
        text: `내용 길이가 적절합니다. 현재 ${wordCount}단어`,
        type: "success",
      });
      score += 15;
    } else {
      suggestions.push({
        text: `내용이 충분히 깁니다. 현재 ${wordCount}단어`,
        type: "success",
      });
      score += 20;
    }

    // 키워드 밀도 평가
    if (keywordDensity < 0.5) {
      suggestions.push({
        text: `키워드 밀도가 너무 낮습니다. 현재 ${keywordDensity.toFixed(
          1
        )}%, 주요 키워드(${category})를 더 사용하세요.`,
        type: "warning",
      });
      score += 5;
    } else if (keywordDensity > 3) {
      suggestions.push({
        text: `키워드 밀도가 너무 높습니다. 현재 ${keywordDensity.toFixed(
          1
        )}%, 키워드 스터핑으로 간주될 수 있습니다.`,
        type: "warning",
      });
      score += 5;
    } else {
      suggestions.push({
        text: `키워드 밀도가 적절합니다. 현재 ${keywordDensity.toFixed(1)}%`,
        type: "success",
      });
      score += 15;
    }

    // 이미지 사용 평가
    if (!hasImages) {
      suggestions.push({
        text: "이미지가 없습니다. 시각적 콘텐츠를 추가하세요.",
        type: "warning",
      });
      score += 5;
    } else {
      suggestions.push({
        text: "이미지가 포함되어 있습니다.",
        type: "success",
      });
      score += 10;
    }

    // 링크 사용 평가
    if (!hasLinks) {
      suggestions.push({
        text: "내부/외부 링크가 없습니다. 관련 링크를 추가하세요.",
        type: "warning",
      });
      score += 5;
    } else {
      suggestions.push({
        text: "링크가 포함되어 있습니다.",
        type: "success",
      });
      score += 10;
    }

    // 단락 구분 평가
    if (paragraphs.length < 3) {
      suggestions.push({
        text: "단락 구분이 부족합니다. 내용을 여러 단락으로 나누세요.",
        type: "warning",
      });
      score += 5;
    } else {
      suggestions.push({
        text: "단락 구분이 잘 되어 있습니다.",
        type: "success",
      });
      score += 10;
    }

    // 최종 점수 계산 (100점 만점)
    score = Math.min(Math.round(score * 1.25), 100);

    setSeoResult({ score, suggestions });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  if (!seoResult) return null;

  return (
    <Paper className="seo-analyzer">
      <Accordion expanded={expanded} onChange={handleAccordionChange}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className="seo-analyzer-summary"
        >
          <Box className="seo-score-container">
            <Typography variant="subtitle1" fontWeight="bold">
              SEO 점수: {seoResult.score}/100
            </Typography>
            <LinearProgress
              variant="determinate"
              value={seoResult.score}
              color={
                getScoreColor(seoResult.score) as
                  | "success"
                  | "warning"
                  | "error"
              }
              className="seo-progress"
            />
            <Box className="seo-chip-container">
              {seoResult.score >= 80 && (
                <Chip label="우수" color="success" size="small" />
              )}
              {seoResult.score >= 50 && seoResult.score < 80 && (
                <Chip label="보통" color="warning" size="small" />
              )}
              {seoResult.score < 50 && (
                <Chip label="개선 필요" color="error" size="small" />
              )}
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            SEO 개선 제안사항:
          </Typography>
          <List dense>
            {seoResult.suggestions.map((suggestion, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {suggestion.type === "success" && (
                    <CheckCircleIcon color="success" />
                  )}
                  {suggestion.type === "warning" && (
                    <WarningIcon color="warning" />
                  )}
                  {suggestion.type === "error" && <ErrorIcon color="error" />}
                </ListItemIcon>
                <ListItemText primary={suggestion.text} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default SeoAnalyzer;
