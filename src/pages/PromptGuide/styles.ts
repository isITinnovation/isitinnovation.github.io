import styled from "styled-components";
import { Paper } from "@mui/material";
import { theme } from "../../styles/theme";

export const GuideSection = styled(Paper)`
  padding: 2rem;
  margin: 1rem 0;
  background-color: ${theme.palette.background.default} !important;
  border-radius: 12px;
`;

export const ExampleCard = styled(Paper)`
  padding: 1.5rem;
  margin: 1rem 0;
  background-color: ${theme.palette.background.paper} !important;
  border-radius: 8px;
  border-left: 4px solid ${theme.palette.primary.main};
`;

export const PromptBox = styled.div`
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-family: "Consolas", monospace;
  position: relative;

  &:hover {
    .copy-button {
      opacity: 1;
    }
  }
`;

export const CopyButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: ${theme.palette.primary.main};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    background-color: ${theme.palette.primary.dark};
  }
`;

export const TipBox = styled.div`
  background-color: rgba(96, 108, 56, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border: 1px solid ${theme.palette.primary.main};
`;
