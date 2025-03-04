import { createGlobalStyle } from "styled-components";
import { theme } from "./theme";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Noto Sans KR', sans-serif;
    background: linear-gradient(135deg, #0a0f29 0%, #1a1b46 50%, #0a0f29 100%);
    color: ${theme.palette.text.primary};
    position: relative;
    overflow-x: hidden;
  }

  /* 별 배경 효과 */
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(white, rgba(255,255,255,.3) 1px, transparent 3px),
      radial-gradient(white, rgba(255,255,255,.2) 1px, transparent 2px),
      radial-gradient(rgba(255,255,255,.5), rgba(255,255,255,.1) 1px, transparent 2px);
    background-size: 650px 650px, 350px 350px, 250px 250px;
    background-position: 0 0, 40px 60px, 130px 270px;
    z-index: -1;
    animation: twinkle 8s ease-in-out infinite alternate;
  }

  @keyframes twinkle {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 0.6;
    }
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
  }
`;
