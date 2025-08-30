import React, { useState } from "react";
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
} from "@mui/material";
import { Phone, Share, Favorite, Sms } from "@mui/icons-material";

import "./WeddingInvitation.css";

interface WeddingInvitationProps {
  // 필요한 props가 있다면 여기에 추가
}

const WeddingInvitation: React.FC<WeddingInvitationProps> = () => {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  // URL 파라미터 확인
  const urlParams = new URLSearchParams(window.location.search);
  const isAutumnTheme = urlParams.get("autumn") === "true";

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
        {isAutumnTheme ? (
          <>
            {/* 가을 풍경 배경 이미지 */}
            <div className="autumn-background">
              <img
                src="/images/autume.png"
                alt="가을 풍경"
                className="autumn-image"
              />
              <div className="autumn-overlay"></div>

              <div className="leaf"></div>
              <div className="leaf"></div>
              <div className="leaf"></div>
              <div className="leaf"></div>
            </div>
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
            <Typography
              variant="h6"
              className="location-text"
              style={{ fontFamily: "'Batang', 'Noto Serif KR', serif" }}
            >
              엠비씨컨벤션 진주
            </Typography>
          </>
        ) : (
          <>
            {/* 웨딩 배경 이미지 */}
            <div className="wedding-background">
              <img
                src="/images/weddings.png"
                alt="웨딩"
                className="wedding-image"
              />
            </div>
          </>
        )}
      </Box>
      <div className="greeting-section" data-aos="fade-up" data-aos-delay="10">
        <Typography
          variant="h4"
          className="greeting-title"
          style={{
            fontFamily: "'IropkeBatang', 'Batang', 'Noto Serif KR', serif",
            color: "#d4a574",
            textAlign: "center",
            marginBottom: "2rem",
            fontWeight: 300,
          }}
        >
          소중한 분들을 초대합니다.
        </Typography>
        <Typography
          variant="body1"
          className="greeting-content"
          style={{
            fontFamily: "'IropkeBatang', 'Batang', 'Noto Serif KR', serif",
            textAlign: "center",
            lineHeight: 1.8,
            color: "#666",
            whiteSpace: "pre-line",
          }}
        >
          {`두 사람이 만든 인연이,
하나의 매듭으로 새로운 길이 되어
하나뿐인 보금자리를 이루려 합니다.

그동안 변함없는 마음으로
아껴주신 마음 그대로
기쁨 가득한 날 오셔서
축복해 주시면 감사하겠습니다.`}
        </Typography>
      </div>

      {/* 부모님 정보 섹션 */}
      <div className="parents-section" data-aos="fade-up" data-aos-delay="100">
        <div className="parent-info" data-aos="fade-up" data-aos-delay="150">
          <Typography variant="body2" className="parent-text">
            황경태 · 최경미의 아들 인성
          </Typography>
          <Phone className="phone-icon" />
        </div>
        <div className="parent-info" data-aos="fade-up" data-aos-delay="200">
          <Typography variant="body2" className="parent-text">
            윤지생 · 김정현의 &nbsp;&nbsp;&nbsp;딸 영채
          </Typography>
          <Phone className="phone-icon" />
        </div>
        <Button
          variant="outlined"
          className="contact-parents-button"
          onClick={() => setIsContactDialogOpen(true)}
          data-aos="fade-up"
          data-aos-delay="250"
          style={{
            marginTop: "12px",
            border: "1px solid #d4a574",
            backgroundColor: "white",
            fontFamily: "'IropkeBatang', 'Batang', 'Noto Serif KR', serif",
            fontSize: "0.75rem",
            fontWeight: 300,
            borderRadius: "6px",
            padding: "8px 16px",
            textTransform: "none",
            boxShadow: "0 2px 8px rgba(212, 165, 116, 0.3)",
            display: "block",
            margin: "12px auto 0 auto",
            width: "60%",
            maxWidth: "180px",
            transform: "translateY(-1px)",
          }}
          sx={{
            color: "#d4a574 !important",
            fontWeight: 300,
            borderColor: "#d4a574 !important",
            "&:hover": {
              backgroundColor: "#fefefe",
              borderColor: "#d4a574 !important",
              color: "#d4a574 !important",
              boxShadow: "0 4px 12px rgba(212, 165, 116, 0.4)",
              transform: "translateY(-2px)",
            },
          }}
        >
          혼주에게 연락하기
        </Button>
      </div>

      {/* 달력 섹션 */}
      <div className="calendar-section" data-aos="fade-up" data-aos-delay="300">
        <Typography
          variant="h6"
          className="calendar-title"
          style={{
            fontFamily: "'IropkeBatang', 'Batang', 'Noto Serif KR', serif",
            textAlign: "center",
            color: "#d4a574",
            marginBottom: "1rem",
            fontSize: "1.2rem",
            fontWeight: 300,
          }}
        >
          우리의
        </Typography>
        <Typography
          variant="h5"
          className="calendar-subtitle"
          style={{
            fontFamily: "'IropkeBatang', 'Batang', 'Noto Serif KR', serif",
            textAlign: "center",
            color: "#d4a574",
            marginBottom: "1.5rem",
            fontSize: "1.4rem",
            fontWeight: 300,
          }}
        >
          스물일곱 번째 날
        </Typography>

        <div className="calendar-container">
          <div className="calendar-header">
            <div className="weekday">일</div>
            <div className="weekday">월</div>
            <div className="weekday">화</div>
            <div className="weekday">수</div>
            <div className="weekday">목</div>
            <div className="weekday">금</div>
            <div className="weekday">토</div>
          </div>
          <div className="calendar-body">
            {/* 첫 번째 주: 11월 1일은 토요일 */}
            <div className="calendar-day empty"></div>
            <div className="calendar-day empty"></div>
            <div className="calendar-day empty"></div>
            <div className="calendar-day empty"></div>
            <div className="calendar-day empty"></div>
            <div className="calendar-day empty"></div>
            <div className="calendar-day">1</div>

            {/* 두 번째 주 */}
            <div className="calendar-day">2</div>
            <div className="calendar-day">3</div>
            <div className="calendar-day">4</div>
            <div className="calendar-day">5</div>
            <div className="calendar-day">6</div>
            <div className="calendar-day">7</div>
            <div className="calendar-day">8</div>

            {/* 세 번째 주 */}
            <div className="calendar-day">9</div>
            <div className="calendar-day">10</div>
            <div className="calendar-day">11</div>
            <div className="calendar-day">12</div>
            <div className="calendar-day">13</div>
            <div className="calendar-day">14</div>
            <div className="calendar-day">15</div>

            {/* 네 번째 주 */}
            <div className="calendar-day">16</div>
            <div className="calendar-day">17</div>
            <div className="calendar-day">18</div>
            <div className="calendar-day">19</div>
            <div className="calendar-day">20</div>
            <div className="calendar-day">21</div>
            <div className="calendar-day wedding-day">
              22
              <span className="wedding-day-text">오후 4시</span>
            </div>

            {/* 다섯 번째 주 */}
            <div className="calendar-day">23</div>
            <div className="calendar-day">24</div>
            <div className="calendar-day">25</div>
            <div className="calendar-day">26</div>
            <div className="calendar-day">27</div>
            <div className="calendar-day">28</div>
            <div className="calendar-day">29</div>

            {/* 여섯 번째 주 */}
            <div className="calendar-day">30</div>
            <div className="calendar-day empty"></div>
            <div className="calendar-day empty"></div>
            <div className="calendar-day empty"></div>
            <div className="calendar-day empty"></div>
            <div className="calendar-day empty"></div>
            <div className="calendar-day empty"></div>
          </div>
        </div>
      </div>

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
            <Sms className="contact-icon" />
            <Box>
              <Typography variant="body1" className="contact-label">
                문자
              </Typography>
              <Typography variant="body2" className="contact-value">
                010-1234-5678
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

      {/* 혼주 연락처 다이얼로그 */}
      <Dialog
        open={isContactDialogOpen}
        onClose={() => setIsContactDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          style: {
            borderRadius: "16px",
            padding: "8px",
          },
        }}
      >
        <DialogTitle
          style={{
            textAlign: "center",
            fontFamily: "'IropkeBatang', 'Batang', 'Noto Serif KR', serif",
            fontSize: "1.1rem",
            fontWeight: 500,
            paddingBottom: "8px",
          }}
        >
          혼주에게 연락하기
          <Button
            onClick={() => setIsContactDialogOpen(false)}
            style={{
              position: "absolute",
              right: "8px",
              top: "8px",
              minWidth: "auto",
              padding: "4px",
            }}
          >
            ✕
          </Button>
        </DialogTitle>
        <DialogContent style={{ paddingTop: "8px", paddingBottom: "16px" }}>
          <Box className="parents-contact-dialog">
            {/* 신랑측 */}
            <Box className="contact-section">
              <Typography
                variant="h6"
                style={{
                  textAlign: "center",
                  fontFamily:
                    "'IropkeBatang', 'Batang', 'Noto Serif KR', serif",
                  fontSize: "1rem",
                  marginBottom: "12px",
                  color: "#8B4513",
                }}
              >
                신랑측
              </Typography>
              <Box className="contact-person">
                <Typography variant="body2" className="contact-name">
                  아버지 황경태
                </Typography>
                <Box className="contact-buttons">
                  <Button
                    size="small"
                    startIcon={<Phone />}
                    onClick={() => window.open("tel:010-3552-8644")}
                  ></Button>
                  <Button
                    size="small"
                    startIcon={<Sms />}
                    onClick={() => window.open("sms:010-3552-8644")}
                  ></Button>
                </Box>
              </Box>
              <Box className="contact-person">
                <Typography variant="body2" className="contact-name">
                  어머니 최경미
                </Typography>
                <Box className="contact-buttons">
                  <Button
                    size="small"
                    startIcon={<Phone />}
                    onClick={() => window.open("tel:010-2547-8644")}
                  ></Button>
                  <Button
                    size="small"
                    startIcon={<Sms />}
                    onClick={() => window.open("sms:010-2547-8644")}
                  ></Button>
                </Box>
              </Box>
            </Box>

            <Divider style={{ margin: "16px 0" }} />

            {/* 신부측 */}
            <Box className="contact-section">
              <Typography
                variant="h6"
                style={{
                  textAlign: "center",
                  fontFamily:
                    "'IropkeBatang', 'Batang', 'Noto Serif KR', serif",
                  fontSize: "1rem",
                  marginBottom: "12px",
                  color: "#8B4513",
                }}
              >
                신부측
              </Typography>
              <Box className="contact-person">
                <Typography variant="body2" className="contact-name">
                  아버지 윤**
                </Typography>
                <Box className="contact-buttons">
                  <Button
                    size="small"
                    startIcon={<Phone />}
                    onClick={() => window.open("tel:010-3333-3333")}
                  ></Button>
                  <Button
                    size="small"
                    startIcon={<Sms />}
                    onClick={() => window.open("sms:010-3333-3333")}
                  ></Button>
                </Box>
              </Box>
              <Box className="contact-person">
                <Typography variant="body2" className="contact-name">
                  어머니 김정현
                </Typography>
                <Box className="contact-buttons">
                  <Button
                    size="small"
                    startIcon={<Phone />}
                    onClick={() => window.open("tel:010-3364-6457")}
                  ></Button>
                  <Button
                    size="small"
                    startIcon={<Sms />}
                    onClick={() => window.open("sms:010-3364-6457")}
                  ></Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default WeddingInvitation;
