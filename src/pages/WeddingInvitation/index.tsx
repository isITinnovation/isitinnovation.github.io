import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { LocationOn, Phone, Email, Share, Favorite } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./WeddingInvitation.css";

interface WeddingInvitationProps {
  // 필요한 props가 있다면 여기에 추가
}

const WeddingInvitation: React.FC<WeddingInvitationProps> = () => {
  const navigate = useNavigate();
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "청첩장",
        text: "우리의 특별한 순간에 함께해주세요",
        url: window.location.href,
      });
    } else {
      // 공유 API를 지원하지 않는 경우 클립보드에 복사
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다.");
    }
  };

  const handleContactClick = () => {
    setIsContactDialogOpen(true);
  };

  const openNaverMap = () => {
    // 네이버맵으로 바로 이동
    window.open("https://map.naver.com/p/search/엠비씨컨벤션진주");
  };

  return (
    <Container maxWidth="sm" className="wedding-invitation">
      {/* 메인 헤더 섹션 */}
      <Box className="main-header">
        {/* 가을 풍경 배경 이미지 */}
        <div className="autumn-background">
          <img
            src="/src/static/image/autume.png"
            alt="가을 풍경"
            className="autumn-image"
          />
          <div className="autumn-overlay"></div>

          {/* 단풍잎 애니메이션 */}
          <div className="leaf"></div>
          <div className="leaf"></div>
          <div className="leaf"></div>
          <div className="leaf"></div>
        </div>

        {/* 신랑신부 이름 */}
        <Box className="names-container">
          <Typography
            variant="h4"
            className="groom-name"
            style={{ fontFamily: "'Slow', 'Noto Sans KR', sans-serif" }}
          >
            황인성
          </Typography>
          <Typography
            variant="h6"
            className="and-text"
            style={{ fontFamily: "'Batang', 'Noto Serif KR', serif" }}
          >
            AND
          </Typography>
          <Typography
            variant="h4"
            className="bride-name"
            style={{ fontFamily: "'Slow', 'Noto Sans KR', sans-serif" }}
          >
            윤영채
          </Typography>
        </Box>

        {/* 초대 문구 */}
        <Typography
          variant="h6"
          className="invitation-text"
          style={{ fontFamily: "'Batang', 'Noto Serif KR', serif" }}
        >
          우리 결혼합니다.
        </Typography>

        {/* 날짜 및 시간 정보 */}
        <Box className="date-time-section">
          <Box className="date-row">
            <Typography
              variant="body2"
              className="day-text"
              style={{ fontFamily: "'Batang', 'Noto Serif KR', serif" }}
            >
              &nbsp;&nbsp;&nbsp;토요일&nbsp;&nbsp;&nbsp;
            </Typography>
            <Box className="date-content">
              <Typography
                variant="body2"
                className="month-text"
                style={{ fontFamily: "'Batang', 'Noto Serif KR', serif" }}
              >
                11월
              </Typography>
              <Typography
                variant="h3"
                className="day-number"
                style={{ fontFamily: "'Batang', 'Noto Serif KR', serif" }}
              >
                22
              </Typography>
              <Typography
                variant="body2"
                className="year-text"
                style={{ fontFamily: "'Batang', 'Noto Serif KR', serif" }}
              >
                2025
              </Typography>
            </Box>
            <Typography
              variant="body2"
              className="time-text"
              style={{ fontFamily: "'Batang', 'Noto Serif KR', serif" }}
            >
              오후 2시 40분
            </Typography>
          </Box>
        </Box>

        {/* 장소 정보 */}
        <Typography
          variant="h6"
          className="location-text"
          style={{ fontFamily: "'Batang', 'Noto Serif KR', serif" }}
        >
          엠비씨컨벤션 진주
        </Typography>
      </Box>

      {/* 상세 정보 카드 */}
      <Card className="details-card">
        <CardContent>
          <Typography variant="h6" className="section-title">
            예식 정보
          </Typography>
          <Box className="info-item">
            <Box className="info-content">
              <Typography variant="body1" className="info-label">
                날짜 및 시간
              </Typography>
              <Typography variant="body2" className="info-value">
                2025년 11월 22일 (토) 오후 4시
              </Typography>
            </Box>
          </Box>
          <Box className="info-item">
            <Box className="info-content">
              <Typography variant="body1" className="info-label">
                장소
              </Typography>
              <Typography variant="body2" className="info-value">
                엠비씨컨벤션 진주 (경상남도 진주시 동진로 415)
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 지도 카드 */}
      <Card className="map-card">
        <CardContent>
          <Typography variant="h6" className="section-title">
            위치 안내
          </Typography>
          <Box className="map-container">
            <iframe
              src="https://map.naver.com/p/embed/place/엠비씨컨벤션진주"
              width="100%"
              height="300"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              title="엠비씨컨벤션 진주 위치"
              className="naver-map-iframe"
            />
            <Button
              variant="contained"
              fullWidth
              onClick={openNaverMap}
              className="naver-map-button"
              style={{ marginTop: "16px" }}
            >
              네이버지도에서 보기
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 신랑신부 정보 카드 */}
      <Card className="couple-card">
        <CardContent>
          <Typography variant="h6" className="section-title">
            신랑 & 신부
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Box className="person-info">
                <div className="person-avatar groom-avatar">
                  <Favorite className="avatar-icon" />
                </div>
                <Typography variant="h6" className="person-name">
                  황인성
                </Typography>
                <Typography variant="body2" className="person-detail">
                  황인성의 아버지 황○○
                  <br />
                  황인성의 어머니 ○○
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className="person-info">
                <div className="person-avatar bride-avatar">
                  <Favorite className="avatar-icon" />
                </div>
                <Typography variant="h6" className="person-name">
                  윤영채
                </Typography>
                <Typography variant="body2" className="person-detail">
                  윤영채의 아버지 윤○○
                  <br />
                  윤영채의 어머니 ○○
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 연락처 카드 */}
      <Card className="contact-card">
        <CardContent>
          <Typography variant="h6" className="section-title">
            연락처
          </Typography>
          <Box className="contact-item">
            <Phone className="contact-icon" />
            <Box>
              <Typography variant="body1" className="contact-label">
                신랑
              </Typography>
              <Typography variant="body2" className="contact-value">
                010-1234-5678
              </Typography>
            </Box>
          </Box>
          <Box className="contact-item">
            <Phone className="contact-icon" />
            <Box>
              <Typography variant="body1" className="contact-label">
                신부
              </Typography>
              <Typography variant="body2" className="contact-value">
                010-8765-4321
              </Typography>
            </Box>
          </Box>
          <Box className="contact-item">
            <Email className="contact-icon" />
            <Box>
              <Typography variant="body1" className="contact-label">
                이메일
              </Typography>
              <Typography variant="body2" className="contact-value">
                wedding@example.com
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 액션 버튼들 */}
      <Box className="action-buttons">
        <Button
          variant="contained"
          fullWidth
          className="primary-button"
          onClick={handleContactClick}
        >
          연락하기
        </Button>
        <Button
          variant="outlined"
          fullWidth
          className="secondary-button"
          onClick={handleShare}
          startIcon={<Share />}
        >
          공유하기
        </Button>
      </Box>

      {/* 연락처 다이얼로그 */}
      <Dialog
        open={isContactDialogOpen}
        onClose={() => setIsContactDialogOpen(false)}
      >
        <DialogTitle>연락처</DialogTitle>
        <DialogContent>
          <Box className="contact-dialog-content">
            <Box className="contact-dialog-item">
              <Typography variant="h6">신랑 황인성</Typography>
              <Typography variant="body2">010-1234-5678</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => window.open("tel:010-1234-5678")}
              >
                전화하기
              </Button>
            </Box>
            <Divider />
            <Box className="contact-dialog-item">
              <Typography variant="h6">신부 윤영채</Typography>
              <Typography variant="body2">010-8765-4321</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => window.open("tel:010-8765-4321")}
              >
                전화하기
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsContactDialogOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WeddingInvitation;
