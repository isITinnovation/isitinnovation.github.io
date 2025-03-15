import { Grid } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  StyledContainer,
  HeaderPaper,
  HeaderContent,
  Title,
  Subtitle,
  SectionPaper,
  SectionHeader,
  SectionIcon,
  SectionTitle,
  StyledDivider,
  Paragraph,
  ContentGrid,
  ContentItem,
  ContentIconBox,
  ContentTitle,
  ContentDesc,
  Footer,
  FooterText,
} from "./styles";

const About = () => {
  return (
    <StyledContainer maxWidth="lg">
      {/* 헤더 섹션 */}
      <HeaderPaper>
        <HeaderContent>
          <Title variant="h3">isIT Innovation 소개</Title>
          <Subtitle variant="subtitle1">
            최신 트렌드와 주식 정보의 모든 것
          </Subtitle>
        </HeaderContent>
      </HeaderPaper>

      {/* 소개 섹션 */}
      <SectionPaper>
        <SectionHeader>
          <SectionIcon>
            <InfoIcon />
          </SectionIcon>
          <SectionTitle variant="h5">블로그 소개</SectionTitle>
        </SectionHeader>
        <StyledDivider />
        <Paragraph variant="body1">
          isIT Innovation은 최근 인기 있는 정보와 작성자가 좋아하는 주식에 대한
          정보를 공유하는 블로그입니다. 빠르게 변화하는 시장 환경에서 가치 있는
          정보를 선별하여 독자들에게 제공하고자 합니다.
        </Paragraph>
        <Paragraph variant="body1">
          우리는 복잡한 금융 정보를 이해하기 쉽게 전달하고, 최신 트렌드를 빠르게
          파악할 수 있도록 다양한 콘텐츠를 제공합니다. 투자와 관련된 인사이트를
          얻고 싶은 모든 분들에게 유용한 정보의 허브가 되고자 합니다.
        </Paragraph>
      </SectionPaper>

      {/* 주요 콘텐츠 섹션 */}
      <SectionPaper>
        <SectionHeader>
          <SectionIcon>
            <TrendingUpIcon />
          </SectionIcon>
          <SectionTitle variant="h5">주요 콘텐츠</SectionTitle>
        </SectionHeader>
        <StyledDivider />
        <ContentGrid>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <ContentItem>
                <ContentIconBox>
                  <TrendingUpIcon />
                </ContentIconBox>
                <div>
                  <ContentTitle variant="h6">실시간 인기 정보</ContentTitle>
                  <ContentDesc variant="body2">
                    최신 트렌드와 인기 있는 주제에 대한 심층 분석과 인사이트를
                    제공합니다. 빠르게 변화하는 시장 환경에서 중요한 정보를
                    놓치지 않도록 도와드립니다.
                  </ContentDesc>
                </div>
              </ContentItem>
            </Grid>
            <Grid item xs={12} md={6}>
              <ContentItem>
                <ContentIconBox>
                  <ShowChartIcon />
                </ContentIconBox>
                <div>
                  <ContentTitle variant="h6">주식 정보 분석</ContentTitle>
                  <ContentDesc variant="body2">
                    작성자가 선별한 주식 정보와 분석을 통해 투자 결정에 도움이
                    되는 인사이트를 제공합니다. 국내외 주요 종목에 대한 정보를
                    확인하세요.
                  </ContentDesc>
                </div>
              </ContentItem>
            </Grid>
          </Grid>
        </ContentGrid>
      </SectionPaper>

      {/* 운영 철학 섹션 */}
      <SectionPaper>
        <SectionHeader>
          <SectionIcon>
            <InfoIcon />
          </SectionIcon>
          <SectionTitle variant="h5">운영 철학</SectionTitle>
        </SectionHeader>
        <StyledDivider />
        <Paragraph variant="body1">
          우리는 정확하고 가치 있는 정보 제공을 최우선으로 합니다. 모든 콘텐츠는
          철저한 검증을 거쳐 제공되며, 독자들이 더 나은 결정을 내릴 수 있도록
          돕는 것이 목표입니다.
        </Paragraph>
        <Paragraph variant="body1">
          복잡한 정보를 단순화하고, 누구나 쉽게 이해할 수 있는 콘텐츠를 만들기
          위해 노력합니다. 독자 여러분의 소중한 피드백을 통해 더 나은 콘텐츠를
          제공하겠습니다.
        </Paragraph>
      </SectionPaper>

      {/* 푸터 섹션 */}
      <Footer>
        <FooterText variant="body2">
          © 2024 isIT Innovation. 모든 권리 보유.
        </FooterText>
      </Footer>
    </StyledContainer>
  );
};

export default About;
